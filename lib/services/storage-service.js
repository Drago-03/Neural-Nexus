/**
 * Neural Nexus Storage Service (CommonJS version)
 * 
 * This service provides storage functionality with automatic fallback:
 * - In production with proper credentials: Uses Google Cloud Storage
 * - In development or without credentials: Uses local file storage
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { Storage } = require('@google-cloud/storage');

// Environment check
const isProduction = process.env.NODE_ENV === 'production';
const DATA_DIR = path.join(process.cwd(), 'data');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Google Cloud Storage configuration
let storage = null;
let bucketName = null;
let isGCSInitialized = false;

// Create necessary directories if they don't exist
function ensureDirectoriesExist() {
  const dirs = [
    DATA_DIR,
    UPLOADS_DIR,
    path.join(DATA_DIR, 'profiles'),
    path.join(DATA_DIR, 'avatars'),
    path.join(UPLOADS_DIR, 'avatars')
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// Initialize storage service
async function initStorage() {
  try {
    // Ensure local directories exist
    ensureDirectoriesExist();
    
    // Check if we should try to use Google Cloud Storage
    bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET || null;
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || null;
    
    if (!bucketName || !projectId) {
      console.log('🔧 Using local file storage (no GCS credentials provided)');
      return true; // Local storage is ready
    }
    
    // Try to initialize GCS
    try {
      console.log('🔧 Initializing Google Cloud Storage...');
      
      storage = new Storage({
        projectId: projectId
      });
      
      // Test if bucket exists and is accessible
      const [exists] = await storage.bucket(bucketName).exists();
      
      if (!exists) {
        console.warn(`⚠️ GCS bucket ${bucketName} does not exist`);
        storage = null;
        return true; // Fall back to local storage
      }
      
      isGCSInitialized = true;
      console.log('✅ Google Cloud Storage initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Google Cloud Storage:', error);
      storage = null;
      return true; // Fall back to local storage
    }
  } catch (error) {
    console.error('❌ Failed to initialize storage service:', error);
    return false;
  }
}

/**
 * Store an item in storage
 */
async function storeItem(collection, item) {
  // Generate ID if not provided
  if (!item.id) {
    item.id = uuidv4();
  }
  
  // Try to use Google Cloud Storage if initialized
  if (isGCSInitialized && storage && bucketName) {
    try {
      const file = storage.bucket(bucketName).file(`${collection}/${item.id}.json`);
      
      await file.save(JSON.stringify(item), {
        contentType: 'application/json',
        metadata: {
          contentType: 'application/json',
        }
      });
      
      console.log(`Stored item ${item.id} in ${collection} (GCS)`);
      return item;
    } catch (error) {
      console.error(`Error storing item in GCS:`, error);
      // Fall back to local storage
    }
  }
  
  // Use local file storage
  const collectionDir = path.join(DATA_DIR, collection);
  if (!fs.existsSync(collectionDir)) {
    fs.mkdirSync(collectionDir, { recursive: true });
  }
  
  const filePath = path.join(collectionDir, `${item.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(item, null, 2));
  console.log(`Stored item ${item.id} in ${collection} (local)`);
  
  return item;
}

/**
 * Get an item from storage
 */
async function getItem(collection, id) {
  // Try to use Google Cloud Storage if initialized
  if (isGCSInitialized && storage && bucketName) {
    try {
      const file = storage.bucket(bucketName).file(`${collection}/${id}.json`);
      
      // Check if file exists
      const [exists] = await file.exists();
      if (!exists) {
        return null;
      }
      
      // Download and parse file
      const [content] = await file.download();
      const item = JSON.parse(content.toString());
      console.log(`Retrieved item ${id} from ${collection} (GCS)`);
      return item;
    } catch (error) {
      console.error(`Error getting item from GCS:`, error);
      // Fall back to local storage
    }
  }
  
  // Use local file storage
  const filePath = path.join(DATA_DIR, collection, `${id}.json`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const item = JSON.parse(content);
    console.log(`Retrieved item ${id} from ${collection} (local)`);
    return item;
  } catch (error) {
    console.error(`Error reading local file:`, error);
    return null;
  }
}

/**
 * Query items from storage
 */
async function queryItems(collection, query = {}) {
  // Try to use Google Cloud Storage if initialized
  if (isGCSInitialized && storage && bucketName) {
    try {
      // Get all files in the collection
      const [files] = await storage.bucket(bucketName).getFiles({
        prefix: `${collection}/`,
      });
      
      // Filter to only JSON files
      const jsonFiles = files.filter(file => 
        file.name.endsWith('.json') && file.name.startsWith(`${collection}/`)
      );
      
      // Download and parse all files
      const items = [];
      
      for (const file of jsonFiles) {
        try {
          const [content] = await file.download();
          const item = JSON.parse(content.toString());
          
          // Check if item matches query
          let matches = true;
          for (const [key, value] of Object.entries(query)) {
            if (item[key] !== value) {
              matches = false;
              break;
            }
          }
          
          if (matches) {
            items.push(item);
          }
        } catch (fileError) {
          console.error(`Error parsing file ${file.name}:`, fileError);
        }
      }
      
      console.log(`Retrieved ${items.length} items from ${collection} (GCS)`);
      return items;
    } catch (error) {
      console.error(`Error querying items from GCS:`, error);
      // Fall back to local storage
    }
  }
  
  // Use local file storage
  const collectionDir = path.join(DATA_DIR, collection);
  if (!fs.existsSync(collectionDir)) {
    return [];
  }
  
  try {
    const files = fs.readdirSync(collectionDir).filter(file => file.endsWith('.json'));
    const items = [];
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(collectionDir, file), 'utf8');
        const item = JSON.parse(content);
        
        // Check if item matches query
        let matches = true;
        for (const [key, value] of Object.entries(query)) {
          if (item[key] !== value) {
            matches = false;
            break;
          }
        }
        
        if (matches) {
          items.push(item);
        }
      } catch (fileError) {
        console.error(`Error parsing file ${file}:`, fileError);
      }
    }
    
    console.log(`Retrieved ${items.length} items from ${collection} (local)`);
    return items;
  } catch (error) {
    console.error(`Error reading local directory:`, error);
    return [];
  }
}

/**
 * Update an item in storage
 */
async function updateItem(collection, id, updates) {
  // Get existing item
  const item = await getItem(collection, id);
  if (!item) {
    return null;
  }
  
  // Apply updates
  const updatedItem = { ...item, ...updates };
  
  // Store updated item
  await storeItem(collection, updatedItem);
  
  return updatedItem;
}

/**
 * Delete an item from storage
 */
async function deleteItem(collection, id) {
  // Try to use Google Cloud Storage if initialized
  if (isGCSInitialized && storage && bucketName) {
    try {
      const file = storage.bucket(bucketName).file(`${collection}/${id}.json`);
      
      // Check if file exists
      const [exists] = await file.exists();
      if (!exists) {
        return false;
      }
      
      // Delete file
      await file.delete();
      console.log(`Deleted item ${id} from ${collection} (GCS)`);
      return true;
    } catch (error) {
      console.error(`Error deleting item from GCS:`, error);
      // Fall back to local storage
    }
  }
  
  // Use local file storage
  const filePath = path.join(DATA_DIR, collection, `${id}.json`);
  if (!fs.existsSync(filePath)) {
    return false;
  }
  
  try {
    fs.unlinkSync(filePath);
    console.log(`Deleted item ${id} from ${collection} (local)`);
    return true;
  } catch (error) {
    console.error(`Error deleting local file:`, error);
    return false;
  }
}

/**
 * Upload a file to storage
 */
async function uploadFile(filePath, content, contentType) {
  // Generate a unique filename
  const fileExt = filePath.split('.').pop() || 'bin';
  const fileName = `${path.basename(filePath, `.${fileExt}`)}-${Date.now()}.${fileExt}`;
  const fullPath = filePath.includes('/') ? filePath : `uploads/${fileName}`;
  
  // Try to use Google Cloud Storage if initialized
  if (isGCSInitialized && storage && bucketName) {
    try {
      // Create file reference
      const file = storage.bucket(bucketName).file(fullPath);
      
      // Upload file
      await file.save(content, {
        contentType,
        metadata: {
          contentType,
          cacheControl: 'public, max-age=31536000', // 1 year cache
        }
      });
      
      // Make file publicly accessible
      await file.makePublic();
      
      // Get public URL
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${fullPath}`;
      console.log(`Uploaded file to ${publicUrl} (GCS)`);
      return publicUrl;
    } catch (error) {
      console.error(`Error uploading file to GCS:`, error);
      // Fall back to local storage
    }
  }
  
  // Use local file storage
  const localFilePath = path.join(process.cwd(), 'public', fullPath);
  const localDir = path.dirname(localFilePath);
  
  // Ensure directory exists
  if (!fs.existsSync(localDir)) {
    fs.mkdirSync(localDir, { recursive: true });
  }
  
  // Write file
  fs.writeFileSync(localFilePath, content);
  
  // Return public URL
  const publicUrl = `/${fullPath}`;
  console.log(`Uploaded file to ${publicUrl} (local)`);
  return publicUrl;
}

// Initialize storage on module load
initStorage().catch(err => console.error('Error initializing storage:', err));

// Export functions
module.exports = {
  initStorage,
  storeItem,
  getItem,
  queryItems,
  updateItem,
  deleteItem,
  uploadFile
}; 