"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Loader, ArrowRight } from 'lucide-react';
import { AnimatedButton } from '@/components/ui/animated-button';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Loading component for Suspense fallback
function SuccessPageLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-6">
        <motion.div 
          className="w-full max-w-md bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-xl p-8 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center py-10">
            <Loader className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold mb-2">Loading</h2>
            <p className="text-gray-400">Please wait while we load the page...</p>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

// Main component content
function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verifying, setVerifying] = useState(true);
  const [purchaseDetails, setPurchaseDetails] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  
  // Get query parameters
  const sessionId = searchParams.get('session_id');
  const coinbaseCode = searchParams.get('coinbase_code');
  const razorpayOrderId = searchParams.get('razorpay_order_id');
  const razorpayPaymentId = searchParams.get('razorpay_payment_id');
  const razorpaySignature = searchParams.get('razorpay_signature');
  
  useEffect(() => {
    // Determine payment method based on URL parameters
    if (sessionId) {
      setPaymentMethod('stripe');
      verifyStripePayment(sessionId);
    } else if (coinbaseCode) {
      setPaymentMethod('coinbase');
      verifyCoinbasePayment(coinbaseCode);
    } else if (razorpayOrderId && razorpayPaymentId && razorpaySignature) {
      setPaymentMethod('upi');
      verifyUPIPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);
    } else {
      // No payment identifiers found, show error
      setVerifying(false);
      toast.error('No payment information found');
    }
  }, [sessionId, coinbaseCode, razorpayOrderId, razorpayPaymentId, razorpaySignature]);
  
  // Verify Stripe payment
  const verifyStripePayment = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/verify-payment?session_id=${sessionId}`, {
        method: 'GET'
      });
      
      if (!response.ok) {
        throw new Error('Payment verification failed');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setPurchaseDetails(data.purchase);
        toast.success('Payment successful!');
      } else {
        toast.error(data.message || 'Payment could not be verified');
      }
    } catch (error) {
      console.error('Error verifying Stripe payment:', error);
      toast.error('Failed to verify payment');
    } finally {
      setVerifying(false);
    }
  };
  
  // Verify Coinbase payment
  const verifyCoinbasePayment = async (code: string) => {
    try {
      const response = await fetch(`/api/coinbase/check-status?code=${code}`, {
        method: 'GET'
      });
      
      if (!response.ok) {
        throw new Error('Payment verification failed');
      }
      
      const data = await response.json();
      
      if (data.status === 'completed' || data.status === 'confirmed') {
        setPurchaseDetails({
          model: {
            id: data.metadata?.modelId,
            name: data.metadata?.modelName || 'AI Model'
          },
          amount: data.pricing?.local?.amount,
          currency: data.pricing?.local?.currency
        });
        toast.success('Payment successful!');
      } else {
        toast('Payment is still being processed. You will receive a confirmation soon.');
      }
    } catch (error) {
      console.error('Error verifying Coinbase payment:', error);
      toast.error('Failed to verify payment');
    } finally {
      setVerifying(false);
    }
  };
  
  // Verify UPI payment
  const verifyUPIPayment = async (orderId: string, paymentId: string, signature: string) => {
    try {
      const response = await fetch('/api/upi-payment', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: signature
        })
      });
      
      if (!response.ok) {
        throw new Error('Payment verification failed');
      }
      
      const data = await response.json();
      
      if (data.success) {
        // For UPI, we would fetch the purchase details separately
        // For now, we'll just create a placeholder
        setPurchaseDetails({
          model: {
            id: 'placeholder',
            name: 'Your Purchase'
          },
          amount: 'Paid',
          currency: 'INR'
        });
        toast.success('Payment successful!');
      } else {
        toast.error(data.message || 'Payment could not be verified');
      }
    } catch (error) {
      console.error('Error verifying UPI payment:', error);
      toast.error('Failed to verify payment');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-6">
        <motion.div 
          className="w-full max-w-md bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-xl p-8 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {verifying ? (
            <div className="text-center py-10">
              <Loader className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
              <h2 className="text-2xl font-bold mb-2">Verifying Payment</h2>
              <p className="text-gray-400">Please wait while we confirm your payment...</p>
            </div>
          ) : purchaseDetails ? (
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
              <p className="text-gray-400 mb-6">
                Your purchase has been completed successfully.
              </p>
              
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-6 text-left">
                {purchaseDetails.model && (
                  <div className="mb-2 flex justify-between">
                    <span className="text-gray-400">Model:</span>
                    <span className="font-medium">{purchaseDetails.model.name}</span>
                  </div>
                )}
                
                {purchaseDetails.amount && (
                  <div className="mb-2 flex justify-between">
                    <span className="text-gray-400">Amount:</span>
                    <span className="font-medium">
                      {purchaseDetails.amount} {purchaseDetails.currency}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment Method:</span>
                  <span className="font-medium capitalize">{paymentMethod}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                {purchaseDetails.model?.id && (
                  <Link href={`/models/${purchaseDetails.model.id}`} passHref>
                    <AnimatedButton
                      variant="primary"
                      className="w-full"
                    >
                      View Your Model
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </AnimatedButton>
                  </Link>
                )}
                
                <Link href="/dashboard" passHref>
                  <AnimatedButton
                    variant="outline"
                    className="w-full"
                  >
                    Go to Dashboard
                  </AnimatedButton>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="bg-red-900/20 border border-red-500/30 rounded-full p-4 mx-auto mb-6 w-fit">
                <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Payment Verification Failed</h2>
              <p className="text-gray-400 mb-6">
                We couldn't verify your payment. If you believe this is an error, please contact support.
              </p>
              
              <div className="space-y-3">
                <Link href="/marketplace" passHref>
                  <AnimatedButton
                    variant="primary"
                    className="w-full"
                  >
                    Return to Marketplace
                  </AnimatedButton>
                </Link>
                
                <Link href="/support" passHref>
                  <AnimatedButton
                    variant="outline"
                    className="w-full"
                  >
                    Contact Support
                  </AnimatedButton>
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
}

// Export the page component with Suspense
export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<SuccessPageLoading />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
} 