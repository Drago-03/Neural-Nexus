/**
 * User Profile Service
 * 
 * Handles user profile data and avatar storage using the storage service
 */

import { v4 as uuidv4 } from 'uuid';
import { 
  storeItem, 
  getItem, 
  queryItems, 
  updateItem, 
  deleteItem,
  uploadFile
} from './storage-service';
import { EmailService } from './email-service';

// User profile collection name
const PROFILE_COLLECTION = 'profiles';
const AVATAR_PATH = 'avatars';

// User profile interface
export interface UserProfile {
  id: string;
  userId: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
    [key: string]: string | undefined;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * User Profile Service
 * 
 * This service handles user profile data and avatars
 */
export class UserProfileService {
  /**
   * Create or update a user profile
   */
  static async saveProfile(profile: Partial<UserProfile> & { userId: string }): Promise<UserProfile | null> {
    try {
      // Check if profile exists
      const existingProfile = await this.getProfileByUserId(profile.userId);
      
      if (existingProfile) {
        // Update existing profile
        const updatedProfile = await updateItem<UserProfile>(
          PROFILE_COLLECTION, 
          existingProfile.id, 
          {
            ...profile,
            updatedAt: new Date().toISOString()
          }
        );
        
        // Send notification email
        await this.sendProfileUpdateNotification(updatedProfile);
        
        return updatedProfile;
      } else {
        // Create new profile
        const newProfile: UserProfile = {
          id: uuidv4(),
          userId: profile.userId,
          displayName: profile.displayName || 'User',
          bio: profile.bio || '',
          avatarUrl: profile.avatarUrl,
          socialLinks: profile.socialLinks || {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        return await storeItem<UserProfile>(PROFILE_COLLECTION, newProfile);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      return null;
    }
  }
  
  /**
   * Get a user profile by user ID
   */
  static async getProfileByUserId(userId: string): Promise<UserProfile | null> {
    try {
      const profiles = await queryItems<UserProfile>(PROFILE_COLLECTION, { userId });
      return profiles.length > 0 ? profiles[0] : null;
    } catch (error) {
      console.error('Error getting profile by user ID:', error);
      return null;
    }
  }
  
  /**
   * Get a user profile by profile ID
   */
  static async getProfile(profileId: string): Promise<UserProfile | null> {
    try {
      return await getItem<UserProfile>(PROFILE_COLLECTION, profileId);
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  }
  
  /**
   * Delete a user profile
   */
  static async deleteProfile(profileId: string): Promise<boolean> {
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
  static async uploadAvatar(userId: string, buffer: Buffer, contentType: string): Promise<string | null> {
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
  static async deleteAvatar(profileId: string): Promise<boolean> {
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
   * Send notification email when profile is updated
   */
  private static async sendProfileUpdateNotification(profile: UserProfile | null): Promise<void> {
    if (!profile) return;
    
    try {
      // Get user email from auth service or database
      // This is a placeholder - implement based on your auth system
      const userEmail = `${profile.userId}@example.com`;
      
      await EmailService.sendEmail({
        to: userEmail,
        subject: 'Your Neural Nexus Profile Was Updated',
        html: `
          <h1>Profile Updated</h1>
          <p>Your profile was recently updated. Here's a summary of your profile:</p>
          <ul>
            <li><strong>Display Name:</strong> ${profile.displayName}</li>
            <li><strong>Bio:</strong> ${profile.bio || 'Not provided'}</li>
            <li><strong>Avatar:</strong> ${profile.avatarUrl ? 'Updated' : 'Not set'}</li>
          </ul>
          <p>If you did not make these changes, please contact support immediately.</p>
        `
      });
    } catch (error) {
      console.error('Error sending profile update notification:', error);
    }
  }
  
  /**
   * Get file extension from content type
   */
  private static getFileExtension(contentType: string): string {
    const types: Record<string, string> = {
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