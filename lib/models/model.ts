import { ObjectId } from 'mongodb';
import { getCollection } from '../mongodb';

export type ModelCategory = 
  | 'text-generation' 
  | 'image-generation' 
  | 'text-to-speech' 
  | 'speech-to-text'
  | 'image-classification'
  | 'object-detection'
  | 'sentiment-analysis'
  | 'translation'
  | 'summarization'
  | 'question-answering'
  | 'other';

export type ModelFramework = 
  | 'tensorflow' 
  | 'pytorch' 
  | 'jax' 
  | 'onnx' 
  | 'huggingface' 
  | 'openai'
  | 'stable-diffusion'
  | 'other';

export interface ModelVersion {
  version: string;
  releaseDate: Date;
  description: string;
  downloadUrl?: string;
  size?: number; // in MB
  metrics?: {
    accuracy?: number;
    f1Score?: number;
    precision?: number;
    recall?: number;
    latency?: number; // in ms
    customMetrics?: Record<string, number>;
  };
  changelog?: string;
}

export interface ModelReview {
  _id?: ObjectId;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface AIModel {
  _id?: ObjectId;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  creator: {
    id: string;
    name: string;
    avatar?: string;
  };
  category: ModelCategory;
  framework: ModelFramework;
  tags: string[];
  versions: ModelVersion[];
  currentVersion: string;
  license: string;
  repositoryUrl?: string;
  demoUrl?: string;
  paperUrl?: string;
  created_at: Date;
  updated_at?: Date;
  downloads: number;
  stars: number;
  reviews?: ModelReview[];
  averageRating?: number;
  requirements?: {
    minRAM?: string;
    minGPU?: string;
    minCPU?: string;
    recommendedRAM?: string;
    recommendedGPU?: string;
    recommendedCPU?: string;
    otherRequirements?: string[];
  };
  featured: boolean;
}

export class ModelService {
  private static readonly COLLECTION_NAME = 'models';

  /**
   * Create a new AI model
   */
  static async createModel(model: Omit<AIModel, '_id' | 'created_at' | 'downloads' | 'stars' | 'averageRating'>): Promise<AIModel> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    const newModel: AIModel = {
      ...model,
      created_at: new Date(),
      downloads: 0,
      stars: 0,
      featured: false
    };
    
    if (model.reviews && model.reviews.length > 0) {
      newModel.averageRating = this.calculateAverageRating(model.reviews);
    }
    
    const result = await collection.insertOne(newModel);
    return { ...newModel, _id: result.insertedId };
  }

  /**
   * Get all AI models with optional filtering and pagination
   */
  static async getAllModels(
    page = 1, 
    limit = 10, 
    category?: ModelCategory,
    framework?: ModelFramework,
    sortBy: 'newest' | 'popular' | 'downloads' | 'stars' | 'rating' = 'newest'
  ): Promise<{ models: AIModel[], totalCount: number, totalPages: number }> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    // Build query based on filters
    const query: any = {};
    if (category) {
      query.category = category;
    }
    if (framework) {
      query.framework = framework;
    }
    
    // Build sort options
    const sortOptions: any = {};
    switch (sortBy) {
      case 'newest':
        sortOptions.created_at = -1;
        break;
      case 'popular':
        sortOptions.downloads = -1;
        break;
      case 'downloads':
        sortOptions.downloads = -1;
        break;
      case 'stars':
        sortOptions.stars = -1;
        break;
      case 'rating':
        sortOptions.averageRating = -1;
        break;
    }
    
    // Get total count for pagination
    const totalCount = await collection.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);
    
    // Get models with pagination
    const models = await collection
      .find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray() as AIModel[];
    
    return { models, totalCount, totalPages };
  }

  /**
   * Get featured models
   */
  static async getFeaturedModels(limit = 5): Promise<AIModel[]> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    return await collection
      .find({ featured: true })
      .sort({ downloads: -1 })
      .limit(limit)
      .toArray() as AIModel[];
  }

  /**
   * Get a model by its ID
   */
  static async getModelById(id: string): Promise<AIModel | null> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    try {
      return await collection.findOne({ _id: new ObjectId(id) }) as AIModel | null;
    } catch (error) {
      console.error('Error getting model by ID:', error);
      return null;
    }
  }

  /**
   * Get a model by its slug
   */
  static async getModelBySlug(slug: string): Promise<AIModel | null> {
    const collection = await getCollection(this.COLLECTION_NAME);
    return await collection.findOne({ slug }) as AIModel | null;
  }

  /**
   * Update a model
   */
  static async updateModel(id: string, updates: Partial<AIModel>): Promise<boolean> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    // Remove fields that shouldn't be updated directly
    const { _id, created_at, downloads, stars, ...updateData } = updates;
    
    // Add updated_at timestamp
    const updateWithTimestamp = {
      ...updateData,
      updated_at: new Date()
    };
    
    // If reviews are updated, recalculate average rating
    if (updates.reviews) {
      updateWithTimestamp.averageRating = this.calculateAverageRating(updates.reviews);
    }
    
    try {
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateWithTimestamp }
      );
      
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error updating model:', error);
      return false;
    }
  }

  /**
   * Delete a model
   */
  static async deleteModel(id: string): Promise<boolean> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    try {
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting model:', error);
      return false;
    }
  }

  /**
   * Increment the download count for a model
   */
  static async incrementDownloads(id: string): Promise<boolean> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    try {
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $inc: { downloads: 1 } }
      );
      
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error incrementing downloads:', error);
      return false;
    }
  }

  /**
   * Toggle star for a model
   */
  static async toggleStar(id: string, userId: string, star: boolean): Promise<boolean> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    try {
      // Track who starred the model in a starredBy array
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        star 
          ? { 
              $inc: { stars: 1 },
              $addToSet: { starredBy: userId } 
            }
          : { 
              $inc: { stars: -1 },
              $pull: { starredBy: userId } 
            }
      );
      
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error toggling star:', error);
      return false;
    }
  }

  /**
   * Add a review to a model
   */
  static async addReview(
    modelId: string, 
    review: Omit<ModelReview, '_id' | 'createdAt'>
  ): Promise<ModelReview | null> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    const newReview: ModelReview = {
      ...review,
      _id: new ObjectId(),
      createdAt: new Date()
    };
    
    try {
      // Get current model to check if user already reviewed
      const model = await this.getModelById(modelId);
      
      if (!model) return null;
      
      // Check if user already left a review
      const existingReviewIndex = model.reviews?.findIndex(r => r.userId === review.userId);
      
      if (existingReviewIndex !== undefined && existingReviewIndex >= 0) {
        // Update existing review
        const updatedReviews = [...(model.reviews || [])];
        updatedReviews[existingReviewIndex] = {
          ...updatedReviews[existingReviewIndex],
          rating: review.rating,
          comment: review.comment,
          updatedAt: new Date()
        };
        
        await collection.updateOne(
          { _id: new ObjectId(modelId) },
          { 
            $set: { 
              reviews: updatedReviews,
              averageRating: this.calculateAverageRating(updatedReviews)
            } 
          }
        );
        
        return updatedReviews[existingReviewIndex];
      } else {
        // Add new review
        const updatedReviews = [...(model.reviews || []), newReview];
        
        await collection.updateOne(
          { _id: new ObjectId(modelId) },
          { 
            $push: { reviews: newReview },
            $set: { averageRating: this.calculateAverageRating(updatedReviews) }
          }
        );
        
        return newReview;
      }
    } catch (error) {
      console.error('Error adding review:', error);
      return null;
    }
  }

  /**
   * Search for models
   */
  static async searchModels(query: string, limit = 10): Promise<AIModel[]> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    const searchResults = await collection
      .find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { longDescription: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ]
      })
      .limit(limit)
      .toArray() as AIModel[];
    
    return searchResults;
  }

  /**
   * Get popular model categories with counts
   */
  static async getPopularCategories(): Promise<{ category: ModelCategory, count: number }[]> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    const categories = await collection.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { _id: 0, category: '$_id', count: 1 } }
    ]).toArray() as { category: ModelCategory, count: number }[];
    
    return categories;
  }

  /**
   * Get popular model frameworks with counts
   */
  static async getPopularFrameworks(): Promise<{ framework: ModelFramework, count: number }[]> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    const frameworks = await collection.aggregate([
      { $group: { _id: '$framework', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { _id: 0, framework: '$_id', count: 1 } }
    ]).toArray() as { framework: ModelFramework, count: number }[];
    
    return frameworks;
  }

  /**
   * Add a new version to a model
   */
  static async addModelVersion(id: string, version: ModelVersion): Promise<boolean> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    try {
      // Check if version already exists
      const model = await this.getModelById(id);
      
      if (!model) return false;
      
      const versionExists = model.versions.some(v => v.version === version.version);
      
      if (versionExists) {
        // Update existing version
        const result = await collection.updateOne(
          { 
            _id: new ObjectId(id),
            'versions.version': version.version
          },
          { 
            $set: { 
              'versions.$': version,
              updated_at: new Date()
            } 
          }
        );
        
        return result.modifiedCount > 0;
      } else {
        // Add new version
        const result = await collection.updateOne(
          { _id: new ObjectId(id) },
          { 
            $push: { versions: version },
            $set: { 
              updated_at: new Date()
            }
          }
        );
        
        return result.modifiedCount > 0;
      }
    } catch (error) {
      console.error('Error adding model version:', error);
      return false;
    }
  }

  /**
   * Set current version of a model
   */
  static async setCurrentVersion(id: string, version: string): Promise<boolean> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    try {
      // Check if version exists
      const model = await this.getModelById(id);
      
      if (!model) return false;
      
      const versionExists = model.versions.some(v => v.version === version);
      
      if (!versionExists) return false;
      
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            currentVersion: version,
            updated_at: new Date()
          } 
        }
      );
      
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error setting current version:', error);
      return false;
    }
  }

  /**
   * Calculate average rating from reviews
   */
  private static calculateAverageRating(reviews: ModelReview[]): number {
    if (!reviews || reviews.length === 0) return 0;
    
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return parseFloat((sum / reviews.length).toFixed(1));
  }
} 