"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSupabase } from '@/providers/SupabaseProvider';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Upload, 
  Tag, 
  Link as LinkIcon,
  AlertCircle
} from 'lucide-react';

export default function CreateEventPage() {
  const router = useRouter();
  const { user } = useSupabase();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'Conference',
    image: '',
    tags: '',
    website: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/signup?redirect=events/create');
    }
  }, [user, router]);
  
  useEffect(() => {
    // Redirect to events page since we're now using a modal for event creation
    router.push('/events');
  }, [router]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!eventData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!eventData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!eventData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!eventData.time) {
      newErrors.time = 'Time is required';
    }
    
    if (!eventData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Combine date and time
      const dateTime = new Date(`${eventData.date}T${eventData.time}`);
      
      // Process tags
      const tags = eventData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      // Create payload
      const payload = {
        title: eventData.title,
        description: eventData.description,
        date: dateTime.toISOString(),
        location: eventData.location,
        type: eventData.type,
        image: eventData.image || 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=2070&auto=format&fit=crop', // Default image
        tags,
        website: eventData.website,
        organizer: {
          name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Anonymous',
          avatar: user?.user_metadata?.avatar_url
        }
      };
      
      // Submit to API
      const response = await fetch('/api/events/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create event');
      }
      
      const result = await response.json();
      
      // Redirect to the new event page
      router.push(`/events/${result.id}`);
      
    } catch (error) {
      console.error('Error creating event:', error);
      setErrors(prev => ({ ...prev, submit: 'Failed to create event. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Generate a current date string in YYYY-MM-DD format for the min date attribute
  const today = new Date().toISOString().split('T')[0];
  
  return null; // No UI needed as we're redirecting
} 