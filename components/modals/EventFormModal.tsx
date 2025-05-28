"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Users, Clock, Image as ImageIcon, Check } from 'lucide-react';
import { useModal } from '@/providers/ModalProvider';
import { useSupabase } from '@/providers/SupabaseProvider';
import { useRouter } from 'next/navigation';

export function EventFormModal() {
  const { isEventFormOpen, closeEventForm } = useModal();
  const { supabase, user } = useSupabase();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    image: '',
    type: 'Workshop'
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Check if user is logged in when modal opens
  useEffect(() => {
    if (isEventFormOpen && !user) {
      // Close modal and redirect to sign up
      closeEventForm();
      router.push('/signup?redirect=/events');
    }
  }, [isEventFormOpen, user, router, closeEventForm]);
  
  // Handle modal close
  const handleModalClose = () => {
    // Reset form state
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      image: '',
      type: 'Workshop'
    });
    setErrors({});
    setIsSubmitting(false);
    setIsSuccess(false);
    
    // Close modal
    closeEventForm();
  };
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.date.trim()) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.time.trim()) {
      newErrors.time = 'Time is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      router.push('/signup?redirect=/events');
      closeEventForm();
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Combine date and time
      const dateTime = new Date(`${formData.date}T${formData.time}`);
      
      // Create event
      const { data, error } = await supabase
        .from('events')
        .insert({
          title: formData.title,
          description: formData.description,
          date: dateTime.toISOString(),
          location: formData.location,
          image: formData.image || 'https://via.placeholder.com/500x300?text=Event',
          user_id: user.id,
          type: formData.type,
          attendees: 0
        })
        .select('id')
        .single();
      
      if (error) {
        throw error;
      }
      
      // Show success state
      setIsSuccess(true);
      
      // Auto-close after success
      setTimeout(() => {
        handleModalClose();
        // Redirect to event page
        if (data?.id) {
          router.push(`/events/${data.id}`);
        } else {
          router.push('/events');
        }
      }, 2000);
      
    } catch (error) {
      console.error('Error creating event:', error);
      setErrors({ submit: 'Failed to create event. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Don't render anything if user is not logged in
  if (!user && isEventFormOpen) return null;
  
  return (
    <AnimatePresence>
      {isEventFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 transition-opacity"
              onClick={handleModalClose}
            ></motion.div>
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-gray-800 rounded-xl max-w-lg w-full mx-auto p-6 overflow-hidden shadow-xl"
            >
              {/* Close button */}
              <button
                onClick={handleModalClose}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-700 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
              
              <h2 className="text-2xl font-bold mb-6">Host an Event</h2>
              
              {isSuccess ? (
                <div className="py-10 text-center">
                  <div className="mx-auto w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mb-4">
                    <Check className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Event Created!</h3>
                  <p className="text-gray-400">
                    Your event has been successfully created.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    {/* Title */}
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium mb-1">
                        Event Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 bg-gray-900 border ${
                          errors.title ? 'border-red-500' : 'border-gray-700'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        placeholder="e.g. AI Hackathon"
                      />
                      {errors.title && (
                        <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                      )}
                    </div>
                    
                    {/* Description */}
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium mb-1">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        className={`w-full px-4 py-2.5 bg-gray-900 border ${
                          errors.description ? 'border-red-500' : 'border-gray-700'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        placeholder="Describe your event..."
                      ></textarea>
                      {errors.description && (
                        <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                      )}
                    </div>
                    
                    {/* Date and Time */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="date" className="block text-sm font-medium mb-1">
                          <Calendar className="inline-block w-4 h-4 mr-1" />
                          Date
                        </label>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          className={`w-full px-4 py-2.5 bg-gray-900 border ${
                            errors.date ? 'border-red-500' : 'border-gray-700'
                          } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        />
                        {errors.date && (
                          <p className="mt-1 text-sm text-red-500">{errors.date}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="time" className="block text-sm font-medium mb-1">
                          <Clock className="inline-block w-4 h-4 mr-1" />
                          Time
                        </label>
                        <input
                          type="time"
                          id="time"
                          name="time"
                          value={formData.time}
                          onChange={handleChange}
                          className={`w-full px-4 py-2.5 bg-gray-900 border ${
                            errors.time ? 'border-red-500' : 'border-gray-700'
                          } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        />
                        {errors.time && (
                          <p className="mt-1 text-sm text-red-500">{errors.time}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Location */}
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium mb-1">
                        <MapPin className="inline-block w-4 h-4 mr-1" />
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 bg-gray-900 border ${
                          errors.location ? 'border-red-500' : 'border-gray-700'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        placeholder="e.g. Online or San Francisco, CA"
                      />
                      {errors.location && (
                        <p className="mt-1 text-sm text-red-500">{errors.location}</p>
                      )}
                    </div>
                    
                    {/* Event Type */}
                    <div>
                      <label htmlFor="type" className="block text-sm font-medium mb-1">
                        <Users className="inline-block w-4 h-4 mr-1" />
                        Event Type
                      </label>
                      <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="Workshop">Workshop</option>
                        <option value="Conference">Conference</option>
                        <option value="Hackathon">Hackathon</option>
                        <option value="Webinar">Webinar</option>
                        <option value="Discussion">Discussion</option>
                        <option value="Networking">Networking</option>
                      </select>
                    </div>
                    
                    {/* Image URL */}
                    <div>
                      <label htmlFor="image" className="block text-sm font-medium mb-1">
                        <ImageIcon className="inline-block w-4 h-4 mr-1" />
                        Image URL (Optional)
                      </label>
                      <input
                        type="text"
                        id="image"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    
                    {errors.submit && (
                      <div className="p-3 bg-red-900/30 border border-red-800 rounded-lg">
                        <p className="text-sm text-red-500">{errors.submit}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={handleModalClose}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors mr-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors flex items-center"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                            Creating...
                          </>
                        ) : (
                          'Create Event'
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
} 