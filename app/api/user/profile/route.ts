import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/lib/models/user';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Force Node.js runtime for this route
export const runtime = 'nodejs';

// GET /api/user/profile - Get user profile status
export async function GET(req: NextRequest) {
  try {
    console.log("GET /api/user/profile - Checking profile status");
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.error("Profile status check failed: No active session");
      return NextResponse.json(
        { error: 'Unauthorized - No active session' },
        { status: 401 }
      );
    }
    
    console.log(`Checking profile completion status for user: ${session.user.id}`);
    
    // Check if profile is complete
    const isComplete = await UserService.isProfileComplete(session.user.id);
    
    console.log(`Profile completion status for user ${session.user.id}: ${isComplete ? 'Complete' : 'Incomplete'}`);
    
    return NextResponse.json({ 
      isComplete,
      userId: session.user.id
    });
  } catch (error) {
    console.error('Error checking profile status:', error);
    return NextResponse.json(
      { error: 'Failed to check profile status' },
      { status: 500 }
    );
  }
}

// POST /api/user/profile - Complete user profile
export async function POST(req: NextRequest) {
  try {
    console.log("POST /api/user/profile - Starting profile update");
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.error("Profile update failed: No active session");
      return NextResponse.json(
        { error: 'Unauthorized - No active session' },
        { status: 401 }
      );
    }
    
    console.log("User authenticated:", session.user.id);
    
    let profileData;
    try {
      profileData = await req.json();
      console.log("Received profile data:", JSON.stringify(profileData));
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }
    
    // Validate required fields
    if (!profileData.displayName) {
      console.error("Profile update failed: Name is required");
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }
    
    // Sanitize the data to handle undefined values properly
    const sanitizedData = {
      displayName: profileData.displayName,
      bio: profileData.bio || '',
      // Optional fields - only include if provided
      organization: profileData.organization || undefined,
      jobTitle: profileData.jobTitle || undefined,
      location: profileData.location || undefined,
      website: profileData.website || undefined,
      skills: Array.isArray(profileData.skills) ? profileData.skills : [],
      interests: Array.isArray(profileData.interests) ? profileData.interests : []
    };
    
    console.log("Sanitized profile data:", JSON.stringify(sanitizedData));
    
    try {
      // First check if user exists in database
      const existingUser = await UserService.getUserById(session.user.id);
      
      if (!existingUser) {
        console.error(`User ${session.user.id} not found in database. Creating new user record.`);
        
        // Instead of trying to create a new user which requires fields we don't have,
        // we'll just update the profile directly, as MongoDB will create the document
        // if it doesn't exist when we do the profile update.
        console.log(`Will create user ${session.user.id} during profile update`);
      }
      
      // Complete the user profile
      console.log(`Updating profile for user ${session.user.id}`);
      const success = await UserService.completeProfile(
        session.user.id,
        sanitizedData
      );
      
      if (!success) {
        console.error(`Profile update failed for user ${session.user.id}: Database operation failed`);
        return NextResponse.json(
          { error: 'Failed to update profile' },
          { status: 500 }
        );
      }
      
      console.log(`Profile update successful for user ${session.user.id}`);
      
      // Get updated user data
      const updatedUser = await UserService.getUserById(session.user.id);
      
      if (!updatedUser) {
        console.error(`Could not retrieve updated user data for ${session.user.id}`);
        return NextResponse.json({
          success: true,
          message: 'Profile updated but could not retrieve updated data',
          user: { ...sanitizedData, _id: session.user.id }
        });
      }
      
      console.log(`Retrieved updated user data for ${session.user.id}`);
      
      return NextResponse.json({
        success: true,
        message: 'Profile completed successfully',
        user: updatedUser
      });
    } catch (dbError: any) {
      console.error(`Database error during profile update for user ${session.user.id}:`, dbError);
      return NextResponse.json(
        { error: `Database operation failed: ${dbError.message || 'Unknown error'}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error completing profile:', error);
    return NextResponse.json(
      { error: `Failed to complete profile: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
} 