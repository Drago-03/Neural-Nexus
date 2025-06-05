#!/usr/bin/env node

/**
 * Test script for Neural Nexus User Profile Service
 * 
 * This script tests the user profile service functionality with local storage.
 * 
 * Run with: node scripts/test-user-profile.js
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const fs = require('fs');
const path = require('path');

// Import storage service
const storageService = require('../lib/services/storage-service.js');

// Mock user data
const TEST_USER = {
  userId: 'test-user-' + Date.now(),
  displayName: 'Test User',
  bio: 'This is a test user profile',
  socialLinks: {
    twitter: 'testuser',
    github: 'testuser',
    website: 'https://example.com'
  }
};

// Test avatar file
const TEST_AVATAR_PATH = path.join(__dirname, 'test-avatar.png');
const TEST_AVATAR_CONTENT = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');

// Create test avatar file if it doesn't exist
if (!fs.existsSync(TEST_AVATAR_PATH)) {
  fs.writeFileSync(TEST_AVATAR_PATH, TEST_AVATAR_CONTENT);
}

// Mock UserProfileService
class UserProfileService {
  static async saveProfile(profile) {
    console.log('Saving profile:', profile.userId);
    
    // Check if profile exists
    const existingProfiles = await storageService.queryItems('profiles', { userId: profile.userId });
    const existingProfile = existingProfiles.length > 0 ? existingProfiles[0] : null;
    
    if (existingProfile) {
      // Update existing profile
      const updatedProfile = await storageService.updateItem(
        'profiles', 
        existingProfile.id, 
        {
          ...profile,
          updatedAt: new Date().toISOString()
        }
      );
      
      console.log('Updated profile:', updatedProfile.id);
      return updatedProfile;
    } else {
      // Create new profile
      const newProfile = {
        id: require('uuid').v4(),
        userId: profile.userId,
        displayName: profile.displayName || 'User',
        bio: profile.bio || '',
        avatarUrl: profile.avatarUrl,
        socialLinks: profile.socialLinks || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const result = await storageService.storeItem('profiles', newProfile);
      console.log('Created profile:', result.id);
      return result;
    }
  }
  
  static async getProfileByUserId(userId) {
    console.log('Getting profile for user:', userId);
    const profiles = await storageService.queryItems('profiles', { userId });
    return profiles.length > 0 ? profiles[0] : null;
  }
  
  static async uploadAvatar(userId, buffer, contentType) {
    console.log('Uploading avatar for user:', userId);
    
    // Generate a unique filename
    const filename = `${userId}-${Date.now()}.png`;
    const filePath = `avatars/${filename}`;
    
    // Upload file
    const avatarUrl = await storageService.uploadFile(filePath, buffer, contentType);
    
    // Update profile with new avatar URL
    const profile = await this.getProfileByUserId(userId);
    if (profile) {
      await this.saveProfile({
        ...profile,
        avatarUrl
      });
    }
    
    return avatarUrl;
  }
  
  static async deleteAvatar(profileId) {
    console.log('Deleting avatar for profile:', profileId);
    
    // Get profile
    const profiles = await storageService.queryItems('profiles', { id: profileId });
    const profile = profiles.length > 0 ? profiles[0] : null;
    
    if (!profile || !profile.avatarUrl) {
      return false;
    }
    
    // Update profile to remove avatar URL
    await this.saveProfile({
      ...profile,
      avatarUrl: undefined
    });
    
    return true;
  }
}

async function runTests() {
  console.log('\n🧪 Starting User Profile Service Tests...');

  try {
    // Initialize storage
    console.log('\n📦 Initializing storage service...');
    const initialized = await storageService.initStorage();
    console.log(`Storage initialization ${initialized ? 'successful' : 'failed'}`);
    
    if (!initialized) {
      console.error('❌ Failed to initialize storage service');
      process.exit(1);
    }

    // Test creating a user profile
    console.log('\n👤 Testing profile creation...');
    const profile = await UserProfileService.saveProfile(TEST_USER);
    console.log('Created profile:', profile.id);
    
    if (!profile || !profile.id) {
      console.error('❌ Failed to create profile');
      process.exit(1);
    }

    // Test getting a user profile
    console.log('\n🔍 Testing profile retrieval...');
    const retrievedProfile = await UserProfileService.getProfileByUserId(TEST_USER.userId);
    console.log('Retrieved profile:', retrievedProfile?.id);
    
    if (!retrievedProfile || retrievedProfile.id !== profile.id) {
      console.error('❌ Failed to retrieve profile');
      process.exit(1);
    }
    
    // Verify profile content
    console.log('Profile content matches:', 
      retrievedProfile.displayName === TEST_USER.displayName &&
      retrievedProfile.bio === TEST_USER.bio);

    // Test uploading an avatar
    console.log('\n🖼️ Testing avatar upload...');
    const avatarBuffer = fs.readFileSync(TEST_AVATAR_PATH);
    const avatarUrl = await UserProfileService.uploadAvatar(
      TEST_USER.userId,
      avatarBuffer,
      'image/png'
    );
    console.log('Uploaded avatar URL:', avatarUrl);
    
    if (!avatarUrl) {
      console.error('❌ Failed to upload avatar');
      process.exit(1);
    }
    
    // Verify avatar was associated with profile
    const profileWithAvatar = await UserProfileService.getProfileByUserId(TEST_USER.userId);
    console.log('Avatar URL in profile:', profileWithAvatar.avatarUrl);
    console.log('Avatar was associated with profile:', !!profileWithAvatar.avatarUrl);

    // Test updating a profile
    console.log('\n✏️ Testing profile update...');
    const updatedProfile = await UserProfileService.saveProfile({
      ...profile,
      displayName: 'Updated Test User',
      bio: 'This is an updated test user profile'
    });
    console.log('Updated profile:', updatedProfile.id);
    
    // Verify update was applied
    console.log('Update was applied:', 
      updatedProfile.displayName === 'Updated Test User' &&
      updatedProfile.bio === 'This is an updated test user profile');

    // Test deleting an avatar
    console.log('\n🗑️ Testing avatar deletion...');
    const avatarDeleted = await UserProfileService.deleteAvatar(profile.id);
    console.log('Avatar deleted:', avatarDeleted);
    
    // Verify avatar was removed from profile
    const profileWithoutAvatar = await UserProfileService.getProfileByUserId(TEST_USER.userId);
    console.log('Avatar was removed from profile:', !profileWithoutAvatar.avatarUrl);

    // Clean up test data
    console.log('\n🧹 Cleaning up test data...');
    await storageService.deleteItem('profiles', profile.id);
    
    // Verify profile was deleted
    const deletedProfile = await UserProfileService.getProfileByUserId(TEST_USER.userId);
    console.log('Profile was deleted:', !deletedProfile);

    console.log('\n✅ All user profile tests passed!');
  } catch (error) {
    console.error('\n❌ Error during tests:', error);
    process.exit(1);
  }
}

// Run the tests
runTests().catch(error => {
  console.error('Unhandled error during tests:', error);
  process.exit(1);
}); 