"use client";

import { useState, useEffect, useCallback } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface UseAIAgentProps {
  initialContext?: string;
  initialMessage?: string;
  systemContext?: string;
}

interface APIResponse {
  response: string;
  source?: string;
  confidence?: number;
  relatedLinks?: Array<{
    title: string;
    url: string;
  }>;
}

interface UseAIAgentReturn {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (content: string) => Promise<APIResponse | null>;
  error: string | null;
  resetConversation: () => void;
}

export function useAIAgent({ initialContext, initialMessage, systemContext }: UseAIAgentProps = {}): UseAIAgentReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Generate a unique ID for messages
  const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Initialize chat with welcome message
  useEffect(() => {
    const initialMessages: Message[] = [];
    
    // Add system context if provided
    if (initialContext || systemContext) {
      initialMessages.push({
        id: generateId(),
        role: 'system',
        content: initialContext || systemContext || "",
        timestamp: new Date()
      });
    }
    
    // Add welcome message
    initialMessages.push({
      id: generateId(),
      role: 'assistant',
      content: initialMessage || "Hey there! I'm Neural Nexus AI. How can I help you today?",
      timestamp: new Date()
    });
    
    setMessages(initialMessages);
  }, [initialContext, initialMessage, systemContext]);
  
  // Reset conversation to initial state
  const resetConversation = useCallback(() => {
    const initialMessages: Message[] = [];
    
    // Add system context if provided
    if (initialContext || systemContext) {
      initialMessages.push({
        id: generateId(),
        role: 'system',
        content: initialContext || systemContext || "",
        timestamp: new Date()
      });
    }
    
    // Add welcome message
    initialMessages.push({
      id: generateId(),
      role: 'assistant',
      content: initialMessage || "Hey there! I'm Neural Nexus AI. How can I help you today?",
      timestamp: new Date()
    });
    
    setMessages(initialMessages);
    setError(null);
  }, [initialContext, initialMessage, systemContext]);
  
  // Send message to AI Agent API
  const sendMessage = useCallback(async (content: string): Promise<APIResponse | null> => {
    if (!content.trim()) return null;
    
    // Add user message to state
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    
    try {
      // Filter out system messages for the API request
      const messageHistory = messages
        .filter(msg => msg.role !== 'system')
        .map(({ role, content }) => ({ role, content }));
      
      // Add the new user message
      messageHistory.push({ role: 'user', content });
      
      // Call the API
      const response = await fetch('/api/ai-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          messages: messageHistory
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      const responseData = await response.json();
      
      // Add AI response to state
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: responseData.response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Return the full response data for additional processing
      return responseData;
    } catch (err) {
      console.error('Error sending message to AI Agent:', err);
      setError('Failed to get a response. Please try again.');
      
      // Add error message
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [messages]);
  
  return {
    messages,
    isLoading,
    sendMessage,
    error,
    resetConversation
  };
} 