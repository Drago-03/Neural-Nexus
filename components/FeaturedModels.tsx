"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ModelCard } from './ModelCard';
import { AnimatedCard } from './ui/animated-card';
import { AnimatedButton } from './ui/animated-button';
import { ModelService, AIModel } from '@/lib/models/model';
import Link from 'next/link';

export function FeaturedModels() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewingModel, setViewingModel] = useState<string | null>(null);
  const [models, setModels] = useState<AIModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Categories for filtering
  const categories = [
    { id: "all", name: "All Models" },
    { id: "image", name: "Image" },
    { id: "text", name: "Text" },
    { id: "code", name: "Code" },
    { id: "audio", name: "Audio" },
    { id: "video", name: "Video" },
  ];
  
  // Fetch featured models from the database
  useEffect(() => {
    const fetchModels = async () => {
      setIsLoading(true);
      try {
        // Fetch featured models (limit to 6)
        const fetchedModels = await ModelService.getFeaturedModels(6);
        setModels(fetchedModels || []);
      } catch (error) {
        console.error('Error fetching featured models:', error);
        setModels([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchModels();
  }, []);

  // Filter models based on category and search query
  const filteredModels = models.filter(model => {
    // Filter by category
    if (activeCategory !== "all") {
      const modelTags = model.tags.map(tag => tag.toLowerCase());
      if (!modelTags.includes(activeCategory.toLowerCase())) {
        return false;
      }
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        model.name.toLowerCase().includes(query) ||
        model.description.toLowerCase().includes(query) ||
        model.creator.name.toLowerCase().includes(query) ||
        model.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  const handleViewModel = (id: string) => {
    setViewingModel(id);
    // Navigate to model detail page
    window.location.href = `/models/${id}`;
  };

  const handlePurchaseModel = (id: string) => {
    // Navigate to checkout page
    window.location.href = `/checkout?model=${id}`;
  };
  
  // Render placeholders during loading
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
    <section className="py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
              Featured Models
            </h2>
            <p className="text-gray-400 mt-2">
              Explore the latest and most popular AI models in our marketplace
            </p>
          </div>
          
          {/* Search input */}
          <div className="w-full md:w-auto">
            <input
              type="text"
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-pink-500 outline-none"
            />
          </div>
        </div>
        
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                activeCategory === category.id
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                  : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Model grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderPlaceholderCards(6)}
          </div>
        ) : filteredModels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModels.map((model) => (
              <motion.div
                key={model._id?.toString()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
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
          <AnimatedCard className="p-8 text-center">
            <h3 className="text-xl font-bold mb-2">No models found</h3>
            <p className="text-gray-400 mb-4">
              {searchQuery ? 
                "No models match your search query. Try different keywords." : 
                "There are no featured models yet."}
            </p>
            <div className="flex justify-center gap-4">
              {searchQuery && (
                <AnimatedButton
                  variant="outline"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </AnimatedButton>
              )}
              <Link href="/marketplace">
                <AnimatedButton variant="primary">
                  Browse All Models
                </AnimatedButton>
              </Link>
            </div>
          </AnimatedCard>
        )}
        
        {/* View all button */}
        {filteredModels.length > 0 && (
          <div className="mt-10 text-center">
            <Link href="/marketplace">
              <AnimatedButton
                variant="secondary"
                size="lg"
                className="px-8"
              >
                View All Models
              </AnimatedButton>
            </Link>
          </div>
        )}
      </motion.div>
    </section>
  );
} 