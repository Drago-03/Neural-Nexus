import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from 'next/link';
import { ArrowLeft, Info, CheckCircle, AlertCircle, HelpCircle, Calendar, Plus } from 'lucide-react';

export default function EventGuidelinesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />
      
      <div className="pt-28 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link 
            href="/events" 
            className="inline-flex items-center text-gray-300 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>
          
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                Event Hosting Guidelines
              </span>
            </h1>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Create engaging and valuable events for the Neural Nexus community by following these guidelines.
            </p>
          </div>
          
          {/* Guidelines */}
          <div className="space-y-12">
            {/* Introduction */}
            <section className="bg-gray-800/30 rounded-xl border border-gray-700/50 p-6 md:p-8">
              <div className="flex items-start mb-4">
                <Info className="h-6 w-6 text-purple-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-bold mb-2">Introduction</h2>
                  <p className="text-gray-300">
                    Hosting events on Neural Nexus is a great way to share knowledge, build community, and connect with others interested in AI and machine learning. These guidelines will help you create successful events that provide value to attendees and align with our community standards.
                  </p>
                </div>
              </div>
            </section>
            
            {/* Types of Events */}
            <section className="bg-gray-800/30 rounded-xl border border-gray-700/50 p-6 md:p-8">
              <h2 className="text-xl font-bold mb-4">Types of Events</h2>
              <p className="text-gray-300 mb-6">
                We support various types of events on our platform. Here are some ideas:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                  <h3 className="font-bold mb-2 text-purple-400">Workshops</h3>
                  <p className="text-gray-300 text-sm">
                    Hands-on sessions where participants learn practical skills or techniques, typically involving coding or working with AI models.
                  </p>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                  <h3 className="font-bold mb-2 text-purple-400">Webinars</h3>
                  <p className="text-gray-300 text-sm">
                    Online presentations or lectures focused on sharing knowledge, with Q&A sessions for attendee participation.
                  </p>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                  <h3 className="font-bold mb-2 text-purple-400">Discussion Panels</h3>
                  <p className="text-gray-300 text-sm">
                    Group conversations with multiple experts discussing topics, trends, or challenges in AI development.
                  </p>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                  <h3 className="font-bold mb-2 text-purple-400">Hackathons</h3>
                  <p className="text-gray-300 text-sm">
                    Collaborative coding events where participants work on projects, often with prizes for the best solutions.
                  </p>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                  <h3 className="font-bold mb-2 text-purple-400">Networking Events</h3>
                  <p className="text-gray-300 text-sm">
                    Casual meet-ups focused on community building and connecting people with similar interests.
                  </p>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                  <h3 className="font-bold mb-2 text-purple-400">Demo Days</h3>
                  <p className="text-gray-300 text-sm">
                    Showcases where creators can present their AI models, applications, or research to the community.
                  </p>
                </div>
              </div>
            </section>
            
            {/* Do's and Don'ts */}
            <section className="bg-gray-800/30 rounded-xl border border-gray-700/50 p-6 md:p-8">
              <h2 className="text-xl font-bold mb-6">Do's and Don'ts</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold mb-4 text-green-500 flex items-center text-lg">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Do's
                  </h3>
                  
                  <ul className="space-y-4">
                    <li className="flex">
                      <CheckCircle className="h-5 w-5 mr-3 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-300">
                        <span className="font-medium text-white">Provide clear descriptions</span> of your event, including prerequisites, target audience, and what attendees will learn.
                      </p>
                    </li>
                    
                    <li className="flex">
                      <CheckCircle className="h-5 w-5 mr-3 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-300">
                        <span className="font-medium text-white">Be prepared</span> with materials, slides, code examples, or other resources needed for your event.
                      </p>
                    </li>
                    
                    <li className="flex">
                      <CheckCircle className="h-5 w-5 mr-3 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-300">
                        <span className="font-medium text-white">Start and end on time</span> to respect attendees' schedules.
                      </p>
                    </li>
                    
                    <li className="flex">
                      <CheckCircle className="h-5 w-5 mr-3 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-300">
                        <span className="font-medium text-white">Record sessions</span> when appropriate, with permission from participants.
                      </p>
                    </li>
                    
                    <li className="flex">
                      <CheckCircle className="h-5 w-5 mr-3 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-300">
                        <span className="font-medium text-white">Foster inclusive discussions</span> and ensure all attendees have opportunities to participate.
                      </p>
                    </li>
                    
                    <li className="flex">
                      <CheckCircle className="h-5 w-5 mr-3 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-300">
                        <span className="font-medium text-white">Follow up with attendees</span> after the event with additional resources or next steps.
                      </p>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold mb-4 text-red-500 flex items-center text-lg">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Don'ts
                  </h3>
                  
                  <ul className="space-y-4">
                    <li className="flex">
                      <AlertCircle className="h-5 w-5 mr-3 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-300">
                        <span className="font-medium text-white">Don't mislead attendees</span> with inaccurate event descriptions or exaggerated claims.
                      </p>
                    </li>
                    
                    <li className="flex">
                      <AlertCircle className="h-5 w-5 mr-3 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-300">
                        <span className="font-medium text-white">Don't promote harmful content</span> or projects that violate our community guidelines.
                      </p>
                    </li>
                    
                    <li className="flex">
                      <AlertCircle className="h-5 w-5 mr-3 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-300">
                        <span className="font-medium text-white">Don't engage in excessive self-promotion</span> or use events primarily for marketing purposes.
                      </p>
                    </li>
                    
                    <li className="flex">
                      <AlertCircle className="h-5 w-5 mr-3 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-300">
                        <span className="font-medium text-white">Don't share attendee information</span> without explicit permission.
                      </p>
                    </li>
                    
                    <li className="flex">
                      <AlertCircle className="h-5 w-5 mr-3 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-300">
                        <span className="font-medium text-white">Don't allow harassing behavior</span> or discriminatory comments during events.
                      </p>
                    </li>
                    
                    <li className="flex">
                      <AlertCircle className="h-5 w-5 mr-3 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-300">
                        <span className="font-medium text-white">Don't cancel at the last minute</span> without good reason and proper communication.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
            
            {/* Best Practices */}
            <section className="bg-gray-800/30 rounded-xl border border-gray-700/50 p-6 md:p-8">
              <h2 className="text-xl font-bold mb-4">Best Practices for Virtual Events</h2>
              <p className="text-gray-300 mb-6">
                Many events on Neural Nexus are conducted virtually. Here are some tips for hosting successful online events:
              </p>
              
              <ul className="space-y-4">
                <li className="flex">
                  <HelpCircle className="h-5 w-5 mr-3 text-purple-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300">
                    <span className="font-medium text-white">Test your tech setup</span> before the event, including audio, video, and any presentation materials.
                  </p>
                </li>
                
                <li className="flex">
                  <HelpCircle className="h-5 w-5 mr-3 text-purple-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300">
                    <span className="font-medium text-white">Have a moderator</span> to help manage questions and keep discussions on track.
                  </p>
                </li>
                
                <li className="flex">
                  <HelpCircle className="h-5 w-5 mr-3 text-purple-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300">
                    <span className="font-medium text-white">Use interactive elements</span> like polls, breakout rooms, or Q&A sessions to keep attendees engaged.
                  </p>
                </li>
                
                <li className="flex">
                  <HelpCircle className="h-5 w-5 mr-3 text-purple-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300">
                    <span className="font-medium text-white">Share materials in advance</span> so attendees can prepare and follow along more easily.
                  </p>
                </li>
                
                <li className="flex">
                  <HelpCircle className="h-5 w-5 mr-3 text-purple-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300">
                    <span className="font-medium text-white">Consider accessibility</span> by providing captions, transcripts, or other accommodations when possible.
                  </p>
                </li>
                
                <li className="flex">
                  <HelpCircle className="h-5 w-5 mr-3 text-purple-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300">
                    <span className="font-medium text-white">Have a backup plan</span> for technical issues, such as alternative communication channels or co-hosts.
                  </p>
                </li>
              </ul>
            </section>
            
            {/* FAQ */}
            <section className="bg-gray-800/30 rounded-xl border border-gray-700/50 p-6 md:p-8">
              <h2 className="text-xl font-bold mb-6">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-purple-400 mb-2">How do I promote my event?</h3>
                  <p className="text-gray-300">
                    Once your event is created, it will appear in our events listing. You can also share the direct link to your event page on social media or with your network. For additional promotion, consider posting about it in our community discussion forums.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-bold text-purple-400 mb-2">Can I charge for tickets to my event?</h3>
                  <p className="text-gray-300">
                    Currently, all events on Neural Nexus must be free to attend. We're working on paid event functionality for the future.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-bold text-purple-400 mb-2">How do I get attendee information?</h3>
                  <p className="text-gray-300">
                    Event organizers can access a list of registered attendees, including their names and email addresses, from the event management dashboard. This information should only be used for event-related communications.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-bold text-purple-400 mb-2">What if I need to cancel or reschedule?</h3>
                  <p className="text-gray-300">
                    If you need to cancel or reschedule, update your event as soon as possible and notify registered attendees through the event management dashboard. Try to provide at least 48 hours' notice for any changes.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-bold text-purple-400 mb-2">Are there limits on how many events I can host?</h3>
                  <p className="text-gray-300">
                    There are no strict limits, but we encourage quality over quantity. Focus on creating valuable, well-organized events rather than hosting many events in quick succession.
                  </p>
                </div>
              </div>
            </section>
          </div>
          
          {/* CTA */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Host Your Event?</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Now that you're familiar with our guidelines, it's time to create your event and share your knowledge with the Neural Nexus community!
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/events/create"
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg font-medium hover:opacity-90 transition-opacity inline-flex items-center"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create an Event
              </Link>
              <Link
                href="/events"
                className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors inline-flex items-center"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Browse Events
              </Link>
            </div>
          </div>
          
          {/* Support */}
          <div className="mt-16 bg-gray-800/30 rounded-xl border border-gray-700/50 p-6 text-center">
            <h3 className="font-bold mb-2">Need Help?</h3>
            <p className="text-gray-300">
              If you have any questions about hosting events or need assistance, please{' '}
              <a href="/contact" className="text-purple-400 hover:underline">contact our support team</a>.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
} 