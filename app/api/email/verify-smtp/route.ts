import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/lib/services/email-service';
import nodemailer from 'nodemailer';

// Add static export configuration at the top
export const dynamic = 'force-dynamic';

// Force Node.js runtime for this route
export const runtime = 'nodejs';

/**
 * Helper function to verify SMTP connection directly
 */
async function verifySmtpConfig() {
  try {
    const host = process.env.EMAIL_SERVER_HOST || process.env.SENDGRID_HOST || 'smtp.sendgrid.net';
    const port = parseInt(process.env.EMAIL_SERVER_PORT || process.env.SENDGRID_PORT || '587');
    const user = process.env.EMAIL_SERVER_USER || process.env.SENDGRID_USER || 'apikey';
    const pass = process.env.EMAIL_SERVER_PASSWORD || process.env.SENDGRID_API_KEY;
    
    if (!pass) {
      return {
        success: false,
        error: 'Missing SMTP API key/password'
      };
    }
    
    console.log(`Testing SMTP connection to ${host}:${port} with user ${user}`);
    
    // Create a direct transporter
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000
    });
    
    // Verify connection
    await transporter.verify();
    
    return {
      success: true,
      config: {
        host,
        port,
        user: user ? '****' : 'not set',
        pass: pass ? '****' : 'not set',
        from: process.env.EMAIL_FROM || 'not set'
      }
    };
  } catch (error: any) {
    console.error('SMTP verification failed:', error);
    
    return {
      success: false,
      error: error.message,
      name: error.name,
      code: error.code
    };
  }
}

/**
 * POST handler for /api/email/verify-smtp
 */
export async function POST(req: NextRequest) {
  try {
    // Get the test email address from the request
    const { email = 'test@example.com' } = await req.json();
    
    // First, directly verify the SMTP config
    const smtpCheck = await verifySmtpConfig();
    
    // If SMTP verification failed, return the error
    if (!smtpCheck.success) {
      return NextResponse.json({
        success: false,
        error: 'SMTP verification failed',
        details: smtpCheck,
        emailServiceStatus: EmailService.getStatus()
      });
    }
    
    // Now try to send a test email
    console.log(`Attempting to send test email to ${email}`);
    const emailSent = await EmailService.sendNewsletterWelcome(email);
    
    return NextResponse.json({
      success: emailSent,
      smtpCheck,
      emailServiceStatus: EmailService.getStatus(),
      message: emailSent 
        ? `Successfully sent test email to ${email}` 
        : `Failed to send test email to ${email}`
    });
    
  } catch (error: any) {
    console.error('Error verifying SMTP:', error);
    
    return NextResponse.json({
      success: false,
      error: `Failed to verify SMTP: ${error.message || 'Unknown error'}`,
      emailServiceStatus: EmailService.getStatus()
    }, {
      status: 500
    });
  }
} 