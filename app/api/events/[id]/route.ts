import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { isProduction } from '@/lib/utils';
import { SAMPLE_EVENTS } from '../route';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const eventId = params.id;
  
  if (!eventId) {
    return NextResponse.json(
      { error: 'Event ID is required' },
      { status: 400 }
    );
  }
  
  // During build phase, return sample data
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    const sampleEvent = SAMPLE_EVENTS.find(event => event.id === eventId);
    if (sampleEvent) {
      return NextResponse.json(sampleEvent);
    }
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }
  
  try {
    const { db } = await connectToDatabase();
    const eventsCollection = db.collection('events');
    
    // Try to find the event using MongoDB ObjectId or string id
    let event;
    
    // First try with ObjectId if it's a valid MongoDB ObjectId format
    try {
      const objectId = new ObjectId(eventId);
      event = await eventsCollection.findOne({ _id: objectId });
    } catch (e) {
      // If not a valid ObjectId, try with string id
      event = await eventsCollection.findOne({ id: eventId });
    }
    
    // If no event found in database and not in production, check sample data
    if (!event) {
      if (!isProduction()) {
        const sampleEvent = SAMPLE_EVENTS.find(event => event.id === eventId);
        if (sampleEvent) {
          return NextResponse.json(sampleEvent);
        }
      }
      
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    // Format _id for JSON response
    if (event._id) {
      event._id = event._id.toString();
      // Ensure there's an id field
      event.id = event.id || event._id;
    }
    
    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    
    // In case of error, return a sample event in development
    if (!isProduction()) {
      const sampleEvent = SAMPLE_EVENTS.find(event => event.id === eventId);
      if (sampleEvent) {
        return NextResponse.json(sampleEvent);
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
} 