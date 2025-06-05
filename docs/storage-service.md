# Neural Nexus Storage Service

## Overview

The Neural Nexus Storage Service provides a flexible and robust solution for storing both structured data and files. It's designed to work seamlessly in both production and development environments with automatic fallback mechanisms.

## Key Features

- **Dual Storage Mode**: Uses Google Cloud Storage in production and local file storage in development
- **Automatic Fallback**: Falls back to local storage if cloud storage is unavailable
- **Structured Data Storage**: Store, retrieve, update, and delete JSON data
- **File Upload Support**: Upload and manage files with proper content types
- **Query Capabilities**: Query stored items based on field values
- **Type Safety**: Full TypeScript support for type-safe operations

## Architecture

The storage service is built with a layered architecture:

1. **API Layer**: Simple, consistent interface for all storage operations
2. **Provider Layer**: Handles the appropriate storage provider (GCS or local)
3. **Fallback Layer**: Automatic fallback to ensure data persistence

## Configuration

### Environment Variables

The storage service uses the following environment variables:

```
# Google Cloud Storage Configuration
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_STORAGE_BUCKET=your-bucket-name
GOOGLE_CLOUD_ACCESS_KEY=your-access-key
GOOGLE_CLOUD_SECRET_KEY=your-secret-key
GOOGLE_CLOUD_CLIENT_EMAIL=your-service-account-email
GOOGLE_APPLICATION_CREDENTIALS=path/to/credentials.json
```

### Setting Up Google Cloud Storage

1. Create a service account in the Google Cloud Console
2. Generate HMAC keys for the service account
3. Create a storage bucket
4. Set the appropriate environment variables
5. Run the setup script: `node scripts/setup-gcs-auth.js`

## Usage Examples

### Initializing Storage

```typescript
import { initStorage } from '@/lib/services/storage-service';

// Initialize storage at application startup
await initStorage();
```

### Storing Data

```typescript
import { storeItem } from '@/lib/services/storage-service';

interface User {
  id: string;
  name: string;
  email: string;
}

// Store a user
const user: User = {
  id: 'user-123',
  name: 'John Doe',
  email: 'john@example.com'
};

const savedUser = await storeItem('users', user);
```

### Retrieving Data

```typescript
import { getItem } from '@/lib/services/storage-service';

// Get a user by ID
const user = await getItem('users', 'user-123');

if (user) {
  console.log(`Found user: ${user.name}`);
} else {
  console.log('User not found');
}
```

### Querying Data

```typescript
import { queryItems } from '@/lib/services/storage-service';

// Find all users with a specific email domain
const users = await queryItems('users', { 
  emailDomain: 'example.com' 
});

console.log(`Found ${users.length} users`);
```

### Updating Data

```typescript
import { updateItem } from '@/lib/services/storage-service';

// Update a user's information
const updatedUser = await updateItem('users', 'user-123', {
  name: 'John Smith',
  lastLogin: new Date().toISOString()
});
```

### Deleting Data

```typescript
import { deleteItem } from '@/lib/services/storage-service';

// Delete a user
const success = await deleteItem('users', 'user-123');

if (success) {
  console.log('User deleted successfully');
} else {
  console.log('Failed to delete user');
}
```

### Uploading Files

```typescript
import { uploadFile } from '@/lib/services/storage-service';

// Upload a profile image
const imageBuffer = fs.readFileSync('profile.jpg');
const imagePath = `users/user-123/profile.jpg`;

const imageUrl = await uploadFile(
  imagePath,
  imageBuffer,
  'image/jpeg'
);

console.log(`Image uploaded to: ${imageUrl}`);
```

## Testing the Storage Service

You can test the storage service using the provided test scripts:

```bash
# Test the storage service
node scripts/test-storage-service.js

# Test Google Cloud Storage configuration
node scripts/test-gcs-config.js

# Test direct GCS implementation with HMAC keys
node scripts/test-direct-gcs.js
```

## Implementation Details

### Storage Item Interface

All items stored in the system must conform to the `StorageItem` interface:

```typescript
export interface StorageItem {
  id: string;
  [key: string]: any;
}
```

### Local Storage Structure

When using local storage, data is stored in the following directory structure:

```
.storage/
  ├── collections/
  │   ├── users/
  │   │   ├── user-123.json
  │   │   └── user-456.json
  │   └── posts/
  │       ├── post-123.json
  │       └── post-456.json
  └── files/
      └── users/
          └── user-123/
              └── profile.jpg
```

### Google Cloud Storage Structure

When using Google Cloud Storage, data is stored with the following path structure:

```
bucket-name/
  ├── users/
  │   ├── user-123.json
  │   └── user-456.json
  ├── posts/
  │   ├── post-123.json
  │   └── post-456.json
  └── users/user-123/profile.jpg
```

## Error Handling

The storage service includes comprehensive error handling:

- **Connection Errors**: Automatically falls back to local storage
- **Permission Errors**: Logs detailed error information
- **Not Found Errors**: Returns null for getItem and false for deleteItem
- **Invalid Data Errors**: Logs parsing errors and returns empty results

## Performance Considerations

- **Caching**: Consider implementing a caching layer for frequently accessed data
- **Batch Operations**: Use Promise.all for batch operations when possible
- **File Sizes**: Be mindful of file sizes when uploading to avoid timeouts

## Security Best Practices

- **Access Control**: Set appropriate IAM permissions on your Google Cloud Storage bucket
- **Encryption**: Enable encryption at rest for sensitive data
- **Signed URLs**: Use signed URLs for temporary access to private files
- **Content Validation**: Validate file types and sizes before uploading

## Troubleshooting

### Common Issues

1. **Missing Credentials**: Ensure GOOGLE_APPLICATION_CREDENTIALS is set correctly
2. **Bucket Permissions**: Verify the service account has appropriate permissions
3. **CORS Configuration**: Set up CORS if accessing files from the browser
4. **File Not Found**: Check path construction and bucket name
5. **Upload Failures**: Verify content type and file size limits

### Debugging

For detailed debugging, set the following environment variable:

```
DEBUG=storage:*
```

This will enable verbose logging for all storage operations.

## Migration Guide

If you're migrating from the previous storage implementation:

1. Update imports to use the new service:
   ```typescript
   // Old import
   import { storeItem } from '@/lib/gcloud-storage';
   
   // New import
   import { storeItem } from '@/lib/services/storage-service';
   ```

2. Initialize storage at application startup:
   ```typescript
   import { initStorage } from '@/lib/services/storage-service';
   
   await initStorage();
   ```

3. The API is backward compatible, so existing code should continue to work.

## Contributing

If you'd like to contribute to the storage service, please:

1. Write tests for any new functionality
2. Ensure backward compatibility
3. Document any API changes
4. Follow the project's coding style

## License

This storage service is part of the Neural Nexus project and is licensed under the same terms as the main project. 