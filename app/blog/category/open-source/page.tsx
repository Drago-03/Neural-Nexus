"use client";

import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Github, ArrowRight } from "lucide-react";

export default function OpenSourceBlogPage() {
  // Sample blog posts
  const posts = [
    {
      id: 1,
      title: "Why We're Going All In on Open Source AI",
      excerpt: "Neural Nexus is committed to transparency and collaboration. Here's our roadmap for open-sourcing key components of our AI stack.",
      author: "Jamie Welch",
      date: "June 2, 2024"
    },
    {
      id: 2,
      title: "How to Contribute to Neural Nexus Open Source Projects",
      excerpt: "Ready to make your first PR? This step-by-step guide will help you contribute to our projects regardless of your experience level.",
      author: "Raj Patel",
      date: "May 28, 2024"
    },
    {
      id: 3,
      title: "5 Open Source AI Models That Are Totally Slaying Right Now",
      excerpt: "These community-built models are giving proprietary solutions a run for their money, and you can use them all for free.",
      author: "Zoe Chen",
      date: "May 21, 2024"
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />
      
      <section className="pt-28 pb-10 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-center mb-2">
            <Link href="/blog" className="text-sm text-gray-400 hover:text-white transition-colors mr-2">
              Blog
            </Link>
            <span className="text-gray-600 mx-2">/</span>
            <span className="text-sm text-purple-400">Open Source</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-pink-500 to-purple-500">
            Open Source AI
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto text-center mb-12">
            Sharing code, building community, and making AI accessible to everyone
          </p>
          
          <div className="flex justify-center mb-12">
            <a 
              href="https://github.com/Drago-03/Neural-Nexus"
              target="_blank"
              rel="noopener noreferrer" 
              className="flex items-center bg-gray-800 hover:bg-gray-700 transition-colors px-5 py-3 rounded-full"
            >
              <Github className="h-5 w-5 mr-2" />
              <span>Check out our GitHub</span>
            </a>
          </div>
        </div>
      </section>

      <section className="pb-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <div key={post.id} className="bg-gray-800/30 border border-gray-700/50 rounded-xl overflow-hidden hover:border-purple-500/30 transition-all">
                <div className="p-5">
                  <h3 className="text-xl font-bold mb-2 hover:text-purple-400 transition-colors">
                    <Link href={`/blog/${post.id}`}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">{post.excerpt}</p>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>{post.author}</span>
                    <span>{post.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-700/50 mb-16">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <Github className="h-8 w-8 mr-3 text-purple-400" />
                <h2 className="text-2xl font-bold">Popular Open Source Projects</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800/30 p-5 rounded-xl border border-gray-700/50 hover:border-purple-500/30 transition-all">
                  <h3 className="font-bold text-lg mb-2 flex items-center">
                    <span className="bg-blue-500/20 p-1 rounded text-blue-400 mr-2">
                      <Github className="h-4 w-4" />
                    </span>
                    NeuralNexus/transformer-lite
                  </h3>
                  <p className="text-gray-300 text-sm mb-3">Lightweight transformer models optimized for edge devices and web browsers.</p>
                </div>
                
                <div className="bg-gray-800/30 p-5 rounded-xl border border-gray-700/50 hover:border-purple-500/30 transition-all">
                  <h3 className="font-bold text-lg mb-2 flex items-center">
                    <span className="bg-green-500/20 p-1 rounded text-green-400 mr-2">
                      <Github className="h-4 w-4" />
                    </span>
                    NeuralNexus/dataset-tools
                  </h3>
                  <p className="text-gray-300 text-sm mb-3">Tools for creating, cleaning, and augmenting datasets for machine learning.</p>
                </div>
              </div>
              
              <div className="text-center">
                <a 
                  href="https://github.com/Drago-03/Neural-Nexus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  <span>Explore All Projects</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
} 