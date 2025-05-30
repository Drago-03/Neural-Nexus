'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { getBaseUrl } from '@/lib/utils';

// Create context for Supabase client and user
type SupabaseContextType = {
  supabase: SupabaseClient;
  user: User | null;
  getBaseUrl: () => string;
};

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

// Provider component to wrap around the app
export default function SupabaseProvider({ children }: { children: ReactNode }) {
  // Get environment variables with fallbacks
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gtqeeihydjqvidqleawe.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0cWVlaWh5ZGpxdmlkcWxlYXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDYwNTk5NTQsImV4cCI6MjAyMTYzNTk1NH0.SSUgWgNpaxwRGkbhxVCZtomk_M7jaesZ_tLCzYVn8jg';
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Neural Nexus';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://neuralnexus.biz';
  
  const [supabase] = useState(() => 
    createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        auth: {
          flowType: 'pkce', // Use PKCE flow for more secure auth
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          storageKey: 'neural-nexus-auth',
          storage: {
            getItem: (key) => {
              if (typeof window === 'undefined') return null;
              return window.localStorage.getItem(key);
            },
            setItem: (key, value) => {
              if (typeof window !== 'undefined') 
                window.localStorage.setItem(key, value);
            },
            removeItem: (key) => {
              if (typeof window !== 'undefined')
                window.localStorage.removeItem(key);
            },
          },
        },
        global: {
          // Set headers for better identification in Supabase logs
          headers: {
            'x-application-name': siteName,
            'x-site-url': siteUrl
          }
        }
      }
    )
  );
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Function to get the current base URL (maintains local vs production)
  // const getBaseUrl = (): string => {
  //   if (typeof window !== 'undefined') {
  //     return window.location.origin;
  //   }
  //   return '';
  // };

  useEffect(() => {
    // Get the current user when the component mounts
    const initializeAuth = async () => {
      try {
        // First check for existing session
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData?.session) {
          setUser(sessionData.session.user);
          console.log("✅ User session restored from storage");
        } else {
          console.log("⚠️ No existing session found");
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        // Set up the auth state change listener regardless of current session
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          console.log("🔄 Auth state changed:", event, session ? "session exists" : "no session");
          
          if (session) {
            setUser(session.user);
            
            // Only refresh the router on sign in to avoid unnecessary refreshes
            if (event === 'SIGNED_IN') {
              router.refresh();
            }
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            router.refresh();
          }
        });

        // Clean up the subscription when the component unmounts
        return () => {
          subscription.unsubscribe();
        };
      }
    };

    initializeAuth();
  }, [supabase, router]);

  return (
    <SupabaseContext.Provider value={{ supabase, user, getBaseUrl }}>
      {children}
    </SupabaseContext.Provider>
  );
}

// Custom hook to use the Supabase context
export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider');
  }
  return context;
} 