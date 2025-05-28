import React, { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth } from '@/providers/AdminAuthProvider';
import {
  Users,
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const { isAdmin, isLoading, logout } = useAdminAuth();
  
  // Handle logout
  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };
  
  // Redirect if not admin and not loading
  if (!isLoading && !isAdmin) {
    router.push('/admin/login');
    return null;
  }
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 border-4 border-t-transparent border-purple-500 rounded-full animate-spin"></div>
          <p className="text-lg">Verifying admin access...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 border-r border-gray-800 h-screen sticky top-0">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-purple-400" />
              <h1 className="text-xl font-bold">Admin Portal</h1>
            </div>
          </div>
          
          <nav className="mt-6">
            <ul className="space-y-1">
              <li>
                <Link
                  href="/admin/dashboard"
                  className="flex items-center px-6 py-3 hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
                >
                  <LayoutDashboard className="h-5 w-5 mr-3" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/users"
                  className="flex items-center px-6 py-3 hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
                >
                  <Users className="h-5 w-5 mr-3" />
                  Users
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/content"
                  className="flex items-center px-6 py-3 hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
                >
                  <FileText className="h-5 w-5 mr-3" />
                  Content
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/settings"
                  className="flex items-center px-6 py-3 hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
                >
                  <Settings className="h-5 w-5 mr-3" />
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
          
          <div className="absolute bottom-0 w-full p-6 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Breadcrumb header */}
          <div className="py-4 px-6 bg-gray-900 border-b border-gray-800">
            <div className="flex items-center text-sm text-gray-400">
              <Link href="/admin/dashboard" className="hover:text-white transition-colors">
                Admin
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-white">
                {/* Extract current page name from URL */}
                {typeof window !== 'undefined' 
                  ? window.location.pathname.split('/').pop()?.replace(/-/g, ' ') 
                  : 'Loading...'}
              </span>
            </div>
          </div>
          
          {/* Page content */}
          <main>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 