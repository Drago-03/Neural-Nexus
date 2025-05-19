"use client";

import { motion } from 'framer-motion';
import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: 'lift' | 'glow' | 'border' | 'none';
}

export function AnimatedCard({
  children,
  className,
  onClick,
  hoverEffect = 'none',
}: AnimatedCardProps) {
  // Define different hover animations based on the selected effect
  const getHoverAnimations = () => {
    switch (hoverEffect) {
      case 'lift':
        return {
          whileHover: { y: -5, transition: { duration: 0.2 } },
          whileTap: { y: 0, transition: { duration: 0.2 } },
        };
      case 'glow':
        return {
          whileHover: { 
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)',
            transition: { duration: 0.2 }
          },
        };
      case 'border':
        return {
          whileHover: { 
            border: '1px solid rgba(59, 130, 246, 0.8)',
            transition: { duration: 0.1 }
          },
        };
      default:
        return {};
    }
  };

  const hoverAnimations = getHoverAnimations();

  return (
    <motion.div
      className={cn(
        'bg-gray-800 border border-gray-700 rounded-lg shadow-md',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...hoverAnimations}
    >
      {children}
    </motion.div>
  );
} 