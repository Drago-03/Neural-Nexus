import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserService } from '@/lib/models/user';
import crypto from 'crypto';
import { ObjectId } from 'mongodb';
import { getCollection } from '@/lib/mongodb';

// Add dynamic export configuration
export const dynamic = 'force-dynamic';

// Force Node.js runtime for this route
export const runtime = 'nodejs';

// Interface for API key
interface ApiKey {
  _id?: ObjectId;
  userId: string;
  name: string;
  key: string;
  prefix: string;
  keyType: 'test' | 'train' | 'deploy' | 'development' | 'production';
  createdAt: Date;
  lastUsed?: Date;
  expiresAt?: Date;
  usageLimit?: number;
  currentUsage?: number;
  isActive: boolean;
}

/**
 * GET handler for /api/user/api-keys
 * Retrieves all API keys for the authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    // Get current user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - You must be logged in to access API keys' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    // Get API keys collection
    const collection = await getCollection<ApiKey>('api_keys');
    
    // Get all API keys for this user
    const apiKeys = await collection.find({ userId }).toArray();
    
    // Mask the actual keys before returning (security best practice)
    const maskedApiKeys = apiKeys.map(key => {
      // Create a display version that only shows a few characters
      const keyLength = key.key.length;
      const maskedKey = `${key.prefix}${key.key.substring(4, 8)}...${key.key.substring(keyLength - 4)}`;
      
      return {
        ...key,
        key: maskedKey
      };
    });
    
    return NextResponse.json({
      success: true,
      apiKeys: maskedApiKeys
    });
    
  } catch (error: any) {
    console.error('Error retrieving API keys:', error);
    
    return NextResponse.json({
      error: `Failed to retrieve API keys: ${error.message || 'Unknown error'}`,
      success: false
    }, {
      status: 500
    });
  }
}

/**
 * POST handler for /api/user/api-keys
 * Creates a new API key for the authenticated user
 */
export async function POST(req: NextRequest) {
  try {
    // Get current user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - You must be logged in to create API keys' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    // Parse request body
    const body = await req.json();
    const { name = 'API Key', keyType = 'development' } = body;
    
    // Get API keys collection
    const collection = await getCollection<ApiKey>('api_keys');
    
    // Check the number of existing API keys for this user
    const existingKeysCount = await collection.countDocuments({ userId });
    
    // Limit the number of API keys a user can have (optional)
    const maxApiKeys = 10;
    if (existingKeysCount >= maxApiKeys) {
      return NextResponse.json(
        { error: `You've reached the maximum limit of ${maxApiKeys} API keys` },
        { status: 400 }
      );
    }
    
    // Generate a unique API key
    const keyPrefix = getKeyPrefix(keyType);
    const key = `${keyPrefix}${crypto.randomBytes(24).toString('hex')}`;
    
    // Set usage limit based on key type
    const usageLimit = getUsageLimitForKeyType(keyType);
    
    // Create the new API key record
    const newApiKey: ApiKey = {
      userId,
      name,
      key,
      prefix: keyPrefix,
      keyType: keyType as ApiKey['keyType'],
      createdAt: new Date(),
      usageLimit,
      currentUsage: 0,
      isActive: true
    };
    
    // Insert the new API key
    const result = await collection.insertOne(newApiKey);
    
    if (!result.acknowledged) {
      throw new Error('Failed to create API key');
    }
    
    // Return the newly created API key (this is the only time the full key is returned)
    return NextResponse.json({
      success: true,
      message: 'API key created successfully',
      apiKey: {
        ...newApiKey,
        _id: result.insertedId
      }
    });
    
  } catch (error: any) {
    console.error('Error creating API key:', error);
    
    return NextResponse.json({
      error: `Failed to create API key: ${error.message || 'Unknown error'}`,
      success: false
    }, {
      status: 500
    });
  }
}

/**
 * DELETE handler for /api/user/api-keys
 * Deletes an API key for the authenticated user
 */
export async function DELETE(req: NextRequest) {
  try {
    // Get current user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - You must be logged in to delete API keys' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    // Get API key ID from query parameters
    const url = new URL(req.url);
    const keyId = url.searchParams.get('id');
    
    if (!keyId) {
      return NextResponse.json(
        { error: 'API key ID is required' },
        { status: 400 }
      );
    }
    
    // Get API keys collection
    const collection = await getCollection<ApiKey>('api_keys');
    
    // Find the API key to ensure it belongs to this user
    const apiKey = await collection.findOne({
      _id: new ObjectId(keyId),
      userId
    });
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not found or does not belong to you' },
        { status: 404 }
      );
    }
    
    // Delete the API key
    const result = await collection.deleteOne({
      _id: new ObjectId(keyId),
      userId
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Failed to delete API key' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'API key deleted successfully'
    });
    
  } catch (error: any) {
    console.error('Error deleting API key:', error);
    
    return NextResponse.json({
      error: `Failed to delete API key: ${error.message || 'Unknown error'}`,
      success: false
    }, {
      status: 500
    });
  }
}

/**
 * PATCH handler for /api/user/api-keys
 * Updates an API key (refresh or toggle active state)
 */
export async function PATCH(req: NextRequest) {
  try {
    // Get current user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - You must be logged in to update API keys' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    // Parse request body
    const body = await req.json();
    const { keyId, action } = body;
    
    if (!keyId || !action) {
      return NextResponse.json(
        { error: 'API key ID and action are required' },
        { status: 400 }
      );
    }
    
    // Verify that the action is valid
    if (!['refresh', 'toggle'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Supported actions: refresh, toggle' },
        { status: 400 }
      );
    }
    
    // Get API keys collection
    const collection = await getCollection<ApiKey>('api_keys');
    
    // Find the API key to ensure it belongs to this user
    const apiKey = await collection.findOne({
      _id: new ObjectId(keyId),
      userId
    });
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not found or does not belong to you' },
        { status: 404 }
      );
    }
    
    if (action === 'refresh') {
      // Generate a new key but keep the same settings
      const newKey = `${apiKey.prefix}${crypto.randomBytes(24).toString('hex')}`;
      
      // Update the API key
      const result = await collection.updateOne(
        { _id: new ObjectId(keyId), userId },
        { 
          $set: { 
            key: newKey,
            createdAt: new Date(),
            currentUsage: 0
          } 
        }
      );
      
      if (result.modifiedCount === 0) {
        return NextResponse.json(
          { error: 'Failed to refresh API key' },
          { status: 500 }
        );
      }
      
      // Return the refreshed API key
      return NextResponse.json({
        success: true,
        message: 'API key refreshed successfully',
        apiKey: {
          ...apiKey,
          key: newKey,
          createdAt: new Date(),
          currentUsage: 0
        }
      });
      
    } else if (action === 'toggle') {
      // Toggle the active state
      const newActiveState = !apiKey.isActive;
      
      // Update the API key
      const result = await collection.updateOne(
        { _id: new ObjectId(keyId), userId },
        { $set: { isActive: newActiveState } }
      );
      
      if (result.modifiedCount === 0) {
        return NextResponse.json(
          { error: 'Failed to toggle API key state' },
          { status: 500 }
        );
      }
      
      return NextResponse.json({
        success: true,
        message: `API key ${newActiveState ? 'activated' : 'deactivated'} successfully`,
        isActive: newActiveState
      });
    }
    
  } catch (error: any) {
    console.error('Error updating API key:', error);
    
    return NextResponse.json({
      error: `Failed to update API key: ${error.message || 'Unknown error'}`,
      success: false
    }, {
      status: 500
    });
  }
}

/**
 * Helper function to get a prefix for different key types
 */
function getKeyPrefix(keyType: string): string {
  switch (keyType) {
    case 'test': return 'nxt_';
    case 'train': return 'ntr_';
    case 'deploy': return 'ndp_';
    case 'production': return 'npr_';
    case 'development':
    default: return 'nnd_';
  }
}

/**
 * Helper function to get usage limits for different key types
 */
function getUsageLimitForKeyType(keyType: string): number {
  switch (keyType) {
    case 'test': return 1000;
    case 'train': return 10000;
    case 'deploy': return 50000;
    case 'production': return 100000;
    case 'development':
    default: return 5000;
  }
} 