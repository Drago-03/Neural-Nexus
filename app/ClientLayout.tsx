"use client";

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Toaster } from 'react-hot-toast';
import SupabaseProvider from '@/providers/SupabaseProvider';
import AuthProvider from '@/providers/AuthProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import dynamic from 'next/dynamic';
import { CoinbaseAgentProvider } from '@/providers/CoinbaseAgentProvider';
import { SimpleCryptoProvider } from '@/providers/SimpleCryptoProvider';
import AppProvider from '@/providers/AppProvider';
import { Suspense, useEffect, useState } from 'react';

// Dynamic imports to avoid SSR issues
const AgentKitUI = dynamic(() => import('@/components/AgentKitUI'), { 
  ssr: false 
});

// Completely isolated AIAgent component to avoid session provider issues
const AIAgentComponent = () => {
  // Use state to ensure this only loads on client after hydration
  const [isClient, setIsClient] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const maxRetries = 3;
  
  useEffect(() => {
    // Only set client state after a small delay to ensure hydration is complete
    const timeout = setTimeout(() => {
      setIsClient(true);
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, []);
  
  // Don't render if client-side hydration hasn't happened yet
  // or if we've hit our maximum retry count
  if (!isClient || errorCount >= maxRetries) return null;
  
  try {
    // Dynamically import component only on client side with error handling
    const DynamicAIAgent = dynamic(
      () => import('@/components/AIAgent')
        .then(mod => mod)
        .catch(err => {
          console.error('Failed to load AIAgent component:', err);
          setErrorCount(prev => prev + 1);
          return { default: () => null };
        }),
      {
        ssr: false,
        loading: () => null
      }
    );
    
    return (
      <ErrorBoundary 
        fallback={null} 
        onError={() => setErrorCount(prev => prev + 1)}
      >
        <Suspense fallback={null}>
          <DynamicAIAgent 
            systemContext="You are Neural Nexus AI, an assistant for the Neural Nexus platform. You help users with questions about AI development, the platform features, pricing, and technical support."
          />
        </Suspense>
      </ErrorBoundary>
    );
  } catch (err) {
    console.error('Error in AIAgentComponent:', err);
    setErrorCount(prev => prev + 1);
    return null;
  }
};

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

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SupabaseProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AppProvider>
            <SimpleCryptoProvider>
              <CoinbaseAgentProvider>
                <div className="relative flex min-h-screen flex-col">
                  <div className="flex-1">{children}</div>
                </div>
                <Analytics />
                <SpeedInsights />
                <Toaster position="top-center" />
                <AgentKitUI />
                <AIAgentComponent />
              </CoinbaseAgentProvider>
            </SimpleCryptoProvider>
          </AppProvider>
        </ThemeProvider>
      </SupabaseProvider>
    </AuthProvider>
  );
} 