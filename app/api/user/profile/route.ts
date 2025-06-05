import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserProfileService } from '@/lib/services/user-profile-service';
import { StorageService } from '@/lib/services/storage-service';

// Add static export configuration
export const dynamic = 'force-dynamic';

// Force Node.js runtime for this route
export const runtime = 'nodejs';

/**
 * GET handler for /api/user/profile
 * Gets the user's profile
 */
export async function GET(req: NextRequest) {
  try {
    // Get current user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.error("Profile fetch failed: No active session");
      return NextResponse.json(
        { error: 'Unauthorized - You must be logged in to view your profile' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
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
    const { email, userId: profileUserId, ...safeProfileData } = profile;
    
    return NextResponse.json({
      success: true,
      profile: {
        ...safeProfileData,
        email: session.user.email, // Only include email from session for security
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

/**
 * POST handler for /api/user/profile
 * Updates the user's profile
 */
export async function POST(req: NextRequest) {
  try {
    // Get current user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.error("Profile update failed: No active session");
      return NextResponse.json(
        { error: 'Unauthorized - You must be logged in to update your profile' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    const email = session.user.email || '';
    
    // Initialize storage if needed
    await StorageService.initStorage();
    
    // Check if we're dealing with a multipart form (file upload)
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await req.formData();
      const file = formData.get('avatar') as File | null;
      const displayName = formData.get('displayName') as string || undefined;
      const bio = formData.get('bio') as string || undefined;
      const twitterLink = formData.get('twitter') as string || undefined;
      const githubLink = formData.get('github') as string || undefined;
      const linkedinLink = formData.get('linkedin') as string || undefined;
      const websiteLink = formData.get('website') as string || undefined;
      
      // Build profile updates
      const profileUpdates: any = {
        displayName,
        bio,
        socialLinks: {
          twitter: twitterLink,
          github: githubLink,
          linkedin: linkedinLink,
          website: websiteLink
        }
      };
      
      // Get existing profile or create new one
      let profile = await UserProfileService.getProfileByUserId(userId);
      
      if (!profile) {
        profile = await UserProfileService.createProfile({
          userId,
          email,
          ...profileUpdates
        });
        
        if (!profile) {
          return NextResponse.json(
            { error: 'Failed to create user profile' },
            { status: 500 }
          );
        }
      } else {
        // Update existing profile (without avatar yet)
        profile = await UserProfileService.updateProfile(userId, profileUpdates);
        
        if (!profile) {
          return NextResponse.json(
            { error: 'Failed to update user profile' },
            { status: 500 }
          );
        }
      }
      
      // Process avatar upload if present
      if (file) {
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const fileType = file.type || 'image/png';
        
        // Upload avatar
        const avatarUrl = await UserProfileService.uploadAvatar(
          userId,
          fileBuffer,
          fileType
        );
        
        if (avatarUrl) {
          profile.avatarUrl = avatarUrl;
        }
      }
      
      return NextResponse.json({
        success: true,
        profile: {
          ...profile,
          email: session.user.email // Only include email from session for security
        }
      });
    } else {
      // Handle regular JSON body
      const data = await req.json();
      
      // Get existing profile or create new one
      let profile = await UserProfileService.getProfileByUserId(userId);
      
      if (!profile) {
        profile = await UserProfileService.createProfile({
          userId,
          email,
          ...data
        });
        
        if (!profile) {
          return NextResponse.json(
            { error: 'Failed to create user profile' },
            { status: 500 }
          );
        }
      } else {
        // Update existing profile
        profile = await UserProfileService.updateProfile(userId, data);
        
        if (!profile) {
          return NextResponse.json(
            { error: 'Failed to update user profile' },
            { status: 500 }
          );
        }
      }
      
      return NextResponse.json({
        success: true,
        profile: {
          ...profile,
          email: session.user.email // Only include email from session for security
        }
      });
    }
    
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    
    return NextResponse.json({
      error: `Failed to update profile: ${error.message || 'Unknown error'}`,
      success: false
    }, {
      status: 500
    });
  }
}

/**
 * DELETE handler for /api/user/profile
 * Deletes specific profile data (not the entire profile)
 */
export async function DELETE(req: NextRequest) {
  try {
    // Get current user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.error("Profile update failed: No active session");
      return NextResponse.json(
        { error: 'Unauthorized - You must be logged in to update your profile' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    // Get params from URL
    const url = new URL(req.url);
    const field = url.searchParams.get('field');
    
    if (!field) {
      return NextResponse.json(
        { error: 'Missing required parameter: field' },
        { status: 400 }
      );
    }
    
    // Get existing profile
    const profile = await UserProfileService.getProfileByUserId(userId);
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }
    
    // Handle different field deletions
    let updates: any = {};
    
    switch (field) {
      case 'avatar':
        updates.avatarUrl = '';
        break;
      case 'bio':
        updates.bio = '';
        break;
      case 'socialLinks':
        updates.socialLinks = {};
        break;
      default:
        return NextResponse.json(
          { error: `Cannot delete unknown field: ${field}` },
          { status: 400 }
        );
    }
    
    // Update profile
    const updatedProfile = await UserProfileService.updateProfile(userId, updates);
    
    if (!updatedProfile) {
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: `Successfully removed ${field} from profile`,
      profile: {
        ...updatedProfile,
        email: session.user.email // Only include email from session for security
      }
    });
    
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    
    return NextResponse.json({
      error: `Failed to update profile: ${error.message || 'Unknown error'}`,
      success: false
    }, {
      status: 500
    });
  }
} 