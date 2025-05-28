"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OptimizedImage from "@/components/OptimizedImage";
import { useSupabase } from '@/providers/SupabaseProvider';
import { useModal } from '@/providers/ModalProvider';
import { 
  Users, 
  Calendar, 
  MapPin, 
  Search, 
  Filter, 
  ArrowRight,
  ArrowDown,
  ArrowUp,
  Plus,
  Clock,
  Tag,
  Star,
  ChevronRight,
  Bookmark
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
}

// Define filter types
type EventType = 'All' | 'Workshop' | 'Conference' | 'Hackathon' | 'Discussion' | 'Webinar';
type EventLocation = 'All' | 'Online' | 'In-Person';
type SortOption = 'date' | 'attendees' | 'popularity';

export default function EventsPage() {
  const { user } = useSupabase();
  const { openEventForm } = useModal();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<EventType>('All');
  const [locationFilter, setLocationFilter] = useState<EventLocation>('All');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showPastEvents, setShowPastEvents] = useState(false);
  
  // Featured event
  const [featuredEvent, setFeaturedEvent] = useState<Event | null>(null);
  
  // Fetch events data
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/events');
        
        if (response.ok) {
          let eventData = await response.json();
          
          // Convert dates to Date objects for comparison
          eventData = eventData.map((event: Event) => ({
            ...event,
            dateObj: new Date(event.date)
          }));
          
          // Find a featured event (could be the nearest upcoming major event)
          const upcomingEvents = eventData.filter(
            (event: Event & { dateObj: Date }) => event.dateObj > new Date()
          );
          
          if (upcomingEvents.length > 0) {
            // Select an event with high attendance as featured
            const sortedByAttendees = [...upcomingEvents].sort(
              (a: any, b: any) => b.attendees - a.attendees
            );
            setFeaturedEvent(sortedByAttendees[0]);
          }
          
          setEvents(eventData);
          console.log("✅ Loaded events:", eventData.length);
        } else {
          console.error("❌ Failed to fetch events:", response.status);
          setEvents([]);
        }
      } catch (error) {
        console.error("❌ Error fetching events:", error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, []);
  
  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...events];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by event type
    if (typeFilter !== 'All') {
      filtered = filtered.filter(event => event.type === typeFilter);
    }
    
    // Filter by location type
    if (locationFilter !== 'All') {
      if (locationFilter === 'Online') {
        filtered = filtered.filter(event => 
          event.location.toLowerCase() === 'online' || 
          event.location.toLowerCase().includes('virtual')
        );
      } else {
        filtered = filtered.filter(event => 
          event.location.toLowerCase() !== 'online' && 
          !event.location.toLowerCase().includes('virtual')
        );
      }
    }
    
    // Filter by date (past/upcoming)
    if (!showPastEvents) {
      filtered = filtered.filter((event: any) => 
        new Date(event.date) >= new Date()
      );
    }
    
    // Apply sorting
    filtered = filtered.sort((a: any, b: any) => {
      if (sortBy === 'date') {
        return sortDirection === 'asc' 
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'attendees') {
        return sortDirection === 'asc'
          ? a.attendees - b.attendees
          : b.attendees - a.attendees;
      } else { // popularity, represented by attendees for now
        return sortDirection === 'asc'
          ? a.attendees - b.attendees
          : b.attendees - a.attendees;
      }
    });
    
    setFilteredEvents(filtered);
  }, [events, searchTerm, typeFilter, locationFilter, sortBy, sortDirection, showPastEvents]);
  
  // Handle registration
  const handleRegister = async (eventId: string) => {
    if (!user) {
      window.location.href = `/signup?redirect=events/${eventId}`;
      return;
    }
    
    try {
      const response = await fetch('/api/events/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId }),
      });
      
      if (response.ok) {
        // Update the local state to reflect the registration
        setEvents(events.map(event => 
          event.id === eventId 
            ? { ...event, registered: true, attendees: event.attendees + 1 } 
            : event
        ));
      }
    } catch (error) {
      console.error("Error registering for event:", error);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };
  
  // Generate calendar day display
  const getCalendarDay = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    
    return (
      <div className="flex flex-col items-center justify-center w-16 h-16 bg-gray-800 rounded-xl overflow-hidden text-center">
        <div className="bg-purple-600 w-full py-1 text-xs font-bold">{month}</div>
        <div className="text-2xl font-bold flex-grow flex items-center">{day}</div>
      </div>
    );
  };
  
  // Handle creating a new event
  const handleCreateEvent = () => {
    if (!user) {
      window.location.href = '/signup?redirect=/events';
      return;
    }
    openEventForm();
  };
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-28 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/20 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-60 -left-20 w-80 h-80 bg-blue-600/20 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                AI Community Events
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Connect with fellow AI enthusiasts, learn from experts, and stay on top of the latest developments in the world of artificial intelligence.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={handleCreateEvent}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg font-medium hover:opacity-90 transition-opacity inline-flex items-center"
              >
                <Plus className="mr-2 h-5 w-5" />
                Host Event
              </button>
              <Link
                href="#upcoming"
                className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
              >
                Browse Events
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Featured Event Section */}
      {featuredEvent && (
        <section className="py-12 px-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Featured Event</h2>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50 max-w-5xl mx-auto"
            >
              <div className="md:flex">
                <div className="md:w-1/2 h-60 md:h-auto relative">
                  <OptimizedImage
                    src={featuredEvent.image}
                    alt={featuredEvent.title}
                    className="w-full h-full"
                    objectFit="cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent md:hidden"></div>
                </div>
                
                <div className="md:w-1/2 p-6 md:p-8 relative">
                  <div className="absolute top-6 right-6 bg-purple-600/90 text-white text-xs px-3 py-1 rounded-full">
                    {featuredEvent.type}
                  </div>
                  
                  <div className="text-purple-400 mb-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(featuredEvent.date)}
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold mb-3">{featuredEvent.title}</h3>
                  
                  <div className="mb-4 flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-gray-300">{featuredEvent.location}</span>
                  </div>
                  
                  <p className="text-gray-300 mb-6 line-clamp-3 md:line-clamp-4">
                    {featuredEvent.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden mr-2 flex-shrink-0">
                        {featuredEvent.organizer.avatar ? (
                          <OptimizedImage
                            src={featuredEvent.organizer.avatar}
                            alt={featuredEvent.organizer.name}
                            className="w-full h-full"
                            aspectRatio="square"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            {featuredEvent.organizer.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <span>By {featuredEvent.organizer.name}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-300">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{featuredEvent.attendees}+ attending</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Link
                      href={`/events/${featuredEvent.id}`}
                      className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors flex-grow text-center"
                    >
                      View Details
                    </Link>
                    
                    <button
                      onClick={() => handleRegister(featuredEvent.id)}
                      className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors flex items-center justify-center"
                      disabled={featuredEvent.registered}
                    >
                      {featuredEvent.registered ? (
                        <>
                          <Star className="mr-2 h-4 w-4 text-yellow-500" />
                          Registered
                        </>
                      ) : (
                        <>
                          <Calendar className="mr-2 h-4 w-4" />
                          Register
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}
      
      {/* Filter and Search */}
      <section id="upcoming" className="py-12 px-4 bg-gray-900/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8">All Events</h2>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search events..."
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <select
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as EventType)}
                aria-label="Filter by event type"
              >
                <option value="All">All Types</option>
                <option value="Workshop">Workshops</option>
                <option value="Conference">Conferences</option>
                <option value="Hackathon">Hackathons</option>
                <option value="Discussion">Discussions</option>
                <option value="Webinar">Webinars</option>
              </select>
              
              <select
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value as EventLocation)}
                aria-label="Filter by location"
              >
                <option value="All">All Locations</option>
                <option value="Online">Online Only</option>
                <option value="In-Person">In-Person Only</option>
              </select>
              
              <div className="flex items-center">
                <select
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  aria-label="Sort events by"
                >
                  <option value="date">Sort by Date</option>
                  <option value="attendees">Sort by Attendees</option>
                </select>
                
                <button
                  className="ml-2 p-3 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
                  onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                  aria-label={sortDirection === 'asc' ? 'Sort ascending' : 'Sort descending'}
                >
                  {sortDirection === 'asc' ? 
                    <ArrowUp size={18} /> : 
                    <ArrowDown size={18} />
                  }
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center mb-8">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showPastEvents}
                onChange={() => setShowPastEvents(!showPastEvents)}
                className="sr-only"
              />
              <div className={`w-10 h-5 rounded-full transition-colors ${showPastEvents ? 'bg-purple-600' : 'bg-gray-700'} relative`}>
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform transform ${showPastEvents ? 'translate-x-5' : ''}`}></div>
              </div>
              <span className="ml-2 text-gray-300">Show past events</span>
            </label>
            
            <div className="ml-auto text-gray-400">
              {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
            </div>
          </div>
        </div>
      </section>
      
      {/* Events List */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, index) => (
                <div key={index} className="bg-gray-800/30 rounded-xl overflow-hidden border border-gray-700/50 animate-pulse">
                  <div className="h-48 bg-gray-700/50"></div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-14 h-14 bg-gray-700/50 rounded-xl"></div>
                      <div className="h-5 w-20 bg-gray-700/50 rounded"></div>
                    </div>
                    <div className="h-6 bg-gray-700/50 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-700/50 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-700/50 rounded w-full mb-6"></div>
                    <div className="h-10 bg-gray-700/50 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="bg-gray-800/30 rounded-xl overflow-hidden border border-gray-700/50 hover:border-gray-600/50 transition-all group"
                >
                  <div className="h-48 relative">
                    <OptimizedImage
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-purple-600/90 text-white text-xs px-3 py-1 rounded-full">
                      {event.type}
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-24"></div>
                    
                    <div className="absolute bottom-4 left-4 flex items-center">
                      <div className="w-6 h-6 rounded-full bg-gray-700 overflow-hidden mr-2">
                        {event.organizer.avatar ? (
                          <OptimizedImage
                            src={event.organizer.avatar}
                            alt={event.organizer.name}
                            className="w-full h-full"
                            aspectRatio="square"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs">
                            {event.organizer.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <span className="text-white text-sm">By {event.organizer.name}</span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      {getCalendarDay(event.date)}
                      
                      <div className="flex items-center text-gray-300 text-sm">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(event.date).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 line-clamp-1 group-hover:text-purple-400 transition-colors">
                      {event.title}
                    </h3>
                    
                    <div className="flex items-center mb-3 text-gray-300 text-sm">
                      <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    
                    <p className="text-gray-400 mb-5 line-clamp-2 text-sm">
                      {event.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center text-gray-300 text-sm">
                        <Users className="h-3 w-3 mr-1" />
                        <span>{event.attendees}+ attending</span>
                      </div>
                      
                      {event.registered && (
                        <div className="flex items-center text-yellow-500 text-sm">
                          <Star className="h-3 w-3 mr-1 fill-yellow-500" />
                          <span>Registered</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Link
                        href={`/events/${event.id}`}
                        className="flex-grow px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium text-sm transition-colors text-center"
                      >
                        View Details
                      </Link>
                      
                      {!event.registered && (
                        <button
                          onClick={() => handleRegister(event.id)}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium text-sm transition-colors"
                        >
                          Register
                        </button>
                      )}
                      
                      {event.registered && (
                        <button
                          className="w-10 h-10 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                          title="Save to calendar"
                        >
                          <Bookmark className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <div className="bg-gray-800/30 rounded-xl p-10 border border-gray-700/50 max-w-2xl mx-auto">
                <h3 className="text-xl font-bold mb-3">No Events Found</h3>
                <p className="text-gray-400 mb-6">
                  {searchTerm || typeFilter !== 'All' || locationFilter !== 'All' ? 
                    "No events match your current filters. Try adjusting your search criteria." : 
                    "There are no upcoming events scheduled at the moment."}
                </p>
                <button
                  onClick={handleCreateEvent}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors inline-flex items-center"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Host an Event
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Hosting CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 mt-12">
        <div className="container mx-auto text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Host Your Own AI Event
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Share your knowledge, connect with the community, and grow your network by hosting an AI event on Neural Nexus.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={handleCreateEvent}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg font-medium hover:opacity-90 transition-opacity inline-flex items-center"
              >
                <Plus className="mr-2 h-5 w-5" />
                Host an Event
              </button>
              <Link
                href="/events/guidelines"
                className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
              >
                Hosting Guidelines
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
} 