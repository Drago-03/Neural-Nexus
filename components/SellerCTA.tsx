"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { DollarSign, UploadCloud, Info } from 'lucide-react';
import { AnimatedButton } from './ui/animated-button';

interface SellerCTAProps {
  variant?: 'full' | 'compact';
  className?: string;
}

export default function SellerCTA({ variant = 'compact', className = '' }: SellerCTAProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${className} ${
        variant === 'full' 
          ? 'bg-gradient-to-r from-purple-900/80 to-indigo-900/80 p-8 rounded-xl' 
          : 'bg-gradient-to-r from-purple-900/30 to-indigo-900/30 p-6 rounded-lg'
      }`}
    >
      {variant === 'full' ? (
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold mb-2 flex items-center">
              <DollarSign className="h-6 w-6 text-purple-400 mr-2" />
              Make Money with Your AI Models
            </h3>
            <p className="text-gray-200">
              Join thousands of creators who are earning by sharing their expertise. 
              Our marketplace makes it easy to sell your models to users worldwide.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/dashboard/models/create">
              <AnimatedButton variant="primary">
                <span className="flex items-center">
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Upload Now
                </span>
              </AnimatedButton>
            </Link>
            <Link href="/sell-your-model">
              <AnimatedButton variant="outline">
                <span className="flex items-center">
                  <Info className="mr-2 h-4 w-4" />
                  Learn More
                </span>
              </AnimatedButton>
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-medium text-white mb-4 sm:mb-0">
            <span className="text-purple-400 font-bold">Got AI models?</span> Share them and earn money!
          </p>
          <div className="flex gap-3">
            <Link href="/dashboard/models/create">
              <AnimatedButton variant="primary" className="text-sm py-1.5">
                <span className="flex items-center">
                  <UploadCloud className="mr-1.5 h-3.5 w-3.5" />
                  Sell Model
                </span>
              </AnimatedButton>
            </Link>
          </div>
        </div>
      )}
    </motion.div>
  );
} 