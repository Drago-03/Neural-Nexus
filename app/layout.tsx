// This file needs to be a server component to export metadata
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { fontSans } from '@/lib/fonts';
import ClientLayout from './ClientLayout';
import { AIAgentProvider } from '@/providers/AIAgentProvider';

// Metadata can be exported from a Server Component
export const metadata: Metadata = {
  title: 'Neural Nexus - AI for Everyone',
  description: 'A platform for AI training and neural network experimentation',
  icons: {
    icon: '/animated-logo.gif',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <AIAgentProvider>
          <ClientLayout>{children}</ClientLayout>
        </AIAgentProvider>
      </body>
    </html>
  );
} 