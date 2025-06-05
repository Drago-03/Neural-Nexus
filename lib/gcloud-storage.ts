import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

// Environment check
const isProduction = process.env.NODE_ENV === 'production';

// Define interface for stored items
export interface StorageItem {
  id: string;
  [key: string]: any;
}

// In-memory fallback for development or when GCS is not available
const inMemoryStorage: { [collection: string]: { [id: string]: StorageItem } } = {};

// Google Cloud Storage configuration
let storage: Storage | null = null;
let bucketName: string | null = null;
let isGCSInitialized = false;

/**
 * Initialize Google Cloud Storage
 */
export async function initStorage(): Promise<boolean> {
  try {
    // Check required environment variables
    bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET || null;
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || null;
    
    // For development, allow missing credentials
    if (!bucketName && !isProduction) {
      console.warn('⚠️ Missing Google Cloud bucket name, using in-memory storage');
      return true; // Return success but use in-memory storage
    }
    
    // Require bucket name in production
    if (!bucketName) {
      console.error('❌ Missing required Google Cloud bucket name');
      return false;
    }
    
    // Initialize storage
    try {
      console.log('🔑 Initializing Google Cloud Storage');
      
      // Create storage client using environment variables
      // This will use GOOGLE_APPLICATION_CREDENTIALS or other env vars automatically
      storage = new Storage({
        projectId: projectId || undefined
      });
      
      // Test if we can access the bucket
      try {
        console.log(`🧪 Testing access to bucket: ${bucketName}`);
        const [exists] = await storage.bucket(bucketName).exists();
        
        if (!exists) {
          if (!isProduction) {
            // Create bucket in development if it doesn't exist
            try {
              await storage.createBucket(bucketName);
              console.log(`✅ Created bucket: ${bucketName}`);
            } catch (createError) {
              console.error(`❌ Failed to create bucket: ${bucketName}`, createError);
              // Continue with in-memory storage
              storage = null;
              return true;
            }
          } else {
            console.error(`❌ Bucket ${bucketName} does not exist in production`);
            storage = null;
            return false;
          }
        } else {
          console.log(`✅ Using existing bucket: ${bucketName}`);
        }
        
        isGCSInitialized = true;
        console.log('✅ Google Cloud Storage initialized successfully');
        return true;
      } catch (accessError) {
        console.error('❌ Failed to access bucket:', accessError);
        storage = null;
        
        // In development, fall back to in-memory storage
        if (!isProduction) {
          console.warn('⚠️ Using in-memory storage fallback in development');
          return true;
        }
        
        // In production, return failure
        return false;
      }
    } catch (authError) {
      console.error('❌ GCS initialization failed:', authError);
      storage = null;
      
      // In development, fall back to in-memory storage
      if (!isProduction) {
        console.warn('⚠️ Using in-memory storage fallback in development');
        return true;
      }
      
      // In production, return failure
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to initialize Google Cloud Storage:', error);
    storage = null;
    
    // In development, fall back to in-memory storage
    if (!isProduction) {
      console.warn('⚠️ Using in-memory storage fallback in development');
      return true;
    }
    
    // In production, return failure
    return false;
  }
}

/**
 * Store an item in storage
 */
export async function storeItem<T extends StorageItem>(
  collection: string,
  item: T
): Promise<T> {
  try {
    // Generate ID if not provided
    if (!item.id) {
      item.id = uuidv4();
    }
    
    // Try to use Google Cloud Storage if initialized
    if (isGCSInitialized && storage && bucketName) {
      const file = storage.bucket(bucketName).file(`${collection}/${item.id}.json`);
      
      await file.save(JSON.stringify(item), {
        contentType: 'application/json',
        metadata: {
          contentType: 'application/json',
        }
      });
      
      console.log(`Stored item ${item.id} in ${collection} (GCS)`);
      return item;
    } 
    // Fall back to in-memory storage
    else {
      if (!inMemoryStorage[collection]) {
        inMemoryStorage[collection] = {};
      }
      
      inMemoryStorage[collection][item.id] = item;
      console.log(`Stored item ${item.id} in ${collection} (memory)`);
      return item;
    }
  } catch (error) {
    console.error(`Error storing item in ${collection}:`, error);
    
    // Fall back to in-memory storage on error
    if (!inMemoryStorage[collection]) {
      inMemoryStorage[collection] = {};
    }
    
    inMemoryStorage[collection][item.id] = item;
    console.log(`Stored item ${item.id} in ${collection} (memory fallback)`);
    return item;
  }
}

/**
 * Get an item from storage
 */
export async function getItem<T extends StorageItem>(
  collection: string,
  id: string
): Promise<T | null> {
  try {
    // Try to use Google Cloud Storage if initialized
    if (isGCSInitialized && storage && bucketName) {
      const file = storage.bucket(bucketName).file(`${collection}/${id}.json`);
      
      // Check if file exists
      const [exists] = await file.exists();
      if (!exists) {
        console.log(`Item ${id} not found in ${collection} (GCS)`);
        return null;
      }
      
      // Download and parse file
      const [content] = await file.download();
      const item = JSON.parse(content.toString()) as T;
      console.log(`Retrieved item ${id} from ${collection} (GCS)`);
      return item;
    } 
    // Fall back to in-memory storage
    else {
      if (!inMemoryStorage[collection] || !inMemoryStorage[collection][id]) {
        console.log(`Item ${id} not found in ${collection} (memory)`);
        return null;
      }
      
      console.log(`Retrieved item ${id} from ${collection} (memory)`);
      return inMemoryStorage[collection][id] as T;
    }
  } catch (error) {
    console.error(`Error getting item ${id} from ${collection}:`, error);
    
    // Try in-memory storage on error
    if (inMemoryStorage[collection] && inMemoryStorage[collection][id]) {
      console.log(`Retrieved item ${id} from ${collection} (memory fallback)`);
      return inMemoryStorage[collection][id] as T;
    }
    
    return null;
  }
}

/**
 * Query items from storage
 */
export async function queryItems<T extends StorageItem>(
  collection: string,
  query: Record<string, any> = {}
): Promise<T[]> {
  try {
    // Try to use Google Cloud Storage if initialized
    if (isGCSInitialized && storage && bucketName) {
      // Get all files in the collection
      const [files] = await storage.bucket(bucketName).getFiles({
        prefix: `${collection}/`,
      });
      
      // Filter to only JSON files
      const jsonFiles = files.filter(file => 
        file.name.endsWith('.json') && file.name.startsWith(`${collection}/`)
      );
      
      // Download and parse all files
      const items: T[] = [];
      
      for (const file of jsonFiles) {
        try {
          const [content] = await file.download();
          const item = JSON.parse(content.toString()) as T;
          
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
    } 
    // Fall back to in-memory storage
    else {
      if (!inMemoryStorage[collection]) {
        console.log(`Collection ${collection} not found (memory)`);
        return [];
      }
      
      // Filter items based on query
      const items = Object.values(inMemoryStorage[collection])
        .filter(item => {
          for (const [key, value] of Object.entries(query)) {
            if (item[key] !== value) {
              return false;
            }
          }
          return true;
        }) as T[];
      
      console.log(`Retrieved ${items.length} items from ${collection} (memory)`);
      return items;
    }
  } catch (error) {
    console.error(`Error querying items from ${collection}:`, error);
    
    // Try in-memory storage on error
    if (inMemoryStorage[collection]) {
      const items = Object.values(inMemoryStorage[collection])
        .filter(item => {
          for (const [key, value] of Object.entries(query)) {
            if (item[key] !== value) {
              return false;
            }
          }
          return true;
        }) as T[];
      
      console.log(`Retrieved ${items.length} items from ${collection} (memory fallback)`);
      return items;
    }
    
    return [];
  }
}

/**
 * Update an item in storage
 */
export async function updateItem<T extends StorageItem>(
  collection: string,
  id: string,
  updates: Partial<T>
): Promise<T | null> {
  try {
    // Get existing item
    const item = await getItem<T>(collection, id);
    if (!item) {
      console.log(`Item ${id} not found in ${collection}`);
      return null;
    }
    
    // Apply updates
    const updatedItem = { ...item, ...updates } as T;
    
    // Try to use Google Cloud Storage if initialized
    if (isGCSInitialized && storage && bucketName) {
      const file = storage.bucket(bucketName).file(`${collection}/${id}.json`);
      
      await file.save(JSON.stringify(updatedItem), {
        contentType: 'application/json',
        metadata: {
          contentType: 'application/json',
        }
      });
      
      console.log(`Updated item ${id} in ${collection} (GCS)`);
      return updatedItem;
    } 
    // Fall back to in-memory storage
    else {
      if (!inMemoryStorage[collection]) {
        inMemoryStorage[collection] = {};
      }
      
      inMemoryStorage[collection][id] = updatedItem;
      console.log(`Updated item ${id} in ${collection} (memory)`);
      return updatedItem;
    }
  } catch (error) {
    console.error(`Error updating item ${id} in ${collection}:`, error);
    
    // Try in-memory storage on error
    try {
      const item = await getItem<T>(collection, id);
      if (!item) {
        return null;
      }
      
      const updatedItem = { ...item, ...updates } as T;
      
      if (!inMemoryStorage[collection]) {
        inMemoryStorage[collection] = {};
      }
      
      inMemoryStorage[collection][id] = updatedItem;
      console.log(`Updated item ${id} in ${collection} (memory fallback)`);
      return updatedItem;
    } catch (fallbackError) {
      console.error(`Fallback error updating item ${id}:`, fallbackError);
      return null;
    }
  }
}

/**
 * Delete an item from storage
 */
export async function deleteItem(
  collection: string,
  id: string
): Promise<boolean> {
  try {
    // Try to use Google Cloud Storage if initialized
    if (isGCSInitialized && storage && bucketName) {
      const file = storage.bucket(bucketName).file(`${collection}/${id}.json`);
      
      // Check if file exists
      const [exists] = await file.exists();
      if (!exists) {
        console.log(`Item ${id} not found in ${collection} (GCS)`);
        return false;
      }
      
      // Delete file
      await file.delete();
      console.log(`Deleted item ${id} from ${collection} (GCS)`);
      return true;
    } 
    // Fall back to in-memory storage
    else {
      if (!inMemoryStorage[collection] || !inMemoryStorage[collection][id]) {
        console.log(`Item ${id} not found in ${collection} (memory)`);
        return false;
      }
      
      delete inMemoryStorage[collection][id];
      console.log(`Deleted item ${id} from ${collection} (memory)`);
      return true;
    }
  } catch (error) {
    console.error(`Error deleting item ${id} from ${collection}:`, error);
    
    // Try in-memory storage on error
    if (inMemoryStorage[collection] && inMemoryStorage[collection][id]) {
      delete inMemoryStorage[collection][id];
      console.log(`Deleted item ${id} from ${collection} (memory fallback)`);
      return true;
    }
    
    return false;
  }
}

/**
 * Upload a file to storage
 */
export async function uploadFile(
  filePath: string,
  content: Buffer | string,
  contentType: string
): Promise<string> {
  try {
    // Try to use Google Cloud Storage if initialized
    if (isGCSInitialized && storage && bucketName) {
      // Create file reference
      const file = storage.bucket(bucketName).file(filePath);
      
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
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${filePath}`;
      console.log(`Uploaded file to ${publicUrl} (GCS)`);
      return publicUrl;
    } 
    // Fall back to local file system
    else {
      throw new Error('No cloud storage available and no local file system fallback implemented');
    }
  } catch (error) {
    console.error(`Error uploading file ${filePath}:`, error);
    throw error;
  }
}

// Initialize storage on module load
initStorage().catch(err => console.error('Error initializing storage:', err)); 