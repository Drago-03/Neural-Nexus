"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export function AnimatedButton({
  children,
  className,
  variant = 'default',
  size = 'md',
  disabled = false,
  isLoading = false,
  icon,
  onClick,
  type = 'button',
  ...props
}: AnimatedButtonProps) {
  // Base styles
  const baseStyle = "relative flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background";
  
  // Size styles
  const sizeStyles = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-6 py-3",
  };
  
  // Variant styles
  const variantStyles = {
    default: "bg-white/10 hover:bg-white/20 text-white focus:ring-white/30",
    primary: "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white focus:ring-pink-500/50",
    secondary: "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white focus:ring-blue-500/50",
    outline: "bg-transparent border border-white/20 hover:border-white/40 text-white focus:ring-white/30",
    ghost: "bg-transparent hover:bg-white/10 text-white focus:ring-white/20",
  };
  
  // Loading and disabled states
  const stateStyle = (disabled || isLoading) ? "opacity-70 cursor-not-allowed" : "cursor-pointer";

  return (
    <motion.button
      whileHover={!disabled && !isLoading ? { scale: 1.03 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.97 } : {}}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        baseStyle,
        sizeStyles[size],
        variantStyles[variant],
        stateStyle,
        className
      )}
      disabled={disabled || isLoading}
      onClick={onClick}
      type={type}
      {...props}
    >
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
      )}
      
      <span className={`flex items-center gap-2 ${isLoading ? 'opacity-0' : ''}`}>
        {icon && <span className="inline-flex">{icon}</span>}
        {children}
      </span>
      
      {/* Gradient border effect for certain variants */}
      {(variant === 'outline' || variant === 'ghost') && !disabled && (
        <motion.span 
          className="absolute inset-0 -z-10 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 rounded-lg opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
      
      {/* Glow effect */}
      {(variant === 'primary' || variant === 'secondary') && !disabled && (
        <motion.span 
          className="absolute inset-0 -z-10 bg-gradient-to-r from-pink-500 to-blue-500 rounded-lg blur-xl opacity-0"
          whileHover={{ opacity: 0.5 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.button>
  );
} 