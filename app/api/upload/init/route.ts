import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import supabase from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * API route to initialize a chunked upload
 * POST /api/upload/init
 * 
 * Initializes a new upload process and returns an uploadId
 * that will be used to track this upload across chunks
 */
export async function POST(req: NextRequest) {
  try {
    // Check auth
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const { fileName, fileSize, fileType, totalChunks } = await req.json();
    
    if (!fileName || !fileSize || !fileType || !totalChunks) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate upload ID and safe filename
    const uploadId = uuidv4();
    const userId = session.user.id;
    const timestamp = Date.now();
    const safeFileName = `${userId}/${timestamp}-${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    
    // Create an upload record in Supabase
    const { data, error } = await supabase
      .from('model_uploads')
      .insert({
        upload_id: uploadId,
        user_id: userId,
        original_name: fileName,
        storage_path: safeFileName,
        file_size: fileSize,
        file_type: fileType,
        total_chunks: totalChunks,
        chunks_received: 0,
        status: 'initialized',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();
    
    if (error) {
      console.error('Error creating upload record:', error);
      return NextResponse.json(
        { error: 'Failed to initialize upload' },
        { status: 500 }
      );
    }
    
    // Also create a directory structure in Supabase Storage
    const dirPath = `uploads/${userId}/${uploadId}`;
    const { error: storageError } = await supabase.storage
      .from('model-files')
      .upload(`${dirPath}/.placeholder`, new Blob([''], { type: 'text/plain' }));
    
    if (storageError) {
      console.error('Error creating storage directory:', storageError);
      // Not failing here, just logging the error
    }

    return NextResponse.json({
      success: true,
      uploadId,
      storagePath: safeFileName,
      message: 'Upload initialized successfully'
    });
  } catch (error) {
    console.error('Error initializing upload:', error);
    return NextResponse.json(
      { error: 'Failed to initialize upload' },
      { status: 500 }
    );
  }
} 