import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/lib/models/user';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { FileStorage } from '@/lib/utils/fileStorage';

// Force Node.js runtime for this route
export const runtime = 'nodejs';

// POST /api/user/avatar - Upload user avatar
export async function POST(req: NextRequest) {
  try {
    console.log("POST /api/user/avatar - Starting avatar upload");
    
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.error("Avatar upload failed: No active session");
      return NextResponse.json(
        { error: 'Unauthorized - No active session' },
        { status: 401 }
      );
    }
    
    console.log("User authenticated:", session.user.id);
    
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
      console.error("No avatar file provided");
      return NextResponse.json(
        { error: 'No avatar file provided' },
        { status: 400 }
      );
    }
    
    console.log("Avatar file received:", avatarFile.name, "Type:", avatarFile.type, "Size:", avatarFile.size);
    
    // Validate file type
    if (!avatarFile.type.startsWith('image/')) {
      console.error("Invalid file type:", avatarFile.type);
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      );
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (avatarFile.size > maxSize) {
      console.error("File too large:", avatarFile.size);
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
    const fileExtension = avatarFile.name.split('.').pop() || 'jpg';
    const filename = `avatar-${session.user.id}-${randomUUID()}.${fileExtension}`;
    
    try {
      // Ensure upload directory exists
      await FileStorage.ensureUploadDirectories();
      
      // Get upload path
      const uploadPath = FileStorage.getUploadPath('avatars');
      const filePath = path.join(uploadPath, filename);
      
      // Save file to disk
      await writeFile(filePath, buffer);
      console.log("File saved to disk:", filePath);
      
      // Generate public URL
      const avatarUrl = `/uploads/avatars/${filename}`;
      
      // Update user profile with new avatar URL
      const success = await UserService.updateUser(session.user.id, {
        avatar: avatarUrl
      });
      
      if (!success) {
        console.error("Failed to update user avatar in database");
        return NextResponse.json(
          { error: 'Failed to update user avatar' },
          { status: 500 }
        );
      }
      
      console.log("Avatar URL successfully updated for user:", session.user.id);
      
      return NextResponse.json({
        success: true,
        avatar: avatarUrl
      });
    } catch (error) {
      console.error("Error saving avatar file:", error);
      return NextResponse.json(
        { error: 'Failed to save avatar file' },
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