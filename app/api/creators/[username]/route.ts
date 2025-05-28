import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

interface Creator {
  _id: string;
  id?: string;
  name: string;
  username?: string;
  avatar?: string;
  image?: string;
  role?: string;
  bio?: string;
  verified?: boolean;
  followers: number;
  models: number;
  openSourceModels: number;
  totalDownloads: number;
  averageRating: number;
  website?: string;
  github?: string;
  twitter?: string;
  joinedDate?: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const username = params.username;
    console.log(`🔍 Fetching creator: ${username}`);
    
    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }
    
    // Try to find the creator by username or id
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
    
    // First get the basic user info
    const creator = await usersCollection.findOne(query) as unknown as Creator | null;
    
    if (!creator) {
      console.log(`❌ Creator not found: ${username}`);
      
      // Only use sample data during build phase
      if (process.env.NEXT_PHASE === 'phase-production-build') {
        console.log('🚧 Using sample creator data for build phase');
        return NextResponse.json(getSampleCreator(username));
      }
      
      return NextResponse.json(
        { error: 'Creator not found' },
        { status: 404 }
      );
    }
    
    // Now get model information to calculate stats
    const modelsCollection = await getCollection('models');
    
    const creatorId = creator._id;
    const modelsQuery = { creatorId: new ObjectId(creatorId) };
    
    // Get count of all models by this creator
    const modelCount = await modelsCollection.countDocuments(modelsQuery);
    
    // Get count of open source models by this creator
    const openSourceModelCount = await modelsCollection.countDocuments({
      ...modelsQuery,
      license: 'open-source'
    });
    
    // Get total downloads
    const modelsAggregation = await modelsCollection.aggregate([
      { $match: modelsQuery },
      {
        $group: {
          _id: null,
          totalDownloads: { $sum: '$downloads' },
          averageRating: { $avg: '$rating' }
        }
      }
    ]).toArray();
    
    const modelStats = modelsAggregation[0] || { totalDownloads: 0, averageRating: 0 };
    
    // Format creator object for response
    const formattedCreator = {
      id: creator._id.toString(),
      name: creator.name,
      username: creator.username,
      avatar: creator.avatar,
      image: creator.image,
      role: creator.role,
      bio: creator.bio,
      verified: creator.verified || false,
      followers: creator.followers || 0,
      models: modelCount,
      openSourceModels: openSourceModelCount,
      totalDownloads: modelStats.totalDownloads || 0,
      averageRating: modelStats.averageRating || 0,
      website: creator.website,
      github: creator.github,
      twitter: creator.twitter,
      joinedDate: creator.joinedDate
    };
    
    console.log(`✅ Found creator: ${formattedCreator.name}`);
    return NextResponse.json(formattedCreator);
  } catch (error) {
    console.error('Error fetching creator:', error);
    
    // Only use sample data during build phase
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      console.log('🚧 Using sample creator data for build phase due to error');
      return NextResponse.json(getSampleCreator(params.username));
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch creator' },
      { status: 500 }
    );
  }
}

// Sample creator data for build phase only
function getSampleCreator(username: string) {
  return {
    id: '1',
    name: 'Alex Neural',
    username: username,
    avatar: '/images/avatars/alex.jpg',
    role: 'AI Researcher',
    bio: 'Building the future of AI one model at a time. Specializing in computer vision and NLP.',
    verified: true,
    followers: 15420,
    models: 12,
    openSourceModels: 8,
    totalDownloads: 1250000,
    averageRating: 4.8,
    website: 'alexneural.ai',
    github: 'alexneural',
    twitter: 'alexneural',
    joinedDate: '2022-03-15'
  };
}