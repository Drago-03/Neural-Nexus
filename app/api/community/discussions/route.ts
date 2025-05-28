import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

// Define explicit runtime configuration
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60; // seconds

// Sample data as fallback
const SAMPLE_DISCUSSIONS = [
  {
    id: 'discussion1',
    title: 'Best practices for fine-tuning language models',
    content: 'I\'ve been experimenting with different approaches to fine-tuning LLMs and wanted to share some findings...',
    author: {
      name: 'Alex Johnson',
      username: 'alexai',
      avatar: '/images/creators/alex.jpg',
      verified: true
    },
    createdAt: '2023-11-10T14:23:00Z',
    replies: 28,
    likes: 42,
    tags: ['fine-tuning', 'llm', 'best-practices']
  },
  {
    id: 'discussion2',
    title: 'How to optimize inference speed for vision transformers?',
    content: 'My vision transformer model is running quite slow in production. Has anyone found effective ways to optimize inference?',
    author: {
      name: 'Sophia Chen',
      username: 'sophiaml',
      avatar: '/images/creators/sophia.jpg',
      verified: true
    },
    createdAt: '2023-11-12T09:15:00Z',
    replies: 19,
    likes: 31,
    tags: ['optimization', 'vision-transformer', 'inference']
  },
  {
    id: 'discussion3',
    title: 'Announcing AudioGen XL - new audio generation model',
    content: 'Excited to share my latest model for high-quality audio generation with the community!',
    author: {
      name: 'Marcus Lee',
      username: 'marcusai',
      avatar: '/images/creators/marcus.jpg',
      verified: false
    },
    createdAt: '2023-11-13T16:45:00Z',
    replies: 34,
    likes: 76,
    tags: ['audio-generation', 'new-model', 'announcement']
  },
  {
    id: 'discussion4',
    title: 'Ethics in biomedical AI: Guidelines and considerations',
    content: 'As AI becomes more prevalent in healthcare, we need to discuss ethical guidelines...',
    author: {
      name: 'Priya Sharma',
      username: 'priyaml',
      avatar: '/images/creators/priya.jpg',
      verified: true
    },
    createdAt: '2023-11-14T11:30:00Z',
    replies: 42,
    likes: 58,
    tags: ['ethics', 'biomedical', 'healthcare']
  }
];

/**
 * GET /api/community/discussions
 * 
 * Fetches hot discussions from the database
 * Falls back to sample data if database is not available
 */
export async function GET() {
  try {
    // Check if we're in a build environment
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      console.log('Using sample discussions data during build');
      return NextResponse.json(SAMPLE_DISCUSSIONS);
    }
    
    // Connect to MongoDB
    const discussionsCollection = await getCollection('discussions');
    const usersCollection = await getCollection('users');
    
    // Get hot discussions based on recent activity and engagement
    const discussions = await discussionsCollection.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'author_id',
          foreignField: '_id',
          as: 'author'
        }
      },
      {
        $unwind: '$author'
      },
      {
        $project: {
          _id: 1,
          title: 1,
          content: 1,
          createdAt: 1,
          replies: { $size: '$replies' },
          likes: { $size: '$likes' },
          tags: 1,
          author: {
            name: '$author.name',
            username: '$author.username',
            avatar: '$author.avatar',
            verified: { $ifNull: ['$author.verified', false] }
          }
        }
      },
      {
        $addFields: {
          engagementScore: {
            $add: [
              { $multiply: ['$replies', 2] },
              '$likes',
              {
                $divide: [
                  1000000000,
                  { $add: [1, { $subtract: [new Date(), '$createdAt'] }] }
                ]
              }
            ]
          }
        }
      },
      {
        $sort: { engagementScore: -1 }
      },
      {
        $limit: 8
      }
    ]).toArray();
    
    if (discussions.length === 0) {
      console.log('No discussions found, using sample data');
      return NextResponse.json(SAMPLE_DISCUSSIONS);
    }
    
    return NextResponse.json(discussions);
  } catch (error) {
    console.error('Error fetching discussions:', error);
    
    // Return sample data on error
    return NextResponse.json(SAMPLE_DISCUSSIONS);
  }
} 