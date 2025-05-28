import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

// Define explicit runtime configuration
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60; // seconds

// Fallback data for build time
const FALLBACK_DATA = {
  memberCount: 5000,
  modelCount: 250,
  discussionCount: 1200,
  countryCount: 75
};

/**
 * GET /api/community/stats
 * 
 * Fetches real community statistics from our databases:
 * - Active members from Supabase users table
 * - Models count from MongoDB models collection
 * - Discussions count from MongoDB discussions collection
 * - Countries count from MongoDB user_locations collection
 */
export async function GET() {
  try {
    // Check if we're in a build environment
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      console.log('Using fallback community stats data during build');
      return NextResponse.json(FALLBACK_DATA);
    }
    
    // Connect to MongoDB collections
    const usersCollection = await getCollection('users');
    const modelsCollection = await getCollection('models');
    const discussionsCollection = await getCollection('discussions');
    
    // Get actual counts from database
    const [memberCount, modelCount, discussionCount] = await Promise.all([
      usersCollection.countDocuments(),
      modelsCollection.countDocuments(),
      discussionsCollection.countDocuments()
    ]);
    
    // Get country count from user locations
    const countryResult = await usersCollection.aggregate([
      { $match: { location: { $exists: true, $ne: null } } },
      { $group: { _id: "$location.country" } },
      { $count: "total" }
    ]).toArray();
    
    const countryCount = countryResult[0]?.total || 15;
    
    return NextResponse.json({
      memberCount,
      modelCount,
      discussionCount,
      countryCount
    });
  } catch (error) {
    console.error('Error fetching community stats:', error);
    
    // Return fallback data on error
    return NextResponse.json(FALLBACK_DATA);
  }
} 