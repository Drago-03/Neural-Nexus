"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { AnimatedCard } from '../ui/animated-card';
import { CalendarDays, DollarSign, Users, ShoppingCart, TrendingUp, TrendingDown, Filter } from 'lucide-react';
import { AnimatedButton } from '../ui/animated-button';

interface SalesData {
  models: {
    name: string;
    sales: number;
    revenue: number;
  }[];
  byTimespan: {
    daily: {
      date: string;
      sales: number;
      revenue: string | number;
    }[];
    weekly: {
      week: string;
      sales: number;
      revenue: string | number;
    }[];
    monthly: {
      month: string;
      sales: number;
      revenue: string | number;
    }[];
  };
  topCustomers: {
    name: string;
    purchases: number;
    spent: number;
  }[];
  bySources: {
    name: string;
    value: number;
    color?: string;
  }[];
}

// Generate fake data - in a real app, this would come from an API
const generateFakeData = (): SalesData => {
  const modelNames = ['ImageGen Pro', 'TextMaster AI', 'VoiceClone Ultra', 'DataForge 3000', 'SentimentX'];
  const sources = ['Direct', 'Marketplace', 'Referral', 'Social Media', 'Search'];
  const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];
  
  const daily = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (13 - i));
    return {
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      sales: Math.floor(Math.random() * 25) + 5,
      revenue: (Math.random() * 500 + 100).toFixed(2)
    };
  });
  
  const weekly = Array.from({ length: 8 }, (_, i) => {
    const week = `W${i + 1}`;
    return {
      week,
      sales: Math.floor(Math.random() * 80) + 20,
      revenue: (Math.random() * 1500 + 500).toFixed(2)
    };
  });
  
  const monthly = Array.from({ length: 6 }, (_, i) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    return {
      month: monthNames[date.getMonth()],
      sales: Math.floor(Math.random() * 200) + 50,
      revenue: (Math.random() * 5000 + 1000).toFixed(2)
    };
  });
  
  const models = modelNames.map(name => ({
    name,
    sales: Math.floor(Math.random() * 100) + 20,
    revenue: Math.floor(Math.random() * 5000) + 1000
  }));
  
  const bySources = sources.map((name, index) => ({
    name,
    value: Math.floor(Math.random() * 50) + 10,
    color: colors[index]
  }));
  
  const customerNames = ['Jane Smith', 'John Doe', 'Alice Jones', 'Bob Miller', 'Carol White'];
  const topCustomers = customerNames.map(name => ({
    name,
    purchases: Math.floor(Math.random() * 15) + 1,
    spent: Math.floor(Math.random() * 2000) + 200
  })).sort((a, b) => b.spent - a.spent);
  
  return {
    models,
    byTimespan: {
      daily,
      weekly,
      monthly
    },
    topCustomers,
    bySources
  };
};

export default function SalesAnalytics() {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [salesData, setSalesData] = useState<SalesData>(generateFakeData());
  
  const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];
  
  const timeRanges = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];
  
  // Total calculations
  const totalSales = salesData.models.reduce((sum, model) => sum + model.sales, 0);
  const totalRevenue = salesData.models.reduce((sum, model) => sum + model.revenue, 0);
  const avgOrderValue = totalRevenue / totalSales;
  
  // Get current timespan data
  const currentTimespanData = salesData.byTimespan[timeRange];
  
  // Calculate revenue change (percentage)
  const getChangePercentage = (): string => {
    const data = [...currentTimespanData];
    if (data.length < 2) return '0';
    
    const current = parseFloat(data[data.length - 1].revenue.toString());
    const previous = parseFloat(data[data.length - 2].revenue.toString());
    
    if (previous === 0) return '100';
    return ((current - previous) / previous * 100).toFixed(1);
  };
  
  const revenueChangePercent = getChangePercentage();
  const isPositiveChange = parseFloat(revenueChangePercent) >= 0;
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 p-3 border border-gray-800 shadow-lg rounded-lg">
          <p className="text-gray-400">{`${label}`}</p>
          <p className="text-white font-medium">{`Sales: ${payload[0].value}`}</p>
          <p className="text-green-400 font-medium">{`Revenue: $${payload[1] ? payload[1].value : 0}`}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Sales Analytics</h2>
          <p className="text-gray-400">Track your sales performance and revenue metrics</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <div className="bg-gray-800 rounded-lg flex p-1">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value as any)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  timeRange === range.value 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
                aria-label={`Show ${range.label} data`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <AnimatedCard className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">Total Sales</p>
              <h3 className="text-2xl font-bold mt-1">{totalSales}</h3>
              <p className="text-xs mt-1 flex items-center">
                {isPositiveChange ? (
                  <TrendingUp className="w-3 h-3 text-green-400 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-400 mr-1" />
                )}
                <span className={isPositiveChange ? 'text-green-400' : 'text-red-400'}>
                  {revenueChangePercent}% vs last period
                </span>
              </p>
            </div>
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-blue-400" />
            </div>
          </div>
        </AnimatedCard>
        
        <AnimatedCard className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">Revenue</p>
              <h3 className="text-2xl font-bold mt-1">${totalRevenue.toLocaleString()}</h3>
              <p className="text-xs mt-1 flex items-center">
                {isPositiveChange ? (
                  <TrendingUp className="w-3 h-3 text-green-400 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-400 mr-1" />
                )}
                <span className={isPositiveChange ? 'text-green-400' : 'text-red-400'}>
                  {revenueChangePercent}% vs last period
                </span>
              </p>
            </div>
            <div className="p-2 bg-green-500/20 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
          </div>
        </AnimatedCard>
        
        <AnimatedCard className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">Avg. Order Value</p>
              <h3 className="text-2xl font-bold mt-1">${avgOrderValue.toFixed(2)}</h3>
              <p className="text-xs mt-1 text-gray-400">Per transaction</p>
            </div>
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
          </div>
        </AnimatedCard>
        
        <AnimatedCard className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">Customers</p>
              <h3 className="text-2xl font-bold mt-1">{salesData.topCustomers.length}</h3>
              <p className="text-xs mt-1 text-gray-400">Total unique buyers</p>
            </div>
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Users className="w-5 h-5 text-yellow-400" />
            </div>
          </div>
        </AnimatedCard>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <AnimatedCard className="p-6">
          <h3 className="text-lg font-medium mb-4">Revenue & Sales Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={currentTimespanData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey={timeRange === 'daily' ? 'date' : timeRange === 'weekly' ? 'week' : 'month'} 
                  stroke="#9CA3AF"
                />
                <YAxis yAxisId="left" stroke="#9CA3AF" />
                <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="sales"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  name="Sales"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4ade80"
                  name="Revenue ($)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </AnimatedCard>
        
        {/* Model Performance */}
        <AnimatedCard className="p-6">
          <h3 className="text-lg font-medium mb-4">Model Sales Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesData.models}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="sales" name="Units Sold" fill="#8884d8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="revenue" name="Revenue ($)" fill="#4ade80" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AnimatedCard>
      </div>
      
      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Source */}
        <AnimatedCard className="p-6">
          <h3 className="text-lg font-medium mb-4">Sales by Source</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesData.bySources}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }: { name: string, percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {salesData.bySources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </AnimatedCard>
        
        {/* Top Customers */}
        <AnimatedCard className="p-6">
          <h3 className="text-lg font-medium mb-4">Top Customers</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Purchases
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Total Spent
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {salesData.topCustomers.map((customer, index) => (
                  <tr key={index} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
                          {customer.name.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">{customer.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {customer.purchases}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-green-400 font-medium">
                      ${customer.spent}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-center">
            <AnimatedButton variant="outline" size="sm">
              View All Customers
            </AnimatedButton>
          </div>
        </AnimatedCard>
      </div>
      
      {/* Export Section */}
      <div className="flex justify-end mt-6">
        <AnimatedButton variant="primary" size="sm">
          <span className="flex items-center">
            <CalendarDays className="w-4 h-4 mr-2" />
            Export Report
          </span>
        </AnimatedButton>
      </div>
    </div>
  );
} 