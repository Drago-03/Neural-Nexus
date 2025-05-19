import { useState } from 'react';
import {
  User,
  Settings,
  CreditCard,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  X
} from 'lucide-react';
import { Button } from './Button';
import { ThemeToggle } from './ThemeToggle';

interface ProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function ProfileSidebar({ isOpen, onClose, className = '' }: ProfileSidebarProps) {
  const menuItems = [
    { icon: User, label: 'Profile Settings' },
    { icon: Settings, label: 'Account Settings' },
    { icon: CreditCard, label: 'Billing' },
    { icon: Bell, label: 'Notifications' },
    { icon: Shield, label: 'Security' },
    { icon: HelpCircle, label: 'Help & Support' },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`
        fixed right-0 top-0 bottom-0
        w-[280px] bg-white dark:bg-gray-800
        border-l border-gray-200 dark:border-gray-700
        p-4 shadow-xl z-50
        transform transition-transform duration-300
        ${className}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Profile Section */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">John Doe</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">john@yourdomain.com</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="space-y-1 mb-6">
          {menuItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              size="sm"
              className="w-full justify-between"
            >
              <span className="flex items-center">
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          ))}
        </nav>

        {/* Theme Toggle */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
          <ThemeToggle />
        </div>

        {/* Logout Button */}
        <div className="mt-auto">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Log Out
          </Button>
        </div>
      </div>
    </>
  );
}
