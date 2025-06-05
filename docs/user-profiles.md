# Neural Nexus User Profiles

## Overview

The Neural Nexus User Profile system provides a complete solution for managing user profiles and avatars. It uses a flexible storage service that works with both Google Cloud Storage (in production) and local file storage (in development).

## Features

- **Profile Management**: Create, view, update, and delete user profiles
- **Avatar Uploads**: Upload, update, and delete profile avatars
- **Social Links**: Store and display links to social media profiles
- **Responsive UI**: Mobile-friendly profile pages
- **Email Notifications**: Send emails when profiles are updated

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

2. **My Profile Page** (`pages/profile.tsx`)
   - Displays the current user's profile with editing capabilities

3. **Public Profile Page** (`pages/profile/[userId].tsx`)
   - Displays another user's profile (view-only)

## Usage

### Viewing Your Profile

Navigate to `/profile` to view and edit your profile.

### Viewing Another User's Profile

Navigate to `/profile/[userId]` to view another user's profile (replace `[userId]` with the actual user ID).

### API Usage

#### Get a Profile

```javascript
const response = await fetch('/api/profile', {
  headers: {
    'X-User-ID': userId // Optional, defaults to 'test-user' in development
  }
});
const profile = await response.json();
```

#### Update a Profile

```javascript
const response = await fetch('/api/profile', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-User-ID': userId // Optional, defaults to 'test-user' in development
  },
  body: JSON.stringify({
    displayName: 'John Doe',
    bio: 'Software developer and AI enthusiast',
    socialLinks: {
      twitter: 'johndoe',
      github: 'johndoe',
      linkedin: 'johndoe',
      website: 'https://johndoe.com'
    }
  })
});
const updatedProfile = await response.json();
```

#### Upload an Avatar

```javascript
const formData = new FormData();
formData.append('avatar', fileInput.files[0]);

const response = await fetch('/api/profile/avatar', {
  method: 'POST',
  headers: {
    'X-User-ID': userId // Optional, defaults to 'test-user' in development
  },
  body: formData
});
const result = await response.json();
const avatarUrl = result.avatarUrl;
```

#### Delete an Avatar

```javascript
const response = await fetch('/api/profile/avatar', {
  method: 'DELETE',
  headers: {
    'X-User-ID': userId // Optional, defaults to 'test-user' in development
  }
});
const result = await response.json();
```

## Configuration

The user profile system uses the following environment variables:

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

## Testing

You can test the user profile system using the provided test scripts:

```bash
# Test the storage service
node scripts/test-storage-service.js

# Test the user profile service
node scripts/test-user-profile.js
```

## Implementation Details

The user profile system is implemented in TypeScript and uses the following technologies:

- **Next.js**: For the API routes and frontend pages
- **React**: For the frontend components
- **Google Cloud Storage**: For production data storage
- **SendGrid**: For email notifications
- **Formidable**: For handling file uploads

The system is designed to be flexible and scalable, with a clear separation of concerns between the different components. 