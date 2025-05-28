"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OptimizedImage from "@/components/OptimizedImage";
import { useSupabase } from '@/providers/SupabaseProvider';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Calendar, 
  MapPin, 
  Clock,
  Tag,
  Star,
  Share2,
  ArrowLeft,
  MessageCircle,
  Bookmark,
  BookmarkCheck,
  Info,
  ExternalLink,
  MoreHorizontal,
  ChevronDown,
  LinkIcon,
  Loader2
} from 'lucide-react';

// Define Event interface
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  formattedDate?: string;
  location: string;
  image: string;
  organizer: {
    name: string;
    avatar?: string;
  };
  attendees: number;
  type: string;
  registered?: boolean;
  tags?: string[];
  website?: string;
  additionalInfo?: string;
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useSupabase();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'discussion'>('about');
  const [shareUrl, setShareUrl] = useState<string>('');
  
  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        const eventId = params.id;
        
        if (!eventId) {
          router.push('/events');
          return;
        }
        
        // In a real app, this would fetch from your API
        const response = await fetch(`/api/events/${eventId}`);
        
        // If event not found, simulate it with sample data from the general endpoint
        if (!response.ok) {
          const allEventsResponse = await fetch('/api/events');
          if (allEventsResponse.ok) {
            const allEvents = await allEventsResponse.json();
            const foundEvent = allEvents.find((e: Event) => e.id === eventId);
            
            if (foundEvent) {
              setEvent(foundEvent);
            } else {
              router.push('/events');
            }
          } else {
            router.push('/events');
          }
        } else {
          const eventData = await response.json();
          setEvent(eventData);
        }
      } catch (error) {
        console.error("❌ Error fetching event:", error);
        // Redirect to events list on error
        router.push('/events');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvent();
    
    // Set share URL
    setShareUrl(window.location.href);
  }, [params.id, router]);
  
  // Handle registration
  const handleRegister = async () => {
    if (!user) {
      router.push(`/signup?redirect=events/${event?.id}`);
      return;
    }
    
    try {
      setIsRegistering(true);
      const response = await fetch('/api/events/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId: event?.id }),
      });
      
      if (response.ok) {
        // Update the local state to reflect the registration
        setEvent(event => 
          event ? { ...event, registered: true, attendees: event.attendees + 1 } : null
        );
      }
    } catch (error) {
      console.error("Error registering for event:", error);
    } finally {
      setIsRegistering(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };
  
  // Format date for calendar add
  const formatCalendarDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().replace(/-|:|\.\d+/g, '');
  };
  
  // Generate Google Calendar link
  const getGoogleCalendarLink = (): string => {
    if (!event) return '';
    
    const startTime = formatCalendarDate(event.date);
    // Assume event lasts 2 hours
    const endTime = formatCalendarDate(new Date(new Date(event.date).getTime() + 2 * 60 * 60 * 1000).toISOString());
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
  };
  
  // Share event
  const shareEvent = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.title,
          text: `Check out this event: ${event?.title}`,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing event:', error);
        // Fallback to copying to clipboard
        copyToClipboard();
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      copyToClipboard();
    }
  };
  
  // Copy URL to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        alert('Link copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy URL: ', err);
      });
  };
  
  // Toggle save event
  const toggleSaveEvent = () => {
    setIsSaved(!isSaved);
    // In a real app, you would save this to the user's profile
  };
  
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <Navbar />
        <div className="pt-28 pb-16 px-4 flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 animate-spin text-purple-500 mb-4" />
            <p className="text-gray-400">Loading event details...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }
  
  if (!event) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <Navbar />
        <div className="pt-28 pb-16 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <p className="text-gray-400 mb-8">The event you're looking for doesn't exist or has been removed.</p>
          <Link href="/events" className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors">
            Back to Events
          </Link>
        </div>
        <Footer />
      </main>
    );
  }
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />
      
      {/* Event Header */}
      <div className="relative h-72 md:h-96 w-full">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <OptimizedImage
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        
        <div className="absolute top-0 left-0 w-full z-20">
          <div className="container mx-auto px-4 pt-28">
            <Link 
              href="/events" 
              className="inline-flex items-center text-gray-300 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full z-20">
          <div className="container mx-auto px-4 pb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-purple-600/90 text-white text-xs px-3 py-1 rounded-full">
                {event.type}
              </span>
              {event.tags && event.tags.map(tag => (
                <span key={tag} className="bg-gray-800/80 text-gray-200 text-xs px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{event.title}</h1>
          </div>
        </div>
      </div>
      
      {/* Event Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="border-b border-gray-800 mb-6">
              <div className="flex">
                <button
                  className={`px-4 py-3 font-medium text-sm ${activeTab === 'about' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-gray-200'}`}
                  onClick={() => setActiveTab('about')}
                >
                  About
                </button>
                <button
                  className={`px-4 py-3 font-medium text-sm ${activeTab === 'discussion' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-gray-200'}`}
                  onClick={() => setActiveTab('discussion')}
                >
                  Discussion
                </button>
              </div>
            </div>
            
            {/* Tab Content */}
            {activeTab === 'about' ? (
              <div>
                <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                <p className="text-gray-300 mb-8 whitespace-pre-line">
                  {event.description}
                </p>
                
                {event.additionalInfo && (
                  <div className="mb-8">
                    <h3 className="text-lg font-bold mb-3">Additional Information</h3>
                    <p className="text-gray-300 whitespace-pre-line">
                      {event.additionalInfo}
                    </p>
                  </div>
                )}
                
                {/* Organizer Info */}
                <div className="bg-gray-800/30 rounded-xl p-6 mb-8">
                  <h3 className="text-lg font-bold mb-4">Organizer</h3>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden mr-4">
                      {event.organizer.avatar ? (
                        <OptimizedImage
                          src={event.organizer.avatar}
                          alt={event.organizer.name}
                          className="w-full h-full"
                          aspectRatio="square"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg font-bold">
                          {event.organizer.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold">{event.organizer.name}</h4>
                      <p className="text-gray-400 text-sm">Event Organizer</p>
                    </div>
                  </div>
                </div>
                
                {/* Website Link */}
                {event.website && (
                  <div className="mb-8">
                    <h3 className="text-lg font-bold mb-3">Event Website</h3>
                    <a 
                      href={event.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit event website
                    </a>
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex flex-wrap gap-4 mt-10">
                  <button
                    onClick={shareEvent}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium text-sm transition-colors flex items-center"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Event
                  </button>
                  
                  <a
                    href={getGoogleCalendarLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium text-sm transition-colors flex items-center"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Add to Calendar
                  </a>
                  
                  <button
                    onClick={toggleSaveEvent}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium text-sm transition-colors flex items-center"
                  >
                    {isSaved ? (
                      <>
                        <BookmarkCheck className="h-4 w-4 mr-2 text-purple-400" />
                        Saved
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-4 w-4 mr-2" />
                        Save Event
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Event Discussion</h2>
                  <span className="text-gray-400 text-sm">10 comments</span>
                </div>
                
                {/* Comments section - Simplified for this example */}
                <div className="bg-gray-800/30 rounded-xl p-6 mb-4">
                  <p className="text-center text-gray-400 py-8">
                    {user ? (
                      "This is a placeholder for the event discussion forum. In a real application, users would be able to post questions and comments about the event."
                    ) : (
                      <>
                        Please <Link href={`/login?redirect=events/${event.id}`} className="text-purple-400 hover:underline">log in</Link> to join the discussion.
                      </>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div>
            <div className="bg-gray-800/30 rounded-xl overflow-hidden border border-gray-700/50 sticky top-24">
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-2">Date & Time</h3>
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-3 text-purple-400 mt-0.5" />
                    <div>
                      <p className="text-gray-200">{formatDate(event.date)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-2">Location</h3>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-3 text-purple-400 mt-0.5" />
                    <div>
                      <p className="text-gray-200">{event.location}</p>
                      {!event.location.toLowerCase().includes('online') && (
                        <a 
                          href={`https://maps.google.com/?q=${encodeURIComponent(event.location)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-purple-400 hover:text-purple-300 inline-flex items-center mt-1"
                        >
                          <MapPin className="h-3 w-3 mr-1" />
                          View on map
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-lg font-bold mb-2">Attendees</h3>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-3 text-purple-400" />
                    <p className="text-gray-200">{event.attendees}+ people attending</p>
                  </div>
                </div>
                
                {/* Registration Button */}
                {event.registered ? (
                  <div className="bg-gray-700/50 rounded-lg p-4 text-center mb-4">
                    <div className="flex items-center justify-center mb-2">
                      <Star className="h-5 w-5 mr-2 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">You're registered!</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      You'll receive event updates via email.
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleRegister}
                    disabled={isRegistering}
                    className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center justify-center mb-4"
                  >
                    {isRegistering ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      <>
                        <Calendar className="mr-2 h-4 w-4" />
                        Register for Event
                      </>
                    )}
                  </button>
                )}
                
                {/* Disclaimer */}
                <div className="text-xs text-gray-500 flex items-start">
                  <Info className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" />
                  <p>
                    By registering, you agree to share your contact information with the event organizer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
} 