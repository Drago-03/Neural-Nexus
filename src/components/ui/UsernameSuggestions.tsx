import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Star, Zap } from 'lucide-react';

interface UsernameSuggestionsProps {
  suggestions: string[];
  onSelectSuggestion: (username: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export function UsernameSuggestions({
  suggestions,
  onSelectSuggestion,
  onRefresh,
  isLoading
}: UsernameSuggestionsProps) {
  return (
    <div className="mt-1 mb-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-gray-400 flex items-center">
          <Star className="h-3 w-3 mr-1 text-yellow-400" />
          <span>suggested usernames:</span>
        </p>
        <button 
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="text-xs bg-gradient-to-r from-purple-500/20 to-indigo-500/20 px-2 py-1 rounded-full text-purple-300 hover:text-purple-200 flex items-center transition-all hover:from-purple-500/30 hover:to-indigo-500/30 disabled:opacity-50"
        >
          {isLoading ? (
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
          ) : (
            <Zap className="h-3 w-3 mr-1" />
          )}
          <span>more options</span>
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => (
            <motion.button
              key={suggestion}
              type="button"
              onClick={() => onSelectSuggestion(suggestion)}
              className={`px-3 py-1.5 bg-gradient-to-r ${
                index < 3 
                  ? 'from-purple-900/40 to-indigo-900/40 hover:from-purple-800/40 hover:to-indigo-800/40' 
                  : 'from-teal-900/40 to-blue-900/40 hover:from-teal-800/40 hover:to-blue-800/40'
              } border border-purple-500/20 rounded-full text-sm transition-all hover:scale-105 hover:border-purple-500/40 shadow-sm`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {suggestion}
              {index === 0 && (
                <span className="ml-1 inline-flex items-center">
                  <Star className="h-3 w-3 text-yellow-400" />
                </span>
              )}
            </motion.button>
          ))
        ) : isLoading ? (
          <div className="w-full py-2 text-center">
            <motion.div 
              className="text-sm text-gray-400 italic"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              generating suggestions...
            </motion.div>
          </div>
        ) : (
          <div className="w-full py-2 text-center">
            <p className="text-sm text-gray-500 italic">no suggestions available, try again</p>
          </div>
        )}
      </div>
    </div>
  );
} 