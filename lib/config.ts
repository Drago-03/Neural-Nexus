/**
 * Configuration file for Neural Nexus
 * Centralizes access to environment variables and defaults
 */

export const config = {
  // App
  appName: process.env.NEXT_PUBLIC_SITE_NAME || 'Neural Nexus',
  appUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  environment: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  
  // Auth
  nextAuthSecret: process.env.NEXTAUTH_SECRET || 'your-dev-secret-do-not-use-in-production',
  nextAuthUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  
  // Supabase
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    projectId: process.env.SUPABASE_PROJECT_ID || '',
    accessToken: process.env.SUPABASE_ACCESS_TOKEN || '',
  },
  
  // MongoDB
  mongodb: {
    uri: process.env.MONGODB_URI || '',
    dbName: process.env.MONGODB_DB_NAME || 'neural_nexus',
  },
  
  // Google Cloud Storage
  googleCloud: {
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'gleaming-scene-462006-m9',
    storageBucket: process.env.GOOGLE_CLOUD_STORAGE_BUCKET || 'neural-nexus-app',
    clientEmail: process.env.GOOGLE_CLOUD_CLIENT_EMAIL || 'neural-nexus@gleaming-scene-462006-m9.iam.gserviceaccount.com',
    accessKey: process.env.GOOGLE_CLOUD_ACCESS_KEY || '',
    secretKey: process.env.GOOGLE_CLOUD_SECRET_KEY || '',
    privateKey: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
  },
  
  // Firebase (Legacy support)
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
    useEmulators: process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true',
  },
  
  // Feature flags
  features: {
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    maintenanceMode: process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true',
    userRegistration: process.env.NEXT_PUBLIC_ENABLE_USER_REGISTRATION !== 'false',
    modelUploads: process.env.NEXT_PUBLIC_ENABLE_MODEL_UPLOADS !== 'false',
    useSupabaseAuth: process.env.NEXT_PUBLIC_USE_SUPABASE_AUTH !== 'false',
    fallbackToFirebase: process.env.NEXT_PUBLIC_FALLBACK_TO_FIREBASE === 'true',
    simpleCrypto: process.env.NEXT_PUBLIC_ENABLE_SIMPLE_CRYPTO === 'true',
  },
  
  // Payments
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    priceIds: {
      basic: process.env.STRIPE_PRICE_ID_BASIC || '',
      pro: process.env.STRIPE_PRICE_ID_PRO || '',
      enterprise: process.env.STRIPE_PRICE_ID_ENTERPRISE || '',
    },
  },
  
  paypal: {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
    clientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
    webhookId: process.env.PAYPAL_WEBHOOK_ID || '',
  },
  
  coinbase: {
    apiKey: process.env.NEXT_PUBLIC_COINBASE_API_KEY || '',
    webhookSecret: process.env.NEXT_PUBLIC_COINBASE_WEBHOOK_SECRET || '',
  },
  
  // Email
  email: {
    serverHost: process.env.EMAIL_SERVER_HOST || '',
    serverPort: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
    serverUser: process.env.EMAIL_SERVER_USER || '',
    serverPassword: process.env.EMAIL_SERVER_PASSWORD || '',
    from: process.env.EMAIL_FROM || 'noreply@example.com',
  },
  
  // OAuth
  oauth: {
    github: {
      id: process.env.GITHUB_ID || '',
      secret: process.env.GITHUB_SECRET || '',
    },
    google: {
      id: process.env.GOOGLE_CLIENT_ID || '',
      secret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
  },
  
  // ReCAPTCHA
  recaptcha: {
    siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '',
  },
};

export default config; 