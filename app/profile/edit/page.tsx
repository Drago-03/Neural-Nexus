"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Save, Loader2, ArrowLeft, Github, Twitter, Linkedin, Globe } from 'lucide-react';
import ProfileAvatarUpload from '@/components/ProfileAvatarUpload';

// Define the profile type
interface UserProfile {
  id: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
    [key: string]: string | undefined;
  };
}

const ProfileEditPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Form state
  const [profile, setProfile] = useState<UserProfile>({
    id: '',
    displayName: '',
    bio: '',
    avatarUrl: '',
    socialLinks: {
      twitter: '',
      github: '',
      linkedin: '',
      website: ''
    }
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Load user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (status === 'loading') return;
      
      if (status === 'unauthenticated') {
        router.push('/signin');
        return;
      }
      
      try {
        const response = await fetch('/api/user/profile');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to load profile');
        }
        
        if (data.profile) {
          setProfile({
            id: data.profile.id || '',
            displayName: data.profile.displayName || '',
            bio: data.profile.bio || '',
            avatarUrl: data.profile.avatarUrl || '',
            socialLinks: {
              twitter: data.profile.socialLinks?.twitter || '',
              github: data.profile.socialLinks?.github || '',
              linkedin: data.profile.socialLinks?.linkedin || '',
              website: data.profile.socialLinks?.website || ''
            }
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [status, router]);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('social-')) {
      const socialNetwork = name.replace('social-', '');
      setProfile(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialNetwork]: value
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle avatar change
  const handleAvatarChange = (avatarUrl: string) => {
    setProfile(prev => ({
      ...prev,
      avatarUrl
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSaving(true);
    setSaveError('');
    setSaveSuccess(false);
    
    try {
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          displayName: profile.displayName,
          bio: profile.bio,
          socialLinks: profile.socialLinks
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save profile');
      }
      
      setSaveSuccess(true);
      
      // Navigate back to profile after successful save
      setTimeout(() => {
        router.push('/profile');
      }, 1500);
    } catch (error: any) {
      console.error('Error saving profile:', error);
      setSaveError(error.message || 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        <p className="mt-4 text-gray-500">Loading your profile...</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Edit Your Profile
        </h1>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left column - Avatar */}
            <div className="flex flex-col items-center">
              <ProfileAvatarUpload
                currentAvatarUrl={profile.avatarUrl}
                onAvatarChange={handleAvatarChange}
                className="mb-6"
              />
            </div>
            
            {/* Right column - Form fields */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Display Name
                </label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={profile.displayName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="What should we call you?"
                  maxLength={50}
                />
              </div>
              
              <div>
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={profile.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                  placeholder="Tell us about yourself (keep it lit! 🔥)"
                  maxLength={250}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {profile.bio?.length || 0}/250 characters
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Social Links
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Twitter className="w-5 h-5 text-blue-400" />
                    <input
                      type="text"
                      id="social-twitter"
                      name="social-twitter"
                      value={profile.socialLinks?.twitter || ''}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Twitter username"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Github className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    <input
                      type="text"
                      id="social-github"
                      name="social-github"
                      value={profile.socialLinks?.github || ''}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="GitHub username"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Linkedin className="w-5 h-5 text-blue-600" />
                    <input
                      type="text"
                      id="social-linkedin"
                      name="social-linkedin"
                      value={profile.socialLinks?.linkedin || ''}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="LinkedIn username"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-green-500" />
                    <input
                      type="text"
                      id="social-website"
                      name="social-website"
                      value={profile.socialLinks?.website || ''}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Website URL"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Save button and status */}
          <div className="mt-8 flex flex-col items-center">
            {saveError && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 mb-4"
              >
                {saveError}
              </motion.p>
            )}
            
            {saveSuccess && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-green-500 mb-4"
              >
                Profile saved successfully! Redirecting...
              </motion.p>
            )}
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSaving}
              className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save Profile
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditPage; 