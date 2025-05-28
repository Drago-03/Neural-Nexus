import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { getCollection } from "@/lib/mongodb";
import { dynamic, runtime, maxDuration } from "../config";

// Export config from app/api/config.ts
export { dynamic, runtime, maxDuration };

// Fallback data for build time
const FALLBACK_DATA = {
  activeUsers: 100,
  monthlyGrowth: 40,
  models: 50,
  countries: 15,
  apiCalls: 0,
  lastUpdated: new Date().toISOString()
};

/**
 * API endpoint to get global platform statistics
 * GET /api/platform-stats
 */
export async function GET() {
  try {
    // Check if we're in a build environment
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      console.log('Using fallback platform stats data during build');
      return NextResponse.json(FALLBACK_DATA);
    }
    
    // Default fallback values in case of errors
    let stats = {
      activeUsers: 0,
      monthlyGrowth: 40, // Keep this at 40% as requested
      models: 0, 
      countries: 15, // Keep this at 15+ as requested
      apiCalls: 0,
      lastUpdated: new Date().toISOString()
    };

    // Get active users count from Supabase
    try {
      const { count: userCount, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });
      
      if (!error && userCount !== null) {
        stats.activeUsers = userCount;
        console.log("✅ Fetched user count from Supabase:", userCount);
      } else if (error) {
        console.error("❌ Error fetching users from Supabase:", error);
        stats.activeUsers = 100; // Fallback to a reasonable number
      }
    } catch (error) {
      console.error("❌ Exception in Supabase user count:", error);
      stats.activeUsers = 100; // Fallback to a reasonable number
    }

    // Connect to MongoDB for other stats
    try {
      // Get models count
      const modelsCollection = await getCollection('models');
      const modelsCount = await modelsCollection.countDocuments();
      stats.models = modelsCount || 50; // Fallback if count is 0
      
      // Get API calls count
      const apiCallsCollection = await getCollection('api_calls');
      const apiCallsCount = await apiCallsCollection.countDocuments();
      stats.apiCalls = apiCallsCount || 0; // Fallback if count is 0
      
      console.log("✅ Fetched MongoDB stats:", { 
        models: stats.models, 
        apiCalls: stats.apiCalls 
      });
    } catch (error) {
      console.error("❌ Error connecting to MongoDB or fetching stats:", error);
      // Keep the fallback values
      stats.models = 50;
      stats.apiCalls = 0;
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error("❌ Unexpected error in platform stats API:", error);
    
    // Return fallback data in case of any error
    return NextResponse.json(FALLBACK_DATA);
  }
} 