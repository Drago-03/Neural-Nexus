// Local filesystem fallback for Google Cloud Storage
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Base storage directory
const STORAGE_DIR = path.join(process.cwd(), '.local-storage');
const UPLOADS_DIR = path.join(STORAGE_DIR, 'uploads');

// Collections for different data types
const collections = {};

/**
 * Ensure all required directories exist
 */
function ensureDirectoriesExist() {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
    console.log(`Created local storage directory: ${STORAGE_DIR}`);
  }
  
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    console.log(`Created uploads directory: ${UPLOADS_DIR}`);
  }
}

/**
 * Initialize local storage
 */
function initLocalStorage() {
  try {
    ensureDirectoriesExist();
    
    // Read existing collections from disk
    const collectionDirs = fs.readdirSync(STORAGE_DIR)
      .filter(dir => 
        fs.statSync(path.join(STORAGE_DIR, dir)).isDirectory() && 
        dir !== 'uploads'
      );
    
    collectionDirs.forEach(collectionName => {
      // Initialize collection in memory
      collections[collectionName] = {};
      
      // Load items from disk
      const itemFiles = fs.readdirSync(path.join(STORAGE_DIR, collectionName))
        .filter(file => file.endsWith('.json'));
      
      itemFiles.forEach(file => {
        try {
          const data = fs.readFileSync(path.join(STORAGE_DIR, collectionName, file), 'utf8');
          const item = JSON.parse(data);
          
          if (item && item.id) {
            collections[collectionName][item.id] = item;
          }
        } catch (e) {
          console.error(`Error loading item from ${file}:`, e);
        }
      });
      
      console.log(`Loaded ${Object.keys(collections[collectionName]).length} items from ${collectionName}`);
    });
    
    console.log('✅ Local storage initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize local storage:', error);
    return false;
  }
}

/**
 * Store an item in local storage
 * @param {string} collection - Collection name
 * @param {Object} item - Item to store
 */
function storeItem(collection, item) {
  try {
    // Generate ID if not provided
    if (!item.id) {
      item.id = uuidv4();
    }
    
    // Create collection directory if it doesn't exist
    const collectionDir = path.join(STORAGE_DIR, collection);
    if (!fs.existsSync(collectionDir)) {
      fs.mkdirSync(collectionDir, { recursive: true });
    }
    
    // Initialize collection in memory if it doesn't exist
    if (!collections[collection]) {
      collections[collection] = {};
    }
    
    // Store in memory
    collections[collection][item.id] = item;
    
    // Store on disk
    fs.writeFileSync(
      path.join(collectionDir, `${item.id}.json`),
      JSON.stringify(item, null, 2),
      'utf8'
    );
    
    console.log(`Stored item ${item.id} in ${collection} (local file)`);
    return item;
  } catch (error) {
    console.error(`Error storing item in ${collection}:`, error);
    throw error;
  }
}

/**
 * Get an item from local storage
 * @param {string} collection - Collection name
 * @param {string} id - Item ID
 */
function getItem(collection, id) {
  try {
    // Check memory cache first
    if (collections[collection] && collections[collection][id]) {
      return collections[collection][id];
    }
    
    // Try to read from disk
    const filePath = path.join(STORAGE_DIR, collection, `${id}.json`);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      const item = JSON.parse(data);
      
      // Cache in memory
      if (!collections[collection]) {
        collections[collection] = {};
      }
      collections[collection][id] = item;
      
      return item;
    }
    
    return null;
  } catch (error) {
    console.error(`Error getting item ${id} from ${collection}:`, error);
    return null;
  }
}

/**
 * Query items from local storage
 * @param {string} collection - Collection name
 * @param {Object} query - Query object
 */
function queryItems(collection, query = {}) {
  try {
    // Initialize result array
    const results = [];
    
    // Check if collection exists in memory
    if (collections[collection]) {
      // Get all items that match the query
      for (const id in collections[collection]) {
        const item = collections[collection][id];
        let matches = true;
        
        // Check each query parameter
        for (const key in query) {
          // Handle array values (for $in operator)
          if (Array.isArray(query[key]) && query[key].$in) {
            if (!query[key].$in.includes(item[key])) {
              matches = false;
              break;
            }
          } 
          // Regular equality check
          else if (item[key] !== query[key]) {
            matches = false;
            break;
          }
        }
        
        if (matches) {
          results.push(item);
        }
      }
    } else {
      // Try to read from disk
      const collectionDir = path.join(STORAGE_DIR, collection);
      if (fs.existsSync(collectionDir)) {
        // Initialize collection in memory
        collections[collection] = {};
        
        // Read all items in the collection
        const files = fs.readdirSync(collectionDir)
          .filter(file => file.endsWith('.json'));
        
        for (const file of files) {
          try {
            const data = fs.readFileSync(path.join(collectionDir, file), 'utf8');
            const item = JSON.parse(data);
            
            // Cache in memory
            if (item && item.id) {
              collections[collection][item.id] = item;
              
              // Check if item matches query
              let matches = true;
              for (const key in query) {
                if (item[key] !== query[key]) {
                  matches = false;
                  break;
                }
              }
              
              if (matches) {
                results.push(item);
              }
            }
          } catch (e) {
            console.error(`Error reading item from ${file}:`, e);
          }
        }
      }
    }
    
    console.log(`Retrieved ${results.length} items from ${collection} (local file)`);
    return results;
  } catch (error) {
    console.error(`Error querying items from ${collection}:`, error);
    return [];
  }
}

/**
 * Update an item in local storage
 * @param {string} collection - Collection name
 * @param {string} id - Item ID
 * @param {Object} updates - Updates to apply
 */
function updateItem(collection, id, updates) {
  try {
    // Get existing item
    const item = getItem(collection, id);
    if (!item) {
      console.log(`Item ${id} not found in ${collection}`);
      return null;
    }
    
    // Apply updates
    const updatedItem = { ...item, ...updates };
    
    // Update in memory
    if (!collections[collection]) {
      collections[collection] = {};
    }
    collections[collection][id] = updatedItem;
    
    // Update on disk
    const filePath = path.join(STORAGE_DIR, collection, `${id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(updatedItem, null, 2), 'utf8');
    
    console.log(`Updated item ${id} in ${collection} (local file)`);
    return updatedItem;
  } catch (error) {
    console.error(`Error updating item ${id} in ${collection}:`, error);
    return null;
  }
}

/**
 * Delete an item from local storage
 * @param {string} collection - Collection name
 * @param {string} id - Item ID
 */
function deleteItem(collection, id) {
  try {
    // Check if item exists
    const filePath = path.join(STORAGE_DIR, collection, `${id}.json`);
    if (!fs.existsSync(filePath)) {
      console.log(`Item ${id} not found in ${collection}`);
      return false;
    }
    
    // Delete from disk
    fs.unlinkSync(filePath);
    
    // Delete from memory
    if (collections[collection] && collections[collection][id]) {
      delete collections[collection][id];
    }
    
    console.log(`Deleted item ${id} from ${collection} (local file)`);
    return true;
  } catch (error) {
    console.error(`Error deleting item ${id} from ${collection}:`, error);
    return false;
  }
}

/**
 * Upload a file to local storage
 * @param {string} filePath - Target path
 * @param {Buffer|string} content - File content
 * @param {string} contentType - Content type
 */
function uploadFile(filePath, content, contentType) {
  try {
    // Ensure uploads directory exists
    ensureDirectoriesExist();
    
    // Normalize filePath (remove leading slash if any)
    const normalizedPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
    
    // Create full path
    const fullPath = path.join(UPLOADS_DIR, normalizedPath);
    
    // Ensure directory exists
    const dirPath = path.dirname(fullPath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    // Write file
    fs.writeFileSync(fullPath, content);
    
    // Generate public URL (for local development)
    const publicUrl = `/api/local-storage/${normalizedPath}`;
    
    console.log(`Uploaded file to ${publicUrl} (local file)`);
    return publicUrl;
  } catch (error) {
    console.error(`Error uploading file ${filePath}:`, error);
    throw error;
  }
}

// Initialize local storage on module load
initLocalStorage();

// Export functions
module.exports = {
  initLocalStorage,
  storeItem,
  getItem,
  queryItems,
  updateItem,
  deleteItem,
  uploadFile,
  STORAGE_DIR,
  UPLOADS_DIR
}; 