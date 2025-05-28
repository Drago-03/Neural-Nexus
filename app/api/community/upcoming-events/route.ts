import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

// Define explicit runtime configuration
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60; // seconds

// Sample data as fallback
const SAMPLE_EVENTS = [
  {
    id: 'event1',
    title: 'Neural Networks Deep Dive',
    description: 'Advanced workshop on neural network architectures and optimization techniques',
    date: '2023-11-15T18:00:00Z',
    location: 'Online',
    image: '/images/events/neural-networks.jpg',
    organizer: {
      name: 'AI Research Institute',
      avatar: '/images/organizers/ai-research.jpg'
    },
    attendees: 450,
    type: 'Workshop'
  },
  {
    id: 'event2',
    title: 'Open Source AI Summit',
    description: 'Annual conference for open source AI projects and contributors',
    date: '2023-12-05T09:00:00Z',
    location: 'San Francisco, CA',
    image: '/images/events/open-source-summit.jpg',
    organizer: {
      name: 'Open AI Alliance',
      avatar: '/images/organizers/open-alliance.jpg'
    },
    attendees: 1200,
    type: 'Conference'
  },
  {
    id: 'event3',
    title: 'AI Ethics Roundtable',
    description: 'Discussion on ethical considerations in AI development and deployment',
    date: '2023-11-22T17:30:00Z',
    location: 'Online',
    image: '/images/events/ai-ethics.jpg',
    organizer: {
      name: 'Tech Ethics Collective',
      avatar: '/images/organizers/ethics-collective.jpg'
    },
    attendees: 320,
    type: 'Discussion'
  },
  {
    id: 'event4',
    title: 'Generative AI Hackathon',
    description: 'Build innovative applications using the latest generative AI models',
    date: '2023-12-15T10:00:00Z',
    location: 'New York, NY',
    image: '/images/events/gen-ai-hackathon.jpg',
    organizer: {
      name: 'Neural Nexus',
      avatar: '/images/organizers/neural-nexus.jpg'
    },
    attendees: 500,
    type: 'Hackathon'
  }
];

/**
 * GET /api/community/upcoming-events
 * 
 * Fetches upcoming events from the database
 * Falls back to sample data if database is not available
 */
export async function GET() {
  try {
    // Check if we're in a build environment
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      console.log('Using sample events data during build');
      return NextResponse.json(SAMPLE_EVENTS);
    }
    
    // Connect to MongoDB
    const eventsCollection = await getCollection('events');
    
    // Get upcoming events
    const currentDate = new Date();
    const events = await eventsCollection.find({
      date: { $gte: currentDate }
    })
    .sort({ date: 1 })
    .limit(8)
    .toArray();
    
    if (events.length === 0) {
      // Return an empty array instead of sample data
      console.log('No upcoming events found in database');
      return NextResponse.json([]);
    }
    
    // Format dates for display
    const formattedEvents = events.map(event => ({
      ...event,
      formattedDate: formatEventDate(event.date)
    }));
    
    return NextResponse.json(formattedEvents);
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    
    // Only return sample data during build, otherwise throw error
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json(SAMPLE_EVENTS);
    }
    
    return NextResponse.json({ error: 'Failed to fetch events from database' }, { status: 500 });
  }
}

function formatEventDate(date: Date | string): string {
  const eventDate = new Date(date);
  
  // Format: "Nov 15, 2023 • 6:00 PM"
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(eventDate);
} 