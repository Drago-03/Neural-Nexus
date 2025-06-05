import { NextRequest, NextResponse } from 'next/server';
import { ModelService } from '@/lib/services/model-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/models/[id]/ratings - Get all ratings for a model
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const modelId = params.id;
    
    // Get model with ratings
    const model = await ModelService.getModelById(modelId);
    
    if (!model) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      );
    }
    
    // Get ratings for the model
    const ratings = await ModelService.getModelRatings(modelId);
    
    // Get query parameters for pagination
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    // Paginate ratings
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedRatings = ratings.slice(startIndex, endIndex);
    
    return NextResponse.json({
      ratings: paginatedRatings,
      averageRating: model.averageRating || 0,
      totalRatings: ratings.length,
      totalPages: Math.ceil(ratings.length / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Error getting model ratings:', error);
    return NextResponse.json(
      { error: 'Failed to get model ratings' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/models/[id]/ratings - Add a rating to a model
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
    const { rating, comment } = await req.json();
    
    // Validate rating
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be a number between 1 and 5' },
        { status: 400 }
      );
    }
    
    // Get model
    const model = await ModelService.getModelById(modelId);
    
    if (!model) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      );
    }
    
    // Add or update rating
    const ratingResult = await ModelService.rateModel(
      modelId,
      session.user.id,
      rating,
      comment || ''
    );
    
    if (!ratingResult) {
      return NextResponse.json(
        { error: 'Failed to add rating' },
        { status: 500 }
      );
    }
    
    // Get updated model to return current average
    const updatedModel = await ModelService.getModelById(modelId);
    
    return NextResponse.json({
      success: true,
      rating: ratingResult,
      averageRating: updatedModel?.averageRating || 0,
      totalRatings: updatedModel?.ratingCount || 0
    });
  } catch (error) {
    console.error('Error adding model rating:', error);
    return NextResponse.json(
      { error: 'Failed to add model rating' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/models/[id]/ratings - Delete a user's rating
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
    
    const modelId = params.id;
    
    // Get model
    const model = await ModelService.getModelById(modelId);
    
    if (!model) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      );
    }
    
    // Find user's rating
    const userRating = await ModelService.getUserRating(modelId, session.user.id);
    
    if (!userRating) {
      return NextResponse.json(
        { error: 'No rating found for this user' },
        { status: 404 }
      );
    }
    
    // Delete the rating
    const success = await ModelService.deleteRating(userRating.id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete rating' },
        { status: 500 }
      );
    }
    
    // Get updated model to return current average
    const updatedModel = await ModelService.getModelById(modelId);
    
    return NextResponse.json({
      success: true,
      message: 'Rating deleted successfully',
      averageRating: updatedModel?.averageRating || 0,
      totalRatings: updatedModel?.ratingCount || 0
    });
  } catch (error) {
    console.error('Error deleting model rating:', error);
    return NextResponse.json(
      { error: 'Failed to delete model rating' },
      { status: 500 }
    );
  }
} 