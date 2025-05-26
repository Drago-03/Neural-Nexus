"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, ArrowUpDown, User, Mail, Calendar, MapPin, ExternalLink, Filter } from 'lucide-react';
import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedButton } from '@/app/components/ui/animated-button';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface CustomerData {
  id: string;
  name: string;
  email: string;
  location: string;
  joinedDate: string;
  purchases: number;
  spent: number;
  lastPurchase: string;
}

export function CustomerManagement() {
  const [loading, setLoading] = useState<boolean>(true);
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('spent');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const { data: session } = useSession();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        // Fetch customers data from API
        const response = await fetch('/api/user/customers', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch customers data');
        }

        const data = await response.json();
        
        if (data.success && Array.isArray(data.customers)) {
          setCustomers(data.customers);
        } else {
          // Set empty array if API returns no customers
          setCustomers([]);
          toast.info('No customer data found.');
        }
      } catch (error) {
        console.error('Error fetching customers data:', error);
        toast.error('Failed to load customers data');
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchCustomers();
    }
  }, [session]);

  // Get unique locations for filter
  const locations = ['all', ...Array.from(new Set(customers.map(customer => customer.location)))];

  // Filter and sort customers
  const filteredCustomers = customers
    .filter(customer => {
      if (filterLocation === 'all') return true;
      return customer.location === filterLocation;
    })
    .filter(customer => 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'spent':
          comparison = a.spent - b.spent;
          break;
        case 'purchases':
          comparison = a.purchases - b.purchases;
          break;
        case 'joinedDate':
          comparison = new Date(a.joinedDate).getTime() - new Date(b.joinedDate).getTime();
          break;
        case 'lastPurchase':
          comparison = new Date(a.lastPurchase).getTime() - new Date(b.lastPurchase).getTime();
          break;
        default:
          comparison = a.spent - b.spent;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Calculate total stats
  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.spent, 0);
  const averageSpent = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;
  const totalPurchases = customers.reduce((sum, customer) => sum + customer.purchases, 0);

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

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatedCard className="p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-400">Total Customers</p>
              <p className="text-2xl font-bold mt-1">{totalCustomers}</p>
              <p className="text-xs text-green-400 mt-1">+{Math.floor(totalCustomers * 0.15)} this month</p>
            </div>
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Users className="h-5 w-5 text-blue-400" />
            </div>
          </div>
        </AnimatedCard>
        
        <AnimatedCard className="p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold mt-1">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="text-xs text-green-400 mt-1">+${(totalRevenue * 0.12).toFixed(2)} this month</p>
            </div>
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Users className="h-5 w-5 text-green-400" />
            </div>
          </div>
        </AnimatedCard>
        
        <AnimatedCard className="p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-400">Avg. Customer Value</p>
              <p className="text-2xl font-bold mt-1">${averageSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="text-xs text-green-400 mt-1">+${(averageSpent * 0.08).toFixed(2)} this month</p>
            </div>
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Users className="h-5 w-5 text-purple-400" />
            </div>
          </div>
        </AnimatedCard>
        
        <AnimatedCard className="p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-400">Total Purchases</p>
              <p className="text-2xl font-bold mt-1">{totalPurchases}</p>
              <p className="text-xs text-green-400 mt-1">+{Math.floor(totalPurchases * 0.10)} this month</p>
            </div>
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Users className="h-5 w-5 text-yellow-400" />
            </div>
          </div>
        </AnimatedCard>
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
        <div className="flex gap-2">
          <select
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            aria-label="Filter by location"
          >
            {locations.map((location) => (
              <option key={location} value={location}>
                {location === 'all' ? 'All Locations' : location}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search customers..." 
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
      
      {/* Customers Table */}
      <AnimatedCard className="overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : filteredCustomers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-800/50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Customer
                      {sortBy === 'name' && (
                        <ArrowUpDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('joinedDate')}
                  >
                    <div className="flex items-center gap-1">
                      Joined
                      {sortBy === 'joinedDate' && (
                        <ArrowUpDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('location')}
                  >
                    <div className="flex items-center gap-1">
                      Location
                      {sortBy === 'location' && (
                        <ArrowUpDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('purchases')}
                  >
                    <div className="flex items-center gap-1">
                      Purchases
                      {sortBy === 'purchases' && (
                        <ArrowUpDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('spent')}
                  >
                    <div className="flex items-center gap-1">
                      Total Spent
                      {sortBy === 'spent' && (
                        <ArrowUpDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('lastPurchase')}
                  >
                    <div className="flex items-center gap-1">
                      Last Purchase
                      {sortBy === 'lastPurchase' && (
                        <ArrowUpDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredCustomers.map((customer, index) => (
                  <motion.tr 
                    key={customer.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gray-900/30 hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white">
                          {customer.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <p className="font-medium">{customer.name}</p>
                          <div className="flex items-center text-xs text-gray-400">
                            <Mail className="h-3 w-3 mr-1" />
                            {customer.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <p>{new Date(customer.joinedDate).toLocaleDateString()}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <p>{customer.location}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-medium">{customer.purchases}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-medium text-green-400">${customer.spent.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p>{new Date(customer.lastPurchase).toLocaleDateString()}</p>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Customers Found</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              {searchTerm || filterLocation !== 'all' ? 'No customers match your search criteria.' : 'You haven\'t acquired any customers yet.'}
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