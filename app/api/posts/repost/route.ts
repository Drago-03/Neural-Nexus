import { NextRequest, NextResponse } from 'next/server';
import { PostService } from '@/lib/models/post';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Force Node.js runtime for this route
export const runtime = 'nodejs';

// POST /api/posts/repost - Repost a post
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - You must be logged in to repost' },
        { status: 401 }
      );
    }
    
    const { postId, content } = await req.json();
    
    if (!postId) {
      return NextResponse.json(
        { error: 'Original post ID is required' },
        { status: 400 }
      );
    }
    
    // Create repost
    const repost = await PostService.repost(
      postId,
      session.user.id,
      session.user.name || session.user.username,
      session.user.image || undefined,
      content
    );
    
    if (!repost) {
      return NextResponse.json(
        { error: 'Failed to repost - Original post may not exist' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(repost, { status: 201 });
  } catch (error) {
    console.error('Error reposting:', error);
    return NextResponse.json(
      { error: 'Failed to repost' },
      { status: 500 }
    );
  }
} 