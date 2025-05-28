"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingAnimation } from './loading-animation';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  variant?: 'fade' | 'slide' | 'scale' | 'bounce';
  color?: 'default' | 'primary' | 'secondary';
  loadingType?: 'dots' | 'spinner' | 'pulse' | 'gradient';
  children?: React.ReactNode;
  className?: string;
}

export function LoadingOverlay({
  isLoading,
  message = 'Loading...',
  variant = 'fade',
  color = 'primary',
  loadingType = 'dots',
  children,
  className,
}: LoadingOverlayProps) {
  // Animation variants
  const overlayVariants = {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slide: {
      hidden: { y: '-100%' },
      visible: { y: 0 },
      exit: { y: '100%' },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.2 },
    },
    bounce: {
      hidden: { y: '-100%' },
      visible: { 
        y: 0,
        transition: { 
          type: 'spring',
          stiffness: 300,
          damping: 25 
        }
      },
      exit: { 
        y: '100%',
        transition: { 
          type: 'spring',
          stiffness: 300,
          damping: 25 
        }
      },
    }
  };

  // Background color based on theme
  const bgColorMap = {
    default: 'bg-black/80',
    primary: 'bg-purple-900/80',
    secondary: 'bg-blue-900/80',
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            className={`fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center ${bgColorMap[color]} ${className}`}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants[variant]}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center">
              <LoadingAnimation 
                variant={loadingType} 
                size="lg" 
                color={color === 'default' ? 'default' : color} 
                text={message}
              />
              
              <motion.div
                className="mt-8 text-sm text-gray-300 max-w-xs mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                <p className="italic">Neural Nexus is preparing something fire for you...</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Content */}
      <div className={isLoading ? 'blur-sm' : ''}>
        {children}
      </div>
    </>
  );
} 