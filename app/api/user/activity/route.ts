import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Force Node.js runtime for this route
export const runtime = 'nodejs';

interface Activity {
  type: string;
  model?: string;
  user?: string;
  amount?: string;
  time: string;
  details?: string;
  timestamp?: Date; // For sorting
  id?: string;      // Unique identifier
}

// GET /api/user/activity - Get user activity data
export async function GET(req: NextRequest) {
  try {
    console.log("🔍 Activity API: Processing request");
    const startTime = Date.now();
    
    // Authenticate user
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.warn("🛑 Activity API: Unauthorized access attempt");
      return NextResponse.json(
        { error: 'Unauthorized - No active session' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    console.log(`✅ Activity API: Authenticated user ${userId}`);
    
    // Parse request parameters
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const activityTypes = url.searchParams.get('types')?.split(',') || [];
    
    console.log(`📊 Activity API: Requested ${limit} activities${activityTypes.length ? ` of types: ${activityTypes.join(', ')}` : ''}`);
    
    // Activities to return
    let activities: Activity[] = [];
    
    try {
      // Get models created by the user - real-time data
      console.log(`🔄 Activity API: Fetching user models for ${userId}`);
      const modelsCollection = await getCollection('models');
      const userModels = await modelsCollection.find({ 'creator.id': userId }).toArray();
      
      // Get model IDs for lookup
      const modelIds = userModels.map((model: any) => model._id.toString());
      console.log(`📋 Activity API: Found ${modelIds.length} models for user`);
      
      // Format model data for lookup
      const modelLookup: Record<string, string> = {};
      userModels.forEach((model: any) => {
        modelLookup[model._id.toString()] = model.name;
      });
      
      // Activity sources to check - run concurrently for better performance
      console.log(`🔄 Activity API: Fetching activities from multiple sources`);
      const activitySources = [
        // Get downloads of user's models
        getDownloads(modelIds, modelLookup, limit),
        
        // Get reviews of user's models
        getReviews(modelIds, modelLookup, limit),
        
        // Get payments to user
        getPayments(userId, limit),
        
        // Get API usage data
        getApiUsage(userId, limit)
      ];
      
      // Wait for all activity sources - real-time parallel fetching
      const activityResults = await Promise.allSettled(activitySources);
      
      // Process successful results
      let totalActivitiesFound = 0;
      activityResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          totalActivitiesFound += result.value.length;
          const sourceType = ['downloads', 'reviews', 'payments', 'api_usage'][index];
          console.log(`✅ Activity API: Fetched ${result.value.length} ${sourceType} activities`);
          
          // Filter by requested activity types if specified
          if (activityTypes.length === 0 || activityTypes.includes(sourceType)) {
            activities = [...activities, ...result.value];
          }
        } else {
          console.error(`❌ Activity API: Failed to fetch activity source: ${result.reason}`);
        }
      });
      
      console.log(`📊 Activity API: Total activities found: ${totalActivitiesFound}`);
      
      // Sort activities by time (most recent first) - real-time sorting
      activities.sort((a, b) => {
        // Use timestamp if available for more accurate sorting
        if (a.timestamp && b.timestamp) {
          return b.timestamp.getTime() - a.timestamp.getTime();
        }
        
        // Fallback to parsing time strings
        const timeA = parseActivityTime(a.time);
        const timeB = parseActivityTime(b.time);
        return timeB - timeA;
      });
      
      // Limit to requested number of activities
      activities = activities.slice(0, limit);
      
    } catch (error) {
      console.error("❌ Activity API: Error fetching activity data:", error);
      // Continue with empty activities if database query fails
    }
    
    const responseTime = Date.now() - startTime;
    console.log(`⏱️ Activity API: Request completed in ${responseTime}ms with ${activities.length} activities`);
    
    // Group activities by type for easier client-side processing
    const groupedActivities = activities.reduce((groups: Record<string, Activity[]>, activity) => {
      const type = activity.type;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(activity);
      return groups;
    }, {});
    
    return NextResponse.json({
      success: true,
      activities,
      groupedActivities,
      summary: {
        total: activities.length,
        byType: Object.entries(groupedActivities).map(([type, items]) => ({
          type,
          count: items.length
        }))
      },
      lastUpdated: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Activity API: Unhandled error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch activity data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper function to get model downloads - real-time data
async function getDownloads(modelIds: string[], modelLookup: Record<string, string>, limit: number): Promise<Activity[]> {
  try {
    if (modelIds.length === 0) return [];
    
    const downloadsCollection = await getCollection('model_downloads');
    const downloads = await downloadsCollection
      .find({ 
        modelId: { $in: modelIds.map(id => new ObjectId(id)) },
      })
      .sort({ createdAt: -1 })
      .limit(limit * 2) // Fetch more to have enough after filtering
      .toArray();
    
    console.log(`📥 Found ${downloads.length} downloads for models`);
    
    return downloads.map((download: any) => ({
      id: download._id.toString(),
      type: 'download',
      model: modelLookup[download.modelId.toString()] || 'Unknown model',
      user: download.userName || download.userId || 'Anonymous user',
      time: formatTimeAgo(download.createdAt),
      timestamp: download.createdAt,
      details: download.metadata?.location || 'Model download'
    }));
  } catch (error) {
    console.error("❌ Error fetching downloads:", error);
    return [];
  }
}

// Helper function to get model reviews - real-time data
async function getReviews(modelIds: string[], modelLookup: Record<string, string>, limit: number): Promise<Activity[]> {
  try {
    if (modelIds.length === 0) return [];
    
    const modelsCollection = await getCollection('models');
    const models = await modelsCollection
      .find({ 
        _id: { $in: modelIds.map(id => new ObjectId(id)) },
        'reviews': { $exists: true, $ne: [] }
      })
      .toArray();
    
    console.log(`📝 Found ${models.length} models with reviews`);
    
    // Extract reviews from models
    const reviews: Activity[] = [];
    
    models.forEach((model: any) => {
      if (model.reviews && Array.isArray(model.reviews)) {
        model.reviews.forEach((review: any) => {
          reviews.push({
            id: review._id ? review._id.toString() : `review-${Math.random().toString(36).substring(2, 9)}`,
            type: 'review',
            model: model.name,
            user: review.userName || review.userId || 'Anonymous user',
            time: formatTimeAgo(review.createdAt),
            timestamp: review.createdAt,
            details: `${review.rating}/5 stars${review.comment ? ` - "${review.comment.substring(0, 30)}${review.comment.length > 30 ? '...' : ''}"` : ''}`
          });
        });
      }
    });
    
    // Sort by date
    reviews.sort((a, b) => {
      if (a.timestamp && b.timestamp) {
        return b.timestamp.getTime() - a.timestamp.getTime();
      }
      const timeA = parseActivityTime(a.time);
      const timeB = parseActivityTime(b.time);
      return timeB - timeA;
    });
    
    return reviews.slice(0, limit); // Limit to requested number
  } catch (error) {
    console.error("❌ Error fetching reviews:", error);
    return [];
  }
}

// Helper function to get payments - real-time data
async function getPayments(userId: string, limit: number): Promise<Activity[]> {
  try {
    const paymentsCollection = await getCollection('payments');
    const payments = await paymentsCollection
      .find({ receiverId: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
    
    console.log(`💰 Found ${payments.length} payments for user`);
    
    return payments.map((payment: any) => ({
      id: payment._id.toString(),
      type: 'payment',
      amount: `$${payment.amount.toFixed(2)}`,
      user: payment.senderName || payment.senderId || 'Anonymous user',
      time: formatTimeAgo(payment.createdAt),
      timestamp: payment.createdAt,
      details: payment.description || 'Model usage payment'
    }));
  } catch (error) {
    console.error("❌ Error fetching payments:", error);
    return [];
  }
}

// Helper function to get API usage - real-time data
async function getApiUsage(userId: string, limit: number): Promise<Activity[]> {
  try {
    const apiUsageCollection = await getCollection('api_usage');
    const usageData = await apiUsageCollection
      .find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();
    
    console.log(`🔌 Found ${usageData.length} API usage records for user`);
    
    return usageData.map((usage: any) => ({
      id: usage._id.toString(),
      type: 'api_usage',
      model: usage.modelName || usage.modelId || 'API',
      time: formatTimeAgo(usage.timestamp),
      timestamp: usage.timestamp,
      details: `${usage.endpoint || 'API call'} - ${usage.statusCode === 200 ? 'Success' : 'Failed'}`
    }));
  } catch (error) {
    console.error("❌ Error fetching API usage:", error);
    return [];
  }
}

// Helper to format time ago
function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const pastDate = new Date(date);
  const diffMs = now.getTime() - pastDate.getTime();
  
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return days === 1 ? '1 day ago' : `${days} days ago`;
  } else if (hours > 0) {
    return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  } else if (minutes > 0) {
    return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
  } else {
    return seconds <= 5 ? 'just now' : `${seconds} seconds ago`;
  }
}

// Helper to parse activity time for sorting
function parseActivityTime(timeString: string): number {
  // Current time
  const now = new Date().getTime();
  
  // Parse common time ago formats
  if (timeString.includes('just now')) {
    return now - 5000; // 5 seconds ago
  } else if (timeString.includes('seconds')) {
    const seconds = parseInt(timeString.split(' ')[0]);
    return now - (seconds * 1000);
  } else if (timeString.includes('minute')) {
    const minutes = parseInt(timeString.split(' ')[0]);
    return now - (minutes * 60 * 1000);
  } else if (timeString.includes('hour')) {
    const hours = parseInt(timeString.split(' ')[0]);
    return now - (hours * 60 * 60 * 1000);
  } else if (timeString.includes('day')) {
    const days = parseInt(timeString.split(' ')[0]);
    return now - (days * 24 * 60 * 60 * 1000);
  } else {
    // Default to now if format not recognized
    return now;
  }
} 