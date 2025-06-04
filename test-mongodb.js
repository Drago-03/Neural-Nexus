// yooo this is a lit script to check if MongoDB is vibin'
require('dotenv').config({ path: './.env.local' });
const { MongoClient } = require('mongodb');

// grab the MongoDB connection URI from the env vars
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'neural_nexus';

if (!uri) {
  console.error('🚫 No MONGODB_URI found in .env.local - fix that ASAP!');
  process.exit(1);
}

console.log(`🔍 Checking MongoDB connection to database: ${dbName}`);
console.log(`🔗 URI format: ${uri.substring(0, 20)}...`);

// Break down the URI to check for obvious issues
try {
  const uriParts = new URL(uri);
  console.log(`✓ Protocol: ${uriParts.protocol}`);
  console.log(`✓ Host: ${uriParts.hostname}`);
  console.log(`✓ Username: ${uriParts.username ? '✓ Present' : '❌ Missing'}`);
  console.log(`✓ Password: ${uriParts.password ? '✓ Present' : '❌ Missing'}`);
} catch (err) {
  console.error('❌ Invalid URI format:', err.message);
}

async function testConnection() {
  // Use updated connection options matching lib/mongodb.ts
  const client = new MongoClient(uri, {
    ssl: true,
    tls: true,
    tlsAllowInvalidCertificates: true,
    directConnection: false,
    retryWrites: true,
    retryReads: true,
    maxPoolSize: 10,
    minPoolSize: 5,
    connectTimeoutMS: 30000,
    socketTimeoutMS: 45000
  });

  try {
    console.log('🔄 Trying to connect...');
    await client.connect();
    console.log('✅ Connected to MongoDB!');

    // check if the database exists
    const db = client.db(dbName);
    
    // try listing collections
    console.log('🔍 Checking collections:');
    const collections = await db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('⚠️ No collections found in this database!');
    } else {
      console.log('📋 Collections found:');
      collections.forEach(collection => {
        console.log(` - ${collection.name}`);
      });
      
      // check users collection specifically
      const usersCollection = collections.find(c => c.name === 'users');
      if (usersCollection) {
        console.log('🧑‍🤝‍🧑 Users collection exists - checking documents:');
        const userCount = await db.collection('users').countDocuments();
        console.log(`   Found ${userCount} user documents`);
        
        // sample a user
        if (userCount > 0) {
          const sampleUser = await db.collection('users').findOne({}, { projection: { _id: 1, email: 1 }});
          console.log(`   Sample user ID: ${sampleUser._id} (${sampleUser.email || 'no email'})`);
        }
      } else {
        console.log('⚠️ Users collection not found!');
      }
    }
  } catch (error) {
    console.error('❌ MongoDB connection failed!');
    console.error(error);
  } finally {
    await client.close();
    console.log('👋 MongoDB connection closed');
  }
}

testConnection().catch(console.error); 