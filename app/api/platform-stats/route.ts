import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { dynamic, runtime, maxDuration } from "../config";
import { createClient } from "@supabase/supabase-js";

// Export config from app/api/config.ts
export { dynamic, runtime, maxDuration };

// More conservative fallback data for development
const FALLBACK_DATA = {
  activeUsers: 5, // Small default for registered users
  monthlyGrowth: 40, // Keep this fixed at 40% as it's a marketing value
  models: 3,
  countries: 1,
  apiCalls: 100,
  lastUpdated: new Date().toISOString()
};

/**
 * API endpoint to get global platform statistics
 * GET /api/platform-stats
 */
export async function GET() {
  try {
    console.log("🚀 Platform stats API called");
    
    // Check if we're in a build environment
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      console.log('Using fallback platform stats data during build');
      return NextResponse.json(FALLBACK_DATA);
    }
    
    // Initialize stats with default values - will replace with real data where possible
    let stats = {
      activeUsers: 5, // Default for registered users count
      monthlyGrowth: 40, // Fixed marketing number
      models: 3,
      countries: 1,
      apiCalls: 100,
      lastUpdated: new Date().toISOString()
    };

    // Create a Supabase admin client with service role key for auth access
    // Using direct environment variables to avoid any issues with imports
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    
    console.log("🔑 Creating Supabase admin client with service role key");
    console.log(`🔍 Supabase URL available: ${!!supabaseUrl}`);
    console.log(`🔍 Service role key available: ${!!supabaseServiceRoleKey}`);
    
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error("❌ Missing Supabase URL or service role key");
      return NextResponse.json(FALLBACK_DATA);
    }

    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceRoleKey,
      { 
        auth: { persistSession: false },
        global: { headers: { 'x-my-custom-header': 'platform-stats-api' } }
      }
    );

    // Get registered users count directly from Supabase
    try {
      console.log("🔄 Fetching registered users count from Supabase...");
      
      // First try: using the from() method to query auth.users
      let { count, error } = await supabaseAdmin
        .from('auth.users')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error("❌ Error with auth.users query:", error.message);
        
        // Second try: using a direct SQL query to count users
        const { data, error: sqlError } = await supabaseAdmin.rpc(
          'get_user_count',
          {}
        );
        
        if (!sqlError && data !== null) {
          stats.activeUsers = data;
          console.log("✅ Got user count from RPC function:", data);
        } else {
          console.error("❌ RPC function error:", sqlError?.message);
          
          // Third try: direct admin API method
          try {
            const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();
            
            if (!authError && authData?.users) {
              stats.activeUsers = authData.users.length;
              console.log("✅ Got users via admin API:", authData.users.length);
            } else {
              console.error("❌ Admin API error:", authError?.message);
              console.log("⚠️ Using default user count:", stats.activeUsers);
            }
          } catch (adminErr) {
            console.error("❌ Admin API exception:", adminErr);
          }
        }
      } else if (count !== null) {
        stats.activeUsers = count;
        console.log("✅ Got user count from auth.users:", count);
      }
    } catch (error) {
      console.error("❌ Exception fetching users:", error);
    }

    // Connect to MongoDB for other stats
    try {
      console.log("🔄 Connecting to MongoDB for stats...");
      
      // Get models count
      const modelsCollection = await getCollection('models');
      const modelsCount = await modelsCollection.countDocuments();
      if (modelsCount > 0) {
        stats.models = modelsCount;
        console.log("✅ Models count:", modelsCount);
      }
      
      // Get API calls count
      const apiCallsCollection = await getCollection('api_calls');
      const apiCallsCount = await apiCallsCollection.countDocuments();
      if (apiCallsCount > 0) {
        stats.apiCalls = apiCallsCount;
        console.log("✅ API calls count:", apiCallsCount);
      }
      
      // Get country count from user locations
      try {
        const usersCollection = await getCollection('users');
        const countryResult = await usersCollection.aggregate([
          { $match: { "location.country": { $exists: true, $ne: null } } },
          { $group: { _id: "$location.country" } },
          { $count: "total" }
        ]).toArray();
        
        if (countryResult.length > 0) {
          stats.countries = countryResult[0].total;
          console.log("✅ Countries count:", stats.countries);
        } else {
          console.log("⚠️ No countries found in database, using default value");
        }
      } catch (error) {
        console.error("❌ Error fetching country stats:", error);
      }
    } catch (error) {
      console.error("❌ Error connecting to MongoDB or fetching stats:", error);
    }

    console.log("🏁 Final stats:", stats);
    return NextResponse.json(stats);
  } catch (error) {
    console.error("❌ Unexpected error in platform stats API:", error);
    return NextResponse.json(FALLBACK_DATA);
  }
} 