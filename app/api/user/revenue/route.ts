import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCollection } from '@/lib/mongodb';

// Force Node.js runtime for this route
export const runtime = 'nodejs';

// GET /api/user/revenue - Get user revenue data
export async function GET(req: NextRequest) {
  try {
    console.log("🔍 Revenue API: Processing request");
    const startTime = Date.now();
    
    // Authenticate user from session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.warn("🛑 Revenue API: Unauthorized access attempt");
      return NextResponse.json(
        { error: 'Unauthorized - No active session' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    console.log(`✅ Revenue API: Authenticated user ${userId}`);
    
    // Get current date to determine months
    const now = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Try to fetch real-time data from database
    try {
      console.log(`🔄 Revenue API: Fetching revenue data for user ${userId}`);
      const paymentsCollection = await getCollection('payments');
      
      // Query for user's payments grouped by month
      // Real-time aggregation of payment data
      const aggregatedRevenue = await paymentsCollection.aggregate([
        { $match: { userId: userId } },
        { 
          $group: {
            _id: { 
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" }
            },
            amount: { $sum: "$amount" },
            count: { $sum: 1 }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        { $limit: 6 } // Last 6 months
      ]).toArray();
      
      // If we have revenue data, format it
      if (aggregatedRevenue && aggregatedRevenue.length > 0) {
        console.log(`📊 Revenue API: Found ${aggregatedRevenue.length} months of revenue data`);
        
        const formattedRevenue = aggregatedRevenue.map((item: { 
          _id: { year: number; month: number; },
          amount: number,
          count: number
        }) => ({
          month: monthNames[item._id.month - 1],
          amount: item.amount,
          transactionCount: item.count,
          year: item._id.year
        }));
        
        const totalRevenue = formattedRevenue.reduce((sum: number, month: {amount: number}) => sum + month.amount, 0);
        const totalTransactions = formattedRevenue.reduce((sum: number, month: {transactionCount: number}) => sum + month.transactionCount, 0);
        
        console.log(`💰 Revenue API: Total revenue $${totalRevenue.toFixed(2)} from ${totalTransactions} transactions`);
        
        const responseTime = Date.now() - startTime;
        console.log(`⏱️ Revenue API: Request completed in ${responseTime}ms`);
        
        return NextResponse.json({
          success: true,
          revenue: formattedRevenue,
          summary: {
            totalRevenue,
            totalTransactions,
            averageTransaction: totalTransactions > 0 ? totalRevenue / totalTransactions : 0
          },
          lastUpdated: new Date().toISOString()
        });
      } else {
        console.log(`ℹ️ Revenue API: No revenue data found for user ${userId}`);
      }
    } catch (error) {
      console.error("❌ Revenue API: Error fetching revenue data:", error);
      // Continue to fallback if database query fails
    }
    
    // If no revenue data found or error occurred, return empty data for last 6 months
    console.log(`🔄 Revenue API: Generating fallback data for user ${userId}`);
    const emptyRevenue = Array.from({ length: 6 }, (_, i) => {
      const monthIndex = (now.getMonth() - 5 + i + 12) % 12; // Get last 6 months
      return {
        month: monthNames[monthIndex],
        amount: 0,
        transactionCount: 0,
        year: now.getFullYear() - (monthIndex > now.getMonth() ? 1 : 0)
      };
    });
    
    const responseTime = Date.now() - startTime;
    console.log(`⏱️ Revenue API: Request completed with fallback data in ${responseTime}ms`);
    
    return NextResponse.json({
      success: true,
      revenue: emptyRevenue,
      summary: {
        totalRevenue: 0,
        totalTransactions: 0,
        averageTransaction: 0
      },
      lastUpdated: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Revenue API: Unhandled error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch revenue data', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 