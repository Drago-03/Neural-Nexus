"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SpaceBackground from "@/components/SpaceBackground";
import SplashScreen from "@/components/SplashScreen";
import { FeaturedModels } from "@/components/FeaturedModels";
import Navbar from "@/components/Navbar";
import { AnimatedButton } from "@/components/ui/animated-button";
import { AnimatedCard } from "@/components/ui/animated-card";
import Footer from "@/components/Footer";
import NewsletterDialog from "@/components/NewsletterDialog";
import QuoteDisplay from "@/components/QuoteDisplay";
import UploadModal from "@/components/UploadModal";
import { 
  Upload, Download, CreditCard, Wallet, Repeat, DollarSign, Gift, 
  CheckCircle, ArrowRight, Zap, ChevronRight, Code, Search, Shield, Mail
} from 'lucide-react';
import Brand from "@/components/Brand";
import Image from 'next/image';

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [showNewsletter, setShowNewsletter] = useState(false);
  const router = useRouter();
  const featureScrollRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Hide splash screen after it completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      setLoading(false);
    }, 3500);
    
    return () => clearTimeout(timer);
  }, []);

  // Show newsletter popup after 5 seconds
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setShowNewsletter(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Horizontal scroll for features
  const handleScrollFeatures = (direction: 'left' | 'right') => {
    if (featureScrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      featureScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return <SplashScreen />;
  }

  const features = [
    {
      title: "Upload Your Model Securely",
      description: "Advanced encryption and secure storage for your valuable AI models",
      icon: <Upload className="h-8 w-8 text-blue-400" />,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Test & Demo Before Publishing",
      description: "Let users try your model with custom demo environments",
      icon: <Code className="h-8 w-8 text-green-400" />,
      gradient: "from-green-500 to-teal-500",
    },
    {
      title: "Sell With Crypto & UPI",
      description: "Multiple payment options including cryptocurrencies and traditional methods",
      icon: <Wallet className="h-8 w-8 text-purple-400" />,
      gradient: "from-purple-500 to-indigo-500",
    },
    {
      title: "Permanent Ownership Transfer",
      description: "Blockchain-verified transfer of complete ownership rights",
      icon: <Repeat className="h-8 w-8 text-pink-400" />,
      gradient: "from-pink-500 to-rose-500",
    },
    {
      title: "Earn Royalties on Reuse",
      description: "Continue earning when your model is used in commercial applications",
      icon: <DollarSign className="h-8 w-8 text-amber-400" />,
      gradient: "from-amber-500 to-yellow-500",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Splash Screen */}
      {showSplash && <SplashScreen />}

      {/* Newsletter Dialog */}
      <NewsletterDialog isOpen={showNewsletter} onClose={() => setShowNewsletter(false)} />

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
      </AnimatePresence>

      {/* Animated Background */}
      <SpaceBackground />
      
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Animated background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-600/20 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-60 -left-20 w-80 h-80 bg-blue-600/20 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-40 right-20 w-80 h-80 bg-purple-600/20 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Large Animated Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <Brand size="lg" className="justify-center" />
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              The Ultimate Platform for
              <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                AI Model Sharing & Deployment
              </span>
            </motion.h1>

            <motion.p 
              className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Share, discover, and deploy state-of-the-art AI models with ease. 
              Join the community of creators and innovators shaping the future of AI.
            </motion.p>

            <motion.div
              className="flex flex-wrap justify-center gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link 
                href="/signup" 
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/25"
              >
                Get Started Free
              </Link>
              <Link 
                href="/docs" 
                className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
              >
                View Documentation
              </Link>
            </motion.div>
            
            {/* Newsletter button */}
            <motion.div
              className="mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <button 
                onClick={() => setShowNewsletter(true)}
                className="flex items-center mx-auto px-4 py-2 bg-gray-800/70 hover:bg-gray-700/70 rounded-full text-sm font-medium border border-gray-700/50 transition-colors"
              >
                <Mail className="w-4 h-4 mr-2 text-purple-400" />
                Join our newsletter for AI model drops
                <ArrowRight className="w-3 h-3 ml-2" />
              </button>
            </motion.div>

            {/* Featured Quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mb-12"
            >
              <QuoteDisplay variant="subtle" className="max-w-2xl mx-auto" />
            </motion.div>

            {/* Stats Section */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                <div className="text-3xl font-bold text-cyan-400 mb-2">50K+</div>
                <div className="text-gray-300">Active Users</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                <div className="text-3xl font-bold text-blue-400 mb-2">100M+</div>
                <div className="text-gray-300">API Requests</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                <div className="text-3xl font-bold text-purple-400 mb-2">10K+</div>
                <div className="text-gray-300">Models Hosted</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* User Features Carousel */}
      <section className="relative py-16 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              Next-Gen AI Model Platform
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to distribute, monetize, and transfer your AI models securely
            </p>
          </motion.div>
          
          <div className="relative">
            {/* Scroll buttons */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 hidden md:block">
              <button 
                onClick={() => handleScrollFeatures('left')}
                className="bg-white/10 hover:bg-white/20 rounded-full p-3 backdrop-blur-sm"
                aria-label="Scroll left"
              >
                <ChevronRight className="h-5 w-5 rotate-180" />
              </button>
            </div>
            
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 hidden md:block">
              <button 
                onClick={() => handleScrollFeatures('right')}
                className="bg-white/10 hover:bg-white/20 rounded-full p-3 backdrop-blur-sm"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            
            {/* Scrolling features */}
            <div 
              ref={featureScrollRef}
              className="flex overflow-x-auto scrollbar-hide gap-6 pb-4 snap-x snap-mandatory"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="min-w-[280px] md:min-w-[350px] snap-center"
                >
                  <AnimatedCard 
                    className="h-full border border-white/10" 
                    hoverEffect="lift"
                  >
                    <div className="p-6 md:p-8">
                      <div className={`w-14 h-14 mb-6 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                      <p className="text-gray-300 mb-4">{feature.description}</p>
                      <Link href="#" className="inline-flex items-center text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                        Learn more <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </AnimatedCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section with names only */}
      <section className="relative py-24 overflow-hidden">
        {/* Background with blur effect */}
        <div className="absolute inset-0 backdrop-blur-md bg-transparent">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-teal-500/10 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="container px-4 mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-purple-500">Our Partners</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">Collaborating with industry leaders to push the boundaries of AI innovation forward</p>
          </motion.div>

          {/* Major Partners Grid with text only */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {["Google", "Microsoft", "GitHub", "Redis", "MetaMask", "WalletConnect", "Coinbase", "AWS"].map((partner, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="flex justify-center"
              >
                <a href="#" className="block group relative">
                  <div className="w-40 h-24 flex items-center justify-center">
                    <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 hover:from-pink-400 hover:to-indigo-400 transition-all duration-300">
                      {partner}
                    </span>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
          
          {/* Additional Partners in Ticker */}
          <div className="mb-12 max-w-6xl mx-auto overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-6"
            >
              <h3 className="text-lg font-medium text-gray-400">And Many More</h3>
            </motion.div>
            
            <div className="relative w-full">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: "-100%" }}
                transition={{
                  duration: 30,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "linear"
                }}
                className="flex whitespace-nowrap"
              >
                {[
                  "NVIDIA", "IBM", "OpenAI", "Intel", "AMD", "Qualcomm", "Databricks", 
                  "Snowflake", "MongoDB", "Stripe", "Twilio", "Atlassian", "Shopify", "Cloudflare", "Meta"
                ].map((partner, index) => (
                  <span 
                    key={index} 
                    className="inline-block px-8 text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 hover:from-violet-400 hover:to-blue-400 transition-all duration-300"
                  >
                    {partner}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
          
          {/* Floating particles for visual effect */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white dark:bg-gray-700 opacity-30"
                style={{
                  width: Math.random() * 6 + 2,
                  height: Math.random() * 6 + 2,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, Math.random() * -30 - 10],
                  opacity: [0.3, 0]
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                  delay: Math.random() * 5
                }}
              />
            ))}
          </div>
          
          {/* CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mt-12"
          >
            <Link 
              href="/partners" 
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            >
              Become a Partner
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Quote Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <QuoteDisplay variant="gradient" className="max-w-3xl mx-auto" />
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-pink-900/20 backdrop-blur-sm"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-400">
              Ready to Join the AI Revolution?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Upload your first AI model in minutes and start earning. Or find the perfect model for your next project.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <AnimatedButton 
                variant="primary" 
                size="lg"
                onClick={() => setShowUpload(true)}
              >
                <span className="flex items-center">
                  <Upload className="mr-2 h-5 w-5" />
                  Upload a Model
                </span>
              </AnimatedButton>
              <Link href="/marketplace">
              <AnimatedButton 
                variant="outline" 
                size="lg"
              >
                <span className="flex items-center">
                  <Zap className="mr-2 h-5 w-5" />
                  Explore Trending Models
                </span>
              </AnimatedButton>
              </Link>
            </div>
            
            <button 
              onClick={() => setShowNewsletter(true)}
              className="flex items-center mx-auto px-5 py-2 bg-gray-800/70 hover:bg-gray-700/70 rounded-full text-sm font-medium border border-gray-700/50 transition-colors"
            >
              <Mail className="w-4 h-4 mr-2 text-purple-400" />
              Get notified about new models
              <ArrowRight className="w-3 h-3 ml-2" />
            </button>
          </motion.div>
        </div>
        
        {/* Animated particles */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white opacity-20"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
} 