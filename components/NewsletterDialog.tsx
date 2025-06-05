"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, CheckCircle, Sparkles, Loader2 } from 'lucide-react';

interface NewsletterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewsletterDialog = ({ isOpen, onClose }: NewsletterDialogProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email || !email.includes('@')) {
      setError('Pls enter a valid email addy!');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Send the email using our API
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }
      
      // Show success state
      setIsSubmitted(true);
      
      // Reset after a few seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
        onClose();
      }, 3000);
    } catch (err: any) {
      console.error('Newsletter subscription error:', err);
      setError(err.message || 'Something went wrong, try again later!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className="bg-gradient-to-br from-gray-900 to-gray-800 w-full max-w-lg rounded-2xl border border-gray-700 overflow-hidden shadow-xl"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/70 transition-colors"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="p-6 md:p-8">
              <div className="flex items-center mb-6">
                <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-4">
                  <Mail className="h-5 w-5 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold">
                  Stay in the loop fam!
                </h2>
              </div>
              
              <p className="text-gray-300 mb-6">
                Get the freshest AI model drops, exclusive sneak peeks, and sick deals straight to your inbox. No cap, just vibes!
              </p>
              
              <div className="relative mb-6">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg blur-xl opacity-50"></div>
                <div className="absolute top-1 right-1 h-8 w-8 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                </div>
                <div className="relative p-0.5 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500">
                  {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className="flex">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="flex-1 bg-gray-900 rounded-l-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none"
                        aria-label="Email address"
                        disabled={isLoading}
                      />
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-r-lg font-medium hover:opacity-90 transition-opacity flex-shrink-0 flex items-center justify-center"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          'Subscribe'
                        )}
                      </button>
                    </form>
                  ) : (
                    <div className="bg-gray-900 rounded-lg px-4 py-3 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                      <span className="text-green-400">You're all set! Thanks for subscribing!</span>
                    </div>
                  )}
                </div>
              </div>
              
              {error && (
                <p className="text-red-400 text-sm mb-4">{error}</p>
              )}
              
              <p className="text-sm text-gray-400">
                By subscribing you agree to our privacy policy. We promise not to spam - ain't nobody got time for that!
              </p>
              
              <div className="mt-6 pt-6 border-t border-gray-700">
                <p className="text-sm text-gray-400 italic">
                  "Models so fire they make GPT look basic." - Neural Nexus Fam
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewsletterDialog; 