import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://gtqeeihydjqvidqleawe.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0cWVlaWh5ZGpxdmlkcWxlYXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDYwNTk5NTQsImV4cCI6MjAyMTYzNTk1NH0.SSUgWgNpaxwRGkbhxVCZtomk_M7jaesZ_tLCzYVn8jg";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true 
  }
});

export default supabase;

// Type definitions for user metadata to improve TypeScript support
export interface UserMetadata {
  first_name?: string;
  last_name?: string;
  username?: string;
  display_name?: string;
  profileComplete?: boolean;
  [key: string]: any;
} 