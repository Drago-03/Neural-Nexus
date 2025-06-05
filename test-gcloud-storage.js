// Test script for Google Cloud Storage integration
require('dotenv').config({ path: './.env.local' });
const fs = require('fs');
const path = require('path');

// Log environment variables (redacted for security)
console.log('Environment Check:');
console.log('GOOGLE_CLOUD_PROJECT_ID:', process.env.GOOGLE_CLOUD_PROJECT_ID ? '✓ Found' : '❌ Missing');
console.log('GOOGLE_CLOUD_STORAGE_BUCKET:', process.env.GOOGLE_CLOUD_STORAGE_BUCKET ? '✓ Found' : '❌ Missing');
console.log('GOOGLE_CLOUD_CLIENT_EMAIL:', process.env.GOOGLE_CLOUD_CLIENT_EMAIL ? '✓ Found' : '❌ Missing');
console.log('GOOGLE_CLOUD_ACCESS_KEY:', process.env.GOOGLE_CLOUD_ACCESS_KEY ? '✓ Found' : '❌ Missing');
console.log('GOOGLE_CLOUD_SECRET_KEY:', process.env.GOOGLE_CLOUD_SECRET_KEY ? '✓ Found' : '❌ Missing');
console.log('GOOGLE_CLOUD_PRIVATE_KEY:', process.env.GOOGLE_CLOUD_PRIVATE_KEY ? '✓ Found' : '❌ Missing');

// Helper for colorized output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Import the Storage class
async function testGoogleCloudStorage() {
  try {
    console.log('\n🔍 Testing Google Cloud Storage integration...');
    
    // Import the storage module
    const { Storage } = require('@google-cloud/storage');
    console.log(`${colors.green}✓${colors.reset} Successfully imported @google-cloud/storage`);
    
    // Create configuration
    const config = {
      googleCloud: {
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'gleaming-scene-462006-m9',
        storageBucket: process.env.GOOGLE_CLOUD_STORAGE_BUCKET || 'neural-nexus-app',
        clientEmail: process.env.GOOGLE_CLOUD_CLIENT_EMAIL || 'neural-nexus@gleaming-scene-462006-m9.iam.gserviceaccount.com',
        accessKey: process.env.GOOGLE_CLOUD_ACCESS_KEY || '',
        secretKey: process.env.GOOGLE_CLOUD_SECRET_KEY || '',
        privateKey: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
      }
    };
    
    // Initialize Storage client with credentials
    let storage;
    const isProduction = process.env.NODE_ENV === 'production';
    
    try {
      const storageOptions = {
        projectId: config.googleCloud.projectId,
        credentials: {
          client_email: config.googleCloud.clientEmail,
          private_key: config.googleCloud.privateKey,
        }
      };
      
      // For development, use access key/secret key if available
      if (!isProduction && config.googleCloud.accessKey && config.googleCloud.secretKey) {
        console.log(`${colors.blue}ℹ${colors.reset} Using access key/secret key for GCS authentication`);
        storage = new Storage({
          projectId: config.googleCloud.projectId,
          credentials: {
            client_email: config.googleCloud.clientEmail,
            client_id: config.googleCloud.accessKey,
            private_key: config.googleCloud.secretKey,
          }
        });
      } else {
        console.log(`${colors.blue}ℹ${colors.reset} Using private key for GCS authentication`);
        storage = new Storage(storageOptions);
      }
      
      console.log(`${colors.green}✓${colors.reset} Successfully initialized Storage client`);
    } catch (initError) {
      console.error(`${colors.red}❌${colors.reset} Failed to initialize Storage client:`, initError);
      return;
    }
    
    // Test bucket access
    const bucketName = config.googleCloud.storageBucket;
    console.log(`${colors.blue}ℹ${colors.reset} Testing access to bucket: ${bucketName}`);
    
    try {
      // Try to get bucket
      const [buckets] = await storage.getBuckets();
      console.log(`${colors.green}✓${colors.reset} Successfully listed buckets:`, buckets.map(b => b.name).join(', '));
      
      const bucketExists = buckets.some((bucket) => bucket.name === bucketName);
      
      if (bucketExists) {
        console.log(`${colors.green}✓${colors.reset} Bucket '${bucketName}' exists`);
      } else {
        console.log(`${colors.yellow}⚠${colors.reset} Bucket '${bucketName}' does not exist, will attempt to create it`);
        
        try {
          await storage.createBucket(bucketName);
          console.log(`${colors.green}✓${colors.reset} Created bucket: ${bucketName}`);
        } catch (createError) {
          console.error(`${colors.red}❌${colors.reset} Failed to create bucket:`, createError);
        }
      }
      
      // Test file upload
      const testFilePath = 'test-uploads/test-file.txt';
      const testContent = 'This is a test file for Neural Nexus Google Cloud Storage integration.';
      
      console.log(`${colors.blue}ℹ${colors.reset} Testing file upload to path: ${testFilePath}`);
      
      const bucket = storage.bucket(bucketName);
      const file = bucket.file(testFilePath);
      
      await file.save(testContent, {
        contentType: 'text/plain',
        metadata: {
          contentType: 'text/plain',
        }
      });
      
      console.log(`${colors.green}✓${colors.reset} Successfully uploaded test file`);
      
      // Make the file public and get URL
      await file.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${testFilePath}`;
      console.log(`${colors.green}✓${colors.reset} File is publicly accessible at: ${publicUrl}`);
      
      // Clean up test file
      await file.delete();
      console.log(`${colors.green}✓${colors.reset} Successfully deleted test file`);
      
      console.log(`\n${colors.green}✅ Google Cloud Storage integration test successful!${colors.reset}`);
    } catch (error) {
      console.error(`${colors.red}❌${colors.reset} Error testing Google Cloud Storage:`, error);
    }
  } catch (moduleError) {
    console.error(`${colors.red}❌${colors.reset} Failed to import or test Google Cloud Storage:`, moduleError);
  }
}

// Run the test
testGoogleCloudStorage().catch(error => {
  console.error('Unhandled error in test script:', error);
}); 