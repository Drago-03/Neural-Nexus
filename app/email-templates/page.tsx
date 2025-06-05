"use client";

import React, { useState } from 'react';
import { 
  generateWelcomeEmail, 
  generatePasswordResetEmail,
  generateVerificationEmail,
  generateNewsletterConfirmation,
  generateTestEmail
} from '@/lib/templates/email-template';
import EmailTester from '@/components/EmailTester';

const EmailTemplatesPage = () => {
  const [activeTemplate, setActiveTemplate] = useState<string>('welcome');
  
  // Sample data for templates
  const sampleName = "Alex";
  const sampleResetLink = "https://neuralnexus.biz/reset-password?token=sample-token";
  const sampleVerificationLink = "https://neuralnexus.biz/verify-email?token=sample-token";
  
  // Generate template HTML
  const getTemplateHtml = () => {
    switch (activeTemplate) {
      case 'welcome':
        return generateWelcomeEmail(sampleName);
      case 'reset':
        return generatePasswordResetEmail(sampleResetLink);
      case 'verify':
        return generateVerificationEmail(sampleVerificationLink);
      case 'newsletter':
        return generateNewsletterConfirmation();
      case 'test':
        return generateTestEmail();
      default:
        return generateWelcomeEmail(sampleName);
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Neural Nexus Email Templates</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Template selector */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setActiveTemplate('welcome')}
              className={`px-4 py-2 rounded-lg ${activeTemplate === 'welcome' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Welcome Email
            </button>
            <button
              onClick={() => setActiveTemplate('reset')}
              className={`px-4 py-2 rounded-lg ${activeTemplate === 'reset' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Password Reset
            </button>
            <button
              onClick={() => setActiveTemplate('verify')}
              className={`px-4 py-2 rounded-lg ${activeTemplate === 'verify' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Email Verification
            </button>
            <button
              onClick={() => setActiveTemplate('newsletter')}
              className={`px-4 py-2 rounded-lg ${activeTemplate === 'newsletter' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Newsletter Subscription
            </button>
            <button
              onClick={() => setActiveTemplate('test')}
              className={`px-4 py-2 rounded-lg ${activeTemplate === 'test' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Test Email
            </button>
          </div>
          
          {/* Email preview */}
          <div className="border border-gray-300 rounded-lg overflow-hidden shadow-lg">
            <div className="bg-gray-100 border-b border-gray-300 px-4 py-2 flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm text-gray-600 flex-1 text-center">Email Preview</span>
            </div>
            
            <div className="bg-white" style={{ height: '600px' }}>
              <iframe
                srcDoc={getTemplateHtml()}
                title="Email Template Preview"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
        
        <div>
          <EmailTester />
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          You can test sending these emails using the EmailTester component or the <code>/api/email/template-test</code> endpoint.
        </p>
      </div>
    </div>
  );
};

export default EmailTemplatesPage; 