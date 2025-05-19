"use client";

import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ChevronDown, Server, Shield, Zap, Database, Code, Cpu, HardDrive, Cloud, Globe } from "lucide-react";
import Link from "next/link";

export default function HostingDocsPage() {
  const [activeSection, setActiveSection] = useState('overview');

  // Toggle section visibility
  const toggleSection = (section: string) => {
    setActiveSection(section === activeSection ? '' : section);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />

      {/* Documentation Header */}
      <section className="pt-28 pb-10 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-pink-500">
            Model Hosting Documentation
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to know about deploying and scaling your AI models on Neural Nexus.
          </p>
        </div>
      </section>

      {/* Docs Content */}
      <section className="pb-20 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:w-1/4">
              <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50 sticky top-24">
                <h3 className="text-xl font-semibold mb-4">Documentation</h3>
                <nav className="space-y-1">
                  <DocNavItem 
                    id="overview" 
                    active={activeSection === 'overview'} 
                    onClick={() => toggleSection('overview')}
                    icon={<Zap className="h-4 w-4" />}
                    title="Overview"
                  />
                  <DocNavItem 
                    id="getting-started" 
                    active={activeSection === 'getting-started'} 
                    onClick={() => toggleSection('getting-started')}
                    icon={<Server className="h-4 w-4" />}
                    title="Getting Started"
                  />
                  <DocNavItem 
                    id="deployment-options" 
                    active={activeSection === 'deployment-options'} 
                    onClick={() => toggleSection('deployment-options')}
                    icon={<Cloud className="h-4 w-4" />}
                    title="Deployment Options"
                  />
                  <DocNavItem 
                    id="scaling" 
                    active={activeSection === 'scaling'} 
                    onClick={() => toggleSection('scaling')}
                    icon={<Cpu className="h-4 w-4" />}
                    title="Scaling & Performance"
                  />
                  <DocNavItem 
                    id="security" 
                    active={activeSection === 'security'} 
                    onClick={() => toggleSection('security')}
                    icon={<Shield className="h-4 w-4" />}
                    title="Security & Compliance"
                  />
                  <DocNavItem 
                    id="monitoring" 
                    active={activeSection === 'monitoring'} 
                    onClick={() => toggleSection('monitoring')}
                    icon={<Database className="h-4 w-4" />}
                    title="Monitoring & Analytics"
                  />
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 overflow-hidden">
                <DocSection
                  id="overview"
                  title="Hosting Overview"
                  icon={<Zap className="h-6 w-6 text-blue-400" />}
                  isActive={activeSection === 'overview'}
                >
                  <h3 className="text-xl font-medium mb-3 text-blue-300">Neural Nexus Hosting Platform</h3>
                  <p className="mb-4">
                    The Neural Nexus hosting platform provides a secure, scalable, and high-performance environment
                    for deploying AI models in production. Our infrastructure is optimized for machine learning workloads,
                    with support for various hardware accelerators including GPUs and TPUs.
                  </p>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 mb-6">
                    <h4 className="font-medium text-white mb-2">Key Features</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Serverless deployment with automatic scaling</li>
                      <li>Dedicated instances for consistent performance</li>
                      <li>Enterprise-grade security and compliance</li>
                      <li>Comprehensive monitoring and analytics</li>
                      <li>Global edge deployment for low-latency inference</li>
                      <li>Cost optimization tools and recommendations</li>
                    </ul>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-medium mb-3 text-purple-300">Hosting Architecture</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <h5 className="font-medium text-green-400 mb-2">Frontend Layer</h5>
                        <p className="text-sm">API gateway, load balancing, and request routing for optimal performance.</p>
                      </div>
                      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <h5 className="font-medium text-green-400 mb-2">Compute Layer</h5>
                        <p className="text-sm">Distributed inference servers with GPU/TPU acceleration and automatic scaling.</p>
                      </div>
                      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <h5 className="font-medium text-green-400 mb-2">Management Layer</h5>
                        <p className="text-sm">Monitoring, logging, and analytics for tracking model performance and usage.</p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4">
                    Our hosting platform is designed to handle various model types and workloads, from simple inference APIs
                    to complex multi-model systems requiring orchestration and coordination.
                  </p>
                </DocSection>
                
                <DocSection
                  id="getting-started"
                  title="Getting Started"
                  icon={<Server className="h-6 w-6 text-green-400" />}
                  isActive={activeSection === 'getting-started'}
                >
                  <h3 className="text-xl font-medium mb-3 text-green-300">Deploying Your First Model</h3>
                  <p className="mb-4">
                    Follow these steps to deploy your first model on the Neural Nexus hosting platform:
                  </p>
                  
                  <div className="space-y-4 mb-6">
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 space-y-2">
                      <h5 className="font-medium text-blue-400">1. Prepare Your Model</h5>
                      <p className="text-sm text-gray-300">
                        Package your model according to our format specifications. We support models from all major
                        frameworks including PyTorch, TensorFlow, JAX, and ONNX.
                      </p>
                      <pre className="bg-gray-900 p-3 rounded-md text-xs mt-2 overflow-x-auto">
                        {"# Example directory structure\nmodel/\n├── model.onnx        # Your model in ONNX format\n├── config.json       # Model configuration\n├── preprocessor.py   # Optional preprocessing code\n└── requirements.txt  # Python dependencies"}
                      </pre>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 space-y-2">
                      <h5 className="font-medium text-blue-400">2. Create a Deployment</h5>
                      <p className="text-sm text-gray-300">
                        Use the dashboard or API to create a new deployment, specifying your model package and
                        desired configuration options.
                      </p>
                      <pre className="bg-gray-900 p-3 rounded-md text-xs mt-2 overflow-x-auto">
                        {"# Using the Neural Nexus CLI\nneuralnexus deploy create \\\n--name \"my-first-model\" \\\n--model ./model \\\n--compute-type gpu-t4 \\\n--min-replicas 1 \\\n--max-replicas 5"}
                      </pre>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 space-y-2">
                      <h5 className="font-medium text-blue-400">3. Test Your Deployment</h5>
                      <p className="text-sm text-gray-300">
                        Once your model is deployed, you can test it using the provided API endpoint.
                      </p>
                      <pre className="bg-gray-900 p-3 rounded-md text-xs mt-2 overflow-x-auto">
                        {"curl -X POST \\\nhttps://api.neuralnexus.ai/v1/models/my-first-model/predict \\\n-H \"Authorization: Bearer YOUR_API_KEY\" \\\n-H \"Content-Type: application/json\" \\\n-d '{\"inputs\": {\"text\": \"Hello, Neural Nexus!\"}}'"}
                      </pre>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 space-y-2">
                      <h5 className="font-medium text-blue-400">4. Monitor Performance</h5>
                      <p className="text-sm text-gray-300">
                        Use the dashboard to monitor your model's performance, including latency, throughput, and error rates.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-purple-900/20 border border-purple-900/30 rounded-lg p-4 mt-6">
                    <h4 className="text-lg font-medium mb-2 flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-purple-400" />
                      Quick Tip
                    </h4>
                    <p className="text-sm">
                      Start with our Serverless option for most use cases. It provides automatic scaling
                      and you only pay for what you use. For more consistent workloads, consider
                      dedicated instances.
                    </p>
                  </div>
                </DocSection>
                
                <DocSection
                  id="deployment-options"
                  title="Deployment Options"
                  icon={<Cloud className="h-6 w-6 text-purple-400" />}
                  isActive={activeSection === 'deployment-options'}
                >
                  <h3 className="text-xl font-medium mb-3 text-purple-300">Choose Your Deployment Type</h3>
                  <p className="mb-4">
                    Neural Nexus offers multiple deployment options to meet your specific requirements for 
                    performance, cost, and control.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
                      <div className="p-4 bg-gradient-to-r from-blue-500/10 to-blue-700/10 border-b border-gray-700">
                        <h4 className="font-bold text-blue-300">Serverless</h4>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-300 mb-4">
                          Auto-scaling serverless deployments with pay-per-use pricing. Ideal for variable workloads.
                        </p>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start">
                            <span className="text-green-400 mr-2">✓</span>
                            <span>Zero cold-start optimization</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-400 mr-2">✓</span>
                            <span>Pay only for compute used</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-400 mr-2">✓</span>
                            <span>Scales to zero when idle</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-400 mr-2">✓</span>
                            <span>Automatic load balancing</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
                      <div className="p-4 bg-gradient-to-r from-purple-500/10 to-purple-700/10 border-b border-gray-700">
                        <h4 className="font-bold text-purple-300">Dedicated Instances</h4>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-300 mb-4">
                          Reserved compute resources with consistent performance. Ideal for predictable workloads.
                        </p>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start">
                            <span className="text-green-400 mr-2">✓</span>
                            <span>Guaranteed compute resources</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-400 mr-2">✓</span>
                            <span>Predictable monthly pricing</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-400 mr-2">✓</span>
                            <span>No cold starts</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-400 mr-2">✓</span>
                            <span>Custom hardware configurations</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
                      <div className="p-4 bg-gradient-to-r from-green-500/10 to-green-700/10 border-b border-gray-700">
                        <h4 className="font-bold text-green-300">Private Deployment</h4>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-300 mb-4">
                          Deploy in your own infrastructure or VPC for maximum control and compliance.
                        </p>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start">
                            <span className="text-green-400 mr-2">✓</span>
                            <span>Data sovereignty compliance</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-400 mr-2">✓</span>
                            <span>Integration with existing systems</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-400 mr-2">✓</span>
                            <span>Custom security policies</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-400 mr-2">✓</span>
                            <span>Dedicated support team</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-medium mb-3 text-blue-300">Hardware Options</h4>
                  <p className="mb-4">
                    Choose from a variety of hardware options to optimize for your specific model requirements.
                  </p>
                  
                  <div className="overflow-x-auto mb-8">
                    <table className="min-w-full bg-gray-900/30 rounded-lg">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Hardware Type
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Recommended For
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Memory
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Price
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-800">
                          <td className="px-4 py-3 whitespace-nowrap">CPU Standard</td>
                          <td className="px-4 py-3">Small models, pre/post-processing</td>
                          <td className="px-4 py-3">4-16 GB</td>
                          <td className="px-4 py-3">$0.10/hour</td>
                        </tr>
                        <tr className="border-b border-gray-800">
                          <td className="px-4 py-3 whitespace-nowrap">T4 GPU</td>
                          <td className="px-4 py-3">Medium-sized models, inference</td>
                          <td className="px-4 py-3">16 GB</td>
                          <td className="px-4 py-3">$0.60/hour</td>
                        </tr>
                        <tr className="border-b border-gray-800">
                          <td className="px-4 py-3 whitespace-nowrap">A100 GPU</td>
                          <td className="px-4 py-3">Large language models, high throughput</td>
                          <td className="px-4 py-3">40-80 GB</td>
                          <td className="px-4 py-3">$3.00/hour</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap">TPU v4</td>
                          <td className="px-4 py-3">Specialized ML workloads</td>
                          <td className="px-4 py-3">32 GB</td>
                          <td className="px-4 py-3">$2.50/hour</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="bg-yellow-900/20 border border-yellow-900/30 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-300 mb-2">Deployment Recommendation</h4>
                    <p className="text-sm text-gray-300">
                      For most users, we recommend starting with a Serverless deployment on CPU or T4 GPU,
                      then scaling up or switching to Dedicated Instances as your needs grow. Contact our
                      solution architects for personalized guidance on the optimal setup for your specific use case.
                    </p>
                  </div>
                </DocSection>
                
                <DocSection
                  id="scaling"
                  title="Scaling & Performance"
                  icon={<Cpu className="h-6 w-6 text-yellow-400" />}
                  isActive={activeSection === 'scaling'}
                >
                  <h3 className="text-xl font-medium mb-3 text-yellow-300">Optimizing Model Performance</h3>
                  <p className="mb-4">
                    Neural Nexus provides multiple tools and techniques to optimize your model's performance and scale efficiently as your traffic grows.
                  </p>
                  
                  <div className="space-y-6 mb-6">
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                      <h4 className="font-medium text-blue-400 mb-2">Automatic Scaling</h4>
                      <p className="text-sm mb-3">
                        Our platform automatically scales your model based on incoming traffic, ensuring optimal performance while minimizing costs.
                      </p>
                      <div className="bg-gray-900 p-3 rounded-md">
                        <h5 className="text-sm font-medium text-purple-300 mb-2">Scaling Parameters</h5>
                        <ul className="text-xs space-y-2">
                          <li><span className="text-pink-400 font-mono">min_replicas</span>: Minimum number of instances (default: 1)</li>
                          <li><span className="text-pink-400 font-mono">max_replicas</span>: Maximum number of instances (default: 10)</li>
                          <li><span className="text-pink-400 font-mono">target_concurrency</span>: Target requests per replica (default: 30)</li>
                          <li><span className="text-pink-400 font-mono">scale_down_delay</span>: Time to wait before scaling down (default: 300s)</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                      <h4 className="font-medium text-blue-400 mb-2">Model Optimization Techniques</h4>
                      <p className="text-sm mb-3">
                        Improve your model's performance with these optimization techniques:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-900 p-3 rounded-md">
                          <h5 className="text-sm font-medium text-green-300 mb-2">Quantization</h5>
                          <p className="text-xs">
                            Reduce model size and improve inference speed by converting weights from float32 to int8 or other precision formats.
                            Our platform supports post-training quantization and quantization-aware training.
                          </p>
                        </div>
                        <div className="bg-gray-900 p-3 rounded-md">
                          <h5 className="text-sm font-medium text-green-300 mb-2">Pruning</h5>
                          <p className="text-xs">
                            Remove unnecessary weights from your model to reduce size and computational requirements
                            while maintaining accuracy.
                          </p>
                        </div>
                        <div className="bg-gray-900 p-3 rounded-md">
                          <h5 className="text-sm font-medium text-green-300 mb-2">KV Caching</h5>
                          <p className="text-xs">
                            For transformer models, our platform automatically implements key-value caching to
                            significantly speed up sequential inference operations.
                          </p>
                        </div>
                        <div className="bg-gray-900 p-3 rounded-md">
                          <h5 className="text-sm font-medium text-green-300 mb-2">Batching</h5>
                          <p className="text-xs">
                            Our platform implements dynamic batching to process multiple requests together,
                            significantly improving throughput for high-traffic models.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                      <h4 className="font-medium text-blue-400 mb-2">Load Balancing & High Availability</h4>
                      <p className="text-sm mb-3">
                        Neural Nexus automatically distributes traffic across multiple replicas and regions to ensure high availability and performance.
                      </p>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-start">
                          <span className="text-green-400 mr-2">✓</span>
                          <span>Global load balancing with automatic failover</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-400 mr-2">✓</span>
                          <span>Multi-region deployment options for disaster recovery</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-400 mr-2">✓</span>
                          <span>Health checks and automatic instance replacement</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-400 mr-2">✓</span>
                          <span>99.9% uptime SLA for enterprise customers</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-blue-900/20 border border-blue-900/30 rounded-lg p-4">
                    <h4 className="font-medium text-blue-300 mb-2">Performance Benchmarking</h4>
                    <p className="text-sm text-gray-300">
                      Use our benchmarking tools to test your model's performance across different hardware configurations
                      and optimization settings. This can help you identify the optimal setup for your specific use case.
                      Access the benchmarking tools through the dashboard or via our API.
                    </p>
                  </div>
                </DocSection>
                
                <DocSection
                  id="security"
                  title="Security & Compliance"
                  icon={<Shield className="h-6 w-6 text-red-400" />}
                  isActive={activeSection === 'security'}
                >
                  <h3 className="text-xl font-medium mb-3 text-red-300">Enterprise-Grade Security</h3>
                  <p className="mb-4">
                    Neural Nexus implements comprehensive security measures to protect your models and data
                    throughout the deployment lifecycle.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                      <h4 className="font-medium text-purple-300 mb-2">Data Protection</h4>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-start">
                          <span className="text-green-400 mr-2">✓</span>
                          <span>Encryption at rest and in transit (TLS 1.3, AES-256)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-400 mr-2">✓</span>
                          <span>Private VPC deployments for network isolation</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-400 mr-2">✓</span>
                          <span>Customer-managed encryption keys (CMEK)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-400 mr-2">✓</span>
                          <span>Secure model artifact storage</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                      <h4 className="font-medium text-purple-300 mb-2">Access Control</h4>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-start">
                          <span className="text-green-400 mr-2">✓</span>
                          <span>Role-based access control (RBAC)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-400 mr-2">✓</span>
                          <span>Multi-factor authentication (MFA)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-400 mr-2">✓</span>
                          <span>API key rotation and management</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-400 mr-2">✓</span>
                          <span>Single Sign-On (SSO) integration</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-medium mb-3 text-orange-300">Compliance Certifications</h4>
                  <p className="mb-4">
                    Neural Nexus maintains compliance with industry standards and regulations to support your
                    security and compliance requirements.
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 text-center">
                      <h5 className="font-medium text-white">SOC 2 Type II</h5>
                      <p className="text-xs text-gray-400 mt-1">Security & Availability</p>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 text-center">
                      <h5 className="font-medium text-white">HIPAA</h5>
                      <p className="text-xs text-gray-400 mt-1">Healthcare Data</p>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 text-center">
                      <h5 className="font-medium text-white">GDPR</h5>
                      <p className="text-xs text-gray-400 mt-1">Data Privacy</p>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 text-center">
                      <h5 className="font-medium text-white">ISO 27001</h5>
                      <p className="text-xs text-gray-400 mt-1">Information Security</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 mb-6">
                    <h4 className="font-medium text-blue-300 mb-2">Security Best Practices</h4>
                    <p className="text-sm mb-3">
                      Follow these best practices to enhance the security of your deployed models:
                    </p>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start">
                        <span className="text-yellow-400 mr-2">1.</span>
                        <span>Implement API key rotation on a regular schedule</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-400 mr-2">2.</span>
                        <span>Use the principle of least privilege when assigning permissions</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-400 mr-2">3.</span>
                        <span>Enable audit logging for all API operations</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-400 mr-2">4.</span>
                        <span>Set up alerting for suspicious activities or unusual traffic patterns</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-400 mr-2">5.</span>
                        <span>Implement input validation to prevent prompt injection attacks</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-red-900/20 border border-red-900/30 rounded-lg p-4">
                    <h4 className="font-medium text-red-300 mb-2">Data Residency & Sovereignty</h4>
                    <p className="text-sm text-gray-300">
                      For customers with specific data residency requirements, we offer region-specific deployments
                      in North America, Europe, and Asia Pacific. Enterprise customers can also implement custom
                      data handling policies to comply with specific regulatory frameworks.
                    </p>
                  </div>
                </DocSection>
                
                <DocSection
                  id="monitoring"
                  title="Monitoring & Analytics"
                  icon={<Database className="h-6 w-6 text-blue-400" />}
                  isActive={activeSection === 'monitoring'}
                >
                  <h3 className="text-xl font-medium mb-3 text-blue-300">Comprehensive Monitoring</h3>
                  <p className="mb-4">
                    Neural Nexus provides powerful monitoring and analytics tools to help you understand your model's
                    performance, usage patterns, and potential issues.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                      <h4 className="font-medium text-green-300 mb-2">Performance Metrics</h4>
                      <p className="text-sm mb-3">
                        Track key performance indicators for your deployed models:
                      </p>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-start">
                          <span className="text-pink-400 mr-2">•</span>
                          <span>Average response time and p95/p99 latency</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-pink-400 mr-2">•</span>
                          <span>Requests per second and throughput</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-pink-400 mr-2">•</span>
                          <span>Memory and GPU utilization</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-pink-400 mr-2">•</span>
                          <span>Error rates and types</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                      <h4 className="font-medium text-green-300 mb-2">Usage Analytics</h4>
                      <p className="text-sm mb-3">
                        Understand how your models are being used:
                      </p>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-start">
                          <span className="text-pink-400 mr-2">•</span>
                          <span>Total requests and tokens processed</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-pink-400 mr-2">•</span>
                          <span>Usage patterns by time and region</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-pink-400 mr-2">•</span>
                          <span>API key and endpoint usage breakdown</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-pink-400 mr-2">•</span>
                          <span>Cost analysis and optimization recommendations</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 mb-6">
                    <h4 className="font-medium text-purple-300 mb-2">Alerting & Notifications</h4>
                    <p className="text-sm mb-3">
                      Set up custom alerts to be notified about important events or issues:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-900 p-3 rounded-md">
                        <h5 className="text-sm font-medium text-blue-300 mb-2">Performance Alerts</h5>
                        <ul className="text-xs space-y-1">
                          <li>High latency thresholds exceeded</li>
                          <li>Error rate spikes</li>
                          <li>Resource utilization warnings</li>
                        </ul>
                      </div>
                      <div className="bg-gray-900 p-3 rounded-md">
                        <h5 className="text-sm font-medium text-blue-300 mb-2">Usage Alerts</h5>
                        <ul className="text-xs space-y-1">
                          <li>Budget thresholds reached</li>
                          <li>Unusual traffic patterns</li>
                          <li>API key usage anomalies</li>
                        </ul>
                      </div>
                    </div>
                    <p className="text-sm mt-3">
                      Alerts can be delivered via email, Slack, webhook, or integrated with your existing monitoring systems.
                    </p>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 mb-6">
                    <h4 className="font-medium text-purple-300 mb-2">Logging & Debugging</h4>
                    <p className="text-sm mb-3">
                      Comprehensive logging to help you troubleshoot issues:
                    </p>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2">✓</span>
                        <span>Request and response logs with configurable verbosity</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2">✓</span>
                        <span>Model execution logs with timing breakdowns</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2">✓</span>
                        <span>System logs for infrastructure events</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2">✓</span>
                        <span>Log retention and export options</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-indigo-900/20 border border-indigo-900/30 rounded-lg p-4">
                    <h4 className="font-medium text-indigo-300 mb-2">Integration with External Monitoring Tools</h4>
                    <p className="text-sm text-gray-300">
                      Neural Nexus monitoring can be integrated with popular monitoring and observability platforms:
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="bg-indigo-900/30 text-indigo-300 px-2 py-1 rounded text-xs">Datadog</span>
                      <span className="bg-indigo-900/30 text-indigo-300 px-2 py-1 rounded text-xs">Grafana</span>
                      <span className="bg-indigo-900/30 text-indigo-300 px-2 py-1 rounded text-xs">New Relic</span>
                      <span className="bg-indigo-900/30 text-indigo-300 px-2 py-1 rounded text-xs">Prometheus</span>
                      <span className="bg-indigo-900/30 text-indigo-300 px-2 py-1 rounded text-xs">CloudWatch</span>
                      <span className="bg-indigo-900/30 text-indigo-300 px-2 py-1 rounded text-xs">Splunk</span>
                    </div>
                  </div>
                </DocSection>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function DocNavItem({ id, active, onClick, icon, title }: any) {
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

function DocSection({ id, title, children, icon, isActive }: any) {
  return (
    <div className={`border-b border-gray-800 last:border-none ${isActive ? 'block' : 'hidden'}`}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          {icon}
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
} 