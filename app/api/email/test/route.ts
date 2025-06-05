import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Add static export configuration at the top
export const dynamic = 'force-dynamic';

// Force Node.js runtime for this route
export const runtime = 'nodejs';

/**
 * Generate a simple test email HTML
 */
function generateTestEmail(): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Test Email</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #6200ea;">Neural Nexus Test Email</h1>
      <p>Yo! This is just a test email from Neural Nexus!</p>
      <p>If you're seeing this, our email system is vibin' correctly!</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 0.9em; color: #666;">
        <p>This is an automated message - please don't reply to this email.</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Helper function to send a test email directly
 */
async function sendTestEmail(to: string): Promise<{
  success: boolean;
  transportType: string;
  timeTaken: number;
  error?: string;
}> {
  const startTime = Date.now();
  
  try {
    // Check if we have SMTP credentials
    const host = process.env.EMAIL_SERVER_HOST;
    const user = process.env.EMAIL_SERVER_USER;
    const pass = process.env.EMAIL_SERVER_PASSWORD || process.env.SENDGRID_API_KEY;
    const from = process.env.EMAIL_FROM || 'noreply@neural-nexus.com';
    
    // Generate email HTML using our template
    const emailHtml = generateTestEmail();
    
    // Determine if we're using SMTP or local transport
    const useLocalTransport = process.env.NODE_ENV === 'development' && !process.env.FORCE_EMAIL_SEND;
    const transportType = useLocalTransport ? 'local' : 'smtp';
    
    if (!host || !user || !pass) {
      // Use local transport for development
      console.log('📧 Email would be sent with the following details:');
      console.log(`To: ${to}`);
      console.log(`From: ${from}`);
      console.log(`Subject: 🧪 Neural Nexus Email Test`);
      console.log('Body: Test email with template');
      console.warn('⚠️ No email transport configured');
      
      // Simulate delay for local transport
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return {
        success: true,
        transportType: 'local',
        timeTaken: Date.now() - startTime
      };
    }
    
    if (useLocalTransport) {
      // Log the email instead of sending it
      console.log('📧 LOCAL EMAIL TRANSPORT:');
      console.log('------------------------');
      console.log('To:', to);
      console.log('From:', from);
      console.log('Subject: 🧪 Neural Nexus Email Test');
      console.log('Using template: Test Email');
      console.log('------------------------');
      
      return {
        success: true,
        transportType: 'local',
        timeTaken: Date.now() - startTime
      };
    }
    
    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: host,
      port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
      secure: (process.env.EMAIL_SERVER_PORT || '587') === '465',
      auth: {
        user: user,
        pass: pass
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000
    });
    
    // Send email
    const info = await transporter.sendMail({
      from: from,
      to: to,
      subject: '🧪 Neural Nexus Email Test',
      html: emailHtml
    });
    
    console.log(`Email sent to ${to} (Message ID: ${info.messageId})`);
    
    return {
      success: true,
      transportType: 'smtp',
      timeTaken: Date.now() - startTime
    };
  } catch (error: any) {
    console.error('Error sending test email:', error);
    
    return {
      success: false,
      transportType: 'unknown',
      timeTaken: Date.now() - startTime,
      error: error.message || 'Unknown error'
    };
  }
}

/**
 * POST handler for /api/email/test
 * Tests sending an email using SendGrid
 */
export async function POST(req: NextRequest) {
  try {
    // Get email from request body
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Missing email address in request body' },
        { status: 400 }
      );
    }
    
    console.log(`Testing email service by sending to: ${email}`);
    
    // Send a test email directly
    const result = await sendTestEmail(email);
    
    if (!result.success) {
      return NextResponse.json(
        { 
          error: 'Failed to send test email',
          details: result.error,
          transportType: result.transportType
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: `Test email sent to ${email} successfully!`,
      transportType: result.transportType,
      timeTaken: `${result.timeTaken}ms`
    });
    
  } catch (error: any) {
    console.error('Error sending test email:', error);
    
    return NextResponse.json({
      error: `Failed to send test email: ${error.message || 'Unknown error'}`,
      success: false,
      timestamp: new Date().toISOString()
    }, {
      status: 500
    });
  }
} 