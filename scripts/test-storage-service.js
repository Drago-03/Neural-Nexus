#!/usr/bin/env node

/**
 * Test script for Neural Nexus Storage Service
 * 
 * This script tests the storage service functionality with both local storage
 * and Google Cloud Storage (if configured properly).
 * 
 * Run with: node scripts/test-storage-service.js
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const fs = require('fs');
const path = require('path');

// Import storage service - using CommonJS version
const {
  initStorage,
  storeItem,
  getItem,
  queryItems,
  updateItem,
  deleteItem,
  uploadFile
} = require('../lib/services/storage-service.js');

// Test data
const TEST_COLLECTION = 'test-collection';
const TEST_ITEM = {
  id: 'test-item-' + Date.now(),
  name: 'Test Item',
  description: 'This is a test item',
  tags: ['test', 'storage', 'neural-nexus'],
  createdAt: new Date().toISOString()
};

// Mask sensitive information for logging
function maskSecret(secret) {
  if (!secret) return 'not set';
  return secret.substring(0, 4) + '...' + secret.substring(secret.length - 4);
}

// Log configuration
console.log('🔧 Storage Service Test Configuration:');
console.log('- Project ID:', process.env.GOOGLE_CLOUD_PROJECT_ID || 'not set');
console.log('- Bucket:', process.env.GOOGLE_CLOUD_STORAGE_BUCKET || 'not set');
console.log('- Access Key:', maskSecret(process.env.GOOGLE_CLOUD_ACCESS_KEY));
console.log('- Secret Key:', maskSecret(process.env.GOOGLE_CLOUD_SECRET_KEY));
console.log('- Client Email:', process.env.GOOGLE_CLOUD_CLIENT_EMAIL || 'not set');
console.log('- Credentials File:', process.env.GOOGLE_APPLICATION_CREDENTIALS || 'not set');

async function runTests() {
  console.log('\n🧪 Starting Storage Service Tests...');

  try {
    // Initialize storage
    console.log('\n📦 Initializing storage service...');
    const initialized = await initStorage();
    console.log(`Storage initialization ${initialized ? 'successful' : 'failed'}`);
    
    if (!initialized) {
      console.error('❌ Failed to initialize storage service');
      process.exit(1);
    }

    // Test storing an item
    console.log('\n📝 Testing storeItem...');
    const storedItem = await storeItem(TEST_COLLECTION, TEST_ITEM);
    console.log('Stored item:', storedItem.id);
    
    if (!storedItem || storedItem.id !== TEST_ITEM.id) {
      console.error('❌ Failed to store item');
      process.exit(1);
    }

    // Test getting an item
    console.log('\n🔍 Testing getItem...');
    const retrievedItem = await getItem(TEST_COLLECTION, TEST_ITEM.id);
    console.log('Retrieved item:', retrievedItem?.id);
    
    if (!retrievedItem || retrievedItem.id !== TEST_ITEM.id) {
      console.error('❌ Failed to retrieve item');
      process.exit(1);
    }
    
    // Verify item content
    console.log('Item content matches:', 
      JSON.stringify(retrievedItem) === JSON.stringify(storedItem));

    // Test updating an item
    console.log('\n✏️ Testing updateItem...');
    const updates = {
      description: 'This is an updated test item',
      updatedAt: new Date().toISOString()
    };
    
    const updatedItem = await updateItem(TEST_COLLECTION, TEST_ITEM.id, updates);
    console.log('Updated item:', updatedItem?.id);
    
    if (!updatedItem || updatedItem.id !== TEST_ITEM.id) {
      console.error('❌ Failed to update item');
      process.exit(1);
    }
    
    // Verify update was applied
    console.log('Update was applied:', updatedItem.description === updates.description);

    // Test querying items
    console.log('\n🔎 Testing queryItems...');
    const queryResult = await queryItems(TEST_COLLECTION, { id: TEST_ITEM.id });
    console.log(`Query returned ${queryResult.length} items`);
    
    if (!queryResult || queryResult.length === 0) {
      console.error('❌ Failed to query items');
      process.exit(1);
    }

    // Test file upload
    console.log('\n📤 Testing uploadFile...');
    
    // Create test file content
    const testFileContent = Buffer.from('This is a test file for Neural Nexus Storage Service');
    const testFilePath = 'test-files/test-file.txt';
    
    // Upload file
    const fileUrl = await uploadFile(testFilePath, testFileContent, 'text/plain');
    console.log('Uploaded file URL:', fileUrl);
    
    if (!fileUrl) {
      console.error('❌ Failed to upload file');
      process.exit(1);
    }
    
    // Check if file exists at the URL (for local storage only)
    if (fileUrl.startsWith('/')) {
      const localPath = path.join(process.cwd(), 'public', fileUrl);
      const fileExists = fs.existsSync(localPath);
      console.log('File exists locally:', fileExists);
      
      if (fileExists) {
        const content = fs.readFileSync(localPath, 'utf8');
        console.log('File content matches:', content === testFileContent.toString());
      }
    }

    // Test deleting an item
    console.log('\n🗑️ Testing deleteItem...');
    const deleteResult = await deleteItem(TEST_COLLECTION, TEST_ITEM.id);
    console.log('Delete result:', deleteResult);
    
    if (!deleteResult) {
      console.error('❌ Failed to delete item');
      process.exit(1);
    }
    
    // Verify item was deleted
    const deletedItem = await getItem(TEST_COLLECTION, TEST_ITEM.id);
    console.log('Item was deleted:', deletedItem === null);
    
    if (deletedItem !== null) {
      console.error('❌ Item was not properly deleted');
      process.exit(1);
    }

    console.log('\n✅ All storage service tests passed!');
  } catch (error) {
    console.error('\n❌ Error during tests:', error);
    process.exit(1);
  }
}

// Run the tests
runTests().catch(error => {
  console.error('Unhandled error during tests:', error);
  process.exit(1);
}); 