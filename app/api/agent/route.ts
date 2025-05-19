import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { AIAgentService, AgentQuery, AgentResponsePayload } from '@/lib/AIAgentService';

// Type for the request body
interface AgentRequestBody {
  query: string;
  history?: Array<{
    id: string;
    role: 'user' | 'agent' | 'system';
    content: string;
    timestamp: Date | string;
  }>;
}

// Handler for POST requests
export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body: AgentRequestBody = await req.json();
    
    // Validate input
    if (!body.query || typeof body.query !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request: query is required and must be a string' },
        { status: 400 }
      );
    }
    
    // Get session if available (for authenticated users)
    const session = await getServerSession();
    
    // Initialize AI Agent service
    const aiService = AIAgentService.getInstance();
    
    // Process query
    const response = await aiService.processQuery({
      query: body.query,
      history: body.history ? body.history.map(msg => ({
        ...msg,
        // Convert timestamp strings to Date objects
        timestamp: typeof msg.timestamp === 'string' ? new Date(msg.timestamp) : msg.timestamp
      })) : undefined,
      userData: {
        userId: session?.user?.email || undefined,
        email: session?.user?.email || undefined,
        name: session?.user?.name || undefined,
        isLoggedIn: !!session
      }
    });
    
    // Log the interaction for analytics
    aiService.logInteraction(
      body.query, 
      response.message, 
      session?.user?.email || undefined
    );
    
    // Return the response
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('AI Agent API error:', error);
    
    // Return an appropriate error response
    return NextResponse.json(
      { 
        error: 'An error occurred while processing your request',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// Handler for GET requests (health check)
export async function GET() {
  return NextResponse.json(
    { status: 'AI Agent API is running' },
    { status: 200 }
  );
} 