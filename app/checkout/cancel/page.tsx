"use client";

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft } from 'lucide-react';
import { AnimatedButton } from '@/components/ui/animated-button';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Loading component for Suspense fallback
function CancelPageLoading() {
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
            <div className="loader mx-auto mb-4">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <h2 className="text-lg font-medium">Loading...</h2>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

// Main component content
function CheckoutCancelContent() {
  const router = useRouter();

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
          <div className="text-center">
            <div className="bg-red-900/20 border border-red-500/30 rounded-full p-4 mx-auto mb-6 w-fit">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Payment Cancelled</h2>
            <p className="text-gray-400 mb-8">
              Your payment process was cancelled. No charges were made to your account.
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
              
              <button 
                onClick={() => router.back()}
                className="flex items-center justify-center w-full px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </button>
            </div>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
}

// Export the page component with Suspense
export default function CheckoutCancelPage() {
  return (
    <Suspense fallback={<CancelPageLoading />}>
      <CheckoutCancelContent />
    </Suspense>
  );
} 