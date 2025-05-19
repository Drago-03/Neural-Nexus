'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

// Create context for Supabase client and user
type SupabaseContextType = {
  supabase: SupabaseClient;
  user: User | null;
};

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

// Provider component to wrap around the app
export default function SupabaseProvider({ children }: { children: ReactNode }) {
  const [supabase] = useState(() => 
    createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gtqeeihydjqvidqleawe.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0cWVlaWh5ZGpxdmlkcWxlYXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDYwNTk5NTQsImV4cCI6MjAyMTYzNTk1NH0.SSUgWgNpaxwRGkbhxVCZtomk_M7jaesZ_tLCzYVn8jg'
    )
  );
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Get the current user when the component mounts
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    // Set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user);
        router.refresh();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        router.refresh();
      }
    });

    // Clean up the subscription when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  return (
    <SupabaseContext.Provider value={{ supabase, user }}>
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