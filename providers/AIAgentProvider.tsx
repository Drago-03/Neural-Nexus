"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AIAgent from '@/components/AIAgent';

// Define the context type
interface AIAgentContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  lastQuery: string | null;
  setLastQuery: (query: string | null) => void;
}

// Create context with default values
const AIAgentContext = createContext<AIAgentContextType>({
  isOpen: false,
  setIsOpen: () => {},
  lastQuery: null,
  setLastQuery: () => {}
});

// Hook for components to use the AI Agent context
export const useAIAgent = () => useContext(AIAgentContext);

// Provider component
export function AIAgentProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [lastQuery, setLastQuery] = useState<string | null>(null);
  
  // Check for AI-related URL parameters on page load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const aiQuery = urlParams.get('ai');
      
      // If there's an AI query parameter, open the AI Agent with that query
      if (aiQuery) {
        setLastQuery(decodeURIComponent(aiQuery));
        setIsOpen(true);
        
        // Clean up the URL (remove the ai parameter)
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('ai');
        window.history.replaceState({}, '', newUrl.toString());
      }
    }
  }, []);
  
  // Context value that will be provided
  const contextValue = {
    isOpen,
    setIsOpen,
    lastQuery,
    setLastQuery
  };
  
  return (
    <AIAgentContext.Provider value={contextValue}>
      {children}
      <AIAgent />
    </AIAgentContext.Provider>
  );
} 