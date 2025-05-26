"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, CreditCard, Wallet, Globe, Bitcoin, 
  X, ChevronRight, Loader, CheckCircle, AlertTriangle
} from 'lucide-react';
import { useAppContext } from '@/providers/AppProvider';
import { useSimpleCrypto } from '@/providers/SimpleCryptoProvider';
import { useCoinbase } from '@/providers/CoinbaseProvider';
import { AnimatedButton } from './ui/animated-button';
import { toast } from 'react-hot-toast';

interface BuyModelButtonProps {
  modelId: string;
  modelName: string;
  price: number;
  currency?: string;
  variant?: 'default' | 'outline' | 'small';
}

export default function BuyModelButton({ 
  modelId,
  modelName,
  price,
  currency = 'USD',
  variant = 'default'
}: BuyModelButtonProps) {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const { user } = useAppContext();
  const { connect: connectWallet, isConnected, makePayment } = useSimpleCrypto();
  const { checkoutWithCoinbase } = useCoinbase();

  // Payment methods
  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: <CreditCard className="h-5 w-5" /> },
    { id: 'crypto', name: 'Crypto Wallet', icon: <Wallet className="h-5 w-5" /> },
    { id: 'coinbase', name: 'Coinbase', icon: <Bitcoin className="h-5 w-5" /> },
    { id: 'upi', name: 'UPI Payment', icon: <Globe className="h-5 w-5" /> }
  ];

  const handleOpenPayment = () => {
    if (!user) {
      toast.error('You need to sign in to purchase models!');
      return;
    }
    setIsPaymentModalOpen(true);
  };

  const handleClosePayment = () => {
    // Only allow closing if not in the middle of processing
    if (paymentStatus !== 'processing') {
      setIsPaymentModalOpen(false);
      // Reset states after animation completes
      setTimeout(() => {
        setPaymentMethod(null);
        setPaymentStatus('idle');
        setTransactionHash(null);
      }, 300);
    }
  };

  const handleSelectPaymentMethod = (method: string) => {
    setPaymentMethod(method);
  };

  const handleProcessPayment = async () => {
    setPaymentStatus('processing');
    
    try {
      if (paymentMethod === 'card') {
        // Handle Stripe checkout
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          modelId,
          modelName,
          price,
            currency
        }),
      });
      
      const data = await response.json();
      
        if (data.url) {
          window.location.href = data.url;
        } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
      
        return; // Don't set success state here as we're redirecting
      }
      else if (paymentMethod === 'crypto') {
        // Connect wallet if not connected
        if (!isConnected) {
          await connectWallet();
        }
        
        // Make crypto payment
        const result = await makePayment({
          amount: price,
          recipient: process.env.NEXT_PUBLIC_PLATFORM_WALLET_ADDRESS || '0x123...',
          metadata: {
            modelId,
            userId: user?.id,
            timestamp: Date.now()
          }
        });
        
        if (result.success) {
          setTransactionHash(result.transactionHash);
          setPaymentStatus('success');
          
          // Record purchase in database
          await fetch('/api/models/purchase', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              modelId,
              paymentMethod: 'crypto',
              transactionHash: result.transactionHash,
              amount: price,
              currency: 'ETH'
            }),
          });
        } else {
          throw new Error(result.error || 'Crypto payment failed');
        }
      } 
      else if (paymentMethod === 'coinbase') {
        // Handle Coinbase checkout
        const checkoutResult = await checkoutWithCoinbase({
          name: `Purchase: ${modelName}`,
          description: `License for AI model: ${modelName}`,
          local_price: {
            amount: price.toString(),
            currency
          },
          metadata: {
            modelId,
            userId: user?.id
          }
        });
        
        if (checkoutResult.url) {
          window.location.href = checkoutResult.url;
        } else {
          throw new Error(checkoutResult.error || 'Failed to create Coinbase checkout');
        }
        
        return; // Don't set success state here as we're redirecting
      }
      else if (paymentMethod === 'upi') {
        // Handle UPI payment (for India)
        const response = await fetch('/api/upi-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            modelId,
            modelName,
            price,
            currency: 'INR' // Use INR for UPI
          }),
        });
        
        const data = await response.json();
        
      if (data.url) {
        window.location.href = data.url;
      } else {
          throw new Error(data.error || 'Failed to create UPI payment');
        }
        
        return; // Don't set success state here as we're redirecting
      }
    } catch (error: any) {
      console.error('Payment processing error:', error);
      setPaymentStatus('error');
      toast.error(error.message || 'Payment failed, please try again');
    }
  };
  
  return (
    <>
      {/* Button Variants */}
      {variant === 'small' ? (
        <button 
          onClick={handleOpenPayment}
          className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-md transition-colors flex items-center"
          aria-label={`Buy ${modelName}`}
        >
          <DollarSign className="h-3 w-3 mr-1" />
          Buy
        </button>
      ) : variant === 'outline' ? (
    <button
          onClick={handleOpenPayment}
          className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-4 py-2 rounded-lg transition-colors flex items-center"
          aria-label={`Buy ${modelName}`}
        >
          <DollarSign className="h-5 w-5 mr-2" />
          Buy Now
        </button>
      ) : (
        <AnimatedButton
          variant="primary"
          onClick={handleOpenPayment}
          className="w-full sm:w-auto"
        >
          <DollarSign className="h-5 w-5 mr-2" />
          Buy Now - {price} {currency}
        </AnimatedButton>
      )}

      {/* Payment Modal */}
      <AnimatePresence>
        {isPaymentModalOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClosePayment}
          >
            <motion.div 
              className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-xl w-full max-w-md"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative p-5 border-b border-gray-800">
                <h2 className="text-xl font-bold text-center">
                  {paymentMethod === null ? (
                    'Choose Payment Method'
                  ) : paymentStatus === 'processing' ? (
                    'Processing Payment'
                  ) : paymentStatus === 'success' ? (
                    'Payment Successful'
                  ) : paymentStatus === 'error' ? (
                    'Payment Failed'
                  ) : (
                    `Pay with ${paymentMethods.find(m => m.id === paymentMethod)?.name}`
                  )}
                </h2>
                
                {/* Only show close button if not processing */}
                {paymentStatus !== 'processing' && (
                  <button 
                    onClick={handleClosePayment}
                    className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
                    aria-label="Close payment modal"
                  >
                    <X className="h-6 w-6" />
                  </button>
                )}
              </div>
              
              {/* Content */}
              <div className="p-5">
                {/* Choose payment method */}
                {paymentMethod === null && (
                  <div className="space-y-3">
                    <p className="text-gray-400 text-center mb-4">
                      Total amount: <span className="text-white font-bold">{price} {currency}</span>
                    </p>
                    
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        className="w-full p-4 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 rounded-lg flex items-center justify-between transition-colors"
                        onClick={() => handleSelectPaymentMethod(method.id)}
                      >
                        <div className="flex items-center">
                          <div className="bg-blue-500/20 p-2 rounded-full mr-3">
                            {method.icon}
                          </div>
                          <span>{method.name}</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Process payment */}
                {paymentMethod !== null && paymentStatus === 'idle' && (
                  <div className="space-y-4">
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-300">Model:</span>
                        <span className="font-medium">{modelName}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-300">Price:</span>
                        <span className="font-medium">{price} {currency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Payment Method:</span>
                        <span className="font-medium">
                          {paymentMethods.find(m => m.id === paymentMethod)?.name}
                        </span>
                      </div>
                    </div>
                    
                    <AnimatedButton
                      variant="primary"
                      className="w-full"
                      onClick={handleProcessPayment}
                    >
                      Confirm Payment
                    </AnimatedButton>
                    
                    <button
                      className="w-full text-center text-gray-400 hover:text-white text-sm"
                      onClick={() => setPaymentMethod(null)}
                    >
                      Back to Payment Methods
    </button>
                  </div>
                )}
                
                {/* Processing state */}
                {paymentStatus === 'processing' && (
                  <div className="text-center py-8">
                    <div className="flex justify-center mb-4">
                      <Loader className="h-12 w-12 text-blue-500 animate-spin" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Processing Your Payment</h3>
                    <p className="text-gray-400 text-sm">
                      Please wait while we process your payment. Do not close this window.
                    </p>
                  </div>
                )}
                
                {/* Success state */}
                {paymentStatus === 'success' && (
                  <div className="text-center py-8">
                    <div className="flex justify-center mb-4">
                      <CheckCircle className="h-12 w-12 text-green-500" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Payment Successful!</h3>
                    <p className="text-gray-400 text-sm mb-6">
                      Your purchase was successful. You now have access to {modelName}.
                    </p>
                    
                    {transactionHash && (
                      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 mb-4">
                        <p className="text-xs text-gray-400 mb-1">Transaction Hash:</p>
                        <p className="text-xs font-mono break-all">{transactionHash}</p>
                      </div>
                    )}
                    
                    <div className="flex space-x-3">
                      <AnimatedButton
                        variant="primary"
                        className="w-full"
                        onClick={() => {
                          window.location.href = `/models/${modelId}`;
                        }}
                      >
                        View Model
                      </AnimatedButton>
                      <AnimatedButton
                        variant="outline"
                        className="w-full"
                        onClick={handleClosePayment}
                      >
                        Close
                      </AnimatedButton>
                    </div>
                  </div>
                )}
                
                {/* Error state */}
                {paymentStatus === 'error' && (
                  <div className="text-center py-8">
                    <div className="flex justify-center mb-4">
                      <AlertTriangle className="h-12 w-12 text-red-500" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Payment Failed</h3>
                    <p className="text-gray-400 text-sm mb-6">
                      There was an error processing your payment. Please try again or choose a different payment method.
                    </p>
                    
                    <div className="flex space-x-3">
                      <AnimatedButton
                        variant="primary"
                        className="w-full"
                        onClick={() => {
                          setPaymentStatus('idle');
                          setPaymentMethod(null);
                        }}
                      >
                        Try Again
                      </AnimatedButton>
                      <AnimatedButton
                        variant="outline"
                        className="w-full"
                        onClick={handleClosePayment}
                      >
                        Cancel
                      </AnimatedButton>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 