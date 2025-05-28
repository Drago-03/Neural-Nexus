import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    // Get the user from Supabase auth
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to create events.' },
        { status: 401 }
      );
    }
    
    // Get event data from request body
    const eventData = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'date', 'location', 'type'];
    for (const field of requiredFields) {
      if (!eventData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Connect to database
    const { db } = await connectToDatabase();
    const eventsCollection = db.collection('events');
    
    // Prepare event object
    const newEvent = {
      id: `evt-${uuidv4().substring(0, 8)}`, // Generate a short unique ID
      title: eventData.title,
      description: eventData.description,
      date: new Date(eventData.date), // Store as Date object in MongoDB
      location: eventData.location,
      type: eventData.type,
      image: eventData.image || 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=2070&auto=format&fit=crop',
      organizer: {
        name: eventData.organizer?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
        avatar: eventData.organizer?.avatar || user.user_metadata?.avatar_url,
        userId: user.id
      },
      attendees: 1, // Creator is the first attendee
      tags: eventData.tags || [],
      website: eventData.website || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Insert event into database
    const result = await eventsCollection.insertOne(newEvent);
    
    if (!result.acknowledged) {
      throw new Error('Failed to insert event into database');
    }
    
    // Create an initial registration for the creator
    const registrationsCollection = db.collection('event_registrations');
    await registrationsCollection.insertOne({
      userId: user.id,
      eventId: newEvent.id,
      registeredAt: new Date(),
      status: 'confirmed',
      userEmail: user.email,
      isCreator: true
    });
    
    return NextResponse.json(
      { 
        message: 'Event created successfully',
        id: newEvent.id,
        event: newEvent
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
} 