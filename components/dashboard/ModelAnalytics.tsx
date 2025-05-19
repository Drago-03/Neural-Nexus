"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Download, Star, TrendingUp, Activity, Clock, Filter, ChevronDown, MoreHorizontal, Search, Plus } from 'lucide-react';
import { AnimatedButton } from '../ui/animated-button';
import { AnimatedCard } from '../ui/animated-card';

interface ModelData {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  downloads: number;
  rating: number;
  views: number;
  createdAt: string;
  status: 'active' | 'pending' | 'rejected';
}

export default function ModelAnalytics() {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('downloads');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample model data
  const models: ModelData[] = [
    {
      id: 'model1',
      name: 'ImageGen Pro',
      description: 'State-of-the-art image generation model with unprecedented detail and realism.',
      category: 'Computer Vision',
      thumbnail: 'https://images.unsplash.com/photo-1686191482311-cb3fa868a543',
      downloads: 1842,
      rating: 4.8,
      views: 12540,
      createdAt: '2023-11-15',
      status: 'active'
    },
    {
      id: 'model2',
      name: 'NLP Transformer X',
      description: 'Advanced natural language processing model with superior comprehension abilities.',
      category: 'NLP',
      thumbnail: 'https://images.unsplash.com/photo-1655635949212-1d8f4f103ea1',
      downloads: 965,
      rating: 4.7,
      views: 8320,
      createdAt: '2023-12-02',
      status: 'active'
    },
    {
      id: 'model3',
      name: 'VoiceClone Ultra',
      description: 'Ultra-realistic voice cloning with minimal training data required.',
      category: 'Audio',
      thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d',
      downloads: 743,
      rating: 4.5,
      views: 5980,
      createdAt: '2024-01-10',
      status: 'active'
    },
    {
      id: 'model4',
      name: 'DeepDream Generator',
      description: 'Create mesmerizing psychedelic art with this advanced neural network.',
      category: 'Computer Vision',
      thumbnail: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519',
      downloads: 528,
      rating: 4.2,
      views: 4320,
      createdAt: '2024-02-20',
      status: 'pending'
    },
    {
      id: 'model5',
      name: 'SoundScape Designer',
      description: 'AI-powered ambient sound generation for immersive experiences.',
      category: 'Audio',
      thumbnail: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d',
      downloads: 371,
      rating: 4.3,
      views: 3140,
      createdAt: '2024-03-05',
      status: 'active'
    }
  ];
  
  // Filter and sort models
  const filteredModels = models
    .filter(model => 
      (filterStatus === 'all' || model.status === filterStatus) && 
      (model.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
       model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
       model.category.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'downloads':
          return b.downloads - a.downloads;
        case 'rating':
          return b.rating - a.rating;
        case 'views':
          return b.views - a.views;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        default:
          return b.downloads - a.downloads;
      }
    });

  // Calculate total stats
  const totalDownloads = models.reduce((acc, model) => acc + model.downloads, 0);
  const totalViews = models.reduce((acc, model) => acc + model.views, 0);
  const averageRating = models.reduce((acc, model) => acc + model.rating, 0) / models.length;

  // Format numbers with k, M suffix
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };
  
  // Get status badge class
  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'rejected':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Your AI Models</h2>
          <p className="text-gray-400">Manage and track performance of your AI models</p>
        </div>
        
        <AnimatedButton
          variant="primary"
          size="sm"
          className="flex-shrink-0"
        >
          Upload New Model
        </AnimatedButton>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AnimatedCard className="p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-blue-500/20">
              <Download className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{formatNumber(totalDownloads)}</h3>
              <p className="text-sm text-gray-400">Total Downloads</p>
            </div>
          </div>
        </AnimatedCard>
        
        <AnimatedCard className="p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-purple-500/20">
              <Eye className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{formatNumber(totalViews)}</h3>
              <p className="text-sm text-gray-400">Total Views</p>
            </div>
          </div>
        </AnimatedCard>
        
        <AnimatedCard className="p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-yellow-500/20">
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{averageRating.toFixed(1)}</h3>
              <p className="text-sm text-gray-400">Average Rating</p>
            </div>
          </div>
        </AnimatedCard>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search models..."
            className="pl-10 w-full bg-gray-800/50 border border-gray-700 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <button
              onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
              className="flex items-center gap-1 px-3 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              aria-label="Filter by status"
            >
              <Filter className="w-4 h-4" />
              <span>
                {filterStatus === 'all' ? 'All Status' : 
                 filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            <AnimatePresence>
              {filterDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10"
                >
                  <div className="py-1">
                    {['all', 'active', 'pending', 'rejected'].map((status) => (
                      <button
                        key={status}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors"
                        onClick={() => {
                          setFilterStatus(status);
                          setFilterDropdownOpen(false);
                        }}
                      >
                        {status === 'all' ? 'All Status' : 
                         status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              className="flex items-center gap-1 px-3 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              aria-label="Sort models"
            >
              <TrendingUp className="w-4 h-4" />
              <span>
                {sortBy === 'downloads' ? 'Downloads' :
                 sortBy === 'rating' ? 'Rating' :
                 sortBy === 'views' ? 'Views' :
                 sortBy === 'newest' ? 'Newest' : 'Oldest'}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            <AnimatePresence>
              {sortDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10"
                >
                  <div className="py-1">
                    {[
                      { value: 'downloads', label: 'Downloads' },
                      { value: 'rating', label: 'Rating' },
                      { value: 'views', label: 'Views' },
                      { value: 'newest', label: 'Newest' },
                      { value: 'oldest', label: 'Oldest' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors"
                        onClick={() => {
                          setSortBy(option.value);
                          setSortDropdownOpen(false);
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredModels.map((model) => (
          <AnimatedCard
            key={model.id}
            className="overflow-hidden"
            hoverEffect="lift"
          >
            <div className="h-40 relative">
              <img
                src={model.thumbnail}
                alt={model.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                <span className={`px-2 py-1 rounded-md text-xs ${getStatusBadgeClass(model.status)}`}>
                  {model.status.charAt(0).toUpperCase() + model.status.slice(1)}
                </span>
                <span className="bg-black/60 px-2 py-1 rounded-md text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(model.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{model.name}</h3>
                <button className="p-1 rounded-full hover:bg-gray-700" aria-label="More options">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                {model.description}
              </p>
              
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="flex flex-col items-center p-2 bg-gray-800/50 rounded-lg">
                  <Download className="w-4 h-4 text-blue-400 mb-1" />
                  <span className="text-xs text-gray-300">{formatNumber(model.downloads)}</span>
                </div>
                
                <div className="flex flex-col items-center p-2 bg-gray-800/50 rounded-lg">
                  <Eye className="w-4 h-4 text-purple-400 mb-1" />
                  <span className="text-xs text-gray-300">{formatNumber(model.views)}</span>
                </div>
                
                <div className="flex flex-col items-center p-2 bg-gray-800/50 rounded-lg">
                  <Star className="w-4 h-4 text-yellow-400 mb-1" />
                  <span className="text-xs text-gray-300">{model.rating.toFixed(1)}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                <span className="text-xs text-purple-400">{model.category}</span>
                <AnimatedButton variant="outline" size="sm">
                  <span className="flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    Analytics
                  </span>
                </AnimatedButton>
              </div>
            </div>
          </AnimatedCard>
        ))}
        
        {/* Add New Model Card */}
        <AnimatedCard
          className="border-2 border-dashed border-gray-700 flex flex-col items-center justify-center p-8 h-full"
          hoverEffect="none"
        >
          <div className="p-4 bg-purple-500/20 rounded-full mb-4">
            <motion.div
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.3 }}
            >
              <Plus className="w-8 h-8 text-purple-400" />
            </motion.div>
          </div>
          <h3 className="text-lg font-medium mb-2">Upload New Model</h3>
          <p className="text-gray-400 text-sm text-center mb-4 max-w-xs">
            Share your AI model with the community and start generating revenue
          </p>
          <AnimatedButton variant="primary" size="sm">
            Get Started
          </AnimatedButton>
        </AnimatedCard>
      </div>
    </div>
  );
} 