"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  useEffect(() => {
    const error = searchParams.get('error');
    
    if (!error) {
      setErrorMessage('An unknown authentication error occurred.');
      return;
    }
    
    // Handle different error types
    switch (error) {
      case 'missing_code':
        setErrorMessage('Authentication code was missing from the request.');
        break;
      case 'server_error':
        setErrorMessage('The server encountered an error during authentication.');
        break;
      case 'access_denied':
        setErrorMessage('Authentication was denied. You may have declined to authorize the application.');
        break;
      default:
        // Use the raw error message if it looks safe to display
        if (error.match(/^[a-zA-Z0-9_\- ]+$/)) {
          setErrorMessage(`Authentication error: ${error}`);
        } else {
          setErrorMessage('An authentication error occurred.');
        }
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-black text-white">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-500/20 rounded-full">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold">Authentication Error</h1>
          </div>
          
          <p className="text-gray-300 mb-6">{errorMessage}</p>
          
          <div className="space-y-4">
            <Link 
              href="/signin" 
              className="block w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg text-center transition-colors"
            >
              Try Again
            </Link>
            
            <Link 
              href="/" 
              className="block w-full py-3 px-4 bg-transparent hover:bg-gray-700 border border-gray-600 text-gray-300 font-medium rounded-lg text-center transition-colors"
            >
              Return to Home
            </Link>
          </div>
          
          <p className="mt-6 text-sm text-gray-400 text-center">
            Need help? <a href="mailto:support@neuralnexus.ai" className="text-purple-400 hover:text-purple-300">Contact Support</a>
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

// Fallback loading UI for Suspense
function ErrorFallback() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-black text-white">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 shadow-xl">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-300">Loading error details...</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<ErrorFallback />}>
      <AuthErrorContent />
    </Suspense>
  );
} 