import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import supabase from '@/lib/supabase';

/**
 * API route to handle file chunk uploads
 * POST /api/upload/chunk
 * 
 * Receives and processes individual chunks of a file upload
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

    const userId = session.user.id;
    
    // Parse form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const uploadId = formData.get('uploadId') as string;
    const chunkIndex = parseInt(formData.get('chunkIndex') as string);
    const totalChunks = parseInt(formData.get('totalChunks') as string);
    
    if (!file || !uploadId || isNaN(chunkIndex) || isNaN(totalChunks)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Verify this upload belongs to the authenticated user
    const { data: uploadData, error: uploadError } = await supabase
      .from('model_uploads')
      .select('*')
      .eq('upload_id', uploadId)
      .eq('user_id', userId)
      .single();
    
    if (uploadError || !uploadData) {
      console.error('Error verifying upload:', uploadError);
      return NextResponse.json(
        { error: 'Invalid upload ID' },
        { status: 404 }
      );
    }
    
    // Upload chunk to storage
    const chunkPath = `uploads/${userId}/${uploadId}/chunk_${chunkIndex}`;
    const { data: storageData, error: storageError } = await supabase.storage
      .from('model-files')
      .upload(chunkPath, file, {
        contentType: file.type,
        upsert: true // Override if exists
      });
    
    if (storageError) {
      console.error('Error uploading chunk to storage:', storageError);
      return NextResponse.json(
        { error: 'Failed to upload chunk' },
        { status: 500 }
      );
    }
    
    // Update upload record
    const { error: updateError } = await supabase
      .from('model_uploads')
      .update({
        chunks_received: uploadData.chunks_received + 1,
        status: uploadData.chunks_received + 1 === totalChunks ? 'uploaded' : 'in_progress',
        updated_at: new Date().toISOString()
      })
      .eq('upload_id', uploadId);
    
    if (updateError) {
      console.error('Error updating upload record:', updateError);
      // Not failing here, continuing as the chunk is already saved
    }
    
    return NextResponse.json({
      success: true,
      chunkIndex,
      totalChunks,
      received: uploadData.chunks_received + 1,
      message: 'Chunk uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading chunk:', error);
    return NextResponse.json(
      { error: 'Failed to process chunk upload' },
      { status: 500 }
    );
  }
}

// Updated route segment config (replacing the old config export)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const maxDuration = 60;
export const bodySize = '10mb'; 