"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Brain, Sparkles, Copy, Download, Zap, RefreshCw, MessageSquare } from 'lucide-react';

interface AIAssistantPanelProps {
  theme: 'dark' | 'light';
  onClose: () => void;
  code: string;
  language: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Predefined commands
const COMMANDS = [
  { label: "Explain Code", icon: <Brain className="h-4 w-4" />, prompt: "Explain this code in simple terms" },
  { label: "Optimize Code", icon: <Sparkles className="h-4 w-4" />, prompt: "Optimize this code for better performance" },
  { label: "Find Bugs", icon: <Zap className="h-4 w-4" />, prompt: "Check for bugs or errors in this code" },
  { label: "Add Comments", icon: <MessageSquare className="h-4 w-4" />, prompt: "Add helpful comments to explain this code" },
];

export default function AIAssistantPanel({ theme, onClose, code, language }: AIAssistantPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hey there! I'm your Neural Nexus AI Assistant. How can I help with your code today?" }
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    const userMessage: Message = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Simulate AI response with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let response = "";
      
      // Generate a response based on the user message
      if (content.toLowerCase().includes('explain')) {
        response = generateExplanation(code, language);
      } else if (content.toLowerCase().includes('optimize') || content.toLowerCase().includes('improve')) {
        response = generateOptimization(code, language);
      } else if (content.toLowerCase().includes('bug') || content.toLowerCase().includes('error')) {
        response = findBugs(code, language);
      } else if (content.toLowerCase().includes('comment')) {
        response = "I'd add comments to explain the key parts of your code:\n\n```\n// This function checks if the mood is 'bussin'\n// and returns appropriate slang response\nfunction vibeCheck(mood) {\n  // If the mood is positive, return positive slang\n  if (mood === 'bussin') {\n    return 'no cap, fr fr'; // Means 'no lie, for real for real'\n  } else {\n    return 'mid, tbh'; // Means 'mediocre, to be honest'\n  }\n}\n\n// This function logs a message and returns confirmation\n// It's using modern slang terminology\nconst sendIt = () => {\n  console.log(\"sending it...\"); // Log the action\n  return \"sent!\"; // Return confirmation\n};\n\n// Execute the functions to demonstrate functionality\nvibeCheck('bussin');\nsendIt();\n```";
      } else {
        response = "I'm here to help! I can explain your code, optimize it, find bugs, or add comments. Just let me know what you need!";
      }
      
      // Add AI response
      const aiMessage: Message = { role: 'assistant', content: response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      // Handle error
      const errorMessage: Message = { 
        role: 'assistant', 
        content: "Sorry, I encountered an error while processing your request. Please try again."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };
  
  const handleCommandClick = (prompt: string) => {
    sendMessage(prompt);
  };
  
  // Simulate code explanation
  const generateExplanation = (code: string, language: string) => {
    if (code.includes('vibeCheck') && code.includes('sendIt')) {
      return "This code defines two functions using Gen Z slang:\n\n1. `vibeCheck(mood)` - Takes a mood parameter and returns slang responses:\n   - If mood is 'bussin' (meaning 'really good'), it returns 'no cap, fr fr' (meaning 'no lie, for real')\n   - Otherwise returns 'mid, tbh' (meaning 'mediocre, to be honest')\n\n2. `sendIt()` - A function that logs 'sending it...' and returns 'sent!'\n\nAt the end, both functions are called to demonstrate how they work.";
    } else if (code.includes('neural network') || code.includes('tf.sequential')) {
      return "This code creates a simple neural network using TensorFlow.js:\n\n1. It initializes a sequential model (layers ordered one after another)\n2. Adds three dense (fully connected) layers:\n   - First layer: 64 neurons with ReLU activation, expecting 10 input features\n   - Second layer: 32 neurons with ReLU activation\n   - Output layer: 1 neuron (no activation specified)\n3. Compiles the model with:\n   - Adam optimizer (efficient stochastic optimization)\n   - Mean squared error loss function (good for regression problems)\n\nThe model is ready to be trained, but the training code isn't included yet.";
    } else if (code.includes('React') && code.includes('Button')) {
      return "This is a React functional component that creates a styled button:\n\n1. It imports React\n2. Defines a Button component that takes two props:\n   - `text`: The text to display on the button\n   - `onClick`: A function to handle click events\n3. Returns a button element with:\n   - Tailwind CSS classes for styling (gradient background from purple to blue)\n   - The onClick handler passed from props\n   - The text content from props\n4. Exports the Button component as the default export\n\nThis component follows modern React patterns using a functional component with props.";
    } else {
      return "This code seems to be written in " + language + ". I can see some basic functionality, but it would help if you could tell me more about what you're trying to accomplish with this code.";
    }
  };
  
  // Simulate optimization suggestions
  const generateOptimization = (code: string, language: string) => {
    return "Here are some optimization suggestions for your code:\n\n```\n// Use const for variables that won't be reassigned\nconst vibeCheck = (mood) => {\n  // Use a ternary operator for simple conditionals\n  return mood === 'bussin' ? 'no cap, fr fr' : 'mid, tbh';\n};\n\n// Arrow function for consistency\nconst sendIt = () => {\n  console.log(\"sending it...\");\n  return \"sent!\";\n};\n\n// Store and use the return values\nconst vibeResult = vibeCheck('bussin');\nconst sendResult = sendIt();\n\n// Log results if needed\nconsole.log(vibeResult, sendResult);\n```\n\nThese changes make the code more concise and consistent.";
  };
  
  // Simulate bug finding
  const findBugs = (code: string, language: string) => {
    if (code.includes('vibeCheck') && code.includes('sendIt')) {
      return "I've reviewed your code and found a couple of potential issues:\n\n1. **Unused Return Values**: You're calling `vibeCheck('bussin')` and `sendIt()` but not storing or using their return values. If you want to see their output, try adding `console.log(vibeCheck('bussin'))` and `console.log(sendIt())`.\n\n2. **Limited Error Handling**: There's no validation for the input to `vibeCheck`. If something other than a string is passed, it will still execute but might give unexpected results.\n\n3. **Potential Side Effects**: Since `sendIt()` logs to the console, calling it multiple times will have the side effect of multiple console logs, which might not be what you want in all cases.";
    } else {
      return "I've analyzed your code but don't see any obvious bugs. However, here are some general recommendations:\n\n1. Consider adding error handling using try/catch blocks\n2. Validate inputs to your functions\n3. Add unit tests to verify the code works as expected\n4. Ensure proper memory management for resource-intensive operations";
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div 
        className={`px-4 py-3 border-b flex justify-between items-center ${
          theme === 'dark' ? 'bg-[#252526] border-[#3d3d3d]' : 'bg-[#f3f3f3] border-[#e0e0e0]'
        }`}
      >
        <div className="flex items-center">
          <Bot className="h-5 w-5 mr-2 text-purple-500" />
          <h3 className="font-medium">Neural Nexus AI Assistant</h3>
        </div>
        <button 
          onClick={onClose}
          className={`p-1 rounded-sm ${theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e5e5e5]'}`}
          aria-label="Close AI Assistant"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      {/* Messages area */}
      <div 
        className={`flex-1 overflow-y-auto p-4 space-y-4 ${
          theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white'
        }`}
      >
        {messages.map((message, index) => (
          <div 
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] rounded-lg p-3 ${
                message.role === 'user'
                  ? theme === 'dark'
                    ? 'bg-[#0e639c] text-white'
                    : 'bg-[#007acc] text-white' 
                  : theme === 'dark'
                    ? 'bg-[#2d2d2d] text-gray-300'
                    : 'bg-[#f0f0f0] text-gray-800'
              }`}
            >
              {message.content.includes('```') ? (
                <div>
                  {message.content.split('```').map((part, i) => {
                    if (i % 2 === 0) {
                      return <p key={i} className="whitespace-pre-wrap">{part}</p>;
                    } else {
                      return (
                        <div 
                          key={i}
                          className={`my-2 p-2 rounded font-mono text-sm overflow-x-auto ${
                            theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-[#e5e5e5]'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Code</span>
                            <button 
                              className={`p-1 rounded-sm ${theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#d5d5d5]'}`}
                              onClick={() => navigator.clipboard.writeText(part.trim())}
                              aria-label="Copy code"
                              title="Copy to clipboard"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <pre>{part}</pre>
                        </div>
                      );
                    }
                  })}
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{message.content}</p>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Quick commands */}
      <div className={`p-2 border-t ${
        theme === 'dark' ? 'border-[#3d3d3d] bg-[#252526]' : 'border-[#e0e0e0] bg-[#f3f3f3]'
      }`}>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {COMMANDS.map((command, index) => (
            <button
              key={index}
              onClick={() => handleCommandClick(command.prompt)}
              className={`flex items-center px-3 py-1.5 rounded-md text-xs whitespace-nowrap ${
                theme === 'dark'
                  ? 'bg-[#3c3c3c] hover:bg-[#4c4c4c] text-white'
                  : 'bg-[#e5e5e5] hover:bg-[#d5d5d5] text-black'
              }`}
              disabled={isLoading}
            >
              {command.icon}
              <span className="ml-1">{command.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Input area */}
      <div className={`p-3 border-t ${
        theme === 'dark' ? 'border-[#3d3d3d] bg-[#252526]' : 'border-[#e0e0e0] bg-[#f3f3f3]'
      }`}>
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your code..."
            className={`flex-1 py-2 px-3 rounded-l-md ${
              theme === 'dark'
                ? 'bg-[#3c3c3c] text-white border-[#5f5f5f] focus:border-[#007acc]'
                : 'bg-white text-black border-[#d4d4d4] focus:border-[#007acc]'
            } border focus:outline-none`}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`p-2 rounded-r-md ${
              isLoading || !input.trim()
                ? theme === 'dark' ? 'bg-[#4c4c4c] text-gray-400' : 'bg-[#d5d5d5] text-gray-500'
                : theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
            aria-label="Send message"
          >
            {isLoading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </button>
        </form>
      </div>
    </div>
  );
} 