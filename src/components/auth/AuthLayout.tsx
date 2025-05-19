"use client";

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import BrainAnimation from '@/src/components/animations/BrainAnimation';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  showBrainAnimation?: boolean;
  mode: 'signin' | 'signup';
}

export default function AuthLayout({
  children,
  title,
  subtitle,
  showBrainAnimation = false,
  mode
}: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col">
      {/* Header */}
      <header className="container mx-auto pt-6 px-4">
        <div className="flex items-center">
          <Link 
            href="/" 
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>
      
      <div className="flex-1 flex flex-col md:flex-row items-stretch">
        {/* Left side - Content */}
        <div className="w-full md:w-1/2 flex items-center justify-center py-12 px-4">
          <div className="max-w-md w-full">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-pink-500">
                {title}
              </h1>
              <p className="text-gray-300">{subtitle}</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {children}
            </motion.div>
          </div>
        </div>
        
        {/* Right side - Animated graphic */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-purple-900/20 to-blue-900/20 items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10"></div>
          
          {showBrainAnimation ? (
            <div className="relative z-10 w-full max-w-lg">
              <BrainAnimation />
            </div>
          ) : (
            <div className="relative z-10 w-full max-w-lg p-8">
              {mode === 'signup' ? (
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold mb-4">Start Building Today</h2>
                    <p className="text-gray-300">
                      Join our community of developers and create amazing applications
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-purple-500/10">
                      <h3 className="font-medium text-purple-300 mb-2">Free Developer Account</h3>
                      <p className="text-sm text-gray-400">Get started with our free tier and build amazing things</p>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-purple-500/10">
                      <h3 className="font-medium text-blue-300 mb-2">Collaboration Tools</h3>
                      <p className="text-sm text-gray-400">Work together with other developers in real-time</p>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-purple-500/10">
                      <h3 className="font-medium text-pink-300 mb-2">24/7 Support</h3>
                      <p className="text-sm text-gray-400">Get help whenever you need it from our support team</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold mb-4">Welcome Back!</h2>
                    <p className="text-gray-300">
                      Access your workspace and continue building amazing things
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-purple-500/10">
                      <h3 className="font-medium text-purple-300 mb-2">Your Projects</h3>
                      <p className="text-sm text-gray-400">Pick up right where you left off</p>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-purple-500/10">
                      <h3 className="font-medium text-blue-300 mb-2">Latest Updates</h3>
                      <p className="text-sm text-gray-400">See what's new in your projects and teams</p>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-purple-500/10">
                      <h3 className="font-medium text-pink-300 mb-2">Quick Access</h3>
                      <p className="text-sm text-gray-400">Jump right back into your favorite tools</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          
          {/* Decorative elements */}
          <div className="absolute top-10 right-10 w-20 h-20 bg-purple-500/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
          
          {/* Grid decoration */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5"></div>
        </div>
      </div>
    </main>
  );
} 