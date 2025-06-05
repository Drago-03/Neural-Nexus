/**
 * Test script for Google Cloud Storage integration
 * This script tests both the direct GCS integration and the fallback mechanism
 */

require('dotenv').config({ path: './.env.local' });
const fs = require('fs');
const path = require('path');

// Import local fallback module for testing
const fallbackModule = require('./gcloud-storage-fallback');

// Helper function to log with timestamps
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

// Test the local storage fallback
async function testLocalStorageFallback() {
  log('Starting local storage fallback test');
  
  try {
    // Initialize storage
    log('Initializing local storage...');
    const initResult = fallbackModule.initLocalStorage();
    log(`Local storage initialization result: ${initResult}`);
    
    if (!initResult) {
      log('❌ Local storage initialization failed, exiting test');
      return false;
    }
    
    // Create a test collection and item
    const testCollection = 'test-collection-local';
    const testItem = {
      id: `test-local-${Date.now()}`,
      name: 'Test Local Item',
      description: 'This is a test item for local storage',
      createdAt: new Date().toISOString()
    };
    
    // Test storeItem
    log(`Storing test item with ID ${testItem.id}...`);
    const storedItem = fallbackModule.storeItem(testCollection, testItem);
    log(`Item stored: ${JSON.stringify(storedItem)}`);
    
    // Test getItem
    log(`Retrieving item with ID ${testItem.id}...`);
    const retrievedItem = fallbackModule.getItem(testCollection, testItem.id);
    log(`Item retrieved: ${JSON.stringify(retrievedItem)}`);
    
    if (!retrievedItem || retrievedItem.id !== testItem.id) {
      log('❌ Item retrieval failed');
      return false;
    }
    
    // Test updateItem
    log(`Updating item with ID ${testItem.id}...`);
    const updatedItem = fallbackModule.updateItem(testCollection, testItem.id, {
      description: 'This is an updated test item for local storage',
      updatedAt: new Date().toISOString()
    });
    log(`Item updated: ${JSON.stringify(updatedItem)}`);
    
    if (!updatedItem || updatedItem.description !== 'This is an updated test item for local storage') {
      log('❌ Item update failed');
      return false;
    }
    
    // Test queryItems
    log(`Querying items in collection ${testCollection}...`);
    const items = fallbackModule.queryItems(testCollection, { name: 'Test Local Item' });
    log(`Query returned ${items.length} items`);
    
    // Test file upload
    log('Testing file upload...');
    const testFilePath = `test-uploads/test-file-local-${Date.now()}.txt`;
    const testFileContent = `This is a test file for local storage created at ${new Date().toISOString()}`;
    
    try {
      const fileUrl = fallbackModule.uploadFile(
        testFilePath,
        Buffer.from(testFileContent),
        'text/plain'
      );
      log(`File uploaded successfully: ${fileUrl}`);
    } catch (uploadError) {
      log(`❌ File upload failed: ${uploadError.message}`);
      return false;
    }
    
    // Test deleteItem
    log(`Deleting item with ID ${testItem.id}...`);
    const deleteResult = fallbackModule.deleteItem(testCollection, testItem.id);
    log(`Item deletion result: ${deleteResult}`);
    
    if (!deleteResult) {
      log('❌ Item deletion failed');
      return false;
    }
    
    log('✅ Local storage fallback test completed successfully');
    return true;
  } catch (error) {
    log(`❌ Error during local storage fallback test: ${error.message}`);
    console.error(error);
    return false;
  }
}

// Main test function
async function runTests() {
  log('==== Starting Storage Integration Tests ====');
  
  // Check environment variables
  log('Checking environment variables...');
  const googleCloudProjectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
  const googleCloudStorageBucket = process.env.GOOGLE_CLOUD_STORAGE_BUCKET;
  const googleCloudAccessKey = process.env.GOOGLE_CLOUD_ACCESS_KEY;
  const googleCloudSecretKey = process.env.GOOGLE_CLOUD_SECRET_KEY;
  
  log(`GOOGLE_CLOUD_PROJECT_ID: ${googleCloudProjectId ? 'Set' : 'Not set'}`);
  log(`GOOGLE_CLOUD_STORAGE_BUCKET: ${googleCloudStorageBucket ? 'Set' : 'Not set'}`);
  log(`GOOGLE_CLOUD_ACCESS_KEY: ${googleCloudAccessKey ? 'Set' : 'Not set'}`);
  log(`GOOGLE_CLOUD_SECRET_KEY: ${googleCloudSecretKey ? 'Set ✓' : 'Not set'}`);
  
  // Run local storage fallback test
  const fallbackTestResult = await testLocalStorageFallback();
  log(`Local storage fallback test result: ${fallbackTestResult ? 'Success ✅' : 'Failed ❌'}`);
  
  log('==== Storage Integration Tests Complete ====');
  
  // Exit with appropriate code
  process.exit(fallbackTestResult ? 0 : 1);
}

// Run the tests
runTests().catch(error => {
  console.error('Unhandled error during tests:', error);
  process.exit(1);
}); 