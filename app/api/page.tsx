"use client";

import React, { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ChevronDown, Code, Server, Lock, Zap, Check, Key } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/providers/AppProvider';

export default function APIPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeExample, setActiveExample] = useState('authentication');
  const router = useRouter();
  const { user } = useAppContext();

  // Handle get API key button click
  const handleGetApiKey = () => {
    if (user) {
      // User is logged in, redirect to dashboard API section
      router.push('/dashboard?tab=api');
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
                    
                    <div className="bg-yellow-900/20 border border-yellow-900/30 rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-2 flex items-center">
                        <Lock className="h-5 w-5 mr-2 text-yellow-400" />
                        Security Best Practices
                      </h3>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Never share your API keys</li>
                        <li>Do not include API keys in client-side code</li>
                        <li>Rotate your keys periodically</li>
                        <li>Use environment variables to store keys securely</li>
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
                    <p className="mb-4">
                      The Inference API allows you to run models on your inputs and get predictions in real-time.
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
              </div>
              
              {/* Code Examples Selection */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Code Examples</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <button 
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      activeExample === 'authentication' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                    onClick={() => setActiveExample('authentication')}
                  >
                    Authentication
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      activeExample === 'javascript' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                    onClick={() => setActiveExample('javascript')}
                  >
                    JavaScript
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      activeExample === 'python' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                    onClick={() => setActiveExample('python')}
                  >
                    Python
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      activeExample === 'curl' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                    onClick={() => setActiveExample('curl')}
                  >
                    cURL
                  </button>
                </div>
                
                <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 p-6">
                  {activeExample === 'authentication' && (
                    <div>
                      <h4 className="text-lg font-medium mb-3 text-purple-300">Authentication Examples</h4>
                      <div className="bg-gray-900 p-4 rounded-md font-mono text-sm overflow-x-auto mb-4">
                        // JavaScript<br/>
                        const apiKey = 'YOUR_API_KEY';<br/>
                        const headers = &#123;<br/>
                        &nbsp;&nbsp;'Authorization': `Bearer $&#123;apiKey&#125;`,<br/>
                        &nbsp;&nbsp;'Content-Type': 'application/json'<br/>
                        &#125;;<br/>
                      </div>
                      
                      <div className="bg-gray-900 p-4 rounded-md font-mono text-sm overflow-x-auto">
                        # Python<br/>
                        import requests<br/><br/>
                        
                        api_key = "YOUR_API_KEY"<br/>
                        headers = &#123;<br/>
                        &nbsp;&nbsp;"Authorization": f"Bearer $&#123;api_key&#125;",<br/>
                        &nbsp;&nbsp;"Content-Type": "application/json"<br/>
                        &#125;
                      </div>
                    </div>
                  )}
                  
                  {activeExample === 'javascript' && (
                    <div>
                      <h4 className="text-lg font-medium mb-3 text-purple-300">JavaScript Example</h4>
                      <div className="bg-gray-900 p-4 rounded-md font-mono text-sm overflow-x-auto">
                        // Text generation example<br/>
                        async function generateText() &#123;<br/>
                        &nbsp;&nbsp;const API_KEY = 'YOUR_API_KEY';<br/>
                        &nbsp;&nbsp;const MODEL_ID = 'gpt-nexus';<br/><br/>
                        
                        &nbsp;&nbsp;const response = await fetch(`https://api.neuralnexus.ai/v1/models/$&#123;MODEL_ID&#125;/generate`, &#123;<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;method: 'POST',<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;headers: &#123;<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'Authorization': `Bearer $&#123;API_KEY&#125;`,<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'Content-Type': 'application/json'<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&#125;,<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;body: JSON.stringify(&#123;<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;prompt: 'Write a short story about artificial intelligence',<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;max_tokens: 500,<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;temperature: 0.7<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&#125;)<br/>
                        &nbsp;&nbsp;&#125;);<br/><br/>
                        
                        &nbsp;&nbsp;const data = await response.json();<br/>
                        &nbsp;&nbsp;console.log(data.text);<br/>
                        &nbsp;&nbsp;return data;<br/>
                        &#125;
                      </div>
                    </div>
                  )}
                  
                  {activeExample === 'python' && (
                    <div>
                      <h4 className="text-lg font-medium mb-3 text-purple-300">Python Example</h4>
                      <div className="bg-gray-900 p-4 rounded-md font-mono text-sm overflow-x-auto">
                        import requests<br/><br/>
                        
                        def generate_image(prompt):<br/>
                        &nbsp;&nbsp;api_key = "YOUR_API_KEY"<br/>
                        &nbsp;&nbsp;model_id = "stability-xl-1024"<br/><br/>
                        
                        &nbsp;&nbsp;url = f"https://api.neuralnexus.ai/v1/models/&#123;model_id&#125;/images"<br/>
                        &nbsp;&nbsp;headers = &#123;<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;"Authorization": f"Bearer $&#123;api_key&#125;",<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;"Content-Type": "application/json"<br/>
                        &nbsp;&nbsp;&#125;<br/><br/>
                        
                        &nbsp;&nbsp;payload = &#123;<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;"prompt": prompt,<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;"n": 1,<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;"size": "1024x1024"<br/>
                        &nbsp;&nbsp;&#125;<br/><br/>
                        
                        &nbsp;&nbsp;response = requests.post(url, headers=headers, json=payload)<br/>
                        &nbsp;&nbsp;return response.json()<br/><br/>
                        
                        # Example usage<br/>
                        result = generate_image("A futuristic city with flying cars")<br/>
                        print(result["images"][0]["url"])
                      </div>
                    </div>
                  )}
                  
                  {activeExample === 'curl' && (
                    <div>
                      <h4 className="text-lg font-medium mb-3 text-purple-300">cURL Examples</h4>
                      <div className="bg-gray-900 p-4 rounded-md font-mono text-sm overflow-x-auto mb-4">
                        # List all models<br/>
                        curl -X GET \<br/>
                        &nbsp;&nbsp;https://api.neuralnexus.ai/v1/models \<br/>
                        &nbsp;&nbsp;-H 'Authorization: Bearer YOUR_API_KEY'
                      </div>
                      
                      <div className="bg-gray-900 p-4 rounded-md font-mono text-sm overflow-x-auto">
                        # Text generation<br/>
                        curl -X POST \<br/>
                        &nbsp;&nbsp;https://api.neuralnexus.ai/v1/models/gpt-nexus/generate \<br/>
                        &nbsp;&nbsp;-H 'Authorization: Bearer YOUR_API_KEY' \<br/>
                        &nbsp;&nbsp;-H 'Content-Type: application/json' \<br/>
                        &nbsp;&nbsp;-d '&#123;<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;"prompt": "Write a short poem about artificial intelligence",<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;"max_tokens": 256,<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;"temperature": 0.7<br/>
                        &nbsp;&nbsp;&#125;'
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
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