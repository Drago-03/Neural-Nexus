import { NextRequest, NextResponse } from 'next/server';
import { ModelService } from '@/lib/services/model-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Force Node.js runtime for this route
export const runtime = 'nodejs';

/**
 * GET /api/models/[id] - Get a specific model by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Increment view count (only if it's a direct view, not API fetching)
    const url = new URL(req.url);
    const trackView = url.searchParams.get('trackView') === 'true';
    
    if (trackView) {
      await ModelService.incrementModelViews(id);
    }
    
    // Get the model
    const model = await ModelService.getModelById(id);
    
    if (!model) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      );
    }
    
    // Get model versions
    const versions = await ModelService.getModelVersions(id);
    
    // Get model ratings
    const ratings = await ModelService.getModelRatings(id);
    
    // Get model metrics
    const metrics = await ModelService.getModelMetrics(id);
    
    return NextResponse.json({
      model,
      versions,
      ratings,
      metrics
    });
  } catch (error) {
    console.error('Error getting model:', error);
    return NextResponse.json(
      { error: 'Failed to get model' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/models/[id] - Update a specific model by ID
 */
export async function PATCH(
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
    
    const id = params.id;
    const updates = await req.json();
    
    // Get current model to check ownership
    const model = await ModelService.getModelById(id);
    
    if (!model) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      );
    }
    
    // Check if user is the owner or an admin
    if (model.userId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - You can only update your own models' },
        { status: 403 }
      );
    }
    
    // Prevent changing userId field
    if (updates.userId && updates.userId !== model.userId) {
      return NextResponse.json(
        { error: 'Cannot change model ownership through updates' },
        { status: 400 }
      );
    }
    
    // Update the model
    const updatedModel = await ModelService.updateModel(id, updates);
    
    if (!updatedModel) {
      return NextResponse.json(
        { error: 'Failed to update model' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      model: updatedModel,
    });
  } catch (error) {
    console.error('Error updating model:', error);
    return NextResponse.json(
      { error: 'Failed to update model' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/models/[id] - Delete a specific model by ID
 */
export async function DELETE(
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
    
    const id = params.id;
    
    // Get current model to check ownership
    const model = await ModelService.getModelById(id);
    
    if (!model) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      );
    }
    
    // Check if user is the owner or an admin
    if (model.userId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - You can only delete your own models' },
        { status: 403 }
      );
    }
    
    // Get query parameters
    const url = new URL(req.url);
    const permanent = url.searchParams.get('permanent') === 'true';
    
    let success: boolean;
    
    if (permanent && session.user.role === 'admin') {
      // Permanently delete the model (admin only)
      success = await ModelService.permanentlyDeleteModel(id);
    } else {
      // Soft delete the model
      success = await ModelService.deleteModel(id);
    }
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete model' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: permanent ? 'Model permanently deleted' : 'Model deleted',
    });
  } catch (error) {
    console.error('Error deleting model:', error);
    return NextResponse.json(
      { error: 'Failed to delete model' },
      { status: 500 }
    );
  }
} 