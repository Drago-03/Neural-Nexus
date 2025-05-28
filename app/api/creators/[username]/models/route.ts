import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const username = params.username;
    console.log(`🔍 Fetching models for creator: ${username}`);
    
    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }
    
    // First get the creator to get their ID
    const usersCollection = await getCollection('users');
    
    // Build query to check for username or id
    const query: any = {
      $or: [
        { username: username }
      ]
    };
    
    // Add ID check only if it's a valid ObjectId
    if (ObjectId.isValid(username)) {
      query.$or.push({ _id: new ObjectId(username) });
    }
    
    const creator = await usersCollection.findOne(query);
    
    if (!creator) {
      console.log(`❌ Creator not found: ${username}`);
      
      // Only use sample data during build phase
      if (process.env.NEXT_PHASE === 'phase-production-build') {
        console.log('🚧 Using sample model data for build phase');
        return NextResponse.json(getSampleModels());
      }
      
      return NextResponse.json(
        { error: 'Creator not found' },
        { status: 404 }
      );
    }
    
    // Now get models by this creator
    const modelsCollection = await getCollection('models');
    
    const creatorId = creator._id;
    const pipeline = [
      { 
        $match: { 
          creatorId: new ObjectId(creatorId) 
        } 
      },
      {
        $project: {
          id: { $toString: '$_id' },
          name: 1,
          description: 1,
          image: 1,
          downloads: 1,
          rating: 1,
          license: 1,
          tags: 1,
          createdAt: 1,
          _id: 0
        }
      },
      { 
        $sort: { 
          downloads: -1,
          rating: -1 
        } 
      }
    ];
    
    const models = await modelsCollection.aggregate(pipeline).toArray();
    
    console.log(`✅ Found ${models.length} models for creator: ${creator.name || username}`);
    
    if (models.length === 0 && process.env.NEXT_PHASE === 'phase-production-build') {
      console.log('🚧 Using sample model data for build phase');
      return NextResponse.json(getSampleModels());
    }
    
    return NextResponse.json(models);
  } catch (error) {
    console.error('Error fetching creator models:', error);
    
    // Only use sample data during build phase
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      console.log('🚧 Using sample model data for build phase due to error');
      return NextResponse.json(getSampleModels());
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch creator models' },
      { status: 500 }
    );
  }
}

// Sample models data for build phase only
function getSampleModels() {
  return [
    {
      id: '1',
      name: 'NeuralFlow X1',
      description: 'A cutting-edge generative model for creating realistic images from text descriptions.',
      image: '/images/models/neuralflow.jpg',
      downloads: 35600,
      rating: 4.8,
      license: 'open-source',
      tags: ['image-generation', 'text-to-image', 'generative'],
      createdAt: '2023-04-15T12:00:00Z'
    },
    {
      id: '2',
      name: 'TextCraft Pro',
      description: 'Advanced language model fine-tuned for creative writing and content generation.',
      image: '/images/models/textcraft.jpg',
      downloads: 28400,
      rating: 4.6,
      license: 'proprietary',
      tags: ['language', 'text-generation', 'nlp'],
      createdAt: '2023-06-22T12:00:00Z'
    },
    {
      id: '3',
      name: 'AudioGen ML',
      description: 'Generate realistic audio from text prompts. Perfect for creating voiceovers and sound effects.',
      image: '/images/models/audiogen.jpg',
      downloads: 19200,
      rating: 4.7,
      license: 'open-source',
      tags: ['audio', 'text-to-audio', 'generative'],
      createdAt: '2023-08-10T12:00:00Z'
    },
    {
      id: '4',
      name: 'VisionTransformer Mini',
      description: 'Lightweight computer vision model for edge devices. Optimized for speed and efficiency.',
      image: '/images/models/visiontransformer.jpg',
      downloads: 15800,
      rating: 4.5,
      license: 'open-source',
      tags: ['computer-vision', 'edge-computing', 'transformer'],
      createdAt: '2023-09-05T12:00:00Z'
    }
  ];
} 