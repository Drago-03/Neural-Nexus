/**
 * API endpoint for user avatar uploads
 * 
 * POST: Upload a new avatar
 * DELETE: Remove the current avatar
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { UserProfileService } from '../../../lib/services/user-profile-service';
import formidable from 'formidable';
import { Fields, Files, File } from 'formidable';
import fs from 'fs';

// Disable Next.js body parsing for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Mock authentication - in a real app, this would come from your auth system
  const userId = req.headers['x-user-id'] as string || 'test-user';
  
  // Handle different HTTP methods
  switch (req.method) {
    case 'POST':
      return uploadAvatar(req, res, userId);
    case 'DELETE':
      return deleteAvatar(req, res, userId);
    default:
      res.setHeader('Allow', ['POST', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

/**
 * Upload a new avatar
 */
async function uploadAvatar(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    // Parse the multipart form data
    const form = new formidable.IncomingForm({
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB limit
    });
    
    return new Promise((resolve, reject) => {
      form.parse(req, async (err: Error | null, fields: Fields, files: Files) => {
        if (err) {
          console.error('Error parsing form:', err);
          return res.status(500).json({ error: 'Failed to parse upload' });
        }
        
        try {
          // Get the uploaded file
          const fileArray = files.avatar;
          
          if (!fileArray || fileArray.length === 0) {
            return res.status(400).json({ error: 'No avatar file provided' });
          }
          
          // Use the first file
          const file = Array.isArray(fileArray) ? fileArray[0] : fileArray;
          
          // Check file type
          const contentType = file.mimetype || 'image/jpeg';
          if (!contentType.startsWith('image/')) {
            return res.status(400).json({ error: 'File must be an image' });
          }
          
          // Read file content
          const fileContent = fs.readFileSync(file.filepath);
          
          // Upload avatar
          const avatarUrl = await UserProfileService.uploadAvatar(
            userId,
            fileContent,
            contentType
          );
          
          if (!avatarUrl) {
            return res.status(500).json({ error: 'Failed to upload avatar' });
          }
          
          // Clean up temp file
          fs.unlinkSync(file.filepath);
          
          return res.status(200).json({ avatarUrl });
        } catch (error) {
          console.error('Error uploading avatar:', error);
          return res.status(500).json({ error: 'Failed to upload avatar' });
        }
      });
    });
  } catch (error) {
    console.error('Error handling avatar upload:', error);
    return res.status(500).json({ error: 'Failed to upload avatar' });
  }
}

/**
 * Delete the current avatar
 */
async function deleteAvatar(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    // Get the user's profile
    const profile = await UserProfileService.getProfileByUserId(userId);
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    // Delete avatar
    const success = await UserProfileService.deleteAvatar(profile.id);
    
    if (!success) {
      return res.status(500).json({ error: 'Failed to delete avatar' });
    }
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting avatar:', error);
    return res.status(500).json({ error: 'Failed to delete avatar' });
  }
} 