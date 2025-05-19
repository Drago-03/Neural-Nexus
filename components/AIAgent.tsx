"use client";

import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquare, X, Send, ChevronDown, Cpu, Loader, Maximize2, Minimize2, ExternalLink, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AIAgentService, AgentMessage as ServiceMessage, AgentResponsePayload } from '@/lib/AIAgentService';
import { useAIAgent } from '@/providers/AIAgentProvider';
import type { Session } from 'next-auth';

type Message = {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  actions?: Array<{
    type: string;
    label: string;
    value: string;
  }>;
  links?: Array<{
    url: string;
    label: string;
  }>;
  additionalContext?: Record<string, any>;
};

type FAQ = {
  question: string;
  answer: string;
  category: string;
};

// Sample FAQs - these would be expanded in a real application
const FAQs: FAQ[] = [
  {
    question: "What is Neural Nexus?",
    answer: "Neural Nexus is a platform for AI developers to create, share, and monetize their machine learning models. It provides tools for model development, deployment, and marketplace integration.",
    category: "general"
  },
  {
    question: "How do I upload a model?",
    answer: "To upload a model, navigate to the dashboard, click on 'Upload Model' and follow the step-by-step process to provide model details, upload files, and set pricing.",
    category: "models"
  },
  {
    question: "How do payments work?",
    answer: "We support crypto payments through our Web3 integration as well as traditional payment methods. Creators receive 85% of sales revenue, with payouts processed weekly.",
    category: "payments"
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we use end-to-end encryption and follow industry best practices for data security. Your models and personal information are protected with state-of-the-art security measures.",
    category: "security"
  },
  {
    question: "Can I try before buying?",
    answer: "Many models offer a limited free tier or trial version. Look for the 'Try' button on model listings to test capabilities before purchasing.",
    category: "marketplace"
  },
  {
    question: "How do I get API keys?",
    answer: "API keys can be generated from your dashboard under the 'API Keys' tab. You can create, manage, and revoke keys as needed for different applications.",
    category: "api"
  },
  {
    question: "What AI technologies are supported?",
    answer: "We support a wide range of AI technologies including neural networks, transformers, computer vision models, NLP, reinforcement learning, and more.",
    category: "technical"
  },
  {
    question: "How do I connect my wallet?",
    answer: "Click on the Connect Wallet button in the top navigation bar, and select your preferred Web3 wallet. We support MetaMask, Coinbase Wallet, and WalletConnect.",
    category: "web3"
  }
];

// Custom hook to safely use session
function useSafeSession() {
  const [sessionData, setSessionData] = useState<Session | null>(null);
  const [sessionError, setSessionError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    let isMounted = true;
    
    const getSession = async () => {
      try {
        // Dynamically import getSession to prevent errors during initial render
        const auth = await import('next-auth/react');
        
        if (!isMounted) return;
        
        try {
          // Use getSession instead of useSession
          const session = await auth.getSession();
          if (isMounted && session) {
            setSessionData(session.data);
          }
        } catch (err) {
          console.error('Session fetch error:', err);
          if (isMounted) {
            setSessionError(true);
          }
        }
      } catch (err) {
        console.error('NextAuth import error:', err);
        if (isMounted) {
          setSessionError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    getSession();
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  return { sessionData, sessionError, loading };
}

export default function AIAgent({ systemContext }: { systemContext?: string }) {
  // Connect to AIAgentProvider context
  const { isOpen, setIsOpen, lastQuery, setLastQuery } = useAIAgent();
  
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'agent',
      content: systemContext || "Hey there! I'm the Neural Nexus AI Assistant. How can I help you today? You can ask me about our platform, AI models, marketplace, or anything else!",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  
  // Use our safer session hook
  const { sessionData, sessionError, loading } = useSafeSession();
  
  // Get AI Agent service singleton instance
  const aiService = AIAgentService.getInstance();
  
  // Check for lastQuery from context
  useEffect(() => {
    if (lastQuery) {
      setInput(lastQuery);
      // Clear lastQuery after setting the input
      setLastQuery(null);
      // Auto-submit if there's a query
      if (inputRef.current) {
        inputRef.current.focus();
        setTimeout(() => sendMessage(), 500);
      }
    }
  }, [lastQuery, setLastQuery]);
  
  // Toggle chat window
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };
  
  const toggleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(!isMinimized);
  };
  
  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  // Handle special commands starting with /
  useEffect(() => {
    if (input.startsWith('/')) {
      setShowCommands(true);
    } else {
      setShowCommands(false);
    }
  }, [input]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };
  
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  const sendMessage = async () => {
    if (!input.trim()) return;
    
    // Handle special commands
    if (input.startsWith('/')) {
      handleCommand(input);
      return;
    }
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    try {
      // Convert history to service format
      const messageHistory: ServiceMessage[] = messages.map(msg => ({
        id: msg.id,
        role: msg.role as 'user' | 'agent' | 'system',
        content: msg.content,
        timestamp: msg.timestamp
      }));
      
      // Call AI service
      const response = await aiService.processQuery({
        query: userMessage.content,
        history: messageHistory,
        userData: {
          userId: sessionData?.user?.email || undefined,
          email: sessionData?.user?.email || undefined,
          name: sessionData?.user?.name || undefined,
          isLoggedIn: !!sessionData
        }
      });
      
      // Log interaction for analytics (in a real app)
      aiService.logInteraction(userMessage.content, response.message, sessionData?.user?.email || undefined);
      
      // Create agent response message
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: response.message,
        timestamp: new Date(),
        actions: response.suggestedActions,
        links: response.links,
        additionalContext: response.additionalContext
      };
      
      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      // Handle errors
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: "I'm sorry, I encountered an error processing your request. Please try again later.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      console.error('AI Agent error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle special commands
  const handleCommand = (cmd: string) => {
    const command = cmd.toLowerCase().trim();
    
    if (command === '/clear') {
      // Clear chat history
      setMessages([
        {
          id: Date.now().toString(),
          role: 'system',
          content: "Chat history cleared. How can I help you today?",
          timestamp: new Date()
        }
      ]);
      setInput('');
    } else if (command === '/help') {
      // Show help message
      const helpMessage: Message = {
        id: Date.now().toString(),
        role: 'system',
        content: "Available commands:\n/clear - Clear chat history\n/help - Show this help message\n/sample - Show sample questions\n/about - About Neural Nexus AI Assistant",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, helpMessage]);
      setInput('');
    } else if (command === '/sample' || command === '/examples') {
      // Show sample questions
      const samplesMessage: Message = {
        id: Date.now().toString(),
        role: 'system',
        content: "Here are some questions you can ask me:",
        timestamp: new Date(),
        actions: [
          { type: 'question', label: 'What is Neural Nexus?', value: 'What is Neural Nexus?' },
          { type: 'question', label: 'How do I upload a model?', value: 'How do I upload a model?' },
          { type: 'question', label: 'How do payments work?', value: 'How do payments work?' },
          { type: 'question', label: 'How do I get API keys?', value: 'How do I get API keys?' },
          { type: 'question', label: 'Is my data secure?', value: 'Is my data secure?' }
        ]
      };
      setMessages(prev => [...prev, samplesMessage]);
      setInput('');
    } else if (command === '/about') {
      // Show about message
      const aboutMessage: Message = {
        id: Date.now().toString(),
        role: 'system',
        content: "Neural Nexus AI Assistant v1.0\nI'm here to help you navigate the Neural Nexus platform, answer questions about our services, and provide assistance with using our platform.\n\nI can help with:\n- General questions about Neural Nexus\n- Model uploads and management\n- Account information\n- API integration\n- Pricing and payments\n- And much more!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aboutMessage]);
      setInput('');
    } else {
      // Unknown command
      const unknownCommandMessage: Message = {
        id: Date.now().toString(),
        role: 'system',
        content: `Unknown command: ${command}\nType /help to see available commands.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, unknownCommandMessage]);
      setInput('');
    }
  };
  
  // Handle suggested action clicks
  const handleActionClick = (action: { type: string; label: string; value: string }) => {
    switch (action.type) {
      case 'navigate':
        router.push(action.value);
        break;
      case 'question':
      case 'related':
        setInput(action.value);
        if (inputRef.current) {
          inputRef.current.focus();
        }
        break;
      case 'command':
        handleCommand(action.value);
        break;
      default:
        setInput(action.value);
        if (inputRef.current) {
          inputRef.current.focus();
        }
    }
  };
  
  const renderMessageContent = (content: string) => {
    // Convert line breaks to <br> elements
    return content.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  // Sample command suggestions for the /commands dropdown
  const commandSuggestions = [
    { command: '/help', description: 'Show available commands' },
    { command: '/clear', description: 'Clear chat history' },
    { command: '/sample', description: 'Show sample questions' },
    { command: '/about', description: 'About Neural Nexus AI Assistant' },
  ];
  
  // Suggested questions for users to click on
  const suggestedQuestions = [
    "What is Neural Nexus?",
    "How do I upload a model?",
    "How do payments work?",
    "How secure is my data?",
    "How do I get API keys?"
  ];
  
  return (
    <>
      {/* Chat button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-lg text-white z-50 flex items-center justify-center hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
        aria-label="Chat with AI Assistant"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
      
      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : '500px'
            }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 right-6 w-80 md:w-96 bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col border border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 text-white flex justify-between items-center">
              <div className="flex items-center">
                <Cpu className="h-5 w-5 mr-2" />
                <h3 className="font-medium">Neural Nexus Assistant</h3>
              </div>
              <div className="flex items-center">
                <button 
                  onClick={toggleMinimize}
                  className="p-1 hover:bg-white/20 rounded-full"
                  aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button 
                  onClick={toggleChat}
                  className="p-1 hover:bg-white/20 rounded-full ml-1"
                  aria-label="Close chat"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            
            {/* Chat messages */}
            {!isMinimized && (
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-800">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[85%] p-3 rounded-lg ${
                        message.role === 'user' 
                          ? 'bg-purple-600 text-white' 
                          : message.role === 'system'
                            ? 'bg-gray-600 text-white'
                            : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      {renderMessageContent(message.content)}
                      
                      {/* Code sample if available */}
                      {message.additionalContext?.sampleCode && (
                        <div className="mt-2 bg-gray-800 rounded p-2 text-green-400 font-mono text-xs overflow-x-auto">
                          {message.additionalContext.sampleCode.split('\n').map((line: string, i: number) => (
                            <div key={i}>{line}</div>
                          ))}
                        </div>
                      )}
                      
                      {/* Action buttons */}
                      {message.actions && message.actions.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.actions.map((action, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleActionClick(action)}
                              className="text-xs bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-200 dark:hover:bg-purple-800/40 text-purple-800 dark:text-purple-300 rounded-full px-3 py-1 transition-colors flex items-center"
                            >
                              {action.type === 'navigate' && <ExternalLink className="h-3 w-3 mr-1" />}
                              {action.type === 'question' && <Sparkles className="h-3 w-3 mr-1" />}
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {/* Links */}
                      {message.links && message.links.length > 0 && (
                        <div className="mt-2">
                          {message.links.map((link, idx) => (
                            <a
                              key={idx}
                              href={link.url}
                              className="text-blue-500 dark:text-blue-400 hover:underline text-sm flex items-center mt-1"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              {link.label}
                            </a>
                          ))}
                        </div>
                      )}
                      
                      <div className={`text-xs mt-1 ${
                        message.role === 'user' 
                          ? 'text-purple-200' 
                          : message.role === 'system'
                            ? 'text-gray-300'
                            : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="mb-4 flex justify-start">
                    <div className="max-w-[85%] p-3 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center">
                        <Loader size={16} className="animate-spin mr-2" />
                        <span>AI Assistant is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Suggested questions (shown only after initial greeting) */}
                {messages.length === 1 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">You can ask me about:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedQuestions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setInput(question);
                            if (inputRef.current) {
                              inputRef.current.focus();
                            }
                          }}
                          className="text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full px-3 py-1 text-gray-700 dark:text-gray-300 transition-colors"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}
            
            {/* Input area */}
            {!isMinimized && (
              <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <div className="relative">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    placeholder="Ask me anything... or type / for commands"
                    className="w-full resize-none border rounded-lg py-2 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                    rows={1}
                    style={{ minHeight: '40px', maxHeight: '120px' }}
                  />
                  
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || isTyping}
                    className={`absolute right-2 bottom-2 p-1 rounded-lg ${
                      !input.trim() || isTyping
                        ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400' 
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    } transition-colors`}
                    aria-label="Send message"
                  >
                    <Send size={18} />
                  </button>
                </div>
                
                {/* Command suggestions */}
                {showCommands && (
                  <div className="absolute bottom-16 left-4 right-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-10">
                    <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Available commands</p>
                    </div>
                    <div className="max-h-56 overflow-y-auto">
                      {commandSuggestions.map((cmd, index) => (
                        <button
                          key={index}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex justify-between items-center"
                          onClick={() => {
                            setInput(cmd.command);
                            setShowCommands(false);
                            if (inputRef.current) {
                              inputRef.current.focus();
                            }
                          }}
                        >
                          <span className="font-medium text-purple-600 dark:text-purple-400">{cmd.command}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{cmd.description}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center">
                  <span>Powered by Neural Nexus AI</span>
                  <span>Type / for commands</span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 