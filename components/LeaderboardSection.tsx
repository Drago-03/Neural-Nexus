"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedCard } from './ui/animated-card';
import { AnimatedButton } from './ui/animated-button';
import { Trophy, Star, GitBranch, Award, ArrowUp, ArrowDown, Code, DollarSign, Eye, Filter } from 'lucide-react';
import { useWeb3 } from '@/providers/Web3Provider';

type LeaderboardUser = {
  id: string;
  username: string;
  avatarUrl: string;
  cryptoEarned: number;
  modelsSold: number;
  contributions: number;
  testingFeedback: number;
  badges: string[];
  walletAddress: string;
  joinedDate: string;
};

type SortField = 'cryptoEarned' | 'modelsSold' | 'contributions' | 'testingFeedback';

export default function LeaderboardSection() {
  const [mounted, setMounted] = useState(false);
  const [sortBy, setSortBy] = useState<SortField>('cryptoEarned');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterActive, setFilterActive] = useState(false);
  const [showMoreUsers, setShowMoreUsers] = useState(false);
  
  // Only access the Web3Provider when component is mounted
  const web3Context = mounted ? useWeb3() : { 
    isWeb3Enabled: false, 
    showCryptoEarnings: true, 
    toggleCryptoEarnings: () => {} 
  };
  
  const { isWeb3Enabled, showCryptoEarnings, toggleCryptoEarnings } = web3Context;
  
  // Set mounted state after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Mock data for the leaderboard
  const mockLeaderboard: LeaderboardUser[] = [
    {
      id: '1',
      username: 'NeuralWizard',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop',
      cryptoEarned: 3.45,
      modelsSold: 12,
      contributions: 24,
      testingFeedback: 37,
      badges: ['Open Source Contributor', 'Verified Developer'],
      walletAddress: '0x1234...5678',
      joinedDate: '2023-05-12'
    },
    {
      id: '2',
      username: 'AIQueen',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop',
      cryptoEarned: 5.21,
      modelsSold: 8,
      contributions: 15,
      testingFeedback: 42,
      badges: ['Beta Model Tester', 'Top Seller'],
      walletAddress: '0xabcd...efgh',
      joinedDate: '2023-06-23'
    },
    {
      id: '3',
      username: 'DataDriven',
      avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop',
      cryptoEarned: 2.87,
      modelsSold: 5,
      contributions: 31,
      testingFeedback: 19,
      badges: ['Open Source Contributor'],
      walletAddress: '0x7890...1234',
      joinedDate: '2023-04-05'
    },
    {
      id: '4',
      username: 'CodeMaster',
      avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop',
      cryptoEarned: 1.95,
      modelsSold: 3,
      contributions: 47,
      testingFeedback: 8,
      badges: ['Verified Developer', 'Bug Hunter'],
      walletAddress: '0xdefg...hijk',
      joinedDate: '2023-03-18'
    },
    {
      id: '5',
      username: 'NeuralNinja',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop',
      cryptoEarned: 4.12,
      modelsSold: 9,
      contributions: 12,
      testingFeedback: 24,
      badges: ['Beta Model Tester', 'Top Seller'],
      walletAddress: '0xlmno...pqrs',
      joinedDate: '2023-07-30'
    },
    {
      id: '6',
      username: 'DeepMindz',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop',
      cryptoEarned: 3.05,
      modelsSold: 7,
      contributions: 18,
      testingFeedback: 29,
      badges: ['Open Source Contributor'],
      walletAddress: '0xtuv...wxyz',
      joinedDate: '2023-02-14'
    }
  ];
  
  // Filter and sort the leaderboard data
  const sortedLeaderboard = [...mockLeaderboard]
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });
  
  // Only show first 3 users initially
  const displayedUsers = showMoreUsers ? sortedLeaderboard : sortedLeaderboard.slice(0, 3);
  
  // Handle sort button click
  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to descending for new field
      setSortBy(field);
      setSortDirection('desc');
    }
  };
  
  // Get the appropriate icon for a category
  const getCategoryIcon = (category: SortField) => {
    switch (category) {
      case 'cryptoEarned':
        return <DollarSign className="h-4 w-4" />;
      case 'modelsSold':
        return <Trophy className="h-4 w-4" />;
      case 'contributions':
        return <GitBranch className="h-4 w-4" />;
      case 'testingFeedback':
        return <Eye className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  // Get badge color
  const getBadgeColor = (badge: string) => {
    const badgeColors: Record<string, string> = {
      'Open Source Contributor': 'bg-blue-900/40 border-blue-500/30 text-blue-400',
      'Verified Developer': 'bg-green-900/40 border-green-500/30 text-green-400',
      'Beta Model Tester': 'bg-purple-900/40 border-purple-500/30 text-purple-400',
      'Top Seller': 'bg-amber-900/40 border-amber-500/30 text-amber-400',
      'Bug Hunter': 'bg-red-900/40 border-red-500/30 text-red-400'
    };
    
    return badgeColors[badge] || 'bg-gray-900/40 border-gray-500/30 text-gray-400';
  };
  
  // If not mounted yet (server rendering), show a placeholder
  if (!mounted) {
    return (
      <section className="py-16 px-4 relative">
        <div className="container mx-auto">
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-16 px-4 relative">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              Web3 Community Leaderboard
            </h2>
            <p className="text-gray-400 max-w-2xl">
              Top contributors and model creators in our community, earning rewards in crypto.
            </p>
          </div>
          
          <div className="flex gap-2 mt-4 md:mt-0">
            <AnimatedButton
              variant="outline"
              size="sm"
              onClick={() => toggleCryptoEarnings()}
              className="whitespace-nowrap"
            >
              <span className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                {showCryptoEarnings ? 'Hide Earnings' : 'Show Earnings'}
              </span>
            </AnimatedButton>
            
            <AnimatedButton
              variant="outline"
              size="sm"
              onClick={() => setFilterActive(!filterActive)}
              className="whitespace-nowrap"
            >
              <span className="flex items-center">
                <Filter className="w-4 h-4 mr-1" />
                Filter
              </span>
            </AnimatedButton>
          </div>
        </div>
        
        {/* Sort tabs */}
        {filterActive && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex flex-wrap gap-2"
          >
            {(['cryptoEarned', 'modelsSold', 'contributions', 'testingFeedback'] as SortField[]).map((field) => (
              <button
                key={field}
                onClick={() => handleSort(field)}
                className={`px-3 py-1.5 rounded-md text-sm flex items-center ${
                  sortBy === field 
                    ? 'bg-purple-600/40 text-white' 
                    : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700/70'
                }`}
              >
                {getCategoryIcon(field)}
                <span className="ml-1 capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</span>
                {sortBy === field && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        )}
        
        {/* Leaderboard grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <AnimatedCard hoverEffect="lift" className="h-full">
                <div className="p-6">
                  {/* User header */}
                  <div className="flex items-center mb-4">
                    <div className="relative">
                      <img 
                        src={user.avatarUrl} 
                        alt={user.username}
                        className="w-12 h-12 rounded-full object-cover border-2 border-purple-500"
                      />
                      {index < 3 && (
                        <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-300' : 'bg-amber-700'
                        }`}>
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <h3 className="font-bold">{user.username}</h3>
                      <p className="text-xs text-gray-400">Joined {new Date(user.joinedDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-800/50 rounded-lg p-2">
                      <div className="flex items-center text-xs text-gray-400 mb-1">
                        <Trophy className="w-3 h-3 mr-1" /> Models Sold
                      </div>
                      <p className="text-lg font-bold">{user.modelsSold}</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-2">
                      <div className="flex items-center text-xs text-gray-400 mb-1">
                        <DollarSign className="w-3 h-3 mr-1" /> Earned
                      </div>
                      <p className="text-lg font-bold">
                        {showCryptoEarnings ? `${user.cryptoEarned} ETH` : '***'}
                      </p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-2">
                      <div className="flex items-center text-xs text-gray-400 mb-1">
                        <GitBranch className="w-3 h-3 mr-1" /> Contributions
                      </div>
                      <p className="text-lg font-bold">{user.contributions}</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-2">
                      <div className="flex items-center text-xs text-gray-400 mb-1">
                        <Eye className="w-3 h-3 mr-1" /> Test Feedback
                      </div>
                      <p className="text-lg font-bold">{user.testingFeedback}</p>
                    </div>
                  </div>
                  
                  {/* Badges */}
                  {user.badges.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-xs text-gray-400 mb-2">Web3 Badges</h4>
                      <div className="flex flex-wrap gap-2">
                        {user.badges.map((badge, i) => (
                          <div key={i} className={`text-xs px-2 py-1 rounded-full border ${getBadgeColor(badge)}`}>
                            {badge}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Wallet address truncated */}
                  <div className="text-xs text-gray-500 font-mono mt-2 flex items-center">
                    <span className="mr-1">Wallet:</span> {user.walletAddress}
                  </div>
                </div>
              </AnimatedCard>
            </motion.div>
          ))}
        </div>
        
        {/* Load more button */}
        {!showMoreUsers && sortedLeaderboard.length > 3 && (
          <div className="mt-8 text-center">
            <AnimatedButton 
              variant="outline"
              size="lg"
              onClick={() => setShowMoreUsers(true)}
            >
              Show More Contributors
            </AnimatedButton>
          </div>
        )}
      </div>
    </section>
  );
} 