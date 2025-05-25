import { NextRequest, NextResponse } from 'next/server';
import { ModelService, ModelCategory, ModelFramework } from '@/lib/models/model';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import slugify from 'slugify';
import { getCollection } from '@/lib/mongodb';

// GET /api/models - Get all models with optional filters and pagination
export async function GET(req: NextRequest) {
  try {
    console.log("🔍 Models API: Processing request");
    const startTime = Date.now();
    
    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category') as ModelCategory | undefined;
    const framework = searchParams.get('framework') as ModelFramework | undefined;
    const sortBy = searchParams.get('sortBy') as 'newest' | 'popular' | 'downloads' | 'stars' | 'rating' || 'newest';
    const creatorId = searchParams.get('creatorId');
    
    console.log(`📊 Models API: Request with filters - ${category ? `category=${category}, ` : ''}${framework ? `framework=${framework}, ` : ''}${creatorId ? `creatorId=${creatorId}, ` : ''}sortBy=${sortBy}, page=${page}, limit=${limit}`);
    
    // Create query object for database
    let query: any = {};
    
    // Add filters to query
    if (category) {
      query.category = category;
    }
    if (framework) {
      query.framework = framework;
    }
    if (creatorId) {
      query['creator.id'] = creatorId;
      console.log(`👤 Models API: Filtering by creator ID ${creatorId}`);
    }
    
    try {
      // Get models from database with filters - real-time data
      const collection = await getCollection('models');
      
      // Get total count for pagination
      const totalCount = await collection.countDocuments(query);
      const totalPages = Math.ceil(totalCount / limit);
      
      console.log(`📈 Models API: Found ${totalCount} total matching models`);
      
      // Get models with pagination
      let sort: Record<string, number> = {};
      switch (sortBy) {
        case 'newest':
          sort.created_at = -1;
          break;
        case 'popular':
          sort.downloads = -1;
          break;
        case 'downloads':
          sort.downloads = -1;
          break;
        case 'stars':
          sort.stars = -1;
          break;
        case 'rating':
          sort.averageRating = -1;
          break;
      }
      
      const models = await collection
        .find(query)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray();
      
      console.log(`✅ Models API: Retrieved ${models.length} models for page ${page}`);
      
      // Process model data to include additional metrics
      const processedModels = models.map((model: any) => {
        // Extract reviews if they exist
        const reviews = model.reviews || [];
        
        // Calculate average rating if reviews exist
        let avgRating = 0;
        if (reviews.length > 0) {
          const totalRating = reviews.reduce((sum: number, review: any) => {
            return sum + (review.rating || 0);
          }, 0);
          avgRating = totalRating / reviews.length;
        }
        
        return {
          ...model,
          avgRating: parseFloat(avgRating.toFixed(1)),
          reviewCount: reviews.length,
          latestVersion: model.versions?.length ? model.versions[model.versions.length - 1].version : '1.0.0',
          lastUpdated: model.updated_at || model.created_at
        };
      });
      
      const responseTime = Date.now() - startTime;
      console.log(`⏱️ Models API: Request completed in ${responseTime}ms`);
      
      return NextResponse.json({
        success: true,
        models: processedModels,
        totalCount,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error("❌ Models API: Database error:", error);
      throw error; // Re-throw to be caught by outer try/catch
    }
  } catch (error) {
    console.error('❌ Models API: Error getting models:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch models',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/models - Create a new model
export async function POST(req: NextRequest) {
  try {
    // Get authenticated user from session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - You must be logged in to create a model' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    const userName = session.user.name || session.user.username || 'Unknown User';
    
    const modelData = await req.json();
    
    // Validate required fields
    if (!modelData.name || !modelData.description || !modelData.category || !modelData.framework) {
      return NextResponse.json(
        { error: 'Name, description, category, and framework are required' },
        { status: 400 }
      );
    }
    
    // Generate slug from name if not provided
    if (!modelData.slug) {
      modelData.slug = slugify(modelData.name, { 
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g
      });
    }
    
    // Add creator information from session
    modelData.creator = {
      id: userId,
      name: userName,
      avatar: session.user.image || undefined
    };
    
    // Ensure versions array with at least one version
    if (!modelData.versions || !modelData.versions.length) {
      return NextResponse.json(
        { error: 'At least one version is required' },
        { status: 400 }
      );
    }
    
    // Set current version to latest version by default
    if (!modelData.currentVersion) {
      modelData.currentVersion = modelData.versions[0].version;
    }
    
    // Create model in database
    const newModel = await ModelService.createModel(modelData);
    
    return NextResponse.json(newModel, { status: 201 });
  } catch (error) {
    console.error('Error creating model:', error);
    return NextResponse.json(
      { error: 'Failed to create model' },
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

// DELETE /api/models - Delete a model
export async function DELETE(req: NextRequest) {
  try {
    // Get authenticated user from session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - You must be logged in to delete a model' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    const userRole = session.user.role || 'user';
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
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
        { error: 'Unauthorized - You can only delete your own models' },
        { status: 403 }
      );
    }
    
    // Delete model from database
    const success = await ModelService.deleteModel(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete model' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting model:', error);
    return NextResponse.json(
      { error: 'Failed to delete model' },
      { status: 500 }
    );
  }
} 