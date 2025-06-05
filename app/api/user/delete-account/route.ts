import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserService } from '@/lib/models/user';
import { closeMongoDBConnection } from '@/lib/mongodb';
import { EmailService } from '@/lib/services/email-service';
import crypto from 'crypto';

// Add static export configuration at the top
export const dynamic = 'force-dynamic';

// Force Node.js runtime for this route
export const runtime = 'nodejs';

/**
 * POST handler for /api/user/delete-account
 * Initiates the account deletion process by sending a confirmation email
 */
export async function POST(req: NextRequest) {
  try {
    console.log('POST /api/user/delete-account - Initiating account deletion process');
    
    // Get current user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.error("Account deletion initiation failed: No active session");
      return NextResponse.json(
        { error: 'Unauthorized - You must be logged in to delete your account' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    console.log(`Initiating account deletion for user: ${userId}`);
    
    // Fetch user data
    const userData = await UserService.getUserById(userId);
    
    if (!userData) {
      console.error(`Account deletion failed: User ${userId} not found in database`);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Generate a secure deletion token
    const deletionToken = crypto.randomBytes(32).toString('hex');
    
    // Set expiration time to 48 hours from now
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + 48);
    
    // Store the deletion token and expiration in the user record
    await UserService.updateUser(userId, {
      deletionToken,
      deletionTokenExpires: expirationTime,
    });
    
    // Generate confirmation URL
    const confirmationUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/account/confirm-deletion?token=${deletionToken}&userId=${userId}`;
    
    // Send email with confirmation link using SendGrid
    const emailSent = await EmailService.sendAccountDeletionConfirmation(
      userData.email,
      confirmationUrl
    );
    
    if (!emailSent) {
      console.error(`Failed to send deletion confirmation email to ${userData.email}`);
      return NextResponse.json(
        { error: 'Failed to send confirmation email. Please try again later.' },
        { status: 500 }
      );
    }
    
    console.log(`Deletion confirmation email sent to: ${userData.email}`);
    
    // Return success response with token info (for demo purposes)
    return NextResponse.json({
      success: true,
      message: 'Account deletion initiated. Please check your email for confirmation.',
      // Only include the token in development - in production this would only be sent via email
      devInfo: process.env.NODE_ENV === 'development' ? {
        confirmationUrl,
        token: deletionToken,
        expires: expirationTime
      } : undefined
    });
    
  } catch (error: any) {
    console.error('Error initiating account deletion:', error);
    
    return NextResponse.json({
      error: `Failed to initiate account deletion: ${error.message || 'Unknown error'}`,
      success: false
    }, {
      status: 500
    });
  }
}

/**
 * DELETE handler for /api/user/delete-account
 * Completes the account deletion process when a valid token is provided
 */
export async function DELETE(req: NextRequest) {
  try {
    console.log('DELETE /api/user/delete-account - Confirming account deletion');
    
    // Get token and userId from request URL
    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    const userId = url.searchParams.get('userId');
    
    if (!token || !userId) {
      console.error("Account deletion failed: Missing token or userId");
      return NextResponse.json(
        { error: 'Bad Request - Missing token or userId' },
        { status: 400 }
      );
    }
    
    console.log(`Confirming account deletion for user: ${userId} with token: ${token.substring(0, 8)}...`);
    
    // Find user with this token and verify it hasn't expired
    const userData = await UserService.getUserById(userId);
    
    if (!userData) {
      console.error(`Account deletion failed: User ${userId} not found in database`);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if token matches and hasn't expired
    if (userData.deletionToken !== token) {
      console.error(`Account deletion failed: Invalid token for user ${userId}`);
      return NextResponse.json(
        { error: 'Invalid deletion token' },
        { status: 400 }
      );
    }
    
    if (!userData.deletionTokenExpires || new Date(userData.deletionTokenExpires) < new Date()) {
      console.error(`Account deletion failed: Token expired for user ${userId}`);
      return NextResponse.json(
        { error: 'Deletion token has expired. Please restart the account deletion process.' },
        { status: 400 }
      );
    }
    
    // Process 1: Delete user data from MongoDB
    const deleted = await UserService.deleteUser(userId);
    
    if (!deleted) {
      console.error(`Failed to delete user data for ${userId} from MongoDB`);
      return NextResponse.json(
        { error: 'Failed to delete user data' },
        { status: 500 }
      );
    }
    
    console.log(`Successfully deleted user ${userId} from MongoDB`);
    
    // Process 2: Delete user from auth provider (NextAuth/Supabase)
    try {
      // This would normally call the auth provider's API to delete the user
      // For now, we're just simulating this step
      console.log(`Auth provider deletion would happen here for user ${userId}`);
      
      // In a real implementation, you'd do something like:
      // if (supabase) {
      //   await supabase.auth.admin.deleteUser(userId);
      // }
    } catch (authError) {
      console.error('Error deleting user from auth provider:', authError);
      // We continue even if this fails, as the MongoDB deletion was successful
    }
    
    // Process 3: Cleanup related data (models, API keys, etc.)
    try {
      // Delete user's models, API keys, and other related data
      // This would call other services to clean up user data
      console.log(`Cleanup of related data would happen here for user ${userId}`);
      
      // Example of what this might look like:
      // await ModelService.deleteUserModels(userId);
      // await ApiKeyService.deleteUserApiKeys(userId);
      // await ActivityService.deleteUserActivities(userId);
    } catch (cleanupError) {
      console.error('Error during related data cleanup:', cleanupError);
      // We continue even if this fails, as the main user deletion was successful
    }
    
    // Close MongoDB connection to ensure it doesn't hang
    await closeMongoDBConnection();
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Your account has been successfully deleted'
    });
    
  } catch (error: any) {
    console.error('Error completing account deletion:', error);
    
    // Ensure MongoDB connection is closed even on error
    await closeMongoDBConnection();
    
    return NextResponse.json({
      error: `Failed to complete account deletion: ${error.message || 'Unknown error'}`,
      success: false
    }, {
      status: 500
    });
  }
} 