import React, { ForwardedRef, InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Search, Eye, EyeOff } from 'lucide-react';

// Define input variants and sizes using CVA
const inputVariants = cva(
  // Base styles for all inputs
  [
    "flex",
    "w-full",
    "rounded-md",
    "px-3",
    "text-sm",
    "file:border-0",
    "file:bg-transparent",
    "file:text-sm",
    "file:font-medium",
    "placeholder:text-gray-500",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-offset-1",
    "focus-visible:ring-offset-gray-950",
    "disabled:cursor-not-allowed",
    "disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        default: [
          "border",
          "border-gray-700",
          "bg-gray-950/50",
          "text-gray-200",
          "focus-visible:ring-purple-500/70",
          "hover:border-gray-600",
          "hover:bg-gray-900/40"
        ],
        outline: [
          "border",
          "border-gray-700",
          "bg-transparent",
          "text-gray-200",
          "focus-visible:ring-purple-500/70",
          "hover:border-gray-600"
        ],
        ghost: [
          "bg-transparent",
          "text-gray-200",
          "focus-visible:bg-gray-800/30",
          "focus-visible:ring-purple-500/50",
          "hover:bg-gray-800/20"
        ],
      },
      inputSize: {
        sm: "h-9 py-1 text-xs",
        md: "h-10 py-2",
        lg: "h-11 py-2 text-base",
      },
      hasLeftIcon: {
        true: "pl-10",
        false: "",
      },
      hasRightIcon: {
        true: "pr-10",
        false: "",
      },
      hasError: {
        true: [
          "border-red-600/70",
          "focus-visible:ring-red-500/70",
          "hover:border-red-600"
        ],
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "md",
      hasLeftIcon: false,
      hasRightIcon: false,
      hasError: false,
    },
  }
);

// Omit the native 'size' attribute to avoid collision with our custom size
type InputElementProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>;

export interface InputProps extends InputElementProps, VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerClassName?: string;
  labelClassName?: string;
  // Rename our custom size to align with the variant name
  inputSize?: 'sm' | 'md' | 'lg';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      labelClassName,
      label,
      error,
      leftIcon,
      rightIcon,
      variant,
      inputSize,
      type = "text",
      disabled,
      ...props
    }: InputProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    // Determine if we should apply the hasError variant
    const hasError = Boolean(error);
    
    // Determine if we should apply the hasLeftIcon and hasRightIcon variants
    const hasLeftIcon = Boolean(leftIcon);
    const hasRightIcon = Boolean(rightIcon);
    
    return (
      <div className={cn("w-full space-y-1.5", containerClassName)}>
        {label && (
          <label 
            htmlFor={props.id || props.name} 
            className={cn(
              "text-sm font-medium text-gray-300",
              disabled && "opacity-70", 
              labelClassName
            )}
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            type={type}
            className={cn(
              inputVariants({ 
                variant, 
                inputSize, 
                hasLeftIcon, 
                hasRightIcon, 
                hasError,
                className 
              })
            )}
            disabled={disabled}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-400"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

export function SearchInput(props: Omit<InputProps, 'leftIcon'>) {
  return (
    <Input
      leftIcon={<Search className="h-5 w-5" />}
      placeholder="Search..."
      {...props}
    />
  );
}