import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

/**
 * GET /api/community/discussions
 * 
 * Fetches hot discussions from the database
 * Falls back to sample data if database is not available
 */
export async function GET() {
  try {
    let discussions = [];
    
    // Try to fetch from database
    try {
      const { db } = await connectToDatabase();
      
      // Find hot discussions based on activity, replies, and likes
      discussions = await db.collection('discussions')
        .aggregate([
          {
            $addFields: {
              // Calculate hotness score based on likes, replies and recency
              hotnessScore: {
                $add: [
                  { $multiply: [{ $ifNull: ["$likeCount", 0] }, 1] },
                  { $multiply: [{ $ifNull: ["$replyCount", 0] }, 2] },
                  { 
                    $multiply: [
                      { 
                        $divide: [
                          1, 
                          { 
                            $add: [
                              1,
                              { 
                                $divide: [
                                  { $subtract: [new Date(), "$lastActivityAt"] }, 
                                  86400000 // Milliseconds in a day
                                ] 
                              }
                            ] 
                          }
                        ] 
                      },
                      1000 // Recency factor
                    ] 
                  }
                ]
              }
            }
          },
          { $sort: { hotnessScore: -1 } },
          { $limit: 6 }
        ])
        .toArray();
      
      // Transform the data into the format needed by the frontend
      if (discussions && discussions.length > 0) {
        console.log("✅ Fetched hot discussions from database:", discussions.length);
        
        // Map database fields to frontend schema
        discussions = discussions.map(discussion => ({
          title: discussion.title,
          author: discussion.authorName || "Anonymous",
          replies: discussion.replyCount || 0,
          likes: discussion.likeCount || 0,
          tags: discussion.tags || ["General"]
        }));
      } else {
        throw new Error("No discussions found in database");
      }
    } catch (error) {
      console.error("❌ Error fetching discussions from database:", error);
      
      // Fall back to sample data
      discussions = getSampleDiscussions();
    }
    
    return NextResponse.json(discussions);
  } catch (error) {
    console.error("❌ Unexpected error in discussions API:", error);
    
    // Return sample data in case of any error
    return NextResponse.json(getSampleDiscussions());
  }
}

// Sample discussions as fallback
function getSampleDiscussions() {
  return [
    {
      title: "Best practices for fine-tuning large language models",
      author: "AIExpert",
      replies: 45,
      likes: 123,
      tags: ["LLM", "Training"]
    },
    {
      title: "How to optimize transformer models for production",
      author: "PerfGuru",
      replies: 32,
      likes: 98,
      tags: ["Optimization", "Production"]
    },
    {
      title: "Future of AI model marketplaces",
      author: "FutureAI",
      replies: 67,
      likes: 156,
      tags: ["Market", "Trends"]
    },
    {
      title: "Using Neural-Nexus for computer vision projects",
      author: "VisionPro",
      replies: 29,
      likes: 87,
      tags: ["Vision", "Projects"]
    }
  ];
} 