import { v4 as uuidv4 } from 'uuid';
import { StorageService } from './storage-service';
import { StorageItem } from '../types/storage';

// Model-related interfaces
export interface ModelTag extends StorageItem {
  id: string;
  name: string;
  count: number;
  createdAt: string;
}

export interface ModelVersion extends Omit<StorageItem, 'version'> {
  id: string;
  modelId: string;
  version: string;  // This is the semantic version string like "1.0.0"
  versionNum?: number; // This is for storage version tracking
  fileUrl: string;
  fileName: string;
  fileSize: number;
  filePath: string;
  checksum: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  downloads: number;
  status: 'processing' | 'ready' | 'failed';
  error?: string;
  metadata: Record<string, any>;
}

export interface ModelFeature {
  name: string;
  description: string;
  icon?: string;
}

export interface ModelRating extends StorageItem {
  id: string;
  modelId: string;
  userId: string;
  rating: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ModelMetrics extends StorageItem {
  id: string;
  modelId: string;
  metricName: string;
  metricValue: number;
  benchmark?: string;
  datasetName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ModelLicense {
  type: 'open' | 'commercial' | 'research' | 'custom';
  name: string;
  url?: string;
  customTerms?: string;
}

export interface Model extends StorageItem {
  id: string;
  userId: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  category: string;
  subcategory?: string;
  tags: string[];
  framework?: string;
  language?: string;
  currentVersionId?: string;
  currentVersion?: string;
  thumbnailUrl?: string;
  demoUrl?: string;
  documentationUrl?: string;
  sourceCodeUrl?: string;
  features?: ModelFeature[];
  requirementsHardware?: string;
  requirementsSoftware?: string;
  createdAt: string;
  updatedAt: string;
  downloads: number;
  views: number;
  averageRating: number;
  ratingCount: number;
  isPublic: boolean;
  isDeleted: boolean;
  license: ModelLicense;
  paymentType: 'free' | 'paid' | 'subscription';
  metrics?: ModelMetrics[];
  status: 'draft' | 'pending' | 'published' | 'rejected';
  modelType: 'core' | 'finetuned' | 'quantized' | 'distilled';
  architecture?: string;
  parameters?: number;
  inputType?: string[];
  outputType?: string[];
  inputExample?: string;
  outputExample?: string;
  trainedOn?: string[];
  authors?: string[];
  citations?: string[];
  parentModelId?: string;
}

/**
 * Service for managing AI models and related data
 */
export class ModelService {
  private static readonly MODELS_COLLECTION = 'models';
  private static readonly VERSIONS_COLLECTION = 'modelVersions';
  private static readonly RATINGS_COLLECTION = 'modelRatings';
  private static readonly TAGS_COLLECTION = 'modelTags';
  private static readonly METRICS_COLLECTION = 'modelMetrics';

  /**
   * Create a new model
   */
  static async createModel(
    modelData: Omit<Model, 'id' | 'createdAt' | 'updatedAt' | 'downloads' | 'views' | 'averageRating' | 'ratingCount' | 'isDeleted'>
  ): Promise<Model> {
    try {
      // Generate timestamp
      const now = new Date().toISOString();
      
      // Create model object with defaults
      const model: Model = {
        id: StorageService.generateId(),
        ...modelData,
        downloads: 0,
        views: 0,
        averageRating: 0,
        ratingCount: 0,
        isDeleted: false,
        createdAt: now,
        updatedAt: now,
        version: 1
      };
      
      // Store model in cloud storage
      const storedModel = await StorageService.storeItem<Model>(this.MODELS_COLLECTION, model);
      
      if (!storedModel) {
        throw new Error('Failed to store model');
      }
      
      // Update tag counts
      if (model.tags && model.tags.length > 0) {
        await this.updateTagCounts(model.tags);
      }
      
      return storedModel;
    } catch (error) {
      console.error('Error creating model:', error);
      throw error;
    }
  }

  /**
   * Get a model by ID
   */
  static async getModelById(id: string): Promise<Model | null> {
    try {
      const model = await StorageService.getItem<Model>(this.MODELS_COLLECTION, id);
      
      // Don't return deleted models unless they're explicitly requested
      if (model && model.isDeleted) {
        return null;
      }
      
      return model;
    } catch (error) {
      console.error(`Error getting model ${id}:`, error);
      return null;
    }
  }

  /**
   * Update a model
   */
  static async updateModel(id: string, updates: Partial<Model>): Promise<Model | null> {
    try {
      // Get existing model
      const existingModel = await this.getModelById(id);
      
      if (!existingModel) {
        return null;
      }
      
      // Remove fields that shouldn't be updated directly
      const { id: _, createdAt, downloads, views, averageRating, ratingCount, isDeleted, ...updateData } = updates;
      
      // Add updated timestamp
      const updateWithTimestamp = {
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      
      // If tags are being updated, update tag counts
      if (updates.tags && !this.arraysEqual(existingModel.tags, updates.tags)) {
        // Remove counts for tags that are being removed
        const removedTags = existingModel.tags.filter(tag => !updates.tags!.includes(tag));
        if (removedTags.length > 0) {
          await this.updateTagCounts(removedTags, -1);
        }
        
        // Add counts for new tags
        const addedTags = updates.tags.filter(tag => !existingModel.tags.includes(tag));
        if (addedTags.length > 0) {
          await this.updateTagCounts(addedTags, 1);
        }
      }
      
      // Update the model
      return await StorageService.updateItem<Model>(this.MODELS_COLLECTION, id, updateWithTimestamp);
    } catch (error) {
      console.error(`Error updating model ${id}:`, error);
      return null;
    }
  }

  /**
   * Soft delete a model (mark as deleted)
   */
  static async deleteModel(id: string): Promise<boolean> {
    try {
      // Mark model as deleted
      const result = await StorageService.updateItem<Model>(this.MODELS_COLLECTION, id, {
        isDeleted: true,
        updatedAt: new Date().toISOString()
      });
      
      return !!result;
    } catch (error) {
      console.error(`Error deleting model ${id}:`, error);
      return false;
    }
  }

  /**
   * Permanently delete a model and all related data
   */
  static async permanentlyDeleteModel(id: string): Promise<boolean> {
    try {
      // Get the model to get its tags and other data
      const model = await this.getModelById(id);
      
      if (!model) {
        return false;
      }
      
      // Update tag counts
      if (model.tags && model.tags.length > 0) {
        await this.updateTagCounts(model.tags, -1);
      }
      
      // Get all versions of the model
      const versions = await this.getModelVersions(id);
      
      // Delete all versions
      await Promise.all(versions.map(version => 
        StorageService.deleteItem(this.VERSIONS_COLLECTION, version.id)
      ));
      
      // Delete all ratings
      const ratings = await this.getModelRatings(id);
      await Promise.all(ratings.map(rating => 
        StorageService.deleteItem(this.RATINGS_COLLECTION, rating.id)
      ));
      
      // Delete metrics
      const metrics = await this.getModelMetrics(id);
      await Promise.all(metrics.map(metric => 
        StorageService.deleteItem(this.METRICS_COLLECTION, metric.id)
      ));
      
      // Delete the model
      return await StorageService.deleteItem(this.MODELS_COLLECTION, id);
    } catch (error) {
      console.error(`Error permanently deleting model ${id}:`, error);
      return false;
    }
  }

  /**
   * Get all models with optional filtering
   */
  static async getAllModels(options: {
    page?: number;
    limit?: number;
    category?: string;
    tags?: string[];
    userId?: string;
    isPublic?: boolean;
    sortBy?: 'createdAt' | 'downloads' | 'rating';
    sortOrder?: 'asc' | 'desc';
    status?: 'draft' | 'pending' | 'published' | 'rejected';
  } = {}): Promise<{ models: Model[]; total: number }> {
    try {
      // Default options
      const page = options.page || 1;
      const limit = options.limit || 20;
      
      // Build query object
      const query: Record<string, any> = {
        isDeleted: false
      };
      
      if (options.category) {
        query.category = options.category;
      }
      
      if (options.userId) {
        query.userId = options.userId;
      }
      
      if (options.isPublic !== undefined) {
        query.isPublic = options.isPublic;
      }
      
      if (options.status) {
        query.status = options.status;
      }
      
      // Get all models - need to filter manually because cloud storage doesn't support complex queries
      let allModels = await StorageService.queryItems<Model>(this.MODELS_COLLECTION, query);
      
      // Filter by tags if specified
      if (options.tags && options.tags.length > 0) {
        allModels = allModels.filter(model => 
          options.tags!.every(tag => model.tags.includes(tag))
        );
      }
      
      // Sort models
      if (options.sortBy) {
        const sortField = options.sortBy === 'rating' ? 'averageRating' : options.sortBy;
        const sortOrder = options.sortOrder === 'asc' ? 1 : -1;
        
        allModels.sort((a, b) => {
          const valueA = a[sortField as keyof Model];
          const valueB = b[sortField as keyof Model];
          
          if (typeof valueA === 'string' && typeof valueB === 'string') {
            return sortOrder * valueA.localeCompare(valueB);
          } else {
            return sortOrder * ((valueA as number) - (valueB as number));
          }
        });
      } else {
        // Default sort by createdAt desc
        allModels.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      
      // Get total count
      const total = allModels.length;
      
      // Paginate
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedModels = allModels.slice(startIndex, endIndex);
      
      return {
        models: paginatedModels,
        total
      };
    } catch (error) {
      console.error('Error getting models:', error);
      return { models: [], total: 0 };
    }
  }

  /**
   * Create a new model version
   */
  static async createModelVersion(versionData: Omit<ModelVersion, 'id' | 'createdAt' | 'updatedAt' | 'downloads' | 'versionNum'>): Promise<ModelVersion> {
    try {
      // Generate timestamp
      const now = new Date().toISOString();
      
      // Create version object
      const version: ModelVersion = {
        id: StorageService.generateId(),
        ...versionData,
        downloads: 0,
        createdAt: now,
        updatedAt: now,
        versionNum: 1 // For storage tracking
      };
      
      // Store version using the special method for version items
      const storedVersion = await StorageService.storeVersionItem(
        this.VERSIONS_COLLECTION, 
        version
      );
      
      if (!storedVersion) {
        throw new Error('Failed to store model version');
      }
      
      // Update model's current version if needed
      const model = await this.getModelById(version.modelId);
      
      if (model && (!model.currentVersionId || !model.currentVersion)) {
        await this.updateModel(version.modelId, {
          currentVersionId: version.id,
          currentVersion: version.version
        });
      }
      
      return storedVersion;
    } catch (error) {
      console.error('Error creating model version:', error);
      throw error;
    }
  }

  /**
   * Get all versions of a model
   */
  static async getModelVersions(modelId: string): Promise<ModelVersion[]> {
    try {
      // Using 'any' with type assertion to bypass the constraint check
      const versions = await StorageService.queryItems<any>(this.VERSIONS_COLLECTION, { modelId });
      
      // Convert the result to ModelVersion[]
      const typedVersions = versions as ModelVersion[];
      
      // Sort by version (assuming semver-like versions)
      return typedVersions.sort((a, b) => {
        // Compare versions (this is a simple comparison, not fully semver compliant)
        return b.version.localeCompare(a.version, undefined, { numeric: true });
      });
    } catch (error) {
      console.error(`Error getting versions for model ${modelId}:`, error);
      return [];
    }
  }

  /**
   * Get a specific model version
   */
  static async getModelVersion(versionId: string): Promise<ModelVersion | null> {
    try {
      // Using 'any' with type assertion to bypass the constraint check
      const version = await StorageService.getItem<any>(this.VERSIONS_COLLECTION, versionId);
      return version as ModelVersion | null;
    } catch (error) {
      console.error(`Error getting model version ${versionId}:`, error);
      return null;
    }
  }

  /**
   * Update a model version
   */
  static async updateVersion(versionId: string, updates: Partial<ModelVersion>): Promise<ModelVersion | null> {
    try {
      // Remove fields that shouldn't be updated directly
      const { id: _, modelId, createdAt, downloads, ...updateData } = updates;
      
      // Use the special update method for version items
      return await StorageService.updateVersionItem(
        this.VERSIONS_COLLECTION, 
        versionId, 
        updateData
      );
    } catch (error) {
      console.error(`Error updating model version ${versionId}:`, error);
      return null;
    }
  }

  /**
   * Delete a model version
   */
  static async deleteModelVersion(versionId: string): Promise<boolean> {
    try {
      // Get the version
      const version = await this.getModelVersion(versionId);
      
      if (!version) {
        return false;
      }
      
      // Get the model
      const model = await this.getModelById(version.modelId);
      
      if (!model) {
        return false;
      }
      
      // Check if this is the current version
      if (model.currentVersionId === versionId) {
        // Get all versions
        const versions = await this.getModelVersions(model.id);
        
        // Find the next most recent version that isn't the one being deleted
        const nextVersion = versions.find(v => v.id !== versionId);
        
        if (nextVersion) {
          // Update the model's current version
          await this.updateModel(model.id, {
            currentVersionId: nextVersion.id,
            currentVersion: nextVersion.version
          });
        } else {
          // No other versions, clear the current version
          await this.updateModel(model.id, {
            currentVersionId: undefined,
            currentVersion: undefined
          });
        }
      }
      
      // Delete the version
      return await StorageService.deleteItem(this.VERSIONS_COLLECTION, versionId);
    } catch (error) {
      console.error(`Error deleting model version ${versionId}:`, error);
      return false;
    }
  }

  /**
   * Helper method to check if two arrays are equal
   */
  private static arraysEqual(a: any[], b: any[]): boolean {
    if (a === b) return true;
    if (a.length !== b.length) return false;
    
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    
    return true;
  }

  /**
   * Update tag counts when models are created or deleted
   */
  private static async updateTagCounts(tags: string[], increment = 1): Promise<void> {
    try {
      // Process each tag
      for (const tagName of tags) {
        // Get all tags
        const existingTags = await StorageService.queryItems<ModelTag>(this.TAGS_COLLECTION, { name: tagName });
        
        if (existingTags.length > 0) {
          // Update existing tag
          const tag = existingTags[0];
          await StorageService.updateItem<ModelTag>(this.TAGS_COLLECTION, tag.id, {
            count: Math.max(0, tag.count + increment), // Ensure count never goes below 0
            updatedAt: new Date().toISOString(),
            version: (tag.version || 0) + 1
          });
        } else if (increment > 0) {
          // Create new tag if incrementing
          const now = new Date().toISOString();
          const newTag: ModelTag = {
            id: StorageService.generateId(),
            name: tagName,
            count: increment,
            createdAt: now,
            version: 1
          };
          
          await StorageService.storeItem<ModelTag>(this.TAGS_COLLECTION, newTag);
        }
      }
    } catch (error) {
      console.error('Error updating tag counts:', error);
    }
  }

  /**
   * Get all model tags
   */
  static async getAllTags(): Promise<ModelTag[]> {
    try {
      const tags = await StorageService.queryItems<ModelTag>(this.TAGS_COLLECTION);
      
      // Sort by count (descending) and then by name
      return tags
        .filter(tag => tag.count > 0) // Only return tags that are in use
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error getting all tags:', error);
      return [];
    }
  }

  /**
   * Get all ratings for a model
   */
  static async getModelRatings(modelId: string): Promise<ModelRating[]> {
    try {
      return await StorageService.queryItems<ModelRating>(this.RATINGS_COLLECTION, { modelId });
    } catch (error) {
      console.error(`Error getting ratings for model ${modelId}:`, error);
      return [];
    }
  }

  /**
   * Get all metrics for a model
   */
  static async getModelMetrics(modelId: string): Promise<ModelMetrics[]> {
    try {
      return await StorageService.queryItems<ModelMetrics>(this.METRICS_COLLECTION, { modelId });
    } catch (error) {
      console.error(`Error getting metrics for model ${modelId}:`, error);
      return [];
    }
  }

  /**
   * Upload a model file to cloud storage
   */
  static async uploadModelFile(file: {
    buffer: Buffer;
    mimetype: string;
    name: string;
    size: number;
  }): Promise<{ url: string; path: string } | null> {
    try {
      // Generate a unique path for the file
      const userId = 'system'; // Should be replaced with actual user ID
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = `models/${userId}/${timestamp}/${safeName}`;
      
      // Upload the file
      const fileUrl = await StorageService.uploadFile(
        filePath,
        file.buffer,
        file.mimetype
      );
      
      if (!fileUrl) {
        throw new Error('Failed to upload file');
      }
      
      return {
        url: fileUrl,
        path: filePath
      };
    } catch (error) {
      console.error('Error uploading model file:', error);
      return null;
    }
  }

  /**
   * Upload a model thumbnail
   */
  static async uploadModelThumbnail(userId: string, modelId: string, file: Buffer, contentType: string): Promise<string | null> {
    try {
      // Generate a unique path for the thumbnail
      const timestamp = Date.now();
      const filePath = `thumbnails/${userId}/${modelId}/${timestamp}.jpg`;
      
      // Upload the file
      const fileUrl = await StorageService.uploadFile(
        filePath,
        file,
        contentType
      );
      
      if (!fileUrl) {
        throw new Error('Failed to upload thumbnail');
      }
      
      return fileUrl;
    } catch (error) {
      console.error('Error uploading model thumbnail:', error);
      return null;
    }
  }

  /**
   * Increment model view count
   */
  static async incrementModelViews(id: string): Promise<boolean> {
    try {
      // Get the model
      const model = await this.getModelById(id);
      
      if (!model) {
        return false;
      }
      
      // Increment views
      await StorageService.updateItem<Model>(this.MODELS_COLLECTION, id, {
        views: model.views + 1,
        updatedAt: new Date().toISOString()
      });
      
      return true;
    } catch (error) {
      console.error(`Error incrementing views for model ${id}:`, error);
      return false;
    }
  }

  /**
   * Increment model download count
   */
  static async incrementModelDownloads(id: string, versionId?: string): Promise<boolean> {
    try {
      // Get the model
      const model = await this.getModelById(id);
      
      if (!model) {
        return false;
      }
      
      // Increment model downloads
      await StorageService.updateItem<Model>(this.MODELS_COLLECTION, id, {
        downloads: model.downloads + 1,
        updatedAt: new Date().toISOString()
      });
      
      // Increment version downloads if specified
      if (versionId) {
        const version = await this.getModelVersion(versionId);
        
        if (version) {
          await StorageService.updateVersionItem(
            this.VERSIONS_COLLECTION, 
            versionId, 
            {
              downloads: version.downloads + 1
            }
          );
        }
      }
      
      return true;
    } catch (error) {
      console.error(`Error incrementing downloads for model ${id}:`, error);
      return false;
    }
  }

  /**
   * Rate a model
   */
  static async rateModel(modelId: string, userId: string, rating: number, review?: string): Promise<ModelRating | null> {
    try {
      if (rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }
      
      // Check if user has already rated this model
      const existingRatings = await StorageService.queryItems<ModelRating>(this.RATINGS_COLLECTION, { 
        modelId, 
        userId 
      });
      
      let ratingObj: ModelRating;
      const now = new Date().toISOString();
      
      if (existingRatings.length > 0) {
        // Update existing rating
        const existingRating = existingRatings[0];
        
        // Create updates
        const updates = {
          rating,
          review,
          updatedAt: now
        };
        
        // Update the rating
        const updatedRating = await StorageService.updateItem<ModelRating>(this.RATINGS_COLLECTION, existingRating.id, updates);
        
        if (!updatedRating) {
          throw new Error('Failed to update rating');
        }
        
        ratingObj = updatedRating;
      } else {
        // Create new rating
        ratingObj = {
          id: StorageService.generateId(),
          modelId,
          userId,
          rating,
          review,
          createdAt: now,
          updatedAt: now,
          version: 1
        };
        
        // Store the rating
        const storedRating = await StorageService.storeItem<ModelRating>(this.RATINGS_COLLECTION, ratingObj);
        
        if (!storedRating) {
          throw new Error('Failed to store rating');
        }
        
        ratingObj = storedRating;
      }
      
      // Update model average rating
      await this.updateModelAverageRating(modelId);
      
      return ratingObj;
    } catch (error) {
      console.error('Error rating model:', error);
      return null;
    }
  }

  /**
   * Update model average rating
   */
  private static async updateModelAverageRating(modelId: string): Promise<boolean> {
    try {
      // Get all ratings for the model
      const ratings = await this.getModelRatings(modelId);
      
      if (ratings.length === 0) {
        // No ratings, set average to 0
        await this.updateModel(modelId, {
          averageRating: 0,
          ratingCount: 0
        });
        return true;
      }
      
      // Calculate average rating
      const sum = ratings.reduce((total, r) => total + r.rating, 0);
      const average = sum / ratings.length;
      
      // Update the model
      await this.updateModel(modelId, {
        averageRating: parseFloat(average.toFixed(2)),
        ratingCount: ratings.length
      });
      
      return true;
    } catch (error) {
      console.error('Error updating model average rating:', error);
      return false;
    }
  }

  /**
   * Get user rating for a model
   */
  static async getUserRating(modelId: string, userId: string): Promise<ModelRating | null> {
    try {
      const ratings = await StorageService.queryItems<ModelRating>(this.RATINGS_COLLECTION, { 
        modelId, 
        userId 
      });
      
      return ratings.length > 0 ? ratings[0] : null;
    } catch (error) {
      console.error('Error getting user rating:', error);
      return null;
    }
  }

  /**
   * Delete a rating
   */
  static async deleteRating(ratingId: string): Promise<boolean> {
    try {
      const rating = await StorageService.getItem<ModelRating>(this.RATINGS_COLLECTION, ratingId);
      
      if (!rating) {
        return false;
      }
      
      // Delete the rating
      const success = await StorageService.deleteItem(this.RATINGS_COLLECTION, ratingId);
      
      if (!success) {
        return false;
      }
      
      // Update model average rating
      await this.updateModelAverageRating(rating.modelId);
      
      return true;
    } catch (error) {
      console.error('Error deleting rating:', error);
      return false;
    }
  }
} 