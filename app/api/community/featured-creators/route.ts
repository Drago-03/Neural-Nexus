import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

/**
 * GET /api/community/featured-creators
 * 
 * Fetches featured creators from the database
 * Falls back to sample data if database is not available
 */
export async function GET() {
  try {
    let featuredCreators = [];
    
    // Try to fetch from database
    try {
      const { db } = await connectToDatabase();
      
      // Find creators marked as featured, limit to 6, sort by followers count
      featuredCreators = await db.collection('creators')
        .find({ featured: true })
        .sort({ followers: -1 })
        .limit(6)
        .toArray();
      
      // Transform the data into the format needed by the frontend
      if (featuredCreators && featuredCreators.length > 0) {
        console.log("✅ Fetched featured creators from database:", featuredCreators.length);
        
        // Map database fields to frontend schema
        featuredCreators = featuredCreators.map(creator => ({
          name: creator.name,
          image: creator.avatar || "/creators/default.jpg",
          role: creator.role || "AI Developer",
          models: creator.modelCount || 0,
          followers: formatFollowerCount(creator.followers || 0),
          bio: creator.bio || "AI developer on Neural Nexus",
          tags: creator.tags || ["#AI"]
        }));
      } else {
        throw new Error("No featured creators found in database");
      }
    } catch (error) {
      console.error("❌ Error fetching creators from database:", error);
      
      // Fall back to sample data
      featuredCreators = getSampleCreators();
    }
    
    return NextResponse.json(featuredCreators);
  } catch (error) {
    console.error("❌ Unexpected error in featured creators API:", error);
    
    // Return sample data in case of any error
    return NextResponse.json(getSampleCreators());
  }
}

// Helper to format follower counts
function formatFollowerCount(count: number): string {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count.toString();
}

// Sample creators as fallback
function getSampleCreators() {
  return [
    {
      name: "Sarah AI",
      image: "/creators/sarah.jpg",
      role: "ML Engineer",
      models: 12,
      followers: "5.2K",
      bio: "Building the next gen of computer vision models",
      tags: ["#ComputerVision", "#DeepLearning"]
    },
    {
      name: "DataWhiz",
      image: "/creators/datawhiz.jpg",
      role: "Data Scientist",
      models: 8,
      followers: "3.8K",
      bio: "Specializing in NLP and text generation",
      tags: ["#NLP", "#GPT"]
    },
    {
      name: "RoboMaster",
      image: "/creators/robomaster.jpg",
      role: "Robotics Engineer",
      models: 15,
      followers: "7.1K",
      bio: "Creating AI models for robotics and automation",
      tags: ["#Robotics", "#RL"]
    }
  ];
} 