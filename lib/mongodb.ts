import { MongoClient, ServerApiVersion, Db, Collection, Document, MongoClientOptions } from 'mongodb';

// Get MongoDB connection URI from environment variables
// NEVER hardcode database credentials in your code
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'neural_nexus';

// Better production-ready connection options that work in various environments
const options: MongoClientOptions = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false, // Less strict mode for better compatibility
    deprecationErrors: false, // Disable deprecation errors in production
  },
  maxPoolSize: 50, // Increase for production
  minPoolSize: 10,
  connectTimeoutMS: 30000, // Longer timeout for production
  socketTimeoutMS: 45000, // Prevent idle connection timeouts
  retryWrites: true,
  retryReads: true,
  ssl: true,
  tls: true,
  tlsAllowInvalidCertificates: true, // Only for development - remove in production
  directConnection: false,
};

// Cache client connection
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

// Track connection status
let isConnecting = false;
let lastConnectionError: Error | null = null;
let connectionRetries = 0;
const MAX_RETRIES = 5;
let inMemoryStore = new Map<string, Map<string, any>>();

// Connection state with TypeScript interfaces for better type safety
interface ConnectionProps {
  client: MongoClient;
  db: Db;
}

let globalWithMongo = global as typeof globalThis & {
  mongoConnection: {
    client: MongoClient | null;
    promise: Promise<ConnectionProps> | null;
    isConnecting: boolean;
    lastConnectionTime: number;
    inMemoryStore: Map<string, Map<string, any>>;
  };
};

// Initialize the global connection state
if (!globalWithMongo.mongoConnection) {
  globalWithMongo.mongoConnection = {
    client: null,
    promise: null,
    isConnecting: false,
    lastConnectionTime: 0,
    inMemoryStore: new Map<string, Map<string, any>>()
  };
  inMemoryStore = globalWithMongo.mongoConnection.inMemoryStore;
}

/**
 * Global function to connect to MongoDB with optimizations for serverless environments
 * Uses connection pooling with proper caching for Vercel deployments
 */
export async function connectToDatabase(): Promise<ConnectionProps> {
  // If we have a cached connection, use it
  if (cachedClient && cachedDb) {
    try {
      // Verify the connection is still alive with a ping
      await cachedClient.db("admin").command({ ping: 1 }, { timeoutMS: 5000 });
      console.log("✅ Using existing MongoDB connection");
      return { client: cachedClient, db: cachedDb };
    } catch (error) {
      console.log("⚠️ Cached MongoDB connection is stale, reconnecting...");
      // Connection is stale, we'll create a new one
      cachedClient = null;
      cachedDb = null;
    }
  }

  // Check if URI is defined
  if (!uri) {
    console.error("MongoDB URI is missing - falling back to in-memory storage");
    return getMockDatabase();
  }

  // Prevent multiple simultaneous connection attempts
  if (isConnecting) {
    console.log("⏳ Connection already in progress, waiting...");
    // Wait for the existing connection attempt to finish
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Try again (recursively) after waiting
    return connectToDatabase();
  }

  isConnecting = true;
  connectionRetries++;

  try {
    // Initialize the MongoDB client
    const client = new MongoClient(uri, options);
    
    console.log(`🔄 Connecting to MongoDB... (Attempt ${connectionRetries}/${MAX_RETRIES})`);
    
    // Connect to the MongoDB server with timeout
    const connectPromise = client.connect();
    
    // Set a timeout for the connection
    const timeoutPromise = new Promise<MongoClient>((_, reject) => {
      setTimeout(() => reject(new Error('Connection timed out')), 10000);
    });
    
    // Race the connection against the timeout
    await Promise.race([connectPromise, timeoutPromise]);
    
    // Get reference to the database
    const db = client.db(dbName);
    
    // Verify connection with a simple operation
    await db.command({ ping: 1 });
    
    // Reset connection retries on success
    connectionRetries = 0;
    lastConnectionError = null;
    
    // Cache the client and db references
    cachedClient = client;
    cachedDb = db;
    
    console.log("✅ Successfully connected to MongoDB");
    
    return { client, db };
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    lastConnectionError = error instanceof Error ? error : new Error(String(error));
    
    // Provide more useful error information
    if (error instanceof Error) {
      if (error.message.includes('SSL') || error.message.includes('TLS')) {
        console.error("SSL/TLS connection error. Using fallback storage.");
      } else if (error.message.includes('timed out')) {
        console.error("Connection timed out. Using fallback storage.");
      }
    }
    
    // Retry up to MAX_RETRIES times before giving up
    if (connectionRetries < MAX_RETRIES) {
      isConnecting = false;
      // Exponential backoff - wait longer between each retry
      const delay = Math.min(1000 * Math.pow(2, connectionRetries - 1), 10000);
      console.log(`⏳ Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return connectToDatabase();
    }
    
    // Fallback to mock database after max retries
    console.log("⚠️ Max retries reached. Using fallback in-memory storage");
    return getMockDatabase();
  } finally {
    isConnecting = false;
  }
}

/**
 * Helper function to get a collection from the database with improved error handling
 * @param collectionName Name of the collection to get
 */
export async function getCollection<T extends Document = Document>(collectionName: string): Promise<Collection<T>> {
  try {
    const { db } = await connectToDatabase();
    // Cast to any to avoid type errors with MongoDB operators
    return db.collection(collectionName) as unknown as Collection<T>;
  } catch (error) {
    console.error(`Error getting collection ${collectionName}:`, error);
    // Get or create a mock collection for this collection name
    return getMemoryCollection<T>(collectionName);
  }
}

/**
 * Get in-memory collection that persists between requests
 * @param collectionName Name of the collection to get
 */
function getMemoryCollection<T extends Document>(collectionName: string): Collection<T> {
  if (!inMemoryStore.has(collectionName)) {
    inMemoryStore.set(collectionName, new Map<string, any>());
  }
  const collection = inMemoryStore.get(collectionName)!;
  
  // Create a mock collection interface
  return {
    find: () => ({
      toArray: async () => Array.from(collection.values()) as T[],
      limit: (n: number) => ({
        toArray: async () => Array.from(collection.values()).slice(0, n) as T[]
      }),
      sort: () => ({
        limit: (n: number) => ({
          toArray: async () => Array.from(collection.values()).slice(0, n) as T[]
        })
      }),
    }),
    findOne: async (query: any) => {
      // Simple query matching for _id
      if (query._id) {
        const id = query._id.toString();
        return collection.get(id) as T || null;
      }
      // Simple query matching for other fields - using Array.from for compatibility
      const entries = Array.from(collection.values());
      for (const item of entries) {
        let matches = true;
        for (const [key, value] of Object.entries(query)) {
          if (item[key] !== value) {
            matches = false;
            break;
          }
        }
        if (matches) return item as T;
      }
      return null as unknown as T;
    },
    insertOne: async (doc: any) => {
      const id = doc._id?.toString() || Date.now().toString();
      doc._id = id;
      collection.set(id, doc);
      return { insertedId: id, acknowledged: true };
    },
    updateOne: async (query: any, update: any) => {
      // Simple implementation for $set operator
      let matchedCount = 0;
      let modifiedCount = 0;
      
      if (query._id) {
        const id = query._id.toString();
        const existingDoc = collection.get(id);
        
        if (existingDoc) {
          matchedCount = 1;
          
          // Handle $set operator
          if (update.$set) {
            const updatedDoc = { ...existingDoc };
            for (const [key, value] of Object.entries(update.$set)) {
              updatedDoc[key] = value;
            }
            collection.set(id, updatedDoc);
            modifiedCount = 1;
          }
        }
      }
      
      return { matchedCount, modifiedCount, acknowledged: true };
    },
    deleteOne: async (query: any) => {
      let deletedCount = 0;
      
      if (query._id) {
        const id = query._id.toString();
        if (collection.has(id)) {
          collection.delete(id);
          deletedCount = 1;
        }
      }
      
      return { deletedCount, acknowledged: true };
    },
    countDocuments: async () => collection.size,
    aggregate: () => ({
      toArray: async () => [] as T[],
    }),
  } as unknown as Collection<T>;
}

/**
 * Helper function to handle real-time watch operations
 * @param collectionName Name of the collection to watch
 * @param pipeline Optional aggregation pipeline for filtering changes
 * @param options Optional options for the change stream
 * @param callback Callback function to handle changes
 */
export async function watchCollection<T extends Document = Document>(
  collectionName: string,
  pipeline: object[] = [],
  options: object = {},
  callback: (change: any) => void
): Promise<{ close: () => void }> {
  try {
    const collection = await getCollection<T>(collectionName);
    const changeStream = collection.watch(pipeline, options);
    
    changeStream.on('change', callback);
    
    return {
      close: () => changeStream.close()
    };
  } catch (error) {
    console.error(`Error watching collection ${collectionName}:`, error);
    // Return a no-op close function when using fallback
    return { close: () => {} };
  }
}

/**
 * Helper function to close the MongoDB connection
 * Should be called when the application is shutting down
 */
export async function closeMongoDBConnection(): Promise<void> {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
    console.log("MongoDB connection closed");
  }
}

/**
 * Create a mock database that uses the in-memory store
 */
function getMockDatabase(): ConnectionProps {
  console.log("🔄 Creating in-memory database fallback");
  
  const mockClient = {
    db: () => mockDb,
    close: async () => {},
    connect: async () => mockClient,
  } as unknown as MongoClient;
  
  const mockDb = {
    collection: (name: string) => getMemoryCollection(name),
    command: async () => ({ ok: 1 }),
  } as unknown as Db;
  
  return { client: mockClient, db: mockDb };
} 