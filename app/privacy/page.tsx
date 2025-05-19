"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
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
              Privacy Policy
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
              <h2 className="text-2xl font-bold mb-4">Our Commitment to Privacy</h2>
              <p className="mb-4">
                At Neural Nexus, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, 
                and safeguard your information when you visit our website, use our platform, or interact with our services.
              </p>
              <p>
                Please read this privacy policy carefully. By accessing and using our services, you acknowledge that you have 
                read and understand this policy. This policy is subject to change, so check back periodically for updates.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
              <p className="mb-4">We may collect the following types of information:</p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Personal Data</h3>
              <p className="mb-4">
                While using our service, we may ask you to provide certain personally identifiable information that can be used to contact 
                or identify you. This may include:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Email address</li>
                <li>First name and last name</li>
                <li>Profile picture (optional)</li>
                <li>Usage data and preferences</li>
                <li>Wallet addresses (if you choose to connect crypto wallets)</li>
              </ul>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Usage Data</h3>
              <p>
                We may also collect information on how the service is accessed and used. This may include information such as 
                your computer's IP address, browser type, pages visited, time spent on pages, unique device identifiers, and other diagnostic data.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
              <p className="mb-4">We use the collected data for various purposes:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>To provide and maintain our service</li>
                <li>To notify you about changes to our service</li>
                <li>To allow you to participate in interactive features of our service</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information to improve our service</li>
                <li>To monitor the usage of our service</li>
                <li>To detect, prevent and address technical issues</li>
                <li>To personalize your experience</li>
              </ul>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">Data Retention</h2>
              <p className="mb-4">
                We will retain your personal data only for as long as is necessary for the purposes set out in this Privacy Policy. 
                We will retain and use your data to the extent necessary to comply with our legal obligations, resolve disputes, 
                and enforce our legal agreements and policies.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">Security of Your Data</h2>
              <p className="mb-4">
                The security of your data is important to us, but remember that no method of transmission over the Internet 
                or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, 
                we cannot guarantee its absolute security.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">Your Data Protection Rights</h2>
              <p className="mb-4">
                Depending on your location, you may have certain rights regarding your personal information, such as:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>The right to access, update or delete the information we have on you</li>
                <li>The right of rectification - the right to have your information corrected if it is inaccurate or incomplete</li>
                <li>The right to object to our processing of your personal data</li>
                <li>The right of restriction - the right to request that we restrict the processing of your personal information</li>
                <li>The right to data portability - the right to be provided with a copy of your personal data in a structured, machine-readable format</li>
                <li>The right to withdraw consent at any time where we relied on your consent to process your personal information</li>
              </ul>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">Changes to This Privacy Policy</h2>
              <p className="mb-4">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page 
                and updating the "Last updated" date.
              </p>
              <p>
                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when 
                they are posted on this page.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="mb-4">
                If you have any questions about this Privacy Policy, please contact us:
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