"use client";

import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { 
  Heart, 
  Globe, 
  Zap, 
  Shield, 
  Users, 
  Sparkles,
  ArrowRight,
  Github,
  Linkedin,
  Mail
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import AnimatedLogo from "@/components/AnimatedLogo";

export default function AboutPage() {
  // Team members data
  const teamMembers = [
    {
      name: "Mantej Singh",
      role: "Founder",
      image: "/team/Mantej.png",
      bio: "Visionary founder with a passion for democratizing AI. Leading Neural Nexus to transform how AI models are shared and monetized.",
      social: {
        linkedin: "https://www.linkedin.com/in/mantej-singh-arora/",
        github: "https://github.com/Drago-03/Neural-Nexus"
      }
    },
    {
      name: "Avya Giri",
      role: "CTO",
      image: "/team/Avya.png",
      bio: "Experienced ML engineer leading our technical infrastructure. Expert in optimizing model performance and scalability.",
      social: {
        linkedin: "https://www.linkedin.com/in/avya-giri/",
        github: "https://github.com/AvyaGiri"
      }
    },
    {
      name: "Fatima K",
      role: "CEO",
      image: "/team/Fatima.png",
      bio: "Strategic leader driving business growth and partnerships. Passionate about the intersection of AI and business innovation.",
      social: {
        linkedin: "https://www.linkedin.com/in/mantej-singh-arora/",
        github: "https://github.com/Drago-03/Neural-Nexus"
      }
    }
  ];

  // Company values
  const values = [
    {
      icon: <Heart className="h-8 w-8 text-pink-400" />,
      title: "User-Centric",
      description: "We build for real users solving real problems, not for hype or buzzwords."
    },
    {
      icon: <Globe className="h-8 w-8 text-blue-400" />,
      title: "Accessible to All",
      description: "AI should be accessible to everyone, not just big tech companies and research labs."
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-400" />,
      title: "Responsible AI",
      description: "We prioritize ethical considerations, safety, and transparency in everything we do."
    },
    {
      icon: <Sparkles className="h-8 w-8 text-yellow-400" />,
      title: "Innovation First",
      description: "We constantly push the boundaries of what's possible with AI technology."
    },
    {
      icon: <Users className="h-8 w-8 text-green-400" />,
      title: "Community Driven",
      description: "Our platform is built with and for our community of creators and developers."
    },
    {
      icon: <Zap className="h-8 w-8 text-orange-400" />,
      title: "Performance Obsessed",
      description: "We're relentlessly focused on making our platform fast, reliable, and scalable."
    }
  ];
  
  // Company timeline
  const timeline = [
    {
      year: "2024 Dec",
      title: "The Beginning",
      description: "Neural Nexus founded with a mission to democratize AI model sharing and deployment."
    },
    {
      year: "2025 Feb",
      title: "Alpha Launch",
      description: "First version of the platform launched with basic model hosting capabilities."
    },
    {
      year: "2025 Mar",
      title: "Seed Funding",
      description: "$5M seed round from leading AI-focused investors to accelerate development."
    },
    {
      year: "2025 Apr",
      title: "Beta Platform",
      description: "Comprehensive beta platform with full model marketplace, API, and community features."
    },
    {
      year: "2025 Apr",
      title: "Series A",
      description: "$25M Series A funding to scale infrastructure and expand the team."
    },
    {
      year: "2025 May",
      title: "Official Launch",
      description: "Public launch of Neural Nexus with thousands of models and growing community."
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/30 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-60 -left-20 w-80 h-80 bg-blue-600/30 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-40 right-20 w-80 h-80 bg-pink-600/30 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 inline-block"
            >
              <span className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full text-sm font-medium">
                Our Story
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-pink-500"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              We're Making AI Accessible to Everyone
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-300 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Neural Nexus is building the infrastructure to democratize AI innovation. 
              We're on a mission to make it easy for anyone to share, discover, and deploy 
              state-of-the-art AI models.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link 
                href="/careers" 
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors flex items-center"
              >
                Join Our Team
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link 
                href="/contact" 
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
              >
                Contact Us
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 bg-gray-900/50">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-gray-300 text-lg mb-6">
                Neural Nexus was founded on a simple but powerful idea: AI models should be 
                easily accessible to everyone, not just big tech companies and research labs.
              </p>
              <p className="text-gray-300 text-lg mb-6">
                We're building the infrastructure layer that makes it easy for AI creators to 
                share their models, and for developers to discover and deploy them in their applications.
              </p>
              <p className="text-gray-300 text-lg mb-6">
                By connecting creators and users of AI models, we're creating a vibrant ecosystem 
                that accelerates innovation and democratizes access to cutting-edge AI technology.
              </p>
              <div className="flex items-center gap-4 text-lg">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 bg-purple-500 rounded-full"></span>
                  <span className="font-medium">32k+ Models</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 bg-blue-500 rounded-full"></span>
                  <span className="font-medium">15k+ Creators</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 bg-pink-500 rounded-full"></span>
                  <span className="font-medium">120M+ API Calls</span>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 relative">
              <div className="aspect-video rounded-xl overflow-hidden relative">
                {/* Blurred background with gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-blue-600/20 to-cyan-600/30 backdrop-blur-lg"></div>
                
                {/* Animated particles or dots */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-purple-500 rounded-full filter blur-xl animate-pulse"></div>
                  <div className="absolute bottom-1/3 right-1/4 w-16 h-16 bg-blue-500 rounded-full filter blur-xl animate-pulse animation-delay-1000"></div>
                  <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-cyan-500 rounded-full filter blur-xl animate-pulse animation-delay-2000"></div>
                </div>
                
                {/* Logo and text container */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                  <div className="mb-6">
                    <AnimatedLogo width={120} height={120} />
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-transparent bg-clip-text mb-4">
                    Neural Nexus
                  </h3>
                  <p className="text-white/90 text-center text-lg max-w-md">
                    Building the future of AI democratization, one model at a time
                  </p>
                </div>
              </div>
              
              {/* Floating cards */}
              <div className="absolute -top-6 -left-6 bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg border border-gray-700/50 shadow-xl max-w-[180px]">
                <div className="text-sm font-medium mb-1">Active Users</div>
                <div className="text-2xl font-bold text-purple-400">250k+</div>
                <div className="text-xs text-gray-400">Growing 25% monthly</div>
              </div>
              
              <div className="absolute -bottom-6 -right-6 bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg border border-gray-700/50 shadow-xl max-w-[180px]">
                <div className="text-sm font-medium mb-1">Countries</div>
                <div className="text-2xl font-bold text-blue-400">120+</div>
                <div className="text-xs text-gray-400">Global community</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-gray-300 text-lg">
              These core principles guide everything we do at Neural Nexus, from product development to community building.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-gray-300">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 px-4 bg-gray-900/50 overflow-hidden">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
            <p className="text-gray-300 text-lg">
              From humble beginnings to a thriving AI platform - here's how we got started.
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-800"></div>
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  className={`flex flex-col md:flex-row items-center gap-8 relative ${
                    index % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full bg-purple-600 z-10"></div>
                  
                  <div className="md:w-1/2"></div>
                  
                  <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50 md:w-1/2">
                    <div className="text-sm text-purple-400 font-medium mb-2">{item.year}</div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-300">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-gray-300 text-lg">
              We're a passionate group of engineers, researchers, and designers building the future of AI.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/30 rounded-xl overflow-hidden border border-gray-700/50 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="aspect-square bg-gray-900 relative overflow-hidden">
                  {member.image ? (
                    <Image 
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const container = target.parentElement;
                        if (container) {
                          const fallback = document.createElement('div');
                          fallback.className = 'absolute inset-0 flex items-center justify-center';
                          fallback.innerHTML = `<div class="text-3xl">${member.name.charAt(0)}</div>`;
                          container.appendChild(fallback);
                        }
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-3xl">{member.name.charAt(0)}</div>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black to-transparent"></div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <div className="text-purple-400 mb-4">{member.role}</div>
                  <p className="text-gray-300 text-sm mb-4">{member.bio}</p>
                  
                  <div className="flex space-x-2 mt-4">
                    <a 
                      href={member.social.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                      aria-label={`${member.name}'s GitHub`}
                    >
                      <Github size={18} />
                    </a>
                    <a 
                      href={member.social.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                      aria-label={`${member.name}'s LinkedIn`}
                    >
                      <Linkedin size={18} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">Join Us on Our Journey</h2>
          <p className="text-xl text-gray-300 mb-8">
            Whether you're an AI creator, developer, or enthusiast, there's a place for you in the Neural Nexus community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/careers" 
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
            >
              View Open Positions
            </Link>
            <Link 
              href="/community" 
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
            >
              Join Our Community
            </Link>
          </div>
          <div className="mt-8 text-center">
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <p className="mb-2"><span className="text-purple-400">Email:</span> mantejarora@gmail.com</p>
            <p className="mb-2"><span className="text-purple-400">Phone:</span> +91-9805763104</p>
            <p className="mb-4"><span className="text-purple-400">Location:</span> Indie Hub office, Chandigarh, India</p>
            <div className="flex justify-center gap-4">
              <a
                href="https://github.com/Drago-03/Neural-Nexus"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="h-6 w-6" />
              </a>
              <a
                href="https://www.linkedin.com/in/mantej-singh-arora/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a
                href="mailto:mantejarora@gmail.com"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
} 