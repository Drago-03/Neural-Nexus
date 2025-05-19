"use client";

import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Shield, FileText, AlertCircle, Info, BookOpen } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  // For toggling sections (Gen-Z style variable naming)
  const [activeSection, setActiveSection] = useState<number | null>(0);

  const toggleSection = (index: number) => {
    setActiveSection(activeSection === index ? null : index);
  };

  // Terms content
  const termsContent = [
    {
      title: "Terms of Use",
      content: `These Terms of Use govern your use of Neural Nexus and all related services. By accessing or using our platform, you agree to be bound by these Terms.

Neural Nexus provides an AI model marketplace and hosting platform that allows users to discover, share, and monetize AI models. We reserve the right to modify these Terms at any time, with changes effective upon posting to the site.`
    },
    {
      title: "User Accounts",
      content: `To access certain features of Neural Nexus, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities associated with your account.

You must provide accurate and complete information when creating your account. You are solely responsible for all content posted and activity that occurs under your account.`
    },
    {
      title: "Content and Models",
      content: `By uploading models to Neural Nexus, you retain ownership of your intellectual property, but grant Neural Nexus a license to host, display, and provide access to your models.

You are solely responsible for the models you upload and must ensure they comply with our Community Guidelines and do not infringe on third-party rights.

Neural Nexus has the right to remove any content that violates these Terms or our Community Guidelines.`
    },
    {
      title: "Monetization and Payments",
      content: `Neural Nexus offers various monetization options for model creators. When you monetize a model, you authorize Neural Nexus to process payments on your behalf.

Neural Nexus will take a platform fee as specified in our current pricing structure. Payments to creators will be made according to our payment schedule.

You are responsible for providing accurate payment information and for any taxes associated with earnings from the platform.`
    },
    {
      title: "API Usage",
      content: `When using the Neural Nexus API, you agree not to:
- Exceed rate limits or circumvent usage restrictions
- Reverse engineer the API or attempt to access unauthorized endpoints
- Use the API for any illegal or prohibited purposes
- Redistribute API access to third parties without authorization

Neural Nexus reserves the right to suspend or terminate API access for violations of these terms.`
    },
    {
      title: "Prohibited Use",
      content: `You agree not to use Neural Nexus for:
- Any illegal activities
- Creating or distributing harmful content or malware
- Infringing on intellectual property rights
- Harassment or abuse
- Attempting to gain unauthorized access to the platform
- Any use that could damage or overburden our infrastructure`
    },
    {
      title: "Termination",
      content: `Neural Nexus may terminate or suspend your account at any time for violations of these Terms or for any other reason without notice.

Upon termination, your right to use Neural Nexus will immediately cease, and we may delete or remove your content from the platform.`
    },
    {
      title: "Disclaimers and Limitations",
      content: `NEURAL NEXUS IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.

TO THE FULLEST EXTENT PERMITTED BY LAW, NEURAL NEXUS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.

OUR LIABILITY IS LIMITED TO THE AMOUNT PAID BY YOU, IF ANY, FOR ACCESS TO THE PLATFORM.`
    },
    {
      title: "Dispute Resolution",
      content: `Any dispute arising from these Terms shall be resolved through binding arbitration. The arbitration will be conducted in English and in a location determined by Neural Nexus.

You waive your right to participate in a class action lawsuit against Neural Nexus.`
    },
    {
      title: "Contact Information",
      content: `If you have any questions about these Terms, please contact us at:

mantejarora@gmail.com

Indie Hub, Inc.
Chandigarh, India`
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />

      <section className="pt-28 pb-10 px-4">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Last updated: May 16, 2025
            </p>
          </motion.div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 p-6 md:p-8 mb-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-purple-600/20 p-3 rounded-lg">
                  <BookOpen className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2">Agreement to Terms</h2>
                  <p className="text-gray-300">
                    By accessing Neural Nexus, you agree to be bound by these Terms of Service. Please read them carefully before using our platform.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-blue-900/20 border border-blue-700/30 rounded-lg p-4 text-sm">
                <Info className="h-5 w-5 text-blue-400 shrink-0" />
                <p>
                  These terms constitute a legally binding agreement between you and Neural Nexus. If you do not agree with these terms, please do not use our services.
                </p>
              </div>
            </div>
            
            {/* Collapsible Sections */}
            <div className="space-y-4 mb-12">
              {termsContent.map((section, index) => (
                <div
                  key={index}
                  className={`border ${
                    activeSection === index ? 'border-purple-500/50 bg-gray-800/50' : 'border-gray-700/50 bg-gray-800/30'
                  } rounded-xl overflow-hidden transition-colors`}
                >
                  <button
                    className="w-full flex justify-between items-center p-5 text-left"
                    onClick={() => toggleSection(index)}
                  >
                    <span className="font-bold text-lg">{section.title}</span>
                    <div className={`h-6 w-6 bg-gray-700 rounded-full flex items-center justify-center transition-transform ${
                      activeSection === index ? 'rotate-180' : ''
                    }`}>
                      <span className="sr-only">Toggle section</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    </div>
                  </button>
                  
                  {activeSection === index && (
                    <div className="p-5 pt-0 border-t border-gray-700/50">
                      <p className="text-gray-300 whitespace-pre-line">
                        {section.content}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="text-center bg-gray-800/30 rounded-xl border border-gray-700/50 p-6 md:p-8">
              <AlertCircle className="h-8 w-8 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Questions About Our Terms?</h2>
              <p className="text-gray-300 mb-6">
                If you have any questions or concerns about our Terms of Service, please contact our support team.
              </p>
              <Link 
                href="/contact" 
                className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
} 