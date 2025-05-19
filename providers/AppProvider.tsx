"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAppStore } from '@/lib/store';
import { AppUser, AppState } from '@/lib/store';
import type { Auth, User as FirebaseUser } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
// import { useWeb3 } from '@/providers/Web3Provider';
import AuthProvider from './AuthProvider';

// Mock implementation of the Web3 context
const mockWeb3Context = {
  isConnected: false,
  account: null,
  balance: null,
  chainId: null,
  connectWallet: async () => false,
  disconnectWallet: async () => false,
  isWeb3Enabled: false,
  toggleWeb3Features: () => {},
  isNFTMintingEnabled: false,
  isIPFSStorageEnabled: false,
  toggleNFTMinting: () => {},
  toggleIPFSStorage: () => {},
  mintNFT: async () => null,
  uploadToIPFS: async () => null,
  userBadges: [],
  cryptoEarnings: 0,
  showCryptoEarnings: false,
  toggleCryptoEarnings: () => {},
  provider: null,
  signer: null
};

// Define types for our minimal placeholder implementations
interface DocRef {
  get: () => Promise<{ exists: () => boolean; data?: () => any }>;
}

interface DbPlaceholder {
  doc: (collection: string, id: string) => DocRef;
  collection: (name: string) => any;
  setDoc: (ref: any, data: any, options?: any) => Promise<void>;
}

interface AuthPlaceholder {
  currentUser: null;
  onAuthStateChanged: (callback: (user: FirebaseUser | null) => void) => () => void;
  signInWithPopup: () => Promise<null>;
  signOut: () => Promise<null>;
}

// Import Firebase conditionally to handle initialization errors
let auth: Auth | AuthPlaceholder;
let db: Firestore | DbPlaceholder;

try {
  const firebase = require('@/lib/firebase');
  auth = firebase.auth;
  db = firebase.db;
} catch (error) {
  console.error("Failed to import Firebase:", error);
  // Create minimal placeholders
  auth = {
    currentUser: null,
    onAuthStateChanged: (callback: (user: FirebaseUser | null) => void) => {
      setTimeout(() => callback(null), 0);
      return () => {};
    },
    signInWithPopup: () => Promise.resolve(null),
    signOut: () => Promise.resolve(null)
  };
  
  db = {
    collection: () => ({}),
    doc: () => ({
      get: async () => ({ exists: () => false })
    }),
    setDoc: async () => {}
  };
}

interface AppContextProps {
  user: FirebaseUser | null;
  appUser: AppUser | null;
  loading: boolean;
  isWalletConnected: boolean;
  walletAddress: string | null;
  theme: 'dark' | 'light';
  connectWallet: (address: string) => void;
  disconnectWallet: () => void;
  toggleTheme: () => void;
  signOut: () => Promise<void>;
  // Add web3 properties directly to avoid dependency on Web3Provider
  walletBalance: string | null;
  chainId: number | null;
  userBadges: string[];
  cryptoEarnings: number;
  showCryptoEarnings: boolean;
  toggleCryptoEarnings: () => void;
  isWeb3Enabled: boolean;
  toggleWeb3Features: () => void;
  isNFTMintingEnabled: boolean;
  toggleNFTMinting: () => void;
  isIPFSStorageEnabled: boolean;
  toggleIPFSStorage: () => void;
  mintNFT: (tokenURI: string) => Promise<string | null>;
  uploadToIPFS: (file: File) => Promise<string | null>;
}

const AppContext = createContext<AppContextProps>({
  user: null,
  appUser: null,
  loading: true,
  isWalletConnected: false,
  walletAddress: null,
  theme: 'dark',
  connectWallet: () => {},
  disconnectWallet: () => {},
  toggleTheme: () => {},
  signOut: async () => {},
  // Add mock values for web3 properties
  walletBalance: null,
  chainId: null,
  userBadges: [],
  cryptoEarnings: 0,
  showCryptoEarnings: false,
  toggleCryptoEarnings: () => {},
  isWeb3Enabled: false,
  toggleWeb3Features: () => {},
  isNFTMintingEnabled: false,
  toggleNFTMinting: () => {},
  isIPFSStorageEnabled: false,
  toggleIPFSStorage: () => {},
  mintNFT: async () => null,
  uploadToIPFS: async () => null,
});

export const useAppContext = () => {
  const appContext = useContext(AppContext);
  
  if (!appContext) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  
  // Use context directly without combining with Web3
  return appContext;
};

export default function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  // Access store state and actions
  const appUser = useAppStore((state: AppState) => state.user);
  const setAppUser = useAppStore((state: AppState) => state.setUser);
  const connectWalletAction = useAppStore((state: AppState) => state.connectWallet);
  const disconnectWalletAction = useAppStore((state: AppState) => state.disconnectWallet);
  
  // Listen for auth state changes
  useEffect(() => {
    try {
      // Initialize theme from local storage first
      if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('neural-nexus-theme') as 'dark' | 'light' | null;
        if (savedTheme) {
          setTheme(savedTheme);
          document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        }
      }
      
      // Handle auth state
      const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
        setUser(authUser);
        
        if (authUser) {
          try {
            // Get user data from Firestore
            const userRef = (db as any).doc('users', authUser.uid);
            const userSnap = await userRef.get();
            
            if (userSnap.exists?.()) {
              // User exists, update app state
              const userData = userSnap.data?.() as AppUser;
              setAppUser(userData);
            } else {
              // Create new user in Firestore
              const newUser: AppUser = {
                id: authUser.uid,
                name: authUser.displayName || 'User',
                email: authUser.email || '',
                photoURL: authUser.photoURL || undefined,
                walletConnected: false,
                ownedModels: [],
              };
              
              await (db as any).setDoc(userRef, newUser);
              setAppUser(newUser);
            }
          } catch (error) {
            console.error('Error getting user data', error);
          }
        } else {
          // User is signed out
          setAppUser(null);
        }
        
        setLoading(false);
      });
      
      return () => { 
        try {
          unsubscribe();
        } catch (e) {
          console.error("Error in unsubscribe:", e);
        }
      };
    } catch (error) {
      console.error("Error in auth state listener:", error);
      setLoading(false);
      return () => {};
    }
  }, [setAppUser]);
  
  // Handle wallet connection
  const connectWallet = (address: string) => {
    connectWalletAction(address);
    
    if (user && appUser) {
      try {
        // Update user in Firestore
        const userRef = (db as any).doc('users', user.uid);
        (db as any).setDoc(userRef, { 
          ...appUser, 
          walletConnected: true, 
          walletAddress: address 
        }, { merge: true });
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    }
  };
  
  // Handle wallet disconnection
  const disconnectWallet = () => {
    disconnectWalletAction();
    
    if (user && appUser) {
      try {
        // Update user in Firestore
        const userRef = (db as any).doc('users', user.uid);
        (db as any).setDoc(userRef, { 
          ...appUser, 
          walletConnected: false, 
          walletAddress: null 
        }, { merge: true });
      } catch (error) {
        console.error("Error disconnecting wallet:", error);
      }
    }
  };
  
  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('neural-nexus-theme', newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
    }
  };
  
  // Implement signOut method
  const signOut = async () => {
    try {
      await auth.signOut();
      // Disconnect wallet if connected
      disconnectWallet();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  // Add Web3 mock values to context
  const appContextValue = {
    user,
    appUser,
    loading,
    isWalletConnected: mockWeb3Context.isConnected,
    walletAddress: mockWeb3Context.account,
    walletBalance: mockWeb3Context.balance,
    chainId: mockWeb3Context.chainId,
    theme,
    connectWallet,
    disconnectWallet,
    toggleTheme,
    signOut,
    // Add mock web3 functionality
    userBadges: mockWeb3Context.userBadges,
    cryptoEarnings: mockWeb3Context.cryptoEarnings,
    showCryptoEarnings: mockWeb3Context.showCryptoEarnings,
    toggleCryptoEarnings: mockWeb3Context.toggleCryptoEarnings,
    isWeb3Enabled: mockWeb3Context.isWeb3Enabled,
    toggleWeb3Features: mockWeb3Context.toggleWeb3Features,
    isNFTMintingEnabled: mockWeb3Context.isNFTMintingEnabled,
    toggleNFTMinting: mockWeb3Context.toggleNFTMinting,
    isIPFSStorageEnabled: mockWeb3Context.isIPFSStorageEnabled,
    toggleIPFSStorage: mockWeb3Context.toggleIPFSStorage,
    mintNFT: mockWeb3Context.mintNFT,
    uploadToIPFS: mockWeb3Context.uploadToIPFS
  };

  return (
    <AuthProvider>
      <AppContext.Provider value={appContextValue}>
        {children}
      </AppContext.Provider>
    </AuthProvider>
  );
} 