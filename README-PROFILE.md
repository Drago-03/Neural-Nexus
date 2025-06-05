# Neural Nexus User Profile System

## Overview

The Neural Nexus User Profile System provides a complete solution for managing user profiles and avatars. It features a flexible storage service that automatically switches between Google Cloud Storage (in production) and local file storage (in development).

## Features

- **Profile Management**: Create, view, update, and delete user profiles
- **Avatar Uploads**: Upload, update, and delete profile avatars
- **Social Links**: Store and display links to social media profiles
- **Responsive UI**: Mobile-friendly profile pages
- **Email Notifications**: Send emails when profiles are updated
- **Storage Flexibility**: Works with both Google Cloud Storage and local storage

## Quick Start

### 1. Set up environment variables

Add the following to your `.env.local` file:

```
# Google Cloud Storage Configuration
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_STORAGE_BUCKET=your-bucket-name
GOOGLE_CLOUD_ACCESS_KEY=your-access-key
GOOGLE_CLOUD_SECRET_KEY=your-secret-key
GOOGLE_CLOUD_CLIENT_EMAIL=your-service-account-email
GOOGLE_APPLICATION_CREDENTIALS=path/to/credentials.json

# Email Configuration
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@your-domain.com
```

### 2. Set up Google Cloud Storage (Optional)

Run the setup script to create a service account key file:

```bash
node scripts/setup-gcs-auth.js
```

### 3. Test the system

Run the test script to verify that everything is working:

```bash
node scripts/test-profile-system.js
```

## Components

### Backend Services

1. **Storage Service** (`lib/services/storage-service.ts`)
   - Provides a consistent API for data storage
   - Automatically switches between Google Cloud Storage and local file storage
   - Handles structured data (JSON) and file uploads

2. **User Profile Service** (`lib/services/user-profile-service.ts`)
   - Manages user profile data
   - Handles avatar uploads and management
   - Integrates with the Email Service for notifications

3. **Email Service** (`lib/services/email-service.ts`)
   - Sends email notifications using SendGrid
   - Provides templates for different types of emails

### API Endpoints

1. **Profile API** (`pages/api/profile/index.ts`)
   - `GET /api/profile`: Get the current user's profile
   - `POST /api/profile`: Create or update the current user's profile

2. **Avatar API** (`pages/api/profile/avatar.ts`)
   - `POST /api/profile/avatar`: Upload a new avatar
   - `DELETE /api/profile/avatar`: Delete the current avatar

### Frontend Components

1. **Profile Page Component** (`components/ProfilePage.tsx`)
   - Displays a user profile with avatar and information
   - Provides editing capabilities when enabled
   - Handles avatar uploads and profile updates

2. **Profile Avatar Upload** (`components/ProfileAvatarUpload.tsx`)
   - Standalone component for avatar uploads
   - Handles file selection, validation, and upload
   - Provides visual feedback during upload

3. **My Profile Page** (`pages/profile.tsx`)
   - Displays the current user's profile with editing capabilities

4. **Public Profile Page** (`pages/profile/[userId].tsx`)
   - Displays another user's profile (view-only)

## Usage Examples

### Frontend: Displaying a User Profile

```tsx
import ProfilePage from '@/components/ProfilePage';

// In your component
<ProfilePage 
  userId="user-123"
  editable={false}
/>
```

### Frontend: Uploading an Avatar

```tsx
import ProfileAvatarUpload from '@/components/ProfileAvatarUpload';

// In your component
<ProfileAvatarUpload 
  currentAvatarUrl={profile.avatarUrl}
  onAvatarChange={(url) => setAvatarUrl(url)}
/>
```

### Backend: Getting a User Profile

```typescript
import { UserProfileService } from '@/lib/services/user-profile-service';

// Get a user's profile
const profile = await UserProfileService.getProfileByUserId('user-123');

if (profile) {
  console.log(`Found profile for ${profile.displayName}`);
} else {
  console.log('Profile not found');
}
```

### Backend: Creating or Updating a Profile

```typescript
import { UserProfileService } from '@/lib/services/user-profile-service';

// Create or update a profile
const profile = await UserProfileService.saveProfile({
  userId: 'user-123',
  displayName: 'John Doe',
  bio: 'Software developer and AI enthusiast',
  socialLinks: {
    twitter: 'johndoe',
    github: 'johndoe',
    linkedin: 'johndoe',
    website: 'https://johndoe.com'
  }
});
```

### Backend: Uploading an Avatar

```typescript
import { UserProfileService } from '@/lib/services/user-profile-service';
import fs from 'fs';

// Upload an avatar
const imageBuffer = fs.readFileSync('avatar.jpg');
const avatarUrl = await UserProfileService.uploadAvatar(
  'user-123',
  imageBuffer,
  'image/jpeg'
);

console.log(`Avatar uploaded to: ${avatarUrl}`);
```

## API Reference

### UserProfileService

#### `saveProfile(profile: Partial<UserProfile> & { userId: string }): Promise<UserProfile | null>`

Creates a new profile or updates an existing one.

#### `getProfileByUserId(userId: string): Promise<UserProfile | null>`

Gets a user profile by user ID.

#### `getProfile(profileId: string): Promise<UserProfile | null>`

Gets a user profile by profile ID.

#### `deleteProfile(profileId: string): Promise<boolean>`

Deletes a user profile.

#### `uploadAvatar(userId: string, buffer: Buffer, contentType: string): Promise<string | null>`

Uploads a user avatar and returns the URL.

#### `deleteAvatar(profileId: string): Promise<boolean>`

Deletes a user's avatar.

### Storage Service

#### `initStorage(): Promise<boolean>`

Initializes the storage service.

#### `storeItem<T extends StorageItem>(collection: string, item: T): Promise<T>`

Stores an item in the specified collection.

#### `getItem<T extends StorageItem>(collection: string, id: string): Promise<T | null>`

Gets an item from the specified collection.

#### `queryItems<T extends StorageItem>(collection: string, query: Record<string, any>): Promise<T[]>`

Queries items from the specified collection.

#### `updateItem<T extends StorageItem>(collection: string, id: string, updates: Partial<T>): Promise<T | null>`

Updates an item in the specified collection.

#### `deleteItem(collection: string, id: string): Promise<boolean>`

Deletes an item from the specified collection.

#### `uploadFile(filePath: string, content: Buffer | string, contentType: string): Promise<string>`

Uploads a file and returns the URL.

## User Profile Data Structure

```typescript
interface UserProfile {
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
```

## Troubleshooting

### Common Issues

1. **Missing Avatar**: If avatars don't appear, check that your storage service is properly configured and accessible.

2. **Upload Errors**: If avatar uploads fail, check file size limits and ensure the storage service has write permissions.

3. **Profile Not Found**: If profiles can't be retrieved, check that the user ID is correct and that the profile exists.

4. **Email Notifications**: If email notifications aren't being sent, verify your SendGrid API key and sender email.

### Debugging

For detailed debugging, check the console logs. The storage service and user profile service both log detailed information about their operations.

## Testing

You can test the user profile system using the provided test scripts:

```bash
# Test the storage service
node scripts/test-storage-service.js

# Test the user profile service
node scripts/test-user-profile.js

# Test the entire profile system
node scripts/test-profile-system.js
```

## Documentation

For more detailed documentation, see:

- [User Profiles Documentation](docs/user-profiles.md)
- [Storage Service Documentation](docs/storage-service.md)
- [Email Service Documentation](docs/email-service.md)

## License

This user profile system is part of the Neural Nexus project and is licensed under the same terms as the main project. 