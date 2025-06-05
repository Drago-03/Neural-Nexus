import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadFile } from '@/lib/gcloud-storage';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';

// Limit uploads to 100MB (in bytes)
const MAX_UPLOAD_SIZE = 100 * 1024 * 1024;

// Force Node.js runtime for this API route
export const runtime = 'nodejs';

/**
 * Handle model file uploads
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
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
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
    
    // Get file details
    const fileName = file.name;
    const fileType = file.type;
    const fileSize = file.size;
    
    // Generate unique file path
    const userId = session.user.id;
    const uniqueId = uuidv4();
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `models/${userId}/${uniqueId}/${safeName}`;
    
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Upload to Google Cloud Storage
    try {
      console.log(`Uploading file ${fileName} (${fileSize} bytes) to ${filePath}`);
      const fileUrl = await uploadFile(filePath, buffer, fileType);
      
      // Return success response
      return NextResponse.json({
        success: true,
        file: {
          url: fileUrl,
          path: filePath,
          name: fileName,
          size: fileSize,
          type: fileType
        }
      });
    } catch (uploadError) {
      console.error('Error uploading file:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload file to storage' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error handling file upload:', error);
    return NextResponse.json(
      { error: 'Failed to process file upload' },
      { status: 500 }
    );
  }
}

/**
 * Return upload limits and configuration
 */
export async function GET() {
  return NextResponse.json({
    limits: {
      maxSize: MAX_UPLOAD_SIZE,
      maxSizeMB: MAX_UPLOAD_SIZE / (1024 * 1024),
      supportedFormats: [
        'application/x-hdf5',
        'application/octet-stream',
        'application/zip',
        'application/x-zip-compressed',
        'application/x-compressed',
        'multipart/x-zip',
        'application/x-tar',
        'application/x-gzip',
        'application/gzip',
        'application/x-bzip2',
        'application/x-7z-compressed',
        'application/json',
        'text/plain',
        'application/onnx',
        'application/pytorch',
        'application/tensorflow',
        'application/x-pytorch',
        'application/x-tensorflow'
      ]
    }
  });
} 