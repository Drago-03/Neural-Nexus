"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAdminAuth } from '@/providers/AdminAuthProvider';
import { FcGoogle } from 'react-icons/fc';
import { Lock, ShieldAlert, Loader } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { isAdmin, isLoading, loginWithGoogle } = useAdminAuth();
  
  // Redirect to dashboard if already authenticated and admin
  useEffect(() => {
    if (!isLoading && isAdmin) {
      router.push('/admin/dashboard');
    }
  }, [isLoading, isAdmin, router]);
  
  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Failed to login with Google:', error);
    }
  };
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />
      
      <section className="pt-28 pb-20 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-8 max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Admin Access Only</h1>
            <p className="text-gray-400">
              This area is restricted to system administrators. Login with your Google account to continue.
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center my-8">
              <div className="flex items-center gap-2">
                <Loader className="w-5 h-5 animate-spin text-purple-400" />
                <span className="text-gray-300">Checking authentication...</span>
              </div>
            </div>
          ) : (
            <button
              onClick={handleGoogleLogin}
              className="w-full py-3 px-4 bg-white text-gray-800 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
            >
              <FcGoogle className="w-5 h-5" />
              Sign in with Google
            </button>
          )}
          
          <div className="mt-8 text-center text-sm text-gray-400">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Admin access is by invitation only</span>
            </div>
            <p>
              Only users with pre-authorized email addresses can access the admin panel.
            </p>
          </div>
        </motion.div>
      </section>
      
      <Footer />
    </main>
  );
} 