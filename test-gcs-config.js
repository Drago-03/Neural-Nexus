#!/usr/bin/env node

/**
 * Test Google Cloud Storage Configuration
 * 
 * This script tests the Google Cloud Storage configuration
 * to ensure that authentication and bucket access work correctly.
 * 
 * Usage:
 *   node test-gcs-config.js
 */

const fs = require('fs');
const path = require('path');
const { Storage } = require('@google-cloud/storage');
require('dotenv').config({ path: '.env.local' });

// Function to mask sensitive information
function maskSecret(secret) {
  if (!secret) return 'not set';
  return secret.substring(0, 4) + '...' + secret.substring(secret.length - 4);
}

// Print configuration
console.log('🔧 Google Cloud Storage Configuration:');
console.log(`- Project ID: ${process.env.GOOGLE_CLOUD_PROJECT_ID || 'not set'}`);
console.log(`- Bucket: ${process.env.GOOGLE_CLOUD_STORAGE_BUCKET || 'not set'}`);
console.log(`- Access Key: ${process.env.GOOGLE_CLOUD_ACCESS_KEY ? maskSecret(process.env.GOOGLE_CLOUD_ACCESS_KEY) : 'not set'}`);
console.log(`- Secret Key: ${process.env.GOOGLE_CLOUD_SECRET_KEY ? '********' : 'not set'}`);
console.log(`- Client Email: ${process.env.GOOGLE_CLOUD_CLIENT_EMAIL || process.env.GOOGLE_CLOUD_SERVICE_ACCOUNT || 'not set'}`);
console.log(`- Credentials File: ${process.env.GOOGLE_APPLICATION_CREDENTIALS || 'not set'}`);

// Test Google Cloud Storage
async function testGCSConfig() {
  console.log('\n🧪 Testing Google Cloud Storage connection...');
  
  // Check if credentials file exists
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (credentialsPath && !fs.existsSync(credentialsPath)) {
    console.error(`❌ Credentials file not found: ${credentialsPath}`);
    process.exit(1);
  }
  
  // Create storage client
  const storage = new Storage();
  const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET;
  
  if (!bucketName) {
    console.error('❌ GOOGLE_CLOUD_STORAGE_BUCKET is required');
    process.exit(1);
  }
  
  // Test bucket access
  console.log(`\n📦 Checking bucket: ${bucketName}`);
  try {
    const [exists] = await storage.bucket(bucketName).exists();
    console.log(`✅ Bucket exists: ${exists}`);
    
    if (exists) {
      console.log('✅ Successfully accessed bucket');
    } else {
      console.log('⚠️ Bucket does not exist');
    }
  } catch (error) {
    console.error('❌ Failed to access bucket');
    console.error(error);
  }
  
  // List buckets
  console.log('\n📋 Listing available buckets:');
  try {
    const [buckets] = await storage.getBuckets();
    console.log(`✅ Found ${buckets.length} buckets`);
    
    buckets.forEach(bucket => {
      console.log(`   - ${bucket.name}`);
    });
  } catch (error) {
    console.error('❌ Failed to list buckets');
    console.error(error);
  }
  
  // Test file upload
  console.log('\n📤 Testing file upload...');
  try {
    // Create test file
    const testFilePath = path.join(process.cwd(), 'test-gcs-upload.txt');
    const testContent = `Test file created at ${new Date().toISOString()}`;
    fs.writeFileSync(testFilePath, testContent);
    
    // Upload to GCS
    const bucket = storage.bucket(bucketName);
    const destFileName = `test-uploads/test-${Date.now()}.txt`;
    
    await bucket.upload(testFilePath, {
      destination: destFileName,
      metadata: {
        contentType: 'text/plain'
      }
    });
    
    console.log(`✅ Successfully uploaded file to gs://${bucketName}/${destFileName}`);
    
    // Check if file exists
    const [exists] = await bucket.file(destFileName).exists();
    console.log(`✅ File exists in bucket: ${exists}`);
    
    // Download file to verify content
    const [downloadedContent] = await bucket.file(destFileName).download();
    const downloadedText = downloadedContent.toString();
    
    if (downloadedText === testContent) {
      console.log('✅ Downloaded content matches original');
    } else {
      console.error('❌ Downloaded content does not match original');
      console.log(`Original: ${testContent}`);
      console.log(`Downloaded: ${downloadedText}`);
    }
    
    // Delete test file from GCS
    await bucket.file(destFileName).delete();
    console.log('✅ Successfully deleted test file from bucket');
    
    // Delete local test file
    fs.unlinkSync(testFilePath);
    console.log('✅ Deleted local test file');
    
  } catch (error) {
    console.error('❌ Failed to test file upload');
    console.error(error);
  }
  
  console.log('\n🎉 Google Cloud Storage configuration test completed');
}

// Run the tests
testGCSConfig().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
}); 