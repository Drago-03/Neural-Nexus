import { Session } from 'next-auth';

// Define types for the AI Agent service
export type AgentRole = 'user' | 'agent' | 'system';

export interface AgentMessage {
  id: string;
  role: AgentRole;
  content: string;
  timestamp: Date;
}

export interface AgentQuery {
  query: string;
  history?: AgentMessage[];
  userData?: {
    userId?: string;
    email?: string;
    name?: string;
    isLoggedIn: boolean;
  };
}

export interface AgentResponsePayload {
  message: string;
  suggestedActions?: Array<{
    type: string;
    label: string;
    value: string;
  }>;
  links?: Array<{
    url: string;
    label: string;
  }>;
  additionalContext?: Record<string, any>;
}

export interface WebsiteContent {
  pagePath: string;
  title: string;
  content: string;
  lastUpdated?: Date;
}

// Mock database of website content the agent can access
const websiteContent: WebsiteContent[] = [
  {
    pagePath: '/',
    title: 'Neural Nexus - Home',
    content: 'Neural Nexus is a platform for AI developers to create, share, and monetize machine learning models. Our marketplace connects AI creators with businesses and developers who need AI solutions.',
    lastUpdated: new Date('2023-12-01')
  },
  {
    pagePath: '/marketplace',
    title: 'Neural Nexus - Marketplace',
    content: 'Browse AI models, tools, and datasets from leading developers. Find solutions for computer vision, NLP, audio processing, and more. All models are rigorously tested and rated by our community.',
    lastUpdated: new Date('2023-11-15')
  },
  {
    pagePath: '/dashboard',
    title: 'Neural Nexus - Dashboard',
    content: 'Manage your AI models, track performance metrics, view sales statistics, and access your API keys. The dashboard provides a comprehensive view of your Neural Nexus activities.',
    lastUpdated: new Date('2023-12-10')
  },
  {
    pagePath: '/pricing',
    title: 'Neural Nexus - Pricing',
    content: 'Neural Nexus offers flexible pricing tiers for both creators and users. Creators can set their own pricing models, and users can purchase one-time access or subscriptions.',
    lastUpdated: new Date('2023-10-20')
  },
  {
    pagePath: '/api-docs',
    title: 'Neural Nexus - API Documentation',
    content: 'Comprehensive documentation for the Neural Nexus API. Learn how to integrate our models into your applications, authenticate requests, handle responses, and implement webhooks.',
    lastUpdated: new Date('2023-11-30')
  }
];

// Frequently asked questions
export const agentFAQs = [
  {
    question: "What is Neural Nexus?",
    answer: "Neural Nexus is a platform for AI developers to create, share, and monetize their machine learning models. It provides tools for model development, deployment, and marketplace integration.",
    category: "general"
  },
  {
    question: "How do I upload a model?",
    answer: "To upload a model, navigate to the dashboard, click on 'Upload Model' and follow the step-by-step process to provide model details, upload files, and set pricing.",
    category: "models"
  },
  {
    question: "How do payments work?",
    answer: "We support crypto payments through our Web3 integration as well as traditional payment methods. Creators receive 85% of sales revenue, with payouts processed weekly.",
    category: "payments"
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we use end-to-end encryption and follow industry best practices for data security. Your models and personal information are protected with state-of-the-art security measures.",
    category: "security"
  },
  {
    question: "Can I try before buying?",
    answer: "Many models offer a limited free tier or trial version. Look for the 'Try' button on model listings to test capabilities before purchasing.",
    category: "marketplace"
  },
  {
    question: "How do I get API keys?",
    answer: "API keys can be generated from your dashboard under the 'API Keys' tab. You can create, manage, and revoke keys as needed for different applications.",
    category: "api"
  },
  {
    question: "What AI technologies are supported?",
    answer: "We support a wide range of AI technologies including neural networks, transformers, computer vision models, NLP, reinforcement learning, and more.",
    category: "technical"
  },
  {
    question: "How do I connect my wallet?",
    answer: "Click on the Connect Wallet button in the top navigation bar, and select your preferred Web3 wallet. We support MetaMask, Coinbase Wallet, and WalletConnect.",
    category: "web3"
  },
  {
    question: "What are the system requirements?",
    answer: "For basic usage, a modern web browser and internet connection are sufficient. For model development, requirements vary by model type, but we recommend at least 8GB RAM and a compatible GPU for training.",
    category: "technical"
  },
  {
    question: "How do I become a verified developer?",
    answer: "Verified developer status is awarded to creators with a history of high-quality models, positive reviews, and consistent sales. To apply, you must have at least 3 published models with an average rating of 4+ stars.",
    category: "creators"
  },
  {
    question: "What file formats do you support?",
    answer: "We support common model formats including ONNX, TensorFlow SavedModel, PyTorch JIT, and custom containers. For datasets, we support CSV, JSON, parquet, and structured data archives.",
    category: "technical"
  },
  {
    question: "How long does verification take?",
    answer: "Model verification typically takes 1-3 business days, depending on complexity and queue volume. We thoroughly test each model for security, performance, and compliance with our guidelines.",
    category: "models"
  }
];

// AI Agent service
export class AIAgentService {
  private static instance: AIAgentService;
  
  private constructor() {}
  
  // Singleton pattern
  public static getInstance(): AIAgentService {
    if (!AIAgentService.instance) {
      AIAgentService.instance = new AIAgentService();
    }
    return AIAgentService.instance;
  }
  
  // Process user query
  public async processQuery(query: AgentQuery): Promise<AgentResponsePayload> {
    // In a real implementation, this would call a backend API or a hosted LLM
    // For this demo, we'll implement simple intent recognition and response generation
    
    const normalizedQuery = query.query.toLowerCase();
    
    // Check FAQs first
    const matchingFAQ = this.checkFAQs(normalizedQuery);
    if (matchingFAQ) {
      return {
        message: matchingFAQ.answer,
        suggestedActions: [
          { type: 'related', label: 'Tell me more about this', value: `Tell me more about ${matchingFAQ.category}` },
          { type: 'navigate', label: 'Related documentation', value: `/docs/${matchingFAQ.category}` }
        ]
      };
    }
    
    // Check website content
    const contentMatch = this.checkWebsiteContent(normalizedQuery);
    if (contentMatch) {
      return {
        message: `I found some information that might help: ${contentMatch.content}`,
        links: [
          { url: contentMatch.pagePath, label: `View ${contentMatch.title}` }
        ]
      };
    }
    
    // Intent-based responses
    if (this.checkIntent(normalizedQuery, ['upload', 'create', 'publish', 'model'])) {
      return {
        message: "To upload a model to Neural Nexus, sign in to your account, navigate to the Dashboard, and click the 'Upload Model' button. You'll need to provide model details, documentation, performance metrics, and set your pricing model. After submission, our team will review your model for quality and security before publishing it to the marketplace.",
        suggestedActions: [
          { type: 'navigate', label: 'Go to Dashboard', value: '/dashboard' },
          { type: 'document', label: 'View upload guidelines', value: '/docs/model-upload-guidelines' }
        ]
      };
    }
    
    if (this.checkIntent(normalizedQuery, ['price', 'cost', 'billing', 'subscription', 'payment'])) {
      return {
        message: "Neural Nexus offers several pricing options. For model creators, we charge a 15% commission on sales. For users, prices depend on the specific models you use - creators set their own pricing, which can be pay-per-call, subscription-based, or one-time purchases. We support both traditional payment methods and cryptocurrency transactions.",
        links: [
          { url: '/pricing', label: 'View Pricing Details' }
        ]
      };
    }
    
    if (this.checkIntent(normalizedQuery, ['api', 'integration', 'code', 'implement'])) {
      return {
        message: "Neural Nexus provides a comprehensive REST API for integrating our models into your applications. You'll need an API key from your dashboard to authenticate requests. Our SDK is available for JavaScript, Python, Java, and Go. Check our API documentation for detailed guides, code samples, and best practices.",
        links: [
          { url: '/api-docs', label: 'View API Documentation' }
        ],
        additionalContext: {
          sampleCode: 'const client = new NeuralNexusClient(apiKey);\nconst result = await client.predict("model-id", { input: "your data" });'
        }
      };
    }
    
    if (this.checkIntent(normalizedQuery, ['account', 'signup', 'register', 'login', 'signin'])) {
      return {
        message: "Creating a Neural Nexus account is simple! Click the 'Sign Up' button in the top navigation bar and follow the instructions. We offer email registration as well as social login options through GitHub and Google. Once registered, you can access the dashboard, marketplace, and developer tools.",
        suggestedActions: [
          { type: 'navigate', label: 'Sign Up', value: '/signup' },
          { type: 'navigate', label: 'Sign In', value: '/signin' }
        ]
      };
    }
    
    // Generate a generic response if no specific intent is matched
    return {
      message: this.generateGenericResponse(normalizedQuery),
      suggestedActions: [
        { type: 'navigate', label: 'Explore Marketplace', value: '/marketplace' },
        { type: 'navigate', label: 'View Documentation', value: '/docs' }
      ]
    };
  }
  
  // Check if a query matches any FAQs
  private checkFAQs(query: string) {
    return agentFAQs.find(faq => 
      faq.question.toLowerCase().includes(query) || 
      query.includes(faq.question.toLowerCase()) ||
      query.includes(faq.category.toLowerCase())
    );
  }
  
  // Check if a query relates to website content
  private checkWebsiteContent(query: string) {
    return websiteContent.find(page => {
      const content = page.content.toLowerCase();
      const title = page.title.toLowerCase();
      return content.includes(query) || title.includes(query);
    });
  }
  
  // Check if a query contains any of the given intent keywords
  private checkIntent(query: string, keywords: string[]): boolean {
    return keywords.some(keyword => query.includes(keyword.toLowerCase()));
  }
  
  // Generate a generic response for queries without specific matches
  private generateGenericResponse(query: string): string {
    const responses = [
      "I understand you're asking about " + query + ". Neural Nexus offers comprehensive tools for AI model development and monetization. Could you provide more details about what specific information you're looking for?",
      "Thanks for your question about " + query + ". Neural Nexus is a platform that connects AI creators with users. Would you like to know more about our features, pricing, or community?",
      "I'd be happy to help with your question about " + query + ". Neural Nexus provides tools for creating, sharing, and monetizing AI models. Can you tell me more about what you're trying to accomplish?",
      "That's an interesting question about " + query + ". Neural Nexus supports various AI technologies and use cases. Is there a specific aspect of our platform you'd like to learn more about?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Log user interaction for analytics and training (in a real implementation)
  public logInteraction(query: string, response: string, userId?: string): void {
    // In a production environment, this would send data to an analytics service
    console.log(`[AI Agent Log] User${userId ? ' ' + userId : ''} - Query: ${query} - Response: ${response}`);
  }
} 