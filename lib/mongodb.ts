import { MongoClient, ServerApiVersion } from 'mongodb';

// MongoDB connection string with password placeholder replaced
const uri = process.env.MONGODB_URI || "mongodb+srv://mantejarora:meuralnexus123@nn-1.udkm2r9.mongodb.net/?retryWrites=true&w=majority&appName=NN-1";

// MongoDB client options
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
};

// Cache the MongoDB connection to reuse it across requests
let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

/**
 * Global function to connect to MongoDB and cache the client
 * Uses connection pooling to efficiently manage connections
 */
export async function connectToDatabase() {
  // If we already have a cached client and database, use them
  if (cachedClient && cachedDb) {
    console.log("🔥 Using cached MongoDB connection");
    return { client: cachedClient, db: cachedDb };
  }

  // If no connection exists, create a new one
  try {
    // Create a new MongoClient
    const client = new MongoClient(uri, options);
    
    // Connect to the MongoDB server
    await client.connect();
    
    // Ping the database to confirm connection
    await client.db("admin").command({ ping: 1 });
    console.log("🚀 Successfully connected to MongoDB!");
    
    // Get the database
    const db = client.db("neural_nexus");
    
    // Cache the client and db connections
    cachedClient = client;
    cachedDb = db;
    
    return { client, db };
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw new Error("Failed to connect to the database");
  }
}

/**
 * Helper function to get a collection from the database
 * @param collectionName Name of the collection to get
 */
export async function getCollection(collectionName: string) {
  const { db } = await connectToDatabase();
  return db.collection(collectionName);
}

/**
 * Helper function to close the MongoDB connection
 * Should be called when the application is shutting down
 */
export async function closeMongoDBConnection() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
    console.log("MongoDB connection closed");
  }
} 