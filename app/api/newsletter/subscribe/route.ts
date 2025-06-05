import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/lib/services/email-service';
import { generateNewsletterConfirmation } from '@/lib/templates/email-template';

// Add static export configuration at the top
export const dynamic = 'force-dynamic';

// Force Node.js runtime for this route
export const runtime = 'nodejs';

/**
 * POST handler for /api/newsletter/subscribe
 * Subscribes a user to the newsletter
 */
export async function POST(req: NextRequest) {
  try {
    // Get email from request body
    const { email, name = 'Awesome User' } = await req.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Missing email address in request body' },
        { status: 400 }
      );
    }
    
    console.log(`Subscribing ${email} to newsletter`);
    
    // In a real app, you would store this email in a database
    // For now, we'll just send a welcome email
    
    // Generate the email HTML using our template
    const emailHtml = generateNewsletterConfirmation();
    
    // Send welcome email
    const emailSent = await EmailService.yeetEmail({
      to: email,
      subject: '🔥 Welcome to the Neural Nexus Newsletter!',
      html: emailHtml
    });
    
    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send welcome email' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: `Successfully subscribed ${email} to the newsletter!`
    });
    
  } catch (error: any) {
    console.error('Error subscribing to newsletter:', error);
    
    return NextResponse.json({
      error: `Failed to subscribe to newsletter: ${error.message || 'Unknown error'}`,
      success: false
    }, {
      status: 500
    });
  }
} 