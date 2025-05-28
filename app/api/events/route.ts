import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { isProduction } from '@/lib/utils';

// Sample events data for development or fallback
export const SAMPLE_EVENTS = [
  {
    id: "evt-001",
    title: "Neural Network Workshop 2023",
    description: "Join us for a hands-on workshop where we'll dive deep into neural network architectures. Learn how to build, train, and optimize state-of-the-art models for computer vision and NLP tasks.",
    date: "2023-12-15T10:00:00Z",
    location: "San Francisco, CA",
    image: "https://images.unsplash.com/photo-1581092921461-7031e4f48e85?q=80&w=2070&auto=format&fit=crop",
    organizer: {
      name: "Dr. Alex Johnson",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    attendees: 156,
    type: "Workshop",
    tags: ["Neural Networks", "Deep Learning", "Hands-on"]
  },
  {
    id: "evt-002",
    title: "AI Ethics Conference",
    description: "A three-day conference discussing the ethical implications of artificial intelligence. Leading experts will debate responsible AI development, bias in algorithms, and policy considerations.",
    date: "2023-11-05T09:00:00Z",
    location: "Online",
    image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=2070&auto=format&fit=crop",
    organizer: {
      name: "Ethics in AI Coalition",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg"
    },
    attendees: 412,
    type: "Conference",
    tags: ["Ethics", "Policy", "Responsible AI"]
  },
  {
    id: "evt-003",
    title: "Reinforcement Learning Hackathon",
    description: "Put your RL skills to the test in this 48-hour hackathon. Build agents that can solve complex environments and compete for prizes worth up to $10,000.",
    date: "2024-01-20T18:00:00Z",
    location: "New York, NY",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop",
    organizer: {
      name: "TechAI Labs",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    },
    attendees: 230,
    type: "Hackathon",
    tags: ["Reinforcement Learning", "Competition", "Prizes"]
  },
  {
    id: "evt-004",
    title: "The Future of LLMs Discussion Panel",
    description: "Leading researchers discuss where Large Language Models are headed. Topics include multimodal capabilities, reasoning, and alignment with human values.",
    date: "2023-12-10T19:00:00Z",
    location: "Virtual Event",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
    organizer: {
      name: "Future of AI Institute",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    attendees: 178,
    type: "Discussion",
    tags: ["LLMs", "Future Tech", "Research"]
  },
  {
    id: "evt-005",
    title: "Computer Vision for Healthcare Webinar",
    description: "Learn how computer vision technologies are revolutionizing healthcare, from diagnostic imaging to surgical assistance and patient monitoring.",
    date: "2024-02-05T15:00:00Z",
    location: "Online",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop",
    organizer: {
      name: "HealthTech AI",
      avatar: "https://randomuser.me/api/portraits/women/52.jpg"
    },
    attendees: 345,
    type: "Webinar",
    tags: ["Healthcare", "Computer Vision", "Medical AI"]
  },
  {
    id: "evt-006",
    title: "Generative AI Art Exhibition",
    description: "A showcase of artworks created with or in collaboration with AI systems. Features pieces from renowned digital artists and emerging talents pushing the boundaries of creative AI.",
    date: "2024-03-15T11:00:00Z",
    location: "Los Angeles, CA",
    image: "https://images.unsplash.com/photo-1575909812264-6902b55846ad?q=80&w=2070&auto=format&fit=crop",
    organizer: {
      name: "Digital Arts Collective",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg"
    },
    attendees: 289,
    type: "Exhibition",
    tags: ["Generative Art", "AI Creativity", "Digital Art"]
  },
  {
    id: "evt-007",
    title: "MLOps Summit 2024",
    description: "An industry-focused event covering best practices for machine learning operations. Learn about model deployment, monitoring, and maintaining AI systems at scale.",
    date: "2024-04-22T08:00:00Z",
    location: "Seattle, WA",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
    organizer: {
      name: "Enterprise AI Group",
      avatar: "https://randomuser.me/api/portraits/women/33.jpg"
    },
    attendees: 402,
    type: "Conference",
    tags: ["MLOps", "DevOps", "Enterprise"]
  },
  {
    id: "evt-008",
    title: "Edge AI Workshop",
    description: "A practical workshop on implementing AI on edge devices. Topics include model optimization, hardware considerations, and real-time inference techniques.",
    date: "2024-01-18T13:00:00Z",
    location: "Austin, TX",
    image: "https://images.unsplash.com/photo-1526378800651-c32d170fe6f8?q=80&w=2069&auto=format&fit=crop",
    organizer: {
      name: "Edge Computing Consortium",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg"
    },
    attendees: 120,
    type: "Workshop",
    tags: ["Edge AI", "IoT", "Embedded Systems"]
  }
];

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Fetch events from the database
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    // Get event data from request
    const eventData = await request.json();
    
    // Add user ID and created_at timestamp
    const newEvent = {
      ...eventData,
      user_id: user?.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Insert into database
    const { data, error } = await supabase
      .from('events')
      .insert(newEvent)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Return the created event
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
} 