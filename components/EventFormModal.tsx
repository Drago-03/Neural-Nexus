"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/providers/SupabaseProvider';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Upload, 
  Tag, 
  Link as LinkIcon,
  AlertCircle,
  X
} from 'lucide-react';

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EventFormModal({ isOpen, onClose }: EventFormModalProps) {
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
  
  // Handle modal close
  const handleModalClose = () => {
    // Reset form state
    setEventData({
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
    setErrors({});
    onClose();
  };
  
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
    
    if (!user) {
      router.push('/signup?redirect=events/create');
      handleModalClose();
      return;
    }
    
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
      
      // Close modal and redirect to the new event page
      handleModalClose();
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
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={handleModalClose}></div>
      
      {/* Modal */}
      <div className="relative bg-gray-900 border border-gray-700 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-auto z-50">
        {/* Modal Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            Create an Event
          </h2>
          <button 
            onClick={handleModalClose}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Event Title */}
            <div className="mb-6">
              <label htmlFor="title" className="block font-medium mb-2">
                Event Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={eventData.title}
                onChange={handleChange}
                placeholder="e.g., AI Ethics Workshop 2023"
                className={`w-full px-4 py-3 bg-gray-800 border ${errors.title ? 'border-red-500' : 'border-gray-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
              {errors.title && (
                <p className="mt-1 text-red-500 text-sm flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.title}
                </p>
              )}
            </div>
            
            {/* Event Description */}
            <div className="mb-6">
              <label htmlFor="description" className="block font-medium mb-2">
                Event Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={eventData.description}
                onChange={handleChange}
                placeholder="Describe your event, what attendees can expect, and any prerequisites..."
                rows={6}
                className={`w-full px-4 py-3 bg-gray-800 border ${errors.description ? 'border-red-500' : 'border-gray-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
              {errors.description && (
                <p className="mt-1 text-red-500 text-sm flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.description}
                </p>
              )}
            </div>
            
            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="date" className="block font-medium mb-2">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Date <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={eventData.date}
                  onChange={handleChange}
                  min={today}
                  className={`w-full px-4 py-3 bg-gray-800 border ${errors.date ? 'border-red-500' : 'border-gray-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                />
                {errors.date && (
                  <p className="mt-1 text-red-500 text-sm flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.date}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="time" className="block font-medium mb-2">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Time <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={eventData.time}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-800 border ${errors.time ? 'border-red-500' : 'border-gray-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                />
                {errors.time && (
                  <p className="mt-1 text-red-500 text-sm flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.time}
                  </p>
                )}
              </div>
            </div>
            
            {/* Location */}
            <div className="mb-6">
              <label htmlFor="location" className="block font-medium mb-2">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Location <span className="text-red-500">*</span>
                </div>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={eventData.location}
                onChange={handleChange}
                placeholder="e.g., Online (Zoom) or 123 Tech Street, San Francisco, CA"
                className={`w-full px-4 py-3 bg-gray-800 border ${errors.location ? 'border-red-500' : 'border-gray-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
              {errors.location && (
                <p className="mt-1 text-red-500 text-sm flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.location}
                </p>
              )}
            </div>
            
            {/* Event Type */}
            <div className="mb-6">
              <label htmlFor="type" className="block font-medium mb-2">
                Event Type
              </label>
              <select
                id="type"
                name="type"
                value={eventData.type}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label="Select event type"
              >
                <option value="Conference">Conference</option>
                <option value="Workshop">Workshop</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Webinar">Webinar</option>
                <option value="Discussion">Discussion</option>
                <option value="Exhibition">Exhibition</option>
              </select>
            </div>
            
            {/* Image URL */}
            <div className="mb-6">
              <label htmlFor="image" className="block font-medium mb-2">
                <div className="flex items-center">
                  <Upload className="h-4 w-4 mr-2" />
                  Image URL (Optional)
                </div>
              </label>
              <input
                type="url"
                id="image"
                name="image"
                value={eventData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="mt-1 text-gray-400 text-sm">
                Enter a URL for your event image. If left blank, we'll use a default image.
              </p>
            </div>
            
            {/* Tags */}
            <div className="mb-6">
              <label htmlFor="tags" className="block font-medium mb-2">
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-2" />
                  Tags (Optional)
                </div>
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={eventData.tags}
                onChange={handleChange}
                placeholder="e.g., AI, Machine Learning, Ethics (comma separated)"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            {/* Website */}
            <div className="mb-8">
              <label htmlFor="website" className="block font-medium mb-2">
                <div className="flex items-center">
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Website (Optional)
                </div>
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={eventData.website}
                onChange={handleChange}
                placeholder="https://example.com/event"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            {/* Submit Error */}
            {errors.submit && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-lg">
                <p className="text-red-400 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {errors.submit}
                </p>
              </div>
            )}
            
            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg font-medium hover:opacity-90 disabled:opacity-70 transition-opacity flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                    Creating Event...
                  </>
                ) : (
                  <>Create Event</>
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-4 text-center text-gray-400 text-sm">
            <p>
              By creating an event, you agree to our{' '}
              <a href="/terms" className="text-purple-400 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/community-guidelines" className="text-purple-400 hover:underline">
                Community Guidelines
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 