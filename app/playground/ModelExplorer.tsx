"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, Clock, Zap, ArrowRight, Filter, ChevronDown } from 'lucide-react';
import { AnimatedCard } from '@/components/ui/animated-card';

interface ModelType {
  id: string;
  name: string;
  description: string;
  language: string;
  icon: string;
  category: string;
  popularity: number;
  lastUpdated: string;
  creator: string;
  isFree: boolean;
}

interface ModelExplorerProps {
  onSelectModel: (modelId: string) => void;
}

export default function ModelExplorer({ onSelectModel }: ModelExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  // Sample model data - in a real app this would come from an API
  const models: ModelType[] = [
    {
      id: 'neural-nexus-js',
      name: 'Neural JS',
      description: 'Our flagship JavaScript code generator with advanced code completion and debugging abilities.',
      language: 'JavaScript',
      icon: '⚡️',
      category: 'Code Generation',
      popularity: 93,
      lastUpdated: '2 days ago',
      creator: 'Neural Nexus',
      isFree: true
    },
    {
      id: 'neural-nexus-py',
      name: 'Neural Python',
      description: 'AI-powered Python code generator optimized for data science and ML workflows.',
      language: 'Python',
      icon: '🐍',
      category: 'Code Generation',
      popularity: 91,
      lastUpdated: '1 week ago',
      creator: 'Neural Nexus',
      isFree: true
    },
    {
      id: 'neural-nexus-java',
      name: 'Neural Java',
      description: 'Enterprise-grade Java code generation for robust application development.',
      language: 'Java',
      icon: '☕',
      category: 'Code Generation',
      popularity: 85,
      lastUpdated: '2 weeks ago',
      creator: 'Neural Nexus',
      isFree: false
    },
    {
      id: 'neural-nexus-rust',
      name: 'Neural Rust',
      description: 'Generate memory-safe, high-performance Rust code with our specialized model.',
      language: 'Rust',
      icon: '🦀',
      category: 'Code Generation',
      popularity: 82,
      lastUpdated: '3 weeks ago',
      creator: 'Neural Nexus',
      isFree: false
    },
    {
      id: 'neural-code-explain',
      name: 'Code Explainer',
      description: 'Upload any code snippet and get detailed, human-readable explanations.',
      language: 'Multiple',
      icon: '🔍',
      category: 'Code Analysis',
      popularity: 88,
      lastUpdated: '5 days ago',
      creator: 'Neural Nexus',
      isFree: true
    },
    {
      id: 'neural-code-review',
      name: 'Code Reviewer',
      description: 'Get professional-quality code reviews with security and performance suggestions.',
      language: 'Multiple',
      icon: '🛡️',
      category: 'Code Analysis',
      popularity: 79,
      lastUpdated: '1 month ago',
      creator: 'Neural Nexus',
      isFree: false
    },
    {
      id: 'neural-refactor',
      name: 'Code Refactorer',
      description: 'Automatically refactor code to improve readability, performance, and maintainability.',
      language: 'Multiple',
      icon: '🔄',
      category: 'Code Transformation',
      popularity: 87,
      lastUpdated: '1 week ago',
      creator: 'Neural Nexus',
      isFree: false
    },
    {
      id: 'neural-docgen',
      name: 'DocGen',
      description: 'Automatically generate comprehensive documentation from your codebase.',
      language: 'Multiple',
      icon: '📝',
      category: 'Documentation',
      popularity: 86,
      lastUpdated: '2 weeks ago',
      creator: 'Neural Nexus',
      isFree: true
    }
  ];
  
  // Get unique categories and languages for filters
  const categories = Array.from(new Set(models.map(model => model.category)));
  const languages = Array.from(new Set(models.map(model => model.language)));
  
  // Filter models based on search query and selected filters
  const filteredModels = models.filter(model => {
    const matchesSearch = 
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || model.category === selectedCategory;
    const matchesLanguage = !selectedLanguage || model.language === selectedLanguage;
    
    return matchesSearch && matchesCategory && matchesLanguage;
  });
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedLanguage(null);
    setSearchQuery('');
  };
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Model Explorer</h2>
      
      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search models"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* Category Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
                setIsLanguageDropdownOpen(false);
              }}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg py-2 px-3 text-sm transition-colors"
              aria-label="Filter by category"
            >
              <Filter className="h-4 w-4" />
              <span>{selectedCategory || 'All Categories'}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {isCategoryDropdownOpen && (
              <div className="absolute z-10 mt-1 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors"
                  onClick={() => {
                    setSelectedCategory(null);
                    setIsCategoryDropdownOpen(false);
                  }}
                >
                  All Categories
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors ${
                      selectedCategory === category ? 'bg-blue-900/30 text-blue-300' : ''
                    }`}
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsCategoryDropdownOpen(false);
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Language Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
                setIsCategoryDropdownOpen(false);
              }}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg py-2 px-3 text-sm transition-colors"
              aria-label="Filter by language"
            >
              <Zap className="h-4 w-4" />
              <span>{selectedLanguage || 'All Languages'}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {isLanguageDropdownOpen && (
              <div className="absolute z-10 mt-1 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors"
                  onClick={() => {
                    setSelectedLanguage(null);
                    setIsLanguageDropdownOpen(false);
                  }}
                >
                  All Languages
                </button>
                {languages.map(language => (
                  <button
                    key={language}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors ${
                      selectedLanguage === language ? 'bg-blue-900/30 text-blue-300' : ''
                    }`}
                    onClick={() => {
                      setSelectedLanguage(language);
                      setIsLanguageDropdownOpen(false);
                    }}
                  >
                    {language}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Clear Filters */}
          {(selectedCategory || selectedLanguage || searchQuery) && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-400 hover:text-blue-300 flex items-center"
              aria-label="Clear all filters"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
      
      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {filteredModels.map(model => (
          <AnimatedCard 
            key={model.id}
            className="p-5 flex flex-col h-full overflow-hidden"
            hoverEffect="lift"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center">
                <span className="text-2xl mr-2">{model.icon}</span>
                <div>
                  <h3 className="font-bold">{model.name}</h3>
                  <div className="flex items-center text-xs text-gray-400">
                    <span>{model.language}</span>
                    <span className="mx-1">•</span>
                    <span className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-400 mr-1" />
                      {model.popularity}%
                    </span>
                    <span className="mx-1">•</span>
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {model.lastUpdated}
                    </span>
                  </div>
                </div>
              </div>
              {model.isFree ? (
                <span className="px-2 py-0.5 bg-green-900/30 text-green-400 rounded text-xs">Free</span>
              ) : (
                <span className="px-2 py-0.5 bg-purple-900/30 text-purple-400 rounded text-xs">Pro</span>
              )}
            </div>
            
            <p className="text-sm text-gray-300 mb-4 flex-grow">{model.description}</p>
            
            <div className="mt-auto">
              <button
                onClick={() => onSelectModel(model.id)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center transition-colors"
              >
                Select Model
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          </AnimatedCard>
        ))}
      </div>
      
      {filteredModels.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-400 mb-2">No models found matching your criteria</p>
          <button
            onClick={clearFilters}
            className="text-blue-400 hover:text-blue-300"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
} 