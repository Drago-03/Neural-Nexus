"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Download, Star, TrendingUp, Activity, Clock, Filter, ChevronDown, MoreHorizontal, Search, Plus, ArrowUpDown, BarChart2 } from 'lucide-react';
import { AnimatedButton } from '../ui/animated-button';
import { AnimatedCard } from '../ui/animated-card';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface ModelData {
  id: string;
  name: string;
  views: number;
  downloads: number;
  rating: number;
  revenue: number;
  createdAt: string;
  // Optional fields for backward compatibility
  description?: string;
  category?: string;
  thumbnail?: string;
  status?: 'active' | 'pending' | 'rejected';
}

export function ModelAnalytics() {
  const [loading, setLoading] = useState<boolean>(true);
  const [models, setModels] = useState<ModelData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('downloads');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterType, setFilterType] = useState<string>('all');
  const { data: session } = useSession();

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        // Fetch user's models from API
        const response = await fetch('/api/user/models', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch models');
        }

        const data = await response.json();
        
        if (data.success && Array.isArray(data.models)) {
          setModels(data.models);
        } else {
          // If API returns no models, set empty array
          setModels([]);
          toast.info('No models found. Upload some to get started!');
        }
      } catch (error) {
        console.error('Error fetching models:', error);
        toast.error('Failed to load models data');
        setModels([]);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchModels();
    }
  }, [session]);

  // Filter and sort models
  const filteredModels = models
    .filter(model => {
      if (filterType === 'all') return true;
      if (filterType === 'active' && model.status === 'active') return true;
      if (filterType === 'pending' && model.status === 'pending') return true;
      return false;
    })
    .filter(model => 
      model.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'views':
          comparison = a.views - b.views;
          break;
        case 'downloads':
          comparison = a.downloads - b.downloads;
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'revenue':
          comparison = a.revenue - b.revenue;
          break;
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        default:
          comparison = a.downloads - b.downloads;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      toggleSortOrder();
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Calculate total stats
  const totalViews = models.reduce((sum, model) => sum + model.views, 0);
  const totalDownloads = models.reduce((sum, model) => sum + model.downloads, 0);
  const totalRevenue = models.reduce((sum, model) => sum + model.revenue, 0);
  const averageRating = models.length > 0 
    ? parseFloat((models.reduce((sum, model) => sum + model.rating, 0) / models.length).toFixed(1))
    : 0;

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatedCard className="p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-400">Total Views</p>
              <p className="text-2xl font-bold mt-1">{totalViews.toLocaleString()}</p>
              <p className="text-xs text-green-400 mt-1">+{Math.floor(totalViews * 0.12)} this month</p>
            </div>
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Eye className="h-5 w-5 text-purple-400" />
            </div>
          </div>
        </AnimatedCard>
        
        <AnimatedCard className="p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-400">Total Downloads</p>
              <p className="text-2xl font-bold mt-1">{totalDownloads.toLocaleString()}</p>
              <p className="text-xs text-green-400 mt-1">+{Math.floor(totalDownloads * 0.08)} this month</p>
            </div>
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Download className="h-5 w-5 text-blue-400" />
            </div>
          </div>
        </AnimatedCard>
        
        <AnimatedCard className="p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-400">Average Rating</p>
              <p className="text-2xl font-bold mt-1">{averageRating.toFixed(1)}</p>
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-3 w-3 ${i < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-600'}`} 
                    fill={i < Math.round(averageRating) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
            </div>
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
            </div>
          </div>
        </AnimatedCard>
        
        <AnimatedCard className="p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold mt-1">${totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-green-400 mt-1">+${Math.floor(totalRevenue * 0.15)} this month</p>
            </div>
            <div className="p-2 bg-green-500/20 rounded-lg">
              <BarChart2 className="h-5 w-5 text-green-400" />
            </div>
          </div>
        </AnimatedCard>
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search models..." 
            className="pl-10 pr-4 py-2 w-full bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <AnimatedButton
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => {}}
            >
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </AnimatedButton>
          </div>
          
          <AnimatedButton
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={toggleSortOrder}
          >
            <ArrowUpDown className="h-4 w-4" />
            <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
          </AnimatedButton>
        </div>
      </div>
      
      {/* Models Table */}
      <AnimatedCard className="overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : filteredModels.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-800/50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Model Name
                      {sortBy === 'name' && (
                        <ArrowUpDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('views')}
                  >
                    <div className="flex items-center gap-1">
                      Views
                      {sortBy === 'views' && (
                        <ArrowUpDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('downloads')}
                  >
                    <div className="flex items-center gap-1">
                      Downloads
                      {sortBy === 'downloads' && (
                        <ArrowUpDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('rating')}
                  >
                    <div className="flex items-center gap-1">
                      Rating
                      {sortBy === 'rating' && (
                        <ArrowUpDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('revenue')}
                  >
                    <div className="flex items-center gap-1">
                      Revenue
                      {sortBy === 'revenue' && (
                        <ArrowUpDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center gap-1">
                      Created
                      {sortBy === 'date' && (
                        <ArrowUpDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredModels.map((model, index) => (
                  <motion.tr 
                    key={model.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gray-900/30 hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-medium">{model.name}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 text-purple-400 mr-2" />
                        {model.views.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Download className="h-4 w-4 text-blue-400 mr-2" />
                        {model.downloads.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${i < Math.floor(model.rating) ? 'text-yellow-400' : 'text-gray-600'}`}
                              fill={i < Math.floor(model.rating) ? 'currentColor' : 'none'}
                            />
                          ))}
                        </div>
                        {model.rating.toFixed(1)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p>${model.revenue.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-gray-400">
                        {new Date(model.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
              <BarChart2 className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Models Found</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              {searchTerm ? 'No models match your search criteria.' : 'You haven\'t created any models yet.'}
            </p>
            <AnimatedButton
              variant="primary"
              size="sm"
              onClick={() => window.location.href = '/create'}
            >
              Create Your First Model
            </AnimatedButton>
          </div>
        )}
      </AnimatedCard>
    </div>
  );
} 