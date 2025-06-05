"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, UserCircle, Upload, Trash2, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ProfileAvatarUploadProps {
  currentAvatarUrl?: string;
  onAvatarChange?: (avatarUrl: string) => void;
  className?: string;
}

const ProfileAvatarUpload: React.FC<ProfileAvatarUploadProps> = ({
  currentAvatarUrl,
  onAvatarChange,
  className = ''
}) => {
  const [avatarUrl, setAvatarUrl] = useState<string>(currentAvatarUrl || '');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update local state when prop changes
  useEffect(() => {
    if (currentAvatarUrl !== undefined) {
      setAvatarUrl(currentAvatarUrl);
    }
  }, [currentAvatarUrl]);

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setUploadError('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      // Create form data for upload
      const formData = new FormData();
      formData.append('avatar', file);

      // Send to API
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload avatar');
      }

      // Update avatar URL
      const newAvatarUrl = data.profile.avatarUrl;
      setAvatarUrl(newAvatarUrl);
      
      // Notify parent component
      if (onAvatarChange) {
        onAvatarChange(newAvatarUrl);
      }
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      setUploadError(error.message || 'Failed to upload avatar');
    } finally {
      setIsUploading(false);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteAvatar = async () => {
    if (!avatarUrl) return;
    
    setIsUploading(true);
    setUploadError('');

    try {
      // Call API to delete avatar
      const response = await fetch('/api/user/profile?field=avatar', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete avatar');
      }

      // Update avatar URL
      setAvatarUrl('');
      
      // Notify parent component
      if (onAvatarChange) {
        onAvatarChange('');
      }
    } catch (error: any) {
      console.error('Avatar deletion error:', error);
      setUploadError(error.message || 'Failed to delete avatar');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative w-24 h-24 mb-4">
        {isUploading ? (
          <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
          </div>
        ) : avatarUrl ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full h-full rounded-full overflow-hidden"
          >
            <Image
              src={avatarUrl}
              alt="Profile avatar"
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ) : (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <UserCircle className="w-12 h-12 text-white" />
          </div>
        )}
        
        {/* Upload/Delete controls */}
        <div className="absolute -bottom-2 -right-2 flex space-x-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleFileSelect}
            className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shadow-md text-white"
            title="Upload avatar"
            type="button"
            disabled={isUploading}
          >
            <Upload className="w-4 h-4" />
          </motion.button>
          
          {avatarUrl && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDeleteAvatar}
              className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shadow-md text-white"
              title="Remove avatar"
              type="button"
              disabled={isUploading}
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>
      
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        aria-label="Upload profile avatar"
      />
      
      {/* Error message */}
      {uploadError && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm mt-2"
        >
          {uploadError}
        </motion.p>
      )}
      
      <p className="text-gray-500 text-xs mt-2">
        Upload a profile pic to make your profile extra lit! 🔥
      </p>
    </div>
  );
};

export default ProfileAvatarUpload; 