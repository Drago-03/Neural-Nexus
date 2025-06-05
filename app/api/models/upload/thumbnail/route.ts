import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadFile } from '@/lib/gcloud-storage';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

// Limit uploads to 5MB
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;

// Force Node.js runtime
export const runtime = 'nodejs';

/**
 * Handle model thumbnail uploads
 */
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - User not authenticated' },
        { status: 401 }
      );
    }
    
    // Parse multipart form data
    const formData = await req.formData();
    const file = formData.get('thumbnail') as File;
    const modelId = formData.get('modelId') as string;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No thumbnail file provided' },
        { status: 400 }
      );
    }
    
    if (!modelId) {
      return NextResponse.json(
        { error: 'Model ID is required' },
        { status: 400 }
      );
    }
    
    // Check file size
    if (file.size > MAX_UPLOAD_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${MAX_UPLOAD_SIZE / (1024 * 1024)}MB` },
        { status: 400 }
      );
    }
    
    // Check file type
    const fileType = file.type;
    if (!fileType.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      );
    }
    
    // Process the image
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Resize and optimize the image using sharp
    const optimizedImageBuffer = await sharp(buffer)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .toFormat('webp', { quality: 85 })
      .toBuffer();
    
    // Generate unique file path
    const userId = session.user.id;
    const uniqueId = uuidv4();
    const filePath = `thumbnails/${userId}/${modelId}/${uniqueId}.webp`;
    
    // Upload to Google Cloud Storage
    try {
      console.log(`Uploading thumbnail for model ${modelId} to ${filePath}`);
      const fileUrl = await uploadFile(filePath, optimizedImageBuffer, 'image/webp');
      
      // Return success response
      return NextResponse.json({
        success: true,
        thumbnail: {
          url: fileUrl,
          path: filePath
        }
      });
    } catch (uploadError) {
      console.error('Error uploading thumbnail:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload thumbnail to storage' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error handling thumbnail upload:', error);
    return NextResponse.json(
      { error: 'Failed to process thumbnail upload' },
      { status: 500 }
    );
  }
} 