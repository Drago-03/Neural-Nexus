import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get Coinbase API key from environment variables
    const coinbaseApiKey = process.env.NEXT_PUBLIC_COINBASE_API_KEY;
    
    if (!coinbaseApiKey) {
      console.error('Coinbase API key not configured');
      return NextResponse.json(
        { error: 'Payment method not available' },
        { status: 500 }
      );
    }
    
    // Get charge code from query parameters
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get('code');
    
    if (!code) {
      return NextResponse.json(
        { error: 'Missing charge code' },
        { status: 400 }
      );
    }
    
    // Fetch charge details from Coinbase Commerce API
    const response = await fetch(`https://api.commerce.coinbase.com/charges/${code}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-CC-Api-Key': coinbaseApiKey,
        'X-CC-Version': '2018-03-22'
      }
    });
    
    // Parse response
    const data = await response.json();
    
    // Check for errors
    if (!response.ok) {
      console.error('Coinbase API error:', data);
      return NextResponse.json(
        { error: data.error?.message || 'Failed to fetch charge details' },
        { status: response.status }
      );
    }
    
    // Extract payment status information
    const charge = data.data;
    const timeline = charge.timeline;
    const latestStatus = timeline[timeline.length - 1].status;
    
    // Determine payment status
    let status: 'new' | 'pending' | 'confirmed' | 'failed' | 'expired' | 'completed' = 'new';
    
    switch (latestStatus) {
      case 'NEW':
        status = 'new';
        break;
      case 'PENDING':
        status = 'pending';
        break;
      case 'COMPLETED':
        status = 'completed';
        break;
      case 'EXPIRED':
        status = 'expired';
        break;
      case 'CANCELED':
      case 'UNRESOLVED':
      case 'RESOLVED':
        status = 'failed';
        break;
      case 'CONFIRMED':
        // In Coinbase, confirmed means the blockchain transaction is confirmed
        // But the payment might still be pending final processing
        status = 'confirmed';
        break;
      default:
        status = 'new';
    }
    
    // If payment is completed or confirmed, update the purchase record in the database
    if (status === 'completed' || status === 'confirmed') {
      try {
        // This would be implemented in a real application to update the purchase record
        /*
        await db.coinbaseCheckouts.update(
          { status: status },
          { where: { chargeId: charge.id } }
        );
        
        // Also create a transaction record
        await db.transactions.create({
          userId: session.user.id,
          modelId: charge.metadata.modelId,
          amount: charge.pricing.local.amount,
          currency: charge.pricing.local.currency,
          paymentMethod: 'coinbase',
          transactionId: charge.id,
          status: status,
          createdAt: new Date()
        });
        */
        
        console.log(`Payment ${code} is ${status}`);
      } catch (dbError) {
        console.error('Error updating payment record:', dbError);
        // Continue anyway as we're just checking status
      }
    }
    
    // Return payment status
    return NextResponse.json({
      status,
      code: charge.code,
      pricing: charge.pricing,
      payments: charge.payments,
      timeline: charge.timeline,
      metadata: charge.metadata
    });
  } catch (error: any) {
    console.error('Error checking payment status:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to check payment status',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 