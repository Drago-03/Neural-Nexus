"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

function AuthExchangeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const handleCodeExchange = async () => {
      try {
        const code = searchParams.get('code');
        
        if (!code) {
          setError('No authorization code found');
          return;
        }
        
        // Initialize Supabase client
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseAnonKey) {
          setError('Missing Supabase configuration');
          return;
        }
        
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        
        // Exchange the code for a session
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (error) {
          console.error('Error exchanging code for session:', error);
          setError(error.message);
          return;
        }
        
        // Redirect to home page or dashboard
        router.push('/dashboard');
      } catch (err: any) {
        console.error('Error in code exchange:', err);
        setError(err.message || 'An error occurred during authentication');
      }
    };
    
    handleCodeExchange();
  }, [searchParams, router]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700/50 max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-4">
          {error ? 'Authentication Error' : 'Completing Sign In...'}
        </h1>
        
        {error ? (
          <div>
            <p className="text-red-400 mb-4">{error}</p>
            <button 
              onClick={() => router.push('/signin')} 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
            <p className="text-gray-300">Completing your sign in, please wait...</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Fallback loading UI for Suspense
function ExchangeFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700/50 max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-4">Loading...</h1>
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
          <p className="text-gray-300">Preparing authentication...</p>
        </div>
      </div>
    </div>
  );
}

export default function AuthExchange() {
  return (
    <Suspense fallback={<ExchangeFallback />}>
      <AuthExchangeContent />
    </Suspense>
  );
} 