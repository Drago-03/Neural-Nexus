import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/lib/services/email-service';

// Add static export configuration
export const dynamic = 'force-dynamic';

// Force Node.js runtime for this route
export const runtime = 'nodejs';

/**
 * GET handler for /api/email/status
 * Checks the status of the email service
 */
export async function GET(req: NextRequest) {
  try {
    // Check email service connection
    const isConnected = await EmailService.verifyConnection();
    
    // Get current status
    const status = EmailService.getStatus();
    
    return NextResponse.json({
      status: isConnected ? 'connected' : 'disconnected',
      transportType: status.transportType,
      initialized: status.initialized,
      error: status.error,
      diagnostics: status.diagnostics,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error checking email status:', error);
    
    return NextResponse.json({
      status: 'error',
      error: error.message || 'Unknown error checking email status',
      timestamp: new Date().toISOString()
    }, {
      status: 500
    });
  }
} 