import { NextRequest, NextResponse } from 'next/server';
import { ModelCrawler } from '@/lib/ModelCrawler';

// Add export config for dynamic route handling
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // Extract query parameters
    const url = new URL(request.url);
    const searchTerm = url.searchParams.get('searchTerm') || '';
    const tasksParam = url.searchParams.get('tasks') || '';
    const tasks = tasksParam ? tasksParam.split(',') : [];
    const tagsParam = url.searchParams.get('tags') || '';
    const tags = tagsParam ? tagsParam.split(',') : [];
    const framework = url.searchParams.get('framework') || undefined;
    const sortBy = url.searchParams.get('sortBy') as 'popularity' | 'recency' | 'likes' || 'popularity';
    const isFineTuned = url.searchParams.get('isFineTuned') === 'true' ? true : 
                        url.searchParams.get('isFineTuned') === 'false' ? false : undefined;
    const forceRefresh = url.searchParams.get('forceRefresh') === 'true';

    // Create a new instance of the ModelCrawler
    const modelCrawler = new ModelCrawler();

    // Fetch models with the specified filters
    const models = await modelCrawler.getModels({
      searchTerm,
      tasks,
      tags,
      framework,
      sortBy,
      isFineTuned,
      forceRefresh
    });

    // Return the models as a JSON response
    return NextResponse.json({
      success: true,
      count: models.length,
      models
    });
  } catch (error) {
    console.error('Error fetching AI models:', error);
    
    // Return an error response
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch AI models' 
      },
      { status: 500 }
    );
  }
} 