"use client";

import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { 
  Code, 
  Copy, 
  FileJson, 
  CheckCircle, 
  Server, 
  Terminal,
  ChevronDown,
  BookOpen,
  ExternalLink,
  Search
} from "lucide-react";
import Link from "next/link";

export default function ApiReferencePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedEndpoint, setCopiedEndpoint] = useState("");
  const [expandedCategory, setExpandedCategory] = useState("models");
  
  // API endpoints by category
  const apiCategories = [
    {
      id: "models",
      name: "Models",
      description: "Endpoints for deploying, managing, and using models.",
      endpoints: [
        {
          method: "GET",
          path: "/api/v1/models",
          description: "List all models available to your account",
          response: `{
  "models": [
    {
      "id": "sd-xl-base-1.0",
      "name": "Stable Diffusion XL",
      "version": "1.0",
      "type": "image",
      "visibility": "public",
      "status": "ready"
    },
    {
      "id": "llama-13b",
      "name": "Llama 2",
      "version": "13B",
      "type": "text",
      "visibility": "private",
      "status": "ready"
    }
  ]
}`
        },
        {
          method: "POST",
          path: "/api/v1/models/deploy",
          description: "Deploy a new model to your account",
          request: `{
  "name": "My Custom Model",
  "file_id": "file_abc123",
  "model_type": "text", 
  "framework": "pytorch",
  "visibility": "private",
  "compute_config": {
    "instance_type": "gpu.t4",
    "autoscaling": true
  }
}`,
          response: `{
  "model_id": "custom-model-xyz789",
  "status": "deploying",
  "estimated_time": 120
}`
        },
        {
          method: "POST",
          path: "/api/v1/models/{model_id}/predict",
          description: "Run inference on a deployed model",
          request: `{
  "input": {
    "prompt": "Write a short poem about AI",
    "max_tokens": 100,
    "temperature": 0.7
  }
}`,
          response: `{
  "output": {
    "text": "Silicon dreams and neural streams,\\nIntelligence beyond our schemes.\\nIn lines of code, a mind anew,\\nLearning things we never knew."
  },
  "metrics": {
    "tokens_generated": 32,
    "generation_time": 1.45
  }
}`
        }
      ]
    },
    {
      id: "files",
      name: "Files",
      description: "Endpoints for uploading and managing files.",
      endpoints: [
        {
          method: "POST",
          path: "/api/v1/files/upload",
          description: "Upload model files or data",
          request: `// Multipart form data with file`,
          response: `{
  "file_id": "file_abc123",
  "filename": "model.pt",
  "size_bytes": 5243890,
  "created_at": "2024-05-20T12:34:56Z"
}`
        },
        {
          method: "GET",
          path: "/api/v1/files",
          description: "List all files in your account",
          response: `{
  "files": [
    {
      "file_id": "file_abc123",
      "filename": "model.pt",
      "size_bytes": 5243890, 
      "created_at": "2024-05-20T12:34:56Z"
    },
    {
      "file_id": "file_def456",
      "filename": "training_data.jsonl",
      "size_bytes": 2097152,
      "created_at": "2024-05-19T10:22:33Z" 
    }
  ]
}`
        }
      ]
    },
    {
      id: "analytics",
      name: "Analytics",
      description: "Endpoints for monitoring usage and performance.",
      endpoints: [
        {
          method: "GET",
          path: "/api/v1/analytics/usage",
          description: "Get API usage statistics",
          response: `{
  "period": "2024-05",
  "total_requests": 5280,
  "total_tokens": 428500,
  "models": [
    {
      "model_id": "sd-xl-base-1.0",
      "requests": 1250,
      "avg_latency_ms": 950
    },
    {
      "model_id": "llama-13b",
      "requests": 4030,
      "tokens": 428500,
      "avg_latency_ms": 120
    }
  ]
}`
        },
        {
          method: "GET",
          path: "/api/v1/analytics/models/{model_id}",
          description: "Get performance metrics for a specific model",
          response: `{
  "model_id": "llama-13b",
  "period": "2024-05-01 to 2024-05-20",
  "requests": 4030,
  "tokens_generated": 428500,
  "avg_latency_ms": 120,
  "p95_latency_ms": 180,
  "error_rate": 0.002,
  "hourly_usage": [
    {"hour": "2024-05-20T00:00:00Z", "requests": 42},
    {"hour": "2024-05-20T01:00:00Z", "requests": 38},
    // ...additional hours
  ]
}`
        }
      ]
    },
    {
      id: "users",
      name: "Users & Auth",
      description: "Endpoints for user management and authentication.",
      endpoints: [
        {
          method: "POST",
          path: "/api/v1/auth/token",
          description: "Generate a new API token",
          request: `{
  "email": "user@example.com",
  "password": "your-password",
  "token_name": "Production API Token",
  "expires_in": 2592000
}`,
          response: `{
  "token": "nex_api_xyzABC123...",
  "token_name": "Production API Token",
  "expires_at": "2024-06-20T15:30:45Z"
}`
        },
        {
          method: "GET",
          path: "/api/v1/users/me",
          description: "Get current user information",
          response: `{
  "id": "user_123456",
  "email": "user@example.com",
  "name": "Alex Smith",
  "organization": "Neural Nexus Inc",
  "plan": "pro",
  "created_at": "2023-10-15T09:12:34Z"
}`
        }
      ]
    }
  ];
  
  // Filter endpoints based on search
  const filteredCategories = apiCategories.map(category => {
    const filteredEndpoints = category.endpoints.filter(endpoint => 
      endpoint.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      endpoint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      endpoint.method.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return {
      ...category,
      endpoints: filteredEndpoints,
      hasMatches: filteredEndpoints.length > 0
    };
  }).filter(category => category.hasMatches);
  
  // Handle copy to clipboard
  const copyToClipboard = (text, endpointPath) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpointPath);
    setTimeout(() => setCopiedEndpoint(""), 2000);
  };
  
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500">
              API Reference
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Complete documentation for integrating with the Neural Nexus platform
            </p>
            
            <div className="flex max-w-xl mx-auto relative mb-12">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="Search endpoints..."
                className="w-full bg-gray-800/50 text-white border border-gray-700 rounded-lg py-3 px-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <Link
                href="/docs/api/getting-started"
                className="px-5 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Getting Started
              </Link>
              <Link
                href="/docs/api/sdks"
                className="px-5 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center"
              >
                <Code className="mr-2 h-4 w-4" />
                Client SDKs
              </Link>
              <Link
                href="https://github.com/Drago-03/Neural-Nexus"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center"
              >
                <Terminal className="mr-2 h-4 w-4" />
                Code Examples
                <ExternalLink className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </motion.div>
          
          {/* API Reference Content */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden mb-8">
              <div className="p-4 bg-gray-800/50 border-b border-gray-700/50 flex items-center">
                <Server className="h-5 w-5 mr-2 text-blue-400" />
                <span className="text-sm font-mono">Base URL: <span className="text-green-400">https://api.neuralnexus.ai</span></span>
              </div>
              
              <div className="p-4 bg-gray-800/80 border-b border-gray-700/50">
                <p className="text-sm text-gray-300">
                  All API calls require authentication. Include your API key in the headers:
                </p>
                <div className="mt-2 bg-gray-900 p-3 rounded-lg flex justify-between items-center">
                  <code className="text-xs font-mono text-gray-300">
                    Authorization: Bearer nex_api_YOUR_API_KEY
                  </code>
                  <button 
                    className="text-gray-400 hover:text-white"
                    onClick={() => copyToClipboard("Authorization: Bearer nex_api_YOUR_API_KEY", "auth-header")}
                  >
                    {copiedEndpoint === "auth-header" ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              
              {filteredCategories.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <FileJson className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No matching API endpoints found.</p>
                  <p className="text-sm mt-1">Try adjusting your search query.</p>
                </div>
              ) : (
                filteredCategories.map(category => (
                  <div key={category.id} className="border-b border-gray-700/50 last:border-b-0">
                    <button
                      className="w-full p-4 flex items-center justify-between hover:bg-gray-800/30 transition-colors"
                      onClick={() => setExpandedCategory(expandedCategory === category.id ? "" : category.id)}
                    >
                      <div className="flex items-center">
                        <h3 className="font-bold text-lg">{category.name}</h3>
                        <span className="ml-3 text-xs bg-gray-700 px-2 py-0.5 rounded-full text-gray-300">
                          {category.endpoints.length} endpoints
                        </span>
                      </div>
                      <ChevronDown className={`h-5 w-5 transition-transform ${expandedCategory === category.id ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {expandedCategory === category.id && (
                      <div className="border-t border-gray-700/50 p-4">
                        <p className="text-gray-400 mb-4">{category.description}</p>
                        
                        <div className="space-y-8">
                          {category.endpoints.map((endpoint, index) => (
                            <div key={index} className="bg-gray-800/40 rounded-lg overflow-hidden">
                              <div className="p-3 flex justify-between items-center border-b border-gray-700/50">
                                <div className="flex items-center">
                                  <span className={`inline-block px-2 py-1 text-xs font-bold rounded mr-3 ${
                                    endpoint.method === 'GET' ? 'bg-green-900/60 text-green-400' :
                                    endpoint.method === 'POST' ? 'bg-blue-900/60 text-blue-400' :
                                    endpoint.method === 'PUT' ? 'bg-yellow-900/60 text-yellow-400' :
                                    endpoint.method === 'DELETE' ? 'bg-red-900/60 text-red-400' :
                                    'bg-gray-900/60 text-gray-400'
                                  }`}>
                                    {endpoint.method}
                                  </span>
                                  <code className="font-mono text-sm">{endpoint.path}</code>
                                </div>
                                <button 
                                  className="text-gray-400 hover:text-white"
                                  onClick={() => copyToClipboard(endpoint.path, endpoint.path)}
                                >
                                  {copiedEndpoint === endpoint.path ? (
                                    <CheckCircle className="h-4 w-4 text-green-400" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                              
                              <div className="p-3 border-b border-gray-700/50">
                                <p className="text-sm">{endpoint.description}</p>
                              </div>
                              
                              {endpoint.request && (
                                <div className="border-b border-gray-700/50">
                                  <div className="p-2 bg-gray-800/70 text-xs font-semibold text-gray-400">REQUEST BODY</div>
                                  <pre className="p-3 overflow-auto bg-gray-900/80 text-xs font-mono text-gray-300 max-h-60">
                                    {endpoint.request}
                                  </pre>
                                </div>
                              )}
                              
                              <div>
                                <div className="p-2 bg-gray-800/70 text-xs font-semibold text-gray-400">RESPONSE</div>
                                <pre className="p-3 overflow-auto bg-gray-900/80 text-xs font-mono text-gray-300 max-h-60">
                                  {endpoint.response}
                                </pre>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            
            <motion.div 
              className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-700/30 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-3">Need Help With Integration?</h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Our documentation covers everything from authentication to advanced usage patterns.
                If you need more support, reach out to our developer community or contact our team.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/docs"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Full Documentation
                </Link>
                <Link
                  href="/contact"
                  className="px-5 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center"
                >
                  Contact Support
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
} 