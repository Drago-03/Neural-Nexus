"use client";

import React from 'react';
import { Cpu } from 'lucide-react';
import { useAIAgent } from '@/providers/AIAgentProvider';

interface AIAssistantButtonProps {
  question?: string;
  children?: React.ReactNode;
  variant?: 'icon' | 'text' | 'pill';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AIAssistantButton({
  question,
  children,
  variant = 'text',
  size = 'md',
  className = '',
}: AIAssistantButtonProps) {
  const { setIsOpen, setLastQuery } = useAIAgent();
  
  const handleClick = () => {
    if (question) {
      setLastQuery(question);
    }
    setIsOpen(true);
  };
  
  // Base classes
  const baseClasses = "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50";
  
  // Size classes
  const sizeClasses = {
    sm: variant === 'icon' ? 'p-1.5' : 'px-3 py-1.5 text-xs',
    md: variant === 'icon' ? 'p-2' : 'px-4 py-2 text-sm',
    lg: variant === 'icon' ? 'p-2.5' : 'px-5 py-2.5 text-base',
  };
  
  // Variant classes
  const variantClasses = {
    icon: "rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700",
    text: "rounded-md text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20",
    pill: "rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700",
  };
  
  // Combine all classes
  const buttonClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
  
  return (
    <button onClick={handleClick} className={buttonClasses}>
      {variant === 'icon' ? (
        <Cpu className={size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-5 w-5' : 'h-6 w-6'} />
      ) : (
        <div className="flex items-center gap-1.5">
          <Cpu className={size === 'sm' ? 'h-3.5 w-3.5' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5'} />
          {children || "Ask AI Assistant"}
        </div>
      )}
    </button>
  );
} 