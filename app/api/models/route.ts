import { NextRequest, NextResponse } from 'next/server';
import { ModelService, Model } from '@/lib/services/model-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import slugify from 'slugify';
import { getCollection } from '@/lib/mongodb';

// Force Node.js runtime for this route
export const runtime = 'nodejs';

/**
 * GET /api/models - Get models with optional filters
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const category = url.searchParams.get('category') || undefined;
    const tags = url.searchParams.get('tags')?.split(',') || undefined;
    const userId = url.searchParams.get('userId') || undefined;
    const isPublic = url.searchParams.get('isPublic') 
      ? url.searchParams.get('isPublic') === 'true' 
      : undefined;
    const sortBy = url.searchParams.get('sortBy') as 'createdAt' | 'downloads' | 'rating' | undefined;
    const sortOrder = url.searchParams.get('sortOrder') as 'asc' | 'desc' | undefined;
    const status = url.searchParams.get('status') as 'draft' | 'pending' | 'published' | 'rejected' | undefined;
    
    // Search query handling
    const query = url.searchParams.get('query') || undefined;
    
    let result;
    
    if (query) {
      // Handle search
      result = await ModelService.searchModels(query, {
        page,
        limit,
        category,
        isPublic: isPublic !== undefined ? isPublic : true,
      });
    } else {
      // Handle normal listing with filters
      result = await ModelService.getAllModels({
        page,
        limit,
        category,
        tags,
        userId,
        isPublic,
        sortBy,
        sortOrder,
        status,
      });
    }
    
    return NextResponse.json({
      models: result.models,
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit),
    });
  } catch (error) {
    console.error('Error getting models:', error);
    return NextResponse.json(
      { error: 'Failed to get models' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/models - Create a new model
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - No active session' },
        { status: 401 }
      );
    }
    
    const modelData = await req.json();
    
    // Validate required fields
    if (!modelData.name || !modelData.category || !modelData.license) {
      return NextResponse.json(
        { error: 'Missing required fields: name, category, license' },
        { status: 400 }
      );
    }
    
    // Add user ID to model data
    modelData.userId = session.user.id;
    
    // Create the model
    const model = await ModelService.createModel(modelData);
    
    return NextResponse.json({
      success: true,
      model,
    });
  } catch (error) {
    console.error('Error creating model:', error);
    return NextResponse.json(
      { error: 'Failed to create model' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/models - Delete all models (admin only)
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - No active session' },
        { status: 401 }
      );
    }
    
    // Check if user is admin
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }
    
    // This is a dangerous operation - only for development/testing
    // Add additional safeguards as needed
    
    // Get all models
    const { models } = await ModelService.getAllModels();
    
    // Delete each model
    for (const model of models) {
      await ModelService.permanentlyDeleteModel(model.id);
    }
    
    return NextResponse.json({
      success: true,
      message: `Deleted ${models.length} models`,
    });
  } catch (error) {
    console.error('Error deleting all models:', error);
    return NextResponse.json(
      { error: 'Failed to delete models' },
      { status: 500 }
    );
  }
}

// PUT /api/models - Update an existing model
export async function PUT(req: NextRequest) {
  try {
    // Get authenticated user from session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - You must be logged in to update a model' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    const userRole = session.user.role || 'user';
    
    const { id, ...updates } = await req.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Model ID is required' },
        { status: 400 }
      );
    }
    
    // Get the model to verify ownership
    const model = await ModelService.getModelById(id);
    
    if (!model) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      );
    }
    
    // Check if user is the creator or an admin
    if (model.creator.id !== userId && userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - You can only update your own models' },
        { status: 403 }
      );
    }
    
    // Update slug if name is changed and slug isn't explicitly provided
    if (updates.name && !updates.slug) {
      updates.slug = slugify(updates.name, { 
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g
      });
    }
    
    // Update model in database
    const success = await ModelService.updateModel(id, updates);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update model' },
        { status: 400 }
      );
    }
    
    // Get updated model
    const updatedModel = await ModelService.getModelById(id);
    
    return NextResponse.json(updatedModel);
  } catch (error) {
    console.error('Error updating model:', error);
    return NextResponse.json(
      { error: 'Failed to update model' },
      { status: 500 }
    );
  }
} 