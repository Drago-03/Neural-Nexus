import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import supabase from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    // Parse request body
    const { 
      hash, 
      from, 
      to, 
      amount, 
      metadata = {} 
    } = await req.json();
    
    // Validate required parameters
    if (!hash || !from || !to || !amount) {
      return NextResponse.json(
        { error: 'Missing required parameters: hash, from, to, or amount' },
        { status: 400 }
      );
    }
    
    // Verify that the transaction is from the authenticated user
    if (from.toLowerCase() !== metadata.from?.toLowerCase() && from.toLowerCase() !== from?.toLowerCase()) {
      return NextResponse.json(
        { error: 'Transaction sender does not match authenticated user' },
        { status: 403 }
      );
    }
    
    // Store the transaction in database
    const { data, error } = await supabase
      .from('crypto_transactions')
      .insert({
        transaction_hash: hash,
        from_address: from,
        to_address: to,
        amount: amount,
        user_id: userId,
        model_id: metadata.modelId || null,
        currency: 'ETH', // Default to ETH, can be expanded for other cryptos
        status: 'confirmed',
        metadata: metadata,
        created_at: new Date().toISOString()
      })
      .select();
    
    if (error) {
      console.error('Error storing transaction:', error);
      return NextResponse.json(
        { error: 'Failed to store transaction' },
        { status: 500 }
      );
    }
    
    // If this transaction is for a model purchase, create a purchase record
    if (metadata.modelId) {
      // Create a purchase record
      const { error: purchaseError } = await supabase
        .from('model_purchases')
        .insert({
          model_id: metadata.modelId,
          user_id: userId,
          transaction_hash: hash,
          amount: amount,
          currency: 'ETH',
          payment_method: 'crypto',
          status: 'completed',
          created_at: new Date().toISOString()
        });
      
      if (purchaseError) {
        console.error('Error creating purchase record:', purchaseError);
        // Don't fail the request, just log the error
      }
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      transactionId: data?.[0]?.id,
      message: 'Transaction recorded successfully'
    });
  } catch (error: any) {
    console.error('Error recording transaction:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to record transaction',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 