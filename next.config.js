/** @type {import('next').NextConfig} */
const nextConfig = {
  // Core settings
  reactStrictMode: false,
  swcMinify: false,
  
  // Image optimization settings
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**.arweave.net' },
      { protocol: 'https', hostname: '**.cloudinary.com' },
      { protocol: 'https', hostname: '**.ipfs.nftstorage.link' },
      { protocol: 'https', hostname: '**.ipfs.w3s.link' },
      { protocol: 'https', hostname: '**.ipfs.dweb.link' },
    ],
  },
  
  // Disable type checking and linting during build
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  
  // Middleware configuration
  experimental: {
    middlewarePrefetch: 'strict',
  },
  
  // Webpack configuration
  webpack: (config, { isEdgeRuntime }) => {
    // Handle Edge runtime (middleware)
    if (isEdgeRuntime) {
      const originalEntry = config.entry;
      
      // Handle middleware entry
      config.entry = async () => {
        const entries = await originalEntry();
        
        if (entries['middleware']) {
          console.log('Configuring webpack for middleware');
        }
        
        return entries;
      };
      
      // Force React to be empty in edge runtime
      config.resolve = {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          'react': false,
          'react-dom': false,
        },
        // Add fallbacks for Node.js modules in Edge
        fallback: {
          ...config.resolve.fallback,
          crypto: false,
          stream: false,
          fs: false,
          path: false,
          process: false,
          util: false,
          buffer: false,
          querystring: false,
        },
      };
    }
    
    return config;
  },
};

module.exports = nextConfig; 