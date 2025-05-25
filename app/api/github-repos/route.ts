import { NextRequest, NextResponse } from 'next/server';
import { GitHubCrawler } from '@/lib/GitHubCrawler';

// Add export config for dynamic route handling
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('q') || '';
    const language = searchParams.get('language') || '';
    const minStars = parseInt(searchParams.get('minStars') || '0');
    const topicsParam = searchParams.get('topics') || '';
    const topics = topicsParam ? topicsParam.split(',') : [];
    const forceRefresh = searchParams.get('refresh') === 'true';
    
    // Get instance of the GitHub crawler
    const crawler = GitHubCrawler.getInstance();
    
    // Fetch repositories with filters
    const repositories = await crawler.getFilteredRepositories(
      searchTerm,
      language,
      minStars,
      topics
    );
    
    // Return the repositories as JSON
    return NextResponse.json({ 
      success: true, 
      count: repositories.length,
      repositories 
    });
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch repositories',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 