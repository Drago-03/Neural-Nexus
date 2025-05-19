import { NextRequest, NextResponse } from 'next/server';

// Define paths that should be client-side only (no SSR)
const CLIENT_SIDE_PATHS = ['/signin', '/signup', '/auth/callback'];

/**
 * Middleware to handle authentication paths and prevent "document is not defined" errors
 * during static site generation
 */
export function middleware(request: NextRequest) {
  // Get current path
  const path = request.nextUrl.pathname;
  
  // Check if we're in the build process or using custom server
  const isBuildProcess = request.headers.get('x-is-build') === 'true';
  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';
  
  // Handle build process or static generation
  if (isBuildProcess || isBuildPhase) {
    // Skip the problematic pages during build
    if (CLIENT_SIDE_PATHS.includes(path)) {
      const staticFilePath = `${path.replace(/\/$/, '')}-static.html`;
      return NextResponse.rewrite(new URL(staticFilePath, request.url));
    }
  }
  
  // Mark client-side rendering pages
  if (CLIENT_SIDE_PATHS.includes(path)) {
    const response = NextResponse.next();
    response.headers.set('x-client-side-rendering', 'true');
    return response;
  }
  
  // For other paths, proceed normally
  return NextResponse.next();
}

// Configure middleware to run only on specified paths
export const config = {
  matcher: [
    '/signin', 
    '/signup', 
    '/auth/callback',
  ],
};

// Configure routes for this middleware - run on all routes except static files and API
export const configRoutes = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 