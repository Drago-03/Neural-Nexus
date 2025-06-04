import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names and merges tailwind classes properly
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Checks if the current environment is production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE !== 'phase-production-build';
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

/**
 * Generate username suggestions based on first name, last name, and tech/AI/web3 themes
 * @param firstName User's first name
 * @param lastName User's last name (optional)
 * @returns Array of username suggestions
 */
export function generateUsernameSuggestions(firstName: string, lastName?: string): string[] {
  // Clean and normalize the input - ensure no emojis
  const cleanFirstName = firstName.toLowerCase().trim().replace(/\s+/g, '').replace(/[^\w]/g, '');
  const cleanLastName = lastName ? lastName.toLowerCase().trim().replace(/\s+/g, '').replace(/[^\w]/g, '') : '';
  
  // Tech/AI/Web3 related terms - no emoji text
  const techTerms = [
    'ai', 'neural', 'crypto', 'web3', 'dev', 'hack', 'code', 'eth', 
    'nft', 'dao', 'defi', 'meta', 'cyber', 'quantum', 'tensor', 'node',
    'chain', 'pixel', 'data', 'byte', 'algo', 'ml', 'token', 'block'
  ];
  
  // Gaming related terms - no emoji text
  const gamingTerms = [
    'gamer', 'player', 'pro', 'boss', 'elite', 'legend', 'quest',
    'raid', 'guild', 'squad', 'team', 'arena', 'champion', 'hero', 'warrior',
    'titan', 'sniper', 'ninja', 'wizard', 'mage', 'rogue', 'tank', 'healer'
  ];
  
  // Gen-Z slang terms - no emoji text, only text that can be in usernames
  const genZTerms = [
    'vibe', 'lit', 'fire', 'yeet', 'slay', 'based', 'goat', 'savage',
    'flex', 'stan', 'mood', 'drip', 'bop', 'snack', 'cap',
    'rizz', 'bussin', 'sheesh', 'valid', 'sus', 'vibin', 'npc'
  ];
  
  // Adjectives that sound cool - no emoji text
  const adjectives = [
    'based', 'epic', 'mega', 'ultra', 'hyper', 'super', 'cyber', 'quantum', 
    'alpha', 'sigma', 'omega', 'prime', 'flux', 'neo', 'edge', 'core',
    'pro', 'max', 'elite', 'apex', 'nova', 'cosmic', 'atomic', 'digital',
    'aesthetic', 'cracked', 'clean', 'wild', 'chill', 'mint', 'pog'
  ];
  
  // Generate random numbers
  const getRandomNumber = () => Math.floor(Math.random() * 1000).toString();
  const getRandomYear = () => Math.floor(2000 + Math.random() * 30).toString();
  
  // Cool number replacements (leetspeak)
  const transformWithLeetspeak = (name: string): string => {
    return name
      .replace(/a/g, Math.random() > 0.5 ? 'a' : '4')
      .replace(/e/g, Math.random() > 0.5 ? 'e' : '3')
      .replace(/i/g, Math.random() > 0.5 ? 'i' : '1')
      .replace(/o/g, Math.random() > 0.5 ? 'o' : '0')
      .replace(/s/g, Math.random() > 0.5 ? 's' : '5')
      .replace(/t/g, Math.random() > 0.5 ? 't' : '7');
  };
  
  // Get random items from arrays
  const getRandomItem = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];
  
  // Arrays to store different categories of suggestions
  const nameBasedSuggestions: string[] = [];
  const techGamingSuggestions: string[] = [];
  
  // Generate name-based suggestions
  if (cleanFirstName && cleanLastName) {
    // First name + last name
    nameBasedSuggestions.push(`${cleanFirstName}${cleanLastName}`);
    
    // First name + last name initial + random number
    nameBasedSuggestions.push(`${cleanFirstName}${cleanLastName.charAt(0)}${getRandomNumber()}`);
    
    // First initial + last name
    nameBasedSuggestions.push(`${cleanFirstName.charAt(0)}${cleanLastName}`);
    
    // Leetspeak version of name
    nameBasedSuggestions.push(transformWithLeetspeak(`${cleanFirstName}${cleanLastName.charAt(0)}`));
    
    // First name + _ + last name
    nameBasedSuggestions.push(`${cleanFirstName}_${cleanLastName}`);
  }
  
  if (cleanFirstName) {
    // First name + random tech term
    nameBasedSuggestions.push(`${cleanFirstName}${getRandomItem(techTerms)}`);
    
    // First name + random Gen-Z term
    nameBasedSuggestions.push(`${cleanFirstName}${getRandomItem(genZTerms)}`);
    
    // First name + _ + adjective
    nameBasedSuggestions.push(`${cleanFirstName}_${getRandomItem(adjectives)}`);
    
    // First name + random year
    nameBasedSuggestions.push(`${cleanFirstName}${getRandomYear().substring(2)}`);
    
    // Random adjective + first name
    nameBasedSuggestions.push(`${getRandomItem(adjectives)}${cleanFirstName}`);
    
    // Underscore style
    nameBasedSuggestions.push(`${cleanFirstName}_${getRandomItem(genZTerms)}`);
    
    // Gaming inspired name
    nameBasedSuggestions.push(`${cleanFirstName}${getRandomItem(gamingTerms)}`);
  }
  
  // Generate tech/gaming/world inspired suggestions
  // Tech themed
  techGamingSuggestions.push(`${getRandomItem(techTerms)}${getRandomItem(adjectives)}${getRandomNumber()}`);
  techGamingSuggestions.push(`${getRandomItem(adjectives)}${getRandomItem(techTerms)}`);
  
  // Gaming themed
  techGamingSuggestions.push(`${getRandomItem(gamingTerms)}${getRandomNumber()}`);
  techGamingSuggestions.push(`${getRandomItem(adjectives)}${getRandomItem(gamingTerms)}`);
  
  // World/Pop culture themed
  techGamingSuggestions.push(`${getRandomItem(genZTerms)}${getRandomItem(adjectives)}${getRandomNumber().substring(0, 2)}`);
  techGamingSuggestions.push(`${getRandomItem(adjectives)}${getRandomItem(genZTerms)}`);
  
  // Ensure we have enough suggestions by adding more if needed
  while (nameBasedSuggestions.length < 8) {
    const term1 = Math.random() > 0.5 ? getRandomItem(techTerms) : getRandomItem(genZTerms);
    const term2 = Math.random() > 0.5 ? getRandomItem(adjectives) : getRandomItem(gamingTerms);
    const randomNum = getRandomNumber();
    
    nameBasedSuggestions.push(`${cleanFirstName}${term1}${randomNum.substring(0, 2)}`);
  }
  
  while (techGamingSuggestions.length < 8) {
    const term1 = Math.random() > 0.5 ? getRandomItem(techTerms) : getRandomItem(gamingTerms);
    const term2 = Math.random() > 0.5 ? getRandomItem(adjectives) : getRandomItem(genZTerms);
    const randomNum = getRandomNumber();
    
    techGamingSuggestions.push(`${term1}${term2}${randomNum.substring(0, 2)}`);
  }
  
  // Final sanitization to ensure no emojis or special characters
  const sanitizeUsername = (username: string): string => {
    return username.replace(/[^\w_]/g, ''); // Only allow alphanumeric and underscore
  };
  
  // Shuffle both arrays for variety and sanitize them
  const shuffledNameBased = Array.from(new Set(nameBasedSuggestions))
    .map(sanitizeUsername)
    .filter(Boolean) // Remove any empty strings after sanitization
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);  // Take 3 name-based suggestions
    
  const shuffledTechGaming = Array.from(new Set(techGamingSuggestions))
    .map(sanitizeUsername)
    .filter(Boolean) // Remove any empty strings after sanitization
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);  // Take 3 tech/gaming suggestions
  
  // Combine both types of suggestions
  return [...shuffledNameBased, ...shuffledTechGaming];
} 