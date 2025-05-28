import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

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
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get event ID from request
    const { eventId } = await request.json();
    
    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }
    
    // Check if user already registered
    const { data: existingRegistration, error: checkError } = await supabase
      .from('event_registrations')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw checkError;
    }
    
    if (existingRegistration) {
      return NextResponse.json(
        { message: 'Already registered for this event', registration: existingRegistration },
        { status: 200 }
      );
    }
    
    // Create registration
    const registration = {
      event_id: eventId,
      user_id: user.id,
      registered_at: new Date().toISOString(),
      status: 'confirmed'
    };
    
    const { data, error } = await supabase
      .from('event_registrations')
      .insert(registration)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Update event attendee count
    await supabase.rpc('increment_event_attendees', { event_id: eventId });
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error registering for event:', error);
    return NextResponse.json(
      { error: 'Failed to register for event' },
      { status: 500 }
    );
  }
} 