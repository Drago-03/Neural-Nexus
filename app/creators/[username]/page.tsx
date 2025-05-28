"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OptimizedImage from "@/components/OptimizedImage";
import { useSupabase } from '@/providers/SupabaseProvider';
import { 
  Users, 
  Star, 
  Download, 
  Calendar, 
  Code, 
  CheckCircle,
  ArrowLeft,
  ExternalLink,
  MessageSquare,
  UserPlus,
  Zap,
  Share2
} from 'lucide-react';

// Define Creator and Model interfaces
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
  joinedDate?: string;
  website?: string;
  github?: string;
  twitter?: string;
}

interface Model {
  id: string;
  name: string;
  description: string;
  image?: string;
  downloads: number;
  rating: number;
  createdAt: string;
  license?: string;
  tags: string[];
}

export default function CreatorDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useSupabase();
  const username = params.username as string;
  
  const [creator, setCreator] = useState<Creator | null>(null);
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'models' | 'about'>('models');
  
  // Fetch creator data
  useEffect(() => {
    const fetchCreator = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/creators/${username}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            // Creator not found
            router.push('/creators');
            return;
          }
          throw new Error(`Failed to fetch creator: ${response.status}`);
        }
        
        const data = await response.json();
        setCreator(data);
        
        // Check if user is following this creator
        if (user) {
          const followResponse = await fetch(`/api/users/following?creatorId=${data.id}`);
          if (followResponse.ok) {
            const { isFollowing } = await followResponse.json();
            setIsFollowing(isFollowing);
          }
        }
        
        // Fetch creator's models
        const modelsResponse = await fetch(`/api/creators/${username}/models`);
        if (modelsResponse.ok) {
          const modelsData = await modelsResponse.json();
          setModels(modelsData);
        }
      } catch (error) {
        console.error('Error fetching creator:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (username) {
      fetchCreator();
    }
  }, [username, user, router]);
  
  // Handle follow/unfollow
  const handleFollowToggle = async () => {
    if (!user) {
      router.push(`/signup?redirect=creators/${username}`);
      return;
    }
    
    try {
      const action = isFollowing ? 'unfollow' : 'follow';
      const response = await fetch(`/api/users/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ creatorId: creator?.id }),
      });
      
      if (response.ok) {
        setIsFollowing(!isFollowing);
        // Update follower count
        if (creator) {
          setCreator({
            ...creator,
            followers: isFollowing ? creator.followers - 1 : creator.followers + 1,
          });
        }
      }
    } catch (error) {
      console.error(`Error ${isFollowing ? 'unfollowing' : 'following'} creator:`, error);
    }
  };
  
  // Format numbers for display
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };
  
  // Format date for display
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  // Handle share functionality
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${creator?.name} on Neural Nexus`,
        text: `Check out ${creator?.name}'s AI models on Neural Nexus!`,
        url: window.location.href,
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Profile link copied to clipboard!');
    }
  };
  
  // Loading skeleton
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <Navbar />
        <div className="pt-28 pb-16 px-4">
          <div className="container mx-auto">
            {/* Header skeleton */}
            <div className="animate-pulse">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-700/50"></div>
                <div className="flex-1">
                  <div className="h-8 bg-gray-700/50 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-700/50 rounded w-1/4 mb-6"></div>
                  <div className="h-4 bg-gray-700/50 rounded w-full max-w-2xl mb-6"></div>
                  <div className="flex gap-4">
                    <div className="h-10 w-24 bg-gray-700/50 rounded-lg"></div>
                    <div className="h-10 w-24 bg-gray-700/50 rounded-lg"></div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="bg-gray-800/30 rounded-xl p-4">
                    <div className="h-6 bg-gray-700/50 rounded w-1/2 mb-2"></div>
                    <div className="h-8 bg-gray-700/50 rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }
  
  // Creator not found
  if (!creator) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <Navbar />
        <div className="pt-28 pb-16 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Creator Not Found</h1>
            <p className="text-gray-400 mb-8">The creator you're looking for doesn't exist or has been removed.</p>
            <Link 
              href="/creators"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors inline-flex items-center"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Creators
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />
      
      {/* Creator Profile Header */}
      <section className="pt-28 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/20 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-60 -left-20 w-80 h-80 bg-blue-600/20 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <Link 
            href="/creators"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Creators
          </Link>
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Creator Avatar */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gradient-to-br from-purple-600/20 to-blue-600/20 border-4 border-gray-800"
            >
              {creator.avatar || creator.image ? (
                <OptimizedImage 
                  src={(creator.avatar || creator.image) as string}
                  alt={creator.name}
                  className="w-full h-full object-cover"
                  aspectRatio="square"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold">
                  {creator.name.charAt(0)}
                </div>
              )}
              {creator.verified && (
                <div className="absolute bottom-1 right-1 bg-blue-500 text-white rounded-full p-1">
                  <CheckCircle className="w-5 h-5" />
                </div>
              )}
            </motion.div>
            
            {/* Creator Info */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold">{creator.name}</h1>
                  {creator.verified && (
                    <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" /> Verified
                    </span>
                  )}
                  {creator.openSourceModels > 0 && (
                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs flex items-center">
                      <Code className="w-3 h-3 mr-1" /> Open Source Contributor
                    </span>
                  )}
                  {creator.models >= 5 && (
                    <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-xs flex items-center">
                      <Zap className="w-3 h-3 mr-1" /> Prolific Creator
                    </span>
                  )}
                </div>
                
                <p className="text-gray-400 text-lg mb-4">
                  {creator.role || `@${creator.username || creator.id.substring(0, 8)}`}
                </p>
                
                <p className="text-gray-300 mb-6 max-w-2xl">
                  {creator.bio || "No bio provided."}
                </p>
                
                <div className="flex flex-wrap gap-3 mb-6">
                  <div className="flex items-center text-gray-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Joined {formatDate(creator.joinedDate)}</span>
                  </div>
                  
                  {creator.website && (
                    <a
                      href={creator.website.startsWith('http') ? creator.website : `https://${creator.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-400 hover:text-purple-400 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      <span>Website</span>
                    </a>
                  )}
                  
                  {creator.github && (
                    <a
                      href={`https://github.com/${creator.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-400 hover:text-purple-400 transition-colors"
                    >
                      <Code className="w-4 h-4 mr-2" />
                      <span>GitHub</span>
                    </a>
                  )}
                  
                  {creator.twitter && (
                    <a
                      href={`https://twitter.com/${creator.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-400 hover:text-purple-400 transition-colors"
                    >
                      <span className="mr-2">𝕏</span>
                      <span>Twitter</span>
                    </a>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleFollowToggle}
                    className={`px-4 py-2 rounded-lg font-medium flex items-center transition-colors ${
                      isFollowing 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Follow
                      </>
                    )}
                  </button>
                  
                  {user && (
                    <button
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors flex items-center"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
                    </button>
                  )}
                  
                  <button
                    onClick={handleShare}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors flex items-center"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
          >
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
              <p className="text-gray-400 text-sm mb-1">Followers</p>
              <p className="text-2xl font-bold">{formatNumber(creator.followers)}</p>
            </div>
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
              <p className="text-gray-400 text-sm mb-1">Models</p>
              <p className="text-2xl font-bold">{formatNumber(creator.models)}</p>
            </div>
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
              <p className="text-gray-400 text-sm mb-1">Downloads</p>
              <p className="text-2xl font-bold">{formatNumber(creator.totalDownloads)}</p>
            </div>
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
              <p className="text-gray-400 text-sm mb-1">Avg. Rating</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold">{creator.averageRating.toFixed(1)}</p>
                <Star className="w-5 h-5 text-yellow-500 ml-1 fill-yellow-500" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Tabs */}
      <section className="border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex">
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === 'models' 
                  ? 'text-white border-b-2 border-purple-500' 
                  : 'text-gray-400 hover:text-white transition-colors'
              }`}
              onClick={() => setActiveTab('models')}
            >
              Models
            </button>
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === 'about' 
                  ? 'text-white border-b-2 border-purple-500' 
                  : 'text-gray-400 hover:text-white transition-colors'
              }`}
              onClick={() => setActiveTab('about')}
            >
              About
            </button>
          </div>
        </div>
      </section>
      
      {/* Content based on active tab */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          {activeTab === 'models' ? (
            // Models tab
            models.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {models.map((model, index) => (
                  <Link 
                    href={`/models/${model.id}`} 
                    key={model.id}
                    className="group"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-gray-800/30 rounded-xl overflow-hidden border border-gray-700/50 hover:border-purple-500/50 transition-colors group-hover:shadow-lg group-hover:shadow-purple-500/10"
                    >
                      {/* Model Card Content */}
                      <div className="h-40 bg-gradient-to-br from-purple-900/30 to-blue-900/30 relative overflow-hidden">
                        {model.image ? (
                          <OptimizedImage 
                            src={model.image}
                            alt={model.name}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-gray-600">
                            {model.name.charAt(0)}
                          </div>
                        )}
                        {model.license === 'open-source' && (
                          <div className="absolute top-2 right-2 bg-green-500/90 text-white text-xs px-2 py-1 rounded-full flex items-center">
                            <Code className="w-3 h-3 mr-1" />
                            Open Source
                          </div>
                        )}
                      </div>
                      
                      <div className="p-5">
                        <h3 className="text-lg font-bold mb-2 group-hover:text-purple-400 transition-colors">
                          {model.name}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                          {model.description}
                        </p>
                        
                        <div className="flex justify-between text-sm">
                          <div className="flex items-center text-gray-400">
                            <Download className="w-4 h-4 mr-1" />
                            {formatNumber(model.downloads)}
                          </div>
                          <div className="flex items-center text-gray-400">
                            <Star className="w-4 h-4 mr-1 fill-yellow-500 text-yellow-500" />
                            {model.rating.toFixed(1)}
                          </div>
                          <div className="flex items-center text-gray-400">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(model.createdAt).toLocaleDateString()}
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
                  <h3 className="text-xl font-bold mb-3">No Models Found</h3>
                  <p className="text-gray-400 mb-6">
                    This creator hasn't published any models yet.
                  </p>
                </div>
              </div>
            )
          ) : (
            // About tab
            <div className="max-w-3xl mx-auto">
              <div className="bg-gray-800/30 rounded-xl p-8 border border-gray-700/50">
                <h3 className="text-xl font-bold mb-4">About {creator.name}</h3>
                <p className="text-gray-300 mb-6 whitespace-pre-line">
                  {creator.bio || "This creator hasn't added a bio yet."}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-lg font-semibold mb-3">Details</h4>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-gray-400">Joined</span>
                        <span>{formatDate(creator.joinedDate)}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-400">Models</span>
                        <span>{creator.models}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-400">Open Source Models</span>
                        <span>{creator.openSourceModels}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-400">Total Downloads</span>
                        <span>{formatNumber(creator.totalDownloads)}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold mb-3">Links</h4>
                    <ul className="space-y-2">
                      {creator.website && (
                        <li>
                          <a
                            href={creator.website.startsWith('http') ? creator.website : `https://${creator.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-purple-400 hover:underline"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            <span>Website</span>
                          </a>
                        </li>
                      )}
                      
                      {creator.github && (
                        <li>
                          <a
                            href={`https://github.com/${creator.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-purple-400 hover:underline"
                          >
                            <Code className="w-4 h-4 mr-2" />
                            <span>GitHub</span>
                          </a>
                        </li>
                      )}
                      
                      {creator.twitter && (
                        <li>
                          <a
                            href={`https://twitter.com/${creator.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-purple-400 hover:underline"
                          >
                            <span className="mr-2">𝕏</span>
                            <span>Twitter</span>
                          </a>
                        </li>
                      )}
                      
                      {!creator.website && !creator.github && !creator.twitter && (
                        <li className="text-gray-400">No links provided</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </main>
  );
} 