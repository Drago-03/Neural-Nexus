import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import supabase from "@/lib/supabase";
import { dynamic } from "../../config";

interface ModelCount {
  id: string;
  name: string;
  createdAt: Date;
  _count: {
    downloads: number;
    views: number;
    reviews: number;
  };
}

interface SaleData {
  modelId: string;
  amount: number;
}

interface RatingData {
  modelId: string;
  _avg: {
    rating: number | null;
  };
}

interface ModelData {
  id: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  category: string;
  tags: string[];
  status: string;
}

interface ViewData {
  model_id: string;
  count: number;
}

interface DownloadData {
  model_id: string;
  count: number;
}

interface PurchaseData {
  model_id: string;
  amount: number;
}

interface RatingItem {
  model_id: string;
  rating: number;
}

// GET /api/user/models
export const GET = async (req: Request) => {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    try {
      // Fetch basic model data
      const { data: modelsData, error: modelsError } = await supabase
        .from('models')
        .select('id, name, description, created_at, price, category, tags, status')
        .eq('user_id', userId);
      
      if (modelsError) {
        throw new Error(`Error fetching models: ${modelsError.message}`);
      }
      
      // Ensure models is an array
      const models: ModelData[] = modelsData || [];
      
      // Fetch view counts
      const { data: viewsData, error: viewsError } = await supabase
        .from('model_views')
        .select('model_id, count')
        .eq('user_id', userId);
      
      if (viewsError) {
        console.error("Error fetching views:", viewsError);
      }
      
      // Ensure viewsData is an array
      const views: ViewData[] = viewsData || [];
      
      // Fetch download counts
      const { data: downloadsData, error: downloadsError } = await supabase
        .from('model_downloads')
        .select('model_id, count')
        .eq('user_id', userId);
      
      if (downloadsError) {
        console.error("Error fetching downloads:", downloadsError);
      }
      
      // Ensure downloadsData is an array
      const downloads: DownloadData[] = downloadsData || [];
      
      // Fetch sales data
      const { data: salesData, error: salesError } = await supabase
        .from('model_purchases')
        .select('model_id, amount')
        .eq('seller_id', userId);
      
      if (salesError) {
        console.error("Error fetching sales:", salesError);
      }
      
      // Ensure salesData is an array
      const sales: PurchaseData[] = salesData || [];
      
      // Fetch ratings
      const { data: ratingsData, error: ratingsError } = await supabase
        .from('model_ratings')
        .select('model_id, rating')
        .eq('model_user_id', userId);
      
      if (ratingsError) {
        console.error("Error fetching ratings:", ratingsError);
      }
      
      // Ensure ratingsData is an array
      const ratings: RatingItem[] = ratingsData || [];
      
      // Combine data for each model
      const combinedData = models.map((model: ModelData) => {
        // Find view count for this model
        const viewCount = views.find(v => v.model_id === model.id)?.count || 0;
        
        // Find download count for this model
        const downloadCount = downloads.find(d => d.model_id === model.id)?.count || 0;
        
        // Calculate total revenue from this model
        const revenue = sales
          .filter(s => s.model_id === model.id)
          .reduce((sum, sale) => sum + (sale.amount || 0), 0);
        
        // Calculate average rating
        const modelRatings = ratings.filter(r => r.model_id === model.id);
        const totalRating = modelRatings.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = modelRatings.length > 0 ? totalRating / modelRatings.length : 0;
        
        return {
          id: model.id,
          name: model.name,
          description: model.description,
          category: model.category,
          createdAt: model.created_at,
          status: model.status,
          views: viewCount,
          downloads: downloadCount,
          revenue: revenue,
          rating: avgRating
        };
      });
      
      return NextResponse.json({
        success: true,
        models: combinedData
      });
      
    } catch (dbError: any) {
      console.error("Database error:", dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }
    
  } catch (error: any) {
    console.error("Error in user models API:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred fetching model data" },
      { status: 500 }
    );
  }
};

export { dynamic }; 