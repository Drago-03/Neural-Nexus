import { NextRequest, NextResponse } from 'next/server';
import { PostService } from '@/lib/models/post';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ObjectId } from 'mongodb';

// Force Node.js runtime for this route
export const runtime = 'nodejs';

// POST /api/posts/comment - Add a comment to a post
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - You must be logged in to comment' },
        { status: 401 }
      );
    }
    
    const { postId, content, parentId } = await req.json();
    
    if (!postId || !content) {
      return NextResponse.json(
        { error: 'Post ID and comment content are required' },
        { status: 400 }
      );
    }
    
    // Create comment object
    const comment = {
      userId: session.user.id,
      userName: session.user.name || session.user.username,
      userAvatar: session.user.image || undefined,
      content,
      parentId: parentId ? new ObjectId(parentId) : undefined
    };
    
    // Add comment to post
    const newComment = await PostService.addComment(postId, comment);
    
    if (!newComment) {
      return NextResponse.json(
        { error: 'Failed to add comment' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json(
      { error: 'Failed to add comment' },
      { status: 500 }
    );
  }
} 