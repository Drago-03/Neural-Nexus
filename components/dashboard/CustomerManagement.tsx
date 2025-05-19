"use client";

import React, { useState } from 'react';
import { AnimatedCard } from '../ui/animated-card';
import { AnimatedButton } from '../ui/animated-button';
import { 
  Search, Filter, ChevronDown, ChevronLeft, ChevronRight, 
  Download, Mail, MoreHorizontal, Users, BadgeCheck, Settings,
  DollarSign, ShoppingBag, Clock, User, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Customer {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  totalSpent: number;
  purchaseCount: number;
  lastPurchase: string;
  status: 'active' | 'inactive';
  tags: string[];
  joinedAt: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export default function CustomerManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTier, setFilterTier] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('totalSpent');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [tierDropdownOpen, setTierDropdownOpen] = useState(false);
  
  // Generate sample data
  const generateCustomers = (): Customer[] => {
    const names = ['Emma Johnson', 'Liam Smith', 'Olivia Brown', 'Noah Davis', 'Ava Wilson', 
      'Ethan Martinez', 'Sophia Anderson', 'Mason Thompson', 'Isabella Thomas', 'Lucas Jackson',
      'Mia White', 'Logan Harris', 'Charlotte Martin', 'Jackson Thompson', 'Amelia Garcia',
      'Aiden Robinson', 'Harper Lewis', 'Carter Walker', 'Abigail Hall', 'Dylan Allen'];
      
    const tiers = ['bronze', 'silver', 'gold', 'platinum'];
    const statuses = ['active', 'inactive'];
    const tags = ['Developer', 'Researcher', 'Student', 'Enterprise', 'Academic', 'Startup'];
    
    return names.map((name, index) => {
      const tier = tiers[Math.floor(Math.random() * 4)] as any;
      const status = Math.random() > 0.2 ? 'active' : 'inactive';
      const randomTags: string[] = [];
      const numTags = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < numTags; i++) {
        const tag = tags[Math.floor(Math.random() * tags.length)];
        if (!randomTags.includes(tag)) {
          randomTags.push(tag);
        }
      }
      
      // Generate a date within the last year
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 365));
      
      // Generate a join date that's older than the last purchase
      const joinDate = new Date(date);
      joinDate.setDate(joinDate.getDate() - Math.floor(Math.random() * 730) - 30);
      
      return {
        id: `cust-${index + 100}`,
        name,
        email: name.toLowerCase().replace(' ', '.') + '@yourdomain.com',
        avatar: Math.random() > 0.3 ? `https://i.pravatar.cc/150?u=${name.replace(' ', '')}` : undefined,
        totalSpent: Math.floor(Math.random() * 9900) + 100,
        purchaseCount: Math.floor(Math.random() * 20) + 1,
        lastPurchase: date.toISOString(),
        status: status as any,
        tags: randomTags,
        joinedAt: joinDate.toISOString(),
        tier: tier
      };
    });
  };
  
  const [customers] = useState<Customer[]>(generateCustomers());
  
  // Filter and sort customers
  const filteredCustomers = customers
    .filter(customer => {
      const matchesSearch = 
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
      const matchesTier = filterTier === 'all' || customer.tier === filterTier;
      
      return matchesSearch && matchesStatus && matchesTier;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'totalSpent':
          comparison = a.totalSpent - b.totalSpent;
          break;
        case 'purchaseCount':
          comparison = a.purchaseCount - b.purchaseCount;
          break;
        case 'lastPurchase':
          comparison = new Date(a.lastPurchase).getTime() - new Date(b.lastPurchase).getTime();
          break;
        case 'joinedAt':
          comparison = new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  
  // Functions for pagination
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  
  // Sort handler
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc'); // Default to descending when changing fields
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  // Get tier badge style
  const getTierBadgeStyle = (tier: string) => {
    switch (tier) {
      case 'bronze':
        return 'bg-amber-600/20 text-amber-500';
      case 'silver':
        return 'bg-gray-400/20 text-gray-300';
      case 'gold':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'platinum':
        return 'bg-cyan-500/20 text-cyan-300';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };
  
  // Get avatar element
  const getAvatar = (customer: Customer) => {
    if (customer.avatar) {
      return (
        <img 
          src={customer.avatar} 
          alt={customer.name} 
          className="w-10 h-10 rounded-full object-cover border border-gray-700"
        />
      );
    }
    
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white">
        {customer.name.charAt(0)}
      </div>
    );
  };

  // Stats
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);
  const avgRevenue = totalRevenue / totalCustomers;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Customers</h2>
          <p className="text-gray-400">Manage and analyze your customer base</p>
        </div>
        
        <AnimatedButton
          variant="primary"
          size="sm"
          className="flex-shrink-0 flex items-center gap-2"
        >
          <Mail className="h-4 w-4" />
          Export Customer List
        </AnimatedButton>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <AnimatedCard className="p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-blue-500/20">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{totalCustomers.toLocaleString()}</h3>
              <p className="text-sm text-gray-400">Total Customers</p>
            </div>
          </div>
        </AnimatedCard>
        
        <AnimatedCard className="p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-green-500/20">
              <BadgeCheck className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{activeCustomers.toLocaleString()}</h3>
              <p className="text-sm text-gray-400">Active Customers</p>
            </div>
          </div>
        </AnimatedCard>
        
        <AnimatedCard className="p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-purple-500/20">
              <DollarSign className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{formatCurrency(totalRevenue)}</h3>
              <p className="text-sm text-gray-400">Total Revenue</p>
            </div>
          </div>
        </AnimatedCard>
        
        <AnimatedCard className="p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-yellow-500/20">
              <ShoppingBag className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{formatCurrency(avgRevenue)}</h3>
              <p className="text-sm text-gray-400">Avg. Revenue</p>
            </div>
          </div>
        </AnimatedCard>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search customers..."
            className="pl-10 w-full bg-gray-800/50 border border-gray-700 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          {/* Status Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setStatusDropdownOpen(!statusDropdownOpen);
                setTierDropdownOpen(false);
              }}
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
              {statusDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10"
                >
                  <div className="py-1">
                    {['all', 'active', 'inactive'].map((status) => (
                      <button
                        key={status}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors"
                        onClick={() => {
                          setFilterStatus(status);
                          setStatusDropdownOpen(false);
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
          
          {/* Tier Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setTierDropdownOpen(!tierDropdownOpen);
                setStatusDropdownOpen(false);
              }}
              className="flex items-center gap-1 px-3 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              aria-label="Filter by tier"
            >
              <Settings className="w-4 h-4" />
              <span>
                {filterTier === 'all' ? 'All Tiers' : 
                 filterTier.charAt(0).toUpperCase() + filterTier.slice(1)}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            <AnimatePresence>
              {tierDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10"
                >
                  <div className="py-1">
                    {['all', 'bronze', 'silver', 'gold', 'platinum'].map((tier) => (
                      <button
                        key={tier}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors"
                        onClick={() => {
                          setFilterTier(tier);
                          setTierDropdownOpen(false);
                        }}
                      >
                        {tier === 'all' ? 'All Tiers' : 
                         tier.charAt(0).toUpperCase() + tier.slice(1)}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Customer Table */}
      <AnimatedCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-800/50">
              <tr>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Customer
                    {sortField === 'name' && (
                      <ChevronDown 
                        className={`ml-1 h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} 
                      />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('totalSpent')}
                >
                  <div className="flex items-center">
                    Spent
                    {sortField === 'totalSpent' && (
                      <ChevronDown 
                        className={`ml-1 h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} 
                      />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('purchaseCount')}
                >
                  <div className="flex items-center">
                    Orders
                    {sortField === 'purchaseCount' && (
                      <ChevronDown 
                        className={`ml-1 h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} 
                      />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('lastPurchase')}
                >
                  <div className="flex items-center">
                    Last Purchase
                    {sortField === 'lastPurchase' && (
                      <ChevronDown 
                        className={`ml-1 h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} 
                      />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('joinedAt')}
                >
                  <div className="flex items-center">
                    Joined
                    {sortField === 'joinedAt' && (
                      <ChevronDown 
                        className={`ml-1 h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} 
                      />
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Tier
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {currentItems.map((customer, index) => (
                <tr 
                  key={customer.id} 
                  className={`${index % 2 === 0 ? 'bg-gray-900/30' : 'bg-gray-800/10'} hover:bg-gray-800/30 transition-colors`}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      {getAvatar(customer)}
                      <div className="ml-3">
                        <p className="text-sm font-medium">{customer.name}</p>
                        <p className="text-xs text-gray-400">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <p className="text-sm font-medium text-green-400">{formatCurrency(customer.totalSpent)}</p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <p className="text-sm">{customer.purchaseCount}</p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 text-gray-400 mr-1" />
                      <span className="text-sm">{formatDate(customer.lastPurchase)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-3 w-3 text-gray-400 mr-1" />
                      <span className="text-sm">{formatDate(customer.joinedAt)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      customer.status === 'active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${getTierBadgeStyle(customer.tier)}`}>
                      {customer.tier.charAt(0).toUpperCase() + customer.tier.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
                        aria-label="View customer details"
                      >
                        <ArrowUpRight className="h-4 w-4 text-gray-400" />
                      </button>
                      <button 
                        className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
                        aria-label="More options"
                      >
                        <MoreHorizontal className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-800">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 border border-gray-700 rounded-md ${
                currentPage === 1 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-gray-800 transition-colors'
              }`}
            >
              Previous
            </button>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`ml-3 px-4 py-2 border border-gray-700 rounded-md ${
                currentPage === totalPages 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-gray-800 transition-colors'
              }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-400">
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, filteredCustomers.length)}
                </span>{' '}
                of <span className="font-medium">{filteredCustomers.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex shadow-sm rounded-md">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`px-2 py-2 rounded-l-md border border-gray-700 ${
                    currentPage === 1 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-gray-800 transition-colors'
                  }`}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    // Show current page, first, last, and pages around current
                    return (
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1
                    );
                  })
                  .map((page, idx, array) => {
                    // Add ellipsis
                    const showEllipsisBefore = idx > 0 && array[idx - 1] !== page - 1;
                    const showEllipsisAfter = idx < array.length - 1 && array[idx + 1] !== page + 1;
                    
                    return (
                      <React.Fragment key={page}>
                        {showEllipsisBefore && (
                          <span className="px-4 py-2 border border-gray-700 bg-gray-800/30">
                            ...
                          </span>
                        )}
                        <button
                          onClick={() => paginate(page)}
                          className={`px-4 py-2 border border-gray-700 ${
                            currentPage === page
                              ? 'bg-gray-700 text-white'
                              : 'hover:bg-gray-800 transition-colors'
                          }`}
                        >
                          {page}
                        </button>
                        {showEllipsisAfter && (
                          <span className="px-4 py-2 border border-gray-700 bg-gray-800/30">
                            ...
                          </span>
                        )}
                      </React.Fragment>
                    );
                  })}
                
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`px-2 py-2 rounded-r-md border border-gray-700 ${
                    currentPage === totalPages 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-gray-800 transition-colors'
                  }`}
                  aria-label="Next page"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </AnimatedCard>
    </div>
  );
} 