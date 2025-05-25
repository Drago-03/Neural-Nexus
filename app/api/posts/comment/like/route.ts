import { NextRequest, NextResponse } from 'next/server';
import { PostService } from '@/lib/models/post';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Force Node.js runtime for this route
export const runtime = 'nodejs';

// PUT /api/posts/comment/like - Toggle like for a comment
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - You must be logged in to like a comment' },
        { status: 401 }
      );
    }
    
    const { postId, commentId, like } = await req.json();
    
    if (!postId || !commentId) {
      return NextResponse.json(
        { error: 'Post ID and comment ID are required' },
        { status: 400 }
      );
    }
    
    // Toggle like for comment
    const success = await PostService.toggleCommentLike(
      postId,
      commentId,
      session.user.id,
      like === true // Ensure boolean
    );
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to toggle comment like' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error toggling comment like:', error);
    return NextResponse.json(
      { error: 'Failed to toggle comment like' },
      { status: 500 }
    );
  }
} 