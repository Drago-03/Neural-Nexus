import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/lib/services/email-service';

// Add static export configuration at the top
export const dynamic = 'force-dynamic';

// Force Node.js runtime for this route
export const runtime = 'nodejs';

/**
 * Generate a newsletter confirmation email
 */
function generateNewsletterConfirmation(): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Newsletter Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #6200ea;">Welcome to Neural Nexus Newsletter!</h1>
      <p>Yooo! Thanks for subscribing to our lit newsletter! 🔥</p>
      <p>You'll be the first to know about our sick updates and drops!</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 0.9em; color: #666;">
        <p>To stop receiving these emails, <a href="https://neuralnexus.biz/unsubscribe" style="color: #6200ea;">unsubscribe here</a>.</p>
      </div>
    </body>
    </html>
  `;
}

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