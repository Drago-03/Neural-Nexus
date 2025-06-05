import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

// Get local storage paths from fallback module
let UPLOADS_DIR: string;
try {
  // Only import in development mode
  if (process.env.NODE_ENV !== 'production') {
    const fallback = require('@/lib/gcloud-storage-fallback');
    UPLOADS_DIR = fallback.UPLOADS_DIR;
  }
} catch (error) {
  console.error('Error importing storage fallback:', error);
}

/**
 * GET handler for local storage files
 * This route serves files stored locally during development
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  // Only available in development mode
  if (process.env.NODE_ENV === 'production') {
    return new NextResponse('Not found', { status: 404 });
  }

  try {
    // Get file path from params
    const filePath = params.path.join('/');
    
    // Get full path to file
    const fullPath = path.join(UPLOADS_DIR, filePath);
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return new NextResponse('File not found', { status: 404 });
    }
    
    // Get file stats
    const stats = fs.statSync(fullPath);
    
    // Read file
    const fileBuffer = fs.readFileSync(fullPath);
    
    // Get content type
    const contentType = mime.lookup(fullPath) || 'application/octet-stream';
    
    // Return file
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': stats.size.toString(),
        'Cache-Control': 'public, max-age=31536000',
        'Last-Modified': stats.mtime.toUTCString(),
      },
    });
  } catch (error) {
    console.error('Error serving local storage file:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
} 