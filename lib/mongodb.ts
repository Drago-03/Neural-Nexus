import { MongoClient, ServerApiVersion, Db, Collection, Document, MongoClientOptions } from 'mongodb';

// Get MongoDB connection URI from environment variables
// NEVER hardcode database credentials in your code
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'neural_nexus';

// MongoDB client options optimized for serverless environments
const options: MongoClientOptions = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  maxPoolSize: 10,          // Limit connections for serverless
  minPoolSize: 0,           // Allow pool to shrink to zero in serverless
  maxIdleTimeMS: 45000,     // Close idle connections after 45 seconds
  connectTimeoutMS: 10000,  // Timeout if connection takes too long
  socketTimeoutMS: 30000,   // Timeout for operations
  retryWrites: true,        // Auto-retry writes if they fail
  retryReads: true,         // Auto-retry reads if they fail
  w: 'majority' as const,   // Wait for writes to replicate to majority
};

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
  const now = Date.now();
  
  // If we're already in the process of connecting, return the promise
  if (globalWithMongo.mongoConnection.isConnecting && globalWithMongo.mongoConnection.promise) {
    return globalWithMongo.mongoConnection.promise;
  }
  
  // If we have a cached client, check if it's still valid
  if (globalWithMongo.mongoConnection.client) {
    try {
      // Check if the connection is still alive with a ping
      // Only ping if it's been more than 10 seconds since the last connection
      if (now - globalWithMongo.mongoConnection.lastConnectionTime > 10000) {
        await globalWithMongo.mongoConnection.client.db("admin").command({ ping: 1 });
      }
      
      // Return the cached connection
      return { 
        client: globalWithMongo.mongoConnection.client, 
        db: globalWithMongo.mongoConnection.client.db(dbName) 
      };
    } catch (error) {
      console.log("🔄 Cached MongoDB connection is stale, reconnecting...");
      // If ping fails, the connection is dead and we need to reconnect
      globalWithMongo.mongoConnection.client = null;
    }
  }

  // Validate that we have a URI before proceeding
  if (!uri) {
    console.error("⚠️ No MongoDB URI provided. Please set MONGODB_URI environment variable.");
    throw new Error("MongoDB URI is not configured");
  }

  // Mark that we're connecting
  globalWithMongo.mongoConnection.isConnecting = true;
  
  // Create a connection promise
  globalWithMongo.mongoConnection.promise = new Promise(async (resolve, reject) => {
    try {
      // Create a new MongoClient
      const client = new MongoClient(uri, options);
      
      // Connect to the MongoDB server with retry logic
      let retries = 3;
      let connected = false;
      
      while (!connected && retries > 0) {
        try {
          await client.connect();
          connected = true;
        } catch (connectError) {
          retries--;
          if (retries === 0) throw connectError;
          console.log(`Connection attempt failed, retrying... (${retries} attempts left)`);
          await new Promise(r => setTimeout(r, 1000)); // Wait 1s before retrying
        }
      }
      
      // Ping the database to confirm connection
      await client.db("admin").command({ ping: 1 });
      console.log("🚀 Successfully connected to MongoDB!");
      
      // Get the database
      const db = client.db(dbName);
      console.log(`✅ Connection successful to database: ${dbName}`);
      
      // Cache the client
      globalWithMongo.mongoConnection.client = client;
      globalWithMongo.mongoConnection.lastConnectionTime = Date.now();
      
      // Set up event handlers for monitoring the connection
      client.on('serverClosed', () => {
        console.log('MongoDB server connection closed');
        globalWithMongo.mongoConnection.client = null;
      });
      
      client.on('error', (err) => {
        console.error('MongoDB connection error:', err);
        // Don't set client to null here to allow for auto-reconnect
      });
      
      // Resolve with the client and db
      resolve({ client, db });
    } catch (error) {
      console.error("❌ Connection failed:", error);
      globalWithMongo.mongoConnection.client = null;
      reject(new Error(`Failed to connect to the database: ${error instanceof Error ? error.message : 'Unknown error'}`));
    } finally {
      globalWithMongo.mongoConnection.isConnecting = false;
      globalWithMongo.mongoConnection.promise = null;
    }
  });
  
  return globalWithMongo.mongoConnection.promise;
}

/**
 * Helper function to get a collection from the database
 * @param collectionName Name of the collection to get
 */
export async function getCollection<T extends Document = Document>(collectionName: string): Promise<Collection<T>> {
  const { db } = await connectToDatabase();
  return db.collection<T>(collectionName);
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
  if (globalWithMongo.mongoConnection.client) {
    await globalWithMongo.mongoConnection.client.close();
    globalWithMongo.mongoConnection.client = null;
    console.log("MongoDB connection closed");
  }
} 