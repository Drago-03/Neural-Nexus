"use client";

import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { 
  Building, 
  Users, 
  Target, 
  Trophy,
  ArrowRight,
  MapPin,
  Mail,
  Phone,
  ExternalLink,
  ChevronRight,
  Github,
  Linkedin
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CompanyPage() {
  // Company stats
  const companyStats = [
    { label: "Founded", value: "2021" },
    { label: "Employees", value: "120+" },
    { label: "Countries", value: "25+" },
    { label: "Models Hosted", value: "50K+" }
  ];
  
  // Company milestones
  const companyMilestones = [
    {
      year: 2021,
      quarter: "Q2",
      title: "Company Founded",
      description: "Neural Nexus was founded by a team of AI researchers and engineers with a vision to democratize AI model deployment."
    },
    {
      year: 2021,
      quarter: "Q4",
      title: "Seed Funding",
      description: "Raised $5M seed round led by TechVentures with participation from AI Capital and several angel investors."
    },
    {
      year: 2022,
      quarter: "Q2",
      title: "Platform Launch",
      description: "Launched the first version of the Neural Nexus platform with support for hosting transformer-based language models."
    },
    {
      year: 2022,
      quarter: "Q3",
      title: "10,000 Users",
      description: "Reached 10,000 registered developers on the platform and expanded the team to 50 employees."
    },
    {
      year: 2023,
      quarter: "Q1",
      title: "Series A Funding",
      description: "Secured $25M Series A funding to accelerate growth and expand model support capabilities."
    },
    {
      year: 2023,
      quarter: "Q3",
      title: "Marketplace Launch",
      description: "Launched the AI model marketplace, enabling developers to monetize their models and share them with the community."
    },
    {
      year: 2024,
      quarter: "Q1",
      title: "Enterprise Edition",
      description: "Released Neural Nexus Enterprise with advanced security, compliance, and management features for large organizations."
    },
    {
      year: 2024,
      quarter: "Q2",
      title: "Global Expansion",
      description: "Opened offices in London, Singapore, and Berlin to better serve our growing global customer base."
    }
  ];
  
  // Office locations
  const officeLocations = [
    {
      city: "San Francisco",
      country: "USA",
      address: "100 AI Street, San Francisco, CA 94105",
      role: "Headquarters",
      image: "/offices/sf.jpg"
    },
    {
      city: "London",
      country: "UK",
      address: "24 Tech Lane, London, EC1V 9NR",
      role: "European HQ",
      image: "/offices/london.jpg"
    },
    {
      city: "Singapore",
      country: "Singapore",
      address: "80 Robinson Road, #15-01, Singapore 068898",
      role: "APAC HQ",
      image: "/offices/singapore.jpg"
    },
    {
      city: "Berlin",
      country: "Germany",
      address: "Friedrichstraße 123, 10117 Berlin",
      role: "Research Lab",
      image: "/offices/berlin.jpg"
    }
  ];
  
  // Press releases
  const pressReleases = [
    {
      date: "May 10, 2024",
      title: "Neural Nexus Announces Integration with Major Cloud Providers",
      link: "/blog/cloud-integration-announcement"
    },
    {
      date: "April 2, 2024",
      title: "Neural Nexus Releases New Tools for Enterprise Model Management",
      link: "/blog/enterprise-model-management"
    },
    {
      date: "February 15, 2024",
      title: "Neural Nexus Achieves SOC 2 Type II Compliance",
      link: "/blog/soc2-compliance"
    },
    {
      date: "January 8, 2024",
      title: "Neural Nexus Announces $25M Series A Funding Round",
      link: "/blog/series-a-funding"
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />

      <section className="pt-28 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/30 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-60 -left-20 w-80 h-80 bg-purple-600/30 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          {/* Hero Section */}
          <motion.div 
            className="max-w-3xl mx-auto mb-20 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500">
              Meet Neural Nexus
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              We're on a mission to make cutting-edge AI accessible to developers worldwide, 
              powering the next generation of AI-driven applications.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {companyStats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="text-2xl md:text-3xl font-bold text-blue-400">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <motion.div
              className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-blue-600/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Our Mission</h2>
              <p className="text-gray-300 mb-4">
                To democratize artificial intelligence by providing developers with the tools, 
                infrastructure, and marketplace to easily deploy, share, and monetize AI models.
              </p>
              <p className="text-gray-400">
                We believe that accessible AI will unlock unprecedented innovation across industries 
                and empower creators worldwide.
              </p>
            </motion.div>
            
            <motion.div
              className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-purple-600/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Trophy className="h-6 w-6 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Our Vision</h2>
              <p className="text-gray-300 mb-4">
                To build the world's leading AI infrastructure platform where any developer can access, 
                deploy, and build upon state-of-the-art models within minutes.
              </p>
              <p className="text-gray-400">
                We envision a future where AI capabilities are as accessible and essential as cloud computing 
                is today, driving innovation across all sectors.
              </p>
            </motion.div>
          </div>
          
          {/* Company Story */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
              <p className="text-gray-300 max-w-3xl mx-auto">
                From a small team of AI enthusiasts to a global platform serving thousands of developers,
                our story is just beginning.
              </p>
            </div>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-blue-500/30"></div>
              
              <div className="space-y-10">
                {companyMilestones.map((milestone, index) => (
                  <div 
                    key={index}
                    className={`relative flex items-center ${index % 2 === 0 ? 'justify-end' : 'justify-start'} md:justify-center`}
                  >
                    <motion.div
                      className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 text-right' : 'md:pl-12 text-left'}`}
                      initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 * index }}
                    >
                      <div className="bg-gray-800/40 p-5 rounded-lg border border-gray-700/50">
                        <div className="text-sm text-blue-400 mb-1">{milestone.quarter} {milestone.year}</div>
                        <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                        <p className="text-gray-400 text-sm">{milestone.description}</p>
                      </div>
                    </motion.div>
                    
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-5 h-5 bg-blue-600 rounded-full border-4 border-gray-900"></div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Locations */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Global Presence</h2>
              <p className="text-gray-300 max-w-3xl mx-auto">
                With offices around the world, we're building a global community of AI innovation.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {officeLocations.map((office, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-800/30 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="h-40 bg-gray-700/50 relative">
                    {/* This would be replaced with actual images in a real implementation */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
                    <div className="absolute bottom-2 left-2 bg-gray-900/80 text-white text-xs py-1 px-2 rounded">
                      {office.role}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-bold flex items-center">
                      <MapPin className="h-4 w-4 text-blue-400 mr-1" />
                      {office.city}, {office.country}
                    </h3>
                    <p className="text-gray-400 text-sm mt-2">{office.address}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Press Section */}
          <motion.div
            className="mb-20 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl p-8 border border-blue-500/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">Press & News</h2>
                <p className="text-gray-400">Latest announcements from Neural Nexus</p>
              </div>
              
              <Link 
                href="/blog/category/press-releases" 
                className="mt-4 md:mt-0 text-blue-400 hover:text-blue-300 flex items-center text-sm"
              >
                View All Press Releases
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {pressReleases.map((press, index) => (
                <Link 
                  key={index}
                  href={press.link}
                  className="block bg-gray-800/40 p-4 rounded-lg hover:bg-gray-800/60 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">{press.date}</div>
                      <h3 className="font-medium">{press.title}</h3>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
          
          {/* Contact Info */}
          <motion.div 
            className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-8 border border-blue-700/30 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-800/50 rounded-lg p-5">
                <Mail className="h-6 w-6 text-blue-400 mx-auto mb-3" />
                <h3 className="font-bold mb-2">Email Us</h3>
                <a href="mailto:mantejarora@gmail.com" className="text-gray-300 hover:text-blue-400 transition-colors">
                  mantejarora@gmail.com
                </a>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-5">
                <Phone className="h-6 w-6 text-green-400 mx-auto mb-3" />
                <h3 className="font-bold mb-2">Call Us</h3>
                <a href="tel:+1-415-555-0123" className="text-gray-300 hover:text-green-400 transition-colors">
                  +1 (415) 555-0123
                </a>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-5">
                <Users className="h-6 w-6 text-purple-400 mx-auto mb-3" />
                <h3 className="font-bold mb-2">Follow Us</h3>
                <div className="flex items-center gap-4 my-8">
                  <a href="https://github.com/Drago-03/Neural-Nexus" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                    <Github className="h-5 w-5" />
                  </a>
                  <a href="https://www.linkedin.com/in/mantej-singh-arora/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600">
                    <Linkedin className="h-7 w-7" />
                  </a>
                  <a href="mailto:mantejarora@gmail.com" className="text-gray-400 hover:text-purple-400">
                    <Mail className="h-7 w-7" />
                  </a>
                </div>
              </div>
            </div>
            
            <Link 
              href="/contact"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg inline-flex items-center transition-colors"
            >
              Contact Us
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
} 