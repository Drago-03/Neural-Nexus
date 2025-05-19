"use client";

// The dynamic export configuration at the top ensures this page is only rendered client-side
export const dynamic = "force-dynamic";
export const runtime = "experimental-edge";
export const dynamicParams = true;

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSupabase } from "@/providers/SupabaseProvider";
import { toast } from "react-hot-toast";
import nextDynamic from 'next/dynamic';
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

// Dynamically import Confetti with ssr: false to prevent the 'document is not defined' error
const Confetti = nextDynamic(() => import('react-confetti'), { ssr: false });

// Content component that uses useSearchParams
function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { supabase } = useSupabase();
  const [showConfetti, setShowConfetti] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("Processing your authentication...");
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Get error from URL if any
    const errorDescription = searchParams.get("error_description");
    if (errorDescription) {
      setError(errorDescription);
      setMessage("Authentication failed");
      toast.error("Authentication failed");
      return;
    }

    const handleCallback = async () => {
      try {
        // Check if we have a session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (session) {
          // If we have a session, the user is authenticated
          setShowConfetti(true);
          setMessage("Authentication successful! 🎉");
          toast.success("Authentication successful!");
          
          // Redirect after 5 seconds
          let count = 5;
          const interval = setInterval(() => {
            count--;
            setCountdown(count);
            if (count <= 0) {
              clearInterval(interval);
              router.push("/dashboard");
            }
          }, 1000);
          
          return;
        }

        // If no session, we need to exchange the code
        const code = searchParams.get("code");
        if (code) {
          // Exchange code for session
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError) {
            throw exchangeError;
          }
          
          setShowConfetti(true);
          setMessage("Authentication successful! 🎉");
          toast.success("You're now signed in!");
          
          // Redirect after 5 seconds
          let count = 5;
          const interval = setInterval(() => {
            count--;
            setCountdown(count);
            if (count <= 0) {
              clearInterval(interval);
              router.push("/dashboard");
            }
          }, 1000);
        } else {
          // If no code, we have nothing to do here
          setError("No authentication code found");
          setMessage("Authentication failed");
          toast.error("Authentication failed");
        }
      } catch (err: any) {
        console.error("Auth callback error:", err);
        setError(err.message || "Authentication failed");
        setMessage("Authentication failed");
        toast.error("Authentication failed");
      }
    };

    handleCallback();
  }, [supabase, router, searchParams]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black p-4">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/5 backdrop-blur-md rounded-xl border border-purple-500/10 p-8 md:p-12 w-full max-w-md shadow-xl text-center"
      >
        {error ? (
          <>
            <div className="bg-red-500/10 p-4 rounded-lg mb-6">
              <h2 className="text-xl font-semibold text-red-400 mb-2">Authentication Error</h2>
              <p className="text-gray-300">{error}</p>
            </div>
            <button
              onClick={() => router.push("/signin")}
              className="bg-gradient-to-r from-purple-500 to-blue-600 px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-all"
            >
              Return to Sign In
            </button>
          </>
        ) : (
          <>
            {showConfetti ? (
              <>
                <h2 className="text-3xl font-bold text-white mb-4">Welcome! 🚀</h2>
                <p className="text-xl text-purple-300 mb-6">{message}</p>
                <p className="text-gray-400 mb-8">
                  Redirecting to dashboard in <span className="text-white font-semibold">{countdown}</span> seconds...
                </p>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="bg-gradient-to-r from-purple-500 to-blue-600 px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-all"
                >
                  Go to Dashboard Now
                </button>
              </>
            ) : (
              <>
                <Loader2 className="h-10 w-10 text-purple-500 animate-spin mb-4 mx-auto" />
                <h2 className="text-2xl font-semibold text-white mb-2">Almost there!</h2>
                <p className="text-gray-300">{message}</p>
              </>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}

// Loading fallback for Suspense
function AuthCallbackFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black p-4">
      <div className="bg-white/5 backdrop-blur-md rounded-xl border border-purple-500/10 p-8 md:p-12 w-full max-w-md shadow-xl text-center">
        <Loader2 className="h-10 w-10 text-purple-500 animate-spin mb-4 mx-auto" />
        <h2 className="text-2xl font-semibold text-white mb-2">Loading...</h2>
        <p className="text-gray-300">Please wait while we process your authentication</p>
      </div>
    </div>
  );
}

// Main component that uses Suspense
export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<AuthCallbackFallback />}>
      <AuthCallbackContent />
    </Suspense>
  );
} 