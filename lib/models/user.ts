import { ObjectId } from 'mongodb';
import { getCollection } from '../mongodb';
import bcrypt from 'bcryptjs';

export interface UserFollower {
  userId: string;
  userName: string;
  userAvatar?: string;
  followedAt: Date;
}

export interface UserSocialLinks {
  twitter?: string;
  github?: string;
  linkedin?: string;
  instagram?: string;
  website?: string;
}

export interface User {
  _id?: ObjectId;
  username: string;
  email: string;
  password: string;
  name: string;
  bio?: string;
  avatar?: string;
  role: 'user' | 'admin' | 'moderator';
  createdAt: Date;
  updatedAt?: Date;
  lastLogin?: Date;
  isEmailVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
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

export type SafeUser = Omit<User, 'password' | 'verificationToken' | 'resetPasswordToken' | 'resetPasswordExpires'>;

export class UserService {
  private static readonly COLLECTION_NAME = 'users';
  private static readonly SALT_ROUNDS = 10;

  /**
   * Create a new user
   */
  static async createUser(userData: Omit<User, '_id' | 'createdAt' | 'role' | 'isEmailVerified' | 'followers' | 'following' | 'savedPosts'>): Promise<SafeUser | null> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    // Check if user with this email or username already exists
    const existingUser = await collection.findOne({
      $or: [
        { email: userData.email.toLowerCase() },
        { username: userData.username.toLowerCase() }
      ]
    });
    
    if (existingUser) {
      return null;
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, this.SALT_ROUNDS);
    
    const newUser: User = {
      ...userData,
      email: userData.email.toLowerCase(),
      username: userData.username.toLowerCase(),
      password: hashedPassword,
      role: 'user',
      createdAt: new Date(),
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
    
    const result = await collection.insertOne(newUser);
    const { password, verificationToken, resetPasswordToken, resetPasswordExpires, ...safeUser } = newUser;
    
    return { ...safeUser, _id: result.insertedId };
  }

  /**
   * Get a user by ID
   */
  static async getUserById(id: string): Promise<SafeUser | null> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    try {
      const user = await collection.findOne({ _id: new ObjectId(id) }) as User | null;
      
      if (!user) return null;
      
      // Remove sensitive fields
      const { password, verificationToken, resetPasswordToken, resetPasswordExpires, ...safeUser } = user;
      return safeUser;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  }

  /**
   * Get a user by email
   */
  static async getUserByEmail(email: string): Promise<User | null> {
    const collection = await getCollection(this.COLLECTION_NAME);
    return await collection.findOne({ email: email.toLowerCase() }) as User | null;
  }

  /**
   * Get a user by username
   */
  static async getUserByUsername(username: string): Promise<SafeUser | null> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    const user = await collection.findOne({ username: username.toLowerCase() }) as User | null;
    
    if (!user) return null;
    
    // Remove sensitive fields
    const { password, verificationToken, resetPasswordToken, resetPasswordExpires, ...safeUser } = user;
    return safeUser;
  }

  /**
   * Check if username is available
   */
  static async isUsernameAvailable(username: string): Promise<boolean> {
    const collection = await getCollection(this.COLLECTION_NAME);
    const user = await collection.findOne({ username: username.toLowerCase() });
    return !user;
  }

  /**
   * Check if email is available
   */
  static async isEmailAvailable(email: string): Promise<boolean> {
    const collection = await getCollection(this.COLLECTION_NAME);
    const user = await collection.findOne({ email: email.toLowerCase() });
    return !user;
  }

  /**
   * Authenticate a user
   */
  static async authenticateUser(email: string, password: string): Promise<SafeUser | null> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    const user = await collection.findOne({ email: email.toLowerCase() }) as User | null;
    
    if (!user) return null;
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) return null;
    
    // Update last login time
    await collection.updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    );
    
    // Remove sensitive fields
    const { password: _, verificationToken, resetPasswordToken, resetPasswordExpires, ...safeUser } = user;
    return { ...safeUser, lastLogin: new Date() };
  }

  /**
   * Update user profile
   */
  static async updateUser(id: string, updates: Partial<User>): Promise<boolean> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    // Remove fields that shouldn't be updated directly
    const { _id, password, role, createdAt, isEmailVerified, verificationToken, resetPasswordToken, resetPasswordExpires, ...updateData } = updates;
    
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
    const collection = await getCollection(this.COLLECTION_NAME);
    
    try {
      // Create a sanitized update object with only defined values
      const updateFields: any = {
        name: profileData.displayName || '',
        bio: profileData.bio || '',
        profileComplete: true,
        updatedAt: new Date()
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
      
      // Update user profile with provided data
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateFields }
      );
      
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error completing profile:', error);
      return false;
    }
  }

  /**
   * Check if user profile is complete
   */
  static async isProfileComplete(id: string): Promise<boolean> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    try {
      const user = await collection.findOne(
        { _id: new ObjectId(id) },
        { projection: { profileComplete: 1 } }
      );
      
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
    const collection = await getCollection(this.COLLECTION_NAME);
    
    // Get the user
    const user = await collection.findOne({ _id: new ObjectId(id) }) as User | null;
    
    if (!user) return false;
    
    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isPasswordValid) return false;
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS);
    
    // Update the password
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          password: hashedPassword,
          updatedAt: new Date() 
        } 
      }
    );
    
    return result.modifiedCount > 0;
  }

  /**
   * Generate a password reset token
   */
  static async generatePasswordResetToken(email: string): Promise<string | null> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    // Find the user
    const user = await collection.findOne({ email: email.toLowerCase() }) as User | null;
    
    if (!user) return null;
    
    // Generate a token
    const token = Math.random().toString(36).substring(2, 15) + 
                 Math.random().toString(36).substring(2, 15);
    
    // Set token expiration (1 hour)
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 1);
    
    // Update user with token and expiration
    await collection.updateOne(
      { _id: user._id },
      { 
        $set: { 
          resetPasswordToken: token,
          resetPasswordExpires: expiration,
          updatedAt: new Date() 
        } 
      }
    );
    
    return token;
  }

  /**
   * Reset password using token
   */
  static async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    // Find user with this token
    const user = await collection.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    }) as User | null;
    
    if (!user) return false;
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS);
    
    // Update the password and clear token
    const result = await collection.updateOne(
      { _id: user._id },
      { 
        $set: { 
          password: hashedPassword,
          updatedAt: new Date() 
        },
        $unset: {
          resetPasswordToken: "",
          resetPasswordExpires: ""
        }
      }
    );
    
    return result.modifiedCount > 0;
  }

  /**
   * Follow a user
   */
  static async followUser(userId: string, targetUserId: string): Promise<boolean> {
    if (userId === targetUserId) return false;
    
    const collection = await getCollection(this.COLLECTION_NAME);
    
    // Get both users
    const [user, targetUser] = await Promise.all([
      collection.findOne({ _id: new ObjectId(userId) }) as Promise<User | null>,
      collection.findOne({ _id: new ObjectId(targetUserId) }) as Promise<User | null>
    ]);
    
    if (!user || !targetUser) return false;
    
    // Check if already following
    const isAlreadyFollowing = user.following?.some(f => f.userId === targetUserId);
    
    if (isAlreadyFollowing) return true; // Already following
    
    // Create follower objects
    const followerObj: UserFollower = {
      userId: user._id!.toString(),
      userName: user.name,
      userAvatar: user.avatar,
      followedAt: new Date()
    };
    
    const followingObj: UserFollower = {
      userId: targetUser._id!.toString(),
      userName: targetUser.name,
      userAvatar: targetUser.avatar,
      followedAt: new Date()
    };
    
    // Update both users
    await Promise.all([
      // Add target user to current user's following list
      collection.updateOne(
        { _id: new ObjectId(userId) },
        { $push: { following: followingObj } }
      ),
      
      // Add current user to target user's followers list
      collection.updateOne(
        { _id: new ObjectId(targetUserId) },
        { $push: { followers: followerObj } }
      )
    ]);
    
    return true;
  }

  /**
   * Unfollow a user
   */
  static async unfollowUser(userId: string, targetUserId: string): Promise<boolean> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    // Update both users
    await Promise.all([
      // Remove target user from current user's following list
      collection.updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { following: { userId: targetUserId } } }
      ),
      
      // Remove current user from target user's followers list
      collection.updateOne(
        { _id: new ObjectId(targetUserId) },
        { $pull: { followers: { userId: userId } } }
      )
    ]);
    
    return true;
  }

  /**
   * Save/unsave a post
   */
  static async toggleSavePost(userId: string, postId: string, save: boolean): Promise<boolean> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    try {
      if (save) {
        // Save the post
        await collection.updateOne(
          { _id: new ObjectId(userId) },
          { $addToSet: { savedPosts: postId } }
        );
      } else {
        // Unsave the post
        await collection.updateOne(
          { _id: new ObjectId(userId) },
          { $pull: { savedPosts: postId } }
        );
      }
      
      return true;
    } catch (error) {
      console.error('Error toggling saved post:', error);
      return false;
    }
  }

  /**
   * Get saved posts for a user
   */
  static async getSavedPosts(userId: string): Promise<string[]> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    const user = await collection.findOne({ _id: new ObjectId(userId) }) as User | null;
    
    return user?.savedPosts || [];
  }

  /**
   * Update user preferences
   */
  static async updatePreferences(userId: string, preferences: User['preferences']): Promise<boolean> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    try {
      const result = await collection.updateOne(
        { _id: new ObjectId(userId) },
        { 
          $set: { 
            preferences,
            updatedAt: new Date() 
          } 
        }
      );
      
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error updating preferences:', error);
      return false;
    }
  }

  /**
   * Mark email as verified
   */
  static async verifyEmail(token: string): Promise<boolean> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    // Find user with this verification token
    const user = await collection.findOne({ verificationToken: token }) as User | null;
    
    if (!user) return false;
    
    // Mark email as verified and clear token
    const result = await collection.updateOne(
      { _id: user._id },
      { 
        $set: { 
          isEmailVerified: true,
          updatedAt: new Date() 
        },
        $unset: { verificationToken: "" }
      }
    );
    
    return result.modifiedCount > 0;
  }

  /**
   * Search for users
   */
  static async searchUsers(query: string, limit = 10): Promise<SafeUser[]> {
    const collection = await getCollection(this.COLLECTION_NAME);
    
    const users = await collection
      .find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { username: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } }
        ]
      })
      .limit(limit)
      .toArray() as User[];
    
    // Remove sensitive fields
    return users.map(user => {
      const { password, verificationToken, resetPasswordToken, resetPasswordExpires, ...safeUser } = user;
      return safeUser;
    });
  }
} 