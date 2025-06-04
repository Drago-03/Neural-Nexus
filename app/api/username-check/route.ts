import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/lib/models/user';

// Force Node.js runtime for this route
export const runtime = 'nodejs';

// Add dynamic export configuration
export const dynamic = 'force-dynamic';

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
    
    // Check if username is available
    const isAvailable = await UserService.isUsernameAvailable(username);
    
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
    
    // Import the generateUsernameSuggestions function
    const { generateUsernameSuggestions } = await import('@/lib/utils');
    
    // Generate username suggestions - get more than we need since we'll filter
    const suggestions = generateUsernameSuggestions(firstName, lastName);
    
    // Filter out excluded usernames
    const filteredSuggestions = suggestions.filter(
      suggestion => !exclude.includes(suggestion)
    );

    let availableSuggestions: string[] = [];
    
    try {
      // Check availability for each suggestion in parallel (up to 10 at a time)
      const availabilityChecks = await Promise.allSettled(
        filteredSuggestions.slice(0, 15).map(async (username) => {
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
      
      // Filter to only available usernames and handle promises that may have rejected
      availableSuggestions = availabilityChecks
        .filter(result => result.status === 'fulfilled' && (result.value as any).available)
        .map(result => (result.status === 'fulfilled' ? (result.value as any).username : null))
        .filter(username => username !== null);
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
    
    return NextResponse.json({
      suggestions: availableSuggestions.slice(0, 6) // Return top 6 available suggestions
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