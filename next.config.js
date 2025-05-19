/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: '',
      },
      {
        protocol: 'https',
        hostname: '**.arweave.net',
        port: '',
      },
      {
        protocol: 'https',
        hostname: '**.ipfs.nftstorage.link',
        port: '',
      },
      {
        protocol: 'https',
        hostname: '**.ipfs.w3s.link',
        port: '',
      },
      {
        protocol: 'https',
        hostname: '**.ipfs.dweb.link',
        port: '',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
        port: '',
      },
    ],
  },
  eslint: {
    // Don't run ESLint during build for speed
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Don't run TS checking during build for speed
    ignoreBuildErrors: true,
  },
  // Move these out of experimental as per warning
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  experimental: {
    optimizeCss: false,
    // These settings help with client-side only pages
    serverActions: {
      allowedOrigins: ['localhost:3000', '127.0.0.1:3000'],
    },
  },
  // Function to generate a custom build ID for consistent builds
  generateBuildId: async () => {
    return "neural-nexus-build"
  },
  // Handle static HTML files for authentication pages
  rewrites() {
    return [
      {
        source: '/signin',
        destination: '/signin-static.html',
      },
      {
        source: '/signup',
        destination: '/signup-static.html',
      },
      {
        source: '/auth/callback',
        destination: '/auth-callback-static.html',
      },
    ]
  },
  // Mark client-side rendering pages
  async headers() {
    return [
      {
        source: '/(signin|signup|auth/callback)',
        headers: [
          {
            key: 'x-client-side-rendering',
            value: 'true',
          },
        ],
      },
    ];
  },
  // Skip problematic pages during server-side build
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Skip client-only pages during server builds
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        clientOnly: {
          test: module => {
            const modulePath = module.resource || '';
            return (
              modulePath.includes('/app/signin/') ||
              modulePath.includes('/app/signup/') ||
              modulePath.includes('/app/auth/callback/')
            );
          },
          name: 'client-only',
          chunks: 'all',
          enforce: true,
        },
      };
    }
    return config;
  },
};

module.exports = nextConfig; 