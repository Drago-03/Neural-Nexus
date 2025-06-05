#!/usr/bin/env node

/**
 * Test Direct Google Cloud Storage Implementation
 * 
 * This script tests the direct Google Cloud Storage implementation
 * that uses HMAC keys with the REST API instead of the SDK.
 * 
 * Usage:
 *   node scripts/test-direct-gcs.js
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Import required modules
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const axios = require('axios');

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

// Variables
const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET;
const accessKey = process.env.GOOGLE_CLOUD_ACCESS_KEY;
const secretKey = process.env.GOOGLE_CLOUD_SECRET_KEY;

// Create an AWS-style signature for GCS
function createSignature(method, contentMD5, contentType, date, resource) {
  if (!secretKey) return '';
  
  const stringToSign = `${method}\n${contentMD5}\n${contentType}\n${date}\n${resource}`;
  
  return crypto
    .createHmac('sha1', secretKey)
    .update(stringToSign)
    .digest('base64');
}

// Test if a bucket exists
async function testBucketExists(bucket) {
  try {
    if (!accessKey || !secretKey) return false;
    
    const date = new Date().toUTCString();
    const method = 'HEAD';
    const resource = `/${bucket}`;
    
    const signature = createSignature(method, '', 'application/json', date, resource);
    
    console.log(`🔍 Testing bucket existence: ${bucket}`);
    console.log(`- URL: https://storage.googleapis.com${resource}`);
    console.log(`- Method: ${method}`);
    console.log(`- Date: ${date}`);
    console.log(`- Authorization: AWS ${accessKey}:${signature}`);
    
    const response = await axios({
      method,
      url: `https://storage.googleapis.com${resource}`,
      headers: {
        'Date': date,
        'Authorization': `AWS ${accessKey}:${signature}`,
      },
      validateStatus: (status) => status < 500, // Accept 404 as valid response
    });
    
    console.log(`- Response status: ${response.status}`);
    return response.status === 200;
  } catch (error) {
    console.error('❌ Error checking bucket existence:', error.message);
    if (error.response) {
      console.error('- Status:', error.response.status);
      console.error('- Headers:', JSON.stringify(error.response.headers, null, 2));
      console.error('- Data:', error.response.data);
    }
    return false;
  }
}

// Upload a test file
async function uploadTestFile(bucket, filePath, content, contentType) {
  try {
    if (!accessKey || !secretKey) return false;
    
    const contentBuffer = Buffer.isBuffer(content) ? content : Buffer.from(content);
    const contentMD5 = crypto
      .createHash('md5')
      .update(contentBuffer)
      .digest('base64');
    
    const date = new Date().toUTCString();
    const method = 'PUT';
    const resource = `/${bucket}${filePath}`;
    
    const signature = createSignature(method, contentMD5, contentType, date, resource);
    
    console.log(`📤 Uploading file: ${filePath}`);
    console.log(`- URL: https://storage.googleapis.com${resource}`);
    console.log(`- Method: ${method}`);
    console.log(`- Content-Type: ${contentType}`);
    console.log(`- Content-MD5: ${contentMD5}`);
    console.log(`- Date: ${date}`);
    console.log(`- Authorization: AWS ${accessKey}:${signature}`);
    
    const response = await axios({
      method,
      url: `https://storage.googleapis.com${resource}`,
      headers: {
        'Content-Type': contentType,
        'Content-MD5': contentMD5,
        'Date': date,
        'Authorization': `AWS ${accessKey}:${signature}`,
      },
      data: contentBuffer,
      validateStatus: (status) => status < 500, // Accept 404 as valid response
    });
    
    console.log(`- Response status: ${response.status}`);
    return response.status === 200;
  } catch (error) {
    console.error('❌ Error uploading file:', error.message);
    if (error.response) {
      console.error('- Status:', error.response.status);
      console.error('- Headers:', JSON.stringify(error.response.headers, null, 2));
      console.error('- Data:', error.response.data);
    }
    return false;
  }
}

// Get a file
async function getFile(bucket, filePath) {
  try {
    if (!accessKey || !secretKey) return null;
    
    const date = new Date().toUTCString();
    const method = 'GET';
    const resource = `/${bucket}${filePath}`;
    
    const signature = createSignature(method, '', '', date, resource);
    
    console.log(`📥 Getting file: ${filePath}`);
    console.log(`- URL: https://storage.googleapis.com${resource}`);
    console.log(`- Method: ${method}`);
    console.log(`- Date: ${date}`);
    console.log(`- Authorization: AWS ${accessKey}:${signature}`);
    
    const response = await axios({
      method,
      url: `https://storage.googleapis.com${resource}`,
      headers: {
        'Date': date,
        'Authorization': `AWS ${accessKey}:${signature}`,
      },
      validateStatus: (status) => status < 500, // Accept 404 as valid response
      responseType: 'arraybuffer'
    });
    
    console.log(`- Response status: ${response.status}`);
    
    if (response.status === 200) {
      return {
        content: response.data,
        contentType: response.headers['content-type']
      };
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error getting file:', error.message);
    if (error.response) {
      console.error('- Status:', error.response.status);
      console.error('- Headers:', JSON.stringify(error.response.headers, null, 2));
    }
    return null;
  }
}

// Delete a file
async function deleteFile(bucket, filePath) {
  try {
    if (!accessKey || !secretKey) return false;
    
    const date = new Date().toUTCString();
    const method = 'DELETE';
    const resource = `/${bucket}${filePath}`;
    
    const signature = createSignature(method, '', '', date, resource);
    
    console.log(`🗑️ Deleting file: ${filePath}`);
    console.log(`- URL: https://storage.googleapis.com${resource}`);
    console.log(`- Method: ${method}`);
    console.log(`- Date: ${date}`);
    console.log(`- Authorization: AWS ${accessKey}:${signature}`);
    
    const response = await axios({
      method,
      url: `https://storage.googleapis.com${resource}`,
      headers: {
        'Date': date,
        'Authorization': `AWS ${accessKey}:${signature}`,
      },
      validateStatus: (status) => status < 500, // Accept 404 as valid response
    });
    
    console.log(`- Response status: ${response.status}`);
    return response.status === 204 || response.status === 200;
  } catch (error) {
    console.error('❌ Error deleting file:', error.message);
    if (error.response) {
      console.error('- Status:', error.response.status);
      console.error('- Headers:', JSON.stringify(error.response.headers, null, 2));
    }
    return false;
  }
}

// Main test function
async function runTests() {
  console.log('\n🧪 Testing Direct Google Cloud Storage Implementation...\n');
  
  // Check required variables
  if (!bucketName || !accessKey || !secretKey) {
    console.error('❌ Missing required environment variables');
    process.exit(1);
  }
  
  // Test bucket existence
  console.log('\n📦 Testing bucket existence...');
  const bucketExists = await testBucketExists(bucketName);
  if (bucketExists) {
    console.log(`✅ Bucket ${bucketName} exists`);
  } else {
    console.error(`❌ Bucket ${bucketName} does not exist or cannot be accessed`);
    process.exit(1);
  }
  
  // Test file upload
  console.log('\n📤 Testing file upload...');
  const testFilePath = `/test-${Date.now()}.txt`;
  const testContent = `Test file created at ${new Date().toISOString()}`;
  
  const uploadSuccess = await uploadTestFile(bucketName, testFilePath, testContent, 'text/plain');
  if (uploadSuccess) {
    console.log(`✅ Successfully uploaded test file to gs://${bucketName}${testFilePath}`);
  } else {
    console.error(`❌ Failed to upload test file`);
    process.exit(1);
  }
  
  // Test file retrieval
  console.log('\n📥 Testing file retrieval...');
  const fileData = await getFile(bucketName, testFilePath);
  
  if (fileData) {
    const downloadedContent = Buffer.from(fileData.content).toString('utf-8');
    console.log(`✅ Successfully retrieved test file`);
    console.log(`- Content-Type: ${fileData.contentType}`);
    console.log(`- Content: ${downloadedContent}`);
    
    if (downloadedContent === testContent) {
      console.log('✅ Downloaded content matches uploaded content');
    } else {
      console.error('❌ Downloaded content does not match uploaded content');
      console.log(`- Expected: ${testContent}`);
      console.log(`- Actual: ${downloadedContent}`);
    }
  } else {
    console.error(`❌ Failed to retrieve test file`);
  }
  
  // Test file deletion
  console.log('\n🗑️ Testing file deletion...');
  const deleteSuccess = await deleteFile(bucketName, testFilePath);
  
  if (deleteSuccess) {
    console.log(`✅ Successfully deleted test file`);
  } else {
    console.error(`❌ Failed to delete test file`);
  }
  
  console.log('\n🎉 Direct Google Cloud Storage tests completed');
}

// Run the tests
runTests().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
}); 