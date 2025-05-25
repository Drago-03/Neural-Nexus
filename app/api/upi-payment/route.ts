import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import crypto from 'crypto';

// Razorpay is a popular payment gateway in India that supports UPI
// In a real implementation, you would use the Razorpay SDK
interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  created_at: number;
}

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
    
    // Get Razorpay API credentials from environment variables
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
    
    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error('Razorpay API credentials not configured');
      return NextResponse.json(
        { error: 'UPI payment method not available' },
        { status: 500 }
      );
    }
    
    // Parse request body
    const { modelId, modelName, price } = await req.json();
    
    // Validate required parameters
    if (!modelId || !modelName || !price) {
      return NextResponse.json(
        { error: 'Missing required parameters: modelId, modelName, or price' },
        { status: 400 }
      );
    }
    
    // Convert price to Indian Rupees (INR) if necessary
    // In a real application, you would use a currency conversion API
    // For simplicity, we'll just multiply by 83 (approximate conversion rate)
    const priceInINR = Math.round(price * 83 * 100); // Convert to paise (smallest unit in INR)
    
    // Generate a unique receipt ID
    const receiptId = `model_${modelId}_user_${userId}_${Date.now()}`;
    
    // Create Razorpay order
    const orderResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64')}`
      },
      body: JSON.stringify({
        amount: priceInINR,
        currency: 'INR',
        receipt: receiptId,
        notes: {
          modelId,
          userId,
          modelName,
          timestamp: new Date().toISOString()
        }
      })
    });
    
    // Parse response
    const orderData: RazorpayOrder = await orderResponse.json();
    
    // Check for errors
    if (!orderResponse.ok) {
      console.error('Razorpay API error:', orderData);
      return NextResponse.json(
        { error: 'Failed to create UPI payment' },
        { status: orderResponse.status }
      );
    }
    
    // Log the order creation
    console.log(`Razorpay order created for model ${modelId} by user ${userId}: ${orderData.id}`);
    
    // Store order information in your database
    try {
      // This would be implemented in a real application to store the order in your database
      /*
      await db.upiPayments.create({
        orderId: orderData.id,
        userId,
        modelId,
        amount: priceInINR / 100, // Convert back to rupees for readability
        status: 'created',
        receipt: receiptId,
        createdAt: new Date()
      });
      */
    } catch (logError) {
      console.error('Error logging UPI payment order:', logError);
      // Continue anyway as the order was created successfully
    }
    
    // Generate payment link for the client
    // In a real implementation, you would create a checkout page with the Razorpay SDK
    // For now, we'll return the order ID that can be used with the Razorpay SDK on the client side
    
    // Return the checkout details
    return NextResponse.json({
      orderId: orderData.id,
      amount: orderData.amount / 100, // Convert back to rupees for display
      currency: orderData.currency,
      // Generate a checkout URL - in a real app, this would be handled by the Razorpay SDK
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/upi?order_id=${orderData.id}&amount=${orderData.amount}&currency=${orderData.currency}&key=${razorpayKeyId}&name=${encodeURIComponent(modelName)}`
    });
  } catch (error: any) {
    console.error('Error creating UPI payment:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to create UPI payment',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Verify Razorpay payment signature
export async function PUT(req: NextRequest) {
  try {
    // Get Razorpay signature verification details from request
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature 
    } = await req.json();
    
    // Validate required parameters
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required parameters for signature verification' },
        { status: 400 }
      );
    }
    
    // Get Razorpay key secret from environment variables
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
    
    if (!razorpayKeySecret) {
      console.error('Razorpay key secret not configured');
      return NextResponse.json(
        { error: 'Payment verification not available' },
        { status: 500 }
      );
    }
    
    // Verify the signature
    const generatedSignature = crypto
      .createHmac('sha256', razorpayKeySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
    
    const isSignatureValid = generatedSignature === razorpay_signature;
    
    if (!isSignatureValid) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }
    
    // If signature is valid, update the payment status in your database
    try {
      // This would be implemented in a real application to update the payment record
      /*
      await db.upiPayments.update(
        { 
          status: 'completed',
          paymentId: razorpay_payment_id,
          updatedAt: new Date()
        },
        { where: { orderId: razorpay_order_id } }
      );
      
      // Get the order details from the database
      const orderDetails = await db.upiPayments.findOne({
        where: { orderId: razorpay_order_id }
      });
      
      // Create a transaction record
      await db.transactions.create({
        userId: orderDetails.userId,
        modelId: orderDetails.modelId,
        amount: orderDetails.amount,
        currency: 'INR',
        paymentMethod: 'upi',
        transactionId: razorpay_payment_id,
        status: 'completed',
        createdAt: new Date()
      });
      */
    } catch (dbError) {
      console.error('Error updating payment record:', dbError);
      return NextResponse.json(
        { error: 'Failed to update payment record' },
        { status: 500 }
      );
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully'
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to verify payment',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 