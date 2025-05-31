"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ModelCard } from '@/components/ModelCard';
import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedButton } from '@/components/ui/animated-button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchAndFilter, { FilterOptions } from '@/components/SearchAndFilter';
import {
  Sliders, SlidersHorizontal, Grid3X3, List, TrendingUp, 
  PlusCircle, HelpCircle, ArrowUpDown, Search, Sparkles, ArrowRight, DollarSign, Download, Star, Globe, Zap, Award, BarChart, UploadCloud, Info
} from 'lucide-react';
import Link from 'next/link';
import { ModelService, AIModel, ModelCategory } from '@/lib/models/model';
import { FeaturedModels } from '@/components/FeaturedModels';
import LeaderboardSection from '@/components/LeaderboardSection';
import SellerCTA from '@/components/SellerCTA';

export default function MarketplacePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [models, setModels] = useState<AIModel[]>([]);
  const [filteredModels, setFilteredModels] = useState<AIModel[]>([]);
  const [featuredModels, setFeaturedModels] = useState<AIModel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<FilterOptions>({
    category: '',
    minPrice: null,
    maxPrice: null,
    sortBy: 'popular'
  });
  const [scrollY, setScrollY] = useState(0);
  const [totalModels, setTotalModels] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const modelsPerPage = 12;
  
  const categories = [
    "All", 
    "Computer Vision", 
    "Natural Language Processing", 
    "Audio", 
    "Video", 
    "Generative", 
    "Reinforcement Learning"
  ];
  
  // Refs for intersection observers
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });
  const containerRef = useRef(null);
  const isContainerInView = useInView(containerRef, { once: false, amount: 0.1 });
  
  // Fetch real models from database
  useEffect(() => {
    const fetchModels = async () => {
      setIsLoading(true);
      try {
        // Convert filter options to API parameters
        const category = filters.category && filters.category !== 'All' 
          ? filters.category as ModelCategory 
          : undefined;
        
        const sortBy = filters.sortBy === 'price_asc' || filters.sortBy === 'price_desc'
          ? 'newest' // Default sort if price sorting (handled client-side)
          : filters.sortBy === 'newest' 
            ? 'newest'
            : 'popular';
            
        // Fetch models with filters
        const result = await ModelService.getAllModels(
          currentPage,
          12, // items per page
          category,
          undefined, // framework filter not implemented in UI
          sortBy as any
        );
        
        // Also fetch featured models
        const featured = await ModelService.getFeaturedModels(3);
        
        setModels(result.models || []);
        setFilteredModels(result.models || []);
        setFeaturedModels(featured || []);
        setTotalModels(result.totalCount);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error('Error fetching models:', error);
        // If error fetching, set empty arrays
        setModels([]);
        setFilteredModels([]);
        setFeaturedModels([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchModels();
  }, [filters.category, filters.sortBy, currentPage]);
  
  // Handle scroll for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applySearchFilter(query);
  };
  
  // Handle filter change
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    // Reset to first page when filters change
    setCurrentPage(1);
    // Search is applied client-side
    if (searchQuery) {
      applySearchFilter(searchQuery);
    }
  };
  
  // Apply search filter client-side
  const applySearchFilter = (query: string) => {
    if (!query) {
      setFilteredModels(models);
      return;
    }
    
    const lowercaseQuery = query.toLowerCase();
    const filtered = models.filter(model => 
      model.name.toLowerCase().includes(lowercaseQuery) ||
      model.description.toLowerCase().includes(lowercaseQuery) ||
      model.creator.name.toLowerCase().includes(lowercaseQuery) ||
      model.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
    
    setFilteredModels(filtered);
  };
  
  // Handle model view
  const handleViewModel = (id: string) => {
    console.log("Viewing model:", id);
    // Navigate to model detail page
    window.location.href = `/models/${id}`;
  };
  
  // Handle model purchase
  const handlePurchaseModel = (id: string) => {
    console.log("Purchasing model:", id);
    // In a real app, add to cart or go to checkout
    window.location.href = `/checkout?model=${id}`;
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };
  
  // Add a utility function for number formatting if not already defined
  function formatNumber(num: number): string {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
  
  // Function to render placeholder cards during loading
  const renderPlaceholderCards = (count: number) => {
    return Array(count).fill(0).map((_, index) => (
      <div key={`placeholder-${index}`} className="bg-gray-800/30 rounded-xl h-[350px] animate-pulse">
        <div className="h-48 bg-gray-700/50 rounded-t-xl"></div>
        <div className="p-4">
          <div className="h-6 bg-gray-700/50 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-700/50 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-700/50 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-700/50 rounded w-5/6"></div>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden">
      <Navbar />
      
      {/* Hero Section with Parallax */}
      <section 
        ref={heroRef}
        className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden"
      >
        {/* Background parallax elements */}
        <div 
          className="absolute inset-0 z-0"
          style={{ 
            transform: `translateY(${scrollY * 0.2}px)`,
            backgroundImage: 'url(https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=3000&auto=format&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.3) saturate(1.5)'
          }}
        />
        
        <div 
          className="absolute inset-0 z-10 bg-gradient-to-b from-transparent to-black"
          style={{ 
            transform: `translateY(${scrollY * 0.1}px)` 
          }}
        />
        
        {/* Hero content */}
        <div className="container mx-auto px-4 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500"
            >
              Neural Nexus Marketplace
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={isHeroInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-xl text-gray-300 mb-8"
            >
              Discover, purchase, and deploy cutting-edge AI models from the world's top creators
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <Link 
                  href="/dashboard/models/create"
                  className="w-full sm:w-auto"
                >
                  <AnimatedButton variant="primary" className="w-full">
                    <span className="flex items-center justify-center">
                      <UploadCloud className="w-4 h-4 mr-2" />
                      Sell Your Model
                    </span>
                  </AnimatedButton>
                </Link>
                <Link 
                  href="/sell-your-model" 
                  className="w-full sm:w-auto"
                >
                  <AnimatedButton variant="outline" className="w-full">
                    <span className="flex items-center justify-center">
                      <Info className="w-4 h-4 mr-2" />
                      Learn More
                    </span>
                  </AnimatedButton>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Animated shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl"
              style={{
                width: `${Math.random() * 300 + 100}px`,
                height: `${Math.random() * 300 + 100}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `translateY(${scrollY * 0.08 * (i + 1)}px)`,
              }}
            />
          ))}
        </div>
      </section>
      
      {/* Main content */}
      <div id="models" ref={containerRef} className="container mx-auto px-4 pb-20">
        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center my-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold">
              {totalModels > 0 ? (
                <>Browse <span className="text-purple-400">{totalModels}</span> AI Models</>
              ) : (
                <>AI Models</>
              )}
            </h2>
            <p className="text-gray-400">Discover and deploy the latest AI models</p>
          </div>
          
          <div className="flex items-center gap-2">
            <SearchAndFilter 
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
              categories={Array.from(new Set(models.map(model => model.category)))}
            />
            
            <div className="flex border border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-700' : 'bg-gray-800'}`}
                aria-label="Grid view"
              >
                <Grid3X3 size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-700' : 'bg-gray-800'}`}
                aria-label="List view"
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Model Listings */}
        <section className="my-12">
          {isLoading ? (
            // Loading placeholders
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
              {renderPlaceholderCards(8)}
            </div>
          ) : filteredModels.length > 0 ? (
            // Models grid/list
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
              {filteredModels.map((model, index) => (
                <motion.div
                  key={model._id?.toString()}
                  custom={index}
                  initial="hidden"
                  animate={isContainerInView ? "visible" : "hidden"}
                  variants={cardVariants}
                >
                  <ModelCard
                    id={model._id?.toString() || ''}
                    name={model.name}
                    description={model.description}
                    author={model.creator.name}
                    // Note: In a real app, you would add price data to your model schema
                    price={0}
                    rating={model.averageRating || 0}
                    downloads={model.downloads}
                    tags={model.tags}
                    // Use a placeholder image if the model doesn't have one
                    imageUrl={"/placeholder-model.jpg"}
                    onView={handleViewModel}
                    onPurchase={handlePurchaseModel}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            // No results
            <AnimatedCard 
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl border border-gray-700/50 shadow-xl"
              hoverEffect="lift"
            >
              <h3 className="text-xl font-bold mb-2">No models found</h3>
              <p className="text-gray-400 mb-4">
                {searchQuery ? 
                  "No models match your search query. Try different keywords." : 
                  "There are no models in the marketplace yet. Be the first to upload one!"}
              </p>
              <div className="flex justify-center gap-4">
                {searchQuery && (
                  <AnimatedButton
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setFilteredModels(models);
                    }}
                  >
                    Clear Search
                  </AnimatedButton>
                )}
                <Link href="/sell-your-model">
                  <AnimatedButton variant="primary">
                    <span className="flex items-center">
                      <PlusCircle className="mr-2 h-5 w-5" />
                      Sell Your Model
                    </span>
                  </AnimatedButton>
                </Link>
              </div>
            </AnimatedCard>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === 1 
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Create a window of 5 pages around current page
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg ${
                        currentPage === pageNum 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === totalPages 
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
        
        {/* CTA Section */}
        <SellerCTA variant="full" className="mt-12" />
      </div>
      
      <Footer />
    </div>
  );
} 