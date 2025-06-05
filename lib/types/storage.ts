/**
 * Base interface for all items stored in cloud storage
 */
export interface StorageItem {
  /**
   * Unique identifier for the item
   */
  id: string;
  
  /**
   * Creation timestamp (ISO string)
   */
  createdAt?: string;
  
  /**
   * Last update timestamp (ISO string)
   */
  updatedAt?: string;
  
  /**
   * Logical deletion flag - if true, the item is considered deleted
   * but may still exist in the storage system
   */
  isDeleted?: boolean;
  
  /**
   * Version number for optimistic concurrency control
   * Note: Some types may implement their own versioning scheme,
   * in which case they should use a different property name for semantic versions
   */
  version?: number;
} 