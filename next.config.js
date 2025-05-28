/** @type {import('next').NextConfig} */
const nextConfig = {
  // Core settings
  reactStrictMode: true,
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
    domains: [
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
      'res.cloudinary.com',
      'images.unsplash.com',
      'randomuser.me',
      'github.com',
      'placehold.co',
      'cdn.pixabay.com'
    ],
  },
  
  // Disable type checking and linting during build
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  
  // Middleware configuration
  experimental: {
    middlewarePrefetch: 'flexible',
    serverComponentsExternalPackages: ['mongodb'],
  },
  
  // Increase timeout for builds
  staticPageGenerationTimeout: 120,
  
  // Configure headers for API routes
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ]
  },
  
  // Configure redirects
  async redirects() {
    return [
      {
        source: '/github',
        destination: 'https://github.com/Drago-03/Neural-Nexus',
        permanent: false,
      },
    ]
  },
  
  // Webpack configuration
  webpack: (config, { isEdgeRuntime, isServer }) => {
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
    
    // Fix for MongoDB 5.0+ issues
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
      };
    }
    
    return config;
  },
};

module.exports = nextConfig; 