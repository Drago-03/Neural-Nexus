import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

/**
 * GET /api/community/trending-models
 * 
 * Fetches trending AI models from the database
 * Falls back to sample data if database is not available
 */
export async function GET() {
  try {
    let trendingModels = [];
    
    // Try to fetch from database
    try {
      const { db } = await connectToDatabase();
      
      // Find trending models based on recent downloads and likes
      // Sort by a calculated "trendScore" combining various metrics
      trendingModels = await db.collection('models')
        .aggregate([
          {
            $addFields: {
              // Calculate trend score based on downloads, likes and recency
              trendScore: {
                $add: [
                  { $multiply: [{ $ifNull: ["$downloadCount", 0] }, 1] },
                  { $multiply: [{ $ifNull: ["$likeCount", 0] }, 2] },
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
                                  { $subtract: [new Date(), "$updatedAt"] }, 
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
          { $sort: { trendScore: -1 } },
          { $limit: 6 }
        ])
        .toArray();
      
      // Transform the data into the format needed by the frontend
      if (trendingModels && trendingModels.length > 0) {
        console.log("✅ Fetched trending models from database:", trendingModels.length);
        
        // Map database fields to frontend schema
        trendingModels = trendingModels.map(model => ({
          name: model.name,
          image: model.image || "/models/default.jpg",
          creator: model.creatorName || "Unknown",
          category: model.category || "AI Model",
          likes: model.likeCount || 0,
          downloads: formatDownloadCount(model.downloadCount || 0)
        }));
      } else {
        throw new Error("No trending models found in database");
      }
    } catch (error) {
      console.error("❌ Error fetching models from database:", error);
      
      // Fall back to sample data
      trendingModels = getSampleModels();
    }
    
    return NextResponse.json(trendingModels);
  } catch (error) {
    console.error("❌ Unexpected error in trending models API:", error);
    
    // Return sample data in case of any error
    return NextResponse.json(getSampleModels());
  }
}

// Helper to format download counts
function formatDownloadCount(count: number): string {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M+';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K+';
  }
  return count.toString() + '+';
}

// Sample models as fallback
function getSampleModels() {
  return [
    {
      name: "SuperRes Pro",
      image: "/models/superres.jpg",
      creator: "PixelPro",
      category: "Image Enhancement",
      likes: 1234,
      downloads: "50K+"
    },
    {
      name: "TextMaster GPT",
      image: "/models/textmaster.jpg",
      creator: "AIWriter",
      category: "Text Generation",
      likes: 982,
      downloads: "30K+"
    },
    {
      name: "VoiceClone AI",
      image: "/models/voiceclone.jpg",
      creator: "AudioLab",
      category: "Speech Synthesis",
      likes: 756,
      downloads: "25K+"
    }
  ];
} 