import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { dynamic } from "../../config";

interface CustomerData {
  id: string;
  name: string;
  email: string;
  location: string;
  joinedDate: string;
  purchases: number;
  spent: number;
  lastPurchase: string;
}

// Define the structure returned by Supabase
interface PurchaseRecord {
  user_id: string;
  users: {
    id: string;
    name: string | null;
    email: string | null;
    location: string | null;
    created_at: string;
  } | null;
  amount: number;
  created_at: string;
}

/**
 * GET /api/user/customers
 * 
 * Retrieves customer data with real-time analytics
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
    
    // Extract query params
    const { searchParams } = new URL(req.url);
    const location = searchParams.get('location');
    
    // Get purchases collection with proper typing
    const purchasesCollection = await getCollection<{
      model_id: string;
      user_id: string;
      amount: number;
      created_at: string;
      status: string;
      models: { user_id: string }[];
    }>('model_purchases');
    
    // Get user collection
    const usersCollection = await getCollection('users');

    // Build query to get all purchases for models created by this seller
    const modelsCollection = await getCollection('models');
    const sellerModels = await modelsCollection.find({ user_id: sellerId }).toArray();
    const sellerModelIds = sellerModels.map(model => model._id.toString());
    
    // Get all purchases for this seller's models
    const pipeline = [
      {
        $match: {
          model_id: { $in: sellerModelIds },
          status: 'completed'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: 'id',
          as: 'users'
        }
      },
      {
        $unwind: {
          path: '$users',
          preserveNullAndEmptyArrays: true
        }
      },
      // Filter by location if provided
      ...(location ? [{ 
        $match: { 
          'users.location': location 
        }
      }] : []),
      {
        $group: {
          _id: '$user_id',
          customer: { $first: '$users' },
          purchases: { $sum: 1 },
          spent: { $sum: '$amount' },
          lastPurchase: { $max: '$created_at' }
        }
      },
      {
        $sort: { spent: -1 }
      }
    ];
    
    const customerAggregation = await purchasesCollection.aggregate(pipeline).toArray();
    
    // Transform the data
    const customers: CustomerData[] = customerAggregation.map(record => ({
      id: record._id,
      name: record.customer?.name || 'Unknown Customer',
      email: record.customer?.email || 'no-email@example.com',
      location: record.customer?.location || 'Unknown',
      joinedDate: record.customer?.created_at || new Date().toISOString(),
      purchases: record.purchases,
      spent: record.spent,
      lastPurchase: record.lastPurchase
    }));

    // Calculate analytics
    const totalCustomers = customers.length;
    const totalRevenue = customers.reduce((sum, customer) => sum + customer.spent, 0);
    const averageSpent = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;
    
    return NextResponse.json({
      customers,
      analytics: {
        totalCustomers,
        totalRevenue,
        averageSpent
      }
    });
  } catch (error: any) {
    console.error('Error fetching customer data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer data', details: error.message },
      { status: 500 }
    );
  }
}

export { dynamic }; 