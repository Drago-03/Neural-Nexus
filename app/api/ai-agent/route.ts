import { NextRequest, NextResponse } from 'next/server';
import { faq } from '@/app/components/AIAgent/faq-data';
import { searchWebsiteContent, generateQueryContext } from '@/app/lib/websiteDataService';

// In a production app, this would connect to an actual AI service
// For now, we'll create a simulated AI response system

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface RequestData {
  messages: Message[];
  searchContext?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const data: RequestData = await request.json();
    
    if (!data.messages || !Array.isArray(data.messages)) {
      return NextResponse.json(
        { error: 'Invalid request format. Expected a messages array.' },
        { status: 400 }
      );
    }
    
    // Get the latest user message
    const lastUserMessage = [...data.messages].reverse().find(msg => msg.role === 'user');
    
    if (!lastUserMessage) {
      return NextResponse.json(
        { error: 'No user message found in the conversation.' },
        { status: 400 }
      );
    }
    
    // Check if this is a FAQ
    const faqResponse = findFaqMatch(lastUserMessage.content);
    if (faqResponse) {
      return NextResponse.json({
        response: faqResponse,
        source: 'faq',
        confidence: 0.95
      });
    }
    
    // Search website content for context
    const websiteContext = generateQueryContext(lastUserMessage.content);
    
    // Add additional context from search if provided
    let context = websiteContext;
    if (data.searchContext && data.searchContext.length > 0) {
      context += `\n\nAdditional context: ${data.searchContext.join(' ')}`;
    }
    
    // Process the query based on keywords
    const response = await processUserQuery(lastUserMessage.content, data.messages, context);
    
    // Get any website sections that might be relevant
    const relevantSections = searchWebsiteContent(lastUserMessage.content);
    const relatedLinks = relevantSections.slice(0, 3).map(section => ({
      title: section.title,
      url: section.url
    }));
    
    return NextResponse.json({
      response,
      source: 'ai',
      confidence: 0.85,
      relatedLinks: relatedLinks.length > 0 ? relatedLinks : undefined
    });
    
  } catch (error) {
    console.error('Error processing AI agent request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

// Find matching FAQ if available
function findFaqMatch(query: string): string | null {
  const normalizedQuery = query.toLowerCase();
  
  // Exact match
  const exactMatch = faq.find(item => 
    item.question.toLowerCase() === normalizedQuery
  );
  
  if (exactMatch) {
    return exactMatch.answer;
  }
  
  // Fuzzy match - look for keywords
  const keywords = normalizedQuery.split(/\s+/);
  
  // Score each FAQ based on keyword matches
  const scoredFaqs = faq.map(item => {
    const questionLower = item.question.toLowerCase();
    const answerLower = item.answer.toLowerCase();
    
    let score = 0;
    keywords.forEach(keyword => {
      if (keyword.length < 3) return; // Ignore very short words
      
      if (questionLower.includes(keyword)) {
        score += 2; // Higher weight for question matches
      }
      
      if (answerLower.includes(keyword)) {
        score += 1; // Lower weight for answer matches
      }
    });
    
    return { faq: item, score };
  });
  
  // Sort by score and get the best match
  scoredFaqs.sort((a, b) => b.score - a.score);
  
  // Return the best match if it has a minimum score
  if (scoredFaqs.length > 0 && scoredFaqs[0].score >= 3) {
    return scoredFaqs[0].faq.answer;
  }
  
  return null;
}

// Generate response based on query
async function processUserQuery(query: string, messages: Message[], context?: string): Promise<string> {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const normalizedQuery = query.toLowerCase();
  
  // Enhance responses with context if available
  const contextPrefix = context ? "Based on our platform information: " : "";
  
  // Check for specific topics and provide tailored responses
  if (normalizedQuery.includes('pricing') || normalizedQuery.includes('cost') || normalizedQuery.includes('price')) {
    return `${contextPrefix}Neural Nexus offers flexible pricing plans. Our starter plan is free and includes basic features. Premium plans start at $19/month with advanced AI capabilities and higher usage limits. Enterprise plans are available for larger organizations with custom pricing. You can find more details on our pricing page.`;
  } 
  else if (normalizedQuery.includes('account') || normalizedQuery.includes('sign up') || normalizedQuery.includes('login')) {
    return `${contextPrefix}You can create an account by clicking the 'Sign Up' button in the top navigation bar. If you already have an account, use the 'Sign In' button. We support email/password authentication as well as Google and GitHub sign-in options for faster access.`;
  }
  else if (normalizedQuery.includes('api') || normalizedQuery.includes('integration')) {
    return `${contextPrefix}Neural Nexus provides a comprehensive API for integrating our AI capabilities into your applications. You can find documentation and API keys in your dashboard after signing in. Our REST API supports various endpoints for different AI functionalities, and we provide SDKs for popular programming languages like Python, JavaScript, Java, and Go.`;
  }
  else if (normalizedQuery.includes('model') || normalizedQuery.includes('train') || normalizedQuery.includes('upload')) {
    return `${contextPrefix}You can upload and train your own AI models on our platform. Go to the 'Models' section in your dashboard, click 'Upload New Model' and follow the instructions. We support various model formats including PyTorch, TensorFlow, and ONNX. For training, you can use our intuitive UI or programmatic API, with options for transfer learning and fine-tuning on your custom datasets.`;
  }
  else if (normalizedQuery.includes('help') || normalizedQuery.includes('support') || normalizedQuery.includes('contact')) {
    return `${contextPrefix}Our support team is available 24/7 to help you with any questions or issues. You can reach us through the 'Contact Support' button in your dashboard, or email support@neuralnexus.ai. We also have an extensive documentation section and community forums where you can find answers to common questions and connect with other developers.`;
  }
  else if (normalizedQuery.includes('playground') || normalizedQuery.includes('code') || normalizedQuery.includes('editor')) {
    return `${contextPrefix}The Neural Nexus Playground is a VS Code-like environment where you can experiment with AI models and write code. It includes features like syntax highlighting, a terminal, file explorer, and live previews. You can test models interactively, visualize outputs, and prototype applications. Access it from the 'Playground' option in the navigation menu or directly from your dashboard.`;
  }
  else if (normalizedQuery.includes('marketplace') || normalizedQuery.includes('extension') || normalizedQuery.includes('plugin')) {
    return `${contextPrefix}Our marketplace offers various extensions, plugins, and pre-trained models to enhance your Neural Nexus experience. You can find AI models, code snippets, templates, and tools contributed by both our team and the community. Browse the marketplace from your dashboard or directly in the playground. You can also publish your own models and tools to share with others or monetize your work.`;
  }
  else if (normalizedQuery.includes('security') || normalizedQuery.includes('privacy') || normalizedQuery.includes('data')) {
    return `${contextPrefix}Security and privacy are top priorities at Neural Nexus. We use industry-standard encryption for all data, both at rest and in transit. Your models and data are isolated in secure environments. We're compliant with major regulations including GDPR and CCPA, and we provide tools for you to manage data retention and access controls. You can review our detailed security practices in our documentation.`;
  }
  else if (normalizedQuery.includes('team') || normalizedQuery.includes('collaborate') || normalizedQuery.includes('sharing')) {
    return `${contextPrefix}Neural Nexus offers robust team collaboration features. You can invite team members to your workspace, assign different permission levels, and work together on models and applications. Premium plans include more team member slots and advanced collaboration tools like real-time editing, comments, and version control integration. You can manage your team from the 'Team' section in your dashboard.`;
  }
  else if (normalizedQuery.includes('deploy') || normalizedQuery.includes('production') || normalizedQuery.includes('hosting')) {
    return `${contextPrefix}Deploying AI models to production is simple with Neural Nexus. From your dashboard, select the model you want to deploy and click 'Deploy'. You can choose between API endpoints, containerized services, or edge deployments. We handle the infrastructure, scaling, and monitoring, so you can focus on building great applications. Premium plans include more deployment options and higher availability guarantees.`;
  }
  else if (normalizedQuery.includes('hi') || normalizedQuery.includes('hello') || normalizedQuery.includes('hey')) {
    return "Hi there! 👋 I'm Neural Nexus AI, your assistant for all things related to our platform. I can help with questions about features, pricing, account management, and technical support. What would you like to know about today?";
  }
  else {
    // Generic response based on conversation history
    const conversationContext = analyzeConversationContext(messages);
    return generateGenericResponse(query, conversationContext, context);
  }
}

// Analyze conversation context to generate more relevant responses
function analyzeConversationContext(messages: Message[]): string {
  // Get the main topic of conversation based on recent messages
  const recentMessages = messages.slice(-5);
  const userMessages = recentMessages.filter(msg => msg.role === 'user').map(msg => msg.content.toLowerCase());
  
  const topicKeywords: Record<string, string[]> = {
    'development': ['code', 'develop', 'programming', 'api', 'sdk', 'language'],
    'models': ['model', 'train', 'dataset', 'inference', 'prediction'],
    'account': ['account', 'sign', 'login', 'password', 'profile'],
    'billing': ['price', 'cost', 'billing', 'payment', 'subscription'],
    'deployment': ['deploy', 'production', 'host', 'server', 'cloud']
  };
  
  // Count keyword occurrences
  const topicCounts: Record<string, number> = {};
  Object.keys(topicKeywords).forEach(topic => {
    topicCounts[topic] = 0;
    
    userMessages.forEach(message => {
      topicKeywords[topic].forEach((keyword: string) => {
        if (message.includes(keyword)) {
          topicCounts[topic]++;
        }
      });
    });
  });
  
  // Find dominant topic
  let dominantTopic = '';
  let maxCount = 0;
  
  Object.entries(topicCounts).forEach(([topic, count]) => {
    if (count > maxCount) {
      maxCount = count;
      dominantTopic = topic;
    }
  });
  
  return dominantTopic;
}

// Generate a generic response based on the query and context
function generateGenericResponse(query: string, conversationContext: string, additionalContext?: string): string {
  const topicResponses: Record<string, string> = {
    'development': "Based on our conversation about development, I'd recommend checking out our developer documentation for detailed guides and API references. Our SDKs make it easy to integrate Neural Nexus into your applications. Is there a specific programming language or framework you're working with?",
    'models': "From our discussion about AI models, I can see you're interested in model capabilities. Neural Nexus supports a wide range of model types and training approaches. Our platform makes it easy to experiment with different architectures and parameters to get the best results for your use case.",
    'account': "Regarding account management, you can access all account settings from your user profile. This includes security settings, notification preferences, and connected services. If you're having any specific account issues, our support team is ready to help.",
    'billing': "On the topic of billing, all payment information and subscription details can be managed from the Billing section of your dashboard. We offer flexible plans that can be upgraded or downgraded at any time as your needs change.",
    'deployment': "For deployment, Neural Nexus offers several options to fit your needs. From simple API endpoints to containerized solutions and edge deployments, we make it easy to get your models into production with just a few clicks. Our infrastructure handles scaling automatically as your usage grows."
  };
  
  // Extract key concepts from the query
  const queryConcepts = query.split(/\s+/).filter(word => 
    word.length > 3 && !['what', 'when', 'where', 'which', 'why', 'how', 'would', 'could', 'should', 'about'].includes(word.toLowerCase())
  );
  
  let response = '';
  
  // Use conversation context if available
  if (conversationContext && topicResponses[conversationContext]) {
    response = additionalContext 
      ? `Based on our platform information: ${topicResponses[conversationContext]}`
      : topicResponses[conversationContext];
  } else {
    // Default response based on query concepts
    const conceptPhrase = queryConcepts.length > 1 
      ? `${queryConcepts.slice(0, 2).join(' ')}` 
      : 'that';
      
    response = additionalContext
      ? `Based on our platform information: Neural Nexus provides a comprehensive platform for developing, training, and deploying AI models. Regarding ${conceptPhrase}, you can find detailed information in our documentation, or I can help point you to specific resources. What specific aspect are you most interested in?`
      : `Thanks for your question about ${conceptPhrase}. Neural Nexus provides a comprehensive platform for developing, training, and deploying AI models. You can find detailed information in our documentation, or I can help point you to specific resources. Could you let me know what specific aspect you're most interested in?`;
  }
  
  return response;
} 