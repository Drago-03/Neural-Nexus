#!/usr/bin/env node

/**
 * Neural Nexus Profile System Test Script
 * 
 * This script tests the entire user profile system including:
 * - Storage service initialization
 * - Profile creation and management
 * - Avatar uploads
 * - Email notifications
 * 
 * Usage:
 *   node scripts/test-profile-system.js
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

// Force development mode for testing
process.env.NODE_ENV = 'development';

// Import required modules
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Import services - use CommonJS require for compatibility
const { initStorage } = require('../lib/services/storage-service.js');
const { UserProfileService } = require('../lib/services/user-profile-service.js');
const { EmailService } = require('../lib/services/email-service.js');

// Test user data
const TEST_USER_ID = 'test-user-' + Date.now();
const TEST_EMAIL = `test-${Date.now()}@example.com`;

// Test avatar image (using a sample image in the project)
const TEST_AVATAR_PATH = path.join(__dirname, '..', 'public', 'images', 'Logo.png');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Log with color
function logColor(color, message) {
  console.log(colors[color] + message + colors.reset);
}

// Log a section header
function logSection(title) {
  console.log('\n' + colors.bright + colors.cyan + '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' + colors.reset);
  console.log(colors.bright + colors.cyan + '  ' + title + colors.reset);
  console.log(colors.bright + colors.cyan + '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' + colors.reset);
}

// Log a success message
function logSuccess(message) {
  console.log(colors.green + '✓ ' + message + colors.reset);
}

// Log an error message
function logError(message) {
  console.log(colors.red + '✗ ' + message + colors.reset);
}

// Log an info message
function logInfo(message) {
  console.log(colors.blue + 'ℹ ' + message + colors.reset);
}

// Main test function
async function runTests() {
  logSection('Neural Nexus Profile System Test');
  
  // Initialize storage
  logInfo('Initializing storage service...');
  const initialized = await initStorage();
  
  if (!initialized) {
    logError('Failed to initialize storage service');
    logInfo('Tests will use in-memory storage fallback');
  } else {
    logSuccess('Storage service initialized successfully');
  }
  
  try {
    // Test 1: Create user profile
    logSection('Test 1: Creating User Profile');
    
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
    
    logInfo(`Creating profile for user ID: ${TEST_USER_ID}`);
    const createdProfile = await UserProfileService.saveProfile(profileData);
    
    if (!createdProfile) {
      throw new Error('Failed to create user profile');
    }
    
    logSuccess('Profile created successfully:');
    console.log(`  ID: ${createdProfile.id}`);
    console.log(`  Display Name: ${createdProfile.displayName}`);
    console.log(`  Created At: ${createdProfile.createdAt}`);
    
    // Test 2: Get user profile
    logSection('Test 2: Retrieving User Profile');
    
    logInfo(`Retrieving profile for user ID: ${TEST_USER_ID}`);
    const retrievedProfile = await UserProfileService.getProfileByUserId(TEST_USER_ID);
    
    if (!retrievedProfile) {
      throw new Error('Failed to retrieve user profile');
    }
    
    logSuccess('Profile retrieved successfully:');
    console.log(`  ID: ${retrievedProfile.id}`);
    console.log(`  Display Name: ${retrievedProfile.displayName}`);
    console.log(`  Bio: ${retrievedProfile.bio}`);
    
    // Test 3: Update user profile
    logSection('Test 3: Updating User Profile');
    
    const updatedBio = 'This is an updated bio for the test user';
    const updatedTwitter = 'testuserupdated';
    
    logInfo(`Updating profile with new bio and Twitter handle`);
    const updatedProfile = await UserProfileService.saveProfile({
      userId: TEST_USER_ID,
      bio: updatedBio,
      socialLinks: {
        ...retrievedProfile.socialLinks,
        twitter: updatedTwitter
      }
    });
    
    if (!updatedProfile) {
      throw new Error('Failed to update user profile');
    }
    
    logSuccess('Profile updated successfully:');
    console.log(`  Bio: ${updatedProfile.bio}`);
    console.log(`  Twitter: ${updatedProfile.socialLinks.twitter}`);
    console.log(`  Updated At: ${updatedProfile.updatedAt}`);
    
    // Test 4: Upload avatar
    logSection('Test 4: Uploading Avatar');
    
    // Check if test image exists
    if (!fs.existsSync(TEST_AVATAR_PATH)) {
      logError(`Test avatar image not found: ${TEST_AVATAR_PATH}`);
      throw new Error('Test avatar image not found');
    }
    
    // Read the test image file
    logInfo(`Reading avatar image from: ${TEST_AVATAR_PATH}`);
    const avatarBuffer = fs.readFileSync(TEST_AVATAR_PATH);
    
    // Upload the avatar
    logInfo('Uploading avatar...');
    const avatarUrl = await UserProfileService.uploadAvatar(
      TEST_USER_ID, 
      avatarBuffer, 
      'image/png'
    );
    
    if (!avatarUrl) {
      throw new Error('Failed to upload avatar');
    }
    
    logSuccess('Avatar uploaded successfully:');
    console.log(`  Avatar URL: ${avatarUrl}`);
    
    // Test 5: Get updated profile with avatar
    logSection('Test 5: Retrieving Profile with Avatar');
    
    logInfo('Retrieving updated profile with avatar...');
    const profileWithAvatar = await UserProfileService.getProfileByUserId(TEST_USER_ID);
    
    if (!profileWithAvatar || !profileWithAvatar.avatarUrl) {
      throw new Error('Failed to retrieve profile with avatar');
    }
    
    logSuccess('Profile with avatar retrieved successfully:');
    console.log(`  Avatar URL: ${profileWithAvatar.avatarUrl}`);
    
    // Test 6: Send profile update notification
    logSection('Test 6: Testing Email Notification');
    
    logInfo(`Sending profile update notification to: ${TEST_EMAIL}`);
    const emailSent = await EmailService.sendProfileUpdateNotification(TEST_EMAIL, profileWithAvatar.displayName);
    
    if (emailSent) {
      logSuccess('Email notification sent successfully');
    } else {
      logInfo('Email notification not sent (expected in development mode)');
    }
    
    // Test 7: Delete avatar
    logSection('Test 7: Deleting Avatar');
    
    logInfo('Deleting avatar...');
    const avatarDeleted = await UserProfileService.deleteAvatar(profileWithAvatar.id);
    
    if (avatarDeleted) {
      logSuccess('Avatar deleted successfully');
    } else {
      logError('Failed to delete avatar');
    }
    
    // Verify avatar deletion
    const profileAfterAvatarDeletion = await UserProfileService.getProfileByUserId(TEST_USER_ID);
    
    if (profileAfterAvatarDeletion && !profileAfterAvatarDeletion.avatarUrl) {
      logSuccess('Avatar URL removed from profile');
    } else {
      logError('Avatar URL still exists in profile');
    }
    
    // Test 8: Delete user profile
    logSection('Test 8: Deleting User Profile');
    
    logInfo(`Deleting profile for user ID: ${TEST_USER_ID}`);
    const deleted = await UserProfileService.deleteProfile(profileWithAvatar.id);
    
    if (!deleted) {
      throw new Error('Failed to delete user profile');
    }
    
    logSuccess('Profile deleted successfully');
    
    // Test 9: Verify profile is deleted
    logSection('Test 9: Verifying Profile Deletion');
    
    logInfo('Checking if profile still exists...');
    const deletedProfile = await UserProfileService.getProfileByUserId(TEST_USER_ID);
    
    if (deletedProfile) {
      logError('Profile still exists after deletion');
      throw new Error('Profile still exists after deletion');
    } else {
      logSuccess('Profile deletion verified');
    }
    
    // All tests passed
    logSection('Test Results');
    logSuccess('All tests passed successfully! 🎉');
    
  } catch (error) {
    logSection('Test Failure');
    logError(`Test failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Run the tests
runTests(); 