"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OptimizedImage from "@/components/OptimizedImage";
import { useSupabase } from '@/providers/SupabaseProvider';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Search, 
  Award, 
  Code, 
  Star, 
  ThumbsUp, 
  Download, 
  Filter, 
  ArrowDown, 
  ArrowUp,
  Zap,
  CheckCircle
} from 'lucide-react';

// Define our Creator interface
interface Creator {
  id: string;
  name: string;
  username?: string;
  avatar?: string;
  image?: string;
  role?: string;
  bio?: string;
  verified?: boolean;
  followers: number;
  models: number;
  openSourceModels: number;
  totalDownloads: number;
  averageRating: number;
  badges?: string[];
  joinedDate?: string;
}

// Define sorting options
type SortOption = 'followers' | 'models' | 'downloads' | 'rating';

export default function CreatorsPage() {
  const { user } = useSupabase();
  const router = useRouter();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('followers');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterOpenSource, setFilterOpenSource] = useState(false);
  const [filterVerified, setFilterVerified] = useState(false);
  
  // Function to fetch creators with proper MongoDB aggregation
  const fetchCreators = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Build the API URL with query parameters for sorting and filtering
      let url = `/api/creators?sortBy=${sortBy}&sortDirection=${sortDirection}`;
      
      if (filterOpenSource) {
        url += '&openSourceOnly=true';
      }
      
      if (filterVerified) {
        url += '&verifiedOnly=true';
      }
      
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch creators: ${response.status}`);
      }
      
      const data = await response.json();
      setCreators(data);
      console.log(`✅ Loaded ${data.length} creators`);
    } catch (error) {
      console.error('Error fetching creators:', error);
      // Instead of falling back to sample data, we show empty state
      setCreators([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, sortBy, sortDirection, filterOpenSource, filterVerified]);
  
  // Fetch creators on mount and when dependencies change
  useEffect(() => {
    fetchCreators();
  }, [fetchCreators]);
  
  // Handler for becoming a creator
  const handleBecomeCreator = () => {
    if (user) {
      router.push('/dashboard/models');
    } else {
      router.push('/signup?redirect=creator');
    }
  };
  
  // Function to format large numbers
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };
  
  // Function to render creator badges
  const renderBadges = (creator: Creator) => {
    const badges = [];
    
    if (creator.openSourceModels > 0) {
      badges.push(
        <span key="opensource" className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs flex items-center">
          <Code className="w-3 h-3 mr-1" /> Open Source
        </span>
      );
    }
    
    if (creator.verified) {
      badges.push(
        <span key="verified" className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs flex items-center">
          <CheckCircle className="w-3 h-3 mr-1" /> Verified
        </span>
      );
    }
    
    if (creator.models >= 5) {
      badges.push(
        <span key="prolific" className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs flex items-center">
          <Zap className="w-3 h-3 mr-1" /> Prolific
        </span>
      );
    }
    
    return badges;
  };
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-28 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/20 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-60 -left-20 w-80 h-80 bg-blue-600/20 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                Creator Leaderboard
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Discover the top AI model creators on Neural Nexus. All creators here have published at least one model to the platform.
            </p>
            
            {!user && (
              <button
                onClick={handleBecomeCreator}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Become a Creator
              </button>
            )}
          </motion.div>
        </div>
      </section>
      
      {/* Filter and Search */}
      <section className="py-8 px-4 bg-gray-900/50">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search creators..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <div className="flex items-center">
                <label className="mr-2 text-sm">Sort by:</label>
                <select
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  aria-label="Sort creators by"
                >
                  <option value="followers">Followers</option>
                  <option value="models">Models</option>
                  <option value="downloads">Downloads</option>
                  <option value="rating">Rating</option>
                </select>
                <button
                  className="ml-2 p-2 bg-gray-800 border border-gray-700 rounded-lg"
                  onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                >
                  {sortDirection === 'asc' ? 
                    <ArrowUp size={16} /> : 
                    <ArrowDown size={16} />
                  }
                </button>
              </div>
              
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterOpenSource}
                    onChange={() => setFilterOpenSource(!filterOpenSource)}
                    className="form-checkbox h-4 w-4 text-purple-600 rounded focus:ring-purple-500 border-gray-700 bg-gray-800"
                  />
                  <span className="text-sm">Open Source Only</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterVerified}
                    onChange={() => setFilterVerified(!filterVerified)}
                    className="form-checkbox h-4 w-4 text-purple-600 rounded focus:ring-purple-500 border-gray-700 bg-gray-800"
                  />
                  <span className="text-sm">Verified Only</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Creators Leaderboard */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          {isLoading ? (
            // Loading state
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(9).fill(0).map((_, index) => (
                <div key={index} className="bg-gray-800/30 rounded-xl overflow-hidden border border-gray-700/50 animate-pulse">
                  <div className="p-6 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-700/50"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-700/50 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-700/50 rounded w-1/3 mb-4"></div>
                      <div className="flex gap-2">
                        <div className="h-6 bg-gray-700/50 rounded-full w-20"></div>
                      </div>
                    </div>
                    <div className="h-8 w-8 bg-gray-700/50 rounded-full"></div>
                  </div>
                  <div className="px-6 pb-6">
                    <div className="h-4 bg-gray-700/50 rounded w-full mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-700/50 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-700/50 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-700/50 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : creators.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creators.map((creator, index) => (
                <Link 
                  href={`/creators/${creator.username || creator.id}`} 
                  key={creator.id}
                  className="group"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-gray-800/30 rounded-xl overflow-hidden border border-gray-700/50 hover:border-purple-500/50 transition-colors group-hover:shadow-lg group-hover:shadow-purple-500/10"
                  >
                    <div className="p-6 flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-purple-600/20 to-blue-600/20">
                        {creator.avatar || creator.image ? (
                          <OptimizedImage 
                            src={(creator.avatar || creator.image) as string}
                            alt={creator.name}
                            className="w-full h-full object-cover"
                            aspectRatio="square"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                            {creator.name.charAt(0)}
                          </div>
                        )}
                        {index < 3 && (
                          <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0 ? 'bg-yellow-500' : 
                            index === 1 ? 'bg-gray-300' : 'bg-amber-700'
                          }`}>
                            {index + 1}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 overflow-hidden">
                        <h3 className="text-lg font-bold truncate group-hover:text-purple-400 transition-colors">
                          {creator.name}
                          {creator.verified && (
                            <span className="ml-1 inline-flex items-center justify-center text-blue-400">
                              <CheckCircle className="w-4 h-4" />
                            </span>
                          )}
                        </h3>
                        <p className="text-gray-400 text-sm truncate">
                          {creator.role || `@${creator.username || creator.id.substring(0, 8)}`}
                        </p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {renderBadges(creator)}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-xl font-bold text-purple-400">
                          #{index + 1}
                        </div>
                      </div>
                    </div>
                    
                    <div className="px-6 pb-6">
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                        {creator.bio || "Creator on Neural Nexus platform"}
                      </p>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="flex flex-col items-center p-2 rounded-lg bg-gray-800/50">
                          <span className="font-bold">{formatNumber(creator.followers)}</span>
                          <span className="text-gray-400 text-xs">Followers</span>
                        </div>
                        <div className="flex flex-col items-center p-2 rounded-lg bg-gray-800/50">
                          <span className="font-bold">{formatNumber(creator.models)}</span>
                          <span className="text-gray-400 text-xs">Models</span>
                        </div>
                        <div className="flex flex-col items-center p-2 rounded-lg bg-gray-800/50">
                          <span className="font-bold">{creator.averageRating.toFixed(1)}</span>
                          <span className="text-gray-400 text-xs">Rating</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <div className="bg-gray-800/30 rounded-xl p-10 border border-gray-700/50 max-w-2xl mx-auto">
                <h3 className="text-xl font-bold mb-3">No Creators Found</h3>
                <p className="text-gray-400 mb-6">
                  {searchTerm || filterOpenSource || filterVerified ? 
                    "No creators match your current filters. Try adjusting your search criteria." : 
                    "There are no creators available at the moment."}
                </p>
                <button
                  onClick={handleBecomeCreator}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
                >
                  Become the First Creator
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Join CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
        <div className="container mx-auto text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join the Creator Community
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Share your AI models, build your reputation, and connect with a global community of AI enthusiasts.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={handleBecomeCreator}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Start Creating Today
              </button>
              <Link
                href="/community"
                className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
              >
                Explore Community
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
} 