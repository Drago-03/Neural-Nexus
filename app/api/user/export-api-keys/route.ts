import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserService } from '@/lib/models/user';

// Add dynamic export configuration
export const dynamic = 'force-dynamic';

// Force Node.js runtime for this route
export const runtime = 'nodejs';

/**
 * GET handler for /api/user/export-api-keys
 * Exports the user's API keys in a secure format
 */
export async function GET(req: NextRequest) {
  try {
    // Get current user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - You must be logged in to export your API keys' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    console.log(`Exporting API keys for user: ${userId}`);
    
    // Get user data to verify identity
    const userData = await UserService.getUserById(userId);
    
    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // In a real implementation, we would fetch the API keys from a separate service
    // For demonstration, we'll create a mock response with sample API keys
    
    // Sample API keys (these would come from a database in a real implementation)
    const mockApiKeys = [
      {
        id: `key_${Math.random().toString(36).substring(2, 10)}`,
        name: 'Development API Key',
        prefix: 'nxd_',
        // In a real app, we would never expose full API keys via an API response
        // For demo purposes only - this simulates a secure export
        key: `nxd_${Math.random().toString(36).substring(2, 30)}`,
        created: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        permissions: ['read:models', 'write:models'],
        rateLimit: 1000,
        status: 'active'
      },
      {
        id: `key_${Math.random().toString(36).substring(2, 10)}`,
        name: 'Production API Key',
        prefix: 'nxp_',
        key: `nxp_${Math.random().toString(36).substring(2, 30)}`,
        created: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        lastUsed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        permissions: ['read:models'],
        rateLimit: 5000,
        status: 'active'
      },
      {
        id: `key_${Math.random().toString(36).substring(2, 10)}`,
        name: 'Testing API Key',
        prefix: 'nxt_',
        key: `nxt_${Math.random().toString(36).substring(2, 30)}`,
        created: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        lastUsed: null,
        permissions: ['read:models', 'write:models', 'admin:models'],
        rateLimit: 500,
        status: 'inactive'
      }
    ];
    
    // Export metadata
    const exportData = {
      userId: userId,
      username: userData.username,
      email: userData.email,
      exportedAt: new Date().toISOString(),
      apiKeys: mockApiKeys,
      securityNotice: 'Keep your API keys secure. They provide access to your account and should be treated like passwords.',
      regenerationInstructions: 'If you believe your API keys have been compromised, regenerate them immediately from your dashboard.'
    };
    
    // Return the API keys export
    return NextResponse.json({
      success: true,
      data: {
        exportId: `apikeys-${userId}-${Date.now()}`,
        exportName: `api-keys-${userData.username}-${new Date().toISOString().split('T')[0]}.json`,
        exportedAt: new Date().toISOString(),
        exportData
      }
    });
    
  } catch (error: any) {
    console.error('Error exporting API keys:', error);
    
    return NextResponse.json({
      error: `Failed to export API keys: ${error.message || 'Unknown error'}`,
      success: false
    }, {
      status: 500
    });
  }
} 