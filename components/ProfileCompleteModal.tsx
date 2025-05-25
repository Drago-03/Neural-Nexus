"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Camera, User, Building, MapPin, Briefcase, Mail, Link, MoreHorizontal } from 'lucide-react';
import { AnimatedButton } from './ui/animated-button';

interface ProfileCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (profileData: any) => void;
  userData: {
    displayName?: string;
    email?: string;
    photoURL?: string;
    username?: string;
  };
}

export default function ProfileCompleteModal({
  isOpen,
  onClose,
  onComplete,
  userData
}: ProfileCompleteModalProps) {
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState({
    displayName: userData.displayName || '',
    email: userData.email || '',
    username: userData.username || '',
    bio: '',
    organization: '',
    location: '',
    jobTitle: '',
    website: '',
    profilePicture: userData.photoURL || '',
    interests: [] as string[],
    skills: [] as string[],
  });
  
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const interestOptions = [
    'Computer Vision', 'NLP', 'Generative AI', 'Reinforcement Learning',
    'Neural Networks', 'MLOps', 'Data Engineering', 'Model Optimization',
    'AI Ethics', 'Research', 'AI Education', 'Robotics',
  ];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
    
    setProfileData(prev => ({
      ...prev,
      interests: selectedInterests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };
  
  const addSkill = () => {
    if (newSkill && !profileData.skills.includes(newSkill)) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill]
      }));
      setNewSkill('');
    }
  };
  
  const removeSkill = (skill: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };
  
  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Submit profile data to the API
      saveProfileData(profileData);
    }
  };
  
  const saveProfileData = async (data: any) => {
    try {
      // Make a copy of the data to avoid modifying the original state
      const sanitizedData = {
        displayName: data.displayName,
        bio: data.bio,
        organization: data.organization || undefined,
        location: data.location || undefined,
        jobTitle: data.jobTitle || undefined,
        website: data.website || undefined,
        skills: data.skills.length > 0 ? data.skills : undefined,
        interests: data.interests.length > 0 ? data.interests : undefined,
        // Don't include the avatar here - it's uploaded separately
      };

      // Call the API to save profile data
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save profile data');
      }
      
      const result = await response.json();
      
      // Call the onComplete callback with the updated user data
      onComplete(result.user);
    } catch (error) {
      console.error('Error saving profile data:', error);
      // Could add error handling UI here
      alert('Failed to save profile data. Please try again.');
    }
  };
  
  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  // Handle profile image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Only image files are allowed');
      return;
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('Image size must be less than 5MB');
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Create form data
      const formData = new FormData();
      formData.append('avatar', file);
      
      // Upload image
      const response = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }
      
      const result = await response.json();
      
      // Update profile data with new avatar URL
      setProfileData(prev => ({
        ...prev,
        profilePicture: result.avatar
      }));
      
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
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
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="relative bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl w-full max-w-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Complete Your Profile</h2>
                <button
                  className="p-1 rounded-full hover:bg-gray-800 transition-colors"
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Progress bar */}
              <div className="w-full h-1 bg-gray-800 mt-4 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-600"
                  initial={{ width: '33.33%' }}
                  animate={{ width: `${step * 33.33}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              
              {/* Step indicator */}
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span className={step >= 1 ? 'text-pink-400' : ''}>Basic Info</span>
                <span className={step >= 2 ? 'text-pink-400' : ''}>Interests</span>
                <span className={step >= 3 ? 'text-pink-400' : ''}>Skills</span>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <div className="flex flex-col items-center mb-6">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-gray-800 overflow-hidden flex items-center justify-center">
                          {profileData.profilePicture ? (
                            <img 
                              src={profileData.profilePicture} 
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-10 h-10 text-gray-600" />
                          )}
                          
                          {isUploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <div className="w-8 h-8 border-2 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                            </div>
                          )}
                        </div>
                        <button 
                          className="absolute bottom-0 right-0 bg-purple-600 p-1.5 rounded-full border-2 border-gray-900"
                          aria-label="Upload profile picture"
                          onClick={triggerFileInput}
                          disabled={isUploading}
                        >
                          <Camera className="w-3.5 h-3.5" />
                        </button>
                        <input 
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={isUploading}
                          aria-label="Upload profile picture"
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-2">Upload Profile Picture</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type="text"
                            name="displayName"
                            value={profileData.displayName}
                            onChange={handleInputChange}
                            className="pl-10 w-full bg-gray-800/50 border border-gray-700 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Your name"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type="text"
                            name="username"
                            value={profileData.username}
                            onChange={handleInputChange}
                            className="pl-10 w-full bg-gray-800/50 border border-gray-700 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Choose a username"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleInputChange}
                            className="pl-10 w-full bg-gray-800/50 border border-gray-700 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="name@yourdomain.com"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Organization</label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type="text"
                            name="organization"
                            value={profileData.organization}
                            onChange={handleInputChange}
                            className="pl-10 w-full bg-gray-800/50 border border-gray-700 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Company or university"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Job Title</label>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type="text"
                            name="jobTitle"
                            value={profileData.jobTitle}
                            onChange={handleInputChange}
                            className="pl-10 w-full bg-gray-800/50 border border-gray-700 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Data Scientist, Developer, etc."
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type="text"
                            name="location"
                            value={profileData.location}
                            onChange={handleInputChange}
                            className="pl-10 w-full bg-gray-800/50 border border-gray-700 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="City, Country"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Website</label>
                        <div className="relative">
                          <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type="url"
                            name="website"
                            value={profileData.website}
                            onChange={handleInputChange}
                            className="pl-10 w-full bg-gray-800/50 border border-gray-700 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="https://yourwebsite.com"
                          />
                        </div>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-400 mb-1">Bio</label>
                        <textarea
                          name="bio"
                          value={profileData.bio}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Tell us about yourself..."
                          rows={3}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-medium mb-4">Select your interests</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      This helps us personalize your dashboard and recommend relevant models.
                    </p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {interestOptions.map((interest) => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className={`
                            p-3 rounded-lg text-sm text-left transition-all
                            ${profileData.interests.includes(interest)
                              ? 'bg-purple-500/20 border-purple-500 border text-white'
                              : 'bg-gray-800/50 border-gray-700 border text-gray-300 hover:bg-gray-800'
                            }
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <span>{interest}</span>
                            {profileData.interests.includes(interest) && (
                              <Check className="w-4 h-4 text-purple-400" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
                
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-medium mb-4">Add your skills</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Add skills to showcase your expertise to other users in the community.
                    </p>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Add a skill (e.g., Python, TensorFlow, etc.)"
                        onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                      />
                      <AnimatedButton onClick={addSkill} variant="primary" size="sm">
                        Add
                      </AnimatedButton>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      {profileData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-3 py-1 rounded-full bg-gray-800 text-sm"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="ml-2 text-gray-400 hover:text-white"
                            aria-label={`Remove ${skill} skill`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      
                      {profileData.skills.length === 0 && (
                        <p className="text-sm text-gray-500 italic">No skills added yet</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Footer */}
            <div className="p-6 border-t border-gray-800 flex justify-between">
              <AnimatedButton
                variant="outline"
                size="sm"
                onClick={step === 1 ? onClose : handlePrev}
              >
                {step === 1 ? 'Cancel' : 'Back'}
              </AnimatedButton>
              
              <AnimatedButton
                variant="primary"
                size="sm"
                onClick={handleNext}
              >
                {step === 3 ? 'Complete Profile' : 'Next'}
              </AnimatedButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 