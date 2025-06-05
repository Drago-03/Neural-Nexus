import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/lib/models/user';

// Add static export configuration at the top
export const dynamic = 'force-dynamic';

// Force Node.js runtime for this route
export const runtime = 'nodejs';

// Simple in-memory cache for username availability results
const usernameCache = new Map<string, {available: boolean, timestamp: number}>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Simple in-memory cache for username suggestions
const suggestionCache = new Map<string, {suggestions: string[], timestamp: number}>();
const SUGGESTION_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

/**
 * GET handler for /api/username-check
 * Checks if a username is available
 */
export async function GET(req: NextRequest) {
  try {
    // Get username from query params
    const url = new URL(req.url);
    const username = url.searchParams.get('username');
    
    if (!username) {
      return NextResponse.json(
        { error: 'Username parameter is required' },
        { status: 400 }
      );
    }
    
    const normalizedUsername = username.toLowerCase();
    
    // Check cache first
    const now = Date.now();
    const cachedResult = usernameCache.get(normalizedUsername);
    
    if (cachedResult && (now - cachedResult.timestamp) < CACHE_TTL) {
      console.log(`Cache hit for username: ${normalizedUsername}`);
      return NextResponse.json({
        username,
        available: cachedResult.available,
        fromCache: true
      });
    }
    
    // Check if username is available
    const isAvailable = await UserService.isUsernameAvailable(normalizedUsername);
    
    // Cache the result
    usernameCache.set(normalizedUsername, {
      available: isAvailable,
      timestamp: now
    });
    
    // Clean up old cache entries periodically
    if (usernameCache.size > 1000) {
      // Remove expired entries if cache gets too big
      for (const [key, value] of usernameCache.entries()) {
        if (now - value.timestamp > CACHE_TTL) {
          usernameCache.delete(key);
        }
      }
    }
    
    return NextResponse.json({
      username,
      available: isAvailable
    });
    
  } catch (error: any) {
    console.error('Error checking username availability:', error);
    
    return NextResponse.json({
      error: `Failed to check username availability: ${error.message || 'Unknown error'}`,
      available: false
    }, {
      status: 500
    });
  }
}

/**
 * POST handler for /api/username-check/suggestions
 * Generates username suggestions and checks their availability
 */
export async function POST(req: NextRequest) {
  try {
    // Get first name and last name from request body
    const body = await req.json();
    const { firstName, lastName, exclude = [] } = body;
    
    if (!firstName) {
      return NextResponse.json(
        { error: 'First name is required' },
        { status: 400 }
      );
    }
    
    // Create cache key based on firstName and lastName
    const cacheKey = `${firstName.toLowerCase()}_${(lastName || '').toLowerCase()}`;
    
    // Check cache first
    const now = Date.now();
    const cachedResult = suggestionCache.get(cacheKey);
    
    if (cachedResult && (now - cachedResult.timestamp) < SUGGESTION_CACHE_TTL) {
      console.log(`Cache hit for username suggestions: ${cacheKey}`);
      // Filter out any excluded usernames from the cached suggestions
      const filteredSuggestions = cachedResult.suggestions.filter(
        suggestion => !exclude.includes(suggestion)
      );
      
      return NextResponse.json({
        suggestions: filteredSuggestions.slice(0, 6),
        fromCache: true
      });
    }
    
    // Import the generateUsernameSuggestions function
    const { generateUsernameSuggestions } = await import('@/lib/utils');
    
    // Generate username suggestions - get more than we need since we'll filter
    const suggestions = generateUsernameSuggestions(firstName, lastName);
    
    // Filter out excluded usernames
    const filteredSuggestions = suggestions.filter(
      suggestion => !exclude.includes(suggestion)
    );

    // Limit the number of availability checks to improve performance
    const suggestionsToCheck = filteredSuggestions.slice(0, 10);
    let availableSuggestions: string[] = [];
    
    try {
      // Check availability for each suggestion in parallel (up to 10 at a time)
      const availabilityChecks = await Promise.all(
        suggestionsToCheck.map(async (username) => {
          try {
            const isAvailable = await UserService.isUsernameAvailable(username);
            return {
              username,
              available: isAvailable
            };
          } catch (error) {
            console.error(`Error checking availability for username ${username}:`, error);
            // Consider all suggestions available when we can't check them
            return {
              username,
              available: true // Assume available if we can't check
            };
          }
        })
      );
      
      // Filter to only available usernames
      availableSuggestions = availabilityChecks
        .filter(result => result.available)
        .map(result => result.username);
    } catch (error) {
      console.error('Error checking username availability:', error);
      // Fallback: Just return some of the generated suggestions
      availableSuggestions = filteredSuggestions.slice(0, 5);
    }
    
    // If we still don't have enough suggestions, use a random selection from the generated ones
    if (availableSuggestions.length < 6) {
      // Shuffle remaining suggestions
      const remainingSuggestions = filteredSuggestions
        .filter(s => !availableSuggestions.includes(s))
        .sort(() => Math.random() - 0.5);
      
      // Add enough random suggestions to have at least 6
      availableSuggestions = [
        ...availableSuggestions,
        ...remainingSuggestions.slice(0, 6 - availableSuggestions.length)
      ];
    }
    
    // Cache the result
    const finalSuggestions = availableSuggestions.slice(0, 6);
    suggestionCache.set(cacheKey, {
      suggestions: finalSuggestions,
      timestamp: now
    });
    
    // Clean up old cache entries periodically
    if (suggestionCache.size > 500) {
      for (const [key, value] of suggestionCache.entries()) {
        if (now - value.timestamp > SUGGESTION_CACHE_TTL) {
          suggestionCache.delete(key);
        }
      }
    }
    
    return NextResponse.json({
      suggestions: finalSuggestions
    });
    
  } catch (error: any) {
    console.error('Error generating username suggestions:', error);
    
    // Sanitize username function to ensure no emojis or special characters
    const sanitizeUsername = (username: string): string => {
      return username.replace(/[^\w_]/g, ''); // Only allow alphanumeric and underscore
    };
    
    // Create a mix of tech and gaming-themed fallback suggestions with no emojis
    const techPrefixes = ['tech', 'dev', 'code', 'cyber', 'data', 'pixel', 'ai', 'web3'];
    const gamingPrefixes = ['gamer', 'player', 'elite', 'pro', 'legend', 'champion', 'titan'];
    
    const getRandomNumber = () => Math.floor(1000 + Math.random() * 9000);
    const getRandomItem = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    
    // Generate fallback suggestions and sanitize them
    const fallbackSuggestions = [
      // Tech-themed suggestions
      sanitizeUsername(`${getRandomItem(techPrefixes)}${getRandomNumber()}`),
      sanitizeUsername(`${getRandomItem(techPrefixes)}${getRandomNumber()}`),
      sanitizeUsername(`${getRandomItem(techPrefixes)}${getRandomNumber()}`),
      
      // Gaming-themed suggestions
      sanitizeUsername(`${getRandomItem(gamingPrefixes)}${getRandomNumber()}`),
      sanitizeUsername(`${getRandomItem(gamingPrefixes)}${getRandomNumber()}`),
      sanitizeUsername(`${getRandomItem(gamingPrefixes)}${getRandomNumber()}`)
    ];
    
    return NextResponse.json({
      suggestions: fallbackSuggestions
    });
  }
} 