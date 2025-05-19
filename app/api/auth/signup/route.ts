import { NextRequest, NextResponse } from 'next/server';

// This is a super lightweight handler for Edge Functions (under 1MB)
export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const { firstName, lastName, email, password, displayName } = await req.json();
    
    // Validate required fields
    if (!firstName || !email || !password) {
      return NextResponse.json({ 
        success: false,
        message: 'First name, email, and password are required' 
      }, { status: 400 });
    }
    
    // Return success - actual signup happens client-side via Supabase SDK
    // This avoids Edge Function size limits by not including heavy auth libraries
    return NextResponse.json({
      success: true,
      message: 'Signup request validated',
      user: {
        email,
        firstName, 
        lastName: lastName || '',
        displayName: displayName || (lastName ? `${firstName} ${lastName}` : firstName),
      }
    });
    
  } catch (error: any) {
    console.error('Error during signup validation:', error);
    return NextResponse.json({ 
      success: false,
      message: 'An error occurred during signup validation', 
      error: error.message 
    }, { status: 500 });
  }
} 