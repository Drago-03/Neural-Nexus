import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - You must be logged in to make a purchase' },
        { status: 401 }
      );
    }
    
    // Get user ID and email
    const userId = session.user.id;
    const userEmail = session.user.email || undefined;
    
    // Get Coinbase API key from environment variables
    const coinbaseApiKey = process.env.NEXT_PUBLIC_COINBASE_API_KEY;
    
    if (!coinbaseApiKey) {
      console.error('Coinbase API key not configured');
      return NextResponse.json(
        { error: 'Payment method not available' },
        { status: 500 }
      );
    }
    
    // Parse request body
    const { 
      name, 
      description, 
      local_price, 
      metadata = {}, 
      redirect_url, 
      cancel_url 
    } = await req.json();
    
    // Validate required parameters
    if (!name || !description || !local_price) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Prepare checkout data for Coinbase API
    const checkoutData = {
      name,
      description,
      pricing_type: 'fixed_price',
      local_price,
      metadata: {
        ...metadata,
        userId,
        timestamp: new Date().toISOString()
      },
      redirect_url,
      cancel_url,
      // Add the user's email if available
      ...(userEmail && { customer_email: userEmail })
    };
    
    // Create checkout via Coinbase Commerce API
    const response = await fetch('https://api.commerce.coinbase.com/charges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CC-Api-Key': coinbaseApiKey,
        'X-CC-Version': '2018-03-22'
      },
      body: JSON.stringify({ 
        charge: checkoutData
      })
    });
    
    // Parse response
    const data = await response.json();
    
    // Check for errors
    if (!response.ok) {
      console.error('Coinbase API error:', data);
      return NextResponse.json(
        { error: data.error?.message || 'Failed to create checkout' },
        { status: response.status }
      );
    }
    
    // Log the checkout attempt
    console.log(`Coinbase checkout created for user ${userId}`);
    
    // Store checkout information in your database for tracking
    try {
      // This would be implemented in a real application to store the checkout in your database
      /*
      await db.coinbaseCheckouts.create({
        chargeId: data.data.id,
        userId,
        modelId: metadata.modelId,
        amount: local_price.amount,
        currency: local_price.currency,
        status: 'created',
        createdAt: new Date()
      });
      */
    } catch (logError) {
      console.error('Error logging Coinbase checkout:', logError);
      // Continue anyway as the checkout was created successfully
    }
    
    // Return checkout data
    return NextResponse.json({
      code: data.data.code,
      hosted_url: data.data.hosted_url,
      charge_id: data.data.id,
      expires_at: data.data.expires_at
    });
  } catch (error: any) {
    console.error('Error creating Coinbase checkout:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to create Coinbase checkout',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 