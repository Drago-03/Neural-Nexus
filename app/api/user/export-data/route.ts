import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserService } from '@/lib/models/user';

// Force Node.js runtime for this route
export const runtime = 'nodejs';

// Add dynamic export configuration
export const dynamic = 'force-dynamic';

/**
 * GET handler for /api/user/export-data
 * Generates an export of the user's data
 */
export async function GET(req: NextRequest) {
  try {
    // Get current user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - You must be logged in to export your data' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    console.log(`Generating data export for user: ${userId}`);
    
    // Get user data
    const userData = await UserService.getUserById(userId);
    
    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Build a comprehensive export object
    const userExport = {
      // Basic account info
      accountInfo: {
        id: userData._id ? userData._id.toString() : userId,
        username: userData.username,
        email: userData.email,
        name: userData.name,
        createdAt: userData.createdAt,
        lastLogin: userData.lastLogin || null,
        profileComplete: userData.profileComplete,
      },
      
      // Profile data
      profile: {
        bio: userData.bio || null,
        avatar: userData.avatar || null,
        location: userData.location || null,
        website: userData.website || null,
        skills: userData.skills || [],
        interests: userData.interests || [],
        socialLinks: userData.socialLinks || {},
      },
      
      // User preferences
      preferences: userData.preferences || {
        theme: 'system',
        emailNotifications: true,
        twoFactorEnabled: false
      },
      
      // Would normally include model data, API keys, activity
      // These would be fetched from their respective services
      models: [], // Placeholder - would be populated with actual models
      apiKeys: [], // Placeholder - would be populated with actual API keys
      activities: [], // Placeholder - would be populated with activity data
      
      // Export metadata
      exportInfo: {
        exportDate: new Date().toISOString(),
        exportedBy: userId,
        exportVersion: '1.0.0'
      }
    };
    
    // Return the data export
    return NextResponse.json({
      success: true,
      data: userExport
    });
    
  } catch (error: any) {
    console.error('Error generating data export:', error);
    
    return NextResponse.json({
      error: `Failed to export data: ${error.message || 'Unknown error'}`,
      success: false
    }, {
      status: 500
    });
  }
} 