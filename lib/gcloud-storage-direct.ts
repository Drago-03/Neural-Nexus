/**
 * Direct Google Cloud Storage Implementation
 * 
 * This module provides direct access to Google Cloud Storage using HMAC keys
 * without relying on the Google Cloud Storage SDK, which can have compatibility issues.
 */

import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

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
let isGCSInitialized = false;
let bucketName: string | null = null;
let projectId: string | null = null;
let accessKey: string | null = null;
let secretKey: string | null = null;

/**
 * Initialize Google Cloud Storage
 */
export async function initStorage(): Promise<boolean> {
  try {
    // Check required environment variables
    bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET || null;
    projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || null;
    accessKey = process.env.GOOGLE_CLOUD_ACCESS_KEY || null;
    secretKey = process.env.GOOGLE_CLOUD_SECRET_KEY || null;
    
    // For development, allow missing credentials
    if ((!bucketName || !accessKey || !secretKey) && !isProduction) {
      console.warn('⚠️ Missing Google Cloud credentials, using in-memory storage');
      return true; // Return success but use in-memory storage
    }
    
    // Require credentials in production
    if (!bucketName || !accessKey || !secretKey) {
      console.error('❌ Missing required Google Cloud environment variables');
      return false;
    }
    
    // Test connection
    try {
      console.log('🧪 Testing Google Cloud Storage connection...');
      
      // Test if bucket exists
      const bucketExists = await testBucketExists(bucketName);
      
      if (bucketExists) {
        console.log(`✅ Successfully connected to bucket: ${bucketName}`);
        isGCSInitialized = true;
        return true;
      } else {
        console.error(`❌ Bucket ${bucketName} does not exist`);
        
        // In development, we could create the bucket
        if (!isProduction) {
          console.warn('⚠️ Using in-memory storage fallback in development');
          return true;
        }
        
        return false;
      }
    } catch (testError) {
      console.error('❌ Failed to test GCS connection:', testError);
      
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
 * Test if a bucket exists
 */
async function testBucketExists(bucket: string): Promise<boolean> {
  try {
    if (!accessKey || !secretKey) return false;
    
    const date = new Date().toUTCString();
    const method = 'HEAD';
    const resource = `/${bucket}`;
    
    const signature = createSignature(method, '', 'application/json', date, resource);
    
    const response = await axios({
      method,
      url: `https://storage.googleapis.com${resource}`,
      headers: {
        'Date': date,
        'Authorization': `AWS ${accessKey}:${signature}`,
      },
      validateStatus: (status) => status < 500, // Accept 404 as valid response
    });
    
    return response.status === 200;
  } catch (error) {
    console.error('Error checking bucket existence:', error);
    return false;
  }
}

/**
 * Create an AWS-style signature for GCS
 */
function createSignature(
  method: string,
  contentMD5: string,
  contentType: string,
  date: string,
  resource: string
): string {
  if (!secretKey) return '';
  
  const stringToSign = `${method}\n${contentMD5}\n${contentType}\n${date}\n${resource}`;
  
  return crypto
    .createHmac('sha1', secretKey)
    .update(stringToSign)
    .digest('base64');
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
    if (isGCSInitialized && bucketName && accessKey && secretKey) {
      const content = JSON.stringify(item);
      const contentMD5 = crypto
        .createHash('md5')
        .update(content)
        .digest('base64');
      
      const date = new Date().toUTCString();
      const method = 'PUT';
      const contentType = 'application/json';
      const resource = `/${bucketName}/${collection}/${item.id}.json`;
      
      const signature = createSignature(method, contentMD5, contentType, date, resource);
      
      await axios({
        method,
        url: `https://storage.googleapis.com${resource}`,
        headers: {
          'Content-Type': contentType,
          'Content-MD5': contentMD5,
          'Date': date,
          'Authorization': `AWS ${accessKey}:${signature}`,
        },
        data: content,
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
    if (isGCSInitialized && bucketName && accessKey && secretKey) {
      const date = new Date().toUTCString();
      const method = 'GET';
      const resource = `/${bucketName}/${collection}/${id}.json`;
      
      const signature = createSignature(method, '', '', date, resource);
      
      const response = await axios({
        method,
        url: `https://storage.googleapis.com${resource}`,
        headers: {
          'Date': date,
          'Authorization': `AWS ${accessKey}:${signature}`,
        },
        validateStatus: (status) => status < 500, // Accept 404 as valid response
      });
      
      if (response.status === 404) {
        console.log(`Item ${id} not found in ${collection} (GCS)`);
        return null;
      }
      
      const item = response.data as T;
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
 * Update an item in storage
 */
export async function updateItem<T extends StorageItem>(
  collection: string,
  id: string,
  updates: Partial<T>
): Promise<T | null> {
  try {
    // Get existing item
    const existingItem = await getItem<T>(collection, id);
    if (!existingItem) {
      console.log(`Item ${id} not found in ${collection} for update`);
      return null;
    }
    
    // Apply updates
    const updatedItem = { ...existingItem, ...updates };
    
    // Store updated item
    return await storeItem<T>(collection, updatedItem);
  } catch (error) {
    console.error(`Error updating item ${id} in ${collection}:`, error);
    return null;
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
    if (isGCSInitialized && bucketName && accessKey && secretKey) {
      const date = new Date().toUTCString();
      const method = 'DELETE';
      const resource = `/${bucketName}/${collection}/${id}.json`;
      
      const signature = createSignature(method, '', '', date, resource);
      
      await axios({
        method,
        url: `https://storage.googleapis.com${resource}`,
        headers: {
          'Date': date,
          'Authorization': `AWS ${accessKey}:${signature}`,
        },
        validateStatus: (status) => status < 500, // Accept 404 as valid response
      });
      
      console.log(`Deleted item ${id} from ${collection} (GCS)`);
      return true;
    } 
    // Fall back to in-memory storage
    else {
      if (!inMemoryStorage[collection] || !inMemoryStorage[collection][id]) {
        console.log(`Item ${id} not found in ${collection} (memory) for deletion`);
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
    // Generate a unique filename
    const fileName = `${path.basename(filePath, path.extname(filePath))}-${Date.now()}${path.extname(filePath)}`;
    const fullPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
    
    // Try to use Google Cloud Storage if initialized
    if (isGCSInitialized && bucketName && accessKey && secretKey) {
      const contentBuffer = Buffer.isBuffer(content) ? content : Buffer.from(content);
      const contentMD5 = crypto
        .createHash('md5')
        .update(contentBuffer)
        .digest('base64');
      
      const date = new Date().toUTCString();
      const method = 'PUT';
      const resource = `/${bucketName}${fullPath}`;
      
      const signature = createSignature(method, contentMD5, contentType, date, resource);
      
      await axios({
        method,
        url: `https://storage.googleapis.com${resource}`,
        headers: {
          'Content-Type': contentType,
          'Content-MD5': contentMD5,
          'Date': date,
          'Authorization': `AWS ${accessKey}:${signature}`,
        },
        data: contentBuffer,
      });
      
      // Return public URL
      const fileUrl = `https://storage.googleapis.com/${bucketName}${fullPath}`;
      console.log(`Uploaded file to ${fileUrl} (GCS)`);
      return fileUrl;
    } 
    // Fall back to in-memory storage
    else {
      // In a real app, we would save to local filesystem
      // For this demo, just log and return a fake URL
      console.log(`Simulated upload of file ${fileName} (memory)`);
      return `/api/local-files${fullPath}`;
    }
  } catch (error) {
    console.error(`Error uploading file ${filePath}:`, error);
    // Return a fallback URL
    return `/api/local-files/${path.basename(filePath)}`;
  }
} 