import { MongoClient, ServerApiVersion, Db, Collection, Document, MongoClientOptions } from 'mongodb';

// Get MongoDB connection URI from environment variables
// NEVER hardcode database credentials in your code
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'neural_nexus';

// Connection options with proper SSL settings
const options: MongoClientOptions = {
  ssl: true,
  tls: true,
  tlsAllowInvalidCertificates: false,
  tlsAllowInvalidHostnames: false,
  serverSelectionTimeoutMS: 5000,
  maxPoolSize: 10,
  minPoolSize: 5,
  maxIdleTimeMS: 30000,
  connectTimeoutMS: 10000,
};

// Cache client connection
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

// Track connection status
let isConnecting = false;

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
  };
};

// Initialize the global connection state
if (!globalWithMongo.mongoConnection) {
  globalWithMongo.mongoConnection = {
    client: null,
    promise: null,
    isConnecting: false,
    lastConnectionTime: 0
  };
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
      await cachedClient.db("admin").command({ ping: 1 });
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
    throw new Error('MongoDB URI is not defined');
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

  try {
    // Initialize the MongoDB client
    const client = new MongoClient(uri, options);
    
    console.log("🔄 Connecting to MongoDB...");
    
    // Connect to the MongoDB server
    await client.connect();
    
    // Get reference to the database
    const db = client.db(dbName);
    
    // Cache the client and db references
    cachedClient = client;
    cachedDb = db;
    
    console.log("✅ Successfully connected to MongoDB");
    
    return { client, db };
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    
    // Provide more useful error information
    if (error instanceof Error) {
      if (error.message.includes('SSL')) {
        console.error("SSL/TLS connection error. Please check your MongoDB connection string and SSL settings.");
      } else if (error.message.includes('timed out')) {
        console.error("Connection timed out. Please check your network or MongoDB Atlas status.");
      }
    }
    
    // Fallback to mock database for development/build purposes
    console.log("⚠️ Using fallback mock database for build process");
    return getMockDatabase();
  } finally {
    isConnecting = false;
  }
}

/**
 * Helper function to get a collection from the database
 * @param collectionName Name of the collection to get
 */
export async function getCollection<T extends Document = Document>(collectionName: string): Promise<Collection<T>> {
  try {
    const { db } = await connectToDatabase();
    return db.collection<T>(collectionName);
  } catch (error) {
    console.error(`Error getting collection ${collectionName}:`, error);
    // Return a mock collection that won't break builds
    return getMockCollection<T>(collectionName);
  }
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
  const collection = await getCollection<T>(collectionName);
  const changeStream = collection.watch(pipeline, options);
  
  changeStream.on('change', callback);
  
  return {
    close: () => changeStream.close()
  };
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
 * Create a mock database for build process
 * This prevents build failures when MongoDB is unavailable
 */
function getMockDatabase(): ConnectionProps {
  console.log("🔄 Creating mock database for build process");
  
  const mockClient = {
    db: () => mockDb,
    close: async () => {},
  } as unknown as MongoClient;
  
  const mockDb = {
    collection: () => getMockCollection("mock"),
    command: async () => ({ ok: 1 }),
  } as unknown as Db;
  
  return { client: mockClient, db: mockDb };
}

/**
 * Create a mock collection for build process
 */
function getMockCollection<T extends Document>(name: string): Collection<T> {
  // Instead of silently returning empty data, throw an error in non-build environments
  if (process.env.NEXT_PHASE !== 'phase-production-build') {
    throw new Error(`Failed to connect to MongoDB collection: ${name}. Real data connection required.`);
  }
  
  return {
    find: () => ({
      toArray: async () => [] as T[],
      limit: () => ({ toArray: async () => [] as T[] }),
      sort: () => ({ limit: () => ({ toArray: async () => [] as T[] }) }),
    }),
    findOne: async () => null as unknown as T,
    insertOne: async () => ({ insertedId: "mock-id", acknowledged: true }),
    insertMany: async () => ({ insertedIds: ["mock-id"], acknowledged: true }),
    updateOne: async () => ({ modifiedCount: 0, acknowledged: true }),
    deleteOne: async () => ({ deletedCount: 0, acknowledged: true }),
    countDocuments: async () => 0,
    aggregate: () => ({
      toArray: async () => [] as T[],
    }),
  } as unknown as Collection<T>;
} 