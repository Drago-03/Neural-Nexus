import { NextRequest, NextResponse } from 'next/server';
import { ModelService } from '@/lib/services/model-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Force Node.js runtime for this route
export const runtime = 'nodejs';

/**
 * GET /api/models/[id]/versions - Get all versions of a model
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const modelId = params.id;
    
    // Get the model to verify it exists
    const model = await ModelService.getModelById(modelId);
    
    if (!model) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      );
    }
    
    // Get all versions of the model
    const versions = await ModelService.getModelVersions(modelId);
    
    return NextResponse.json({
      versions,
      currentVersionId: model.currentVersionId
    });
  } catch (error) {
    console.error('Error getting model versions:', error);
    return NextResponse.json(
      { error: 'Failed to get model versions' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/models/[id]/versions - Create a new version for a model
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - No active session' },
        { status: 401 }
      );
    }
    
    const modelId = params.id;
    
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
        { error: 'Unauthorized - You can only add versions to your own models' },
        { status: 403 }
      );
    }
    
    // Get version data from request
    const versionData = await req.json();
    
    // Validate required fields
    if (!versionData.version || !versionData.fileUrl || !versionData.fileName || !versionData.fileSize) {
      return NextResponse.json(
        { error: 'Missing required fields: version, fileUrl, fileName, fileSize' },
        { status: 400 }
      );
    }
    
    // Add modelId to version data
    versionData.modelId = modelId;
    
    // Create the version
    const version = await ModelService.createModelVersion(versionData);
    
    return NextResponse.json({
      success: true,
      version
    });
  } catch (error) {
    console.error('Error creating model version:', error);
    return NextResponse.json(
      { error: 'Failed to create model version' },
      { status: 500 }
    );
  }
} 