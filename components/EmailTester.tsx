"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const EmailTester = () => {
  const [email, setEmail] = useState('');
  const [template, setTemplate] = useState('test');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    transportType?: string;
    timeTaken?: string;
  } | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setResult({
        success: false,
        message: 'Please enter an email address'
      });
      return;
    }
    
    setIsLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/email/template-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          template
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send test email');
      }
      
      setResult({
        success: true,
        message: data.message,
        transportType: data.transportType,
        timeTaken: data.timeTaken
      });
    } catch (error: any) {
      console.error('Error sending test email:', error);
      
      setResult({
        success: false,
        message: error.message || 'Failed to send test email'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6">
      <div className="flex items-center mb-6">
        <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-4">
          <Mail className="h-5 w-5 text-purple-400" />
        </div>
        <h2 className="text-xl font-bold">
          Test Email Templates
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="your.email@example.com"
          />
        </div>
        
        <div>
          <label htmlFor="template" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Template
          </label>
          <select
            id="template"
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="test">Test Email</option>
            <option value="welcome">Welcome Email</option>
            <option value="reset">Password Reset</option>
            <option value="verify">Email Verification</option>
            <option value="newsletter">Newsletter Subscription</option>
          </select>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            'Send Test Email'
          )}
        </motion.button>
      </form>
      
      {result && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-6 p-4 rounded-lg ${
            result.success ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'
          }`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-400" />
              )}
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${
                result.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
              }`}>
                {result.success ? 'Success!' : 'Error'}
              </h3>
              <div className={`mt-2 text-sm ${
                result.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
              }`}>
                <p>{result.message}</p>
                {result.success && result.transportType && (
                  <p className="mt-1">Transport: {result.transportType}</p>
                )}
                {result.success && result.timeTaken && (
                  <p className="mt-1">Time taken: {result.timeTaken}</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default EmailTester; 