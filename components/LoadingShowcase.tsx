"use client";

import React, { useState } from 'react';
import { LoadingAnimation } from './ui/loading-animation';
import { LoadingOverlay } from './ui/loading-overlay';
import { AnimatedButton } from './ui/animated-button';
import { motion } from 'framer-motion';

export default function LoadingShowcase() {
  const [activeTab, setActiveTab] = useState<'animations' | 'overlays'>('animations');
  const [overlayDemo, setOverlayDemo] = useState<{
    isVisible: boolean;
    variant: 'fade' | 'slide' | 'scale' | 'bounce';
    loadingType: 'dots' | 'spinner' | 'pulse' | 'gradient';
  }>({
    isVisible: false,
    variant: 'fade',
    loadingType: 'dots'
  });

  // Animation variants for the showcase
  const variants = ['dots', 'spinner', 'pulse', 'gradient', 'skeleton'];
  const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
  const colors = ['default', 'primary', 'secondary', 'success', 'warning', 'error'];
  const overlayVariants = ['fade', 'slide', 'scale', 'bounce'];

  // Helper to get variant name for display
  const getVariantName = (variant: string) => {
    return variant.charAt(0).toUpperCase() + variant.slice(1);
  };

  // Show overlay demo
  const showOverlayDemo = (variant: 'fade' | 'slide' | 'scale' | 'bounce', loadingType: 'dots' | 'spinner' | 'pulse' | 'gradient') => {
    setOverlayDemo({
      isVisible: true,
      variant,
      loadingType
    });

    // Auto-hide after 3 seconds
    setTimeout(() => {
      setOverlayDemo(prev => ({ ...prev, isVisible: false }));
    }, 3000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
        Loading Animations Showcase
      </h2>

      {/* Tab navigation */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('animations')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'animations'
              ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
              : 'bg-gray-800 text-gray-300'
          }`}
        >
          Component Animations
        </button>
        <button
          onClick={() => setActiveTab('overlays')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'overlays'
              ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
              : 'bg-gray-800 text-gray-300'
          }`}
        >
          Page Overlays
        </button>
      </div>

      {/* Component Animations Tab */}
      {activeTab === 'animations' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Variants Section */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-medium mb-4">Variants</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {variants.map((variant) => (
                  <div key={variant} className="flex flex-col items-center space-y-3">
                    <div className="h-20 w-20 flex items-center justify-center">
                      <LoadingAnimation variant={variant as any} size="md" />
                    </div>
                    <span className="text-sm text-gray-300">{getVariantName(variant)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sizes Section */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-medium mb-4">Sizes</h3>
              <div className="flex items-end justify-around">
                {sizes.map((size) => (
                  <div key={size} className="flex flex-col items-center space-y-3">
                    <LoadingAnimation variant="dots" size={size as any} />
                    <span className="text-sm text-gray-300">{size.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Colors Section */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-medium mb-4">Colors</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {colors.map((color) => (
                  <div key={color} className="flex flex-col items-center space-y-3">
                    <LoadingAnimation variant="spinner" color={color as any} />
                    <span className="text-sm text-gray-300">{getVariantName(color)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* With Text Section */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-medium mb-4">With Text</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col items-center space-y-3">
                  <LoadingAnimation variant="dots" text="Loading..." />
                </div>
                <div className="flex flex-col items-center space-y-3">
                  <LoadingAnimation variant="spinner" text="Please wait" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Page Overlays Tab */}
      {activeTab === 'overlays' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-medium mb-6">Overlay Animations</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {overlayVariants.map((variant) => (
                <div key={variant} className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-300">{getVariantName(variant)}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {['dots', 'spinner', 'pulse', 'gradient'].map((type) => (
                      <AnimatedButton
                        key={type}
                        variant="outline"
                        size="sm"
                        onClick={() => showOverlayDemo(variant as any, type as any)}
                      >
                        {getVariantName(type)}
                      </AnimatedButton>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-black/30 border border-gray-700 rounded-lg">
              <p className="text-sm text-gray-300">
                Click any button above to preview the overlay animation. The overlay will automatically 
                disappear after 3 seconds.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Overlay Demo */}
      <LoadingOverlay
        isLoading={overlayDemo.isVisible}
        variant={overlayDemo.variant}
        loadingType={overlayDemo.loadingType}
        message="Loading your vibe..."
      />
    </div>
  );
} 