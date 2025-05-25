import { NextRequest, NextResponse } from 'next/server';
import { PostService } from '@/lib/models/post';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Force Node.js runtime for this route
export const runtime = 'nodejs';

// PUT /api/posts/like - Toggle like for a post
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - You must be logged in to like a post' },
        { status: 401 }
      );
    }
    
    const { postId, like } = await req.json();
    
    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }
    
    // Toggle like for post
    const success = await PostService.toggleLike(
      postId,
      session.user.id,
      like === true // Ensure boolean
    );
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to toggle like' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
} 