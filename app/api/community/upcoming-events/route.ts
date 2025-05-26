import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

/**
 * GET /api/community/upcoming-events
 * 
 * Fetches upcoming events from the database
 * Falls back to sample data if database is not available
 */
export async function GET() {
  try {
    let upcomingEvents = [];
    
    // Try to fetch from database
    try {
      const { db } = await connectToDatabase();
      
      // Get current date to filter for upcoming events only
      const currentDate = new Date();
      
      // Find upcoming events sorted by date
      upcomingEvents = await db.collection('events')
        .find({ 
          eventDate: { $gte: currentDate } // Only future events
        })
        .sort({ eventDate: 1 }) // Sort by date ascending
        .limit(6)
        .toArray();
      
      // Transform the data into the format needed by the frontend
      if (upcomingEvents && upcomingEvents.length > 0) {
        console.log("✅ Fetched upcoming events from database:", upcomingEvents.length);
        
        // Map database fields to frontend schema
        upcomingEvents = upcomingEvents.map(event => ({
          title: event.title,
          date: formatEventDate(event.eventDate),
          image: event.image || "/events/default.jpg",
          location: event.location || "Virtual Event",
          attendees: event.attendeeCount || 0
        }));
      } else {
        throw new Error("No upcoming events found in database");
      }
    } catch (error) {
      console.error("❌ Error fetching events from database:", error);
      
      // Fall back to sample data
      upcomingEvents = getSampleEvents();
    }
    
    return NextResponse.json(upcomingEvents);
  } catch (error) {
    console.error("❌ Unexpected error in upcoming events API:", error);
    
    // Return sample data in case of any error
    return NextResponse.json(getSampleEvents());
  }
}

// Helper to format event dates
function formatEventDate(date: Date | string): string {
  // Format date as "Month Day, Year" or handle string dates
  if (typeof date === 'string') {
    // If it's already a formatted string, return it
    if (!/^\d{4}-\d{2}-\d{2}/.test(date)) {
      return date;
    }
    
    // Otherwise parse the ISO string
    date = new Date(date);
  }
  
  const options: Intl.DateTimeFormatOptions = { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  };
  
  return date.toLocaleDateString('en-US', options);
}

// Sample events as fallback
function getSampleEvents() {
  return [
    {
      title: "AI Model Hackathon",
      date: "Dec 15-17, 2024",
      image: "/events/hackathon.jpg",
      location: "Virtual Event",
      attendees: 500
    },
    {
      title: "Neural Networks Workshop",
      date: "Dec 20, 2024",
      image: "/events/workshop.jpg",
      location: "Online",
      attendees: 300
    },
    {
      title: "AI Model Showcase",
      date: "Jan 5, 2025",
      image: "/events/showcase.jpg",
      location: "Virtual Conference",
      attendees: 1000
    }
  ];
} 