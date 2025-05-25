import { NextRequest, NextResponse } from 'next/server';
import { PostService } from '@/lib/models/post';
import { UserService } from '@/lib/models/user';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Force Node.js runtime for this route
export const runtime = 'nodejs';

// GET /api/posts - Get posts with pagination
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const userId = searchParams.get('userId');
    const tag = searchParams.get('tag');
    const trending = searchParams.get('trending') === 'true';
    
    let result;
    
    if (trending) {
      // Get trending posts
      const trendingPosts = await PostService.getTrendingPosts(limit);
      result = { posts: trendingPosts, totalCount: trendingPosts.length, totalPages: 1 };
    } else if (tag) {
      // Get posts by tag
      result = await PostService.getPostsByTag(tag, page, limit);
    } else if (userId) {
      // Get posts by user ID
      result = await PostService.getPostsByUserId(userId, page, limit);
    } else {
      // Get feed posts for logged in user
      const session = await getServerSession(authOptions);
      
      if (!session?.user) {
        return NextResponse.json(
          { error: 'Unauthorized - You must be logged in to view your feed' },
          { status: 401 }
        );
      }
      
      // Get user's following list
      const userInfo = await UserService.getUserById(session.user.id);
      const followingIds = userInfo?.following?.map(f => f.userId) || [];
      
      result = await PostService.getFeedPosts(session.user.id, followingIds, page, limit);
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error getting posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create a new post
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - You must be logged in to create a post' },
        { status: 401 }
      );
    }
    
    const postData = await req.json();
    
    // Validate required fields
    if (!postData.content && (!postData.media || postData.media.length === 0)) {
      return NextResponse.json(
        { error: 'Post must have content or media' },
        { status: 400 }
      );
    }
    
    // Add user information from session
    postData.userId = session.user.id;
    postData.userName = session.user.name || session.user.username;
    postData.userAvatar = session.user.image;
    
    // Set default visibility if not provided
    if (!postData.visibility) {
      postData.visibility = 'public';
    }
    
    // Extract hashtags from content
    if (postData.content) {
      const hashtagRegex = /#(\w+)/g;
      const matches = [...postData.content.matchAll(hashtagRegex)];
      postData.tags = matches.map(match => match[1].toLowerCase());
    }
    
    // Extract mentions from content
    if (postData.content) {
      const mentionRegex = /@(\w+)/g;
      const matches = [...postData.content.matchAll(mentionRegex)];
      postData.mentions = matches.map(match => match[1].toLowerCase());
    }
    
    // Create post in database
    const newPost = await PostService.createPost(postData);
    
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

// PUT /api/posts - Update an existing post
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - You must be logged in to update a post' },
        { status: 401 }
      );
    }
    
    const { id, ...updates } = await req.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }
    
    // Get the post to verify ownership
    const post = await PostService.getPostById(id);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Check if user is the author or an admin
    if (post.userId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - You can only update your own posts' },
        { status: 403 }
      );
    }
    
    // Update hashtags if content is changed
    if (updates.content) {
      const hashtagRegex = /#(\w+)/g;
      const matches = [...updates.content.matchAll(hashtagRegex)];
      updates.tags = matches.map(match => match[1].toLowerCase());
      
      // Update mentions
      const mentionRegex = /@(\w+)/g;
      const mentionMatches = [...updates.content.matchAll(mentionRegex)];
      updates.mentions = mentionMatches.map(match => match[1].toLowerCase());
    }
    
    // Update post in database
    const success = await PostService.updatePost(id, updates);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update post' },
        { status: 400 }
      );
    }
    
    // Get updated post
    const updatedPost = await PostService.getPostById(id);
    
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE /api/posts - Delete a post
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - You must be logged in to delete a post' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }
    
    // Get the post to verify ownership
    const post = await PostService.getPostById(id);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Check if user is the author or an admin
    if (post.userId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - You can only delete your own posts' },
        { status: 403 }
      );
    }
    
    // Delete post from database
    const success = await PostService.deletePost(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete post' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
} 