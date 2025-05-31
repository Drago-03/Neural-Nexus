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
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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
  
  // Fetch leaderboard data from API
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setIsLoading(true);
      try {
        // This would be a real API call in production
        // For now, we'll simulate an API response with an empty array
        // In the future, this would be replaced with a real API call:
        // const response = await fetch('/api/leaderboard');
        // const data = await response.json();
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Return empty array - no dummy data
        const data: LeaderboardUser[] = [];
        setLeaderboardData(data);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        setLeaderboardData([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (mounted) {
      fetchLeaderboardData();
    }
  }, [mounted]);
  
  // Filter and sort the leaderboard data
  const sortedLeaderboard = [...leaderboardData]
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
  
  // Render placeholder cards during loading
  const renderPlaceholderCards = (count: number) => {
    return Array(count).fill(0).map((_, index) => (
      <div key={`placeholder-${index}`} className="bg-gray-800/30 rounded-xl h-[300px] animate-pulse">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-gray-700/50"></div>
            <div className="ml-3">
              <div className="h-4 bg-gray-700/50 rounded w-24 mb-2"></div>
              <div className="h-3 bg-gray-700/50 rounded w-32"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-700/30 rounded-lg p-2">
                <div className="h-3 bg-gray-700/50 rounded w-20 mb-2"></div>
                <div className="h-5 bg-gray-700/50 rounded w-10"></div>
              </div>
            ))}
          </div>
          <div className="h-4 bg-gray-700/50 rounded w-full mt-4"></div>
        </div>
      </div>
    ));
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
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderPlaceholderCards(3)}
          </div>
        ) : displayedUsers.length > 0 ? (
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
        ) : (
          <AnimatedCard className="p-8 text-center">
            <h3 className="text-xl font-bold mb-4">No Leaderboard Data Yet</h3>
            <p className="text-gray-400 mb-6">
              Be the first to contribute to the platform and earn your spot on the leaderboard!
            </p>
            <AnimatedButton variant="primary" size="lg" onClick={() => window.location.href = '/upload'}>
              <span className="flex items-center">
                <Trophy className="mr-2 h-5 w-5" />
                Upload a Model
              </span>
            </AnimatedButton>
          </AnimatedCard>
        )}
        
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