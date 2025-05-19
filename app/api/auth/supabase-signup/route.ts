import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// This is a standard serverless function, not an Edge function
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    // Initialize Supabase admin client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Parse request body
    const body = await request.json();
    const { email, password, firstName, lastName, username, display_name } = body;
    
    // Validate required fields
    if (!email || !password || !firstName || !username) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create user with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName || '',
          username,
          display_name: display_name || `${firstName} ${lastName || ''}`.trim(),
          profileComplete: false
        }
      }
    });
    
    if (error) {
      console.error('Supabase signup error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    // Return user data
    return NextResponse.json({
      user: {
        id: data.user?.id,
        email: data.user?.email,
        firstName,
        lastName,
        username,
        display_name: display_name || `${firstName} ${lastName || ''}`.trim()
      }
    });
  } catch (error: any) {
    console.error('Server error during signup:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during signup' },
      { status: 500 }
    );
  }
} 