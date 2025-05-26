import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { dynamic } from "../../config";

interface SaleData {
  id: string;
  modelName: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'refunded';
}

/**
 * GET /api/user/sales
 * 
 * Retrieves sales data with real-time analytics and filtering
 */
export async function GET(req: Request) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the seller ID
    const sellerId = session.user.id;
    
    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || 'all'; // '7d', '30d', '90d', 'year', 'all'
    
    // Calculate the start date based on the period
    let startDate: Date | null = null;
    const now = new Date();
    
    if (period === '7d') {
      startDate = new Date(now.setDate(now.getDate() - 7));
    } else if (period === '30d') {
      startDate = new Date(now.setDate(now.getDate() - 30));
    } else if (period === '90d') {
      startDate = new Date(now.setDate(now.getDate() - 90));
    } else if (period === 'year') {
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
    }
    
    // Get collections with proper typing
    const purchasesCollection = await getCollection('model_purchases');
    const modelsCollection = await getCollection('models');
    const usersCollection = await getCollection('users');
    
    // Build pipeline for MongoDB aggregation
    const pipeline = [
      {
        $match: {
          seller_id: sellerId,
          ...(startDate ? { created_at: { $gte: startDate.toISOString() } } : {})
        }
      },
      {
        $lookup: {
          from: 'models',
          localField: 'model_id',
          foreignField: '_id',
          as: 'model'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: 'id',
          as: 'customer'
        }
      },
      {
        $unwind: { 
          path: '$model',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$customer',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          model_id: 1,
          user_id: 1,
          amount: 1,
          status: 1,
          created_at: 1,
          modelName: '$model.name',
          customerName: '$customer.name',
          customerEmail: '$customer.email'
        }
      },
      {
        $sort: { created_at: -1 }
      }
    ];
    
    const salesData = await purchasesCollection.aggregate(pipeline).toArray();
    
    // Format the data for the frontend
    const sales: SaleData[] = salesData.map(sale => ({
      id: sale._id.toString(),
      modelName: sale.modelName || 'Unknown Model',
      customerName: sale.customerName || 'Unknown Customer',
      customerEmail: sale.customerEmail || 'no-email@example.com',
      amount: sale.amount || 0,
      date: sale.created_at,
      status: (sale.status as 'completed' | 'pending' | 'refunded') || 'pending'
    }));
    
    // Calculate totals for analytics
    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.amount, 0);
    const completedSales = sales.filter(sale => sale.status === 'completed').length;
    const pendingSales = sales.filter(sale => sale.status === 'pending').length;
    
    // Calculate daily revenue for chart data (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const dateTracker = new Map<string, number>();
    
    // Initialize with zeros for last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      dateTracker.set(dateString, 0);
    }
    
    // Fill in actual revenue data
    for (const sale of sales) {
      if (new Date(sale.date) >= thirtyDaysAgo && sale.status === 'completed') {
        const dateString = new Date(sale.date).toISOString().split('T')[0];
        if (dateTracker.has(dateString)) {
          dateTracker.set(dateString, dateTracker.get(dateString)! + sale.amount);
        }
      }
    }
    
    // Convert map to array of date/revenue pairs
    interface DailyRevenue {
      date: string;
      revenue: number;
    }
    
    const dailyRevenue: DailyRevenue[] = [];
    
    // Use Array.from to convert Map entries to array instead of Map.entries() iterator
    Array.from(dateTracker.entries()).forEach(([date, revenue]) => {
      dailyRevenue.push({ date, revenue });
    });
    
    // Sort by date
    dailyRevenue.sort((a, b) => a.date.localeCompare(b.date));
    
    return NextResponse.json({
      sales,
      analytics: {
        totalSales,
        totalRevenue,
        completedSales,
        pendingSales,
        dailyRevenue
      }
    });
  } catch (error: any) {
    console.error('Error fetching sales data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales data', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user/sales
 * 
 * Creates a new sale record (for testing)
 */
export async function POST(req: Request) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const buyerId = session.user.id;
    
    // Parse request body
    const data = await req.json();
    const { modelId, sellerId, amount } = data;
    
    if (!modelId || !sellerId || amount === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: modelId, sellerId, or amount' },
        { status: 400 }
      );
    }
    
    // Get purchases collection
    const purchasesCollection = await getCollection('model_purchases');
    
    // Create the purchase record
    const result = await purchasesCollection.insertOne({
      model_id: modelId,
      user_id: buyerId,
      seller_id: sellerId,
      amount: amount,
      status: 'completed',
      created_at: new Date().toISOString()
    });
    
    return NextResponse.json({
      success: true,
      purchaseId: result.insertedId.toString(),
      message: 'Sale record created successfully'
    });
  } catch (error: any) {
    console.error('Error creating sale record:', error);
    return NextResponse.json(
      { error: 'Failed to create sale record', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Example of how to implement real-time sales updates with webhooks
 * 
 * This would be called by payment providers like Stripe when a payment is completed
 */
/*
export async function PATCH(req: Request) {
  try {
    // This would typically verify the webhook signature from the payment provider
    // const signature = req.headers.get('stripe-signature');
    // ... validate signature ...
    
    const data = await req.json();
    const { 
      event_type,
      payment_id, 
      status, 
      model_id, 
      user_id, 
      seller_id,
      amount
    } = data;
    
    // Update the purchase record in the database
    const purchasesCollection = await getCollection('model_purchases');
    
    if (event_type === 'payment.completed') {
      await purchasesCollection.updateOne(
        { _id: new ObjectId(payment_id) },
        { 
          $set: { 
            status: 'completed',
            updated_at: new Date().toISOString()
          }
        }
      );
      
      // Create a transaction record
      const transactionsCollection = await getCollection('transactions');
      await transactionsCollection.insertOne({
        user_id: seller_id,
        related_id: payment_id,
        type: 'sale',
        amount: amount * 0.8, // 80% to the seller
        status: 'completed',
        created_at: new Date().toISOString()
      });
      
      // Update model stats
      const modelsCollection = await getCollection('models');
      await modelsCollection.updateOne(
        { _id: new ObjectId(model_id) },
        { $inc: { sales_count: 1, revenue: amount } }
      );
    } else if (event_type === 'payment.refunded') {
      await purchasesCollection.updateOne(
        { _id: new ObjectId(payment_id) },
        { 
          $set: { 
            status: 'refunded',
            updated_at: new Date().toISOString()
          }
        }
      );
      
      // Create a refund transaction
      const transactionsCollection = await getCollection('transactions');
      await transactionsCollection.insertOne({
        user_id: seller_id,
        related_id: payment_id,
        type: 'refund',
        amount: -amount * 0.8, // 80% to the seller
        status: 'completed',
        created_at: new Date().toISOString()
      });
    }
    
    return NextResponse.json({
      success: true,
      message: `Payment ${event_type} processed successfully`
    });
  } catch (error: any) {
    console.error('Error processing payment webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process payment webhook', details: error.message },
      { status: 500 }
    );
  }
}
*/

export { dynamic }; 