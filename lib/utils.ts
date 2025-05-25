import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names and merges tailwind classes properly
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Gets the current base URL, handling both client and server environments
 */
export function getBaseUrl(): string {
  // If window is defined, we are on the client side
  if (typeof window !== 'undefined') {
    console.log("getBaseUrl - window detected, hostname:", window.location.hostname);
    
    // For local development, always use localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log("getBaseUrl - LOCALHOST detected!");
      const localUrl = `${window.location.protocol}//${window.location.host}`;
      console.log("getBaseUrl - returning localUrl:", localUrl);
      return localUrl;
    }
    
    // For deployed environments, use the current origin
    console.log("getBaseUrl - NON-LOCALHOST detected, using origin:", window.location.origin);
    return window.location.origin;
  }
  
  // Server-side: Use VERCEL_URL if available (for Vercel deployments)
  if (process.env.VERCEL_URL) {
    console.log("getBaseUrl - server side with VERCEL_URL:", process.env.VERCEL_URL);
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Fallback for other server-side environments or local server-side rendering
  const fallback = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  console.log("getBaseUrl - server side fallback:", fallback);
  return fallback;
} 