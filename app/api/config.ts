// This config file is used to mark all API routes as dynamic at runtime
// but allow them to be built statically during the build process

// Define standard config for API routes
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60; // seconds

// Allow static generation during build
export const generateStaticParams = async () => {
  return [];
};

// Provide fallback data during build
export const fallback = {
  status: 200,
  json: () => ({ message: 'This is fallback data for build time' })
}; 