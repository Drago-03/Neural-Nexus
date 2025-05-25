import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Stripe from 'stripe';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

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
    
    // Get user ID
    const userId = session.user.id;
    
    // Parse request body
    const { modelId, modelName, price, currency = 'USD' } = await req.json();
    
    // Validate required parameters
    if (!modelId || !modelName || !price) {
      return NextResponse.json(
        { error: 'Missing required parameters: modelId, modelName, or price' },
        { status: 400 }
      );
    }
    
    // Calculate the price in cents (Stripe requires the amount in smallest currency unit)
    const amount = Math.round(price * 100);
    
    // Create a checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: modelName,
              description: `License for AI model: ${modelName}`,
              metadata: {
                modelId,
              },
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/models/${modelId}?cancelled=true`,
      metadata: {
        modelId,
        userId,
        timestamp: new Date().toISOString(),
      },
      customer_email: session.user.email || undefined,
    });
    
    // Log the checkout attempt
    console.log(`Checkout session created for model ${modelId} by user ${userId}`);
    
    // Store the checkout session in database for tracking
    try {
      // Record the checkout session in your database
      await stripe.checkout.sessions.retrieve(checkoutSession.id);
      
      // In a real application, you would store this in your database:
      /*
      await db.checkoutSessions.create({
        sessionId: checkoutSession.id,
        userId,
        modelId,
        amount,
        currency,
        status: 'created',
        createdAt: new Date()
      });
      */
    } catch (logError) {
      console.error('Error logging checkout session:', logError);
      // Continue anyway as the checkout was created successfully
    }
    
    // Return the checkout session URL
    return NextResponse.json({
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
    });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        details: error.message
      },
      { status: 500 }
    );
  }
} 