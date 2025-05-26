import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/lib/models/user';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Force Node.js runtime for this route
export const runtime = 'nodejs';

// POST /api/user/avatar - Upload user avatar
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - No active session' },
        { status: 401 }
      );
    }
    
    console.log("Avatar upload request received for user:", session.user.id);
    
    // Get the form data
    let formData;
    try {
      formData = await req.formData();
    } catch (error) {
      console.error("Error parsing form data:", error);
      return NextResponse.json(
        { error: 'Invalid form data format' },
        { status: 400 }
      );
    }
    
    const avatarFile = formData.get('avatar') as File;
    
    if (!avatarFile) {
      return NextResponse.json(
        { error: 'No avatar file provided' },
        { status: 400 }
      );
    }
    
    console.log("Avatar file received:", avatarFile.name, "Type:", avatarFile.type, "Size:", avatarFile.size);
    
    // Validate file type
    if (!avatarFile.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      );
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (avatarFile.size > maxSize) {
      return NextResponse.json(
        { error: 'Image size must be less than 5MB' },
        { status: 400 }
      );
    }
    
    // Read file as buffer
    let buffer;
    try {
      const bytes = await avatarFile.arrayBuffer();
      buffer = Buffer.from(bytes);
      console.log("File successfully read as buffer, size:", buffer.length);
    } catch (error) {
      console.error("Error reading file buffer:", error);
      return NextResponse.json(
        { error: 'Failed to process image file' },
        { status: 500 }
      );
    }
    
    // Generate a unique filename
    const timestamp = Date.now();
    const fileExtension = avatarFile.name.split('.').pop() || 'jpg';
    const filename = `avatar-${session.user.id}-${timestamp}.${fileExtension}`;
    
    // In a real app, you would upload to cloud storage here
    // For now, we'll use a data URL approach since we don't have cloud storage setup
    const base64 = buffer.toString('base64');
    const mimeType = avatarFile.type;
    const dataUrl = `data:${mimeType};base64,${base64}`;
    
    console.log("Generated avatar data URL");
    
    // Update user profile with new avatar URL
    try {
      const success = await UserService.updateUser(session.user.id, {
        avatar: dataUrl
      });
      
      if (!success) {
        return NextResponse.json(
          { error: 'Failed to update user avatar' },
          { status: 500 }
        );
      }
      
      console.log("Avatar URL successfully updated for user:", session.user.id);
      
      return NextResponse.json({
        success: true,
        avatar: dataUrl
      });
    } catch (updateError) {
      console.error("Error updating user avatar:", updateError);
      return NextResponse.json(
        { error: 'Failed to update user profile with avatar' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return NextResponse.json(
      { error: 'Failed to upload avatar' },
      { status: 500 }
    );
  }
} 