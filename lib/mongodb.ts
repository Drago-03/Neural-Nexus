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
  // If connection already exists, reuse it
  if (globalWithMongo.mongoConnection.client) {
    try {
      // Check if the connection is still alive with a ping
      await globalWithMongo.mongoConnection.client.db("admin").command({ ping: 1 });
      console.log('👌 Using existing MongoDB connection');
      return {
        client: globalWithMongo.mongoConnection.client,
        db: globalWithMongo.mongoConnection.client.db(dbName),
      };
    } catch (error) {
      console.log('🔄 Existing MongoDB connection is stale, reconnecting...');
      // If ping fails, we'll try to reconnect
    }
  }

  // Check for MongoDB URI
  const MONGODB_URI = process.env.MONGODB_URI;
  
  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }

  // Enable retry logic for connection
  const maxRetries = 3;
  let retryCount = 0;
  let lastError: Error | null = null;

  while (retryCount < maxRetries) {
    try {
      console.log(`🔄 Connecting to MongoDB (attempt ${retryCount + 1}/${maxRetries})...`);

      // Connect to MongoDB with optimized options for serverless environments
      const client = new MongoClient(MONGODB_URI, {
        serverApi: {
          version: '1',
          // Remove apiStrict to allow all operations
          strict: false,
          deprecationErrors: true,
        },
        maxPoolSize: 10, // Reduce from default 100 for serverless
        minPoolSize: 0,   // Start with no connections for serverless
        socketTimeoutMS: 30000, // Increase from default for long-running operations
        connectTimeoutMS: 10000, // Longer connect timeout
        retryWrites: true,
        retryReads: true,
        maxIdleTimeMS: 45000, // Close idle connections after 45 seconds
      });

      // Connect to the client
      await client.connect();
      console.log('🚀 Successfully connected to MongoDB!');

      // Get the database
      const dbName = process.env.MONGODB_DB || 'neural_nexus';
      const db = client.db(dbName);
      console.log(`✅ Connection successful to database: ${dbName}`);

      // Save the connection
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
      
      // Return the connection
      return {
        client,
        db,
      };
    } catch (error) {
      retryCount++;
      lastError = error as Error;
      console.error(`❌ MongoDB connection attempt ${retryCount} failed:`, error);
      
      if (retryCount < maxRetries) {
        // Exponential backoff: wait longer between each retry
        const backoffTime = Math.pow(2, retryCount) * 500; // 1s, 2s, 4s, ...
        console.log(`⏳ Retrying in ${backoffTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
      }
    }
  }

  // If we get here, all retries failed
  console.error('❌ Failed to connect to MongoDB after multiple retries');
  throw lastError || new Error('Failed to connect to MongoDB after multiple retries');
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