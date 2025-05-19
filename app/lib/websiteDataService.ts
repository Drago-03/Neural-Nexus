/**
 * Website Data Service
 * 
 * This service helps the AI agent access content from across the website
 * to provide more accurate and contextual responses to user queries.
 */

import { faq } from '@/app/components/AIAgent/faq-data';

export interface WebsiteSection {
  title: string;
  content: string;
  url: string;
  keywords: string[];
}

// Main website content sections for AI context
const websiteContent: WebsiteSection[] = [
  {
    title: 'Homepage',
    content: 'Neural Nexus is a platform for creating, deploying, and monetizing AI models. We provide tools for developers to build cutting-edge AI applications with minimal effort. Our platform supports various model types including language models, computer vision, and multi-modal AI systems.',
    url: '/',
    keywords: ['home', 'platform', 'overview', 'about']
  },
  {
    title: 'Playground',
    content: 'The Neural Nexus Playground is an interactive development environment where you can write code, test AI models, and experiment with different features. It includes a code editor, terminal, file explorer, and real-time preview functionality. You can access the AI Assistant for help while coding.',
    url: '/playground',
    keywords: ['code', 'editor', 'development', 'ide', 'playground']
  },
  {
    title: 'Dashboard',
    content: 'The dashboard provides an overview of your projects, models, and account statistics. You can monitor usage, view analytics, and access quick links to common actions. The dashboard includes sections for revenue tracking, model performance, and collaboration tools.',
    url: '/dashboard',
    keywords: ['dashboard', 'statistics', 'overview', 'analytics']
  },
  {
    title: 'Pricing',
    content: 'Neural Nexus offers flexible pricing plans. Our starter plan is free and includes basic features. Premium plans start at $19/month with advanced AI capabilities. Enterprise plans are available for larger organizations with custom pricing. All plans include access to the playground, with varying computation limits and features.',
    url: '/pricing',
    keywords: ['price', 'plans', 'subscription', 'cost', 'billing']
  },
  {
    title: 'Authentication',
    content: 'Create an account with email/password or sign in with Google or GitHub. We support secure authentication flows and offer password recovery options. Two-factor authentication is available for added security on premium plans.',
    url: '/signin',
    keywords: ['sign in', 'login', 'account', 'signup', 'authentication']
  },
  {
    title: 'Marketplace',
    content: 'The Neural Nexus Marketplace allows you to discover, share, and monetize AI models and tools. Browse models by category, rating, or popularity. You can publish your own models for free or set pricing for premium features. The marketplace includes a review system and detailed model cards.',
    url: '/marketplace',
    keywords: ['marketplace', 'models', 'buy', 'sell', 'share']
  },
  {
    title: 'API Documentation',
    content: 'Our API allows you to integrate Neural Nexus capabilities into your applications. The documentation covers authentication, endpoints, request formats, and response handling. We provide code samples in multiple languages and interactive API testing tools.',
    url: '/api',
    keywords: ['api', 'development', 'integration', 'documentation']
  },
  {
    title: 'Model Training',
    content: 'Train custom AI models with your own data using our intuitive interface or programmatic API. We support transfer learning, fine-tuning, and training from scratch. Advanced features include hyperparameter optimization, distributed training, and model evaluation tools.',
    url: '/training',
    keywords: ['training', 'models', 'datasets', 'fine-tuning', 'machine learning']
  },
  {
    title: 'Deployment',
    content: 'Deploy models to production with a few clicks. Options include API endpoints, containerized services, or edge deployments. We handle scaling, monitoring, and reliability. Premium plans include higher availability SLAs and advanced deployment options.',
    url: '/deployment',
    keywords: ['deploy', 'production', 'hosting', 'api', 'inference']
  },
  {
    title: 'Community',
    content: 'Join our community of AI developers and enthusiasts. The forum allows you to ask questions, share projects, and collaborate with others. We host regular events, workshops, and hackathons for members to learn and network.',
    url: '/community',
    keywords: ['community', 'forum', 'collaborate', 'events', 'social']
  }
];

/**
 * Get all FAQs as structured data
 */
export function getAllFAQs() {
  return faq;
}

/**
 * Get FAQs by category
 */
export function getFAQsByCategory(category: string) {
  return faq.filter(item => item.category.toLowerCase() === category.toLowerCase());
}

/**
 * Get all website content sections
 */
export function getAllWebsiteContent() {
  return websiteContent;
}

/**
 * Search for content across the website
 */
export function searchWebsiteContent(query: string): WebsiteSection[] {
  const normalizedQuery = query.toLowerCase();
  const keywords = normalizedQuery.split(/\s+/).filter(k => k.length > 2);
  
  if (keywords.length === 0) {
    return [];
  }
  
  // Score each section based on keyword matches
  const scoredSections = websiteContent.map(section => {
    let score = 0;
    
    // Check title matches (highest priority)
    if (section.title.toLowerCase().includes(normalizedQuery)) {
      score += 10;
    }
    
    // Check content matches
    if (section.content.toLowerCase().includes(normalizedQuery)) {
      score += 5;
    }
    
    // Check for individual keyword matches
    keywords.forEach(keyword => {
      // Check in the title
      if (section.title.toLowerCase().includes(keyword)) {
        score += 3;
      }
      
      // Check in the content
      if (section.content.toLowerCase().includes(keyword)) {
        score += 2;
      }
      
      // Check in the keywords
      if (section.keywords.some(k => k.includes(keyword) || keyword.includes(k))) {
        score += 4;
      }
    });
    
    return { section, score };
  });
  
  // Filter sections with a score > 0 and sort by score
  return scoredSections
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.section);
}

/**
 * Get content for a specific topic
 */
export function getContentByTopic(topic: string): WebsiteSection | null {
  const normalizedTopic = topic.toLowerCase();
  
  // Direct match on title
  const directMatch = websiteContent.find(
    section => section.title.toLowerCase() === normalizedTopic
  );
  
  if (directMatch) {
    return directMatch;
  }
  
  // Keyword match
  const keywordMatch = websiteContent.find(
    section => section.keywords.some(k => k.toLowerCase() === normalizedTopic)
  );
  
  if (keywordMatch) {
    return keywordMatch;
  }
  
  return null;
}

/**
 * Generate context for AI responses based on query
 */
export function generateQueryContext(query: string): string {
  const relevantContent = searchWebsiteContent(query);
  
  if (relevantContent.length === 0) {
    return '';
  }
  
  // Take the top 2 most relevant sections
  const topSections = relevantContent.slice(0, 2);
  
  return topSections.map(section => 
    `${section.title}: ${section.content}`
  ).join('\n\n');
} 