"use client";

import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { 
  Search, 
  Clock, 
  User, 
  Tag,
  ArrowRight,
  ThumbsUp,
  MessageSquare,
  Share2,
  Bookmark
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function BlogPage() {
  // Gen-Z style variable names
  const [searchVibe, setSearchVibe] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  // Blog tags with emojis for the Gen-Z vibe
  const vibeCategories = [
    { tag: 'all', name: 'All Posts', emoji: '✨' },
    { tag: 'news', name: 'AI News', emoji: '📰' },
    { tag: 'tutorials', name: 'Tutorials', emoji: '🧠' },
    { tag: 'announcements', name: 'Announcements', emoji: '📣' },
    { tag: 'case-studies', name: 'Case Studies', emoji: '🔍' },
    { tag: 'research', name: 'Research', emoji: '🔬' },
    { tag: 'open-source', name: 'Open Source', emoji: '🌐', href: '/blog/category/open-source' }
  ];
  
  // Mock blog posts data
  const hotPosts = [
    {
      id: 1,
      title: "The Hype is Real: Neural Nexus Introduces Semantic Search Models",
      excerpt: "These new models are totally changing the game for search tech. They just hit different from the old keyword stuff.",
      image: "/blog/post1.jpg",
      author: "Alex Chen",
      authorAvatar: "/avatars/alex.jpg",
      date: "May 15, 2024",
      readTime: "5 min read",
      tags: ["news", "announcements"],
      featured: true,
      likes: 428,
      comments: 32
    },
    {
      id: 2,
      title: "No Cap: How Gen-Z is Shaping AI Voice Models",
      excerpt: "From slang to intonation, Gen-Z speech patterns are creating challenges and opportunities for voice AI developers.",
      image: "/blog/post2.jpg",
      author: "Taylor Swift",
      authorAvatar: "/avatars/taylor.jpg",
      date: "May 10, 2024",
      readTime: "8 min read",
      tags: ["research", "case-studies"],
      featured: false,
      likes: 356,
      comments: 47
    },
    {
      id: 3,
      title: "Spill the Tea: Ethical Considerations in AI Development",
      excerpt: "We need to talk about the tea on AI ethics. This isn't just boring corporate stuff - it's about who we are as a society.",
      image: "/blog/post3.jpg",
      author: "Jordan Lee",
      authorAvatar: "/avatars/jordan.jpg",
      date: "May 5, 2024",
      readTime: "10 min read",
      tags: ["research"],
      featured: false,
      likes: 291,
      comments: 53
    },
    {
      id: 4,
      title: "Living Rent-Free in Your Phone: How Memory-Efficient Models are Changing Mobile AI",
      excerpt: "These new models take up way less space but still slay just as hard. Here's how they work and why they matter.",
      image: "/blog/post4.jpg",
      author: "Mia Zhang",
      authorAvatar: "/avatars/mia.jpg",
      date: "May 1, 2024",
      readTime: "6 min read",
      tags: ["tutorials", "research"],
      featured: false,
      likes: 184,
      comments: 19
    },
    {
      id: 5,
      title: "Main Character Energy: Creating AI with Personality",
      excerpt: "Your AI assistant doesn't have to be basic. Here's how to give your models that main character energy that users vibe with.",
      image: "/blog/post5.jpg",
      author: "Carlos Rodriguez",
      authorAvatar: "/avatars/carlos.jpg",
      date: "April 28, 2024",
      readTime: "7 min read",
      tags: ["tutorials"],
      featured: false,
      likes: 312,
      comments: 28
    },
    {
      id: 6,
      title: "We're Cooking: Neural Nexus Raises $50M in Series B Funding",
      excerpt: "The vibes are immaculate as Neural Nexus secures major funding to expand our AI infrastructure and research capabilities.",
      image: "/blog/post6.jpg",
      author: "Sarah Johnson",
      authorAvatar: "/avatars/sarah.jpg",
      date: "April 22, 2024",
      readTime: "4 min read",
      tags: ["news", "announcements"],
      featured: true,
      likes: 521,
      comments: 64
    }
  ];
  
  // Filter blog posts based on search and tag
  const getFilteredPosts = () => {
    let filtered = hotPosts;
    
    // Apply tag filter if selected
    if (selectedTag && selectedTag !== 'all') {
      filtered = filtered.filter(post => post.tags.includes(selectedTag));
    }
    
    // Apply search filter
    if (searchVibe.trim() !== '') {
      const searchLower = searchVibe.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchLower) || 
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.author.toLowerCase().includes(searchLower)
      );
    }
    
    return filtered;
  };
  
  const filteredPosts = getFilteredPosts();
  
  // Featured posts for the hero section
  const featuredPosts = hotPosts.filter(post => post.featured);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />

      <section className="pt-28 pb-10 px-4">
        <div className="container mx-auto">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-pink-500 to-purple-500"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            AI News & Insights
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto text-center mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Stay in the loop with the latest tea on AI advancements, tutorials, and Neural Nexus updates
          </motion.p>
          
          {featuredPosts.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
              {/* Featured Post (Large) */}
              <div className="lg:col-span-2">
                <Link href={`/blog/${featuredPosts[0].id}`}>
                  <div className="group relative rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/90 z-10"></div>
                    
                    {/* Placeholder for image */}
                    <div className="bg-gray-800 aspect-[21/9] relative">
                      <div className="absolute inset-0 flex items-center justify-center text-gray-600">Featured Image Placeholder</div>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                      <div className="flex items-center mb-3">
                        <div className="bg-purple-500/90 text-white text-xs px-3 py-1 rounded-full flex items-center mr-2">
                          <span className="mr-1">✨</span>
                          Featured
                        </div>
                        <div className="bg-gray-800/80 text-gray-300 text-xs px-3 py-1 rounded-full">
                          {featuredPosts[0].tags[0]}
                        </div>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold mb-2 group-hover:text-purple-400 transition-colors">{featuredPosts[0].title}</h2>
                      <p className="text-gray-300 mb-4 line-clamp-2">{featuredPosts[0].excerpt}</p>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden mr-2">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">{featuredPosts[0].author}</div>
                            <div className="text-xs text-gray-400 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {featuredPosts[0].date} · {featuredPosts[0].readTime}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-purple-400 flex items-center font-medium">
                          Read More
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          )}
          
          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="relative w-full sm:max-w-md">
              <input 
                type="text" 
                placeholder="Search for blog posts..." 
                className="w-full bg-gray-800/70 border border-gray-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                value={searchVibe}
                onChange={(e) => setSearchVibe(e.target.value)}
                aria-label="Search blog posts"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            
            <div className="flex overflow-x-auto hide-scrollbar py-1 w-full sm:w-auto">
              <div className="flex gap-2">
                {vibeCategories.map(category => (
                  category.href ? (
                    <Link 
                      key={category.tag}
                      href={category.href}
                      className="px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors bg-gray-800/70 text-gray-300 hover:bg-gray-700"
                    >
                      <span className="mr-1">{category.emoji}</span>
                      {category.name}
                    </Link>
                  ) : (
                    <button 
                      key={category.tag}
                      className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                        selectedTag === category.tag || (category.tag === 'all' && !selectedTag)
                          ? 'bg-purple-600 text-white' 
                          : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700'
                      }`}
                      onClick={() => setSelectedTag(category.tag === 'all' ? null : category.tag)}
                    >
                      <span className="mr-1">{category.emoji}</span>
                      {category.name}
                    </button>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Blog posts grid */}
      <section className="pb-20 px-4">
        <div className="container mx-auto">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map(post => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">👀</div>
              <h3 className="text-2xl font-bold mb-2">No posts found</h3>
              <p className="text-gray-400">Try changing your search or filters</p>
            </div>
          )}
          
          {/* Newsletter subscription */}
          <div className="mt-16 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl p-8 border border-purple-700/30">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-3">Stay In The Loop</h2>
              <p className="text-gray-300 mb-6">
                Subscribe to our newsletter for the freshest AI tea, weekly updates, and exclusive content
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-1 bg-gray-800/70 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  aria-label="Email for newsletter"
                />
                <button className="bg-purple-600 hover:bg-purple-700 rounded-lg px-6 py-2 font-medium transition-colors">
                  Subscribe
                </button>
              </div>
              <p className="text-gray-400 text-sm mt-4">
                No spam, just vibes. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function BlogPostCard({ post }: { post: any }) {
  return (
    <motion.div 
      className="bg-gray-800/30 border border-gray-700/50 rounded-xl overflow-hidden hover:border-purple-500/30 transition-all hover:shadow-md hover:shadow-purple-500/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link href={`/blog/${post.id}`} className="block">
        <div className="aspect-video bg-gray-900 relative">
          <div className="absolute inset-0 flex items-center justify-center text-gray-600">Image Placeholder</div>
        </div>
      </Link>
      
      <div className="p-5">
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.map((tag: string, index: number) => (
            <div key={index} className="bg-gray-700/50 text-gray-300 text-xs px-2 py-1 rounded-full flex items-center">
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </div>
          ))}
        </div>
        
        <Link href={`/blog/${post.id}`} className="block">
          <h3 className="text-xl font-bold mb-2 hover:text-purple-400 transition-colors line-clamp-2">{post.title}</h3>
        </Link>
        
        <p className="text-gray-300 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden mr-2">
              <User className="h-4 w-4 text-gray-400" />
            </div>
            <div>
              <div className="text-sm font-medium">{post.author}</div>
              <div className="text-xs text-gray-400">
                {post.date}
              </div>
            </div>
          </div>
          
          <div className="text-xs text-gray-400 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {post.readTime}
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-700/50 flex justify-between">
          <div className="flex space-x-4">
            <button className="flex items-center text-gray-400 hover:text-purple-400 transition-colors" aria-label="Like post">
              <ThumbsUp size={14} className="mr-1" />
              <span className="text-xs">{post.likes}</span>
            </button>
            <button className="flex items-center text-gray-400 hover:text-purple-400 transition-colors" aria-label="View comments">
              <MessageSquare size={14} className="mr-1" />
              <span className="text-xs">{post.comments}</span>
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button className="p-1 text-gray-400 hover:text-purple-400 transition-colors" aria-label="Share post">
              <Share2 size={14} />
            </button>
            <button className="p-1 text-gray-400 hover:text-purple-400 transition-colors" aria-label="Bookmark post">
              <Bookmark size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 