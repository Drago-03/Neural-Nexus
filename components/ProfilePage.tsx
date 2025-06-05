/**
 * Profile Page Component
 * 
 * Displays a user profile with avatar and profile information
 */

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { UserProfile } from '../lib/services/user-profile-service';

interface ProfilePageProps {
  userId?: string;
  editable?: boolean;
}

export default function ProfilePage({ userId = 'test-user', editable = false }: ProfilePageProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    socialLinks: {
      twitter: '',
      github: '',
      linkedin: '',
      website: ''
    }
  });

  // Fetch profile data
  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const res = await fetch(`/api/profile`, {
          headers: {
            'X-User-ID': userId
          }
        });
        
        if (!res.ok) {
          if (res.status === 404) {
            // Profile doesn't exist yet, create a default one
            setProfile(null);
            setFormData({
              displayName: 'New User',
              bio: '',
              socialLinks: {
                twitter: '',
                github: '',
                linkedin: '',
                website: ''
              }
            });
            setEditMode(true);
          } else {
            throw new Error(`Failed to fetch profile: ${res.statusText}`);
          }
        } else {
          const data = await res.json();
          setProfile(data);
          setFormData({
            displayName: data.displayName || '',
            bio: data.bio || '',
            socialLinks: {
              twitter: data.socialLinks?.twitter || '',
              github: data.socialLinks?.github || '',
              linkedin: data.socialLinks?.linkedin || '',
              website: data.socialLinks?.website || ''
            }
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProfile();
  }, [userId]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('social-')) {
      const socialNetwork = name.replace('social-', '');
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialNetwork]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatarFile(e.target.files[0]);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      
      const res = await fetch('/api/profile/avatar', {
        method: 'POST',
        headers: {
          'X-User-ID': userId
        },
        body: formData
      });
      
      if (!res.ok) {
        throw new Error(`Failed to upload avatar: ${res.statusText}`);
      }
      
      const data = await res.json();
      
      // Update profile with new avatar URL
      setProfile(prev => prev ? {
        ...prev,
        avatarUrl: data.avatarUrl
      } : null);
      
      setAvatarFile(null);
    } catch (err) {
      console.error('Error uploading avatar:', err);
      setError('Failed to upload avatar');
    }
  };

  // Handle profile save
  const handleProfileSave = async () => {
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': userId
        },
        body: JSON.stringify({
          displayName: formData.displayName,
          bio: formData.bio,
          socialLinks: formData.socialLinks
        })
      });
      
      if (!res.ok) {
        throw new Error(`Failed to save profile: ${res.statusText}`);
      }
      
      const data = await res.json();
      setProfile(data);
      setEditMode(false);
      
      // Upload avatar if selected
      if (avatarFile) {
        await handleAvatarUpload();
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile');
    }
  };

  // Handle avatar deletion
  const handleDeleteAvatar = async () => {
    try {
      const res = await fetch('/api/profile/avatar', {
        method: 'DELETE',
        headers: {
          'X-User-ID': userId
        }
      });
      
      if (!res.ok) {
        throw new Error(`Failed to delete avatar: ${res.statusText}`);
      }
      
      // Update profile to remove avatar URL
      setProfile(prev => prev ? {
        ...prev,
        avatarUrl: undefined
      } : null);
    } catch (err) {
      console.error('Error deleting avatar:', err);
      setError('Failed to delete avatar');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
        <button 
          className="mt-2 text-sm underline"
          onClick={() => window.location.reload()}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        {/* Avatar */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            {profile?.avatarUrl ? (
              <Image 
                src={profile.avatarUrl} 
                alt={profile.displayName} 
                width={128} 
                height={128} 
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="text-4xl text-gray-400">
                {formData.displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          {editable && editMode && (
            <div className="mt-2 flex flex-col gap-2">
              <label 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" 
                htmlFor="avatar-upload"
              >
                Avatar
              </label>
              <input 
                id="avatar-upload"
                type="file" 
                accept="image/*"
                onChange={handleAvatarChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                aria-label="Upload profile avatar"
                title="Choose a profile avatar image"
                placeholder="Choose a profile avatar image"
              />
              {profile?.avatarUrl && (
                <button
                  type="button"
                  onClick={handleDeleteAvatar}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  Remove avatar
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Profile Info */}
        <div className="flex-1">
          {editMode ? (
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              placeholder="Display Name"
              className="text-2xl font-bold w-full border-b border-gray-300 pb-1 mb-2 focus:outline-none focus:border-blue-500"
            />
          ) : (
            <h1 className="text-2xl font-bold">{profile?.displayName || 'User'}</h1>
          )}
          
          <div className="text-gray-500 mb-4">User ID: {userId}</div>
          
          {editMode ? (
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself..."
              rows={3}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-700">{profile?.bio || 'No bio provided.'}</p>
          )}
        </div>
      </div>
      
      {/* Social Links */}
      <div className="border-t border-gray-200 pt-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Social Links</h2>
        
        {editMode ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Twitter
              </label>
              <input
                type="text"
                name="social-twitter"
                value={formData.socialLinks.twitter}
                onChange={handleInputChange}
                placeholder="@username"
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GitHub
              </label>
              <input
                type="text"
                name="social-github"
                value={formData.socialLinks.github}
                onChange={handleInputChange}
                placeholder="username"
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn
              </label>
              <input
                type="text"
                name="social-linkedin"
                value={formData.socialLinks.linkedin}
                onChange={handleInputChange}
                placeholder="username"
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                type="text"
                name="social-website"
                value={formData.socialLinks.website}
                onChange={handleInputChange}
                placeholder="https://example.com"
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
            {profile?.socialLinks?.twitter && (
              <a href={`https://twitter.com/${profile.socialLinks.twitter}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                <span>Twitter:</span> @{profile.socialLinks.twitter}
              </a>
            )}
            {profile?.socialLinks?.github && (
              <a href={`https://github.com/${profile.socialLinks.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                <span>GitHub:</span> {profile.socialLinks.github}
              </a>
            )}
            {profile?.socialLinks?.linkedin && (
              <a href={`https://linkedin.com/in/${profile.socialLinks.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                <span>LinkedIn:</span> {profile.socialLinks.linkedin}
              </a>
            )}
            {profile?.socialLinks?.website && (
              <a href={profile.socialLinks.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                <span>Website:</span> {profile.socialLinks.website}
              </a>
            )}
            {!profile?.socialLinks?.twitter && !profile?.socialLinks?.github && 
             !profile?.socialLinks?.linkedin && !profile?.socialLinks?.website && (
              <p className="text-gray-500 col-span-2">No social links provided.</p>
            )}
          </div>
        )}
      </div>
      
      {/* Action Buttons */}
      {editable && (
        <div className="flex justify-end gap-3 mt-6">
          {editMode ? (
            <>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleProfileSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Profile
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setEditMode(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit Profile
            </button>
          )}
        </div>
      )}
    </div>
  );
} 