import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// This is a standard serverless function
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    // Get Supabase credentials
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        success: false,
        message: 'Server configuration error'
      }, { status: 500 });
    }
    
    // Initialize Supabase admin client
    const supabase = createClient(
      supabaseUrl,
      supabaseServiceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
      }
    );
    
    // Generate random anonymous user details
    const anonymousId = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const anonymousEmail = `${anonymousId}@example.com`;
    const anonymousPassword = `pw_${Math.random().toString(36).substring(2, 15)}`;
    const displayName = `Guest_${Math.random().toString(36).substring(2, 7)}`;
    
    // Create an anonymous user
    const { data, error } = await supabase.auth.admin.createUser({
      email: anonymousEmail,
      password: anonymousPassword,
      email_confirm: true,
      user_metadata: {
        is_anonymous: true,
        display_name: displayName
      }
    });
    
    if (error) {
      console.error('Error creating anonymous user:', error);
      return NextResponse.json({
        success: false,
        message: error.message
      }, { status: 500 });
    }
    
    // Create a sign-in session for the anonymous user
    const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
      email: anonymousEmail,
      password: anonymousPassword
    });
    
    if (sessionError) {
      console.error('Error creating session for anonymous user:', sessionError);
      return NextResponse.json({
        success: false,
        message: sessionError.message
      }, { status: 500 });
    }
    
    // Create a user profile for the anonymous user
    try {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: data.user.id,
          display_name: displayName,
          email: anonymousEmail,
          created_at: new Date().toISOString()
        });
      
      if (profileError) {
        console.error('Error creating profile for anonymous user:', profileError);
        // Continue anyway as the user was created
      }
    } catch (profileError) {
      console.error('Error with profile creation:', profileError);
      // Continue since the user was created successfully
    }
    
    // Return the session data to client
    return NextResponse.json({
      success: true,
      session: sessionData.session,
      user: {
        id: data.user.id,
        email: data.user.email,
        isAnonymous: true,
        displayName
      }
    });
    
  } catch (error: any) {
    console.error('Error during anonymous sign-in:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'An error occurred during anonymous sign-in'
    }, { status: 500 });
  }
} 