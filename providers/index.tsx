'use client';

import { ReactNode, useState, useEffect, Component } from 'react';
import AppProvider from './AppProvider';
// import { Web3Provider } from './Web3Provider';
import { SimpleCryptoProvider } from './SimpleCryptoProvider';
import dynamic from 'next/dynamic';

// ErrorBoundary component to catch provider errors
class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI
    console.error('Error caught by ErrorBoundary:', error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to an error reporting service
    console.error('Error details:', error);
    console.error('Component stack:', errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="web3-error-fallback">
          {this.props.children}
        </div>
      );
    }

    return this.props.children;
  }
}

// Runtime error event handler
function useGlobalErrorHandler() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error caught:', event.error);
      // Log the error but don't prevent default behavior
      // This ensures the error is also caught by the ErrorBoundary
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
}

// Import CoinbaseAgentProvider with dynamic import and strict client-side only
const CoinbaseAgentClient = dynamic(
  () => import('./CoinbaseAgentProvider').then(mod => ({ default: mod.CoinbaseAgentProvider })),
  { 
    ssr: false,
    loading: () => <>{/* Empty fragment, no loader needed */}</>
  }
);

// Client-side only provider wrapper
export default function Providers({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  
  // Set up global error handler
  useGlobalErrorHandler();
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return null;
  }
  
  return (
    <ErrorBoundary>
      <AppProvider>
        <SimpleCryptoProvider>
          <CoinbaseAgentClient>
            {children}
          </CoinbaseAgentClient>
        </SimpleCryptoProvider>
      </AppProvider>
    </ErrorBoundary>
  );
} 