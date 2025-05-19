import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// This route handles the OAuth callback from providers like GitHub and Google
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  // If code is not available, it's not a valid OAuth callback
  if (!code) {
    return NextResponse.redirect(`${requestUrl.origin}/auth-error?error=missing_code`);
  }
  
  try {
    // Initialize the Supabase client using server components
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );
    
    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Error exchanging code for session:', error);
      return NextResponse.redirect(`${requestUrl.origin}/auth-error?error=${error.message}`);
    }
    
    // Successful authentication, redirect to dashboard
    return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
  } catch (error) {
    console.error('Unexpected error during OAuth callback:', error);
    return NextResponse.redirect(`${requestUrl.origin}/auth-error?error=server_error`);
  }
} 