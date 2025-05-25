import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export function createClient(cookieStore = cookies()) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }

  // Get the auth token from cookies, if it exists
  const authToken = cookieStore.get('supabase-auth-token')?.value;
  
  // Headers object with conditional auth token
  const headers: Record<string, string> = {};
  if (authToken) {
    headers['x-supabase-auth-token'] = authToken;
  }

  return createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers
    },
  });
} 