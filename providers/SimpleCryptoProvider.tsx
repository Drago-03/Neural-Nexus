"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import { ethers } from 'ethers';

interface CryptoContextType {
  connect: () => Promise<void>;
  disconnect: () => void;
  makePayment: (options: PaymentOptions) => Promise<PaymentResult>;
  isConnected: boolean;
  address: string | null;
  balance: string | null;
  chainId: number | null;
  provider: any;
}

interface PaymentOptions {
  amount: number;
  recipient: string;
  metadata?: Record<string, any>;
}

interface PaymentResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

const CryptoContext = createContext<CryptoContextType>({
  connect: async () => {},
  disconnect: () => {},
  makePayment: async () => ({ success: false, error: 'Provider not initialized' }),
  isConnected: false,
  address: null,
  balance: null,
  chainId: null,
  provider: null
});

export const useSimpleCrypto = () => useContext(CryptoContext);

export function SimpleCryptoProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [signer, setSigner] = useState<any>(null);

  // Initialize provider on client side only
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const ethProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(ethProvider);

      // Check if already connected
      checkConnection(ethProvider);

      // Listen for account changes
      if (window.ethereum.on) {
        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          if (accounts.length > 0) {
            handleConnection(ethProvider, accounts[0]);
          } else {
            handleDisconnect();
          }
        });

        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });

        window.ethereum.on('disconnect', handleDisconnect);
      }
    }

    return () => {
      if (typeof window !== 'undefined' && window.ethereum?.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleDisconnect);
        window.ethereum.removeListener('chainChanged', () => {});
        window.ethereum.removeListener('disconnect', handleDisconnect);
      }
    };
  }, []);

  const checkConnection = async (ethProvider: any) => {
    try {
      const accounts = await ethProvider.listAccounts();
      if (accounts.length > 0) {
        handleConnection(ethProvider, accounts[0].address);
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  const handleConnection = async (ethProvider: any, address: string) => {
    try {
      const ethSigner = await ethProvider.getSigner();
      setSigner(ethSigner);
      setAddress(address);
      setIsConnected(true);

      // Get balance
      const ethBalance = await ethProvider.getBalance(address);
      setBalance(ethers.formatEther(ethBalance));

      // Get network
      const network = await ethProvider.getNetwork();
      setChainId(Number(network.chainId));

      toast.success('Wallet connected!');
    } catch (error) {
      console.error('Error in connection handling:', error);
      toast.error('Failed to connect wallet');
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setAddress(null);
    setBalance(null);
    setChainId(null);
    setSigner(null);
  };

  const connect = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      toast.error('No crypto wallet found. Please install MetaMask or similar extension.');
      return;
    }

    try {
      // Request accounts
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length > 0) {
        handleConnection(provider, accounts[0]);
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      
      if (error.code === 4001) {
        // User rejected the request
        toast.error('Connection rejected. Please approve the connection request in your wallet.');
      } else {
        toast.error('Failed to connect: ' + (error.message || 'Unknown error'));
      }
    }
  };

  const disconnect = () => {
    handleDisconnect();
    toast.success('Wallet disconnected');
  };

  const makePayment = async ({ amount, recipient, metadata }: PaymentOptions): Promise<PaymentResult> => {
    if (!isConnected || !signer) {
      return { success: false, error: 'Wallet not connected' };
    }
    
    try {
      // Convert amount to Wei (Ethereum's smallest unit)
      const amountInWei = ethers.parseEther(amount.toString());
      
      // Create transaction object
      const tx = {
        to: recipient,
        value: amountInWei,
        gasLimit: 21000, // Default gas limit for simple transfers
      };
      
      // Send transaction
      const transaction = await signer.sendTransaction(tx);
      
      // Get transaction receipt (wait for confirmation)
      const receipt = await transaction.wait();
      
      if (receipt.status === 1) {
        // Also log transaction to our backend for record keeping
        try {
          await fetch('/api/crypto/transaction', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              hash: transaction.hash,
              from: address,
              to: recipient,
              amount: amount,
              metadata
            }),
          });
        } catch (logError) {
          console.error('Error logging transaction:', logError);
          // Continue anyway as the payment was successful
        }
        
        // Update balance after transaction
        if (provider && address) {
          const newBalance = await provider.getBalance(address);
          setBalance(ethers.formatEther(newBalance));
        }
        
        return {
          success: true,
          transactionHash: transaction.hash
        };
      } else {
        return {
          success: false,
          error: 'Transaction failed'
        };
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      
      // Handle common errors
      if (error.code === 'INSUFFICIENT_FUNDS') {
        return { success: false, error: 'Insufficient funds in wallet' };
      } else if (error.code === 'USER_REJECTED') {
        return { success: false, error: 'Transaction rejected by user' };
      }
      
      return {
        success: false,
        error: error.message || 'Transaction failed'
      };
    }
  };

  const value = {
    connect,
    disconnect,
    makePayment,
    isConnected,
    address,
    balance,
    chainId,
    provider
  };

  return <CryptoContext.Provider value={value}>{children}</CryptoContext.Provider>;
} 