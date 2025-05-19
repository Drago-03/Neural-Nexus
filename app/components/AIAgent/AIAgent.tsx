"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Brain, Sparkles, Copy, Zap, RefreshCw, MessageSquare, User, ChevronDown, ChevronUp, Maximize2, Minimize2, ExternalLink, HelpCircle, ArrowUp, Loader2, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { faq } from './faq-data';
import { useAIAgent } from '@/app/hooks/useAIAgent';

interface AIAgentProps {
  theme?: 'dark' | 'light';
  initialMessage?: string;
  initialContext?: string;
  initialOpen?: boolean;
  systemContext?: string;
}

interface Message {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

interface RelatedLink {
  title: string;
  url: string;
}

const AIAgent: React.FC<AIAgentProps> = ({ 
  theme = 'dark', 
  initialMessage = "👋 Hi there! How can I help you with Neural Nexus today?",
  initialContext,
  initialOpen = false,
  systemContext
}) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showFAQs, setShowFAQs] = useState<boolean>(false);
  const [faqList, setFaqList] = useState<FAQ[]>(faq);
  const [faqQuery, setFaqQuery] = useState<string>('');
  const [filteredFAQ, setFilteredFAQ] = useState<FAQ[]>(faq);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [relatedLinks, setRelatedLinks] = useState<RelatedLink[]>([]);
  
  // Use our custom hook
  const { 
    error, 
    sendMessage, 
    resetConversation 
  } = useAIAgent({
    initialMessage,
    systemContext
  });
  
  useEffect(() => {
    // Initialize with system welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'assistant',
      content: initialMessage || "Hey there! I'm Neural Nexus AI. I can help you with anything related to our platform. What can I assist you with today?",
      timestamp: new Date()
    };
    
    // If context is provided, add it as a system message
    const messages: Message[] = [];
    if (initialContext) {
      messages.push({
        id: 'system',
        role: 'system',
        content: initialContext,
        timestamp: new Date()
      });
    }
    
    messages.push(welcomeMessage);
    setMessages(messages);
  }, [initialMessage, initialContext]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (!isMinimized && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isMinimized]);
  
  // Filter FAQ based on query
  useEffect(() => {
    if (faqQuery.trim() === '') {
      setFilteredFAQ(faqList);
    } else {
      const filtered = faqList.filter(item => 
        item.question.toLowerCase().includes(faqQuery.toLowerCase()) || 
        item.answer.toLowerCase().includes(faqQuery.toLowerCase())
      );
      setFilteredFAQ(filtered);
    }
  }, [faqQuery, faqList]);
  
  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  
  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;
    
    try {
      const response = await sendMessage(inputValue);
      
      // Check if we have related links in the response
      if (response && response.relatedLinks) {
        setRelatedLinks(response.relatedLinks);
      } else {
        setRelatedLinks([]);
      }
      
      setInputValue('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };
  
  const handleFAQClick = (question: string) => {
    setInputValue(question);
    setShowFAQs(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const formatMessage = (content: string) => {
    // Bold text between ** **
    const boldText = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert line breaks to <br>
    const withLineBreaks = boldText.replace(/\n/g, '<br>');
    
    return <div dangerouslySetInnerHTML={{ __html: withLineBreaks }} />;
  };
  
  const toggleChatWindow = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };
  
  const toggleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(!isMinimized);
  };
  
  const formatTimestamp = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  if (!isOpen) {
    return (
      <button
        onClick={toggleChatWindow}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg z-50 flex items-center justify-center ${
          theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'
        } text-white transition-all duration-300 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        aria-label="Open AI Assistant"
      >
        <MessageCircle size={24} />
      </button>
    );
  }
  
  return (
    <div className={`fixed bottom-6 right-6 z-50 w-96 rounded-lg shadow-xl overflow-hidden ${
      theme === 'dark' ? 'bg-[#1e1e1e] text-gray-300' : 'bg-white text-gray-800'
    } flex flex-col border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
    style={{ height: isMinimized ? 'auto' : '500px' }}>
      {/* Header */}
      <div 
        className={`px-4 py-3 border-b flex justify-between items-center cursor-pointer ${
          theme === 'dark' ? 'bg-[#252526] border-[#3d3d3d]' : 'bg-purple-500 text-white border-purple-600'
        }`}
        onClick={toggleMinimize}
      >
        <div className="flex items-center">
          <Bot className={`h-5 w-5 mr-2 ${theme === 'dark' ? 'text-purple-400' : 'text-white'}`} />
          <h3 className="font-medium">Neural Nexus AI Assistant</h3>
        </div>
        <div className="flex items-center space-x-1">
          <button 
            onClick={resetConversation}
            className={`p-1 rounded-sm ${
              theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-purple-600'
            }`}
            aria-label="Reset conversation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
              <path d="M3 3v5h5"></path>
            </svg>
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            className={`p-1 rounded-sm ${
              theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-purple-600'
            }`}
            aria-label="Close AI Assistant"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {!isMinimized && (
        <>
          {/* Messages area */}
          <div 
            className={`flex-1 overflow-y-auto p-4 space-y-4 ${
              theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-gray-50'
            }`}
          >
            {messages.filter(msg => msg.role !== 'system').map((message, index) => (
              <div 
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex items-start max-w-[80%]">
                  {message.role === 'assistant' && (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0 ${
                      theme === 'dark' ? 'bg-purple-900/50' : 'bg-purple-100'
                    }`}>
                      <Bot className={`h-5 w-5 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                    </div>
                  )}
                  
                  <div 
                    className={`rounded-lg p-3 ${
                      message.role === 'user'
                        ? theme === 'dark'
                          ? 'bg-[#0e639c] text-white'
                          : 'bg-[#007acc] text-white' 
                        : theme === 'dark'
                          ? 'bg-[#2d2d2d] text-gray-300'
                          : 'bg-white border border-gray-200 text-gray-800'
                    }`}
                  >
                    {formatMessage(message.content)}
                    
                    <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-200' : theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                      {formatTimestamp(message.timestamp)}
                    </div>
                  </div>
                  
                  {message.role === 'user' && (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ml-2 mt-1 flex-shrink-0 ${
                      theme === 'dark' ? 'bg-blue-900/50' : 'bg-blue-100'
                    }`}>
                      <User className={`h-5 w-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start max-w-[80%]">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 mt-1 ${
                    theme === 'dark' ? 'bg-purple-900/50' : 'bg-purple-100'
                  }`}>
                    <Bot className={`h-5 w-5 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                  </div>
                  <div className={`rounded-lg p-3 ${
                    theme === 'dark' ? 'bg-[#2d2d2d]' : 'bg-white border border-gray-200'
                  }`}>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce mr-1" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce mr-1" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Error message */}
            {error && (
              <div className="flex justify-center">
                <div className="max-w-[90%] p-3 rounded-lg bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                  {error}
                </div>
              </div>
            )}
            
            {/* Related links if any */}
            {relatedLinks.length > 0 && (
              <div className="flex justify-start w-full">
                <div className="max-w-[90%] p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-gray-800 dark:text-gray-200 w-full">
                  <h4 className="font-medium mb-2">Related Resources:</h4>
                  <ul className="space-y-1">
                    {relatedLinks.map((link, index) => (
                      <li key={index} className="flex items-center">
                        <ExternalLink size={14} className="mr-1 text-blue-500" />
                        <a 
                          href={link.url} 
                          className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Quick actions */}
          <div className={`p-2 border-t ${
            theme === 'dark' ? 'border-[#3d3d3d] bg-[#252526]' : 'border-[#e0e0e0] bg-[#f3f3f3]'
          }`}>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowFAQs(!showFAQs)}
                className={`flex items-center px-3 py-1.5 rounded-md text-xs whitespace-nowrap ${
                  theme === 'dark'
                    ? 'bg-[#3c3c3c] hover:bg-[#4c4c4c] text-white'
                    : 'bg-[#e5e5e5] hover:bg-[#d5d5d5] text-black'
                }`}
              >
                <HelpCircle className="h-3.5 w-3.5 mr-1.5" />
                <span>FAQs</span>
              </button>
              <button
                onClick={() => sendMessage("How do I use the playground?")}
                className={`flex items-center px-3 py-1.5 rounded-md text-xs whitespace-nowrap ${
                  theme === 'dark'
                    ? 'bg-[#3c3c3c] hover:bg-[#4c4c4c] text-white'
                    : 'bg-[#e5e5e5] hover:bg-[#d5d5d5] text-black'
                }`}
              >
                <Brain className="h-3.5 w-3.5 mr-1.5" />
                <span>Playground Help</span>
              </button>
              <button
                onClick={() => sendMessage("What are your pricing plans?")}
                className={`flex items-center px-3 py-1.5 rounded-md text-xs whitespace-nowrap ${
                  theme === 'dark'
                    ? 'bg-[#3c3c3c] hover:bg-[#4c4c4c] text-white'
                    : 'bg-[#e5e5e5] hover:bg-[#d5d5d5] text-black'
                }`}
              >
                <Zap className="h-3.5 w-3.5 mr-1.5" />
                <span>Pricing</span>
              </button>
            </div>
          </div>
          
          {/* FAQ panel */}
          <AnimatePresence>
            {showFAQs && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`border-t overflow-hidden ${
                  theme === 'dark' ? 'border-[#3d3d3d] bg-[#252526]' : 'border-[#e0e0e0] bg-white'
                }`}
              >
                <div className="p-3">
                  <input
                    type="text"
                    value={faqQuery}
                    onChange={(e) => setFaqQuery(e.target.value)}
                    placeholder="Search FAQs..."
                    className={`w-full py-2 px-3 rounded mb-2 ${
                      theme === 'dark'
                        ? 'bg-[#3c3c3c] text-white border-[#5f5f5f] focus:border-[#007acc]'
                        : 'bg-white text-black border-[#d4d4d4] focus:border-[#007acc]'
                    } border focus:outline-none`}
                  />
                  
                  <div className="max-h-40 overflow-y-auto">
                    {filteredFAQ.length === 0 ? (
                      <p className="text-center text-sm py-2 text-gray-500">No matching FAQs found</p>
                    ) : (
                      <div className="space-y-1">
                        {filteredFAQ.map((item, index) => (
                          <button
                            key={index}
                            onClick={() => handleFAQClick(item.question)}
                            className={`w-full text-left p-2 rounded text-sm ${
                              theme === 'dark'
                                ? 'hover:bg-[#3c3c3c]'
                                : 'hover:bg-[#f5f5f5]'
                            }`}
                          >
                            {item.question}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Input area */}
          <div className={`p-3 border-t ${
            theme === 'dark' ? 'border-[#3d3d3d] bg-[#252526]' : 'border-[#e0e0e0] bg-[#f3f3f3]'
          }`}>
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Neural Nexus AI..."
                className={`flex-1 py-2 px-3 rounded-l-md ${
                  theme === 'dark'
                    ? 'bg-[#3c3c3c] text-white border-[#5f5f5f] focus:border-[#007acc]'
                    : 'bg-white text-black border-[#d4d4d4] focus:border-[#007acc]'
                } border focus:outline-none`}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className={`p-2 rounded-r-md ${
                  isLoading || !inputValue.trim()
                    ? theme === 'dark' ? 'bg-[#4c4c4c] text-gray-400' : 'bg-[#d5d5d5] text-gray-500'
                    : theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
                aria-label="Send message"
              >
                {isLoading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </button>
            </form>
            
            <div className="mt-2 text-xs text-center text-gray-500">
              <span>Neural Nexus AI is in beta. </span>
              <a href="/privacy" className="underline hover:text-gray-400">Privacy Policy</a>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AIAgent; 