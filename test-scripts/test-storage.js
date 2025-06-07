// Test script for storage service
// Run with: node test-storage.js

// Import storage service
try {
  require('./lib/services/storage-service');
  console.log('✅ Storage service module loaded successfully');
} catch (error) {
  console.error('❌ Failed to load storage service:', error);
  process.exit(1);
}

// Helper for colorized output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Log environment variables
console.log(`${colors.bright}${colors.blue}[Environment Check]${colors.reset}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
console.log(`GOOGLE_CLOUD_PROJECT_ID: ${process.env.GOOGLE_CLOUD_PROJECT_ID || 'not set'}`);
console.log(`GOOGLE_CLOUD_STORAGE_BUCKET: ${process.env.GOOGLE_CLOUD_STORAGE_BUCKET || 'not set'}`);
console.log(`GOOGLE_CLOUD_ACCESS_KEY: ${process.env.GOOGLE_CLOUD_ACCESS_KEY ? 'found' : 'not set'}`);
console.log(`GOOGLE_CLOUD_SECRET_KEY: ${process.env.GOOGLE_CLOUD_SECRET_KEY ? 'found' : 'not set'}`);
console.log();

// Test storage service
async function testStorageService() {
  try {
    const { StorageService } = require('./lib/services/storage-service');
    
    console.log(`${colors.bright}${colors.magenta}[Testing Storage Service]${colors.reset}`);
    
    // Test 1: Initialize storage
    console.log(`${colors.cyan}Test 1: Initialize storage${colors.reset}`);
    const initResult = await StorageService.initStorage();
    console.log(`Initialization result: ${initResult ? 'success' : 'failure'}`);
    
    // Test 2: Store an item
    console.log(`\n${colors.cyan}Test 2: Store an item${colors.reset}`);
    const testItem = {
      id: 'test-' + Date.now(),
      name: 'Test Item',
      description: 'This is a test item',
      createdAt: new Date().toISOString(),
    };
    
    const storedItem = await StorageService.storeItem('test-collection', testItem);
    console.log('Stored item:', storedItem ? '✅ Success' : '❌ Failed');
    
    if (storedItem) {
      // Test 3: Get the item
      console.log(`\n${colors.cyan}Test 3: Get the item${colors.reset}`);
      const retrievedItem = await StorageService.getItem('test-collection', testItem.id);
      console.log('Retrieved item:', retrievedItem ? '✅ Success' : '❌ Failed');
      console.log('Item data:', retrievedItem);
      
      // Test 4: Update the item
      console.log(`\n${colors.cyan}Test 4: Update the item${colors.reset}`);
      const updates = {
        description: 'This is an updated test item',
        updatedAt: new Date().toISOString(),
      };
      
      const updatedItem = await StorageService.updateItem('test-collection', testItem.id, updates);
      console.log('Updated item:', updatedItem ? '✅ Success' : '❌ Failed');
      console.log('Updated description:', updatedItem?.description);
      
      // Test 5: Query items
      console.log(`\n${colors.cyan}Test 5: Query items${colors.reset}`);
      const queryResults = await StorageService.queryItems('test-collection', { name: 'Test Item' });
      console.log('Query results:', queryResults.length > 0 ? '✅ Success' : '❌ Failed');
      console.log('Found items count:', queryResults.length);
      
      // Test 6: Delete the item
      console.log(`\n${colors.cyan}Test 6: Delete the item${colors.reset}`);
      const deleteResult = await StorageService.deleteItem('test-collection', testItem.id);
      console.log('Delete result:', deleteResult ? '✅ Success' : '❌ Failed');
      
      // Verify deletion
      const afterDelete = await StorageService.getItem('test-collection', testItem.id);
      console.log('Item after deletion:', afterDelete ? '❌ Still exists' : '✅ Successfully deleted');
    }
    
    // Test 7: Upload a file
    console.log(`\n${colors.cyan}Test 7: Upload a file${colors.reset}`);
    try {
      // Create a simple text file
      const testContent = Buffer.from('This is a test file for upload');
      const testFilePath = `test-files/test-${Date.now()}.txt`;
      
      const fileUrl = await StorageService.uploadFile(testFilePath, testContent, 'text/plain');
      console.log('File upload:', fileUrl ? '✅ Success' : '❌ Failed');
      console.log('File URL:', fileUrl);
    } catch (error) {
      console.error('❌ File upload error:', error.message);
    }
    
    console.log(`\n${colors.bright}${colors.green}All tests completed!${colors.reset}`);
  } catch (error) {
    console.error(`${colors.bright}${colors.red}Test failed:${colors.reset}`, error);
  }
}

// Run the tests
testStorageService(); 