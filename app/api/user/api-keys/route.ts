import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import crypto from 'crypto';

// Force Node.js runtime for this route
export const runtime = 'nodejs';

interface ApiKey {
  _id?: ObjectId;
  userId: string;
  name: string;
  key: string; // Hashed API key
  prefix: string; // Visible prefix for display
  created: Date;
  lastUsed?: Date;
  expiresAt?: Date;
  permissions: string[];
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
}

// GET /api/user/api-keys - Get user's API keys
export async function GET(req: NextRequest) {
  try {
    console.log("🔍 API Keys: Processing GET request");
    const startTime = Date.now();
    
    // Authenticate user
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.warn("🛑 API Keys: Unauthorized access attempt");
      return NextResponse.json(
        { error: 'Unauthorized - No active session' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    console.log(`✅ API Keys: Authenticated user ${userId}`);
    
    // Fetch API keys from database - real-time data
    try {
      const apiKeysCollection = await getCollection('api_keys');
      
      // Get user's API keys, don't return the hashed key value
      const apiKeys = await apiKeysCollection
        .find({ userId })
        .project({ key: 0 }) // Don't include the hashed key
        .sort({ created: -1 })
        .toArray();
      
      console.log(`📊 API Keys: Found ${apiKeys.length} keys for user ${userId}`);
      
      // Get usage data for each key
      const apiUsageCollection = await getCollection('api_usage');
      const usagePromises = apiKeys.map(async (key: any) => {
        const keyId = key._id.toString();
        const recentUsage = await apiUsageCollection
          .find({ apiKeyId: keyId })
          .sort({ timestamp: -1 })
          .limit(1)
          .toArray();
          
        // Update last used time if available
        if (recentUsage.length > 0) {
          key.lastUsed = recentUsage[0].timestamp;
        }
        
        // Count usage in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const monthlyUsage = await apiUsageCollection
          .countDocuments({ 
            apiKeyId: keyId,
            timestamp: { $gte: thirtyDaysAgo }
          });
          
        key.monthlyUsage = monthlyUsage;
        
        return key;
      });
      
      // Wait for all usage data to be fetched
      const keysWithUsage = await Promise.all(usagePromises);
      
      // Calculate response time
      const responseTime = Date.now() - startTime;
      console.log(`⏱️ API Keys: Request completed in ${responseTime}ms`);
      
      return NextResponse.json({
        success: true,
        apiKeys: keysWithUsage,
        totalCount: keysWithUsage.length,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error("❌ API Keys: Database error:", error);
      throw error;
    }
  } catch (error) {
    console.error('❌ API Keys: Error getting API keys:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch API keys',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/user/api-keys - Create a new API key
export async function POST(req: NextRequest) {
  try {
    console.log("🔍 API Keys: Processing POST request");
    const startTime = Date.now();
    
    // Authenticate user
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.warn("🛑 API Keys: Unauthorized access attempt");
      return NextResponse.json(
        { error: 'Unauthorized - No active session' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    console.log(`✅ API Keys: Authenticated user ${userId}`);
    
    // Parse request body
    const { name, permissions, expiresIn } = await req.json();
    
    if (!name) {
      return NextResponse.json(
        { error: 'Key name is required' },
        { status: 400 }
      );
    }
    
    // Generate new API key with prefix
    // Only show this to the user once - we'll store the hash
    const apiKeyRaw = crypto.randomBytes(32).toString('hex');
    const prefix = crypto.randomBytes(4).toString('hex');
    const displayKey = `${prefix}_${apiKeyRaw}`;
    
    // Hash the key for storage
    const hashedKey = crypto
      .createHash('sha256')
      .update(displayKey)
      .digest('hex');
    
    // Calculate expiry date if specified
    let expiresAt;
    if (expiresIn) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(expiresIn));
    }
    
    // Create API key record
    const newApiKey: ApiKey = {
      userId,
      name,
      key: hashedKey,
      prefix,
      created: new Date(),
      permissions: permissions || ['read'],
      usageCount: 0,
      isActive: true,
      expiresAt
    };
    
    try {
      // Save to database
      const apiKeysCollection = await getCollection('api_keys');
      const result = await apiKeysCollection.insertOne(newApiKey);
      
      if (!result.insertedId) {
        throw new Error('Failed to create API key');
      }
      
      console.log(`✅ API Keys: Created new key ${prefix} for user ${userId}`);
      
      // Calculate response time
      const responseTime = Date.now() - startTime;
      console.log(`⏱️ API Keys: Request completed in ${responseTime}ms`);
      
      // Return the key to the user - this is the only time they'll see it
      return NextResponse.json({
        success: true,
        apiKey: {
          id: result.insertedId,
          name,
          key: displayKey, // Only returned once
          prefix,
          created: newApiKey.created,
          permissions: newApiKey.permissions,
          expiresAt
        }
      }, { status: 201 });
    } catch (error) {
      console.error("❌ API Keys: Database error:", error);
      throw error;
    }
  } catch (error) {
    console.error('❌ API Keys: Error creating API key:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create API key',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/user/api-keys - Delete an API key
export async function DELETE(req: NextRequest) {
  try {
    console.log("🔍 API Keys: Processing DELETE request");
    const startTime = Date.now();
    
    // Authenticate user
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.warn("🛑 API Keys: Unauthorized access attempt");
      return NextResponse.json(
        { error: 'Unauthorized - No active session' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    // Get key ID from URL
    const { searchParams } = new URL(req.url);
    const keyId = searchParams.get('id');
    
    if (!keyId) {
      return NextResponse.json(
        { error: 'API key ID is required' },
        { status: 400 }
      );
    }
    
    console.log(`🔄 API Keys: Attempting to delete key ${keyId} for user ${userId}`);
    
    try {
      // Find and delete the key, ensuring it belongs to this user
      const apiKeysCollection = await getCollection('api_keys');
      const result = await apiKeysCollection.deleteOne({
        _id: new ObjectId(keyId),
        userId
      });
      
      if (result.deletedCount === 0) {
        console.warn(`❌ API Keys: No key found with ID ${keyId} for user ${userId}`);
        return NextResponse.json(
          { error: 'API key not found or does not belong to current user' },
          { status: 404 }
        );
      }
      
      console.log(`✅ API Keys: Successfully deleted key ${keyId}`);
      
      // Calculate response time
      const responseTime = Date.now() - startTime;
      console.log(`⏱️ API Keys: Request completed in ${responseTime}ms`);
      
      return NextResponse.json({
        success: true,
        message: 'API key deleted successfully'
      });
    } catch (error) {
      console.error("❌ API Keys: Database error:", error);
      throw error;
    }
  } catch (error) {
    console.error('❌ API Keys: Error deleting API key:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete API key',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PATCH /api/user/api-keys - Update an API key (e.g., to disable it)
export async function PATCH(req: NextRequest) {
  try {
    console.log("🔍 API Keys: Processing PATCH request");
    const startTime = Date.now();
    
    // Authenticate user
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.warn("🛑 API Keys: Unauthorized access attempt");
      return NextResponse.json(
        { error: 'Unauthorized - No active session' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    // Parse request body
    const { id, isActive, name, permissions } = await req.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'API key ID is required' },
        { status: 400 }
      );
    }
    
    console.log(`🔄 API Keys: Updating key ${id} for user ${userId}`);
    
    // Create update object
    const updates: Partial<ApiKey> = {};
    
    // Only include fields that are explicitly provided
    if (isActive !== undefined) updates.isActive = isActive;
    if (name) updates.name = name;
    if (permissions) updates.permissions = permissions;
    
    try {
      // Update the key, ensuring it belongs to this user
      const apiKeysCollection = await getCollection('api_keys');
      const result = await apiKeysCollection.updateOne(
        {
          _id: new ObjectId(id),
          userId
        },
        { $set: updates }
      );
      
      if (result.matchedCount === 0) {
        console.warn(`❌ API Keys: No key found with ID ${id} for user ${userId}`);
        return NextResponse.json(
          { error: 'API key not found or does not belong to current user' },
          { status: 404 }
        );
      }
      
      console.log(`✅ API Keys: Successfully updated key ${id}`);
      
      // Calculate response time
      const responseTime = Date.now() - startTime;
      console.log(`⏱️ API Keys: Request completed in ${responseTime}ms`);
      
      return NextResponse.json({
        success: true,
        message: 'API key updated successfully'
      });
    } catch (error) {
      console.error("❌ API Keys: Database error:", error);
      throw error;
    }
  } catch (error) {
    console.error('❌ API Keys: Error updating API key:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update API key',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 