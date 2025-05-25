import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Force Node.js runtime for this route
export const runtime = 'nodejs';

// GET /api/user/usage - Get usage statistics for the authenticated user
export async function GET(req: NextRequest) {
  try {
    console.log("🔍 Usage: Processing GET request");
    const startTime = Date.now();
    
    // Authenticate user
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.warn("🛑 Usage: Unauthorized access attempt");
      return NextResponse.json(
        { error: 'Unauthorized - No active session' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    console.log(`✅ Usage: Authenticated user ${userId}`);
    
    // Get query params for time range
    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || '30days'; // Default to 30 days
    
    // Calculate date range based on period
    const endDate = new Date();
    let startDate = new Date();
    
    switch(period) {
      case '7days':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '1year':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      case 'all':
        startDate = new Date(0); // Beginning of time
        break;
      default:
        startDate.setDate(endDate.getDate() - 30); // Default to 30 days
    }
    
    try {
      // Fetch API usage data from MongoDB
      const apiUsageCollection = await getCollection('api_usage');
      
      // Get API key IDs for this user
      const apiKeysCollection = await getCollection('api_keys');
      const userKeys = await apiKeysCollection
        .find({ userId })
        .project({ _id: 1 })
        .toArray();
      
      const keyIds = userKeys.map(key => key._id.toString());
      
      // Total API calls in the period
      const totalCalls = await apiUsageCollection.countDocuments({
        userId,
        timestamp: { 
          $gte: startDate,
          $lte: endDate
        }
      });
      
      // Calls per day
      const dailyUsageResult = await apiUsageCollection.aggregate([
        { 
          $match: { 
            userId,
            timestamp: { 
              $gte: startDate,
              $lte: endDate
            }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: "$timestamp" },
              month: { $month: "$timestamp" },
              day: { $dayOfMonth: "$timestamp" }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
        }
      ]).toArray();
      
      // Format daily usage data
      const dailyUsage = dailyUsageResult.map(day => ({
        date: new Date(Date.UTC(day._id.year, day._id.month - 1, day._id.day)).toISOString().split('T')[0],
        count: day.count
      }));
      
      // Usage by endpoint
      const endpointUsageResult = await apiUsageCollection.aggregate([
        { 
          $match: { 
            userId,
            timestamp: { 
              $gte: startDate,
              $lte: endDate
            }
          }
        },
        {
          $group: {
            _id: "$endpoint",
            count: { $sum: 1 }
          }
        },
        {
          $sort: { "count": -1 }
        },
        {
          $limit: 10 // Top 10 endpoints
        }
      ]).toArray();
      
      // Format endpoint usage data
      const endpointUsage = endpointUsageResult.map(endpoint => ({
        endpoint: endpoint._id,
        count: endpoint.count
      }));
      
      // Usage by API key
      const keyUsageResult = await apiUsageCollection.aggregate([
        { 
          $match: { 
            apiKeyId: { $in: keyIds },
            timestamp: { 
              $gte: startDate,
              $lte: endDate
            }
          }
        },
        {
          $group: {
            _id: "$apiKeyId",
            count: { $sum: 1 }
          }
        },
        {
          $sort: { "count": -1 }
        }
      ]).toArray();
      
      // Get key names for the IDs
      const keyUsage = await Promise.all(keyUsageResult.map(async (item) => {
        const keyInfo = await apiKeysCollection.findOne({ _id: new ObjectId(item._id) });
        return {
          keyId: item._id,
          name: keyInfo?.name || 'Unknown Key',
          prefix: keyInfo?.prefix || 'xxxx',
          count: item.count
        };
      }));
      
      // Calculate response time
      const responseTime = Date.now() - startTime;
      console.log(`⏱️ Usage: Request completed in ${responseTime}ms`);
      
      // Return usage data
      return NextResponse.json({
        success: true,
        period,
        dateRange: {
          from: startDate.toISOString(),
          to: endDate.toISOString()
        },
        totalCalls,
        dailyUsage,
        topEndpoints: endpointUsage,
        keyUsage,
        metrics: {
          avgCallsPerDay: dailyUsage.length > 0 ? 
            Math.round(totalCalls / dailyUsage.length) : 0,
          peakDay: dailyUsage.length > 0 ? 
            dailyUsage.reduce((max, day) => day.count > max.count ? day : max, dailyUsage[0]) : null,
        },
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error("❌ Usage: Database error:", error);
      throw error;
    }
  } catch (error) {
    console.error('❌ Usage: Error getting usage data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch usage data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}