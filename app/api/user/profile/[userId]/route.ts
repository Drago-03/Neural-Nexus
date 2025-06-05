import { NextRequest, NextResponse } from 'next/server';
import { UserProfileService } from '@/lib/services/user-profile-service';

// Add static export configuration
export const dynamic = 'force-dynamic';

// Force Node.js runtime for this route
export const runtime = 'nodejs';

/**
 * GET /api/user/profile/[userId]
 * Gets a user's profile by userId
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }
    
    console.log(`Fetching profile for user: ${userId}`);
    
    // Get user profile
    const profile = await UserProfileService.getProfileByUserId(userId);
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }
    
    // Return profile data (excluding sensitive fields)
    return NextResponse.json({
      success: true,
      profile: {
        id: profile.id,
        userId: profile.userId,
        displayName: profile.displayName,
        bio: profile.bio,
        avatarUrl: profile.avatarUrl,
        socialLinks: profile.socialLinks,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt
      }
    });
    
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    
    return NextResponse.json({
      error: `Failed to fetch profile: ${error.message || 'Unknown error'}`,
      success: false
    }, {
      status: 500
    });
  }
} 