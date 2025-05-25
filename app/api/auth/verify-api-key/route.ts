import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import crypto from 'crypto';

// Force Node.js runtime for this route
export const runtime = 'nodejs';

// POST /api/auth/verify-api-key - Verify an API key
export async function POST(req: NextRequest) {
  try {
    console.log("🔍 Auth: Verifying API key");
    const startTime = Date.now();
    
    // Get API key from request
    const { apiKey } = await req.json();
    
    if (!apiKey) {
      console.warn("🛑 Auth: Missing API key in request");
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }
    
    // Parse API key (format: prefix_key)
    const [prefix, ...keyParts] = apiKey.split('_');
    const key = keyParts.join('_'); // In case key itself contains underscores
    
    if (!prefix || !key) {
      console.warn("🛑 Auth: Invalid API key format");
      return NextResponse.json(
        { error: 'Invalid API key format' },
        { status: 400 }
      );
    }
    
    // Hash the provided key for comparison
    const hashedProvidedKey = crypto
      .createHash('sha256')
      .update(apiKey) // Hash the full key including prefix
      .digest('hex');
    
    try {
      // Look up the key in the database
      const apiKeysCollection = await getCollection('api_keys');
      const keyRecord = await apiKeysCollection.findOne({
        prefix,
        key: hashedProvidedKey,
        isActive: true
      });
      
      if (!keyRecord) {
        console.warn(`❌ Auth: Invalid or inactive API key with prefix ${prefix}`);
        return NextResponse.json(
          { error: 'Invalid or inactive API key' },
          { status: 401 }
        );
      }
      
      // Check if key has expired
      if (keyRecord.expiresAt && new Date(keyRecord.expiresAt) < new Date()) {
        console.warn(`❌ Auth: Expired API key with prefix ${prefix}`);
        
        // Update key to inactive
        await apiKeysCollection.updateOne(
          { _id: keyRecord._id },
          { $set: { isActive: false } }
        );
        
        return NextResponse.json(
          { error: 'API key has expired' },
          { status: 401 }
        );
      }
      
      // Check usage limits if applicable
      if (keyRecord.usageLimit && keyRecord.usageCount >= keyRecord.usageLimit) {
        console.warn(`❌ Auth: API key usage limit exceeded for key with prefix ${prefix}`);
        return NextResponse.json(
          { error: 'API key usage limit exceeded' },
          { status: 429 }
        );
      }
      
      // Update usage count and last used time
      await apiKeysCollection.updateOne(
        { _id: keyRecord._id },
        { 
          $inc: { usageCount: 1 },
          $set: { lastUsed: new Date() }
        }
      );
      
      // Log API usage
      const apiUsageCollection = await getCollection('api_usage');
      await apiUsageCollection.insertOne({
        apiKeyId: keyRecord._id.toString(),
        userId: keyRecord.userId,
        timestamp: new Date(),
        endpoint: req.headers.get('referer') || 'unknown',
        ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown'
      });
      
      console.log(`✅ Auth: Successfully verified API key for user ${keyRecord.userId}`);
      
      // Calculate response time
      const responseTime = Date.now() - startTime;
      console.log(`⏱️ Auth: Request completed in ${responseTime}ms`);
      
      // Return user info and permissions but not the key itself
      return NextResponse.json({
        success: true,
        user: {
          id: keyRecord.userId,
          keyName: keyRecord.name,
          permissions: keyRecord.permissions
        },
        usageCount: keyRecord.usageCount + 1, // Include the current usage
        rateLimit: {
          limit: keyRecord.usageLimit || null,
          remaining: keyRecord.usageLimit ? (keyRecord.usageLimit - keyRecord.usageCount - 1) : null
        }
      });
    } catch (error) {
      console.error("❌ Auth: Database error:", error);
      throw error;
    }
  } catch (error) {
    console.error('❌ Auth: Error verifying API key:', error);
    return NextResponse.json(
      { 
        error: 'Failed to verify API key',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 