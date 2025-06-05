import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/lib/services/email-service';
import { UserService } from '@/lib/models/user';
import crypto from 'crypto';

// Add static export configuration at the top
export const dynamic = 'force-dynamic';

// Force Node.js runtime for this route
export const runtime = 'nodejs';

/**
 * POST handler for /api/auth/reset-password
 * Sends a password reset email to the user
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
    
    console.log(`Processing password reset request for: ${email}`);
    
    // Check if user exists
    const user = await UserService.getUserByEmail(email);
    
    if (!user) {
      // For security reasons, we still return success even if the email doesn't exist
      // This prevents email enumeration attacks
      return NextResponse.json({
        success: true,
        message: 'If this email exists in our system, a password reset link has been sent.'
      });
    }
    
    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Set expiration time to 1 hour from now
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + 1);
    
    // Store the reset token and expiration in the user record
    const userId = user._id ? user._id.toString() : '';
    await UserService.updateUser(userId, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: expirationTime,
      updatedAt: new Date()
    });
    
    // Generate reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
    
    // Send password reset email
    const emailSent = await EmailService.sendPasswordResetLink(email, resetUrl);
    
    if (!emailSent) {
      console.error(`Failed to send password reset email to ${email}`);
      return NextResponse.json(
        { error: 'Failed to send password reset email. Please try again later.' },
        { status: 500 }
      );
    }
    
    console.log(`Password reset email sent to: ${email}`);
    
    return NextResponse.json({
      success: true,
      message: 'Password reset link has been sent to your email address.'
    });
    
  } catch (error: any) {
    console.error('Error processing password reset:', error);
    
    return NextResponse.json({
      error: `Failed to process password reset: ${error.message || 'Unknown error'}`,
      success: false
    }, {
      status: 500
    });
  }
} 