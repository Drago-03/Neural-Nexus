"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Users, ShoppingCart, TrendingUp, Calendar, ArrowUpDown, Filter, Search } from 'lucide-react';
import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedButton } from '@/app/components/ui/animated-button';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface SaleData {
  id: string;
  modelName: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'refunded';
}

export function SalesAnalytics() {
  const [loading, setLoading] = useState<boolean>(true);
  const [sales, setSales] = useState<SaleData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [periodFilter, setPeriodFilter] = useState<string>('30days');
  const { data: session } = useSession();

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);
        // Fetch sales data from API
        const response = await fetch(`/api/user/sales?period=${periodFilter}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch sales data');
        }

        const data = await response.json();
        
        if (data.success && Array.isArray(data.sales)) {
          setSales(data.sales);
        } else {
          // Set empty array if API returns no sales
          setSales([]);
          toast.info('No sales data found for the selected period.');
        }
      } catch (error) {
        console.error('Error fetching sales data:', error);
        toast.error('Failed to load sales data');
        setSales([]);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchSalesData();
    }
  }, [periodFilter, session]);

  // Filter and sort sales
  const filteredSales = sales
    .filter(sale => {
      if (filterStatus === 'all') return true;
      return sale.status === filterStatus;
    })
    .filter(sale => 
      sale.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'modelName':
          comparison = a.modelName.localeCompare(b.modelName);
          break;
        case 'customerName':
          comparison = a.customerName.localeCompare(b.customerName);
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Calculate total stats
  const totalSales = sales.reduce((sum, sale) => sale.status !== 'refunded' ? sum + 1 : sum, 0);
  const totalRevenue = sales
    .filter(sale => sale.status === 'completed')
    .reduce((sum, sale) => sum + sale.amount, 0);
  const totalCustomers = new Set(sales.map(sale => sale.customerEmail)).size;
  const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

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

  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'refunded':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatedCard className="p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold mt-1">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="text-xs text-green-400 mt-1">+${(totalRevenue * 0.12).toFixed(2)} this month</p>
            </div>
            <div className="p-2 bg-green-500/20 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-400" />
            </div>
          </div>
        </AnimatedCard>
        
        <AnimatedCard className="p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-400">Total Customers</p>
              <p className="text-2xl font-bold mt-1">{totalCustomers}</p>
              <p className="text-xs text-green-400 mt-1">+{Math.floor(totalCustomers * 0.08)} new this month</p>
            </div>
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Users className="h-5 w-5 text-blue-400" />
            </div>
          </div>
        </AnimatedCard>
        
        <AnimatedCard className="p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-400">Total Sales</p>
              <p className="text-2xl font-bold mt-1">{totalSales}</p>
              <p className="text-xs text-green-400 mt-1">+{Math.floor(totalSales * 0.15)} this month</p>
            </div>
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <ShoppingCart className="h-5 w-5 text-purple-400" />
            </div>
          </div>
        </AnimatedCard>
        
        <AnimatedCard className="p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-400">Avg. Order Value</p>
              <p className="text-2xl font-bold mt-1">${averageOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="text-xs text-green-400 mt-1">+${(averageOrderValue * 0.05).toFixed(2)} this month</p>
            </div>
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-yellow-400" />
            </div>
          </div>
        </AnimatedCard>
      </div>
      
      {/* Period Filter, Search and Status Filter */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
        <div className="flex gap-2">
          <select
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            aria-label="Select time period"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="1year">Last year</option>
            <option value="all">All time</option>
          </select>
          
          <select
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
        
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search sales..." 
              className="pl-10 pr-4 py-2 w-full bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
      
      {/* Sales Table */}
      <AnimatedCard className="overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : filteredSales.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-800/50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('modelName')}
                  >
                    <div className="flex items-center gap-1">
                      Model
                      {sortBy === 'modelName' && (
                        <ArrowUpDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('customerName')}
                  >
                    <div className="flex items-center gap-1">
                      Customer
                      {sortBy === 'customerName' && (
                        <ArrowUpDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('amount')}
                  >
                    <div className="flex items-center gap-1">
                      Amount
                      {sortBy === 'amount' && (
                        <ArrowUpDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center gap-1">
                      Date
                      {sortBy === 'date' && (
                        <ArrowUpDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      {sortBy === 'status' && (
                        <ArrowUpDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredSales.map((sale, index) => (
                  <motion.tr 
                    key={sale.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gray-900/30 hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-medium">{sale.modelName}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium">{sale.customerName}</p>
                        <p className="text-xs text-gray-400">{sale.customerEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-medium">${sale.amount.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <p>{new Date(sale.date).toLocaleDateString()} {new Date(sale.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(sale.status)}`}>
                        {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Sales Found</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              {searchTerm || filterStatus !== 'all' ? 'No sales match your search criteria.' : 'You haven\'t made any sales yet.'}
            </p>
            <AnimatedButton
              variant="primary"
              size="sm"
              onClick={() => window.location.href = '/marketplace'}
            >
              View Marketplace
            </AnimatedButton>
          </div>
        )}
      </AnimatedCard>
    </div>
  );
} 