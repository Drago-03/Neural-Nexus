"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SignInMenu } from '@/src/components/auth/SignInMenu';
import Link from 'next/link';
import { ArrowRight, LogIn, UserPlus } from "lucide-react";

// Remove edge runtime to avoid size limits
// export const runtime = 'edge';

export default function SignupPage() {
  // State to control if the SignInMenu is open
  const [showSignInMenu, setShowSignInMenu] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  
  const openSignIn = () => {
    setAuthMode('signin');
      setShowSignInMenu(true);
  };
  
  const openSignUp = () => {
    setAuthMode('signup');
    setShowSignInMenu(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />
      
      <div className="pt-28 pb-16 px-4">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-pink-500"
            >
              Join Neural Nexus
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-gray-300 mb-8"
            >
              Create your account to access all features and join our community of AI enthusiasts.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <button
                onClick={openSignIn}
                className="px-8 py-4 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <LogIn className="mr-2 h-5 w-5" />
                Sign In
              </button>
              
              <button
                onClick={openSignUp}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg font-medium hover:opacity-90 transition-all transform hover:scale-105 shadow-lg shadow-blue-500/25 flex items-center justify-center"
              >
                <UserPlus className="mr-2 h-5 w-5" />
                Sign Up
              </button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 max-w-2xl mx-auto"
            >
              <h2 className="text-2xl font-bold mb-4">Why Join Neural Nexus?</h2>
              <ul className="space-y-4 text-left">
                <li className="flex items-start">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-1 mr-3 mt-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Access exclusive AI models</span>
                    <p className="text-gray-400 text-sm">Browse and use thousands of cutting-edge AI models from our community.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-1 mr-3 mt-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Share your own models</span>
                    <p className="text-gray-400 text-sm">Upload and monetize your AI innovations with our secure platform.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-1 mr-3 mt-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Join a thriving community</span>
                    <p className="text-gray-400 text-sm">Connect with like-minded AI enthusiasts and industry experts.</p>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      <SignInMenu 
        isOpen={showSignInMenu} 
        onClose={() => setShowSignInMenu(false)} 
        initialMode={authMode}
      />
      
      <Footer />
    </main>
  );
} 