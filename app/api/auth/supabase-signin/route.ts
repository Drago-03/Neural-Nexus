import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// This is a standard serverless function, not an Edge function
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    // Get Supabase credentials from environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // Log key usage for debugging
    console.log('Supabase URL:', supabaseUrl?.substring(0, 15) + '...');
    console.log('Using service role key:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    console.log('Using anon key fallback:', !process.env.SUPABASE_SERVICE_ROLE_KEY && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials');
      return NextResponse.json({
        success: false,
        message: 'Server configuration error'
      }, { status: 500 });
    }
    
    // Initialize Supabase client
    const supabase = createClient(
      supabaseUrl,
      supabaseKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
      }
    );
    
    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error('Error parsing request body:', error);
      return NextResponse.json({
        success: false,
        message: 'Invalid request body'
      }, { status: 400 });
    }
    
    const { email, password } = body;
    
    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: 'Email and password are required'
      }, { status: 400 });
    }
    
    console.log('Attempting signin for email:', email);
    
    // Sign in with email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Supabase signin error:', error.message);
      
      return NextResponse.json({
        success: false,
        message: error.message || 'Invalid login credentials'
      }, { status: 401 });
    }
    
    if (!data.user || !data.session) {
      console.error('No user or session returned from Supabase');
      return NextResponse.json({
        success: false,
        message: 'Authentication failed'
      }, { status: 401 });
    }
    
    console.log('User authenticated successfully:', data.user.id);
    
    // Return session data to client
    return NextResponse.json({
      success: true,
      session: data.session,
      user: {
        id: data.user.id,
        email: data.user.email,
        user_metadata: data.user.user_metadata
      }
    });
    
  } catch (error: any) {
    console.error('Error during server-side signin:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'An error occurred during server-side signin'
    }, { status: 500 });
  }
} 