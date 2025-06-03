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
  Key, Copy, RefreshCw, Trash2, Code, Lock, Download, User, Building, Briefcase, MapPin, LinkIcon,
  Loader2, X, Check
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
import { User as SupabaseUser } from '@supabase/supabase-js';
import { toast } from 'react-hot-toast';
import AccountDeletionModal from '@/components/AccountDeletionModal';

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
const getUserProperty = (session: SessionUser | SupabaseUser | null, property: string, fallback: any = '') => {
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
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [stats, setStats] = useState<StatCard[]>([]);
  const [myModels, setMyModels] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [isLoadingApiKeys, setIsLoadingApiKeys] = useState(true);
  
  const router = useRouter();
  const { user: appUser } = useAppContext();
  const { data: sessionData, status } = useSession();
  const { user: supabaseUser } = useSupabase();
  
  // Get the user from either NextAuth or Supabase
  const session = supabaseUser || sessionData?.user as unknown as SessionUser;
  
  // Find the highest value for chart scaling (minimum of 1 to avoid division by zero)
  const maxRevenue = Math.max(...(revenueData?.map(item => item.amount) || []), 1);
  
  // Function to fetch API keys from the backend
  const fetchApiKeys = async () => {
    try {
      setIsLoadingApiKeys(true);
      
      const response = await fetch('/api/user/api-keys');
      
      if (!response.ok) {
        throw new Error('Failed to fetch API keys');
      }
      
      const data = await response.json();
      setApiKeys(data.apiKeys || []);
      
    } catch (error) {
      console.error('Error fetching API keys:', error);
      toast.error('Failed to load API keys');
      setApiKeys([]);
    } finally {
      setIsLoadingApiKeys(false);
    }
  };
  
  // Function to get color for key type badge
  const getKeyTypeColor = (keyType: string): string => {
    switch (keyType) {
      case 'test':
        return 'bg-blue-500/20 text-blue-400';
      case 'train':
        return 'bg-amber-500/20 text-amber-400';
      case 'deploy':
        return 'bg-indigo-500/20 text-indigo-400';
      case 'production':
        return 'bg-green-500/20 text-green-400';
      case 'development':
      default:
        return 'bg-purple-500/20 text-purple-400';
    }
  };
  
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
          
          setUserData((prev: any) => ({
            ...prev,
            ...userData,
            profileComplete: userData.profileComplete || false
          }));
          
          setHasCompletedProfile(userData.profileComplete || false);
          
          // Check if we've already shown the profile modal to this user
          const hasShownProfileModal = localStorage.getItem(`profile_modal_shown_${userId}`);
          
          // Only show profile modal if profile is not complete AND we haven't shown it before
          if (!userData.profileComplete && !hasShownProfileModal) {
            setIsProfileModalOpen(true);
            // Mark that we've shown the modal to this user
            localStorage.setItem(`profile_modal_shown_${userId}`, 'true');
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

  // Fetch API keys when the API tab is selected
  useEffect(() => {
    if (activeTab === 'api') {
      fetchApiKeys();
    }
  }, [activeTab]);

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
  
  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      // Show loading toast
      const loadingToast = toast.loading('Sending account deletion confirmation email...');
      
      // Call API to initiate account deletion
      const response = await fetch('/api/user/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to initiate account deletion');
      }
      
      const data = await response.json();
      
      // Close the modal automatically
      setIsDeleteAccountModalOpen(false);
      
      // Show success toast
      toast.success('Confirmation email sent! Check your inbox to complete account deletion. Your account will be deleted 48 hours after confirmation.');
      
      // If in development mode and devInfo is available, log the URL for easy testing
      if (data.devInfo && process.env.NODE_ENV === 'development') {
        console.log('Deletion confirmation URL (dev only):', data.devInfo.confirmationUrl);
      }
      
    } catch (error: any) {
      console.error('Error initiating account deletion:', error);
      
      // Show error toast
      toast.error(error.message || 'An error occurred while initiating account deletion');
    }
  };
  
  // Tab data
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart2 className="h-4 w-4 mr-2" /> },
    { id: 'models', label: 'My Models', icon: <Database className="h-4 w-4 mr-2" /> },
    { id: 'sales', label: 'Sales', icon: <DollarSign className="h-4 w-4 mr-2" /> },
    { id: 'customers', label: 'Customers', icon: <Users className="h-4 w-4 mr-2" /> },
    { id: 'profile', label: 'Profile', icon: <User className="h-4 w-4 mr-2" /> },
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
            
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <AnimatedCard className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Profile Image & Basic Info */}
                    <div className="flex flex-col items-center md:items-start md:w-1/3">
                      <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-800 mb-4">
                        {userData?.avatar ? (
                          <img 
                            src={userData.avatar} 
                            alt={userData.name || 'User'} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-purple-900/30">
                            <User className="w-12 h-12 text-purple-400" />
                          </div>
                        )}
                      </div>
                      
                      <h2 className="text-2xl font-bold mb-1 text-center md:text-left">{userData?.name || 'Your Name'}</h2>
                      <p className="text-gray-400 mb-4 text-center md:text-left">{userData?.email || 'email@example.com'}</p>
                      
                      <AnimatedButton 
                        variant="outline" 
                        size="sm"
                        className="mb-4 w-full md:w-auto"
                        onClick={() => setIsProfileModalOpen(true)}
                      >
                        Edit Profile
                      </AnimatedButton>
                      
                      {userData?.organization && (
                        <div className="flex items-center gap-2 mb-2">
                          <Building className="w-4 h-4 text-gray-400" />
                          <span>{userData.organization}</span>
                        </div>
                      )}
                      
                      {userData?.jobTitle && (
                        <div className="flex items-center gap-2 mb-2">
                          <Briefcase className="w-4 h-4 text-gray-400" />
                          <span>{userData.jobTitle}</span>
                        </div>
                      )}
                      
                      {userData?.location && (
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{userData.location}</span>
                        </div>
                      )}
                      
                      {userData?.website && (
                        <div className="flex items-center gap-2 mb-2">
                          <LinkIcon className="w-4 h-4 text-gray-400" />
                          <a href={userData.website} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
                            {userData.website.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      )}
                    </div>
                    
                    {/* Bio, Skills & Interests */}
                    <div className="md:w-2/3">
                      <h3 className="text-lg font-semibold mb-2">Bio</h3>
                      <p className="text-gray-300 mb-6">
                        {userData?.bio || 'No bio information provided yet. Edit your profile to add a bio.'}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Skills</h3>
                          {userData?.skills && userData.skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {userData.skills.map((skill: string, index: number) => (
                                <span 
                                  key={index} 
                                  className="px-3 py-1 bg-purple-900/30 border border-purple-900/50 rounded-full text-sm"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-400 text-sm">No skills added yet</p>
                          )}
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Interests</h3>
                          {userData?.interests && userData.interests.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {userData.interests.map((interest: string, index: number) => (
                                <span 
                                  key={index} 
                                  className="px-3 py-1 bg-blue-900/30 border border-blue-900/50 rounded-full text-sm"
                                >
                                  {interest}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-400 text-sm">No interests added yet</p>
                          )}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold mb-3">Activity Stats</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="text-2xl font-bold text-purple-400">{myModels.length}</div>
                          <div className="text-sm text-gray-400">Models</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="text-2xl font-bold text-blue-400">{activities.filter(a => a.type === 'comment').length}</div>
                          <div className="text-sm text-gray-400">Comments</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="text-2xl font-bold text-green-400">{activities.filter(a => a.type === 'download').length}</div>
                          <div className="text-sm text-gray-400">Downloads</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="text-2xl font-bold text-pink-400">{activities.filter(a => a.type === 'like').length}</div>
                          <div className="text-sm text-gray-400">Likes</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              </div>
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
                    onClick={async () => {
                      try {
                        toast.loading("Creating new API key...");
                        
                        // Call the API to create a new key
                        const response = await fetch('/api/user/api-keys', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({
                            name: 'API Key',
                            keyType: 'development'
                          })
                        });
                        
                        if (!response.ok) {
                          const errorData = await response.json();
                          throw new Error(errorData.error || 'Failed to create API key');
                        }
                        
                        const data = await response.json();
                        
                        // Show success message
                        toast.dismiss();
                        toast.success("API key created successfully!");
                        
                        // Show a dialog with the new API key
                        // This is the only time the full key will be shown
                        const confirmed = window.confirm(`Your new API key has been created. Copy it now as it won't be shown again:\n\n${data.apiKey.key}\n\nClick OK after you've copied it.`);
                        
                        // Refresh the API keys list
                        fetchApiKeys();
                        
                      } catch (error: any) {
                        toast.dismiss();
                        toast.error(error.message || 'Failed to create API key');
                      }
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
                        {apiKeys.reduce((acc, key) => acc + (key.currentUsage || 0), 0)} / {apiKeys.reduce((acc, key) => acc + (key.usageLimit || 5000), 0)}
                      </p>
                      <div className="w-full h-2 bg-gray-700 rounded-full mt-2 overflow-hidden">
                        <div 
                          className="bg-purple-500 h-full rounded-full" 
                          style={{ 
                            width: `${apiKeys.reduce((acc, key) => acc + (key.currentUsage || 0), 0) / apiKeys.reduce((acc, key) => acc + (key.usageLimit || 5000), 0) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Monthly usage across all keys</p>
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
                      <h3 className="text-sm font-medium text-gray-400">Active API Keys</h3>
                      <p className="text-2xl font-bold mt-2">
                        {apiKeys.filter(key => key.isActive).length} / {apiKeys.length}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {apiKeys.filter(key => key.isActive).length === 0 ? 'No active keys' : 
                         apiKeys.filter(key => key.isActive).length === 1 ? '1 active key' : 
                         `${apiKeys.filter(key => key.isActive).length} active keys`}
                      </p>
                      <p className="text-xs text-green-400 mt-1">
                        {apiKeys.length === 0 ? 'Create your first key to get started' : 'Keys ready for use'}
                      </p>
                    </div>
                  </AnimatedCard>
                </div>
                
                {/* API Keys Table */}
                <AnimatedCard className="overflow-hidden">
                  {isLoadingApiKeys ? (
                    <div className="py-12 text-center">
                      <div className="mx-auto w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                        <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">Loading API Keys</h3>
                      <p className="text-gray-400 max-w-md mx-auto">
                        Please wait while we fetch your API keys...
                      </p>
                    </div>
                  ) : apiKeys.length > 0 ? (
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
                              Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                              Created
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                              Usage
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                          {apiKeys.map((key) => (
                            <tr key={key._id.toString()} className="bg-gray-900/30 hover:bg-gray-800/30 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="ml-0">
                                    <p className="text-sm font-medium">{key.name}</p>
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                      key.isActive 
                                        ? 'bg-green-500/20 text-green-400' 
                                        : 'bg-red-500/20 text-red-400'
                                    }`}>
                                      {key.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <p className="text-sm font-mono bg-gray-800 px-3 py-1 rounded">
                                    {key.key}
                                  </p>
                                  <button 
                                    className="ml-2 p-1 hover:bg-gray-800 rounded-md transition-colors"
                                    aria-label="Copy API key"
                                    onClick={() => {
                                      // Copy the masked key to clipboard
                                      navigator.clipboard.writeText(key.key);
                                      toast.success("API key copied to clipboard");
                                    }}
                                  >
                                    <Copy className="h-4 w-4 text-gray-400" />
                                  </button>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs rounded-full ${getKeyTypeColor(key.keyType)}`}>
                                  {key.keyType}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <p className="text-sm">{new Date(key.createdAt).toLocaleDateString()}</p>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <p className="text-sm">{key.currentUsage || 0} / {key.usageLimit || 5000}</p>
                                  <div className="w-24 h-1 bg-gray-700 rounded-full mt-1 overflow-hidden">
                                    <div 
                                      className="bg-purple-500 h-full rounded-full" 
                                      style={{ 
                                        width: `${((key.currentUsage || 0) / (key.usageLimit || 5000)) * 100}%` 
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <button 
                                    className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
                                    aria-label="Refresh API key"
                                    onClick={async () => {
                                      try {
                                        const confirmRefresh = window.confirm("Are you sure you want to refresh this API key? The current key will no longer work and a new one will be generated.");
                                        
                                        if (!confirmRefresh) return;
                                        
                                        toast.loading("Refreshing API key...");
                                        
                                        // Call API to refresh key
                                        const response = await fetch('/api/user/api-keys', {
                                          method: 'PATCH',
                                          headers: {
                                            'Content-Type': 'application/json'
                                          },
                                          body: JSON.stringify({
                                            keyId: key._id,
                                            action: 'refresh'
                                          })
                                        });
                                        
                                        if (!response.ok) {
                                          const errorData = await response.json();
                                          throw new Error(errorData.error || 'Failed to refresh API key');
                                        }
                                        
                                        const data = await response.json();
                                        
                                        // Show success message
                                        toast.dismiss();
                                        toast.success("API key refreshed successfully!");
                                        
                                        // Show a dialog with the new API key
                                        const confirmed = window.confirm(`Your new API key has been created. Copy it now as it won't be shown again:\n\n${data.apiKey.key}\n\nClick OK after you've copied it.`);
                                        
                                        // Refresh the API keys list
                                        fetchApiKeys();
                                        
                                      } catch (error: any) {
                                        toast.dismiss();
                                        toast.error(error.message || 'Failed to refresh API key');
                                      }
                                    }}
                                  >
                                    <RefreshCw className="h-4 w-4 text-gray-400" />
                                  </button>
                                  <button 
                                    className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
                                    aria-label={key.isActive ? "Deactivate API key" : "Activate API key"}
                                    onClick={async () => {
                                      try {
                                        toast.loading(key.isActive ? "Deactivating API key..." : "Activating API key...");
                                        
                                        // Call API to toggle key state
                                        const response = await fetch('/api/user/api-keys', {
                                          method: 'PATCH',
                                          headers: {
                                            'Content-Type': 'application/json'
                                          },
                                          body: JSON.stringify({
                                            keyId: key._id,
                                            action: 'toggle'
                                          })
                                        });
                                        
                                        if (!response.ok) {
                                          const errorData = await response.json();
                                          throw new Error(errorData.error || 'Failed to update API key');
                                        }
                                        
                                        // Show success message
                                        toast.dismiss();
                                        toast.success(key.isActive ? "API key deactivated successfully!" : "API key activated successfully!");
                                        
                                        // Refresh the API keys list
                                        fetchApiKeys();
                                        
                                      } catch (error: any) {
                                        toast.dismiss();
                                        toast.error(error.message || 'Failed to update API key');
                                      }
                                    }}
                                  >
                                    {key.isActive ? (
                                      <X className="h-4 w-4 text-red-400" />
                                    ) : (
                                      <Check className="h-4 w-4 text-green-400" />
                                    )}
                                  </button>
                                  <button 
                                    className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
                                    aria-label="Delete API key"
                                    onClick={async () => {
                                      try {
                                        const confirmDelete = window.confirm("Are you sure you want to delete this API key? This action cannot be undone.");
                                        
                                        if (!confirmDelete) return;
                                        
                                        toast.loading("Deleting API key...");
                                        
                                        // Call API to delete key
                                        const response = await fetch(`/api/user/api-keys?id=${key._id}`, {
                                          method: 'DELETE'
                                        });
                                        
                                        if (!response.ok) {
                                          const errorData = await response.json();
                                          throw new Error(errorData.error || 'Failed to delete API key');
                                        }
                                        
                                        // Show success message
                                        toast.dismiss();
                                        toast.success("API key deleted successfully!");
                                        
                                        // Refresh the API keys list
                                        fetchApiKeys();
                                        
                                      } catch (error: any) {
                                        toast.dismiss();
                                        toast.error(error.message || 'Failed to delete API key');
                                      }
                                    }}
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
                        You haven't created any API keys yet. Create a key to start integrating with Neural Nexus.
                      </p>
                      <AnimatedButton
                        variant="primary"
                        size="sm"
                        onClick={async () => {
                          try {
                            toast.loading("Creating new API key...");
                            
                            // Call the API to create a new key
                            const response = await fetch('/api/user/api-keys', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json'
                              },
                              body: JSON.stringify({
                                name: 'API Key',
                                keyType: 'development'
                              })
                            });
                            
                            if (!response.ok) {
                              const errorData = await response.json();
                              throw new Error(errorData.error || 'Failed to create API key');
                            }
                            
                            const data = await response.json();
                            
                            // Show success message
                            toast.dismiss();
                            toast.success("API key created successfully!");
                            
                            // Show a dialog with the new API key
                            const confirmed = window.confirm(`Your new API key has been created. Copy it now as it won't be shown again:\n\n${data.apiKey.key}\n\nClick OK after you've copied it.`);
                            
                            // Refresh the API keys list
                            fetchApiKeys();
                            
                          } catch (error: any) {
                            toast.dismiss();
                            toast.error(error.message || 'Failed to create API key');
                          }
                        }}
                      >
                        <Key className="h-4 w-4 mr-2" />
                        Create API Key
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

                      {/* API Tabs */}
                      <div className="border-b border-gray-800 mb-4">
                        <div className="flex overflow-x-auto scrollbar-hide -mx-2">
                          <button className="px-4 py-2 text-sm text-purple-400 border-b-2 border-purple-500 mx-2 whitespace-nowrap">
                            Getting Started
                          </button>
                          <button className="px-4 py-2 text-sm text-gray-400 hover:text-gray-300 mx-2 whitespace-nowrap">
                            Models API
                          </button>
                          <button className="px-4 py-2 text-sm text-gray-400 hover:text-gray-300 mx-2 whitespace-nowrap">
                            Inference API
                          </button>
                          <button className="px-4 py-2 text-sm text-gray-400 hover:text-gray-300 mx-2 whitespace-nowrap">
                            Training API
                          </button>
                          <button className="px-4 py-2 text-sm text-gray-400 hover:text-gray-300 mx-2 whitespace-nowrap">
                            User API
                          </button>
                        </div>
                      </div>

                      {/* API Key Information */}
                      <div className="space-y-6">
                        {/* Authentication */}
                        <div>
                          <h4 className="text-md font-medium mb-2">Authentication</h4>
                          <div className="bg-gray-800/50 p-4 rounded-md">
                            <p className="text-sm mb-2">All API requests require authentication using your API key in the header:</p>
                        <pre className="bg-gray-900 p-3 rounded-md text-xs overflow-x-auto">
                          <code>
                            const response = await fetch('https://api.neuralnexus.ai/v1/models', &#123;<br/>
                                &nbsp;&nbsp;headers: &#123;<br/>
                                &nbsp;&nbsp;&nbsp;&nbsp;'Authorization': 'Bearer YOUR_API_KEY',<br/>
                                &nbsp;&nbsp;&nbsp;&nbsp;'Content-Type': 'application/json'<br/>
                                &nbsp;&nbsp;&#125;<br/>
                                &#125;);
                              </code>
                            </pre>
                            <div className="mt-3 p-2 bg-amber-900/20 border border-amber-800/30 rounded-md">
                              <p className="text-xs text-amber-300 flex items-start gap-2">
                                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                                <span>Keep your API keys secure! Never expose them in client-side code or public repositories. Use environment variables and server-side code to protect your keys.</span>
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* API Key Types */}
                        <div>
                          <h4 className="text-md font-medium mb-2">API Key Types</h4>
                          <div className="bg-gray-800/50 p-4 rounded-md">
                            <p className="text-sm mb-3">Neural Nexus offers different API key types based on your usage needs:</p>
                            
                            <div className="space-y-3">
                              <div className="flex items-start gap-3">
                                <div className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs flex items-center justify-center mt-0.5">test</div>
                                <div>
                                  <p className="text-sm font-medium">Test Keys (nxt_)</p>
                                  <p className="text-xs text-gray-400">For testing your integration during development</p>
                                  <p className="text-xs text-blue-400 mt-1">1,000 requests/month limit</p>
                                </div>
                              </div>
                              
                              <div className="flex items-start gap-3">
                                <div className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs flex items-center justify-center mt-0.5">dev</div>
                                <div>
                                  <p className="text-sm font-medium">Development Keys (nnd_)</p>
                                  <p className="text-xs text-gray-400">For development environments and staging</p>
                                  <p className="text-xs text-purple-400 mt-1">5,000 requests/month limit</p>
                                </div>
                              </div>
                              
                              <div className="flex items-start gap-3">
                                <div className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs flex items-center justify-center mt-0.5">train</div>
                                <div>
                                  <p className="text-sm font-medium">Training Keys (ntr_)</p>
                                  <p className="text-xs text-gray-400">For fine-tuning models and training operations</p>
                                  <p className="text-xs text-amber-400 mt-1">10,000 requests/month limit</p>
                                </div>
                              </div>
                              
                              <div className="flex items-start gap-3">
                                <div className="px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-xs flex items-center justify-center mt-0.5">deploy</div>
                                <div>
                                  <p className="text-sm font-medium">Deployment Keys (ndp_)</p>
                                  <p className="text-xs text-gray-400">For UAT and pre-production environments</p>
                                  <p className="text-xs text-indigo-400 mt-1">50,000 requests/month limit</p>
                                </div>
                              </div>
                              
                              <div className="flex items-start gap-3">
                                <div className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs flex items-center justify-center mt-0.5">prod</div>
                                <div>
                                  <p className="text-sm font-medium">Production Keys (npr_)</p>
                                  <p className="text-xs text-gray-400">For production applications with SLA guarantees</p>
                                  <p className="text-xs text-green-400 mt-1">100,000 requests/month limit</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* API Key Management */}
                        <div>
                          <h4 className="text-md font-medium mb-2">API Key Management</h4>
                          <div className="bg-gray-800/50 p-4 rounded-md">
                            <p className="text-sm mb-3">Best practices for managing your API keys:</p>
                            <ul className="list-disc list-inside space-y-2 text-xs text-gray-300">
                              <li>Create different keys for different environments (development, staging, production)</li>
                              <li>Rotate keys regularly for enhanced security</li>
                              <li>Delete unused keys to minimize security exposure</li>
                              <li>Monitor key usage to detect any unauthorized access</li>
                              <li>Use least privilege principle - only enable permissions your application needs</li>
                            </ul>
                            <div className="mt-3">
                              <p className="text-xs text-gray-400">For detailed API key management instructions, visit our <a href="/docs/api-keys" className="text-purple-400 hover:underline">API Key Security Guide</a>.</p>
                            </div>
                          </div>
                        </div>

                        {/* Models API */}
                        <div>
                          <h4 className="text-md font-medium mb-2">Models API</h4>
                          <p className="text-sm text-gray-400 mb-3">
                            The Models API lets you list, search, and get details about available models.
                          </p>
                          <div className="space-y-3">
                            <div className="bg-gray-800/50 p-3 rounded-md">
                              <p className="text-sm font-medium text-purple-400 mb-1">List Models</p>
                              <p className="text-xs text-gray-400 mb-2">GET /v1/models</p>
                              <pre className="bg-gray-900 p-2 rounded-md text-xs overflow-x-auto">
                                <code>
                                  // Get all available models<br/>
                                  const models = await fetch('https://api.neuralnexus.ai/v1/models', &#123;<br/>
                                  &nbsp;&nbsp;headers: &#123;<br/>
                                  &nbsp;&nbsp;&nbsp;&nbsp;'Authorization': 'Bearer YOUR_API_KEY'<br/>
                                  &nbsp;&nbsp;&#125;<br/>
                                  &#125;);<br/>
                                  <br/>
                                  // Filter by category<br/>
                                  const nlpModels = await fetch('https://api.neuralnexus.ai/v1/models?category=nlp', &#123;<br/>
                            &nbsp;&nbsp;headers: &#123;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;'Authorization': 'Bearer YOUR_API_KEY'<br/>
                            &nbsp;&nbsp;&#125;<br/>
                            &#125;);
                          </code>
                        </pre>
                      </div>

                            <div className="bg-gray-800/50 p-3 rounded-md">
                              <p className="text-sm font-medium text-purple-400 mb-1">Get Model Details</p>
                              <p className="text-xs text-gray-400 mb-2">GET /v1/models/{'{model_id}'}</p>
                              <pre className="bg-gray-900 p-2 rounded-md text-xs overflow-x-auto">
                                <code>
                                  // Get details for a specific model<br/>
                                  const modelDetails = await fetch('https://api.neuralnexus.ai/v1/models/nn-7b-chat', &#123;<br/>
                                  &nbsp;&nbsp;headers: &#123;<br/>
                                  &nbsp;&nbsp;&nbsp;&nbsp;'Authorization': 'Bearer YOUR_API_KEY'<br/>
                                  &nbsp;&nbsp;&#125;<br/>
                                  &#125;);
                                </code>
                              </pre>
                            </div>
                          </div>
                        </div>

                        {/* Inference API */}
                        <div>
                          <h4 className="text-md font-medium mb-2">Inference API</h4>
                          <p className="text-sm text-gray-400 mb-3">
                            The Inference API allows you to run models on your inputs and get predictions in real-time.
                          </p>
                          <div className="space-y-3">
                            <div className="bg-gray-800/50 p-3 rounded-md">
                              <p className="text-sm font-medium text-purple-400 mb-1">Text Generation</p>
                              <p className="text-xs text-gray-400 mb-2">POST /v1/completions</p>
                              <pre className="bg-gray-900 p-2 rounded-md text-xs overflow-x-auto">
                                <code>
                                  await fetch('https://api.neuralnexus.ai/v1/completions', &#123;<br/>
                                  &nbsp;&nbsp;method: 'POST',<br/>
                                  &nbsp;&nbsp;headers: &#123;<br/>
                                  &nbsp;&nbsp;&nbsp;&nbsp;'Authorization': 'Bearer YOUR_API_KEY',<br/>
                                  &nbsp;&nbsp;&nbsp;&nbsp;'Content-Type': 'application/json'<br/>
                                  &nbsp;&nbsp;&#125;,<br/>
                                  &nbsp;&nbsp;body: JSON.stringify(&#123;<br/>
                                  &nbsp;&nbsp;&nbsp;&nbsp;model: 'nn-7b-chat',<br/>
                                  &nbsp;&nbsp;&nbsp;&nbsp;prompt: 'What are neural networks?',<br/>
                                  &nbsp;&nbsp;&nbsp;&nbsp;max_tokens: 100,<br/>
                                  &nbsp;&nbsp;&nbsp;&nbsp;temperature: 0.7<br/>
                                  &nbsp;&nbsp;&#125;)<br/>
                                  &#125;);
                                </code>
                              </pre>
                            </div>

                            <div className="bg-gray-800/50 p-3 rounded-md">
                              <p className="text-sm font-medium text-purple-400 mb-1">Chat Completions</p>
                              <p className="text-xs text-gray-400 mb-2">POST /v1/chat/completions</p>
                              <pre className="bg-gray-900 p-2 rounded-md text-xs overflow-x-auto">
                                <code>
                                  await fetch('https://api.neuralnexus.ai/v1/chat/completions', &#123;<br/>
                                  &nbsp;&nbsp;method: 'POST',<br/>
                                  &nbsp;&nbsp;headers: &#123;<br/>
                                  &nbsp;&nbsp;&nbsp;&nbsp;'Authorization': 'Bearer YOUR_API_KEY',<br/>
                                  &nbsp;&nbsp;&nbsp;&nbsp;'Content-Type': 'application/json'<br/>
                                  &nbsp;&nbsp;&#125;,<br/>
                                  &nbsp;&nbsp;body: JSON.stringify(&#123;<br/>
                                  &nbsp;&nbsp;&nbsp;&nbsp;model: 'nn-7b-chat',<br/>
                                  &nbsp;&nbsp;&nbsp;&nbsp;messages: [<br/>
                                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#123; role: 'system', content: 'You are a helpful assistant.' &#125;,<br/>
                                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#123; role: 'user', content: 'Hello, who are you?' &#125;<br/>
                                  &nbsp;&nbsp;&nbsp;&nbsp;]<br/>
                                  &nbsp;&nbsp;&#125;)<br/>
                                  &#125;);
                                </code>
                              </pre>
                            </div>

                            <div className="bg-gray-800/50 p-3 rounded-md">
                              <p className="text-sm font-medium text-purple-400 mb-1">Image Generation</p>
                              <p className="text-xs text-gray-400 mb-2">POST /v1/images/generations</p>
                              <pre className="bg-gray-900 p-2 rounded-md text-xs overflow-x-auto">
                                <code>
                                  await fetch('https://api.neuralnexus.ai/v1/images/generations', &#123;<br/>
                                  &nbsp;&nbsp;method: 'POST',<br/>
                                  &nbsp;&nbsp;headers: &#123;<br/>
                                  &nbsp;&nbsp;&nbsp;&nbsp;'Authorization': 'Bearer YOUR_API_KEY',<br/>
                                  &nbsp;&nbsp;&nbsp;&nbsp;'Content-Type': 'application/json'<br/>
                                  &nbsp;&nbsp;&#125;,<br/>
                                  &nbsp;&nbsp;body: JSON.stringify(&#123;<br/>
                                  &nbsp;&nbsp;&nbsp;&nbsp;model: 'nn-diffusion-xl',<br/>
                                  &nbsp;&nbsp;&nbsp;&nbsp;prompt: 'A futuristic city with flying cars',<br/>
                                  &nbsp;&nbsp;&nbsp;&nbsp;n: 1,<br/>
                                  &nbsp;&nbsp;&nbsp;&nbsp;size: '1024x1024'<br/>
                                  &nbsp;&nbsp;&#125;)<br/>
                                  &#125;);
                                </code>
                              </pre>
                            </div>
                          </div>
                        </div>

                        {/* Rate Limits and Quotas */}
                        <div>
                          <h4 className="text-md font-medium mb-2">Rate Limits & Quotas</h4>
                          <div className="bg-gray-800/50 p-4 rounded-md">
                            <p className="text-sm mb-3">API key usage is subject to the following limits:</p>
                            
                            <table className="w-full text-xs">
                              <thead className="text-gray-400">
                                <tr>
                                  <th className="py-2 text-left">Key Type</th>
                                  <th className="py-2 text-left">Monthly Quota</th>
                                  <th className="py-2 text-left">Rate Limit</th>
                                  <th className="py-2 text-left">Burst Limit</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-700">
                                <tr>
                                  <td className="py-2">Test</td>
                                  <td className="py-2">1,000 requests</td>
                                  <td className="py-2">10 req/min</td>
                                  <td className="py-2">20 req/min</td>
                                </tr>
                                <tr>
                                  <td className="py-2">Development</td>
                                  <td className="py-2">5,000 requests</td>
                                  <td className="py-2">60 req/min</td>
                                  <td className="py-2">100 req/min</td>
                                </tr>
                                <tr>
                                  <td className="py-2">Training</td>
                                  <td className="py-2">10,000 requests</td>
                                  <td className="py-2">120 req/min</td>
                                  <td className="py-2">200 req/min</td>
                                </tr>
                                <tr>
                                  <td className="py-2">Deployment</td>
                                  <td className="py-2">50,000 requests</td>
                                  <td className="py-2">300 req/min</td>
                                  <td className="py-2">500 req/min</td>
                                </tr>
                                <tr>
                                  <td className="py-2">Production</td>
                                  <td className="py-2">100,000 requests</td>
                                  <td className="py-2">600 req/min</td>
                                  <td className="py-2">1,000 req/min</td>
                                </tr>
                              </tbody>
                            </table>
                            
                            <p className="text-xs text-gray-400 mt-3">
                              When you exceed your rate limit, requests will return a 429 Too Many Requests status code. 
                              When you exceed your monthly quota, requests will return a 403 Forbidden status code with details about upgrading.
                            </p>
                          </div>
                        </div>

                        {/* Error Handling */}
                        <div>
                          <h4 className="text-md font-medium mb-2">Error Handling</h4>
                          <div className="bg-gray-800/50 p-4 rounded-md">
                            <p className="text-sm mb-3">API responses use standard HTTP status codes and include detailed error messages:</p>
                            
                            <pre className="bg-gray-900 p-2 rounded-md text-xs overflow-x-auto">
                              <code>
                                &#123;<br/>
                                &nbsp;&nbsp;"error": &#123;<br/>
                                &nbsp;&nbsp;&nbsp;&nbsp;"message": "Authentication failed. Invalid API key provided.",<br/>
                                &nbsp;&nbsp;&nbsp;&nbsp;"type": "authentication_error",<br/>
                                &nbsp;&nbsp;&nbsp;&nbsp;"code": "invalid_api_key",<br/>
                                &nbsp;&nbsp;&nbsp;&nbsp;"status": 401,<br/>
                                &nbsp;&nbsp;&nbsp;&nbsp;"request_id": "req_12345"<br/>
                                &nbsp;&nbsp;&#125;<br/>
                                &#125;
                              </code>
                            </pre>
                            
                            <div className="mt-3 space-y-2">
                              <p className="text-xs text-gray-400">Common error status codes:</p>
                              <ul className="list-disc list-inside space-y-1 text-xs text-gray-300">
                                <li><span className="text-red-400">400</span> - Bad Request (malformed request or invalid parameters)</li>
                                <li><span className="text-red-400">401</span> - Unauthorized (missing or invalid API key)</li>
                                <li><span className="text-red-400">403</span> - Forbidden (valid API key but insufficient permissions)</li>
                                <li><span className="text-red-400">404</span> - Not Found (requested resource doesn't exist)</li>
                                <li><span className="text-red-400">429</span> - Too Many Requests (rate limit exceeded)</li>
                                <li><span className="text-red-400">500</span> - Internal Server Error (something went wrong on our end)</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Link href="/docs/api" className="text-purple-400 hover:text-purple-300 text-sm flex items-center">
                        View full documentation
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </Link>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
                
                {/* Create New Key Dialog */}
                <AnimatedCard className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <Plus className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium">Create New API Key</h3>
                      <p className="text-sm text-gray-400 my-2">
                        Choose the type of API key you want to create based on your usage needs.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                            <button 
                          className="p-4 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg text-left transition-colors"
                          onClick={async () => {
                            try {
                              toast.loading("Creating test API key...");
                              
                              // Call the API to create a new key
                              const response = await fetch('/api/user/api-keys', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                  name: 'Test API Key',
                                  keyType: 'test'
                                })
                              });
                              
                              if (!response.ok) {
                                const errorData = await response.json();
                                throw new Error(errorData.error || 'Failed to create API key');
                              }
                              
                              const data = await response.json();
                              
                              // Show success message
                              toast.dismiss();
                              toast.success("Test API key created successfully!");
                              
                              // Show a dialog with the new API key
                              const confirmed = window.confirm(`Your new test API key has been created. Copy it now as it won't be shown again:\n\n${data.apiKey.key}\n\nClick OK after you've copied it.`);
                              
                              // Refresh the API keys list
                              fetchApiKeys();
                              
                            } catch (error: any) {
                              toast.dismiss();
                              toast.error(error.message || 'Failed to create API key');
                            }
                          }}
                        >
                          <h4 className="font-medium mb-1">Test Key</h4>
                          <p className="text-xs text-gray-400">For testing your integration</p>
                          <div className="mt-2 text-xs">
                            <span className="inline-block px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full">1,000 requests/month</span>
                          </div>
                        </button>
                        
                            <button 
                          className="p-4 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg text-left transition-colors"
                          onClick={async () => {
                            try {
                              toast.loading("Creating development API key...");
                              
                              // Call the API to create a new key
                              const response = await fetch('/api/user/api-keys', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                  name: 'Development API Key',
                                  keyType: 'development'
                                })
                              });
                              
                              if (!response.ok) {
                                const errorData = await response.json();
                                throw new Error(errorData.error || 'Failed to create API key');
                              }
                              
                              const data = await response.json();
                              
                              // Show success message
                              toast.dismiss();
                              toast.success("Development API key created successfully!");
                              
                              // Show a dialog with the new API key
                              const confirmed = window.confirm(`Your new development API key has been created. Copy it now as it won't be shown again:\n\n${data.apiKey.key}\n\nClick OK after you've copied it.`);
                              
                              // Refresh the API keys list
                              fetchApiKeys();
                              
                            } catch (error: any) {
                              toast.dismiss();
                              toast.error(error.message || 'Failed to create API key');
                            }
                          }}
                        >
                          <h4 className="font-medium mb-1">Development Key</h4>
                          <p className="text-xs text-gray-400">For development environments</p>
                          <div className="mt-2 text-xs">
                            <span className="inline-block px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full">5,000 requests/month</span>
                          </div>
                        </button>
                        
                        <button
                          className="p-4 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg text-left transition-colors"
                          onClick={async () => {
                            try {
                              toast.loading("Creating production API key...");
                              
                              // Call the API to create a new key
                              const response = await fetch('/api/user/api-keys', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                  name: 'Production API Key',
                                  keyType: 'production'
                                })
                              });
                              
                              if (!response.ok) {
                                const errorData = await response.json();
                                throw new Error(errorData.error || 'Failed to create API key');
                              }
                              
                              const data = await response.json();
                              
                              // Show success message
                              toast.dismiss();
                              toast.success("Production API key created successfully!");
                              
                              // Show a dialog with the new API key
                              const confirmed = window.confirm(`Your new production API key has been created. Copy it now as it won't be shown again:\n\n${data.apiKey.key}\n\nClick OK after you've copied it.`);
                              
                              // Refresh the API keys list
                              fetchApiKeys();
                              
                            } catch (error: any) {
                              toast.dismiss();
                              toast.error(error.message || 'Failed to create API key');
                            }
                          }}
                        >
                          <h4 className="font-medium mb-1">Production Key</h4>
                          <p className="text-xs text-gray-400">For production use</p>
                          <div className="mt-2 text-xs">
                            <span className="inline-block px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">100,000 requests/month</span>
                          </div>
                        </button>
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
                      <AnimatedButton 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        onClick={() => setIsDeleteAccountModalOpen(true)}
                      >
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
      
      {/* Account Deletion Modal */}
      {session && (
        <AccountDeletionModal
          isOpen={isDeleteAccountModalOpen}
          onClose={() => setIsDeleteAccountModalOpen(false)}
          onConfirmDelete={handleDeleteAccount}
          userData={{
            email: getUserEmail(userData, session),
            username: userData?.username
          }}
        />
      )}
      
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