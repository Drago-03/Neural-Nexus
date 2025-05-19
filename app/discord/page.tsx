"use client";

import React, { useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { 
  MessageSquare, 
  Users, 
  Zap, 
  Heart, 
  Code, 
  Sparkles,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

export default function DiscordPage() {
  // Redirect to Discord after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "https://discord.gg/FrtydvAh";
    }, 10000); // Redirect after 10 seconds
    
    return () => clearTimeout(timer);
  }, []);

  // Benefits of joining the Discord
  const discordBenefits = [
    {
      icon: <Users className="h-6 w-6 text-blue-400" />,
      title: "Connect with the Community",
      description: "Join thousands of AI enthusiasts, developers, and researchers discussing the latest in AI technology."
    },
    {
      icon: <Code className="h-6 w-6 text-purple-400" />,
      title: "Get Technical Support",
      description: "Ask questions and get help with implementing Neural Nexus APIs, model deployment, and more."
    },
    {
      icon: <Sparkles className="h-6 w-6 text-yellow-400" />,
      title: "Share Your Projects",
      description: "Showcase your AI projects, get feedback, and collaborate with other community members."
    },
    {
      icon: <Zap className="h-6 w-6 text-green-400" />,
      title: "Stay Up-to-Date",
      description: "Get real-time updates on new features, models, and platform announcements."
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />

      <section className="pt-28 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-600/30 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-60 -left-20 w-80 h-80 bg-purple-600/30 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-40 right-20 w-80 h-80 bg-blue-600/30 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-500 to-blue-500">
              Join Our Discord Community
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Connect with other AI enthusiasts, get support, and stay up-to-date with the latest Neural Nexus updates.
            </p>
            
            <div className="p-3 bg-indigo-900/20 border border-indigo-500/20 rounded-lg mb-8 max-w-md mx-auto">
              <p className="text-sm text-gray-300">
                Redirecting to Discord in a few seconds...
                <br />
                If you're not redirected, click the button below.
              </p>
            </div>
            
            <a 
              href="https://discord.gg/FrtydvAh" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 py-3 px-6 rounded-lg transition-colors text-lg font-medium"
            >
              Join Discord
              <ExternalLink className="ml-2 h-5 w-5" />
            </a>
          </motion.div>
          
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8 max-w-4xl mx-auto">
            {/* Discord Preview */}
            <div className="bg-[#36393f] rounded-lg p-4 mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-600 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                  <span className="font-bold text-white">N</span>
                </div>
                <div>
                  <h3 className="font-bold text-white">Neural Nexus</h3>
                  <p className="text-gray-400 text-sm">10,000+ members online</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex">
                  <div className="bg-gray-700 h-8 w-8 rounded-full flex items-center justify-center mr-2 shrink-0">
                    <span className="font-medium text-xs text-white">A</span>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-2 max-w-[80%]">
                    <p className="text-sm text-white">Hey everyone! Just launched my first model on Neural Nexus!</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="bg-gray-700 h-8 w-8 rounded-full flex items-center justify-center mr-2 shrink-0">
                    <span className="font-medium text-xs text-white">B</span>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-2 max-w-[80%]">
                    <p className="text-sm text-white">That's awesome! What type of model did you create?</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="bg-gray-700 h-8 w-8 rounded-full flex items-center justify-center mr-2 shrink-0">
                    <span className="font-medium text-xs text-white">C</span>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-2 max-w-[80%]">
                    <p className="text-sm text-white">I've been having issues with the API, can anyone help?</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="bg-indigo-600 h-8 w-8 rounded-full flex items-center justify-center mr-2 shrink-0">
                    <span className="font-medium text-xs text-white">N</span>
                  </div>
                  <div className="bg-indigo-600/20 border border-indigo-600/30 rounded-lg p-2 max-w-[80%]">
                    <p className="text-sm text-white">Hi there! Our team can help with any API issues. Can you share more details in the #support channel?</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-700/30 rounded-lg p-2 flex items-center">
                <input 
                  type="text" 
                  disabled
                  placeholder="Message #general"
                  className="bg-transparent border-none outline-none text-gray-300 text-sm w-full" 
                />
              </div>
            </div>
            
            {/* Benefits */}
            <h2 className="text-2xl font-bold mb-6 text-center">Why Join Our Discord?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {discordBenefits.map((benefit, index) => (
                <motion.div 
                  key={index}
                  className="flex items-start bg-gray-800/50 rounded-lg p-4 border border-gray-700/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="mr-4 mt-1">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">{benefit.title}</h3>
                    <p className="text-sm text-gray-300">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <a 
                href="https://discord.gg/FrtydvAh" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 py-2 px-4 rounded-lg transition-colors"
              >
                Join Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
} 