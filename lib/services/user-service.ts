import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { StorageService } from './storage-service';

// Define User interface
export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  name: string;
  bio?: string;
  avatar?: string;
  role: 'user' | 'admin' | 'moderator';
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  isEmailVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: string;
  deletionToken?: string;
  deletionTokenExpires?: string;
  followers?: UserFollower[];
  following?: UserFollower[];
  savedPosts?: string[]; // Array of post IDs
  socialLinks?: UserSocialLinks;
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    emailNotifications: boolean;
    twoFactorEnabled: boolean;
  };
  profileComplete?: boolean;
  organization?: string;
  jobTitle?: string;
  location?: string;
  website?: string;
  skills?: string[];
  interests?: string[];
}

export interface UserFollower {
  userId: string;
  userName: string;
  userAvatar?: string;
  followedAt: string;
}

export interface UserSocialLinks {
  twitter?: string;
  github?: string;
  linkedin?: string;
  instagram?: string;
  website?: string;
}

export type SafeUser = Omit<User, 'password' | 'verificationToken' | 'resetPasswordToken' | 'resetPasswordExpires'>;

export class UserService {
  private static readonly COLLECTION_NAME = 'users';
  private static readonly SALT_ROUNDS = 10;

  /**
   * Create a new user
   */
  static async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'role' | 'isEmailVerified' | 'followers' | 'following' | 'savedPosts'>): Promise<SafeUser | null> {
    try {
      // Check if user with this email or username already exists
      const existingUsers = await StorageService.queryItems<User>(this.COLLECTION_NAME, {
        $or: [
          { email: userData.email.toLowerCase() },
          { username: userData.username.toLowerCase() }
        ]
      });
      
      if (existingUsers.length > 0) {
        return null;
      }
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(userData.password, this.SALT_ROUNDS);
      
      const now = new Date().toISOString();
      const newUser: User = {
        id: StorageService.generateId(),
        ...userData,
        email: userData.email.toLowerCase(),
        username: userData.username.toLowerCase(),
        password: hashedPassword,
        role: 'user',
        createdAt: now,
        updatedAt: now,
        isEmailVerified: false,
        followers: [],
        following: [],
        savedPosts: [],
        profileComplete: false,
        preferences: {
          theme: 'system',
          emailNotifications: true,
          twoFactorEnabled: false
        }
      };
      
      // Store the user in cloud storage
      const storedUser = await StorageService.storeItem<User>(this.COLLECTION_NAME, newUser);
      
      if (!storedUser) {
        console.error('Failed to store new user');
        return null;
      }
      
      // Remove sensitive fields before returning
      const { password, verificationToken, resetPasswordToken, resetPasswordExpires, ...safeUser } = storedUser;
      
      return safeUser;
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: string): Promise<User | null> {
    try {
      return await StorageService.getItem<User>(this.COLLECTION_NAME, id);
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  }

  /**
   * Get a user by email
   */
  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const users = await StorageService.queryItems<User>(this.COLLECTION_NAME, { 
        email: email.toLowerCase() 
      });
      
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  /**
   * Get a user by username
   */
  static async getUserByUsername(username: string): Promise<SafeUser | null> {
    try {
      const users = await StorageService.queryItems<User>(this.COLLECTION_NAME, { 
        username: username.toLowerCase() 
      });
      
      if (users.length === 0) return null;
      
      // Remove sensitive fields
      const user = users[0];
      const { password, verificationToken, resetPasswordToken, resetPasswordExpires, ...safeUser } = user;
      
      return safeUser;
    } catch (error) {
      console.error('Error getting user by username:', error);
      return null;
    }
  }

  /**
   * Check if username is available
   */
  static async isUsernameAvailable(username: string): Promise<boolean> {
    try {
      const users = await StorageService.queryItems<User>(this.COLLECTION_NAME, { 
        username: username.toLowerCase() 
      });
      
      return users.length === 0;
    } catch (error) {
      console.error('Error checking username availability:', error);
      return false;
    }
  }

  /**
   * Check if email is available
   */
  static async isEmailAvailable(email: string): Promise<boolean> {
    try {
      const users = await StorageService.queryItems<User>(this.COLLECTION_NAME, { 
        email: email.toLowerCase() 
      });
      
      return users.length === 0;
    } catch (error) {
      console.error('Error checking email availability:', error);
      return false;
    }
  }

  /**
   * Authenticate a user
   */
  static async authenticateUser(email: string, password: string): Promise<SafeUser | null> {
    try {
      const users = await StorageService.queryItems<User>(this.COLLECTION_NAME, { 
        email: email.toLowerCase() 
      });
      
      if (users.length === 0) return null;
      
      const user = users[0];
      
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) return null;
      
      // Update last login time
      const now = new Date().toISOString();
      await StorageService.updateItem<User>(this.COLLECTION_NAME, user.id, { 
        lastLogin: now,
        updatedAt: now
      });
      
      // Remove sensitive fields
      const { password: _, verificationToken, resetPasswordToken, resetPasswordExpires, ...safeUser } = user;
      
      return { ...safeUser, lastLogin: now };
    } catch (error) {
      console.error('Error authenticating user:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  static async updateUser(id: string, updates: Partial<User>): Promise<boolean> {
    try {
      // Remove fields that shouldn't be updated directly
      const { id: _, password, role, createdAt, isEmailVerified, verificationToken, resetPasswordToken, resetPasswordExpires, ...updateData } = updates;
      
      // Add updated timestamp
      const updatedWithTimestamp = {
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      
      const result = await StorageService.updateItem<User>(this.COLLECTION_NAME, id, updatedWithTimestamp);
      
      return !!result;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  }

  /**
   * Complete user profile
   */
  static async completeProfile(id: string, profileData: {
    displayName?: string;
    bio?: string;
    avatar?: string;
    organization?: string;
    jobTitle?: string;
    location?: string;
    website?: string;
    skills?: string[];
    interests?: string[];
  }): Promise<boolean> {
    try {
      // Get the existing user
      const user = await StorageService.getItem<User>(this.COLLECTION_NAME, id);
      
      if (!user) {
        console.error(`User with ID ${id} not found`);
        return false;
      }
      
      // Create a sanitized update object with only defined values
      const updateFields: Partial<User> = {
        name: profileData.displayName || user.name,
        bio: profileData.bio || user.bio,
        profileComplete: true,
        updatedAt: new Date().toISOString()
      };
      
      // Only add optional fields if they're defined
      if (profileData.avatar) updateFields.avatar = profileData.avatar;
      if (profileData.organization) updateFields.organization = profileData.organization;
      if (profileData.jobTitle) updateFields.jobTitle = profileData.jobTitle;
      if (profileData.location) updateFields.location = profileData.location;
      if (profileData.website) updateFields.website = profileData.website;
      
      // Handle arrays properly
      if (Array.isArray(profileData.skills)) updateFields.skills = profileData.skills;
      if (Array.isArray(profileData.interests)) updateFields.interests = profileData.interests;
      
      // Update the user
      const result = await StorageService.updateItem<User>(this.COLLECTION_NAME, id, updateFields);
      
      return !!result;
    } catch (error) {
      console.error('Error completing profile:', error);
      return false;
    }
  }

  /**
   * Check if user profile is complete
   */
  static async isProfileComplete(id: string): Promise<boolean> {
    try {
      const user = await StorageService.getItem<User>(this.COLLECTION_NAME, id);
      return user?.profileComplete === true;
    } catch (error) {
      console.error('Error checking profile completion:', error);
      return false;
    }
  }

  /**
   * Change user password
   */
  static async changePassword(id: string, currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      // Get the user
      const user = await StorageService.getItem<User>(this.COLLECTION_NAME, id);
      
      if (!user) return false;
      
      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      
      if (!isPasswordValid) return false;
      
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS);
      
      // Update the password
      const result = await StorageService.updateItem<User>(this.COLLECTION_NAME, id, {
        password: hashedPassword,
        updatedAt: new Date().toISOString()
      });
      
      return !!result;
    } catch (error) {
      console.error('Error changing password:', error);
      return false;
    }
  }

  /**
   * Generate a password reset token
   */
  static async generatePasswordResetToken(email: string): Promise<string | null> {
    try {
      // Find the user
      const users = await StorageService.queryItems<User>(this.COLLECTION_NAME, { 
        email: email.toLowerCase() 
      });
      
      if (users.length === 0) return null;
      
      const user = users[0];
      
      // Generate a token
      const token = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15);
      
      // Set token expiration (1 hour)
      const expiration = new Date();
      expiration.setHours(expiration.getHours() + 1);
      
      // Update user with token and expiration
      await StorageService.updateItem<User>(this.COLLECTION_NAME, user.id, {
        resetPasswordToken: token,
        resetPasswordExpires: expiration.toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      return token;
    } catch (error) {
      console.error('Error generating password reset token:', error);
      return null;
    }
  }

  /**
   * Reset password using token
   */
  static async resetPassword(token: string, newPassword: string): Promise<boolean> {
    try {
      // Find user with this token
      const users = await StorageService.queryItems<User>(this.COLLECTION_NAME, {
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date().toISOString() }
      });
      
      if (users.length === 0) return false;
      
      const user = users[0];
      
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS);
      
      // Update the password and clear token
      const now = new Date().toISOString();
      const result = await StorageService.updateItem<User>(this.COLLECTION_NAME, user.id, {
        password: hashedPassword,
        resetPasswordToken: '',
        resetPasswordExpires: '',
        updatedAt: now
      });
      
      return !!result;
    } catch (error) {
      console.error('Error resetting password:', error);
      return false;
    }
  }

  /**
   * Follow a user
   */
  static async followUser(userId: string, targetUserId: string): Promise<boolean> {
    if (userId === targetUserId) return false;
    
    try {
      // Get both users
      const user = await StorageService.getItem<User>(this.COLLECTION_NAME, userId);
      const targetUser = await StorageService.getItem<User>(this.COLLECTION_NAME, targetUserId);
      
      if (!user || !targetUser) return false;
      
      // Check if already following
      const isAlreadyFollowing = user.following?.some(f => f.userId === targetUserId);
      
      if (isAlreadyFollowing) return true; // Already following
      
      const now = new Date().toISOString();
      
      // Create follower objects
      const followerObj: UserFollower = {
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        followedAt: now
      };
      
      const followingObj: UserFollower = {
        userId: targetUser.id,
        userName: targetUser.name,
        userAvatar: targetUser.avatar,
        followedAt: now
      };
      
      // Update current user's following list
      const currentUserFollowing = [...(user.following || []), followingObj];
      await StorageService.updateItem<User>(this.COLLECTION_NAME, userId, {
        following: currentUserFollowing,
        updatedAt: now
      });
      
      // Update target user's followers list
      const targetUserFollowers = [...(targetUser.followers || []), followerObj];
      await StorageService.updateItem<User>(this.COLLECTION_NAME, targetUserId, {
        followers: targetUserFollowers,
        updatedAt: now
      });
      
      return true;
    } catch (error) {
      console.error('Error following user:', error);
      return false;
    }
  }

  /**
   * Unfollow a user
   */
  static async unfollowUser(userId: string, targetUserId: string): Promise<boolean> {
    try {
      // Get both users
      const user = await StorageService.getItem<User>(this.COLLECTION_NAME, userId);
      const targetUser = await StorageService.getItem<User>(this.COLLECTION_NAME, targetUserId);
      
      if (!user || !targetUser) return false;
      
      const now = new Date().toISOString();
      
      // Remove from current user's following list
      const updatedFollowing = (user.following || []).filter(f => f.userId !== targetUserId);
      await StorageService.updateItem<User>(this.COLLECTION_NAME, userId, {
        following: updatedFollowing,
        updatedAt: now
      });
      
      // Remove from target user's followers list
      const updatedFollowers = (targetUser.followers || []).filter(f => f.userId !== userId);
      await StorageService.updateItem<User>(this.COLLECTION_NAME, targetUserId, {
        followers: updatedFollowers,
        updatedAt: now
      });
      
      return true;
    } catch (error) {
      console.error('Error unfollowing user:', error);
      return false;
    }
  }

  /**
   * Toggle saving a post
   */
  static async toggleSavePost(userId: string, postId: string, save: boolean): Promise<boolean> {
    try {
      // Get the user
      const user = await StorageService.getItem<User>(this.COLLECTION_NAME, userId);
      
      if (!user) return false;
      
      let savedPosts = [...(user.savedPosts || [])];
      
      if (save) {
        // Add to saved posts if not already saved
        if (!savedPosts.includes(postId)) {
          savedPosts.push(postId);
        }
      } else {
        // Remove from saved posts
        savedPosts = savedPosts.filter(id => id !== postId);
      }
      
      // Update the user
      const result = await StorageService.updateItem<User>(this.COLLECTION_NAME, userId, {
        savedPosts,
        updatedAt: new Date().toISOString()
      });
      
      return !!result;
    } catch (error) {
      console.error('Error toggling saved post:', error);
      return false;
    }
  }

  /**
   * Get saved posts for a user
   */
  static async getSavedPosts(userId: string): Promise<string[]> {
    try {
      const user = await StorageService.getItem<User>(this.COLLECTION_NAME, userId);
      return user?.savedPosts || [];
    } catch (error) {
      console.error('Error getting saved posts:', error);
      return [];
    }
  }

  /**
   * Update user preferences
   */
  static async updatePreferences(userId: string, preferences: User['preferences']): Promise<boolean> {
    try {
      const result = await StorageService.updateItem<User>(this.COLLECTION_NAME, userId, {
        preferences,
        updatedAt: new Date().toISOString()
      });
      
      return !!result;
    } catch (error) {
      console.error('Error updating preferences:', error);
      return false;
    }
  }

  /**
   * Mark email as verified
   */
  static async verifyEmail(token: string): Promise<boolean> {
    try {
      // Find user with this verification token
      const users = await StorageService.queryItems<User>(this.COLLECTION_NAME, {
        verificationToken: token
      });
      
      if (users.length === 0) return false;
      
      const user = users[0];
      
      // Mark email as verified and clear token
      const result = await StorageService.updateItem<User>(this.COLLECTION_NAME, user.id, {
        isEmailVerified: true,
        verificationToken: '',
        updatedAt: new Date().toISOString()
      });
      
      return !!result;
    } catch (error) {
      console.error('Error verifying email:', error);
      return false;
    }
  }

  /**
   * Search for users
   */
  static async searchUsers(query: string, limit = 10): Promise<SafeUser[]> {
    try {
      // This is a simplified search as GCS doesn't support regex searches directly
      // For a more sophisticated search, you would need to implement custom indexing
      const allUsers = await StorageService.queryItems<User>(this.COLLECTION_NAME);
      
      // Filter users whose name, username, or email contains the query (case insensitive)
      const lowercaseQuery = query.toLowerCase();
      const matchingUsers = allUsers.filter(user => 
        user.name.toLowerCase().includes(lowercaseQuery) ||
        user.username.toLowerCase().includes(lowercaseQuery) ||
        user.email.toLowerCase().includes(lowercaseQuery)
      ).slice(0, limit);
      
      // Remove sensitive fields
      return matchingUsers.map(user => {
        const { password, verificationToken, resetPasswordToken, resetPasswordExpires, ...safeUser } = user;
        return safeUser;
      });
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }

  /**
   * Delete a user account and all their data
   */
  static async deleteUser(id: string): Promise<boolean> {
    try {
      // Delete the user
      const result = await StorageService.deleteItem(this.COLLECTION_NAME, id);
      
      // Note: In a complete implementation, you would also delete all related data
      // such as models, API keys, etc. owned by this user
      
      return result;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }
} 