import { NextRequest, NextResponse } from 'next/server';
import { BlogService } from '@/lib/models/blog';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import slugify from 'slugify';

// Force Node.js runtime for this route
export const runtime = 'nodejs';

// GET /api/blog - Get all blogs with pagination
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') as 'draft' | 'published' | 'archived' | 'all' || 'published';
    const sortBy = searchParams.get('sortBy') as 'newest' | 'oldest' | 'popular' || 'newest';
    
    const result = await BlogService.getAllBlogs(page, limit, status, sortBy);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error getting blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

// POST /api/blog - Create a new blog
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - You must be logged in to create a blog' },
        { status: 401 }
      );
    }
    
    const blogData = await req.json();
    
    // Validate required fields
    if (!blogData.title || !blogData.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }
    
    // Generate slug from title if not provided
    if (!blogData.slug) {
      blogData.slug = slugify(blogData.title, { 
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g
      });
    }
    
    // Generate summary if not provided
    if (!blogData.summary) {
      // Simple summary: first 160 characters of content without HTML
      const plainText = blogData.content.replace(/<[^>]*>/g, '');
      blogData.summary = plainText.substring(0, 160) + (plainText.length > 160 ? '...' : '');
    }
    
    // Add author information from session
    blogData.author = {
      id: session.user.id,
      name: session.user.name || session.user.username,
      avatar: session.user.image
    };
    
    // Create blog in database
    const newBlog = await BlogService.createBlog(blogData);
    
    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    );
  }
}

// PUT /api/blog - Update an existing blog
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - You must be logged in to update a blog' },
        { status: 401 }
      );
    }
    
    const { id, ...updates } = await req.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      );
    }
    
    // Get the blog to verify ownership
    const blog = await BlogService.getBlogById(id);
    
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }
    
    // Check if user is the author or an admin
    if (blog.author.id !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - You can only update your own blogs' },
        { status: 403 }
      );
    }
    
    // Update slug if title is changed and slug isn't explicitly provided
    if (updates.title && !updates.slug) {
      updates.slug = slugify(updates.title, { 
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g
      });
    }
    
    // Update summary if content is changed and summary isn't explicitly provided
    if (updates.content && !updates.summary) {
      const plainText = updates.content.replace(/<[^>]*>/g, '');
      updates.summary = plainText.substring(0, 160) + (plainText.length > 160 ? '...' : '');
    }
    
    // Update blog in database
    const success = await BlogService.updateBlog(id, updates);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update blog' },
        { status: 400 }
      );
    }
    
    // Get updated blog
    const updatedBlog = await BlogService.getBlogById(id);
    
    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

// DELETE /api/blog - Delete a blog
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - You must be logged in to delete a blog' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      );
    }
    
    // Get the blog to verify ownership
    const blog = await BlogService.getBlogById(id);
    
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }
    
    // Check if user is the author or an admin
    if (blog.author.id !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - You can only delete your own blogs' },
        { status: 403 }
      );
    }
    
    // Delete blog from database
    const success = await BlogService.deleteBlog(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete blog' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    );
  }
} 