"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Toaster } from 'react-hot-toast';
import SupabaseProvider from '@/providers/SupabaseProvider';
import AuthProvider from '@/providers/AuthProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import dynamic from 'next/dynamic';
import AppProvider from '@/providers/AppProvider';

// Add webpack chunk loading timeout directive - fixes chunk timeout issues
// @ts-ignore
// eslint-disable-next-line
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.__NEXT_CHUNK_LOAD_TIMEOUT__ = 120000; // 2 minutes timeout
}

// Lazy load heavy components
const AgentKitUI = dynamic(() => import('@/components/AgentKitUI'), { 
  ssr: false,
  loading: () => null
});

// Lazy load providers that aren't essential for initial render
const CoinbaseAgentProvider = dynamic(() => import('@/providers/CoinbaseAgentProvider').then(mod => mod.CoinbaseAgentProvider), {
  ssr: false,
  loading: () => null
});

const SimpleCryptoProvider = dynamic(() => import('@/providers/SimpleCryptoProvider').then(mod => mod.SimpleCryptoProvider), {
  ssr: false,
  loading: () => null
});

// Simple error boundary component
class ErrorBoundary extends React.Component<{
  children: React.ReactNode;
  fallback: React.ReactNode;
  onError?: () => void;
}> {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  componentDidCatch(error: any, info: any) {
    console.error('Error in ErrorBoundary:', error, info);
    
    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError();
    }
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Lazy load AIAgent component with a delay to avoid blocking initial render
const AIAgentComponent = () => {
  const [shouldLoadAgent, setShouldLoadAgent] = useState(false);
  
  useEffect(() => {
    // Delay loading of AIAgent until after initial render is complete
    const timer = setTimeout(() => {
      setShouldLoadAgent(true);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!shouldLoadAgent) return null;
  
  const DynamicAIAgent = dynamic(() => import('@/components/AIAgent'), { 
    ssr: false,
    loading: () => null
  });
  
  return (
    <ErrorBoundary fallback={null}>
      <Suspense fallback={null}>
        <DynamicAIAgent 
          systemContext="You are Neural Nexus AI, an assistant for the Neural Nexus platform. You help users with questions about AI development, the platform features, pricing, and technical support."
        />
      </Suspense>
    </ErrorBoundary>
  );
};

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <AppProvider>
          <div className="relative flex min-h-screen flex-col">
            <div className="flex-1">{children}</div>
          </div>
          <Analytics />
          <SpeedInsights />
          <Toaster position="top-center" />
          
          {/* Lazy-loaded non-critical components */}
          <Suspense fallback={null}>
            <AgentKitUI />
          </Suspense>
          
          <Suspense fallback={null}>
            <AIAgentComponent />
          </Suspense>
        </AppProvider>
      </ThemeProvider>
    </AuthProvider>
  );
} 