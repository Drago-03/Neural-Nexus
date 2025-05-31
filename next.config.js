/** @type {import('next').NextConfig} */
const webpack = require('webpack');

const nextConfig = {
  // Core settings
  reactStrictMode: true,
  swcMinify: false,
  
  // Performance optimization
  distDir: '.next',
  productionBrowserSourceMaps: false,
  compress: true,
  
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
    webpackBuildWorker: true,
  },
  
  // Increase timeout for builds
  staticPageGenerationTimeout: 300,
  
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
  webpack: (config, { isEdgeRuntime, isServer, dev }) => {
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
      // Create a custom alias for timers/promises
      if (!config.resolve.alias) {
        config.resolve.alias = {};
      }
      
      // Add alias for timers/promises -> timers
      config.resolve.alias['timers/promises'] = require.resolve('./lib/polyfills/timers-promises.js');
      
      // Add all necessary Node.js polyfills
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        os: false,
        // Polyfills for MongoDB
        timers: require.resolve('timers-browserify'),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        path: require.resolve('path-browserify'),
        zlib: require.resolve('browserify-zlib'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        util: require.resolve('util/'),
        buffer: require.resolve('buffer/'),
        url: require.resolve('url/'),
        assert: require.resolve('assert/'),
        process: require.resolve('process/browser'),
      };
      
      // Add process polyfill using the directly imported webpack
      config.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        })
      );
      
      // Increase chunk loading timeout for client
      config.output.chunkLoadTimeout = 120000; // 2 minutes
      
      // Optimize chunk sizes
      if (!dev) {
        // Increase the size limits for production
        const ONE_MEGABYTE = 1024 * 1024;
        config.optimization.splitChunks = {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Make a specific chunk for big dependencies
            framework: {
              name: 'framework',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](react|react-dom|next|@vercel)[\\/]/,
              priority: 40,
              enforce: true,
            },
            // Group Web3 libraries together
            web3: {
              name: 'web3-vendors',
              test: /[\\/]node_modules[\\/](web3|ethers|viem|wagmi|@coinbase)[\\/]/,
              chunks: 'all',
              priority: 30,
            },
            // Group other larger libraries
            lib: {
              test: /[\\/]node_modules[\\/]/,
              name: 'lib',
              chunks: 'all',
              priority: 20,
            },
            // Commons chunk
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 10,
            },
          },
          maxInitialRequests: 25,
          maxAsyncRequests: 25,
          minSize: 20000,
          maxSize: ONE_MEGABYTE,
        };
      }
    }
    
    return config;
  },
  
  // Configure environment variables for build optimization
  env: {
    NEXT_CHUNK_LOAD_TIMEOUT: '120000',
  },
};

module.exports = nextConfig; 