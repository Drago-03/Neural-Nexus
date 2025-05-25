import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/lib/models/user';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Force Node.js runtime for this route
export const runtime = 'nodejs';

// GET /api/user/profile - Get user profile status
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - No active session' },
        { status: 401 }
      );
    }
    
    // Check if profile is complete
    const isComplete = await UserService.isProfileComplete(session.user.id);
    
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
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - No active session' },
        { status: 401 }
      );
    }
    
    const profileData = await req.json();
    
    // Validate required fields
    if (!profileData.displayName) {
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
    
    // Complete the user profile
    const success = await UserService.completeProfile(
      session.user.id,
      sanitizedData
    );
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 400 }
      );
    }
    
    // Get updated user data
    const updatedUser = await UserService.getUserById(session.user.id);
    
    return NextResponse.json({
      success: true,
      message: 'Profile completed successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error completing profile:', error);
    return NextResponse.json(
      { error: 'Failed to complete profile' },
      { status: 500 }
    );
  }
} 