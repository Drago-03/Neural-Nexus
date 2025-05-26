"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/providers/AppProvider';
import { AnimatedButton } from '@/components/ui/animated-button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { 
  Plus, Upload, Zap, Users, DollarSign, 
  BarChart2, TrendingUp, Clock, Diamond, Settings,
  Layers, Database, Award, Bookmark, Eye, AlertTriangle,
  Key, Copy, RefreshCw, Trash2, Code, Lock, Download
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ModelAnalytics } from '@/components/dashboard/ModelAnalytics';
import { SalesAnalytics } from '@/components/dashboard/SalesAnalytics';
import { CustomerManagement } from '@/components/dashboard/CustomerManagement';
import ProfileCompleteModal from '@/components/ProfileCompleteModal';
import { useSession } from 'next-auth/react';
import { useSupabase } from '@/providers/SupabaseProvider';
import { User } from '@supabase/supabase-js';
import { toast } from 'react-hot-toast';

interface SessionUser {
  id: string;
  username?: string;
  role?: string;
  email?: string;
  name?: string | null;
  image?: string | null;
  user_metadata?: {
    first_name?: string;
    [key: string]: any;
  };
}

interface StatCard {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  color: string;
}

/**
 * Type guard to check if a value is not null or undefined
 */
function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Safe accessor for user name
 */
const getUserName = (userData: any, session: any): string => {
  // Try different paths to get user name
  if (isDefined(userData?.name)) return userData.name;
  if (isDefined(session?.user?.name)) return session.user.name;
  if (isDefined(session?.user?.username)) return session.user.username;
  if (isDefined(userData?.username)) return userData.username;
  if (isDefined(userData?.user_metadata?.first_name)) {
    return userData.user_metadata.first_name;
  }
  
  // Default fallback
  return "User";
};

/**
 * Safe accessor for user email
 */
const getUserEmail = (userData: any, session: any): string => {
  if (isDefined(userData?.email)) return userData.email;
  if (isDefined(session?.user?.email)) return session.user.email;
  
  // Default fallback
  return "";
};

/**
 * Safe accessor for user avatar
 */
const getUserAvatar = (userData: any, session: any): string => {
  if (isDefined(userData?.avatar)) return userData.avatar;
  if (isDefined(session?.user?.image)) return session.user.image;
  
  // Default fallback
  return "";
};

// Safely access user properties with proper type checking
const getUserProperty = (session: SessionUser | User | null, property: string, fallback: any = '') => {
  if (!session) return fallback;
  
  // Handle NextAuth session
  if ('user' in session && session.user) {
    // @ts-ignore - Using dynamic property access
    return session.user[property] || fallback;
  }
  
  // Handle Supabase user
  // @ts-ignore - Using dynamic property access
  return session[property] || fallback;
};

async function fetchUserDashboardData(userId: string) {
  // Placeholder data for user dashboard
  try {
    // Fetch user models
    const modelsResponse = await fetch(`/api/models?creatorId=${userId}&limit=5`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!modelsResponse.ok) {
      throw new Error('Failed to fetch user models');
    }

    const modelsData = await modelsResponse.json();
    const userModels = modelsData.models || [];

    // Fetch user revenue data
    const revenueResponse = await fetch(`/api/user/revenue`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!revenueResponse.ok) {
      throw new Error('Failed to fetch user revenue data');
    }

    const revenueData = await revenueResponse.json();

    // Fetch user activity data
    const activityResponse = await fetch(`/api/user/activity`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!activityResponse.ok) {
      throw new Error('Failed to fetch user activity data');
    }

    const activityData = await activityResponse.json();

    return {
      models: userModels,
      revenue: revenueData.revenue || [],
      activities: activityData.activities || []
    };
  } catch (error) {
    console.error('Error fetching user dashboard data:', error);
    
    // Return fallback data in case of errors
    return {
      models: [],
      revenue: [],
      activities: []
    };
  }
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [chartHovered, setChartHovered] = useState<number | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [hasCompletedProfile, setHasCompletedProfile] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [stats, setStats] = useState<StatCard[]>([]);
  const [myModels, setMyModels] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  
  const router = useRouter();
  const { user: appUser } = useAppContext();
  const { data: sessionData, status } = useSession();
  const { user: supabaseUser } = useSupabase();
  
  // Get the user from either NextAuth or Supabase
  const session = supabaseUser || sessionData?.user as unknown as SessionUser;
  
  // Find the highest value for chart scaling (minimum of 1 to avoid division by zero)
  const maxRevenue = Math.max(...(revenueData?.map(item => item.amount) || []), 1);
  
  // Check if user profile is complete and fetch user data
  useEffect(() => {
    const fetchProfileStatus = async () => {
      try {
        if (!session) {
          setLoading(false);
          return;
        }
        
        const userId = getUserProperty(session, 'id');
        if (!userId) {
          setLoading(false);
          return;
        }

        // Fetch user profile from MongoDB through our API
        const response = await fetch('/api/user', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const userData = await response.json();
          console.log("Loaded user data from database:", userData);
          
          setUserData(userData);
          setHasCompletedProfile(userData.profileComplete || false);
          
          // Show profile modal if profile is not complete
          if (!userData.profileComplete) {
            setIsProfileModalOpen(true);
          }
          
          // Once we have user data, fetch dashboard data using the new function
          const dashboardData = await fetchUserDashboardData(userId);
          
          // Update state with dashboard data
          setMyModels(dashboardData.models || []);
          setRevenueData(dashboardData.revenue || []);
          setActivities(dashboardData.activities || []);
          
          // Create stats based on real model data
          let totalDownloads = 0;
          let totalReviews = 0;
          
          dashboardData.models.forEach((model: any) => {
            totalDownloads += model.downloads || 0;
            totalReviews += model.reviews?.length || 0;
          });
          
          // Update stats with real data
          setStats([
            {
              label: "Models Created",
              value: dashboardData.models.length || 0,
              icon: <Database className="h-5 w-5" />,
              change: 0, // Calculate change from previous period if available
              color: "from-blue-500 to-indigo-600"
            },
            {
              label: "Total Downloads",
              value: totalDownloads > 999 ? (totalDownloads/1000).toFixed(1) + 'k' : totalDownloads,
              icon: <Download className="h-5 w-5" />,
              change: 0,
              color: "from-purple-500 to-pink-600"
            },
            {
              label: "Revenue",
              value: dashboardData.revenue.reduce((sum: number, item: any) => sum + (item.amount || 0), 0).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD'
              }),
              icon: <DollarSign className="h-5 w-5" />,
              change: 0,
              color: "from-green-500 to-emerald-600"
            },
            {
              label: "API Calls",
              value: dashboardData.activities.filter((a: any) => a.type === 'api_call').length.toString(),
              icon: <Zap className="h-5 w-5" />,
              change: 0,
              color: "from-orange-500 to-red-600"
            }
          ]);
        } else {
          console.error("Failed to fetch user data");
          // If we can't load user data, still initialize with session data
          const email = getUserProperty(session, 'email');
          
          setUserData({
            id: userId,
            name: getUserProperty(session, 'name', email?.split('@')[0]),
            email: email,
            avatar: getUserProperty(session, 'image'),
            profileComplete: false
          });
          setIsProfileModalOpen(true);
          
          // Still try to fetch dashboard data with the user ID
          const dashboardData = await fetchUserDashboardData(userId);
          setMyModels(dashboardData.models || []);
          setRevenueData(dashboardData.revenue || []);
          setActivities(dashboardData.activities || []);
          
          // Set default stats
          setStats([
            {
              label: "Models Created",
              value: dashboardData.models.length || 0,
              icon: <Database className="h-5 w-5" />,
              change: 0,
              color: "from-blue-500 to-indigo-600"
            },
            {
              label: "Total Downloads",
              value: 0,
              icon: <Download className="h-5 w-5" />,
              change: 0,
              color: "from-purple-500 to-pink-600"
            },
            {
              label: "Revenue",
              value: "$0",
              icon: <DollarSign className="h-5 w-5" />,
              change: 0,
              color: "from-green-500 to-emerald-600"
            },
            {
              label: "API Calls",
              value: "0",
              icon: <Zap className="h-5 w-5" />,
              change: 0,
              color: "from-orange-500 to-red-600"
            }
          ]);
        }
      } catch (error) {
        console.error("Error fetching profile status:", error);
        
        // Handle error case
        const userId = getUserProperty(session, 'id');
        if (userId) {
          const dashboardData = await fetchUserDashboardData(userId);
          setMyModels(dashboardData.models || []);
          setRevenueData(dashboardData.revenue || []);
          setActivities(dashboardData.activities || []);
        }
      } finally {
        setLoading(false);
      }
    };

    if (status !== 'loading') {
      fetchProfileStatus();
    }
  }, [session, status]);

  // Handle profile completion
  const handleProfileComplete = async (profileData: any) => {
    try {
      console.log("Profile completed with data:", profileData);
      
      // Update local user data
      if (profileData) {
        setUserData((prev: any) => ({
          ...prev,
          ...profileData,
          profileComplete: true
        }));
        
        setHasCompletedProfile(true);
      }
      
      // Close modal
      setIsProfileModalOpen(false);
      
      // Show success notification
      toast.success("Profile completed successfully!");
      
      // Fetch updated dashboard data - use the new function and update all state
      if (userData?.id) {
        const dashboardData = await fetchUserDashboardData(userData.id);
        
        // Update dashboard state with fetched data
        setMyModels(dashboardData.models || []);
        setRevenueData(dashboardData.revenue || []);
        setActivities(dashboardData.activities || []);
        
        // Update stats with real data
        let totalDownloads = 0;
        dashboardData.models.forEach((model: any) => {
          totalDownloads += model.downloads || 0;
        });
        
        setStats([
          {
            label: "Models Created",
            value: dashboardData.models.length || 0,
            icon: <Database className="h-5 w-5" />,
            change: 0,
            color: "from-blue-500 to-indigo-600"
          },
          {
            label: "Total Downloads",
            value: totalDownloads > 999 ? (totalDownloads/1000).toFixed(1) + 'k' : totalDownloads,
            icon: <Download className="h-5 w-5" />,
            change: 0,
            color: "from-purple-500 to-pink-600"
          },
          {
            label: "Revenue",
            value: dashboardData.revenue.reduce((sum: number, item: any) => sum + (item.amount || 0), 0).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD'
            }),
            icon: <DollarSign className="h-5 w-5" />,
            change: 0,
            color: "from-green-500 to-emerald-600"
          },
          {
            label: "API Calls",
            value: dashboardData.activities.filter((a: any) => a.type === 'api_call').length.toString(),
            icon: <Zap className="h-5 w-5" />,
            change: 0,
            color: "from-orange-500 to-red-600"
          }
        ]);
      }
    } catch (error) {
      console.error("Error handling profile completion:", error);
      toast.error("There was an error updating your profile. Please try again.");
    }
  };
  
  // Tab data
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart2 className="h-4 w-4 mr-2" /> },
    { id: 'models', label: 'My Models', icon: <Database className="h-4 w-4 mr-2" /> },
    { id: 'sales', label: 'Sales', icon: <DollarSign className="h-4 w-4 mr-2" /> },
    { id: 'customers', label: 'Customers', icon: <Users className="h-4 w-4 mr-2" /> },
    { id: 'api', label: 'API Keys', icon: <Key className="h-4 w-4 mr-2" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4 mr-2" /> }
  ];
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <svg className="animate-spin h-10 w-10 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-purple-300 animate-pulse text-lg font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Welcome Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-1"
          >
            <h1 className="text-3xl font-bold">
              Yo, {getUserName(userData, session)}!
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400"
          >
            Welcome to your neural command center. Let's check out your stats and models!
          </motion.p>
        </div>
        
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          {stats.map((stat, index) => (
            <AnimatedCard 
              key={stat.label}
              className={`bg-gradient-to-r ${stat.color} p-5 rounded-xl flex flex-col justify-between h-full`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-medium opacity-90">{stat.label}</h3>
                <div className="p-2 bg-white/20 rounded-lg">
                  {stat.icon}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                {stat.change !== undefined && (
                  <div className={`text-xs flex items-center ${stat.change >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                    {stat.change >= 0 ? '↑' : '↓'} {Math.abs(stat.change)}% from last month
                  </div>
                )}
              </div>
            </AnimatedCard>
          ))}
        </motion.div>
        
        {/* Tabs */}
        <div className="flex overflow-x-auto pb-2 mb-6 scrollbar-hide gap-2">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl flex items-center whitespace-nowrap text-sm ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.icon}
              {tab.label}
            </motion.button>
          ))}
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content - Revenue Chart */}
                <div className="lg:col-span-2">
                  <AnimatedCard className="p-6 h-full">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold">Revenue Overview</h2>
                      <select 
                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm"
                        aria-label="Select time period"
                      >
                        <option>Last 7 months</option>
                        <option>Last 12 months</option>
                        <option>This year</option>
                      </select>
                    </div>
                    
                    {/* Chart */}
                    <div className="relative h-64">
                      <div className="absolute inset-0 flex items-end justify-between px-2">
                        {revenueData.map((item, index) => {
                          const height = (item.amount / maxRevenue) * 100;
                          return (
                            <motion.div
                              key={index}
                              className="relative group flex flex-col items-center"
                              onHoverStart={() => setChartHovered(index)}
                              onHoverEnd={() => setChartHovered(null)}
                              initial={{ height: 0 }}
                              animate={{ height: `${height}%` }}
                              transition={{ delay: index * 0.1, duration: 0.5 }}
                            >
                              {/* Tooltip */}
                              {chartHovered === index && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="absolute bottom-full mb-2 bg-black/80 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap"
                                >
                                  ${item.amount.toLocaleString()}
                                </motion.div>
                              )}
                              
                              <div 
                                className="w-10 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-md relative overflow-hidden group-hover:from-purple-400 group-hover:to-pink-400"
                                style={{ height: '100%' }}
                              >
                                <motion.div 
                                  className="absolute inset-0 bg-white/20"
                                  initial={{ y: '100%' }}
                                  whileHover={{ y: '0%' }}
                                  transition={{ duration: 0.3 }}
                                />
                              </div>
                              <div className="text-xs mt-2 text-gray-400">{item.month}</div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-6 border-t border-white/10 mt-6">
                      <div>
                        <p className="text-gray-400 text-sm">Total Revenue</p>
                        <p className="text-2xl font-bold">
                          ${revenueData.reduce((sum, item) => sum + (item.amount || 0), 0).toLocaleString()}
                        </p>
                      </div>
                      <AnimatedButton variant="primary" size="sm">
                        <span className="flex items-center">
                          <Zap className="h-4 w-4 mr-1" /> 
                          Generate Report
                        </span>
                      </AnimatedButton>
                    </div>
                  </AnimatedCard>
                </div>
                
                {/* Sidebar - Recent Activity */}
                <div>
                  <AnimatedCard className="p-6 h-full">
                    <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
                    <div className="space-y-4">
                      {activities.length > 0 ? (
                        activities.slice(0, 5).map((activity, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                            className="flex gap-3 pb-4 border-b border-white/5 last:border-0"
                          >
                            <div className="p-2 bg-white/5 rounded-full h-8 w-8 flex items-center justify-center shrink-0">
                              {activity.icon || <Clock className="h-4 w-4" />}
                            </div>
                            <div>
                              <p className="text-sm">{activity.text}</p>
                              <p className="text-xs text-gray-500">{activity.time}</p>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-400">
                          <p>No recent activity</p>
                        </div>
                      )}
                    </div>
                    {activities.length > 0 && (
                      <motion.div 
                        className="mt-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <Link href="#" className="text-sm text-purple-400 hover:text-purple-300 flex items-center">
                          View all activity
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatedCard>
                </div>
              </div>
            )}
            
            {activeTab === 'models' && (
              <ModelAnalytics />
            )}
            
            {activeTab === 'sales' && (
              <SalesAnalytics />
            )}
            
            {activeTab === 'customers' && (
              <CustomerManagement />
            )}
            
            {activeTab === 'api' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">API Keys</h2>
                    <p className="text-gray-400">Manage your API keys for integrating with Neural Nexus</p>
                  </div>
                  
                  <AnimatedButton
                    variant="primary"
                    size="sm"
                    className="flex-shrink-0 flex items-center gap-2"
                    onClick={() => {
                      toast.success("Creating new API key...");
                      // In a real app, this would call an API endpoint to create a new key
                    }}
                  >
                    <Key className="h-4 w-4" />
                    Create New API Key
                  </AnimatedButton>
                </div>
                
                {/* API Keys Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <AnimatedCard className="p-5">
                    <div className="flex flex-col">
                      <h3 className="text-sm font-medium text-gray-400">Available API Calls</h3>
                      <p className="text-2xl font-bold mt-2">
                        {activities.filter(a => a.type === 'api_call').length} / {Math.max(5000, activities.filter(a => a.type === 'api_call').length + 1000)}
                      </p>
                      <div className="w-full h-2 bg-gray-700 rounded-full mt-2 overflow-hidden">
                        <div 
                          className="bg-purple-500 h-full rounded-full" 
                          style={{ width: `${Math.min(100, (activities.filter(a => a.type === 'api_call').length / 5000) * 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Resets in {Math.floor(Math.random() * 30) + 1} days</p>
                    </div>
                  </AnimatedCard>
                  
                  <AnimatedCard className="p-5">
                    <div className="flex flex-col">
                      <h3 className="text-sm font-medium text-gray-400">Current Pricing</h3>
                      <p className="text-2xl font-bold mt-2">$0.001</p>
                      <p className="text-sm text-gray-400 mt-1">Per 1000 tokens</p>
                      <Link href="/pricing" className="text-purple-400 text-xs mt-1 flex items-center">
                        <span>View pricing plans</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  </AnimatedCard>
                  
                  <AnimatedCard className="p-5">
                    <div className="flex flex-col">
                      <h3 className="text-sm font-medium text-gray-400">Usage This Month</h3>
                      <p className="text-2xl font-bold mt-2">
                        ${((activities.filter(a => a.type === 'api_call').length / 1000) * 0.001).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {activities.filter(a => a.type === 'api_call').length.toLocaleString()} tokens processed
                      </p>
                      <p className="text-xs text-green-400 mt-1">
                        {activities.filter(a => a.type === 'api_call').length < 1000000 ? 'Free tier: No charges' : 'Paid tier'}
                      </p>
                    </div>
                  </AnimatedCard>
                </div>
                
                {/* API Keys Table - Show real keys or empty state */}
                <AnimatedCard className="overflow-hidden">
                  {activities.filter(a => a.type === 'api_key').length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-800">
                        <thead className="bg-gray-800/50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                              Key
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                              Created
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                              Last Used
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                          {activities.filter(a => a.type === 'api_key').slice(0, 2).map((key, index) => (
                            <tr key={index} className="bg-gray-900/30 hover:bg-gray-800/30 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="ml-0">
                                    <p className="text-sm font-medium">{key.details || (index === 0 ? 'Development Key' : 'Production Key')}</p>
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                      index === 0 ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                                    }`}>
                                      {index === 0 ? 'Default' : 'Restricted'}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <p className="text-sm font-mono bg-gray-800 px-3 py-1 rounded">
                                    {key.model || `NN-${Math.random().toString(36).substring(2, 10)}...`}
                                  </p>
                                  <button 
                                    className="ml-2 p-1 hover:bg-gray-800 rounded-md transition-colors"
                                    aria-label="Copy API key"
                                    onClick={() => toast.success("API key copied to clipboard")}
                                  >
                                    <Copy className="h-4 w-4 text-gray-400" />
                                  </button>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <p className="text-sm">{key.time || new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0]}</p>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <p className="text-sm">{new Date(Date.now() - Math.random() * 1000000000).toISOString().split('T')[0]}</p>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <button 
                                    className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
                                    aria-label="Refresh API key"
                                    onClick={() => toast.success("API key refreshed")}
                                  >
                                    <RefreshCw className="h-4 w-4 text-gray-400" />
                                  </button>
                                  <button 
                                    className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
                                    aria-label="Delete API key"
                                    onClick={() => toast.error("Cannot delete the only API key")}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-400" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <div className="mx-auto w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                        <Key className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No API Keys Found</h3>
                      <p className="text-gray-400 max-w-md mx-auto mb-6">
                        You haven't created any API keys yet. Create your first key to start integrating with Neural Nexus.
                      </p>
                      <AnimatedButton
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          toast.success("Creating new API key...");
                          // In a real app, this would call an API endpoint to create a new key
                        }}
                      >
                        <Key className="h-4 w-4 mr-2" />
                        Create Your First API Key
                      </AnimatedButton>
                    </div>
                  )}
                </AnimatedCard>
                
                {/* API Documentation */}
                <AnimatedCard className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <Code className="h-5 w-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium">API Documentation</h3>
                      <p className="text-sm text-gray-400 my-2">
                        Check out our comprehensive API documentation to learn how to integrate Neural Nexus models into your applications.
                      </p>
                      <div className="bg-gray-800/50 p-4 rounded-md my-4">
                        <p className="text-sm font-medium mb-2">Authentication Example:</p>
                        <pre className="bg-gray-900 p-3 rounded-md text-xs overflow-x-auto">
                          <code>
                            // JavaScript example<br/>
                            const response = await fetch('https://api.neuralnexus.ai/v1/models', &#123;<br/>
                            &nbsp;&nbsp;headers: &#123;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;'Authorization': 'Bearer YOUR_API_KEY'<br/>
                            &nbsp;&nbsp;&#125;<br/>
                            &#125;);
                          </code>
                        </pre>
                      </div>
                      <Link href="/api" className="text-purple-400 hover:text-purple-300 text-sm flex items-center">
                        View full documentation
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </AnimatedCard>
                
                {/* Client Secret & Callback URLs */}
                <AnimatedCard className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                      <Lock className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium">Client Secret & Callback URLs</h3>
                      <p className="text-sm text-gray-400 my-2">
                        For OAuth applications, use the client secret and configure your callback URLs below.
                      </p>
                      
                      <div className="space-y-4 mt-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Client Secret</label>
                          <div className="flex items-center">
                            <p className="text-sm font-mono bg-gray-800 px-3 py-2 rounded flex-1">
                              nn_client_secret_k4j5h6g7f8d9s0a1...</p>
                            <button 
                              className="ml-2 p-1 hover:bg-gray-800 rounded-md transition-colors"
                              aria-label="Copy client secret"
                            >
                              <Copy className="h-4 w-4 text-gray-400" />
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Callback URLs</label>
                          <div className="flex items-center">
                            <input 
                              type="text" 
                              value="https://myapp.example.com/callback"
                              placeholder="Enter callback URL"
                              className="bg-gray-800/80 border border-gray-700 rounded-lg py-2 px-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            <button 
                              className="ml-2 p-2 bg-purple-500 hover:bg-purple-600 rounded-md transition-colors"
                              aria-label="Add callback URL"
                            >
                              <Plus className="h-4 w-4 text-white" />
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Add multiple callback URLs for your OAuth application
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <AnimatedButton variant="outline" size="sm">
                          Save Settings
                        </AnimatedButton>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Account Settings</h2>
                    <p className="text-gray-400">Manage your profile and preferences</p>
                  </div>
                </div>
                
                {/* Profile Settings Card */}
                <AnimatedCard className="p-6">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-medium">Profile Information</h3>
                    <AnimatedButton variant="outline" size="sm" onClick={() => setIsProfileModalOpen(true)}>
                      Edit Profile
                    </AnimatedButton>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Display Name</p>
                      <p className="font-medium">{getUserName(userData, session)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Email</p>
                      <p className="font-medium">{getUserEmail(userData, session)}</p>
                    </div>
                    {userData?.bio && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-400 mb-1">Bio</p>
                        <p className="font-medium">{userData.bio}</p>
                      </div>
                    )}
                    {userData?.location && (
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Location</p>
                        <p className="font-medium">{userData.location}</p>
                      </div>
                    )}
                    {userData?.website && (
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Website</p>
                        <a href={userData.website} target="_blank" rel="noopener noreferrer" 
                           className="font-medium text-purple-400 hover:text-purple-300">
                          {userData.website}
                        </a>
                      </div>
                    )}
                  </div>
                </AnimatedCard>
                
                {/* Notifications Card */}
                <AnimatedCard className="p-6">
                  <h3 className="text-lg font-medium mb-4">Notification Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-400">Receive emails about sales and updates</p>
                      </div>
                      <div className="relative">
                        <input type="checkbox" id="emailNotifications" className="sr-only peer" defaultChecked />
                        <label htmlFor="emailNotifications" className="block w-12 h-6 rounded-full bg-gray-700 cursor-pointer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-5 after:h-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-6 peer-checked:bg-purple-500" aria-label="Toggle email notifications"></label>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-gray-400">Receive push notifications on your device</p>
                      </div>
                      <div className="relative">
                        <input type="checkbox" id="pushNotifications" className="sr-only peer" />
                        <label htmlFor="pushNotifications" className="block w-12 h-6 rounded-full bg-gray-700 cursor-pointer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-5 after:h-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-6 peer-checked:bg-purple-500" aria-label="Toggle push notifications"></label>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
                
                {/* Danger Zone */}
                <AnimatedCard className="p-6 border border-red-500/20">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-red-500/10 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-red-400">Danger Zone</h3>
                      <p className="text-sm text-gray-400 my-2">Permanently delete your account and all related data</p>
                      <AnimatedButton variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                        Delete Account
                      </AnimatedButton>
                    </div>
                  </div>
                </AnimatedCard>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      
      <Footer />
      
      {/* Profile Completion Modal */}
      {session && (
        <ProfileCompleteModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          onComplete={handleProfileComplete}
          userData={{
            displayName: getUserName(userData, session),
            email: getUserEmail(userData, session),
            photoURL: getUserAvatar(userData, session),
            username: userData?.username || '',
          }}
        />
      )}
    </div>
  );
} 