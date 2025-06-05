import { createClient } from '@supabase/supabase-js';

// Initialize admin Supabase client for database setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Create database setup function
export async function setupSupabaseDatabase() {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials for admin operations');
    return { success: false, error: 'Missing Supabase credentials' };
  }
  
  // Create admin client with service role key
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  
  try {
    console.log('🔥 Setting up Supabase database tables...');
    
    // Create user_profiles table if it doesn't exist
    const { error: userProfilesError } = await supabase.rpc('create_table_if_not_exists', {
      table_name: 'user_profiles',
      table_definition: `
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        first_name TEXT,
        last_name TEXT,
        display_name TEXT,
        email TEXT,
        bio TEXT,
        avatar_url TEXT,
        website TEXT,
        social_links JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      `
    });
    
    if (userProfilesError) {
      console.error('Error creating user_profiles table:', userProfilesError);
      
      // Try alternative approach with direct SQL
      const { error: sqlError } = await supabase.from('user_profiles').select('count(*)').limit(1);
      
      if (sqlError && sqlError.code === '42P01') { // Table doesn't exist
        // Create table with raw SQL query
        const { error: createError } = await supabase.rpc('exec_sql', {
          sql: `
            CREATE TABLE IF NOT EXISTS public.user_profiles (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              user_id UUID NOT NULL,
              first_name TEXT,
              last_name TEXT,
              display_name TEXT,
              email TEXT,
              bio TEXT,
              avatar_url TEXT,
              website TEXT,
              social_links JSONB,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
            );
            
            -- Add index on user_id
            CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
          `
        });
        
        if (createError) {
          console.error('Error with direct SQL creation:', createError);
          return { success: false, error: createError };
        }
      }
    }
    
    // Create models table if it doesn't exist
    const { error: modelsError } = await supabase.rpc('create_table_if_not_exists', {
      table_name: 'models',
      table_definition: `
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) DEFAULT 0,
        category TEXT,
        tags TEXT[],
        file_url TEXT,
        file_path TEXT,
        file_size BIGINT,
        file_type TEXT,
        thumbnail_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        downloads INTEGER DEFAULT 0,
        rating DECIMAL(3, 2) DEFAULT 0,
        is_public BOOLEAN DEFAULT true,
        status TEXT DEFAULT 'active'
      `
    });
    
    if (modelsError) {
      console.error('Error creating models table:', modelsError);
    }
    
    // Set up Row Level Security (RLS) policies
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Enable RLS on tables
        ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;
        
        -- User profiles policies
        CREATE POLICY IF NOT EXISTS "Public profiles are viewable by everyone" 
          ON public.user_profiles FOR SELECT USING (true);
          
        CREATE POLICY IF NOT EXISTS "Users can update their own profile" 
          ON public.user_profiles FOR UPDATE USING (auth.uid() = user_id);
          
        CREATE POLICY IF NOT EXISTS "Users can insert their own profile" 
          ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
          
        -- Models policies
        CREATE POLICY IF NOT EXISTS "Public models are viewable by everyone" 
          ON public.models FOR SELECT USING (is_public = true OR auth.uid() = user_id);
          
        CREATE POLICY IF NOT EXISTS "Users can update their own models" 
          ON public.models FOR UPDATE USING (auth.uid() = user_id);
          
        CREATE POLICY IF NOT EXISTS "Users can insert their own models" 
          ON public.models FOR INSERT WITH CHECK (auth.uid() = user_id);
          
        CREATE POLICY IF NOT EXISTS "Users can delete their own models" 
          ON public.models FOR DELETE USING (auth.uid() = user_id);
      `
    });
    
    if (rlsError) {
      console.error('Error setting up RLS policies:', rlsError);
    }
    
    console.log('✅ Database setup completed successfully!');
    return { success: true };
    
  } catch (error) {
    console.error('Database setup error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown database setup error' 
    };
  }
}

// Function to create stored procedures for common operations
export async function setupStoredProcedures() {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials for admin operations');
    return { success: false, error: 'Missing Supabase credentials' };
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    console.log('🔥 Setting up stored procedures...');
    
    // Create function to check if a table exists
    const { error: checkTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION check_table_exists(table_name TEXT)
        RETURNS BOOLEAN
        LANGUAGE plpgsql
        AS $$
        DECLARE
          table_exists BOOLEAN;
        BEGIN
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = $1
          ) INTO table_exists;
          
          RETURN table_exists;
        END;
        $$;
      `
    });
    
    if (checkTableError) {
      console.error('Error creating check_table_exists function:', checkTableError);
    }
    
    // Create function to execute SQL
    const { error: execSqlError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION exec_sql(sql TEXT)
        RETURNS VOID
        LANGUAGE plpgsql
        AS $$
        BEGIN
          EXECUTE sql;
        END;
        $$;
      `
    });
    
    if (execSqlError) {
      console.error('Error creating exec_sql function:', execSqlError);
    }
    
    // Create function to create a table if it doesn't exist
    const { error: createTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION create_table_if_not_exists(
          table_name TEXT,
          table_definition TEXT
        )
        RETURNS VOID
        LANGUAGE plpgsql
        AS $$
        DECLARE
          table_exists BOOLEAN;
        BEGIN
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = $1
          ) INTO table_exists;
          
          IF NOT table_exists THEN
            EXECUTE 'CREATE TABLE public.' || quote_ident($1) || ' (' || $2 || ')';
          END IF;
        END;
        $$;
      `
    });
    
    if (createTableError) {
      console.error('Error creating create_table_if_not_exists function:', createTableError);
    }
    
    console.log('✅ Stored procedures setup completed successfully!');
    return { success: true };
    
  } catch (error) {
    console.error('Stored procedures setup error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown stored procedures setup error' 
    };
  }
}

/**
 * Creates a Supabase RPC function to count users
 * This is used by the platform-stats API
 */
export async function createUserCountFunction() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error("Missing Supabase credentials for RPC function setup");
      return;
    }
    
    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceRoleKey,
      { auth: { persistSession: false } }
    );
    
    // SQL to create the function - this will be executed on the database
    const { error } = await supabaseAdmin.rpc('create_user_count_function', {
      function_definition: `
        CREATE OR REPLACE FUNCTION get_user_count()
        RETURNS integer
        LANGUAGE sql
        SECURITY DEFINER
        AS $$
          SELECT COUNT(*) FROM auth.users;
        $$;
      `
    });
    
    if (error) {
      console.error("Error creating user count function:", error);
    } else {
      console.log("Successfully created get_user_count function");
    }
  } catch (error) {
    console.error("Failed to create user count function:", error);
  }
} 