import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { dynamic, runtime, maxDuration } from '../../config';

// Export config from app/api/config.ts
export { dynamic, runtime, maxDuration };

// Sample data as fallback
const SAMPLE_MODELS = [
  {
    id: 'model1',
    name: 'NeuroSynthGPT',
    description: 'Advanced language model with enhanced reasoning capabilities',
    image: '/images/models/neurosynthgpt.jpg',
    creator: {
      name: 'Alex Johnson',
      username: 'alexai',
      avatar: '/images/creators/alex.jpg',
      verified: true
    },
    downloads: 24500,
    stars: 4.8,
    category: 'NLP',
    tags: ['language-model', 'reasoning', 'open-source']
  },
  {
    id: 'model2',
    name: 'VisionFormer Pro',
    description: 'State-of-the-art vision transformer for image recognition',
    image: '/images/models/visionformer.jpg',
    creator: {
      name: 'Sophia Chen',
      username: 'sophiaml',
      avatar: '/images/creators/sophia.jpg',
      verified: true
    },
    downloads: 18700,
    stars: 4.7,
    category: 'Computer Vision',
    tags: ['vision', 'transformer', 'image-recognition']
  },
  {
    id: 'model3',
    name: 'AudioGen XL',
    description: 'High-fidelity audio generation model with multi-instrument support',
    image: '/images/models/audiogen.jpg',
    creator: {
      name: 'Marcus Lee',
      username: 'marcusai',
      avatar: '/images/creators/marcus.jpg',
      verified: false
    },
    downloads: 12300,
    stars: 4.6,
    category: 'Audio',
    tags: ['audio-generation', 'music', 'text-to-audio']
  },
  {
    id: 'model4',
    name: 'BioMedBERT',
    description: 'Specialized BERT model for biomedical text analysis and research',
    image: '/images/models/biomedbert.jpg',
    creator: {
      name: 'Priya Sharma',
      username: 'priyaml',
      avatar: '/images/creators/priya.jpg',
      verified: true
    },
    downloads: 9200,
    stars: 4.9,
    category: 'NLP',
    tags: ['biomedical', 'bert', 'research']
  }
];

/**
 * GET /api/community/trending-models
 * 
 * Fetches trending AI models from the database
 * Falls back to sample data if database is not available
 */
export async function GET() {
  try {
    // Check if we're in a build environment
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      console.log('Using sample models data during build');
      return NextResponse.json(SAMPLE_MODELS);
    }
    
    // Connect to MongoDB
    const modelsCollection = await getCollection('models');
    const usersCollection = await getCollection('users');
    
    // Get trending models based on downloads, ratings, and recency
    const models = await modelsCollection.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'creator_id',
          foreignField: '_id',
          as: 'creator'
        }
      },
      {
        $unwind: '$creator'
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          downloads: 1,
          stars: { $ifNull: ['$rating', 4.5] },
          category: 1,
          tags: 1,
          creator: {
            name: '$creator.name',
            username: '$creator.username',
            avatar: '$creator.avatar',
            verified: { $ifNull: ['$creator.verified', false] }
          }
        }
      },
      {
        $sort: { downloads: -1, stars: -1 }
      },
      {
        $limit: 8
      }
    ]).toArray();
    
    if (models.length === 0) {
      // Return an empty array instead of sample data
      console.log('No models found in database');
      return NextResponse.json([]);
    }
    
    return NextResponse.json(models);
  } catch (error) {
    console.error('Error fetching trending models:', error);
    
    // Only return sample data during build, otherwise throw error
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json(SAMPLE_MODELS);
    }
    
    return NextResponse.json({ error: 'Failed to fetch models from database' }, { status: 500 });
  }
}

function formatDownloadCount(count: number): string {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count.toString();
} 