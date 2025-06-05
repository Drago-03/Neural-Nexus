/**
 * User Profile Service (CommonJS version for testing)
 * 
 * Handles user profile data and avatar storage using the storage service
 */

const { v4: uuidv4 } = require('uuid');
const { 
  storeItem, 
  getItem, 
  queryItems, 
  updateItem, 
  deleteItem,
  uploadFile
} = require('./storage-service.js');

// User profile collection name
const PROFILE_COLLECTION = 'profiles';
const AVATAR_PATH = 'avatars';

/**
 * User Profile Service
 * 
 * This service handles user profile data and avatars
 */
class UserProfileService {
  /**
   * Create or update a user profile
   */
  static async saveProfile(profile) {
    try {
      if (!profile || !profile.userId) {
        console.error('Invalid profile data: missing userId');
        return null;
      }
      
      // Check if profile exists
      const existingProfile = await this.getProfileByUserId(profile.userId);
      
      if (existingProfile) {
        // Update existing profile
        const updatedProfile = await updateItem(
          PROFILE_COLLECTION, 
          existingProfile.id, 
          {
            ...profile,
            updatedAt: new Date().toISOString()
          }
        );
        
        // Send notification email (if email service is available)
        try {
          const EmailService = require('./email-service.js');
          if (profile.email && EmailService && EmailService.sendProfileUpdateNotification) {
            await EmailService.sendProfileUpdateNotification(profile.email, profile.displayName || 'User');
          }
        } catch (emailError) {
          console.error('Failed to send profile update notification:', emailError);
        }
        
        return updatedProfile;
      } else {
        // Create new profile
        const newProfile = {
          id: uuidv4(),
          userId: profile.userId,
          displayName: profile.displayName || 'User',
          bio: profile.bio || '',
          avatarUrl: profile.avatarUrl,
          socialLinks: profile.socialLinks || {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        return await storeItem(PROFILE_COLLECTION, newProfile);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      return null;
    }
  }
  
  /**
   * Get a user profile by user ID
   */
  static async getProfileByUserId(userId) {
    try {
      if (!userId) {
        console.error('Invalid userId: undefined or empty');
        return null;
      }
      
      const profiles = await queryItems(PROFILE_COLLECTION, { userId });
      return profiles.length > 0 ? profiles[0] : null;
    } catch (error) {
      console.error('Error getting profile by user ID:', error);
      return null;
    }
  }
  
  /**
   * Get a user profile by profile ID
   */
  static async getProfile(profileId) {
    try {
      return await getItem(PROFILE_COLLECTION, profileId);
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  }
  
  /**
   * Delete a user profile
   */
  static async deleteProfile(profileId) {
    try {
      return await deleteItem(PROFILE_COLLECTION, profileId);
    } catch (error) {
      console.error('Error deleting profile:', error);
      return false;
    }
  }
  
  /**
   * Upload a profile avatar
   */
  static async uploadAvatar(userId, buffer, contentType) {
    try {
      // Generate a unique filename
      const filename = `${userId}-${Date.now()}.${this.getFileExtension(contentType)}`;
      const filePath = `${AVATAR_PATH}/${filename}`;
      
      // Upload file
      const avatarUrl = await uploadFile(filePath, buffer, contentType);
      
      // Update profile with new avatar URL
      const profile = await this.getProfileByUserId(userId);
      if (profile) {
        await this.saveProfile({
          ...profile,
          avatarUrl
        });
      }
      
      return avatarUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return null;
    }
  }
  
  /**
   * Delete a profile avatar
   */
  static async deleteAvatar(profileId) {
    try {
      const profile = await this.getProfile(profileId);
      if (!profile || !profile.avatarUrl) {
        return false;
      }
      
      // Update profile to remove avatar URL
      await this.saveProfile({
        ...profile,
        avatarUrl: undefined
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting avatar:', error);
      return false;
    }
  }
  
  /**
   * Get file extension from content type
   */
  static getFileExtension(contentType) {
    const types = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
      'image/svg+xml': 'svg'
    };
    
    return types[contentType] || 'jpg';
  }
}

module.exports = { UserProfileService }; 