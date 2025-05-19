"use client";

import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import LeaderboardSection from '@/components/LeaderboardSection';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import SpaceBackground from '@/components/SpaceBackground';
import { Web3Provider } from '@/providers/Web3Provider';

function LeaderboardContent() {
  return (
    <div className="min-h-screen bg-black text-white relative">
      <SpaceBackground />
      
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto text-center px-4 mb-16"
        >
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            Neural Nexus Community Leaderboard
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Discover top contributors, model creators, and earn Web3 badges by participating in our ecosystem.
          </p>
        </motion.section>
        
        {/* Stats Summary */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="container mx-auto px-4 mb-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
              <h3 className="text-xl font-semibold mb-1">Total Earnings</h3>
              <p className="text-3xl font-bold text-purple-400">145.2 ETH</p>
            </div>
            <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20">
              <h3 className="text-xl font-semibold mb-1">Active Users</h3>
              <p className="text-3xl font-bold text-blue-400">2,451</p>
            </div>
            <div className="bg-gradient-to-br from-pink-900/30 to-red-900/30 backdrop-blur-sm rounded-xl p-6 border border-pink-500/20">
              <h3 className="text-xl font-semibold mb-1">Models Minted</h3>
              <p className="text-3xl font-bold text-pink-400">837</p>
            </div>
            <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 backdrop-blur-sm rounded-xl p-6 border border-amber-500/20">
              <h3 className="text-xl font-semibold mb-1">Community Score</h3>
              <p className="text-3xl font-bold text-amber-400">8.9/10</p>
            </div>
          </div>
        </motion.section>
        
        {/* Main Leaderboard */}
        <LeaderboardSection />
        
        {/* How to Earn Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="container mx-auto px-4 py-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">How to Earn Web3 Badges</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="bg-purple-500/20 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Models</h3>
              <p className="text-gray-400">Share your AI models with the community to earn badges and build your reputation.</p>
            </div>
            
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="bg-blue-500/20 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Test and Review</h3>
              <p className="text-gray-400">Provide feedback on other models to earn badges and climb the leaderboard.</p>
            </div>
            
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="bg-pink-500/20 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Earn Crypto</h3>
              <p className="text-gray-400">Get paid in crypto when your models are used or purchased by others.</p>
            </div>
          </div>
        </motion.section>
      </main>
      
      <Footer />
    </div>
  );
}

// Fallback loading UI for Suspense
function LeaderboardFallback() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="pt-24 pb-16 container mx-auto px-4">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-2xl font-bold">Loading Leaderboard...</h2>
          <p className="text-gray-400 mt-2">Fetching the latest community stats and achievements</p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <Web3Provider>
      <Suspense fallback={<LeaderboardFallback />}>
        <LeaderboardContent />
      </Suspense>
    </Web3Provider>
  );
} 