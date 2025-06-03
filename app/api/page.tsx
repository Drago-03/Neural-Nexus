"use client";

import React, { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ChevronDown, Code, Server, Lock, Zap, Check, Key, BookOpen, Layers, Dumbbell, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/providers/AppProvider';

// Add custom animation keyframes
const animationKeyframes = `
  @keyframes border-glow {
    0% {
      opacity: 0.4;
      box-shadow: 0 0 5px 1px rgba(236, 72, 153, 0.5);
    }
    50% {
      opacity: 1;
      box-shadow: 0 0 15px 3px rgba(236, 72, 153, 0.8);
    }
    100% {
      opacity: 0.4;
      box-shadow: 0 0 5px 1px rgba(236, 72, 153, 0.5);
    }
  }
  
  @keyframes pulse-slow {
    0%, 100% {
      opacity: 0.1;
    }
    50% {
      opacity: 0.3;
    }
  }
  
  @keyframes gradient-x {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  
  .animate-border-glow {
    animation: border-glow 3s ease-in-out infinite;
  }
  
  .animate-pulse-slow {
    animation: pulse-slow 4s ease-in-out infinite;
  }
  
  .animate-gradient-x {
    animation: gradient-x 15s ease infinite;
    background-size: 400% 400%;
  }
`;

export default function APIPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeExample, setActiveExample] = useState('authentication');
  const router = useRouter();
  const { user } = useAppContext();

  // Add style tag for custom animations
  useEffect(() => {
    // Create style element
    const styleEl = document.createElement('style');
    styleEl.id = 'custom-animations';
    styleEl.textContent = animationKeyframes;
    document.head.appendChild(styleEl);
    
    // Cleanup on unmount
    return () => {
      const existingStyle = document.getElementById('custom-animations');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  // Handle get API key button click
  const handleGetApiKey = () => {
    if (user) {
      // User is logged in, redirect to dashboard API section
      router.push('https://www.neuralnexus.biz/dashboard?tab=api');
    } else {
      // User is not logged in, redirect to login page with redirect back to dashboard API section
      router.push('/login?redirect=/dashboard?tab=api');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />

      <section className="pt-28 pb-10 px-4">
        <div className="container mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-pink-500"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Developer API
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Integrate Neural Nexus models into your applications with our powerful API
          </motion.p>
        </div>
      </section>

      <section className="pb-20 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:w-1/4">
              <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50 sticky top-24">
                <h3 className="text-xl font-semibold mb-4">API Reference</h3>
                <nav className="space-y-1">
                  <APINavItem 
                    id="overview" 
                    active={activeTab === 'overview'} 
                    onClick={() => setActiveTab('overview')}
                    icon={<Zap className="h-4 w-4" />}
                    title="Overview"
                  />
                  <APINavItem 
                    id="authentication" 
                    active={activeTab === 'authentication'} 
                    onClick={() => setActiveTab('authentication')}
                    icon={<Lock className="h-4 w-4" />}
                    title="Authentication"
                  />
                  <APINavItem 
                    id="models" 
                    active={activeTab === 'models'} 
                    onClick={() => setActiveTab('models')}
                    icon={<Server className="h-4 w-4" />}
                    title="Models API"
                  />
                  <APINavItem 
                    id="inference" 
                    active={activeTab === 'inference'} 
                    onClick={() => setActiveTab('inference')}
                    icon={<Code className="h-4 w-4" />}
                    title="Inference API"
                  />
                  <APINavItem 
                    id="training"
                    active={activeTab === 'training'} 
                    onClick={() => setActiveTab('training')}
                    icon={<Dumbbell className="h-4 w-4" />}
                    title="Training API"
                  />
                  <APINavItem 
                    id="user"
                    active={activeTab === 'user'} 
                    onClick={() => setActiveTab('user')}
                    icon={<User className="h-4 w-4" />}
                    title="User API"
                  />
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 overflow-hidden">
                {activeTab === 'overview' && (
                  <APISection title="API Overview">
                    <p className="mb-4">
                      The Neural Nexus API allows you to integrate AI models directly into your applications.
                      Our RESTful API endpoints provide access to model information, inference capabilities,
                      and more.
                    </p>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-2 text-purple-300">Base URL</h3>
                      <div className="bg-gray-900 p-3 rounded-md font-mono text-sm">
                        https://api.neuralnexus.ai/v1
                      </div>
                    </div>
                    
                    <div className="bg-purple-900/20 border border-purple-900/30 rounded-lg p-6 mt-8">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                          <h3 className="text-xl font-bold mb-2 flex items-center">
                            <Key className="h-5 w-5 mr-2 text-purple-400" />
                            Ready to start building?
                          </h3>
                          <p className="text-gray-300">
                            Get your API key now and start integrating Neural Nexus models into your applications.
                            Our pay-as-you-go pricing ensures you only pay for what you use, starting at just $0.001 per 1000 tokens.
                          </p>
                          <ul className="mt-4 space-y-2">
                            <li className="flex items-start">
                              <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                              <span>Ultra-low pricing with no minimums</span>
                            </li>
                            <li className="flex items-start">
                              <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                              <span>Free tier with 5,000 API calls per month</span>
                            </li>
                            <li className="flex items-start">
                              <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                              <span>Transparent usage monitoring</span>
                            </li>
                          </ul>
                        </div>
                        <button
                          onClick={handleGetApiKey}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 flex items-center flex-shrink-0"
                        >
                          <Key className="h-5 w-5 mr-2" />
                          Get your API key
                        </button>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-2 text-purple-300">Rate Limits</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-gray-900/50 rounded-lg">
                          <thead>
                            <tr className="border-b border-gray-800">
                              <th className="px-4 py-2 text-left">Plan</th>
                              <th className="px-4 py-2 text-left">Requests per minute</th>
                              <th className="px-4 py-2 text-left">Daily quota</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-gray-800">
                              <td className="px-4 py-2">Pro</td>
                              <td className="px-4 py-2">60</td>
                              <td className="px-4 py-2">10,000</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-2">Enterprise</td>
                              <td className="px-4 py-2">600</td>
                              <td className="px-4 py-2">Unlimited</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div className="bg-blue-900/20 border border-blue-900/30 rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-2 flex items-center">
                        <Zap className="h-5 w-5 mr-2 text-blue-400" />
                        Getting Started
                      </h3>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Sign up for a Neural Nexus account (Pro plan or higher)</li>
                        <li>Generate an API key in your dashboard settings</li>
                        <li>Use the key to authenticate your API requests</li>
                        <li>Explore the endpoints below to start building</li>
                      </ol>
                    </div>
                  </APISection>
                )}
                
                {activeTab === 'authentication' && (
                  <APISection title="Authentication">
                    <p className="mb-4">
                      All API requests require authentication using an API key. You can generate
                      and manage your API keys from your Neural Nexus dashboard.
                    </p>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-2 text-purple-300">API Key Authentication</h3>
                      <p className="mb-2">Include your API key in the Authorization header:</p>
                      <div className="bg-gray-900 p-3 rounded-md font-mono text-sm overflow-x-auto">
                        Authorization: Bearer YOUR_API_KEY
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-2 text-purple-300">Example Request</h3>
                      <div className="bg-gray-900 p-3 rounded-md font-mono text-sm overflow-x-auto">
                        curl -X GET \<br/>
                        &nbsp;&nbsp;https://api.neuralnexus.ai/v1/models \<br/>
                        &nbsp;&nbsp;-H 'Authorization: Bearer YOUR_API_KEY'
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-2 text-purple-300">API Key Types</h3>
                      <p className="mb-4">Neural Nexus offers different API key types based on your usage needs:</p>
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-gray-900/50 rounded-lg">
                          <thead>
                            <tr className="border-b border-gray-800">
                              <th className="px-4 py-2 text-left">Key Type</th>
                              <th className="px-4 py-2 text-left">Prefix</th>
                              <th className="px-4 py-2 text-left">Use Case</th>
                              <th className="px-4 py-2 text-left">Monthly Quota</th>
                              <th className="px-4 py-2 text-left">Rate Limit</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-gray-800">
                              <td className="px-4 py-2">
                                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">Test</span>
                              </td>
                              <td className="px-4 py-2 font-mono">nxt_</td>
                              <td className="px-4 py-2">Testing during development</td>
                              <td className="px-4 py-2">1,000 requests</td>
                              <td className="px-4 py-2">10 req/min</td>
                            </tr>
                            <tr className="border-b border-gray-800">
                              <td className="px-4 py-2">
                                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">Development</span>
                              </td>
                              <td className="px-4 py-2 font-mono">nnd_</td>
                              <td className="px-4 py-2">Development environments</td>
                              <td className="px-4 py-2">5,000 requests</td>
                              <td className="px-4 py-2">60 req/min</td>
                            </tr>
                            <tr className="border-b border-gray-800">
                              <td className="px-4 py-2">
                                <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs">Training</span>
                              </td>
                              <td className="px-4 py-2 font-mono">ntr_</td>
                              <td className="px-4 py-2">Fine-tuning models</td>
                              <td className="px-4 py-2">10,000 requests</td>
                              <td className="px-4 py-2">120 req/min</td>
                            </tr>
                            <tr className="border-b border-gray-800">
                              <td className="px-4 py-2">
                                <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-xs">Deployment</span>
                              </td>
                              <td className="px-4 py-2 font-mono">ndp_</td>
                              <td className="px-4 py-2">UAT and pre-production</td>
                              <td className="px-4 py-2">50,000 requests</td>
                              <td className="px-4 py-2">300 req/min</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-2">
                                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Production</span>
                              </td>
                              <td className="px-4 py-2 font-mono">npr_</td>
                              <td className="px-4 py-2">Production applications</td>
                              <td className="px-4 py-2">100,000 requests</td>
                              <td className="px-4 py-2">600 req/min</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-2 text-purple-300">Rate Limits & Quotas</h3>
                      <p className="mb-4">API key usage is subject to the following limits:</p>
                      
                      <ul className="list-disc pl-5 space-y-2 mb-4">
                        <li>When you exceed your rate limit, requests will return a <code className="bg-gray-800 px-1 py-0.5 rounded">429 Too Many Requests</code> status code.</li>
                        <li>When you exceed your monthly quota, requests will return a <code className="bg-gray-800 px-1 py-0.5 rounded">403 Forbidden</code> status code with details about upgrading.</li>
                        <li>Burst limits allow for temporary spikes in traffic (2x the standard rate limit).</li>
                      </ul>
                      
                      <p className="text-sm text-gray-400">
                        For higher limits, consider upgrading to our Enterprise plan or contact sales for custom solutions.
                      </p>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-2 text-purple-300">Error Handling</h3>
                      <p className="mb-2">API responses use standard HTTP status codes and include detailed error messages:</p>
                      
                      <div className="bg-gray-900 p-3 rounded-md font-mono text-sm overflow-x-auto mb-4">
                        // Authentication error example<br/>
                        &#123;<br/>
                        &nbsp;&nbsp;"error": &#123;<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;"message": "Authentication failed. Invalid API key provided.",<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;"type": "authentication_error",<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;"code": "invalid_api_key",<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;"status": 401,<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;"request_id": "req_12345"<br/>
                        &nbsp;&nbsp;&#125;<br/>
                        &#125;
                      </div>
                      
                      <table className="min-w-full bg-gray-900/50 rounded-lg">
                        <thead>
                          <tr className="border-b border-gray-800">
                            <th className="px-4 py-2 text-left">Status Code</th>
                            <th className="px-4 py-2 text-left">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-800">
                            <td className="px-4 py-2"><span className="text-red-400">400</span></td>
                            <td className="px-4 py-2">Bad Request (malformed request or invalid parameters)</td>
                          </tr>
                          <tr className="border-b border-gray-800">
                            <td className="px-4 py-2"><span className="text-red-400">401</span></td>
                            <td className="px-4 py-2">Unauthorized (missing or invalid API key)</td>
                          </tr>
                          <tr className="border-b border-gray-800">
                            <td className="px-4 py-2"><span className="text-red-400">403</span></td>
                            <td className="px-4 py-2">Forbidden (valid API key but insufficient permissions)</td>
                          </tr>
                          <tr className="border-b border-gray-800">
                            <td className="px-4 py-2"><span className="text-red-400">404</span></td>
                            <td className="px-4 py-2">Not Found (requested resource doesn't exist)</td>
                          </tr>
                          <tr className="border-b border-gray-800">
                            <td className="px-4 py-2"><span className="text-red-400">429</span></td>
                            <td className="px-4 py-2">Too Many Requests (rate limit exceeded)</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2"><span className="text-red-400">500</span></td>
                            <td className="px-4 py-2">Internal Server Error (something went wrong on our end)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="bg-yellow-900/20 border border-yellow-900/30 rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-2 flex items-center">
                        <Lock className="h-5 w-5 mr-2 text-yellow-400" />
                        Security Best Practices
                      </h3>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Never share your API keys or expose them in client-side code</li>
                        <li>Store keys in environment variables, not in your code repository</li>
                        <li>Create different keys for different environments (development, staging, production)</li>
                        <li>Rotate keys regularly for enhanced security</li>
                        <li>Delete unused keys to minimize security exposure</li>
                        <li>Monitor key usage to detect any unauthorized access</li>
                        <li>Use least privilege principle - only enable permissions your application needs</li>
                      </ul>
                    </div>
                  </APISection>
                )}
                
                {activeTab === 'models' && (
                  <APISection title="Models API">
                    <p className="mb-4">
                      The Models API provides endpoints to list, search, and get details about available models.
                    </p>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-2 text-purple-300">List Models</h3>
                      <p className="mb-2">Get a list of all available models:</p>
                      <div className="bg-gray-900 p-3 rounded-md font-mono text-sm overflow-x-auto mb-2">
                        GET /models
                      </div>
                      
                      <div className="bg-gray-900 p-3 rounded-md font-mono text-sm overflow-x-auto">
                        // Example response<br/>
                        &#123;<br/>
                        &nbsp;&nbsp;"models": [<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&#123;<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"id": "stability-xl-1024",<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": "Stability XL",<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"version": "1.0.0",<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"type": "image-generation",<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"creator": "stability-ai"<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&#125;,<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;// ... more models<br/>
                        &nbsp;&nbsp;]<br/>
                        &#125;
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-2 text-purple-300">Get Model Details</h3>
                      <p className="mb-2">Get detailed information about a specific model:</p>
                      <div className="bg-gray-900 p-3 rounded-md font-mono text-sm overflow-x-auto mb-2">
                        GET /models/&#123;model_id&#125;
                      </div>
                      
                      <div className="bg-gray-900 p-3 rounded-md font-mono text-sm overflow-x-auto">
                        // Example response<br/>
                        &#123;<br/>
                        &nbsp;&nbsp;"id": "gpt-nexus",<br/>
                        &nbsp;&nbsp;"name": "GPT Nexus",<br/>
                        &nbsp;&nbsp;"version": "2.0.0",<br/>
                        &nbsp;&nbsp;"type": "text-generation",<br/>
                        &nbsp;&nbsp;"creator": "neuralnexus",<br/>
                        &nbsp;&nbsp;"description": "Advanced text generation model",<br/>
                        &nbsp;&nbsp;"parameters": &#123;<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;"max_tokens": 4096,<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;"supports_streaming": true<br/>
                        &nbsp;&nbsp;&#125;,<br/>
                        &nbsp;&nbsp;"pricing": &#123;<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;"input_tokens": 0.001,<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;"output_tokens": 0.002<br/>
                        &nbsp;&nbsp;&#125;<br/>
                        &#125;
                      </div>
                    </div>
                  </APISection>
                )}
                
                {activeTab === 'inference' && (
                  <APISection title="Inference API">
                    <p className="text-gray-300 mb-6">
                      The Inference API allows you to generate text and images using our models. 
                      You can customize various parameters to control the output.
                    </p>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-2 text-purple-300">Text Generation</h3>
                      <p className="mb-2">Generate text with a language model:</p>
                      <div className="bg-gray-900 p-3 rounded-md font-mono text-sm overflow-x-auto mb-2">
                        POST /models/&#123;model_id&#125;/generate
                      </div>
                      
                      <div className="bg-gray-900 p-3 rounded-md font-mono text-sm overflow-x-auto mb-4">
                        // Request body<br/>
                        &#123;<br/>
                        &nbsp;&nbsp;"prompt": "Write a short poem about artificial intelligence",<br/>
                        &nbsp;&nbsp;"max_tokens": 256,<br/>
                        &nbsp;&nbsp;"temperature": 0.7<br/>
                        &#125;
                      </div>
                      
                      <div className="bg-gray-900 p-3 rounded-md font-mono text-sm overflow-x-auto">
                        // Example response<br/>
                        &#123;<br/>
                        &nbsp;&nbsp;"text": "Circuits of wonder, minds of light,\nSilicon dreams taking flight.\nThought patterns in digital streams,\nIntelligence beyond our wildest dreams.",<br/>
                        &nbsp;&nbsp;"usage": &#123;<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;"prompt_tokens": 8,<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;"completion_tokens": 27,<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;"total_tokens": 35<br/>
                        &nbsp;&nbsp;&#125;<br/>
                        &#125;
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-2 text-purple-300">Image Generation</h3>
                      <p className="mb-2">Generate images from text prompts:</p>
                      <div className="bg-gray-900 p-3 rounded-md font-mono text-sm overflow-x-auto mb-2">
                        POST /models/&#123;model_id&#125;/images
                      </div>
                      
                      <div className="bg-gray-900 p-3 rounded-md font-mono text-sm overflow-x-auto mb-4">
                        // Request body<br/>
                        &#123;<br/>
                        &nbsp;&nbsp;"prompt": "A futuristic city with flying cars and neon lights",<br/>
                        &nbsp;&nbsp;"n": 1,<br/>
                        &nbsp;&nbsp;"size": "1024x1024"<br/>
                        &#125;
                      </div>
                      
                      <div className="bg-gray-900 p-3 rounded-md font-mono text-sm overflow-x-auto">
                        // Example response<br/>
                        &#123;<br/>
                        &nbsp;&nbsp;"images": [<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&#123;<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"url": "https://storage.neuralnexus.ai/images/gen/abcd1234.png",<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"b64_json": "data:image/png;base64,..."<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
                        &nbsp;&nbsp;]<br/>
                        &#125;
                      </div>
                    </div>
                    
                    <div className="bg-green-900/20 border border-green-900/30 rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-2 flex items-center">
                        <Zap className="h-5 w-5 mr-2 text-green-400" />
                        Optimization Tips
                      </h3>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Use streaming for long text generations</li>
                        <li>Keep inputs concise to reduce token usage</li>
                        <li>Cache results for repeated identical requests</li>
                        <li>Set appropriate max_tokens to control output length</li>
                      </ul>
                    </div>
                  </APISection>
                )}

                {activeTab === 'training' && (
                  <APISection title="Training API">
                    <p className="text-gray-300 mb-6">
                      The Training API allows you to fine-tune our base models on your custom data, 
                      creating specialized models that better fit your specific use cases.
                    </p>
                    
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4 text-purple-400">Create a Fine-tuning Job</h3>
                      <p className="text-gray-300 mb-4">
                        Start a fine-tuning job to customize a base model with your training data.
                      </p>
                      
                      <div className="bg-gray-800 p-4 rounded-md mb-4">
                        <h4 className="text-md font-medium mb-2 text-white">POST /v1/fine-tuning</h4>
                        <p className="text-gray-400 mb-2">Required headers:</p>
                        <ul className="list-disc pl-5 mb-4 text-gray-400">
                          <li>Authorization: Bearer YOUR_API_KEY</li>
                          <li>Content-Type: application/json</li>
                        </ul>
                        
                        <p className="text-gray-400 mb-2">Request body:</p>
                        <div className="bg-gray-900 p-3 rounded-md font-mono text-sm mb-4">
                          &#123;<br/>
                          &nbsp;&nbsp;"model": "gpt-nexus-base",<br/>
                          &nbsp;&nbsp;"training_file": "file_abc123",<br/>
                          &nbsp;&nbsp;"validation_file": "file_xyz789", // Optional<br/>
                          &nbsp;&nbsp;"hyperparameters": &#123;<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;"epochs": 3,<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;"batch_size": 4,<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;"learning_rate": 1e-5<br/>
                          &nbsp;&nbsp;&#125;<br/>
                          &#125;
              </div>
              
                        <p className="text-gray-400 mb-2">Response:</p>
                        <div className="bg-gray-900 p-3 rounded-md font-mono text-sm">
                          &#123;<br/>
                          &nbsp;&nbsp;"id": "ft_7891011",<br/>
                          &nbsp;&nbsp;"object": "fine-tuning.job",<br/>
                          &nbsp;&nbsp;"model": "gpt-nexus-base",<br/>
                          &nbsp;&nbsp;"status": "queued",<br/>
                          &nbsp;&nbsp;"created_at": 1683561000,<br/>
                          &nbsp;&nbsp;"finished_at": null,<br/>
                          &nbsp;&nbsp;"fine_tuned_model": null,<br/>
                          &nbsp;&nbsp;"organization_id": "org_123456"<br/>
                          &#125;
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4 text-purple-400">List Fine-tuning Jobs</h3>
                      <p className="text-gray-300 mb-4">
                        Retrieve a list of your fine-tuning jobs.
                      </p>
                      
                      <div className="bg-gray-800 p-4 rounded-md mb-4">
                        <h4 className="text-md font-medium mb-2 text-white">GET /v1/fine-tuning</h4>
                        <p className="text-gray-400 mb-2">Required headers:</p>
                        <ul className="list-disc pl-5 mb-4 text-gray-400">
                          <li>Authorization: Bearer YOUR_API_KEY</li>
                        </ul>
                        
                        <p className="text-gray-400 mb-2">Response:</p>
                        <div className="bg-gray-900 p-3 rounded-md font-mono text-sm">
                          &#123;<br/>
                          &nbsp;&nbsp;"data": [<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&#123;<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"id": "ft_7891011",<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"object": "fine-tuning.job",<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"model": "gpt-nexus-base",<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"status": "succeeded",<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"created_at": 1683561000,<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"finished_at": 1683567000,<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"fine_tuned_model": "ft-gpt-nexus-custom-1234",<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"organization_id": "org_123456"<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
                          &nbsp;&nbsp;],<br/>
                          &nbsp;&nbsp;"object": "list",<br/>
                          &nbsp;&nbsp;"has_more": false<br/>
                          &#125;
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4 text-purple-400">Upload Training Files</h3>
                      <p className="text-gray-300 mb-4">
                        Upload files for fine-tuning your models.
                      </p>
                      
                      <div className="bg-gray-800 p-4 rounded-md mb-4">
                        <h4 className="text-md font-medium mb-2 text-white">POST /v1/files</h4>
                        <p className="text-gray-400 mb-2">Required headers:</p>
                        <ul className="list-disc pl-5 mb-4 text-gray-400">
                          <li>Authorization: Bearer YOUR_API_KEY</li>
                          <li>Content-Type: multipart/form-data</li>
                        </ul>
                        
                        <p className="text-gray-400 mb-2">Form data:</p>
                        <ul className="list-disc pl-5 mb-4 text-gray-400">
                          <li>file: [Your JSONL file]</li>
                          <li>purpose: "fine-tuning"</li>
                        </ul>
                        
                        <p className="text-gray-400 mb-2">Response:</p>
                        <div className="bg-gray-900 p-3 rounded-md font-mono text-sm">
                          &#123;<br/>
                          &nbsp;&nbsp;"id": "file_abc123",<br/>
                          &nbsp;&nbsp;"object": "file",<br/>
                          &nbsp;&nbsp;"bytes": 1234567,<br/>
                          &nbsp;&nbsp;"created_at": 1683560000,<br/>
                          &nbsp;&nbsp;"filename": "training_data.jsonl",<br/>
                          &nbsp;&nbsp;"purpose": "fine-tuning"<br/>
                          &#125;
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 mb-4">
                      <h3 className="text-xl font-semibold mb-4 text-purple-400">Code Example</h3>
                      <div className="flex space-x-4 mb-4">
                  <button 
                          className={`px-3 py-1 rounded-md text-sm ${activeExample === 'javascript' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                    onClick={() => setActiveExample('javascript')}
                  >
                    JavaScript
                  </button>
                  <button 
                          className={`px-3 py-1 rounded-md text-sm ${activeExample === 'python' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                    onClick={() => setActiveExample('python')}
                  >
                    Python
                  </button>
                  <button 
                          className={`px-3 py-1 rounded-md text-sm ${activeExample === 'curl' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                    onClick={() => setActiveExample('curl')}
                  >
                    cURL
                  </button>
                </div>
                
                      {activeExample === 'javascript' && (
                        <div className="bg-gray-900 p-4 rounded-md font-mono text-sm overflow-x-auto">
                          // Create a fine-tuning job<br/>
                          async function createFineTuningJob() &#123;<br/>
                          &nbsp;&nbsp;const API_KEY = process.env.NEURAL_NEXUS_API_KEY;<br/><br/>
                          
                          &nbsp;&nbsp;const response = await fetch('https://api.neuralnexus.ai/v1/fine-tuning', &#123;<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;method: 'POST',<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;headers: &#123;<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'Authorization': `Bearer $&#123;API_KEY&#125;`,<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'Content-Type': 'application/json'<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&#125;,<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;body: JSON.stringify(&#123;<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;model: 'gpt-nexus-base',<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;training_file: 'file_abc123',<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;hyperparameters: &#123;<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;epochs: 3<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&#125;)<br/>
                          &nbsp;&nbsp;&#125;);<br/><br/>
                          
                          &nbsp;&nbsp;const data = await response.json();<br/>
                          &nbsp;&nbsp;console.log('Fine-tuning job created:', data);<br/>
                          &nbsp;&nbsp;return data;<br/>
                          &#125;
                      </div>
                      )}
                      
                      {activeExample === 'python' && (
                      <div className="bg-gray-900 p-4 rounded-md font-mono text-sm overflow-x-auto">
                          import requests<br/>
                          import os<br/><br/>
                          
                          def create_fine_tuning_job():<br/>
                          &nbsp;&nbsp;# Store API keys in environment variables<br/>
                          &nbsp;&nbsp;api_key = os.environ.get("NEURAL_NEXUS_API_KEY")<br/>
                          &nbsp;&nbsp;<br/>
                          &nbsp;&nbsp;if not api_key:<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;raise ValueError("API key is missing. Set the NEURAL_NEXUS_API_KEY environment variable.")<br/>
                          &nbsp;&nbsp;<br/>
                          &nbsp;&nbsp;url = "https://api.neuralnexus.ai/v1/fine-tuning"<br/>
                          &nbsp;&nbsp;headers = &#123;<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;"Authorization": f"Bearer &#123;api_key&#125;",<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;"Content-Type": "application/json"<br/>
                          &nbsp;&nbsp;&#125;<br/>
                          &nbsp;&nbsp;<br/>
                          &nbsp;&nbsp;payload = &#123;<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;"model": "gpt-nexus-base",<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;"training_file": "file_abc123",<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;"hyperparameters": &#123;<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"epochs": 3,<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"batch_size": 4,<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"learning_rate": 1e-5<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
                          &nbsp;&nbsp;&#125;<br/>
                          &nbsp;&nbsp;<br/>
                          &nbsp;&nbsp;response = requests.post(url, headers=headers, json=payload)<br/>
                          &nbsp;&nbsp;response.raise_for_status()  # Raise exception for 4XX/5XX responses<br/>
                          &nbsp;&nbsp;<br/>
                          &nbsp;&nbsp;data = response.json()<br/>
                          &nbsp;&nbsp;print(f"Fine-tuning job created: &#123;data&#125;")<br/>
                          &nbsp;&nbsp;return data<br/>
                          <br/>
                          <br/>
                          # Example usage<br/>
                          try:<br/>
                          &nbsp;&nbsp;job = create_fine_tuning_job()<br/>
                          &nbsp;&nbsp;print(f"Job ID: &#123;job['id']&#125;")<br/>
                          &nbsp;&nbsp;print(f"Status: &#123;job['status']&#125;")<br/>
                          except Exception as e:<br/>
                          &nbsp;&nbsp;print(f"Error: &#123;e&#125;")
                      </div>
                      )}
                      
                      {activeExample === 'curl' && (
                        <div className="bg-gray-900 p-4 rounded-md font-mono text-sm overflow-x-auto">
                          # Create a fine-tuning job<br/>
                          curl -X POST \<br/>
                          &nbsp;&nbsp;https://api.neuralnexus.ai/v1/fine-tuning \<br/>
                          &nbsp;&nbsp;-H 'Authorization: Bearer YOUR_API_KEY' \<br/>
                          &nbsp;&nbsp;-H 'Content-Type: application/json' \<br/>
                          &nbsp;&nbsp;-d '&#123;<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;"model": "gpt-nexus-base",<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;"training_file": "file_abc123",<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;"hyperparameters": &#123;<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"epochs": 3,<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"batch_size": 4,<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"learning_rate": 0.00001<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
                          &nbsp;&nbsp;&#125;'
                    </div>
                      )}
                    </div>
                  </APISection>
                )}

                {activeTab === 'user' && (
                  <APISection title="User API">
                    <p className="text-gray-300 mb-6">
                      The User API allows you to manage user accounts, API keys, and usage statistics for your Neural Nexus account.
                    </p>
                    
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4 text-purple-400">Manage API Keys</h3>
                      <p className="text-gray-300 mb-4">
                        Create, list, and revoke API keys for your account.
                      </p>
                      
                      <div className="bg-gray-800 p-4 rounded-md mb-4">
                        <h4 className="text-md font-medium mb-2 text-white">GET /v1/api-keys</h4>
                        <p className="text-gray-400 mb-2">Required headers:</p>
                        <ul className="list-disc pl-5 mb-4 text-gray-400">
                          <li>Authorization: Bearer YOUR_API_KEY</li>
                        </ul>
                        
                        <p className="text-gray-400 mb-2">Response:</p>
                        <div className="bg-gray-900 p-3 rounded-md font-mono text-sm">
                          &#123;<br/>
                          &nbsp;&nbsp;"data": [<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&#123;<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"id": "key_123456",<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": "Development Key",<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"prefix": "nnd_",<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"last_used": "2023-05-15T10:30:00Z",<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"created_at": "2023-05-01T09:00:00Z",<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"active": true<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&#125;,<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&#123;<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"id": "key_789012",<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": "Production Key",<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"prefix": "npr_",<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"last_used": "2023-05-15T14:20:00Z",<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"created_at": "2023-05-10T11:00:00Z",<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"active": true<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
                          &nbsp;&nbsp;],<br/>
                          &nbsp;&nbsp;"object": "list",<br/>
                          &nbsp;&nbsp;"total_count": 2<br/>
                          &#125;
                        </div>
                      </div>
                      
                      <div className="bg-gray-800 p-4 rounded-md mb-4">
                        <h4 className="text-md font-medium mb-2 text-white">POST /v1/api-keys</h4>
                        <p className="text-gray-400 mb-2">Required headers:</p>
                        <ul className="list-disc pl-5 mb-4 text-gray-400">
                          <li>Authorization: Bearer YOUR_API_KEY</li>
                          <li>Content-Type: application/json</li>
                        </ul>
                        
                        <p className="text-gray-400 mb-2">Request body:</p>
                        <div className="bg-gray-900 p-3 rounded-md font-mono text-sm mb-4">
                          &#123;<br/>
                          &nbsp;&nbsp;"name": "New Production Key",<br/>
                          &nbsp;&nbsp;"type": "production" // Options: test, development, training, deployment, production<br/>
                          &#125;
                        </div>
                        
                        <p className="text-gray-400 mb-2">Response:</p>
                        <div className="bg-gray-900 p-3 rounded-md font-mono text-sm">
                          &#123;<br/>
                          &nbsp;&nbsp;"id": "key_345678",<br/>
                          &nbsp;&nbsp;"key": "npr_5678abcdefghijklmnopqrstuvwxyz", // Only shown once<br/>
                          &nbsp;&nbsp;"name": "New Production Key",<br/>
                          &nbsp;&nbsp;"prefix": "npr_",<br/>
                          &nbsp;&nbsp;"created_at": "2023-05-16T09:30:00Z",<br/>
                          &nbsp;&nbsp;"active": true<br/>
                          &#125;
                        </div>
                      </div>
                      
                      <div className="bg-gray-800 p-4 rounded-md mb-4">
                        <h4 className="text-md font-medium mb-2 text-white">DELETE /v1/api-keys/:id</h4>
                        <p className="text-gray-400 mb-2">Required headers:</p>
                        <ul className="list-disc pl-5 mb-4 text-gray-400">
                          <li>Authorization: Bearer YOUR_API_KEY</li>
                        </ul>
                        
                        <p className="text-gray-400 mb-2">Response:</p>
                        <div className="bg-gray-900 p-3 rounded-md font-mono text-sm">
                          &#123;<br/>
                          &nbsp;&nbsp;"id": "key_345678",<br/>
                          &nbsp;&nbsp;"deleted": true<br/>
                          &#125;
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4 text-purple-400">Usage Statistics</h3>
                      <p className="text-gray-300 mb-4">
                        Retrieve usage statistics for your account.
                      </p>
                      
                      <div className="bg-gray-800 p-4 rounded-md mb-4">
                        <h4 className="text-md font-medium mb-2 text-white">GET /v1/usage</h4>
                        <p className="text-gray-400 mb-2">Required headers:</p>
                        <ul className="list-disc pl-5 mb-4 text-gray-400">
                          <li>Authorization: Bearer YOUR_API_KEY</li>
                        </ul>
                        
                        <p className="text-gray-400 mb-2">Query parameters:</p>
                        <ul className="list-disc pl-5 mb-4 text-gray-400">
                          <li>start_date: YYYY-MM-DD (optional)</li>
                          <li>end_date: YYYY-MM-DD (optional)</li>
                        </ul>
                        
                        <p className="text-gray-400 mb-2">Response:</p>
                        <div className="bg-gray-900 p-3 rounded-md font-mono text-sm">
                          &#123;<br/>
                          &nbsp;&nbsp;"data": [<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&#123;<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"date": "2023-05-15",<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"requests": 1250,<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"tokens": &#123;<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"input": 45000,<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"output": 32000<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;,<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"models": &#123;<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"gpt-nexus": 950,<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"stability-xl-1024": 300<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
                          &nbsp;&nbsp;],<br/>
                          &nbsp;&nbsp;"object": "list",<br/>
                          &nbsp;&nbsp;"total_requests": 1250,<br/>
                          &nbsp;&nbsp;"total_tokens": &#123;<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;"input": 45000,<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;"output": 32000<br/>
                          &nbsp;&nbsp;&#125;<br/>
                          &#125;
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 mb-4">
                      <h3 className="text-xl font-semibold mb-4 text-purple-400">Code Example</h3>
                      <div className="flex space-x-4 mb-4">
                        <button 
                          className={`px-3 py-1 rounded-md text-sm ${activeExample === 'javascript' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                          onClick={() => setActiveExample('javascript')}
                        >
                          JavaScript
                        </button>
                        <button 
                          className={`px-3 py-1 rounded-md text-sm ${activeExample === 'python' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                          onClick={() => setActiveExample('python')}
                        >
                          Python
                        </button>
                        <button 
                          className={`px-3 py-1 rounded-md text-sm ${activeExample === 'curl' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                          onClick={() => setActiveExample('curl')}
                        >
                          cURL
                        </button>
                      </div>
                  
                  {activeExample === 'javascript' && (
                      <div className="bg-gray-900 p-4 rounded-md font-mono text-sm overflow-x-auto">
                          // Create a new API key<br/>
                          async function createApiKey() &#123;<br/>
                          &nbsp;&nbsp;const API_KEY = process.env.NEURAL_NEXUS_API_KEY;<br/><br/>
                          
                          &nbsp;&nbsp;const response = await fetch('https://api.neuralnexus.ai/v1/api-keys', &#123;<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;method: 'POST',<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;headers: &#123;<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'Authorization': `Bearer $&#123;API_KEY&#125;`,<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'Content-Type': 'application/json'<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&#125;,<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;body: JSON.stringify(&#123;<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: 'My Development Key',<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;type: 'development'<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&#125;)<br/>
                        &nbsp;&nbsp;&#125;);<br/><br/>
                        
                        &nbsp;&nbsp;const data = await response.json();<br/>
                          &nbsp;&nbsp;console.log('New API key created:', data);<br/>
                          &nbsp;&nbsp;console.log('IMPORTANT: Save this key now as it won\'t be shown again!');<br/>
                        &nbsp;&nbsp;return data;<br/>
                        &#125;
                    </div>
                  )}
                  
                  {activeExample === 'python' && (
                      <div className="bg-gray-900 p-4 rounded-md font-mono text-sm overflow-x-auto">
                          import requests<br/>
                          import os<br/><br/>
                          
                          def manage_api_keys():<br/>
                          &nbsp;&nbsp;# Store API keys in environment variables<br/>
                          &nbsp;&nbsp;api_key = os.environ.get("NEURAL_NEXUS_API_KEY")<br/>
                          &nbsp;&nbsp;<br/>
                          &nbsp;&nbsp;if not api_key:<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;raise ValueError("API key is missing. Set the NEURAL_NEXUS_API_KEY environment variable.")<br/>
                          &nbsp;&nbsp;<br/>
                          &nbsp;&nbsp;base_url = "https://api.neuralnexus.ai/v1/api-keys"<br/>
                        &nbsp;&nbsp;headers = &#123;<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;"Authorization": f"Bearer &#123;api_key&#125;",<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;"Content-Type": "application/json"<br/>
                          &nbsp;&nbsp;&#125;<br/>
                          &nbsp;&nbsp;<br/>
                          &nbsp;&nbsp;# List all API keys<br/>
                          &nbsp;&nbsp;def list_keys():<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;response = requests.get(base_url, headers=headers)<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;response.raise_for_status()<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;return response.json()<br/>
                          &nbsp;&nbsp;<br/>
                          &nbsp;&nbsp;# Create a new API key<br/>
                          &nbsp;&nbsp;def create_key(name, key_type):<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;payload = &#123;<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": name,<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"type": key_type  # Options: test, development, training, deployment, production<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;response = requests.post(base_url, headers=headers, json=payload)<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;response.raise_for_status()<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;return response.json()<br/>
                          &nbsp;&nbsp;<br/>
                          &nbsp;&nbsp;# Delete an API key<br/>
                          &nbsp;&nbsp;def delete_key(key_id):<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;response = requests.delete(f"&#123;base_url&#125;/&#123;key_id&#125;", headers=headers)<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;response.raise_for_status()<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;return response.json()<br/>
                          &nbsp;&nbsp;<br/>
                          &nbsp;&nbsp;# Example usage<br/>
                          &nbsp;&nbsp;try:<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;# List all keys<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;keys = list_keys()<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;print(f"You have &#123;keys['total_count']&#125; API keys")<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;# Create a new key<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;new_key = create_key("Python Test Key", "test")<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;print(f"New key created: &#123;new_key['key']&#125;")<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;print("IMPORTANT: Save this key now as it won't be shown again!")<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;# Delete a key (uncomment to use)<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;# result = delete_key(new_key['id'])<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;# print(f"Key deleted: &#123;result['deleted']&#125;")<br/>
                          &nbsp;&nbsp;<br/>
                          &nbsp;&nbsp;except Exception as e:<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;print(f"Error: &#123;e&#125;")<br/>
                          <br/>
                          <br/>
                          # Run the example<br/>
                          manage_api_keys()
                    </div>
                  )}
                  
                  {activeExample === 'curl' && (
                      <div className="bg-gray-900 p-4 rounded-md font-mono text-sm overflow-x-auto">
                          # List all API keys<br/>
                          curl -X GET \<br/>
                          &nbsp;&nbsp;https://api.neuralnexus.ai/v1/api-keys \<br/>
                          &nbsp;&nbsp;-H 'Authorization: Bearer YOUR_API_KEY'<br/>
                          <br/>
                          # Create a new API key<br/>
                        curl -X POST \<br/>
                          &nbsp;&nbsp;https://api.neuralnexus.ai/v1/api-keys \<br/>
                        &nbsp;&nbsp;-H 'Authorization: Bearer YOUR_API_KEY' \<br/>
                        &nbsp;&nbsp;-H 'Content-Type: application/json' \<br/>
                        &nbsp;&nbsp;-d '&#123;<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;"name": "My Production Key",<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;"type": "production"<br/>
                          &nbsp;&nbsp;&#125;'<br/>
                          <br/>
                          # Delete an API key<br/>
                          curl -X DELETE \<br/>
                          &nbsp;&nbsp;https://api.neuralnexus.ai/v1/api-keys/key_123456 \<br/>
                          &nbsp;&nbsp;-H 'Authorization: Bearer YOUR_API_KEY'
                      </div>
                      )}
                    </div>
                  </APISection>
                  )}
                </div>
              </div>
            </div>
          </div>
      </section>

      {/* SDK Coming Soon Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-gray-900 via-blue-900/40 to-purple-900/40">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 mb-4"
            >
              <BookOpen className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">Developer Tools</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
            >
              Neural Nexus SDK
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                {/* Enhanced glowing border */}
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-75 blur-sm animate-border-glow"></div>
                {/* Content */}
                <span className="relative px-4 py-2 bg-gray-900/80 backdrop-blur-sm rounded-full text-sm font-semibold text-pink-400 inline-block">
                  Coming in Q1 2027
                </span>
              </div>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-gray-300"
            >
              Our official SDK will provide native libraries for multiple programming languages, making integration even easier with type safety, automatic retries, and simplified authentication.
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          >
            {/* SDK Features */}
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 relative overflow-hidden"
              whileHover={{ 
                boxShadow: "0 0 15px 2px rgba(59, 130, 246, 0.3)",
                scale: 1.02
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Subtle background animation */}
              <div className="absolute -inset-1 bg-blue-500/10 rounded-xl blur-xl animate-pulse-slow"></div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-400" />
                Core SDK Features
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-400 mt-1" />
                  <div>
                    <p className="font-medium">Type-safe interfaces</p>
                    <p className="text-sm text-gray-400">Eliminate runtime errors with comprehensive type definitions and IDE autocompletion</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-400 mt-1" />
                  <div>
                    <p className="font-medium">Resilient connections</p>
                    <p className="text-sm text-gray-400">Automatic retries with exponential backoff, connection pooling, and circuit breakers</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-400 mt-1" />
                  <div>
                    <p className="font-medium">Advanced streaming</p>
                    <p className="text-sm text-gray-400">Bidirectional streaming with progress callbacks and cancellation support</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-400 mt-1" />
                  <div>
                    <p className="font-medium">Multi-model pipelines</p>
                    <p className="text-sm text-gray-400">Chain multiple models together with built-in data transformations</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-400 mt-1" />
                  <div>
                    <p className="font-medium">Observability</p>
                    <p className="text-sm text-gray-400">Built-in metrics, tracing, and logging with popular monitoring tools integration</p>
                  </div>
                </li>
              </ul>
            </motion.div>
            
            {/* Language Support */}
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 relative overflow-hidden"
              whileHover={{ 
                boxShadow: "0 0 15px 2px rgba(168, 85, 247, 0.3)",
                scale: 1.02
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Subtle background animation */}
              <div className="absolute -inset-1 bg-purple-500/10 rounded-xl blur-xl animate-pulse-slow"></div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Code className="h-5 w-5 text-purple-400" />
                Language Support
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                Our comprehensive SDK will launch with first-class support for these languages, with identical APIs and features across all platforms:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <motion.div 
                  className="p-3 bg-blue-900/30 rounded-lg border border-blue-900/30"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(30, 64, 175, 0.4)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <p className="font-medium text-blue-300">TypeScript</p>
                  <p className="text-xs text-gray-400">First-class support</p>
                </motion.div>
                <motion.div 
                  className="p-3 bg-yellow-900/30 rounded-lg border border-yellow-900/30"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(161, 98, 7, 0.4)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <p className="font-medium text-yellow-300">Python</p>
                  <p className="text-xs text-gray-400">Full async support</p>
                </motion.div>
                <motion.div 
                  className="p-3 bg-cyan-900/30 rounded-lg border border-cyan-900/30"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(8, 145, 178, 0.4)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <p className="font-medium text-cyan-300">Go</p>
                  <p className="text-xs text-gray-400">Concurrent by default</p>
                </motion.div>
                <motion.div 
                  className="p-3 bg-green-900/30 rounded-lg border border-green-900/30"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(21, 128, 61, 0.4)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <p className="font-medium text-green-300">Java</p>
                  <p className="text-xs text-gray-400">Enterprise ready</p>
                </motion.div>
                <motion.div 
                  className="p-3 bg-red-900/30 rounded-lg border border-red-900/30"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(153, 27, 27, 0.4)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <p className="font-medium text-red-300">Ruby</p>
                  <p className="text-xs text-gray-400">Elegant integration</p>
                </motion.div>
                <motion.div 
                  className="p-3 bg-purple-900/30 rounded-lg border border-purple-900/30"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(126, 34, 206, 0.4)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <p className="font-medium text-purple-300">.NET</p>
                  <p className="text-xs text-gray-400">C# & F# support</p>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Waitlist */}
            <motion.div 
              className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 backdrop-blur-sm border border-blue-700/50 rounded-xl p-6 flex flex-col relative overflow-hidden"
              whileHover={{ 
                boxShadow: "0 0 20px 5px rgba(219, 39, 119, 0.3)",
                scale: 1.02
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Animated background effect */}
              <div className="absolute -inset-1 bg-pink-500/10 rounded-xl blur-xl animate-pulse-slow"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl animate-gradient-x"></div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-pink-400" />
                SDK Roadmap & Early Access
              </h3>
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-3 w-3 rounded-full bg-green-400"></div>
                  <p className="text-sm font-medium text-green-400">Q3 2026: Alpha Testing</p>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-3 w-3 rounded-full bg-blue-400"></div>
                  <p className="text-sm font-medium text-blue-400">Q4 2026: Beta Program</p>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-3 w-3 rounded-full bg-pink-400"></div>
                  <p className="text-sm font-medium text-pink-400">Q1 2027: Public Release</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                Join our early access program and receive:
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-pink-400" />
                  <span className="text-sm">Beta access 6 months before public launch</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-pink-400" />
                  <span className="text-sm">Direct support from our core engineering team</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-pink-400" />
                  <span className="text-sm">Influence on feature prioritization</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-pink-400" />
                  <span className="text-sm">Free usage credits during beta period</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-pink-400" />
                  <span className="text-sm">Early access to new model capabilities</span>
                </li>
              </ul>
              <motion.button 
                className="mt-auto px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-sm font-medium flex items-center justify-center relative overflow-hidden group"
                onClick={() => alert('Thanks for your interest! You\'ll be notified when our SDK is available.')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 animate-gradient-x opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10">Join the waitlist</span>
                <motion.span 
                  className="absolute inset-0 bg-white/20 rounded-lg"
                  initial={{ x: "-100%", opacity: 0 }}
                  whileHover={{ x: "100%", opacity: 0.3 }}
                  transition={{ duration: 0.6 }}
                />
              </motion.button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="text-center text-gray-500 mt-8 max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold text-purple-400 mb-3">About the Neural Nexus SDK</h3>
            <p className="text-sm mb-3">
              Our official SDK represents a comprehensive toolkit for integrating Neural Nexus capabilities into your applications. 
              Currently in active development, the SDK is designed to provide both high-level abstractions for rapid implementation 
              and low-level controls for fine-grained customization across all platform capabilities.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mt-4 mb-6">
              <div className="bg-gray-800/30 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-blue-400 mb-1">Model Integration</h4>
                <ul className="text-xs space-y-1 text-gray-400">
                  <li>• Unified interface for all Neural Nexus models</li>
                  <li>• Seamless model switching and version management</li>
                  <li>• Local model caching and optimization</li>
                  <li>• Custom model fine-tuning workflows</li>
                </ul>
              </div>
              <div className="bg-gray-800/30 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-green-400 mb-1">Enterprise Features</h4>
                <ul className="text-xs space-y-1 text-gray-400">
                  <li>• Role-based access control integration</li>
                  <li>• Audit logging and compliance reporting</li>
                  <li>• On-premises deployment support</li>
                  <li>• Data residency and sovereignty controls</li>
                </ul>
              </div>
              <div className="bg-gray-800/30 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-amber-400 mb-1">Developer Experience</h4>
                <ul className="text-xs space-y-1 text-gray-400">
                  <li>• Extensive documentation with interactive examples</li>
                  <li>• Playground environment for rapid prototyping</li>
                  <li>• CI/CD integration templates</li>
                  <li>• Comprehensive testing utilities</li>
                </ul>
              </div>
              <div className="bg-gray-800/30 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-pink-400 mb-1">Advanced AI Capabilities</h4>
                <ul className="text-xs space-y-1 text-gray-400">
                  <li>• Multi-modal inputs and outputs</li>
                  <li>• Retrieval-augmented generation (RAG)</li>
                  <li>• Agent-based workflows and tools</li>
                  <li>• Custom prompt management system</li>
                </ul>
              </div>
            </div>
            <p className="text-xs">Our SDK is currently in early development with public release planned for Q1 2027.</p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function APINavItem({ id, active, onClick, icon, title }: any) {
  return (
    <button
      className={`w-full px-3 py-2 rounded-lg transition-all flex items-center justify-between text-sm ${
        active 
          ? "bg-purple-600/20 text-purple-400 font-medium" 
          : "text-gray-300 hover:bg-gray-700/50"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <span className={`mr-2 ${active ? 'text-purple-400' : 'text-gray-400'}`}>
          {icon}
        </span>
        <span>{title}</span>
      </div>
      <ChevronDown 
        className={`h-4 w-4 transition-transform ${
          active ? "rotate-180" : ""
        }`}
      />
    </button>
  );
}

function APISection({ title, children }: any) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      {children}
    </div>
  );
} 