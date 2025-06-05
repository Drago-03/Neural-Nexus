import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Add static export configuration
export const dynamic = 'force-dynamic';

// Force Node.js runtime for this route
export const runtime = 'nodejs';

// Email service status interface
interface EmailServiceStatus {
  initialized: boolean;
  transportType: 'smtp' | 'local' | 'none';
  error: string | null;
}

/**
 * Helper function to check SMTP connection directly
 */
async function checkSMTPConnection(): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    // Check if we have SMTP credentials
    const host = process.env.EMAIL_SERVER_HOST;
    const user = process.env.EMAIL_SERVER_USER;
    const pass = process.env.EMAIL_SERVER_PASSWORD || process.env.SENDGRID_API_KEY;
    
    if (!host || !user || !pass) {
      return {
        success: false,
        error: 'Missing SMTP configuration'
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
    
    // Verify connection
    await transporter.verify();
    
    return {
      success: true,
      error: null
    };
  } catch (error: any) {
    console.error('SMTP verification failed:', error);
    
    return {
      success: false,
      error: error.message || 'Unknown error'
    };
  }
}

/**
 * Helper function to get email service status
 */
function getEmailServiceStatus(): EmailServiceStatus {
  // Check if we have SMTP credentials
  const host = process.env.EMAIL_SERVER_HOST;
  const user = process.env.EMAIL_SERVER_USER;
  const pass = process.env.EMAIL_SERVER_PASSWORD || process.env.SENDGRID_API_KEY;
  
  // Determine transport type
  let transportType: 'smtp' | 'local' | 'none' = 'none';
  
  if (process.env.NODE_ENV === 'development' && !process.env.FORCE_EMAIL_SEND) {
    transportType = 'local';
  } else if (host && user && pass) {
    transportType = 'smtp';
  }
  
  return {
    initialized: !!host && !!user && !!pass,
    transportType,
    error: null
  };
}

/**
 * GET handler for /api/email/status
 * Returns the current status of the email service
 */
export async function GET() {
  try {
    // Check environment variables
    const envStatus = {
      EMAIL_SERVER_HOST: !!process.env.EMAIL_SERVER_HOST,
      EMAIL_SERVER_PORT: !!process.env.EMAIL_SERVER_PORT,
      EMAIL_SERVER_USER: !!process.env.EMAIL_SERVER_USER,
      EMAIL_SERVER_PASSWORD: !!process.env.EMAIL_SERVER_PASSWORD || !!process.env.SENDGRID_API_KEY,
      EMAIL_FROM: !!process.env.EMAIL_FROM
    };
    
    // Get email service status
    const serviceStatus = getEmailServiceStatus();
    
    return NextResponse.json({
      status: serviceStatus,
      environment: envStatus,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('Error checking email status:', error);
    
    return NextResponse.json({
      error: `Failed to check email status: ${error.message || 'Unknown error'}`,
      timestamp: new Date().toISOString()
    }, {
      status: 500
    });
  }
}

/**
 * POST handler for /api/email/status
 * Verifies the SMTP connection and returns the status
 */
export async function POST() {
  try {
    // Check SMTP connection
    const connectionStatus = await checkSMTPConnection();
    
    // Get email service status
    const serviceStatus = getEmailServiceStatus();
    
    // Update service status with connection error if any
    if (!connectionStatus.success) {
      serviceStatus.error = connectionStatus.error;
    }
    
    return NextResponse.json({
      connection: connectionStatus,
      status: serviceStatus,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('Error verifying email service:', error);
    
    return NextResponse.json({
      error: `Failed to verify email service: ${error.message || 'Unknown error'}`,
      timestamp: new Date().toISOString()
    }, {
      status: 500
    });
  }
} 