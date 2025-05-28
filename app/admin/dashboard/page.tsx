"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSupabase } from '@/providers/SupabaseProvider';
import { 
  Users, 
  Calendar, 
  Database, 
  ArrowUp, 
  ChevronDown, 
  ChevronUp,
  BarChart3,
  Zap,
  User,
  Mail,
  Plus
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { supabase, user } = useSupabase();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalModels: 0,
    adminUsers: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentAdmins, setRecentAdmins] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch user stats
        const { count: userCount } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });
        
        // Fetch event stats
        const { count: eventCount } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true });
        
        // Fetch model stats
        const { count: modelCount } = await supabase
          .from('models')
          .select('*', { count: 'exact', head: true });
        
        // Fetch admin users count
        const { count: adminCount } = await supabase
          .from('admin_users')
          .select('*', { count: 'exact', head: true });
        
        // Fetch recent admin users
        const { data: admins } = await supabase
          .from('admin_users')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
        
        setStats({
          totalUsers: userCount || 0,
          totalEvents: eventCount || 0,
          totalModels: modelCount || 0,
          adminUsers: adminCount || 0
        });
        
        setRecentAdmins(admins || []);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [supabase]);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-400">
          Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Admin'}
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Users', value: stats.totalUsers, icon: <Users className="w-8 h-8 text-blue-400" />, change: '+12%', link: '/admin/dashboard/users' },
          { title: 'Total Events', value: stats.totalEvents, icon: <Calendar className="w-8 h-8 text-green-400" />, change: '+5%', link: '/admin/dashboard/events' },
          { title: 'Total Models', value: stats.totalModels, icon: <Database className="w-8 h-8 text-purple-400" />, change: '+8%', link: '/admin/dashboard/models' },
          { title: 'Admin Users', value: stats.adminUsers, icon: <Shield className="w-8 h-8 text-amber-400" />, change: '+0%', link: '/admin/dashboard/users?type=admin' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                <h2 className="text-3xl font-bold">
                  {isLoading ? (
                    <div className="h-9 w-16 bg-gray-700 animate-pulse rounded"></div>
                  ) : (
                    stat.value.toLocaleString()
                  )}
                </h2>
              </div>
              <div className="p-3 bg-gray-700/50 rounded-lg">
                {stat.icon}
              </div>
            </div>
            <div className="flex items-center mt-4">
              <div className="flex items-center text-green-400 mr-2">
                <ArrowUp className="w-3 h-3 mr-1" />
                <span>{stat.change}</span>
              </div>
              <span className="text-gray-400 text-sm">since last month</span>
            </div>
            <Link 
              href={stat.link} 
              className="mt-4 text-sm text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center"
            >
              View Details
              <ChevronRight className="ml-1 w-4 h-4" />
            </Link>
          </motion.div>
        ))}
      </div>
      
      {/* Admin Users Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Admin Users</h2>
          <Link 
            href="/admin/dashboard/users/add-admin" 
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors inline-flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Admin
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 px-4 text-left">User</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Added By</th>
                <th className="py-3 px-4 text-left">Date Added</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-gray-700/50">
                    <td className="py-3 px-4">
                      <div className="h-6 w-32 bg-gray-700 animate-pulse rounded"></div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-6 w-40 bg-gray-700 animate-pulse rounded"></div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-6 w-24 bg-gray-700 animate-pulse rounded"></div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-6 w-28 bg-gray-700 animate-pulse rounded"></div>
                    </td>
                  </tr>
                ))
              ) : recentAdmins.length > 0 ? (
                recentAdmins.map((admin, index) => (
                  <tr key={index} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3 text-gray-300">
                          <User className="w-4 h-4" />
                        </div>
                        <span>{admin.name || 'Admin User'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center text-gray-300">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {admin.email}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {admin.added_by || 'System'}
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {new Date(admin.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-400">
                    No admin users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 text-center">
          <Link 
            href="/admin/dashboard/users?type=admin" 
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center"
          >
            View All Admin Users
            <ChevronRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
      </motion.div>
      
      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="p-3 bg-blue-600/20 rounded-lg inline-block mb-4">
            <BarChart3 className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">View Analytics</h3>
          <p className="text-gray-400 text-sm mb-4">
            Access detailed platform analytics and usage statistics
          </p>
          <Link 
            href="/admin/dashboard/analytics" 
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center"
          >
            Go to Analytics
            <ChevronRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="p-3 bg-green-600/20 rounded-lg inline-block mb-4">
            <Calendar className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">Manage Events</h3>
          <p className="text-gray-400 text-sm mb-4">
            Create, edit or delete upcoming community events
          </p>
          <Link 
            href="/admin/dashboard/events" 
            className="text-sm text-green-400 hover:text-green-300 transition-colors inline-flex items-center"
          >
            Manage Events
            <ChevronRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="p-3 bg-purple-600/20 rounded-lg inline-block mb-4">
            <Zap className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">System Status</h3>
          <p className="text-gray-400 text-sm mb-4">
            Check system performance and component status
          </p>
          <Link 
            href="/admin/dashboard/status" 
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center"
          >
            View Status
            <ChevronRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

// Function to import Shield icon without getting undefined error
function Shield(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
  );
}