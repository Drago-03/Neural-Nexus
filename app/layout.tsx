// This file needs to be a server component to export metadata
import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { fontSans } from '@/lib/fonts';
import ClientLayout from './ClientLayout';
import { AIAgentProvider } from '@/providers/AIAgentProvider';
import SupabaseProvider from "@/providers/SupabaseProvider";
import { ModalProvider } from "@/providers/ModalProvider";
import { AdminAuthProvider } from "@/providers/AdminAuthProvider";

// Remove the font initialization
// const inter = Inter({ subsets: ["latin"] });

// Add webpack chunk loading timeout directive - fixes chunk timeout issues
// @ts-ignore
// eslint-disable-next-line
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.__NEXT_CHUNK_LOAD_TIMEOUT__ = 120000; // 2 minutes timeout
}

// Metadata can be exported from a Server Component
export const metadata: Metadata = {
  title: 'Neural Nexus - The AI Community Hub',
  description: 'Connect with fellow AI enthusiasts, learn from experts, and stay on top of the latest developments in AI.',
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
          // Remove the inter.className reference
        )}
      >
        <SupabaseProvider>
          <AdminAuthProvider>
            <ModalProvider>
              <AIAgentProvider>
                <ClientLayout>{children}</ClientLayout>
              </AIAgentProvider>
            </ModalProvider>
          </AdminAuthProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
} 