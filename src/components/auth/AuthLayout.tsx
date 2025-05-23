"use client";


import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import React, { ReactNode, useState } from 'react';
import BrainAnimation from '@/src/components/animations/BrainAnimation'; // Assuming this is an animated component

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  showBrainAnimation?: boolean;
  mode: 'signin' | 'signup';
}

// Animation variants for the main container
const containerVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.1, // Stagger children inside the main container
    },
  },
};

// Animation variants for child elements (left and right panels)
const panelVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

// Animation variants for header and back button
const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// Define itemVariants for general staggered children within specific sections
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

// Animation variants for the feature cards
const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
  hover: {
    scale: 1.05,
    boxShadow: "0 10px 20px rgba(0,0,0,0.4)",
    borderColor: "rgba(129, 140, 248, 0.5)", // Tailwind blue-400 equivalent
    transition: { type: "spring", stiffness: 300, damping: 15 },
  },
};


export default function AuthLayout({
  children,
  title,
  subtitle,
  showBrainAnimation = false,
  mode
}: AuthLayoutProps) {
  const [hoveredPanel, setHoveredPanel] = useState<'left' | 'right' | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col relative overflow-hidden">
      {/* Background radial gradient for depth */}
      <div className="absolute inset-0 z-0 radial-gradient-auth"></div>
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 z-0 bg-[url('/grid.svg')] bg-center opacity-5"></div>
      {/* Decorative blobs - animated */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-blob-pulse"
        initial={{ scale: 0.8, rotate: 0 }}
        animate={{ scale: 1.2, rotate: 360 }}
        transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
      ></motion.div>
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-blob-pulse-reverse"
        initial={{ scale: 1.2, rotate: 0 }}
        animate={{ scale: 0.8, rotate: -360 }}
        transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
      ></motion.div>


      {/* Header */}
      <motion.header
        initial="hidden"
        animate="visible"
        variants={headerVariants}
        className="container mx-auto pt-6 px-4 relative z-10"
      >
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center text-gray-400 hover:text-white transition-colors group"
          >
            <motion.span
              className="mr-2"
              initial={{ x: 0 }}
              whileHover={{ x: -3 }} // Arrow slight movement on hover
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.span>
            <span>Back to Home</span>
          </Link>
        </div>
      </motion.header>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants} // Apply container variants to the main flex wrapper
        className="flex-1 flex flex-col md:flex-row items-stretch relative z-10 p-4 md:p-8"
      >
        {/* Left side - Content */}
        <motion.div
  variants={panelVariants}
  className="w-full md:w-1/2 flex items-center justify-center py-8 md:py-12 px-4"
  onMouseEnter={() => setHoveredPanel('left')}
  onMouseLeave={() => setHoveredPanel(null)}
  animate={{
    scale: hoveredPanel === 'left' ? 1.05 : hoveredPanel === 'right' ? 0.95 : 1,
    transition: { type: "spring", stiffness: 300, damping: 20 }
  }}
>
          <div className="max-w-md w-full">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-pink-500">
                {title}
              </h1>
              <p className="text-gray-300">{subtitle}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.3 }}
            >
              {children}
            </motion.div>
          </div>
        </motion.div>

       <motion.div
  variants={panelVariants}
  className="hidden md:flex w-1/2 bg-gradient-to-br from-purple-900/20 to-blue-900/20 items-center justify-center relative overflow-hidden p-8 md:p-12
             rounded-b-3xl md:rounded-l-none md:rounded-r-3xl"
  onMouseEnter={() => setHoveredPanel('right')}
  onMouseLeave={() => setHoveredPanel(null)}
  animate={{
    scale: hoveredPanel === 'right' ? 1.05 : hoveredPanel === 'left' ? 0.95 : 1,
    transition: { type: "spring", stiffness: 300, damping: 20 }
  }}
>

          
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10"></div>

          {showBrainAnimation ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative z-10 w-full max-w-lg"
            >
              <BrainAnimation />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, staggerChildren: 0.15 }} // Stagger children (feature cards)
              className="relative z-10 w-full max-w-lg p-4"
            >
              {mode === 'signup' ? (
                <>
                  <motion.div variants={itemVariants} className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-4">Start Building Today</h2>
                    <p className="text-gray-300">
                      Join our community of developers and create amazing applications
                    </p>
                  </motion.div>

                  <div className="space-y-4">
                    <motion.div
                      variants={cardVariants}
                      whileHover="hover"
                      className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-purple-500/10 cursor-pointer transition-all duration-300"
                    >
                      <h3 className="font-semibold text-purple-300 mb-2 text-lg">Free Developer Account</h3>
                      <p className="text-sm text-gray-400">Get started with our free tier and build amazing things, no credit card required.</p>
                    </motion.div>

                    <motion.div
                      variants={cardVariants}
                      whileHover="hover"
                      className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-blue-500/10 cursor-pointer transition-all duration-300"
                    >
                      <h3 className="font-semibold text-blue-300 mb-2 text-lg">Real-time Collaboration</h3>
                      <p className="text-sm text-gray-400">Work together with other developers seamlessly in real-time, sharing ideas and code.</p>
                    </motion.div>

                    <motion.div
                      variants={cardVariants}
                      whileHover="hover"
                      className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-pink-500/10 cursor-pointer transition-all duration-300"
                    >
                      <h3 className="font-semibold text-pink-300 mb-2 text-lg">24/7 Premium Support</h3>
                      <p className="text-sm text-gray-400">Get help whenever you need it from our dedicated support team, always ready to assist.</p>
                    </motion.div>
                  </div>
                </>
              ) : (
                <>
                  <motion.div variants={itemVariants} className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
                    <p className="text-gray-300">
                      Access your workspace and continue building amazing things
                    </p>
                  </motion.div>

                  <div className="space-y-4">
                    <motion.div
                      variants={cardVariants}
                      whileHover="hover"
                      className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-purple-500/10 cursor-pointer transition-all duration-300"
                    >
                      <h3 className="font-semibold text-purple-300 mb-2 text-lg">Your Recent Projects</h3>
                      <p className="text-sm text-gray-400">Pick up right where you left off and quickly access your latest work.</p>
                    </motion.div>

                    <motion.div
                      variants={cardVariants}
                      whileHover="hover"
                      className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-blue-500/10 cursor-pointer transition-all duration-300"
                    >
                      <h3 className="font-semibold text-blue-300 mb-2 text-lg">Latest Platform Updates</h3>
                      <p className="text-sm text-gray-400">See what's new in your projects and teams with our frequent feature releases.</p>
                    </motion.div>

                    <motion.div
                      variants={cardVariants}
                      whileHover="hover"
                      className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-pink-500/10 cursor-pointer transition-all duration-300"
                    >
                      <h3 className="font-semibold text-pink-300 mb-2 text-lg">Quick Access & Shortcuts</h3>
                      <p className="text-sm text-gray-400">Jump right back into your favorite tools and sections with personalized shortcuts.</p>
                    </motion.div>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </main>
  );
}