"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, CheckCircle2, Upload, Linkedin, Github, ExternalLink, Send } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Position {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  remote: boolean;
}

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPosition?: Position | null;
  positions: Position[];
}

export default function ApplicationModal({
  isOpen,
  onClose,
  selectedPosition,
  positions
}: ApplicationModalProps) {
  const router = useRouter();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    portfolio: '',
    coverLetter: '',
    position: selectedPosition?.id || '',
    resume: null as File | null,
    submitted: false,
    submitting: false,
    error: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormState(prev => ({ ...prev, resume: e.target.files![0] }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setFormState(prev => ({ ...prev, submitting: true, error: '' }));
    
    // Validate form
    if (!formState.name || !formState.email || !formState.resume || !formState.position) {
      setFormState(prev => ({ 
        ...prev, 
        submitting: false,
        error: 'Please fill out all required fields and upload your resume.'
      }));
      return;
    }
    
    // In a real application, you would submit the form data to your API here
    // For demo purposes, we'll just simulate a submission with a timeout
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setFormState(prev => ({ ...prev, submitted: true, submitting: false }));
    } catch (error) {
      setFormState(prev => ({ 
        ...prev, 
        submitting: false,
        error: 'There was an error submitting your application. Please try again.'
      }));
    }
  };

  const resetForm = () => {
    setFormState({
      name: '',
      email: '',
      phone: '',
      linkedin: '',
      github: '',
      portfolio: '',
      coverLetter: '',
      position: selectedPosition?.id || '',
      resume: null,
      submitted: false,
      submitting: false,
      error: ''
    });
  };

  const handleClose = () => {
    onClose();
    // Reset the form after animation completes
    setTimeout(resetForm, 300);
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          
          {/* Modal */}
          <motion.div
            className="relative bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl w-full max-w-3xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {!formState.submitted ? (
                    selectedPosition 
                      ? `Apply for ${selectedPosition.title}` 
                      : 'Apply for a Position'
                  ) : (
                    'Application Submitted!'
                  )}
                </h2>
                <button
                  className="p-1 rounded-full hover:bg-gray-800 transition-colors"
                  onClick={handleClose}
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {!formState.submitted ? (
                <form onSubmit={handleSubmit}>
                  {formState.error && (
                    <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">
                      {formState.error}
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2" htmlFor="position">
                      Position <span className="text-red-400">*</span>
                    </label>
                    <select 
                      id="position"
                      name="position"
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      value={formState.position}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a position</option>
                      {positions.map(position => (
                        <option key={position.id} value={position.id}>
                          {position.title} - {position.location}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" htmlFor="name">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input 
                        type="text"
                        id="name"
                        name="name"
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        placeholder="Your full name"
                        value={formState.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2" htmlFor="email">
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <input 
                        type="email"
                        id="email"
                        name="email"
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        placeholder="name@yourdomain.com"
                        value={formState.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2" htmlFor="phone">
                        Phone Number
                      </label>
                      <input 
                        type="tel"
                        id="phone"
                        name="phone"
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        placeholder="Your phone number"
                        value={formState.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2" htmlFor="linkedin">
                        LinkedIn Profile
                      </label>
                      <div className="relative">
                        <Linkedin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <input 
                          type="url"
                          id="linkedin"
                          name="linkedin"
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          placeholder="linkedin.com/in/yourprofile"
                          value={formState.linkedin}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2" htmlFor="github">
                        GitHub Profile
                      </label>
                      <div className="relative">
                        <Github className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <input 
                          type="url"
                          id="github"
                          name="github"
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          placeholder="github.com/yourusername"
                          value={formState.github}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2" htmlFor="portfolio">
                        Portfolio Website <span className="text-gray-400 text-xs">(recommended)</span>
                      </label>
                      <div className="relative">
                        <ExternalLink className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <input 
                          type="url"
                          id="portfolio"
                          name="portfolio"
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          placeholder="yourportfolio.com"
                          value={formState.portfolio}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2" htmlFor="resume">
                      Resume/CV <span className="text-red-400">*</span>
                    </label>
                    <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 focus-within:ring-2 focus-within:ring-purple-500/50">
                      <div className="flex items-center">
                        <div className="flex-1">
                          {formState.resume ? (
                            <div className="flex items-center text-green-400">
                              <CheckCircle2 className="h-5 w-5 mr-2" />
                              <span className="truncate">{formState.resume.name}</span>
                            </div>
                          ) : (
                            <p className="text-gray-400">Upload your resume (PDF, DOCX)</p>
                          )}
                        </div>
                        <label className="cursor-pointer bg-gray-600 hover:bg-gray-500 transition-colors py-2 px-4 rounded-lg inline-flex items-center ml-3">
                          <Upload className="h-4 w-4 mr-2" />
                          <span>Browse</span>
                          <input 
                            type="file" 
                            id="resume"
                            name="resume"
                            className="hidden"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            required
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2" htmlFor="coverLetter">
                      Cover Letter
                    </label>
                    <textarea
                      id="coverLetter"
                      name="coverLetter"
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 min-h-[150px]"
                      placeholder="Tell us why you're interested in this position and what makes you a great fit."
                      value={formState.coverLetter}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                  
                  <div className="text-right">
                    <button
                      type="submit"
                      className={`inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors ${
                        formState.submitting ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                      disabled={formState.submitting}
                    >
                      {formState.submitting ? (
                        <>
                          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Application
                          <Send className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-6">
                  <div className="bg-green-500/20 h-20 w-20 rounded-full mx-auto flex items-center justify-center mb-6">
                    <CheckCircle2 className="h-10 w-10 text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">Application Submitted!</h2>
                  <p className="text-gray-300 mb-6 max-w-md mx-auto">
                    Thank you for your application. We'll review your information 
                    and get back to you soon.
                  </p>
                  <Link 
                    href="/careers"
                    className="inline-flex items-center px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    View All Open Positions
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 