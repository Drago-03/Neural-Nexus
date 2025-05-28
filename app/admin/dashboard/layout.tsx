"use client";

import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth } from '@/providers/AdminAuthProvider';
import { 
  Users, 
  Calendar, 
  Settings, 
  LogOut, 
  Layout, 
  Database, 
  AlertTriangle, 
  Shield, 
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const { isAdmin, isLoading, logout } = useAdminAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Redirect to login if not admin
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push('/admin/login');
    }
  }, [isLoading, isAdmin, router]);
  
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/admin/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-600 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // If not admin, don't render anything (will redirect)
  if (!isAdmin) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-gray-800 rounded-md"
      >
        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
      
      {/* Sidebar */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 w-64 bg-gray-800 border-r border-gray-700 transition-all duration-300 z-30 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-purple-400 mr-3" />
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          </div>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link 
                href="/admin/dashboard" 
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded-md transition-colors"
              >
                <Layout className="w-5 h-5 text-gray-400" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/dashboard/users" 
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded-md transition-colors"
              >
                <Users className="w-5 h-5 text-gray-400" />
                <span>Manage Users</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/dashboard/events" 
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded-md transition-colors"
              >
                <Calendar className="w-5 h-5 text-gray-400" />
                <span>Events</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/dashboard/database" 
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded-md transition-colors"
              >
                <Database className="w-5 h-5 text-gray-400" />
                <span>Database</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/dashboard/reports" 
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded-md transition-colors"
              >
                <AlertTriangle className="w-5 h-5 text-gray-400" />
                <span>Reports</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/dashboard/settings" 
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded-md transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-400" />
                <span>Settings</span>
              </Link>
            </li>
          </ul>
          
          <div className="mt-8 pt-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-700 rounded-md transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
} 