import { ObjectId } from 'mongodb';
import { getCollection } from '../mongodb';

export interface BlogComment {
  _id?: ObjectId;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  likes: number;
  parentId?: ObjectId; // For comment replies
}

export interface BlogPost {
  _id?: ObjectId;
  title: string;
  slug: string;
  content: string;
  summary: string;
  featured_image?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  categories: string[];
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  created_at: Date;
  updated_at?: Date;
  published_at?: Date;
  views: number;
  likes: number;
  comments?: BlogComment[];
  readTime?: number; // Estimated read time in minutes
}

export class BlogService {
  private static readonly COLLECTION_NAME = 'blogs';

  /**
   * Create a new blog post
   */
  static async createBlog(blog: Omit<BlogPost, '_id' | 'created_at' | 'views' | 'likes'>): Promise<BlogPost> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    const newBlog: BlogPost = {
      ...blog,
      created_at: new Date(),
      views: 0,
      likes: 0,
      readTime: this.calculateReadTime(blog.content),
    };
    
    const result = await collection.insertOne(newBlog);
    return { ...newBlog, _id: result.insertedId };
  }

  /**
   * Get all blog posts with optional pagination
   */
  static async getAllBlogs(
    page = 1, 
    limit = 10, 
    status: 'draft' | 'published' | 'archived' | 'all' = 'published',
    sortBy: 'newest' | 'oldest' | 'popular' = 'newest'
  ): Promise<{ blogs: BlogPost[], totalCount: number, totalPages: number }> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    // Build query based on status
    const query: any = {};
    if (status !== 'all') {
      query.status = status;
    }
    
    // Build sort options
    const sortOptions: any = {};
    switch (sortBy) {
      case 'newest':
        sortOptions.created_at = -1;
        break;
      case 'oldest':
        sortOptions.created_at = 1;
        break;
      case 'popular':
        sortOptions.views = -1;
        break;
    }
    
    // Get total count for pagination
    const totalCount = await collection.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);
    
    // Get blogs with pagination
    const blogs = await collection
      .find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray() as BlogPost[];
    
    return { blogs, totalCount, totalPages };
  }

  /**
   * Get a blog post by its ID
   */
  static async getBlogById(id: string): Promise<BlogPost | null> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    try {
      return await collection.findOne({ _id: new ObjectId(id) }) as BlogPost | null;
    } catch (error) {
      console.error('Error getting blog by ID:', error);
      return null;
    }
  }

  /**
   * Get a blog post by its slug
   */
  static async getBlogBySlug(slug: string): Promise<BlogPost | null> {
    const collection = await getCollection(this.COLLECTION_NAME);
    return await collection.findOne({ slug }) as BlogPost | null;
  }

  /**
   * Update a blog post
   */
  static async updateBlog(id: string, updates: Partial<BlogPost>): Promise<boolean> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    // Remove fields that shouldn't be updated directly
    const { _id, created_at, views, likes, ...updateData } = updates;
    
    // Add updated_at timestamp
    const updateWithTimestamp = {
      ...updateData,
      updated_at: new Date(),
      ...(updateData.content ? { readTime: this.calculateReadTime(updateData.content) } : {})
    };
    
    try {
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateWithTimestamp }
      );
      
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error updating blog:', error);
      return false;
    }
  }

  /**
   * Delete a blog post
   */
  static async deleteBlog(id: string): Promise<boolean> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    try {
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting blog:', error);
      return false;
    }
  }

  /**
   * Increment the view count for a blog post
   */
  static async incrementViews(id: string): Promise<boolean> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    try {
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $inc: { views: 1 } }
      );
      
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error incrementing views:', error);
      return false;
    }
  }

  /**
   * Toggle like for a blog post
   */
  static async toggleLike(id: string, userId: string, like: boolean): Promise<boolean> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    try {
      // Track who liked the post in a likes array
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        like 
          ? { 
              $inc: { likes: 1 },
              $addToSet: { likedBy: userId } 
            }
          : { 
              $inc: { likes: -1 },
              $pull: { likedBy: userId } 
            }
      );
      
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error toggling like:', error);
      return false;
    }
  }

  /**
   * Add a comment to a blog post
   */
  static async addComment(
    blogId: string, 
    comment: Omit<BlogComment, '_id' | 'createdAt' | 'likes'>
  ): Promise<BlogComment | null> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    const newComment: BlogComment = {
      ...comment,
      _id: new ObjectId(),
      createdAt: new Date(),
      likes: 0
    };
    
    try {
      await collection.updateOne(
        { _id: new ObjectId(blogId) },
        { $push: { comments: newComment } }
      );
      
      return newComment;
    } catch (error) {
      console.error('Error adding comment:', error);
      return null;
    }
  }

  /**
   * Search for blog posts
   */
  static async searchBlogs(query: string, limit = 10): Promise<BlogPost[]> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    const searchResults = await collection
      .find({
        $and: [
          { status: 'published' },
          {
            $or: [
              { title: { $regex: query, $options: 'i' } },
              { content: { $regex: query, $options: 'i' } },
              { tags: { $in: [new RegExp(query, 'i')] } },
              { categories: { $in: [new RegExp(query, 'i')] } }
            ]
          }
        ]
      })
      .limit(limit)
      .toArray() as BlogPost[];
    
    return searchResults;
  }

  /**
   * Get popular blog categories with counts
   */
  static async getPopularCategories(limit = 10): Promise<{ category: string, count: number }[]> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    const categories = await collection.aggregate([
      { $match: { status: 'published' } },
      { $unwind: '$categories' },
      { $group: { _id: '$categories', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
      { $project: { _id: 0, category: '$_id', count: 1 } }
    ]).toArray() as { category: string, count: number }[];
    
    return categories;
  }

  /**
   * Calculate estimated read time based on content length
   * Average reading speed: 200-250 words per minute
   */
  private static calculateReadTime(content: string): number {
    const words = content.trim().split(/\s+/).length;
    const readingSpeed = 225; // words per minute
    const readTime = Math.ceil(words / readingSpeed);
    return Math.max(1, readTime); // Minimum 1 minute read time
  }
} 