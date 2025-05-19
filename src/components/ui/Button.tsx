/**
 * Button component providing consistent styling and behavior across the application.
 * Supports multiple variants, sizes, and states including loading.
 * 
 * @module components/ui/Button
 */

import React, { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

// Define button variants and sizes using CVA
const buttonVariants = cva(
  // Base styles for all buttons
  [
    "inline-flex",
    "items-center",
    "justify-center",
    "rounded-md",
    "text-sm",
    "font-medium",
    "transition-colors",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-offset-2",
    "focus-visible:ring-offset-gray-950",
    "disabled:pointer-events-none",
    "disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-gradient-to-r",
          "from-purple-600",
          "to-blue-600",
          "text-white",
          "hover:from-purple-700",
          "hover:to-blue-700",
          "shadow-md",
          "shadow-purple-900/20",
          "focus-visible:ring-purple-500",
        ],
        secondary: [
          "bg-gray-800",
          "text-white",
          "hover:bg-gray-700",
          "border",
          "border-gray-700",
          "focus-visible:ring-gray-500",
        ],
        outline: [
          "border",
          "border-gray-700",
          "bg-transparent",
          "text-gray-300",
          "hover:bg-gray-800/50",
          "hover:text-white",
          "focus-visible:ring-gray-500",
        ],
        ghost: [
          "text-gray-300",
          "hover:bg-gray-800/50",
          "hover:text-white",
          "focus-visible:ring-gray-500",
        ],
        destructive: [
          "bg-red-600",
          "text-white",
          "hover:bg-red-700",
          "focus-visible:ring-red-500",
        ],
        success: [
          "bg-green-600",
          "text-white",
          "hover:bg-green-700",
          "focus-visible:ring-green-500",
        ],
        link: [
          "text-blue-500",
          "underline-offset-4",
          "hover:underline",
          "hover:text-blue-400",
          "p-0",
          "h-auto",
        ],
      },
      size: {
        sm: "h-9 px-3 text-xs",
        md: "h-10 px-4 py-2",
        lg: "h-11 px-6 py-2 text-base",
        icon: "h-10 w-10",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
    
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <Loader2 className={cn("mr-2 animate-spin", iconSize)} />
        )}
        
        {!isLoading && leftIcon && (
          <span className={cn("mr-2", iconSize)}>{leftIcon}</span>
        )}
        
        {children}
        
        {rightIcon && !isLoading && (
          <span className={cn("ml-2", iconSize)}>{rightIcon}</span>
        )}
      </button>
    );
  }
);