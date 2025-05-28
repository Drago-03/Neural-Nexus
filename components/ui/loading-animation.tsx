"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingAnimationProps {
  variant?: 'dots' | 'spinner' | 'pulse' | 'gradient' | 'skeleton';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

export function LoadingAnimation({
  variant = 'dots',
  size = 'md',
  color = 'primary',
  text,
  className,
  fullScreen = false,
}: LoadingAnimationProps) {
  // Size mapping
  const sizeMap = {
    xs: 'h-4 w-4',
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  // Color mapping
  const colorMap = {
    default: 'text-white',
    primary: 'text-purple-500',
    secondary: 'text-blue-500',
    success: 'text-green-500',
    warning: 'text-yellow-500',
    error: 'text-red-500',
  };

  // Container classes
  const containerClasses = cn(
    'flex flex-col items-center justify-center',
    fullScreen ? 'fixed inset-0 z-50 bg-black/80 backdrop-blur-sm' : '',
    className
  );

  // Render different loading animations based on variant
  const renderLoadingAnimation = () => {
    switch (variant) {
      case 'spinner':
        return (
          <motion.div
            className={cn('animate-spin', sizeMap[size], colorMap[color])}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </motion.div>
        );

      case 'pulse':
        return (
          <motion.div
            className={cn('rounded-full', sizeMap[size], colorMap[color])}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        );

      case 'gradient':
        return (
          <motion.div
            className={cn('rounded-full bg-gradient-to-r from-pink-500 to-purple-600', sizeMap[size])}
            animate={{ 
              rotate: 360,
              background: [
                'linear-gradient(to right, #ec4899, #8b5cf6)',
                'linear-gradient(to right, #8b5cf6, #3b82f6)',
                'linear-gradient(to right, #3b82f6, #ec4899)',
                'linear-gradient(to right, #ec4899, #8b5cf6)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        );

      case 'skeleton':
        return (
          <div className="space-y-2 w-full max-w-md">
            <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-700 rounded animate-pulse w-5/6"></div>
            <div className="h-4 bg-gray-700 rounded animate-pulse w-4/6"></div>
          </div>
        );

      case 'dots':
      default:
        return (
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={cn('rounded-full', colorMap[color], 
                  size === 'xs' ? 'h-2 w-2' : 
                  size === 'sm' ? 'h-3 w-3' : 
                  size === 'md' ? 'h-4 w-4' : 
                  size === 'lg' ? 'h-5 w-5' : 
                  'h-6 w-6'
                )}
                animate={{ scale: [1, 1.5, 1] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        );
    }
  };

  return (
    <div className={containerClasses}>
      {renderLoadingAnimation()}
      {text && (
        <motion.p
          className={`mt-4 text-${size} ${colorMap[color]}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
} 