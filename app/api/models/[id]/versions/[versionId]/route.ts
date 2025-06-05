import { NextRequest, NextResponse } from 'next/server';
import { ModelService } from '@/lib/services/model-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Force Node.js runtime for this route
export const runtime = 'nodejs';

/**
 * GET /api/models/[id]/versions/[versionId] - Get a specific model version
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; versionId: string } }
) {
  try {
    const { id: modelId, versionId } = params;
    
    // Get the specific version
    const version = await ModelService.getModelVersion(versionId);
    
    if (!version) {
      return NextResponse.json(
        { error: 'Version not found' },
        { status: 404 }
      );
    }
    
    // Verify the version belongs to the specified model
    if (version.modelId !== modelId) {
      return NextResponse.json(
        { error: 'Version does not belong to this model' },
        { status: 400 }
      );
    }
    
    // Increment download count if downloading
    const url = new URL(req.url);
    const download = url.searchParams.get('download') === 'true';
    
    if (download) {
      // Increment model downloads
      await ModelService.incrementModelDownloads(modelId);
    }
    
    return NextResponse.json({
      version,
      downloadUrl: version.fileUrl
    });
  } catch (error) {
    console.error('Error getting version:', error);
    return NextResponse.json(
      { error: 'Failed to get version' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/models/[id]/versions/[versionId] - Update a model version
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; versionId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - No active session' },
        { status: 401 }
      );
    }
    
    const { id: modelId, versionId } = params;
    
    // Get the model to check ownership
    const model = await ModelService.getModelById(modelId);
    
    if (!model) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      );
    }
    
    // Check if user is the owner or an admin
    if (model.userId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - You can only update versions of your own models' },
        { status: 403 }
      );
    }
    
    // Get the specific version
    const version = await ModelService.getModelVersion(versionId);
    
    if (!version) {
      return NextResponse.json(
        { error: 'Version not found' },
        { status: 404 }
      );
    }
    
    // Verify the version belongs to the specified model
    if (version.modelId !== modelId) {
      return NextResponse.json(
        { error: 'Version does not belong to this model' },
        { status: 400 }
      );
    }
    
    // Get update data
    const updates = await req.json();
    
    // Prevent changing modelId
    if (updates.modelId && updates.modelId !== version.modelId) {
      return NextResponse.json(
        { error: 'Cannot change the model that a version belongs to' },
        { status: 400 }
      );
    }
    
    // Update the version
    const updatedVersion = await ModelService.updateVersion(versionId, updates);
    
    if (!updatedVersion) {
      return NextResponse.json(
        { error: 'Failed to update version' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      version: updatedVersion
    });
  } catch (error) {
    console.error('Error updating version:', error);
    return NextResponse.json(
      { error: 'Failed to update version' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/models/[id]/versions/[versionId] - Delete a model version
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; versionId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - No active session' },
        { status: 401 }
      );
    }
    
    const { id: modelId, versionId } = params;
    
    // Get the model to check ownership
    const model = await ModelService.getModelById(modelId);
    
    if (!model) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      );
    }
    
    // Check if user is the owner or an admin
    if (model.userId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - You can only delete versions of your own models' },
        { status: 403 }
      );
    }
    
    // Get the specific version
    const version = await ModelService.getModelVersion(versionId);
    
    if (!version) {
      return NextResponse.json(
        { error: 'Version not found' },
        { status: 404 }
      );
    }
    
    // Verify the version belongs to the specified model
    if (version.modelId !== modelId) {
      return NextResponse.json(
        { error: 'Version does not belong to this model' },
        { status: 400 }
      );
    }
    
    // Delete the version
    const success = await ModelService.deleteModelVersion(versionId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete version' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Version deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting version:', error);
    return NextResponse.json(
      { error: 'Failed to delete version' },
      { status: 500 }
    );
  }
} 