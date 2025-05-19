"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CookiePolicy() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />
      
      <div className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div 
            className="mb-8 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-pink-500">
              Cookie Policy
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Last updated: May 16, 2025
            </p>
          </motion.div>
          
          <motion.div
            className="prose prose-lg prose-invert max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">Introduction</h2>
              <p className="mb-4">
                Neural Nexus uses cookies and similar technologies on our website and application.
                By using the Neural Nexus Platform, you consent to the use of cookies.
              </p>
              <p>
                This Cookie Policy explains what cookies are, how we use them, your choices regarding cookies,
                and further information about cookies.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">What Are Cookies</h2>
              <p className="mb-4">
                Cookies are small pieces of text sent by your web browser by a website you visit. A cookie file is 
                stored in your web browser and allows the service or a third-party to recognize you and make your 
                next visit easier and more useful to you.
              </p>
              <p>
                Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your device when you 
                go offline, while session cookies are deleted as soon as you close your web browser.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">How Neural Nexus Uses Cookies</h2>
              <p className="mb-4">We use cookies for the following purposes:</p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Essential Cookies</h3>
              <p className="mb-4">
                These cookies are necessary for the Neural Nexus Platform to function and cannot be switched off in our systems.
                They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy 
                preferences, logging in or filling in forms.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Performance and Analytics Cookies</h3>
              <p className="mb-4">
                These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.
                They help us to know which pages are the most and least popular and see how visitors move around the site.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Functionality Cookies</h3>
              <p className="mb-4">
                These cookies enable the website to provide enhanced functionality and personalization.
                They may be set by us or by third party providers whose services we have added to our pages.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Targeting Cookies</h3>
              <p>
                These cookies may be set through our site by our advertising partners.
                They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">Third-Party Cookies</h2>
              <p className="mb-4">
                In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the Neural Nexus Platform.
                These may include:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Google Analytics</li>
                <li>Firebase Analytics</li>
                <li>Mixpanel</li>
                <li>Supabase analytics</li>
              </ul>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">What Are Your Choices Regarding Cookies</h2>
              <p className="mb-4">
                If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser.
              </p>
              <p className="mb-4">
                Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer, 
                you may not be able to store your preferences, and some of our pages might not display properly.
              </p>
              <p className="mb-4">You can learn more about cookies at the following third-party websites:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>AllAboutCookies: <a href="https://www.allaboutcookies.org/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">https://www.allaboutcookies.org/</a></li>
                <li>Network Advertising Initiative: <a href="https://www.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">https://www.networkadvertising.org/</a></li>
              </ul>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">How to Manage Cookies</h2>
              <p className="mb-4">
                You can set your browser not to accept cookies, and the above websites tell you how to remove cookies from your browser.
                However, in a few cases, some of our website features may not function as a result.
              </p>
              <p>
                Below are links to instructions on how to manage and delete cookies from the most popular web browsers:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Mozilla Firefox</a></li>
                <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Safari</a></li>
                <li><a href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Microsoft Edge</a></li>
              </ul>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">Changes to This Cookie Policy</h2>
              <p className="mb-4">
                We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page 
                and updating the "Last updated" date.
              </p>
              <p>
                You are advised to review this Cookie Policy periodically for any changes. Changes to this Cookie Policy are effective when 
                they are posted on this page.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="mb-4">
                If you have any questions about our Cookie Policy, please contact us:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>By email: mantejarora@gmail.com</li>
                <li>By visiting the contact page on our website: <a href="/contact" className="text-blue-400 hover:text-blue-300 underline">Contact Us</a></li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
} 