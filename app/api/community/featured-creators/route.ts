import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

// Define explicit runtime configuration
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60; // seconds

// Sample data as fallback
const SAMPLE_CREATORS = [
  {
    id: 'creator1',
    name: 'Alex Johnson',
    username: 'alexai',
    avatar: '/images/creators/alex.jpg',
    role: 'AI Researcher',
    followers: 12400,
    models: 8,
    verified: true,
    bio: 'Developing next-gen language models | PhD in ML | Open source advocate'
  },
  {
    id: 'creator2',
    name: 'Sophia Chen',
    username: 'sophiaml',
    avatar: '/images/creators/sophia.jpg',
    role: 'ML Engineer',
    followers: 8700,
    models: 5,
    verified: true,
    bio: 'Building vision models that understand the world | Previously @OpenAI'
  },
  {
    id: 'creator3',
    name: 'Marcus Lee',
    username: 'marcusai',
    avatar: '/images/creators/marcus.jpg',
    role: 'NLP Specialist',
    followers: 6300,
    models: 12,
    verified: false,
    bio: 'Creating accessible NLP models for everyone | Contributor to HuggingFace'
  },
  {
    id: 'creator4',
    name: 'Priya Sharma',
    username: 'priyaml',
    avatar: '/images/creators/priya.jpg',
    role: 'Computer Vision Expert',
    followers: 9200,
    models: 7,
    verified: true,
    bio: 'Pushing boundaries in computer vision | PhD from Stanford | 3x Kaggle winner'
  }
];

/**
 * GET /api/community/featured-creators
 * 
 * Fetches featured creators from the database
 * Falls back to sample data if database is not available
 */
export async function GET() {
  try {
    // Check if we're in a build environment
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      console.log('Using sample creators data during build');
      return NextResponse.json(SAMPLE_CREATORS);
    }
    
    // Connect to MongoDB
    const usersCollection = await getCollection('users');
    const modelsCollection = await getCollection('models');
    
    // Get featured creators based on model count, followers, and activity
    const creators = await usersCollection.aggregate([
      {
        $lookup: {
          from: 'models',
          localField: '_id',
          foreignField: 'creator_id',
          as: 'models'
        }
      },
      {
        $match: {
          'models.0': { $exists: true }, // Has at least one model
          'role': { $exists: true }      // Has a role defined
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          username: 1,
          avatar: 1,
          role: 1,
          bio: 1,
          verified: 1,
          followers: { $size: '$followers' },
          models: { $size: '$models' }
        }
      },
      { $sort: { followers: -1, models: -1 } },
      { $limit: 8 }
    ]).toArray();
    
    if (creators.length === 0) {
      // Return an empty array instead of sample data
      console.log('No creators found in database');
      return NextResponse.json([]);
    }
    
    return NextResponse.json(creators);
  } catch (error) {
    console.error('Error fetching featured creators:', error);
    
    // Only return sample data during build, otherwise throw error
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json(SAMPLE_CREATORS);
    }
    
    return NextResponse.json({ error: 'Failed to fetch creators from database' }, { status: 500 });
  }
}

function formatFollowerCount(count: number): string {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count.toString();
} 