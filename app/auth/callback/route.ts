import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const callbackUrl = requestUrl.searchParams.get('callbackUrl') || '/dashboard';
  
  // If no code is available, redirect to error page
  if (!code) {
    return NextResponse.redirect(`${requestUrl.origin}/auth-error?error=missing_code`);
  }
  
  try {
    // Create a Supabase client for the Route Handler
    const supabase = createRouteHandlerClient({ cookies });
    
    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Error exchanging code for session:', error);
      return NextResponse.redirect(`${requestUrl.origin}/auth-error?error=${encodeURIComponent(error.message)}`);
    }
    
    // Successful authentication, redirect to the success page with the callback URL
    return NextResponse.redirect(`${requestUrl.origin}/auth/callback-success?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  } catch (error: any) {
    console.error('Unexpected error in OAuth callback:', error);
    return NextResponse.redirect(
      `${requestUrl.origin}/auth-error?error=${encodeURIComponent(error?.message || 'server_error')}`
    );
  }
} 