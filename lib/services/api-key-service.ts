import { v4 as uuidv4 } from 'uuid';
import { StorageService } from './storage-service';
import crypto from 'crypto';

/**
 * API Key interface
 */
export interface ApiKey {
  id: string;
  userId: string;
  name: string;
  key: string;
  prefix: string;
  keyType: 'test' | 'train' | 'deploy' | 'development' | 'production';
  createdAt: string;
  updatedAt: string;
  lastUsed?: string;
  expiresAt?: string;
  usageLimit?: number;
  currentUsage?: number;
  isActive: boolean;
}

/**
 * Service for managing API keys
 */
export class ApiKeyService {
  private static readonly COLLECTION_NAME = 'apiKeys';

  /**
   * Create a new API key
   */
  static async createApiKey(
    userId: string,
    name: string,
    keyType: ApiKey['keyType'] = 'development'
  ): Promise<ApiKey> {
    try {
      // Generate a secure random key
      const randomBytes = crypto.randomBytes(32);
      const key = randomBytes.toString('base64').replace(/[+/=]/g, '').substring(0, 40);
      
      // Create a prefix for easier identification
      const prefix = this.getKeyPrefix(keyType);
      
      // Set usage limit based on key type
      const usageLimit = this.getUsageLimitForKeyType(keyType);
      
      // Generate current timestamp
      const now = new Date().toISOString();
      
      // Create API key object
      const apiKey: ApiKey = {
        id: StorageService.generateId(),
        userId,
        name,
        key,
        prefix,
        keyType,
        createdAt: now,
        updatedAt: now,
        currentUsage: 0,
        usageLimit,
        isActive: true
      };
      
      // Store in cloud storage
      const storedKey = await StorageService.storeItem<ApiKey>(this.COLLECTION_NAME, apiKey);
      
      if (!storedKey) {
        throw new Error('Failed to store API key');
      }
      
      return storedKey;
    } catch (error) {
      console.error('Error creating API key:', error);
      throw error;
    }
  }

  /**
   * Get an API key by ID
   */
  static async getApiKeyById(id: string): Promise<ApiKey | null> {
    try {
      return await StorageService.getItem<ApiKey>(this.COLLECTION_NAME, id);
    } catch (error) {
      console.error('Error getting API key by ID:', error);
      return null;
    }
  }

  /**
   * Get an API key by key
   */
  static async getApiKeyByKey(key: string): Promise<ApiKey | null> {
    try {
      const allKeys = await StorageService.queryItems<ApiKey>(this.COLLECTION_NAME);
      return allKeys.find(apiKey => apiKey.key === key) || null;
    } catch (error) {
      console.error('Error getting API key by key:', error);
      return null;
    }
  }

  /**
   * Get all API keys for a user
   */
  static async getApiKeysForUser(userId: string): Promise<ApiKey[]> {
    try {
      const keys = await StorageService.queryItems<ApiKey>(this.COLLECTION_NAME, { userId });
      return keys;
    } catch (error) {
      console.error('Error getting API keys for user:', error);
      return [];
    }
  }

  /**
   * Update an API key
   */
  static async updateApiKey(id: string, updates: Partial<ApiKey>): Promise<ApiKey | null> {
    try {
      // Remove fields that shouldn't be updated directly
      const { id: _, key, prefix, userId, createdAt, ...updateData } = updates;
      
      // Add updated timestamp
      const updatedWithTimestamp = {
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      
      return await StorageService.updateItem<ApiKey>(this.COLLECTION_NAME, id, updatedWithTimestamp);
    } catch (error) {
      console.error('Error updating API key:', error);
      return null;
    }
  }

  /**
   * Delete an API key
   */
  static async deleteApiKey(id: string): Promise<boolean> {
    try {
      return await StorageService.deleteItem(this.COLLECTION_NAME, id);
    } catch (error) {
      console.error('Error deleting API key:', error);
      return false;
    }
  }

  /**
   * Record API key usage
   */
  static async recordApiKeyUsage(key: string): Promise<boolean> {
    try {
      // Find the key
      const apiKey = await this.getApiKeyByKey(key);
      
      if (!apiKey) {
        console.error('API key not found');
        return false;
      }
      
      // Check if key is active
      if (!apiKey.isActive) {
        console.error('API key is inactive');
        return false;
      }
      
      // Check if key has expired
      if (apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date()) {
        console.error('API key has expired');
        
        // Mark key as inactive
        await this.updateApiKey(apiKey.id, { isActive: false });
        return false;
      }
      
      // Check if usage limit has been reached
      if (apiKey.usageLimit && apiKey.currentUsage && apiKey.currentUsage >= apiKey.usageLimit) {
        console.error('API key usage limit reached');
        return false;
      }
      
      // Update usage count and last used time
      const now = new Date().toISOString();
      await StorageService.updateItem<ApiKey>(this.COLLECTION_NAME, apiKey.id, {
        currentUsage: (apiKey.currentUsage || 0) + 1,
        lastUsed: now,
        updatedAt: now
      });
      
      return true;
    } catch (error) {
      console.error('Error recording API key usage:', error);
      return false;
    }
  }

  /**
   * Reset API key usage
   */
  static async resetApiKeyUsage(id: string): Promise<boolean> {
    try {
      const result = await StorageService.updateItem<ApiKey>(this.COLLECTION_NAME, id, {
        currentUsage: 0,
        updatedAt: new Date().toISOString()
      });
      
      return !!result;
    } catch (error) {
      console.error('Error resetting API key usage:', error);
      return false;
    }
  }

  /**
   * Validate an API key
   */
  static async validateApiKey(key: string): Promise<{
    valid: boolean;
    userId?: string;
    keyType?: ApiKey['keyType'];
    message?: string;
  }> {
    try {
      // Find the key
      const apiKey = await this.getApiKeyByKey(key);
      
      if (!apiKey) {
        return {
          valid: false,
          message: 'Invalid API key'
        };
      }
      
      // Check if key is active
      if (!apiKey.isActive) {
        return {
          valid: false,
          message: 'API key is inactive'
        };
      }
      
      // Check if key has expired
      if (apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date()) {
        // Mark key as inactive
        await this.updateApiKey(apiKey.id, { isActive: false });
        
        return {
          valid: false,
          message: 'API key has expired'
        };
      }
      
      // Check if usage limit has been reached
      if (apiKey.usageLimit && apiKey.currentUsage && apiKey.currentUsage >= apiKey.usageLimit) {
        return {
          valid: false,
          message: 'API key usage limit reached'
        };
      }
      
      // Record usage
      await this.recordApiKeyUsage(key);
      
      return {
        valid: true,
        userId: apiKey.userId,
        keyType: apiKey.keyType
      };
    } catch (error) {
      console.error('Error validating API key:', error);
      
      return {
        valid: false,
        message: 'Error validating API key'
      };
    }
  }

  /**
   * Get prefix for key type
   */
  private static getKeyPrefix(keyType: string): string {
    switch (keyType) {
      case 'test':
        return 'test_';
      case 'train':
        return 'train_';
      case 'deploy':
        return 'deploy_';
      case 'production':
        return 'prod_';
      case 'development':
      default:
        return 'dev_';
    }
  }

  /**
   * Get usage limit for key type
   */
  private static getUsageLimitForKeyType(keyType: string): number {
    switch (keyType) {
      case 'test':
        return 100;
      case 'train':
        return 500;
      case 'deploy':
        return 1000;
      case 'production':
        return 10000;
      case 'development':
      default:
        return 250;
    }
  }
} 