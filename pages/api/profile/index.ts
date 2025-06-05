/**
 * API endpoint for user profiles
 * 
 * GET: Get the current user's profile
 * POST: Create or update the current user's profile
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { UserProfileService } from '../../../lib/services/user-profile-service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Mock authentication - in a real app, this would come from your auth system
  const userId = req.headers['x-user-id'] as string || 'test-user';
  
  // Handle different HTTP methods
  switch (req.method) {
    case 'GET':
      return getProfile(req, res, userId);
    case 'POST':
      return saveProfile(req, res, userId);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

/**
 * Get the current user's profile
 */
async function getProfile(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const profile = await UserProfileService.getProfileByUserId(userId);
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    return res.status(200).json(profile);
  } catch (error) {
    console.error('Error getting profile:', error);
    return res.status(500).json({ error: 'Failed to get profile' });
  }
}

/**
 * Create or update the current user's profile
 */
async function saveProfile(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const profileData = req.body;
    
    // Ensure userId matches the authenticated user
    const profile = await UserProfileService.saveProfile({
      ...profileData,
      userId
    });
    
    if (!profile) {
      return res.status(500).json({ error: 'Failed to save profile' });
    }
    
    return res.status(200).json(profile);
  } catch (error) {
    console.error('Error saving profile:', error);
    return res.status(500).json({ error: 'Failed to save profile' });
  }
} 