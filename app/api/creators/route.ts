import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const sortBy = searchParams.get('sortBy') || 'followers';
    const sortDirection = searchParams.get('sortDirection') || 'desc';
    const openSourceOnly = searchParams.get('openSourceOnly') === 'true';
    const verifiedOnly = searchParams.get('verifiedOnly') === 'true';
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    console.log(`🔍 Fetching creators with params:`, { 
      sortBy, sortDirection, openSourceOnly, verifiedOnly, search, page, limit 
    });
    
    // Build the aggregation pipeline
    const pipeline = [];
    
    // Match stage - filter creators
    const matchStage: any = {
      // Only include users who have created at least one model
      modelCount: { $gt: 0 }
    };
    
    if (openSourceOnly) {
      matchStage.openSourceModelCount = { $gt: 0 };
    }
    
    if (verifiedOnly) {
      matchStage.verified = true;
    }
    
    if (search) {
      // Search by name or username
      matchStage.$or = [
        { name: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ];
    }
    
    pipeline.push({ $match: matchStage });
    
    // Add lookup stage to get model information
    pipeline.push({
      $lookup: {
        from: 'models',
        localField: '_id',
        foreignField: 'creatorId',
        as: 'models'
      }
    });
    
    // Add fields for calculations
    pipeline.push({
      $addFields: {
        models: { $size: '$models' },
        openSourceModels: {
          $size: {
            $filter: {
              input: '$models',
              as: 'model',
              cond: { $eq: ['$$model.license', 'open-source'] }
            }
          }
        },
        totalDownloads: { $sum: '$models.downloads' },
        averageRating: { 
          $cond: [
            { $gt: [{ $size: '$models' }, 0] },
            { $avg: '$models.rating' },
            0
          ]
        }
      }
    });
    
    // Sort stage
    const sortStage: any = {};
    
    switch (sortBy) {
      case 'followers':
        sortStage.followers = sortDirection === 'asc' ? 1 : -1;
        break;
      case 'models':
        sortStage.models = sortDirection === 'asc' ? 1 : -1;
        break;
      case 'downloads':
        sortStage.totalDownloads = sortDirection === 'asc' ? 1 : -1;
        break;
      case 'rating':
        sortStage.averageRating = sortDirection === 'asc' ? 1 : -1;
        break;
      default:
        sortStage.followers = -1;
    }
    
    // Add secondary sort by name for consistent ordering
    sortStage.name = 1;
    
    pipeline.push({ $sort: sortStage });
    
    // Pagination
    const skip = (page - 1) * limit;
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });
    
    // Project stage - select fields to return
    pipeline.push({
      $project: {
        _id: 0,
        id: { $toString: '$_id' },
        name: 1,
        username: 1,
        avatar: 1,
        image: 1,
        role: 1,
        bio: 1,
        verified: 1,
        followers: 1,
        models: 1,
        openSourceModels: 1,
        totalDownloads: 1,
        averageRating: 1,
        joinedDate: 1
      }
    });
    
    // Execute the aggregation pipeline
    const usersCollection = await getCollection('users');
    const creators = await usersCollection.aggregate(pipeline).toArray();
    
    console.log(`✅ Found ${creators.length} creators`);
    
    // Check for build phase to provide sample data only during build
    if (creators.length === 0 && process.env.NEXT_PHASE === 'phase-production-build') {
      console.log('🚧 Using sample creator data for build phase');
      return NextResponse.json(getSampleCreators());
    }
    
    return NextResponse.json(creators);
  } catch (error) {
    console.error('Error fetching creators:', error);
    
    // Only use sample data during build phase
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      console.log('🚧 Using sample creator data for build phase due to error');
      return NextResponse.json(getSampleCreators());
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch creators' },
      { status: 500 }
    );
  }
}

// Sample creators data for build phase only
function getSampleCreators() {
  return [
    {
      id: '1',
      name: 'Alex Neural',
      username: 'alexneural',
      avatar: '/images/avatars/alex.jpg',
      role: 'AI Researcher',
      bio: 'Building the future of AI one model at a time. Specializing in computer vision and NLP.',
      verified: true,
      followers: 15420,
      models: 12,
      openSourceModels: 8,
      totalDownloads: 1250000,
      averageRating: 4.8,
      joinedDate: '2022-03-15'
    },
    {
      id: '2',
      name: 'SynthMind Labs',
      username: 'synthmind',
      avatar: '/images/avatars/synthmind.jpg',
      role: 'AI Studio',
      bio: 'We create cutting-edge AI models for creative applications. Join our community!',
      verified: true,
      followers: 10820,
      models: 8,
      openSourceModels: 4,
      totalDownloads: 890000,
      averageRating: 4.6,
      joinedDate: '2022-05-22'
    },
    {
      id: '3',
      name: 'Dr. Maya Patel',
      username: 'mayaai',
      avatar: '/images/avatars/maya.jpg',
      role: 'ML Scientist',
      bio: 'PhD in Machine Learning. Working on efficient models for edge devices.',
      verified: true,
      followers: 8750,
      models: 6,
      openSourceModels: 6,
      totalDownloads: 720000,
      averageRating: 4.9,
      joinedDate: '2022-06-10'
    },
    {
      id: '4',
      name: 'Neural Dynamics',
      username: 'neuraldynamics',
      avatar: '/images/avatars/neuraldynamics.jpg',
      role: 'AI Collective',
      bio: 'A collective of AI researchers pushing the boundaries of what\'s possible.',
      verified: true,
      followers: 7300,
      models: 15,
      openSourceModels: 10,
      totalDownloads: 650000,
      averageRating: 4.5,
      joinedDate: '2022-07-18'
    },
    {
      id: '5',
      name: 'Jake Williams',
      username: 'jakewml',
      avatar: '/images/avatars/jake.jpg',
      role: 'Indie AI Developer',
      bio: 'Focused on creating accessible AI tools for creative professionals.',
      verified: false,
      followers: 5200,
      models: 4,
      openSourceModels: 2,
      totalDownloads: 320000,
      averageRating: 4.4,
      joinedDate: '2022-09-05'
    },
    {
      id: '6',
      name: 'CodeCortex',
      username: 'codecortex',
      avatar: '/images/avatars/codecortex.jpg',
      role: 'Code AI Specialists',
      bio: 'We build models that help developers write better code faster.',
      verified: true,
      followers: 4800,
      models: 3,
      openSourceModels: 1,
      totalDownloads: 280000,
      averageRating: 4.7,
      joinedDate: '2022-10-12'
    }
  ];
} 