import { ObjectId } from 'mongodb';
import { getCollection } from '../mongodb';

export interface PostComment {
  _id?: ObjectId;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  likes: number;
  likedBy?: string[]; // Array of user IDs
  parentId?: ObjectId; // For replies to comments
}

export interface PostMedia {
  type: 'image' | 'video' | 'gif';
  url: string;
  thumbnail?: string; // For videos
  width?: number;
  height?: number;
  alt?: string;
}

export interface Post {
  _id?: ObjectId;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  media?: PostMedia[];
  tags: string[];
  mentions?: string[]; // Array of usernames
  createdAt: Date;
  updatedAt?: Date;
  likes: number;
  likedBy?: string[]; // Array of user IDs
  comments?: PostComment[];
  commentsCount: number;
  isRepost?: boolean;
  originalPostId?: string; // If it's a repost
  originalUserId?: string; // If it's a repost
  originalUserName?: string; // If it's a repost
  visibility: 'public' | 'followers' | 'private';
}

export class PostService {
  private static readonly COLLECTION_NAME = 'posts';

  /**
   * Create a new post
   */
  static async createPost(post: Omit<Post, '_id' | 'createdAt' | 'likes' | 'commentsCount'>): Promise<Post> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    const newPost: Post = {
      ...post,
      createdAt: new Date(),
      likes: 0,
      commentsCount: 0
    };
    
    const result = await collection.insertOne(newPost);
    return { ...newPost, _id: result.insertedId };
  }

  /**
   * Get a post by its ID
   */
  static async getPostById(id: string): Promise<Post | null> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    try {
      return await collection.findOne({ _id: new ObjectId(id) }) as Post | null;
    } catch (error) {
      console.error('Error getting post by ID:', error);
      return null;
    }
  }

  /**
   * Get posts by user ID with pagination
   */
  static async getPostsByUserId(
    userId: string,
    page = 1,
    limit = 10
  ): Promise<{ posts: Post[], totalCount: number, totalPages: number }> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    // Get total count for pagination
    const totalCount = await collection.countDocuments({ userId });
    const totalPages = Math.ceil(totalCount / limit);
    
    // Get posts with pagination
    const posts = await collection
      .find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray() as Post[];
    
    return { posts, totalCount, totalPages };
  }

  /**
   * Get posts for a user's feed with pagination
   * This includes posts from users they follow
   */
  static async getFeedPosts(
    userId: string,
    followingIds: string[],
    page = 1,
    limit = 10
  ): Promise<{ posts: Post[], totalCount: number, totalPages: number }> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    // Build query for feed posts
    // Include posts from the user and users they follow
    const query = {
      $or: [
        { userId: { $in: [...followingIds, userId] } },
        { visibility: 'public' }
      ]
    };
    
    // Get total count for pagination
    const totalCount = await collection.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);
    
    // Get posts with pagination
    const posts = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray() as Post[];
    
    return { posts, totalCount, totalPages };
  }

  /**
   * Get trending posts
   */
  static async getTrendingPosts(limit = 10): Promise<Post[]> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    // Get posts from the last 24 hours
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    // Calculate trending score based on likes and comments
    const posts = await collection
      .find({
        createdAt: { $gte: oneDayAgo },
        visibility: 'public'
      })
      .project({
        trendingScore: {
          $add: [
            '$likes',
            { $multiply: ['$commentsCount', 2] } // Comments count more
          ]
        },
        userId: 1,
        userName: 1,
        userAvatar: 1,
        content: 1,
        media: 1,
        tags: 1,
        mentions: 1,
        createdAt: 1,
        likes: 1,
        commentsCount: 1,
        isRepost: 1,
        originalPostId: 1,
        originalUserId: 1,
        originalUserName: 1,
        visibility: 1
      })
      .sort({ trendingScore: -1 })
      .limit(limit)
      .toArray() as (Post & { trendingScore: number })[];
    
    // Remove trending score from result
    return posts.map(({ trendingScore, ...post }) => post);
  }

  /**
   * Update a post
   */
  static async updatePost(id: string, updates: Partial<Post>): Promise<boolean> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    // Remove fields that shouldn't be updated directly
    const { _id, userId, userName, createdAt, likes, likedBy, comments, commentsCount, ...updateData } = updates;
    
    // Add updated timestamp
    const updateWithTimestamp = {
      ...updateData,
      updatedAt: new Date()
    };
    
    try {
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateWithTimestamp }
      );
      
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error updating post:', error);
      return false;
    }
  }

  /**
   * Delete a post
   */
  static async deletePost(id: string): Promise<boolean> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    try {
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting post:', error);
      return false;
    }
  }

  /**
   * Toggle like for a post
   */
  static async toggleLike(id: string, userId: string, like: boolean): Promise<boolean> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    try {
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
   * Add a comment to a post
   */
  static async addComment(
    postId: string, 
    comment: Omit<PostComment, '_id' | 'createdAt' | 'likes' | 'likedBy'>
  ): Promise<PostComment | null> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    const newComment: PostComment = {
      ...comment,
      _id: new ObjectId(),
      createdAt: new Date(),
      likes: 0,
      likedBy: []
    };
    
    try {
      await collection.updateOne(
        { _id: new ObjectId(postId) },
        { 
          $push: { comments: newComment },
          $inc: { commentsCount: 1 }
        }
      );
      
      return newComment;
    } catch (error) {
      console.error('Error adding comment:', error);
      return null;
    }
  }

  /**
   * Toggle like for a comment
   */
  static async toggleCommentLike(
    postId: string, 
    commentId: string, 
    userId: string, 
    like: boolean
  ): Promise<boolean> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    try {
      if (like) {
        // Add like
        const result = await collection.updateOne(
          { 
            _id: new ObjectId(postId),
            'comments._id': new ObjectId(commentId)
          },
          { 
            $inc: { 'comments.$.likes': 1 },
            $addToSet: { 'comments.$.likedBy': userId }
          }
        );
        
        return result.modifiedCount > 0;
      } else {
        // Remove like
        const result = await collection.updateOne(
          { 
            _id: new ObjectId(postId),
            'comments._id': new ObjectId(commentId)
          },
          { 
            $inc: { 'comments.$.likes': -1 },
            $pull: { 'comments.$.likedBy': userId }
          }
        );
        
        return result.modifiedCount > 0;
      }
    } catch (error) {
      console.error('Error toggling comment like:', error);
      return false;
    }
  }

  /**
   * Repost a post
   */
  static async repost(
    originalPostId: string,
    userId: string,
    userName: string,
    userAvatar?: string,
    content?: string
  ): Promise<Post | null> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    // Get the original post
    const originalPost = await this.getPostById(originalPostId);
    
    if (!originalPost) return null;
    
    // Create repost
    const repost: Omit<Post, '_id' | 'createdAt' | 'likes' | 'commentsCount'> = {
      userId,
      userName,
      userAvatar,
      content: content || '',
      tags: [],
      isRepost: true,
      originalPostId,
      originalUserId: originalPost.userId,
      originalUserName: originalPost.userName,
      visibility: 'public'
    };
    
    return await this.createPost(repost);
  }

  /**
   * Search for posts
   */
  static async searchPosts(query: string, limit = 10): Promise<Post[]> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    const searchResults = await collection
      .find({
        $and: [
          { visibility: 'public' },
          {
            $or: [
              { content: { $regex: query, $options: 'i' } },
              { tags: { $in: [new RegExp(query, 'i')] } }
            ]
          }
        ]
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray() as Post[];
    
    return searchResults;
  }

  /**
   * Get posts by tag
   */
  static async getPostsByTag(
    tag: string,
    page = 1,
    limit = 10
  ): Promise<{ posts: Post[], totalCount: number, totalPages: number }> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    const query = {
      tags: { $regex: new RegExp(`^${tag}$`, 'i') },
      visibility: 'public'
    };
    
    // Get total count for pagination
    const totalCount = await collection.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);
    
    // Get posts with pagination
    const posts = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray() as Post[];
    
    return { posts, totalCount, totalPages };
  }

  /**
   * Get trending tags
   */
  static async getTrendingTags(limit = 10): Promise<{ tag: string, count: number }[]> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    // Get posts from the last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const tags = await collection.aggregate([
      { $match: { createdAt: { $gte: oneWeekAgo }, visibility: 'public' } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
      { $project: { _id: 0, tag: '$_id', count: 1 } }
    ]).toArray() as { tag: string, count: number }[];
    
    return tags;
  }
} 