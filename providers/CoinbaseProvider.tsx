"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-hot-toast';

interface CoinbaseCheckoutOptions {
  name: string;
  description: string;
  local_price: {
    amount: string;
    currency: string;
  };
  metadata?: Record<string, any>;
  redirect_url?: string;
  cancel_url?: string;
}

interface CheckoutResult {
  url?: string;
  code?: string;
  error?: string;
}

interface CoinbaseContextType {
  isLoading: boolean;
  error: string | null;
  checkoutWithCoinbase: (options: CoinbaseCheckoutOptions) => Promise<CheckoutResult>;
  checkTransactionStatus: (chargeCode: string) => Promise<{
    status: 'new' | 'pending' | 'confirmed' | 'failed' | 'expired' | 'completed' | 'unresolved';
    error?: string;
  }>;
}

const CoinbaseContext = createContext<CoinbaseContextType>({
  isLoading: false,
  error: null,
  checkoutWithCoinbase: async () => ({ error: 'Provider not initialized' }),
  checkTransactionStatus: async () => ({ status: 'unresolved', error: 'Provider not initialized' })
});

export const useCoinbase = () => useContext(CoinbaseContext);

export function CoinbaseProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset error on mount
  useEffect(() => {
    setError(null);
  }, []);

  const checkoutWithCoinbase = async (options: CoinbaseCheckoutOptions): Promise<CheckoutResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Add default redirect URLs if not provided
      if (!options.redirect_url) {
        options.redirect_url = `${window.location.origin}/checkout/success`;
      }
      
      if (!options.cancel_url) {
        options.cancel_url = `${window.location.origin}/checkout/cancelled`;
      }
      
      // Call our API to create a Coinbase checkout
      const response = await fetch('/api/coinbase/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout');
      }
      
      return {
        url: data.hosted_url,
        code: data.code
      };
    } catch (error: any) {
      console.error('Coinbase checkout error:', error);
      setError(error.message || 'Failed to create checkout');
      
      return {
        error: error.message || 'Failed to create checkout'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const checkTransactionStatus = async (chargeCode: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/coinbase/check-status?code=${chargeCode}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to check transaction status');
      }
      
      return {
        status: data.status,
      };
    } catch (error: any) {
      console.error('Error checking transaction status:', error);
      
      return {
        status: 'unresolved',
        error: error.message || 'Failed to check transaction status'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const value: CoinbaseContextType = {
    isLoading,
    error,
    checkoutWithCoinbase,
    checkTransactionStatus
  };

  return <CoinbaseContext.Provider value={value}>{children}</CoinbaseContext.Provider>;
} 