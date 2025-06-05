/**
 * Neural Nexus User Profile Test Script
 * 
 * This script tests the user profile and avatar storage on Google Cloud.
 * Run with: node test-user-profile.js
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

// Force development mode for testing
process.env.NODE_ENV = 'development';

// Import required modules
const fs = require('fs');
const path = require('path');

// Import storage services
const { initStorage } = require('./lib/gcloud-storage');
const { UserProfileService } = require('./lib/services/user-profile-service');

// Test user data
const TEST_USER_ID = 'test-user-' + Date.now();
const TEST_EMAIL = 'test@example.com';

// Test avatar image (using a sample image in the project)
const TEST_AVATAR_PATH = path.join(__dirname, 'public', 'images', 'Logo.png');

// Main test function
async function runTests() {
  console.log('🧪 Starting User Profile Service tests...');
  
  // Initialize storage
  console.log('🔧 Initializing Google Cloud Storage...');
  const initialized = await initStorage();
  
  if (!initialized) {
    console.error('❌ Failed to initialize storage service');
    console.log('⚠️ Tests will use in-memory storage fallback');
  } else {
    console.log('✅ Storage service initialized successfully');
  }
  
  try {
    // Test 1: Create user profile
    console.log('\n📝 Test 1: Creating user profile...');
    const profileData = {
      userId: TEST_USER_ID,
      email: TEST_EMAIL,
      displayName: 'Test User',
      bio: 'This is a test user profile created by the test script',
      socialLinks: {
        twitter: 'testuser',
        github: 'testuser',
        linkedin: 'testuser',
        website: 'example.com'
      }
    };
    
    const createdProfile = await UserProfileService.createProfile(profileData);
    
    if (!createdProfile) {
      throw new Error('Failed to create user profile');
    }
    
    console.log('✅ Profile created successfully:');
    console.log(`- ID: ${createdProfile.id}`);
    console.log(`- Display Name: ${createdProfile.displayName}`);
    console.log(`- Created At: ${createdProfile.createdAt}`);
    
    // Test 2: Get user profile
    console.log('\n🔍 Test 2: Retrieving user profile...');
    const retrievedProfile = await UserProfileService.getProfileByUserId(TEST_USER_ID);
    
    if (!retrievedProfile) {
      throw new Error('Failed to retrieve user profile');
    }
    
    console.log('✅ Profile retrieved successfully:');
    console.log(`- ID: ${retrievedProfile.id}`);
    console.log(`- Display Name: ${retrievedProfile.displayName}`);
    
    // Test 3: Update user profile
    console.log('\n📝 Test 3: Updating user profile...');
    const updatedProfile = await UserProfileService.updateProfile(TEST_USER_ID, {
      bio: 'This is an updated bio for the test user',
      socialLinks: {
        ...retrievedProfile.socialLinks,
        twitter: 'testuserupdated'
      }
    });
    
    if (!updatedProfile) {
      throw new Error('Failed to update user profile');
    }
    
    console.log('✅ Profile updated successfully:');
    console.log(`- Bio: ${updatedProfile.bio}`);
    console.log(`- Twitter: ${updatedProfile.socialLinks.twitter}`);
    console.log(`- Updated At: ${updatedProfile.updatedAt}`);
    
    // Test 4: Upload avatar
    console.log('\n🖼️ Test 4: Uploading avatar...');
    
    // Read the test image file
    const avatarBuffer = fs.readFileSync(TEST_AVATAR_PATH);
    
    // Upload the avatar
    const avatarUrl = await UserProfileService.uploadAvatar(
      TEST_USER_ID, 
      avatarBuffer, 
      'image/png'
    );
    
    if (!avatarUrl) {
      throw new Error('Failed to upload avatar');
    }
    
    console.log('✅ Avatar uploaded successfully:');
    console.log(`- Avatar URL: ${avatarUrl}`);
    
    // Test 5: Get updated profile with avatar
    console.log('\n🔍 Test 5: Retrieving profile with avatar...');
    const profileWithAvatar = await UserProfileService.getProfileByUserId(TEST_USER_ID);
    
    if (!profileWithAvatar || !profileWithAvatar.avatarUrl) {
      throw new Error('Failed to retrieve profile with avatar');
    }
    
    console.log('✅ Profile with avatar retrieved successfully:');
    console.log(`- Avatar URL: ${profileWithAvatar.avatarUrl}`);
    
    // Test 6: Delete user profile
    console.log('\n🗑️ Test 6: Deleting user profile...');
    const deleted = await UserProfileService.deleteProfile(TEST_USER_ID);
    
    if (!deleted) {
      throw new Error('Failed to delete user profile');
    }
    
    console.log('✅ Profile deleted successfully');
    
    // Test 7: Verify profile is deleted
    console.log('\n🔍 Test 7: Verifying profile deletion...');
    const deletedProfile = await UserProfileService.getProfileByUserId(TEST_USER_ID);
    
    if (deletedProfile) {
      throw new Error('Profile still exists after deletion');
    }
    
    console.log('✅ Profile deletion verified');
    
    // All tests passed
    console.log('\n🎉 All tests passed successfully!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run the tests
runTests(); 