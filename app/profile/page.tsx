"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Edit, UserCircle, Loader2, ExternalLink, Github, Twitter, Linkedin, Globe } from 'lucide-react';

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
  createdAt?: string;
  updatedAt?: string;
}

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // State
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Load user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (status === 'loading') return;
      
      if (status === 'unauthenticated') {
        router.push('/signin');
        return;
      }
      
      try {
        setIsLoading(true);
        const response = await fetch('/api/user/profile');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to load profile');
        }
        
        if (data.profile) {
          setProfile(data.profile);
        }
      } catch (error: any) {
        console.error('Error loading profile:', error);
        setError(error.message || 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [status, router]);
  
  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        <p className="mt-4 text-gray-500">Loading your profile...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => router.push('/profile/edit')}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Create Your Profile
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        {/* Profile header */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-32 relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/profile/edit')}
            className="absolute top-4 right-4 bg-white text-gray-800 p-2 rounded-full shadow-md hover:shadow-lg transition-shadow"
            aria-label="Edit profile"
          >
            <Edit className="w-5 h-5" />
          </motion.button>
        </div>
        
        {/* Profile content */}
        <div className="px-6 py-8 -mt-16 relative">
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-white">
              {profile?.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt={profile.displayName || 'User'}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <UserCircle className="w-16 h-16 text-white" />
                </div>
              )}
            </div>
          </div>
          
          {/* Profile info */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {profile?.displayName || session?.user?.name || 'Anonymous User'}
            </h1>
            
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {session?.user?.email || 'No email provided'}
            </p>
            
            {profile?.bio && (
              <p className="mt-4 text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                {profile.bio}
              </p>
            )}
            
            {profile?.createdAt && (
              <p className="text-xs text-gray-500 mt-4">
                Member since {formatDate(profile.createdAt)}
              </p>
            )}
          </div>
          
          {/* Social links */}
          {profile?.socialLinks && Object.values(profile.socialLinks).some(link => !!link) && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 text-center">
                Connect with me
              </h2>
              
              <div className="flex flex-wrap justify-center gap-4">
                {profile.socialLinks.twitter && (
                  <a
                    href={`https://twitter.com/${profile.socialLinks.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Twitter className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-800 dark:text-gray-200">@{profile.socialLinks.twitter}</span>
                  </a>
                )}
                
                {profile.socialLinks.github && (
                  <a
                    href={`https://github.com/${profile.socialLinks.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Github className="w-5 h-5 text-gray-800 dark:text-gray-200" />
                    <span className="text-gray-800 dark:text-gray-200">{profile.socialLinks.github}</span>
                  </a>
                )}
                
                {profile.socialLinks.linkedin && (
                  <a
                    href={`https://linkedin.com/in/${profile.socialLinks.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Linkedin className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-800 dark:text-gray-200">{profile.socialLinks.linkedin}</span>
                  </a>
                )}
                
                {profile.socialLinks.website && (
                  <a
                    href={profile.socialLinks.website.startsWith('http') 
                      ? profile.socialLinks.website 
                      : `https://${profile.socialLinks.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Globe className="w-5 h-5 text-green-500" />
                    <span className="text-gray-800 dark:text-gray-200">
                      {profile.socialLinks.website.replace(/^https?:\/\//, '')}
                    </span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Want to update your profile?{' '}
          <button
            onClick={() => router.push('/profile/edit')}
            className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
          >
            Edit Profile
          </button>
        </p>
      </div>
    </div>
  );
};

export default ProfilePage; 