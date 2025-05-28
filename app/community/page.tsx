"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OptimizedImage from "@/components/OptimizedImage";
import { useSupabase } from '@/providers/SupabaseProvider';
import { 
  Users, Star, Calendar, MessageSquare, ArrowRight, 
  Zap, Award, Sparkles, TrendingUp, Globe, Heart, ChevronLeft, ChevronRight, Upload, Code, Wallet, Repeat, DollarSign, Server, Cpu, BarChart3, Network, ShieldCheck, Bot, Share, Download
} from 'lucide-react';

// Define types for our data
interface Creator {
  id?: string;
  name: string;
  role: string;
  bio: string;
  image?: string;
  avatar?: string; // Added for the API response
  username?: string; // Added for the API response
  verified?: boolean; // Added for the API response
  tags?: string[];
  models: number;
  followers: number;
}

interface Model {
  id?: string;
  name: string;
  creator: string;
  category: string;
  image: string;
  likes: number;
  downloads: number;
}

interface Event {
  id?: string;
  title: string;
  date: string;
  location: string;
  image: string;
  attendees: number;
}

interface Discussion {
  title: string;
  author: string;
  replies: number;
  likes: number;
  tags: string[];
}

export default function CommunityPage() {
  const { user } = useSupabase();
  const [activeTab, setActiveTab] = useState('trending');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    members: 0,
    models: 0,
    discussions: 0,
    countries: 0
  });
  const [featuredCreators, setFeaturedCreators] = useState<Creator[]>([]);
  const [trendingModels, setTrendingModels] = useState<Model[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [isCreatorsLoading, setIsCreatorsLoading] = useState(true);
  const [isModelsLoading, setIsModelsLoading] = useState(true);
  const [isEventsLoading, setIsEventsLoading] = useState(true);

  // Fetch real stats from API when component mounts
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/community/stats');
        
        if (response.ok) {
          const data = await response.json();
          setStats({
            members: data.members,
            models: data.models,
            discussions: data.discussions,
            countries: data.countries
          });
          console.log("✅ Loaded community stats:", data);
        } else {
          console.error("❌ Failed to fetch community stats:", response.status);
          // Keep fallback values
        }
      } catch (error) {
        console.error("❌ Error fetching community stats:", error);
        // Keep fallback values
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);
  
  // Fetch featured creators
  useEffect(() => {
    const fetchCreators = async () => {
      try {
        setIsCreatorsLoading(true);
        const response = await fetch('/api/community/featured-creators');
        
        if (response.ok) {
          const data = await response.json();
          setFeaturedCreators(data);
          console.log("✅ Loaded featured creators:", data.length);
        } else {
          console.error("❌ Failed to fetch featured creators:", response.status);
          // Keep fallback values
        }
      } catch (error) {
        console.error("❌ Error fetching featured creators:", error);
        // Keep fallback values
      } finally {
        setIsCreatorsLoading(false);
      }
    };

    fetchCreators();
  }, []);
  
  // Fetch trending models
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setIsModelsLoading(true);
        const response = await fetch('/api/community/trending-models');
        
        if (response.ok) {
          const data = await response.json();
          setTrendingModels(data);
          console.log("✅ Loaded trending models:", data.length);
        } else {
          console.error("❌ Failed to fetch trending models:", response.status);
          // Keep fallback values
        }
      } catch (error) {
        console.error("❌ Error fetching trending models:", error);
        // Keep fallback values
      } finally {
        setIsModelsLoading(false);
      }
    };

    fetchModels();
  }, []);

  // Fetch upcoming events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsEventsLoading(true);
        const response = await fetch('/api/community/upcoming-events');
        
        if (response.ok) {
          const data = await response.json();
          setUpcomingEvents(data);
          console.log("✅ Loaded upcoming events:", data.length);
        } else {
          console.error("❌ Failed to fetch upcoming events:", response.status);
          // Keep fallback values
        }
      } catch (error) {
        console.error("❌ Error fetching upcoming events:", error);
        // Keep fallback values
      } finally {
        setIsEventsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Format numbers for display
  const formatNumber = (num: number): string => {
    // Handle edge cases: null, undefined, NaN
    if (num === null || num === undefined || isNaN(num)) {
      return '0+';
    }
    
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K+';
    }
    return num.toString() + '+';
  };

  const discussions: Discussion[] = [
    {
      title: "Best practices for fine-tuning large language models",
      author: "AIExpert",
      replies: 45,
      likes: 123,
      tags: ["LLM", "Training"]
    },
    {
      title: "How to optimize transformer models for production",
      author: "PerfGuru",
      replies: 32,
      likes: 98,
      tags: ["Optimization", "Production"]
    },
    {
      title: "Future of AI model marketplaces",
      author: "FutureAI",
      replies: 67,
      likes: 156,
      tags: ["Market", "Trends"]
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
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
              Join Our Thriving
              <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                AI Creator Community
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Connect with fellow creators, share your models, and stay updated with the latest in AI innovation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {!user && (
                <Link
                  href="/signup"
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Join Community
                </Link>
              )}
              <Link
                href="/discord"
                className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
              >
                Join Discord
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: <Users className="h-6 w-6 text-purple-400" />, label: "Active Members", value: formatNumber(stats.members) },
              { icon: <Star className="h-6 w-6 text-yellow-400" />, label: "AI Models Shared", value: formatNumber(stats.models) },
              { icon: <MessageSquare className="h-6 w-6 text-blue-400" />, label: "Daily Discussions", value: formatNumber(stats.discussions) },
              { icon: <Globe className="h-6 w-6 text-green-400" />, label: "Countries", value: formatNumber(stats.countries) }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
              >
                <div className="flex items-center gap-4">
                  {stat.icon}
                  <div>
                    <div className="text-2xl font-bold">{isLoading ? "..." : stat.value}</div>
                    <div className="text-gray-400">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Library Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-pink-900/20">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400">
              Showcase Library
            </h2>
            <p className="text-xl text-gray-300">
              Explore our curated collection of cutting-edge AI models, from image generation to natural language processing. 
              Each model is verified and ready to revolutionize your projects.
            </p>
          </motion.div>

          {/* Feature Cards Container */}
          <div className="relative">
            {/* Navigation Buttons */}
            <button 
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-gray-800/80 rounded-full backdrop-blur-sm hover:bg-gray-700/80 transition-colors hidden md:block"
              onClick={() => {
                const container = document.getElementById('feature-scroll');
                if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
              }}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <button 
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-gray-800/80 rounded-full backdrop-blur-sm hover:bg-gray-700/80 transition-colors hidden md:block"
              onClick={() => {
                const container = document.getElementById('feature-scroll');
                if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
              }}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Scrollable Cards Container */}
            <div 
              id="feature-scroll"
              className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4"
            >
              {[
                {
                  icon: <Upload className="h-8 w-8 text-blue-400" />,
                  title: "Upload Your Model Securely",
                  description: "Advanced encryption and secure storage for your valuable AI models",
                  color: "from-blue-500/20 to-cyan-500/20",
                  iconBg: "from-blue-500 to-cyan-500"
                },
                {
                  icon: <Code className="h-8 w-8 text-green-400" />,
                  title: "Test & Demo Before Publishing",
                  description: "Let users try your model with custom demo environments",
                  color: "from-green-500/20 to-teal-500/20",
                  iconBg: "from-green-500 to-teal-500"
                },
                {
                  icon: <Wallet className="h-8 w-8 text-purple-400" />,
                  title: "Sell With Crypto & UPI",
                  description: "Multiple payment options including cryptocurrencies and traditional methods",
                  color: "from-purple-500/20 to-indigo-500/20",
                  iconBg: "from-purple-500 to-indigo-500"
                },
                {
                  icon: <Repeat className="h-8 w-8 text-pink-400" />,
                  title: "Permanent Ownership Transfer",
                  description: "Blockchain-verified transfer of complete ownership rights",
                  color: "from-pink-500/20 to-rose-500/20",
                  iconBg: "from-pink-500 to-rose-500"
                },
                {
                  icon: <DollarSign className="h-8 w-8 text-amber-400" />,
                  title: "Earn Royalties on Reuse",
                  description: "Continue earning when your model is used in commercial applications",
                  color: "from-amber-500/20 to-yellow-500/20",
                  iconBg: "from-amber-500 to-yellow-500"
                },
                {
                  icon: <Server className="h-8 w-8 text-cyan-400" />,
                  title: "GPU Turbo Scaling",
                  description: "Auto-scaling GPU clusters that flex with demand - no more waiting for compute power to free up",
                  color: "from-cyan-500/20 to-blue-500/20",
                  iconBg: "from-cyan-500 to-blue-500"
                },
                {
                  icon: <Cpu className="h-8 w-8 text-red-400" />,
                  title: "Custom ASIC Support",
                  description: "Deploy to specialized hardware for 10x faster inference - your models deserve the best silicon",
                  color: "from-red-500/20 to-orange-500/20",
                  iconBg: "from-red-500 to-orange-500"
                },
                {
                  icon: <BarChart3 className="h-8 w-8 text-emerald-400" />,
                  title: "Real-time Analytics",
                  description: "Track model performance with sick dashboards showing usage patterns and bottlenecks",
                  color: "from-emerald-500/20 to-green-500/20",
                  iconBg: "from-emerald-500 to-green-500"
                },
                {
                  icon: <Network className="h-8 w-8 text-violet-400" />,
                  title: "Edge Deployment",
                  description: "Push optimized versions straight to IoT devices for ultra-low latency vibes",
                  color: "from-violet-500/20 to-purple-500/20",
                  iconBg: "from-violet-500 to-purple-500"
                },
                {
                  icon: <ShieldCheck className="h-8 w-8 text-indigo-400" />,
                  title: "Compliance Guardrails",
                  description: "Built-in safety checks that keep your models lit without crossing ethical boundaries",
                  color: "from-indigo-500/20 to-blue-500/20",
                  iconBg: "from-indigo-500 to-blue-500"
                },
                {
                  icon: <Bot className="h-8 w-8 text-fuchsia-400" />,
                  title: "Automated Fine-tuning",
                  description: "AI that tunes your AI - meta optimizations that level up performance while you sleep",
                  color: "from-fuchsia-500/20 to-pink-500/20",
                  iconBg: "from-fuchsia-500 to-pink-500"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="min-w-[300px] md:min-w-[400px] snap-center"
                >
                  <div className={`h-full bg-gradient-to-br ${feature.color} backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-gray-600/50 transition-all`}>
                    <div className={`w-14 h-14 mb-6 rounded-xl bg-gradient-to-br ${feature.iconBg} flex items-center justify-center`}>
                      {feature.icon}
                  </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                    <Link 
                      href="#" 
                      className="inline-flex items-center mt-4 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      Learn more <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
                </div>
              </div>
              
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              href={user ? "/dashboard/models" : "/signup?redirect=creator"}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg font-medium hover:opacity-90 transition-opacity flex-1 text-center"
            >
              Become a Creator
            </Link>
            <Link
              href={user ? "/dashboard/models/upload" : "/signup?redirect=upload"}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors flex-1 text-center"
            >
              Submit a Model
            </Link>
            <Link
              href="/events"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors flex-1 text-center flex items-center justify-center"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Explore Events
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing and Computing Options Teaser */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-900/20 via-indigo-900/20 to-cyan-900/20">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
              Advanced Computing Options
            </h2>
            <p className="text-xl text-gray-300 mb-6">
              Take your AI models to the next level with our cutting-edge computing infrastructure. 
              Choose from 9 specialized computing options designed for every use case.
            </p>
          </motion.div>

          <div className="bg-gray-800/30 rounded-xl p-8 border border-gray-700/50 max-w-4xl mx-auto">
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="flex flex-col items-center">
                <Server className="h-12 w-12 text-cyan-400 mb-3" />
                <p className="text-center text-gray-300">GPU Turbo Scaling</p>
              </div>
              <div className="flex flex-col items-center">
                <Cpu className="h-12 w-12 text-red-400 mb-3" />
                <p className="text-center text-gray-300">Custom ASIC Support</p>
              </div>
              <div className="flex flex-col items-center">
                <Network className="h-12 w-12 text-violet-400 mb-3" />
                <p className="text-center text-gray-300">Edge Deployment</p>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-gray-300 mb-6">
                Explore all 9 computing options with transparent pricing on our pricing page.
              </p>
              <Link
                href="/pricing#computing-options"
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-medium hover:opacity-90 transition-opacity inline-flex items-center"
              >
                View Pricing and Computing Options <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Creators */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Creators</h2>
              <p className="text-gray-400">Check out these amazing AI model creators</p>
            </div>
            <Link
              href="/creators"
              className="mt-4 md:mt-0 text-purple-400 hover:text-purple-300 transition-colors flex items-center"
            >
              View All Creators
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isCreatorsLoading ? (
              // Show skeleton loaders while loading
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="bg-gray-800/30 rounded-xl overflow-hidden border border-gray-700/50 animate-pulse">
                  <div className="h-48 bg-gray-700/50"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-700/50 rounded w-2/3 mb-2"></div>
                    <div className="h-4 bg-gray-700/50 rounded w-1/3 mb-3"></div>
                    <div className="h-4 bg-gray-700/50 rounded w-full mb-4"></div>
                    <div className="flex gap-2 mb-4">
                      <div className="h-6 bg-gray-700/50 rounded-full w-20"></div>
                      <div className="h-6 bg-gray-700/50 rounded-full w-20"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-700/50 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-700/50 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : featuredCreators.length > 0 ? (
              featuredCreators.map((creator, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800/30 rounded-xl overflow-hidden border border-gray-700/50"
                >
                  <div className="h-48 relative">
                    <OptimizedImage
                      src={creator.image || creator.avatar || '/images/placeholder-user.jpg'}
                      alt={creator.name}
                      className="w-full h-full"
                      aspectRatio="auto"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">
                      {creator.name}
                      {creator.verified && 
                        <span className="ml-2 inline-flex items-center justify-center w-4 h-4 bg-blue-500 rounded-full" title="Verified creator">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-white">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </span>
                      }
                    </h3>
                    <p className="text-purple-400 mb-3">{creator.role}</p>
                    <p className="text-gray-300 mb-4">{creator.bio}</p>
                    <div className="flex gap-2 mb-4">
                      {creator.tags && creator.tags.map((tag, i) => (
                        <span key={i} className="text-sm bg-gray-700/50 px-3 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                      {!creator.tags && creator.username && 
                        <span className="text-sm bg-gray-700/50 px-3 py-1 rounded-full">
                          @{creator.username}
                        </span>
                      }
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>{typeof creator.models === 'number' ? creator.models : 0} Models</span>
                      <span>{typeof creator.followers === 'number' ? creator.followers : 0} Followers</span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 py-20 text-center">
                <div className="bg-gray-800/30 rounded-xl p-10 border border-gray-700/50">
                  <h3 className="text-xl font-bold mb-3">No Creators Found</h3>
                  <p className="text-gray-400 mb-6">There are no featured creators available at the moment.</p>
                  <Link
                    href={user ? "/dashboard/models" : "/signup?redirect=creator"}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
                  >
                    Become a Creator
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trending Models */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Trending Models</h2>
              <p className="text-gray-400">Popular AI models getting attention right now</p>
            </div>
            <div className="flex mt-4 md:mt-0 gap-4">
              <Link href="/models" className="text-purple-400 hover:text-purple-300 transition-colors flex items-center">
                Explore All Models
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/creators" className="text-purple-400 hover:text-purple-300 transition-colors flex items-center">
                Meet The Creators
                <Users className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
            
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isModelsLoading ? (
              // Show skeleton loaders while loading
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="bg-gray-800/30 rounded-xl overflow-hidden border border-gray-700/50 animate-pulse">
                  <div className="h-48 bg-gray-700/50"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-700/50 rounded w-1/3 mb-2"></div>
                    <div className="h-6 bg-gray-700/50 rounded w-2/3 mb-2"></div>
                    <div className="h-4 bg-gray-700/50 rounded w-1/2 mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-700/50 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-700/50 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : trendingModels.length > 0 ? (
              trendingModels.map((model, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800/30 rounded-xl overflow-hidden border border-gray-700/50"
                >
                  <div className="h-48 relative">
                    <OptimizedImage
                      src={model.image}
                      alt={model.name}
                      className="w-full h-full"
                      aspectRatio="auto"
                    />
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-purple-400 mb-2">{model.category || 'AI Model'}</div>
                    <h3 className="text-xl font-bold mb-2">{model.name}</h3>
                    <p className="text-gray-400 mb-4">by {typeof model.creator === 'string' ? model.creator : 'Unknown Creator'}</p>
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" /> {typeof model.likes === 'number' ? model.likes : 0}
                      </span>
                      <span className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1" /> {typeof model.downloads === 'number' ? model.downloads : 0}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 py-20 text-center">
                <div className="bg-gray-800/30 rounded-xl p-10 border border-gray-700/50">
                  <h3 className="text-xl font-bold mb-3">No Models Found</h3>
                  <p className="text-gray-400 mb-6">There are no trending models available at the moment.</p>
                  <Link
                    href={user ? "/dashboard/models/upload" : "/signup?redirect=upload"}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
                  >
                    Submit a Model
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Upcoming Events */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Upcoming Events</h2>
            <Link href="/events" className="text-purple-400 hover:text-purple-300 flex items-center">
              View all events <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
            
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isEventsLoading ? (
              // Show skeleton loaders while loading
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="bg-gray-800/30 rounded-xl overflow-hidden border border-gray-700/50 animate-pulse">
                  <div className="h-48 bg-gray-700/50"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-700/50 rounded w-1/3 mb-2"></div>
                    <div className="h-6 bg-gray-700/50 rounded w-2/3 mb-2"></div>
                    <div className="h-4 bg-gray-700/50 rounded w-1/2 mb-4"></div>
                    <div className="flex items-center">
                      <div className="h-4 bg-gray-700/50 rounded w-1/4 mr-2"></div>
                      <div className="h-4 bg-gray-700/50 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : upcomingEvents.length > 0 ? (
              upcomingEvents.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800/30 rounded-xl overflow-hidden border border-gray-700/50"
                >
                  <div className="h-48 relative">
                    <OptimizedImage
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full"
                      aspectRatio="auto"
                    />
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-purple-400 mb-2">{event.date}</div>
                    <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                    <p className="text-gray-400 mb-4">{event.location}</p>
                    <div className="flex items-center text-sm text-gray-400">
                      <Users className="h-4 w-4 mr-2" />
                      {typeof event.attendees === 'number' ? event.attendees : 0}+ attending
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 py-20 text-center">
                <div className="bg-gray-800/30 rounded-xl p-10 border border-gray-700/50">
                  <h3 className="text-xl font-bold mb-3">No Events Found</h3>
                  <p className="text-gray-400 mb-6">There are no upcoming events scheduled at the moment.</p>
                  <Link
                    href="/events/create"
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
                  >
                    Create an Event
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Discussions */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Hot Discussions</h2>
            <Link href="/discussions" className="text-purple-400 hover:text-purple-300 flex items-center">
              View all discussions <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {discussions.map((discussion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{discussion.title}</h3>
                    <p className="text-gray-400 mb-3">Posted by {discussion.author}</p>
                    <div className="flex gap-2">
                      {discussion.tags && discussion.tags.map((tag, i) => (
                        <span key={i} className="text-sm bg-gray-700/50 px-3 py-1 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" /> {discussion.replies}
                    </span>
                    <span className="flex items-center">
                      <Heart className="h-4 w-4 mr-1" /> {discussion.likes}
                    </span>
                  </div>
                </div>
              </motion.div>
              ))}
            </div>
            </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Join Our Community?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Connect with AI enthusiasts, share your knowledge, and be part of the future of AI.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {!user ? (
                <Link
                  href="/signup"
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Join Now - It's Free!
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Go to Dashboard
                </Link>
              )}
              <Link
                href="/about"
                className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
} 