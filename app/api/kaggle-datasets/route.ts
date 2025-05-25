import { NextRequest, NextResponse } from 'next/server';
import { KaggleCrawler } from '@/lib/KaggleCrawler';

// Add export config for dynamic route handling
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // Extract query parameters
    const url = new URL(request.url);
    const searchTerm = url.searchParams.get('searchTerm') || '';
    const tagsParam = url.searchParams.get('tags') || '';
    const tags = tagsParam ? tagsParam.split(',') : [];
    const minDownloads = parseInt(url.searchParams.get('minDownloads') || '0');
    const sortBy = url.searchParams.get('sortBy') as 'popularity' | 'recency' | 'usability' || 'popularity';
    const isTabular = url.searchParams.get('isTabular') === 'true' ? true : 
                      url.searchParams.get('isTabular') === 'false' ? false : undefined;
    const forceRefresh = url.searchParams.get('forceRefresh') === 'true';

    // Create a new instance of the KaggleCrawler
    const kaggleCrawler = new KaggleCrawler();

    // Fetch datasets with the specified filters
    const datasets = await kaggleCrawler.getDatasets({
      searchTerm,
      tags,
      minDownloads,
      sortBy,
      isTabular,
      forceRefresh
    });

    // Return the datasets as a JSON response
    return NextResponse.json({
      success: true,
      count: datasets.length,
      datasets
    });
  } catch (error) {
    console.error('Error fetching Kaggle datasets:', error);
    
    // Return an error response
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch Kaggle datasets' 
      },
      { status: 500 }
    );
  }
} 