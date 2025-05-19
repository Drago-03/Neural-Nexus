"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Download, Star, TrendingUp, Activity, Clock, Filter, ChevronDown, MoreHorizontal, Search, Plus } from 'lucide-react';
import { AnimatedButton } from './ui/animated-button';
import { AnimatedCard } from './ui/animated-card';
import { Button } from '@/components/ui/button';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  change: number; // Percentage change from previous period
}

interface UsageData {
  date: string;
  inferences: number;
}

interface ModelAnalyticsProps {
  modelId: string;
  modelName: string;
  performanceMetrics: PerformanceMetric[];
  usageData: UsageData[];
  revenueData: {
    total: number;
    lastMonth: number;
    change: number;
  };
}

export default function ModelAnalytics({
  modelId,
  modelName,
  performanceMetrics,
  usageData,
  revenueData,
}: ModelAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  
  // Find max inference value for chart scaling
  const maxInference = Math.max(...usageData.map(d => d.inferences), 1);

  // Filter data according to timeRange
  const filteredUsageData = (() => {
    const now = new Date();
    let limitDate: Date;
    
    switch(timeRange) {
      case 'week':
        limitDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'year':
        limitDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default: // month
        limitDate = new Date(now.setMonth(now.getMonth() - 1));
    }
    
    return usageData.filter(d => new Date(d.date) >= limitDate);
  })();

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{modelName} Analytics</h2>
        <div className="flex space-x-2 mt-2 sm:mt-0">
          {(['week', 'month', 'year'] as const).map((range) => (
            <Button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`${
                timeRange === range
                  ? 'bg-pink-500 hover:bg-pink-600'
                  : 'bg-white/5 hover:bg-white/10'
              } px-4 py-1 text-sm rounded-lg`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Revenue Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/5 rounded-xl p-5">
          <div className="text-gray-400 text-sm mb-1">Total Revenue</div>
          <div className="text-2xl font-bold">${revenueData.total.toLocaleString()}</div>
          <div className="mt-2 text-sm flex items-center">
            <span className={`mr-1 ${revenueData.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {revenueData.change >= 0 ? '↑' : '↓'} {Math.abs(revenueData.change)}%
            </span>
            <span className="text-gray-400">vs previous period</span>
          </div>
        </div>
        
        <div className="bg-white/5 rounded-xl p-5">
          <div className="text-gray-400 text-sm mb-1">Monthly Revenue</div>
          <div className="text-2xl font-bold">${revenueData.lastMonth.toLocaleString()}</div>
          <div className="mt-2 text-sm">
            <span className="text-gray-400">Last 30 days</span>
          </div>
        </div>
        
        <div className="bg-white/5 rounded-xl p-5">
          <div className="text-gray-400 text-sm mb-1">Total Usage</div>
          <div className="text-2xl font-bold">
            {usageData.reduce((sum, d) => sum + d.inferences, 0).toLocaleString()}
          </div>
          <div className="mt-2 text-sm">
            <span className="text-gray-400">Total inferences</span>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <h3 className="text-xl font-semibold mb-4">Performance Metrics</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {performanceMetrics.map((metric) => (
          <div key={metric.name} className="bg-white/5 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">{metric.name}</div>
            <div className="text-xl font-bold">
              {metric.value} {metric.unit}
            </div>
            <div className={`text-sm ${metric.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {metric.change >= 0 ? '↑' : '↓'} {Math.abs(metric.change)}%
            </div>
          </div>
        ))}
      </div>

      {/* Usage Chart */}
      <h3 className="text-xl font-semibold mb-4">Usage Trends</h3>
      <div className="bg-white/5 rounded-xl p-5 h-64 relative">
        {filteredUsageData.length > 0 ? (
          <>
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 p-4">
              <div>
                {maxInference.toLocaleString()}
              </div>
              <div>
                {Math.floor(maxInference / 2).toLocaleString()}
              </div>
              <div>0</div>
            </div>
            
            {/* Chart */}
            <div className="ml-12 h-full flex items-end">
              {filteredUsageData.map((data, i) => (
                <div
                  key={data.date}
                  className="flex-1 flex flex-col items-center group"
                >
                  <div className="relative w-full">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.inferences / maxInference) * 100}%` }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      className="bg-gradient-to-t from-pink-500 to-purple-500 rounded-t-sm mx-1"
                    />
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-black p-2 rounded text-xs whitespace-nowrap">
                      <div className="font-bold">{new Date(data.date).toLocaleDateString()}</div>
                      <div>{data.inferences.toLocaleString()} inferences</div>
                    </div>
                  </div>
                  
                  {/* X-axis label */}
                  {timeRange === 'week' && (
                    <div className="mt-2 text-xs text-gray-400 rotate-45 origin-left">
                      {new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date(data.date))}
                    </div>
                  )}
                  {timeRange === 'month' && i % 3 === 0 && (
                    <div className="mt-2 text-xs text-gray-400 rotate-45 origin-left">
                      {new Date(data.date).getDate()}
                    </div>
                  )}
                  {timeRange === 'year' && i % 4 === 0 && (
                    <div className="mt-2 text-xs text-gray-400 rotate-45 origin-left">
                      {new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(data.date))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            No data available for the selected time range
          </div>
        )}
      </div>
      
      {/* Export Section */}
      <div className="mt-8 flex justify-end">
        <Button
          className="bg-white/5 hover:bg-white/10"
        >
          Export Analytics
        </Button>
      </div>
    </div>
  );
} 