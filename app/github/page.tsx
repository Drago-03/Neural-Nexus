"use client";

import React, { useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { 
  Github, 
  Star, 
  GitFork, 
  GitPullRequest, 
  GitBranch,
  Code, 
  BookOpen,
  File,
  ExternalLink,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function GitHubPage() {
  // Redirect to GitHub after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "https://github.com/Drago-03/Neural-Nexus";
    }, 10000); // Redirect after 10 seconds
    
    return () => clearTimeout(timer);
  }, []);

  // Repository stats (mock data)
  const repoStats = [
    { icon: <Star className="h-5 w-5" />, value: "5.2k", label: "Stars" },
    { icon: <GitFork className="h-5 w-5" />, value: "680", label: "Forks" },
    { icon: <GitBranch className="h-5 w-5" />, value: "32", label: "Branches" },
    { icon: <GitPullRequest className="h-5 w-5" />, value: "124", label: "Pull Requests" }
  ];
  
  // Open source projects
  const osProjects = [
    {
      name: "model-api",
      description: "Neural Nexus API client libraries for multiple languages, including JavaScript, Python, and Java.",
      stars: "1.7k",
      language: "JavaScript"
    },
    {
      name: "optimizers",
      description: "Tools for optimizing AI models for production deployment, reducing size and improving inference speed.",
      stars: "2.3k",
      language: "Python"
    },
    {
      name: "model-toolbox",
      description: "Collection of utilities for working with AI models, including conversion, visualization, and evaluation.",
      stars: "982",
      language: "Python"
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
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center bg-gray-800/80 rounded-full p-3 mb-4">
              <Github className="h-10 w-10 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-gray-500 to-purple-500">
              Neural Nexus on GitHub
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Explore our open source projects, contribute code, and help build the future of AI infrastructure.
            </p>
            
            <div className="p-3 bg-blue-900/20 border border-blue-500/20 rounded-lg mb-8 max-w-md mx-auto">
              <p className="text-sm text-gray-300">
                Redirecting to our GitHub in a few seconds...
                <br />
                If you're not redirected, click the button below.
              </p>
            </div>
            
            <a 
              href="https://github.com/Drago-03/Neural-Nexus" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center bg-gray-800 hover:bg-gray-700 py-3 px-6 rounded-lg transition-colors text-lg font-medium"
            >
              Visit GitHub
              <ExternalLink className="ml-2 h-5 w-5" />
            </a>
          </motion.div>
          
          <div className="max-w-4xl mx-auto">
            {/* GitHub Repo Preview */}
            <motion.div 
              className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center mb-6">
                <div className="bg-gray-800 p-2 rounded-lg mr-4">
                  <Github className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-1">Drago-03/Neural-Nexus</h2>
                  <p className="text-gray-400 text-sm">
                    Open source AI model marketplace and hosting platform
                  </p>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6">
                Neural Nexus is an open source platform that allows AI researchers and developers to share, discover, 
                and deploy machine learning models. Our mission is to democratize access to AI technology and foster 
                a collaborative community around open innovation.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {repoStats.map((stat, index) => (
                  <div key={index} className="bg-gray-800/50 rounded-lg p-3 text-center">
                    <div className="flex justify-center mb-1 text-gray-300">
                      {stat.icon}
                    </div>
                    <div className="font-bold text-xl">{stat.value}</div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 bg-blue-900/30 text-blue-400 rounded-full text-xs font-medium">TypeScript</span>
                <span className="px-3 py-1 bg-yellow-900/30 text-yellow-400 rounded-full text-xs font-medium">JavaScript</span>
                <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-xs font-medium">Python</span>
                <span className="px-3 py-1 bg-purple-900/30 text-purple-400 rounded-full text-xs font-medium">Machine Learning</span>
                <span className="px-3 py-1 bg-pink-900/30 text-pink-400 rounded-full text-xs font-medium">API</span>
              </div>
            </motion.div>
            
            {/* Other Projects */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Featured Projects</h2>
              
              <div className="space-y-4">
                {osProjects.map((project, index) => (
                  <motion.div 
                    key={index}
                    className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * (index + 1) }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <Code className="h-5 w-5 text-blue-400 mr-2" />
                        <h3 className="font-bold">neuralnexus/{project.name}</h3>
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                        <Star className="h-4 w-4 mr-1 text-yellow-400" />
                        <span>{project.stars}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-3">
                      {project.description}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className={`h-3 w-3 rounded-full mr-1 ${
                          project.language === 'JavaScript' ? 'bg-yellow-400' : 
                          project.language === 'Python' ? 'bg-green-400' : 'bg-blue-400'
                        }`}></div>
                        <span className="text-gray-400 text-xs">{project.language}</span>
                      </div>
                      
                      <a 
                        href={`https://github.com/Drago-03/Neural-Nexus`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                      >
                        View Project
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Contribution Section */}
            <motion.div 
              className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-700/30 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-4">Join Our Open Source Community</h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                We welcome contributions from developers of all skill levels. Whether you're fixing a bug, adding a feature, 
                or improving documentation, your help makes Neural Nexus better for everyone.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <File className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                  <h3 className="font-bold mb-1">Read the Docs</h3>
                  <p className="text-sm text-gray-400">Check out our documentation to get started</p>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <GitFork className="h-6 w-6 text-green-400 mx-auto mb-2" />
                  <h3 className="font-bold mb-1">Fork the Repo</h3>
                  <p className="text-sm text-gray-400">Create your own copy to work on</p>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <GitPullRequest className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                  <h3 className="font-bold mb-1">Submit PRs</h3>
                  <p className="text-sm text-gray-400">Share your improvements with the community</p>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="https://github.com/Drago-03/Neural-Nexus" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-5 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center"
                >
                  <Github className="mr-2 h-4 w-4" />
                  Main Repository
                </a>
                <a 
                  href="https://docs.neuralnexus.ai/contributing" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-5 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Contribution Guide
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
} 