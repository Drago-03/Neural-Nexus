"use client";

import React, { useState } from 'react';
import { Search, Star, Download, ExternalLink, MoreVertical, Filter, ArrowUp, ArrowDown, X } from 'lucide-react';

interface Extension {
  id: string;
  name: string;
  publisher: string;
  description: string;
  icon: string;
  stars: number;
  downloads: number;
  installed: boolean;
  verified: boolean;
  category: string;
}

interface ExtensionMarketplaceProps {
  theme: string;
  onClose: () => void;
}

export default function ExtensionMarketplace({ theme, onClose }: ExtensionMarketplaceProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'relevant'>('popular');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  
  // Mock extension data
  const extensions: Extension[] = [
    {
      id: "1",
      name: "GitHub Copilot",
      publisher: "GitHub",
      description: "Your AI pair programmer - Helps you write code faster with AI-powered autocompletions",
      icon: "https://github.githubassets.com/images/modules/copilot/copilot-logo.png",
      stars: 4.9,
      downloads: 2500000,
      installed: false,
      verified: true,
      category: "AI"
    },
    {
      id: "2",
      name: "Python",
      publisher: "Microsoft",
      description: "IntelliSense (Pylance), Linting, Debugging, code formatting, refactoring, unit tests, and more.",
      icon: "https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/main/icons/python.svg",
      stars: 4.8,
      downloads: 50000000,
      installed: true,
      verified: true,
      category: "Programming Languages"
    },
    {
      id: "3",
      name: "ESLint",
      publisher: "Microsoft",
      description: "Integrates ESLint JavaScript into VS Code.",
      icon: "https://raw.githubusercontent.com/microsoft/vscode-eslint/main/images/eslint-logo.png",
      stars: 4.7,
      downloads: 30000000,
      installed: false,
      verified: true,
      category: "Linters"
    },
    {
      id: "4",
      name: "Prettier - Code formatter",
      publisher: "Prettier",
      description: "Code formatter using prettier",
      icon: "https://raw.githubusercontent.com/prettier/prettier-logo/master/images/prettier-icon-clean-centred.png",
      stars: 4.8,
      downloads: 32000000,
      installed: false,
      verified: true,
      category: "Formatters"
    },
    {
      id: "5",
      name: "GitLens",
      publisher: "GitKraken",
      description: "Supercharge Git within VS Code — Visualize code authorship, seamlessly navigate and explore Git repositories",
      icon: "https://raw.githubusercontent.com/gitkraken/vscode-gitlens/main/images/gitlens-icon.png",
      stars: 4.9,
      downloads: 18000000,
      installed: true,
      verified: true,
      category: "SCM Providers"
    },
    {
      id: "6",
      name: "Neural Nexus AI Extension",
      publisher: "Neural Nexus",
      description: "Extended AI capabilities for Neural Nexus - adds custom model fine-tuning and advanced code analysis",
      icon: "/logo.png",
      stars: 4.7,
      downloads: 750000,
      installed: true,
      verified: true,
      category: "AI"
    }
  ];
  
  // Filter and sort extensions
  const filteredExtensions = extensions
    .filter(ext => {
      const matchesSearch = !searchQuery || 
        ext.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ext.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ext.publisher.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesCategory = !filterCategory || ext.category === filterCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') {
        return b.downloads - a.downloads;
      } else if (sortBy === 'recent') {
        // In a real app, we'd sort by date
        return a.id > b.id ? -1 : 1;
      }
      return 0; // 'relevant' would involve more complex logic in a real app
    });
    
  // Get all unique categories
  const categories = Array.from(new Set(extensions.map(ext => ext.category)));
  
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };
  
  const handleInstall = (extensionId: string) => {
    // In a real app, this would trigger an installation
    console.log(`Installing extension ${extensionId}`);
  };
  
  return (
    <div 
      className={`flex flex-col w-full h-full ${
        theme === 'dark' ? 'bg-[#1e1e1e] text-gray-300' : 'bg-white text-gray-800'
      }`}
    >
      {/* Header */}
      <div className={`p-4 border-b ${theme === 'dark' ? 'border-[#3d3d3d]' : 'border-[#e0e0e0]'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">Extension Marketplace</h2>
          <button 
            onClick={onClose}
            className={`p-1.5 rounded ${theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#f0f0f0]'}`}
            aria-label="Close extension marketplace"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search Extensions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full py-2 pl-10 pr-4 rounded-md ${
              theme === 'dark' 
                ? 'bg-[#3c3c3c] border-[#3d3d3d] text-white placeholder-gray-400' 
                : 'bg-[#f5f5f5] border-[#e0e0e0] text-gray-900 placeholder-gray-500'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
        
        {/* Filter and sort controls */}
        <div className="flex flex-wrap gap-2 items-center">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1 py-1.5 px-3 rounded ${
              theme === 'dark' 
                ? 'bg-[#3c3c3c] hover:bg-[#444]' 
                : 'bg-[#f0f0f0] hover:bg-[#e5e5e5]'
            } text-sm`}
            title="Filter extensions"
          >
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className={`flex items-center gap-1 py-1.5 px-3 rounded ${
                theme === 'dark' 
                  ? 'bg-[#3c3c3c] hover:bg-[#444]' 
                  : 'bg-[#f0f0f0] hover:bg-[#e5e5e5]'
              } text-sm`}
              title="Sort by"
            >
              <span>Sort: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}</span>
              {sortBy === 'popular' ? (
                <ArrowDown className="h-3 w-3 ml-1" />
              ) : (
                <ArrowUp className="h-3 w-3 ml-1" />
              )}
            </button>
            
            {showSortMenu && (
              <div className={`absolute top-full left-0 mt-1 w-40 z-10 rounded-md shadow-lg ${
                theme === 'dark' ? 'bg-[#252526] border-[#3d3d3d]' : 'bg-white border-[#e0e0e0]'
              } border overflow-hidden`}>
                <button
                  onClick={() => {
                    setSortBy('popular');
                    setShowSortMenu(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    sortBy === 'popular' 
                      ? theme === 'dark' ? 'bg-[#0e639c]' : 'bg-[#e8f0fe]'
                      : theme === 'dark' ? 'hover:bg-[#2a2d2e]' : 'hover:bg-[#f8f8f8]'
                  }`}
                >
                  Popular
                </button>
                <button
                  onClick={() => {
                    setSortBy('recent');
                    setShowSortMenu(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    sortBy === 'recent' 
                      ? theme === 'dark' ? 'bg-[#0e639c]' : 'bg-[#e8f0fe]'
                      : theme === 'dark' ? 'hover:bg-[#2a2d2e]' : 'hover:bg-[#f8f8f8]'
                  }`}
                >
                  Recently Updated
                </button>
                <button
                  onClick={() => {
                    setSortBy('relevant');
                    setShowSortMenu(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    sortBy === 'relevant' 
                      ? theme === 'dark' ? 'bg-[#0e639c]' : 'bg-[#e8f0fe]'
                      : theme === 'dark' ? 'hover:bg-[#2a2d2e]' : 'hover:bg-[#f8f8f8]'
                  }`}
                >
                  Relevance
                </button>
              </div>
            )}
          </div>
          
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={`flex items-center gap-1 py-1.5 px-3 rounded ${
                theme === 'dark' 
                  ? 'bg-[#3c3c3c] hover:bg-[#444]' 
                  : 'bg-[#f0f0f0] hover:bg-[#e5e5e5]'
              } text-sm`}
            >
              Clear Search
            </button>
          )}
        </div>
        
        {/* Filters panel */}
        {showFilters && (
          <div className={`mt-3 p-3 rounded ${
            theme === 'dark' ? 'bg-[#252526] border-[#3d3d3d]' : 'bg-[#f5f5f5] border-[#e0e0e0]'
          } border`}>
            <h3 className="text-sm font-medium mb-2">Categories</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterCategory(null)}
                className={`py-1 px-2 text-xs rounded ${
                  !filterCategory 
                    ? theme === 'dark' ? 'bg-[#0e639c] text-white' : 'bg-[#0067c0] text-white'
                    : theme === 'dark' ? 'bg-[#3c3c3c] hover:bg-[#444]' : 'bg-[#e8e8e8] hover:bg-[#ddd]'
                }`}
              >
                All
              </button>
              
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  className={`py-1 px-2 text-xs rounded ${
                    filterCategory === category 
                      ? theme === 'dark' ? 'bg-[#0e639c] text-white' : 'bg-[#0067c0] text-white'
                      : theme === 'dark' ? 'bg-[#3c3c3c] hover:bg-[#444]' : 'bg-[#e8e8e8] hover:bg-[#ddd]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Extension list */}
      <div className="flex-1 overflow-auto p-4">
        {filteredExtensions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No extensions found matching your criteria</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterCategory(null);
              }}
              className={`mt-4 py-2 px-4 rounded ${
                theme === 'dark' 
                  ? 'bg-[#3c3c3c] hover:bg-[#444]' 
                  : 'bg-[#f0f0f0] hover:bg-[#e5e5e5]'
              }`}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredExtensions.map(extension => (
              <div 
                key={extension.id}
                className={`p-4 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-[#252526] border-[#3d3d3d] hover:border-[#525252]' 
                    : 'bg-white border-[#e0e0e0] hover:border-[#bbb]'
                } transition-colors`}
              >
                <div className="flex">
                  {/* Extension icon */}
                  <div className="w-12 h-12 mr-4 flex-shrink-0">
                    <img
                      src={extension.icon}
                      alt={`${extension.name} icon`}
                      className="w-full h-full object-contain rounded"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0xOCA2TDYgMThNNiA2bDEyIDEyIi8+PC9zdmc+';
                      }}
                    />
                  </div>
                  
                  {/* Extension info */}
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{extension.name}</h3>
                        <p className="text-xs opacity-75 flex items-center">
                          {extension.publisher}
                          {extension.verified && (
                            <span className="ml-1 px-1 py-0.5 bg-blue-500/20 text-blue-400 rounded text-[10px]">Verified</span>
                          )}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-sm">{extension.stars}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Download className="h-4 w-4 mr-1 opacity-70" />
                          <span className="text-sm">{formatNumber(extension.downloads)}</span>
                        </div>
                        
                        <button 
                          className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#f5f5f5]'}`}
                          title="More options"
                          aria-label="More options"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-sm my-2 line-clamp-2">{extension.description}</p>
                    
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-xs rounded ${
                          theme === 'dark' ? 'bg-[#3c3c3c]' : 'bg-[#f0f0f0]'
                        }`}>
                          {extension.category}
                        </span>
                      </div>
                      
                      <div>
                        {extension.installed ? (
                          <span className="text-sm text-green-500">Installed</span>
                        ) : (
                          <button
                            onClick={() => handleInstall(extension.id)}
                            className={`py-1 px-3 text-sm rounded ${
                              theme === 'dark' 
                                ? 'bg-[#0e639c] hover:bg-[#1177bb] text-white' 
                                : 'bg-[#0067c0] hover:bg-[#0078d7] text-white'
                            }`}
                          >
                            Install
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 