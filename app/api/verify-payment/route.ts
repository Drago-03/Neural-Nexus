import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the session ID from query params
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Missing session_id parameter' 
      }, { status: 400 });
    }

    // Initialize Stripe
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      console.error('Stripe secret key not configured');
      return NextResponse.json({ 
        success: false, 
        message: 'Payment service not properly configured' 
      }, { status: 500 });
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16'
    });

    // Retrieve the checkout session
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'payment_intent']
    });

    // Check if the payment was successful
    const paymentStatus = checkoutSession.payment_status;
    if (paymentStatus !== 'paid') {
      return NextResponse.json({
        success: false,
        message: `Payment not completed. Status: ${paymentStatus}`,
        status: paymentStatus
      });
    }

    // Get metadata from the session
    const metadata = checkoutSession.metadata || {};
    const modelId = metadata.modelId;
    
    if (!modelId) {
      return NextResponse.json({
        success: true,
        message: 'Payment verified but no model ID found in metadata',
        session: {
          id: checkoutSession.id,
          amount_total: checkoutSession.amount_total,
          currency: checkoutSession.currency
        }
      });
    }

    // Connect to Supabase
    const supabase = createClient();
    
    // Get the user's ID
    const userId = session.user.id;
    
    // Check if a purchase record already exists for this session
    const { data: existingPurchase } = await supabase
      .from('model_purchases')
      .select('*')
      .eq('payment_id', sessionId)
      .single();
    
    // If no record exists, create one
    if (!existingPurchase) {
      // Get model details
      const { data: model } = await supabase
        .from('models')
        .select('name, price, creator_id')
        .eq('id', modelId)
        .single();
      
      if (!model) {
        return NextResponse.json({
          success: false,
          message: 'Model not found'
        }, { status: 404 });
      }
      
      // Insert the purchase record
      const { error: purchaseError } = await supabase
        .from('model_purchases')
        .insert({
          user_id: userId,
          model_id: modelId,
          payment_id: sessionId,
          amount: checkoutSession.amount_total ? checkoutSession.amount_total / 100 : model.price,
          currency: checkoutSession.currency || 'USD',
          payment_method: 'stripe',
          status: 'completed'
        });
      
      if (purchaseError) {
        console.error('Error recording purchase:', purchaseError);
        // Still return success to client, but log the error
        return NextResponse.json({
          success: true,
          message: 'Payment verified but failed to record purchase',
          purchase: {
            model: {
              id: modelId,
              name: model.name
            },
            amount: checkoutSession.amount_total ? checkoutSession.amount_total / 100 : model.price,
            currency: checkoutSession.currency || 'USD'
          }
        });
      }
      
      // Create transaction record for the seller
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: model.creator_id,
          amount: (checkoutSession.amount_total ? checkoutSession.amount_total / 100 : model.price) * 0.7, // 70% to creator
          currency: checkoutSession.currency || 'USD',
          type: 'sale',
          status: 'completed',
          reference_id: sessionId,
          description: `Sale of model: ${model.name}`
        });
      
      if (transactionError) {
        console.error('Error recording transaction:', transactionError);
      }
      
      return NextResponse.json({
        success: true,
        message: 'Payment verified and purchase recorded',
        purchase: {
          model: {
            id: modelId,
            name: model.name
          },
          amount: checkoutSession.amount_total ? checkoutSession.amount_total / 100 : model.price,
          currency: checkoutSession.currency || 'USD'
        }
      });
    }
    
    // If record already exists, just return success
    return NextResponse.json({
      success: true,
      message: 'Payment already verified',
      purchase: {
        model: {
          id: existingPurchase.model_id,
          name: existingPurchase.model_name || 'AI Model'
        },
        amount: existingPurchase.amount,
        currency: existingPurchase.currency
      }
    });
    
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    
    return NextResponse.json({
      success: false,
      message: error.message || 'An unexpected error occurred'
    }, { status: 500 });
  }
} 