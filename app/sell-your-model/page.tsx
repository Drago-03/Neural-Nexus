"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AnimatedButton } from '@/components/ui/animated-button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { 
  Upload, FileUp, Sparkles, DollarSign, Shield, Clock, 
  Share, CheckCircle, ArrowRight, Globe, Lock
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SellYourModelPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const router = useRouter();
  
  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan);
  };
  
  const pricingPlans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      features: [
        'Basic model hosting',
        'Community support',
        'Basic analytics',
        'Manual approvals',
        'Standard commission rate (30%)'
      ],
      recommended: false
    },
    {
      id: 'pro',
      name: 'Pro Creator',
      price: 9.99,
      features: [
        'Premium model hosting',
        'Priority support',
        'Advanced analytics',
        'Fast-track approvals',
        'Reduced commission rate (15%)',
        'Custom branding'
      ],
      recommended: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 49.99,
      features: [
        'Unlimited model hosting',
        'Dedicated support',
        'Full analytics suite',
        'Instant approvals',
        'Lowest commission rate (5%)',
        'Custom contracts',
        'API access'
      ],
      recommended: false
    }
  ];
  
  const steps = [
    {
      icon: <FileUp className="h-8 w-8 text-purple-400" />,
      title: "Prepare Your Model",
      description: "Package your AI model with all necessary files and documentation."
    },
    {
      icon: <Upload className="h-8 w-8 text-blue-400" />,
      title: "Upload",
      description: "Upload your model and fill in all required metadata."
    },
    {
      icon: <Shield className="h-8 w-8 text-green-400" />,
      title: "Verification",
      description: "Our team verifies your model meets our standards and policies."
    },
    {
      icon: <DollarSign className="h-8 w-8 text-amber-400" />,
      title: "Set Pricing",
      description: "Define your pricing strategy - one-time, subscription, or usage-based."
    },
    {
      icon: <Globe className="h-8 w-8 text-pink-400" />,
      title: "Publish",
      description: "Once approved, your model goes live on our marketplace."
    },
    {
      icon: <Sparkles className="h-8 w-8 text-cyan-400" />,
      title: "Earn",
      description: "Start earning money whenever someone uses or purchases your model."
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-28 pb-16 px-4">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-pink-500">
                Monetize Your AI Models
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Share your AI innovations with the world and get paid for your expertise.
              Our marketplace connects your models with users who need them.
            </motion.p>
            
            <motion.div
              className="flex flex-wrap justify-center gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="mt-10 flex flex-col sm:flex-row gap-5 justify-center">
                <AnimatedButton
                  variant="primary"
                  onClick={() => router.push('/dashboard/models/create')}
                  className="text-lg px-8 py-3"
                >
                  <span className="flex items-center">
                    <Upload className="mr-2 h-5 w-5" />
                    Create Your Model Now
                  </span>
                </AnimatedButton>
                <AnimatedButton
                  variant="outline"
                  onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-lg px-8 py-3"
                >
                  View Pricing Plans
                </AnimatedButton>
              </div>
            </motion.div>
            
            <motion.div
              className="flex items-center justify-center text-sm text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Over 1,000+ creators already earning on our platform
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 bg-gray-900/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              From upload to earnings, our streamlined process makes selling your AI models simple and profitable.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
              >
                <div className="bg-gray-700/30 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Pricing Plans */}
      <section id="pricing" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Choose Your Seller Plan</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Select the plan that fits your needs and start selling your AI models today.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`relative ${
                  plan.recommended ? 'transform scale-105 z-10' : ''
                }`}
              >
                <div 
                  className={`h-full bg-gray-800/30 backdrop-blur-sm border rounded-xl p-6 flex flex-col ${
                    plan.recommended 
                      ? 'border-purple-500/50 shadow-lg shadow-purple-500/20' 
                      : 'border-gray-700/50'
                  }`}
                >
                  {plan.recommended && (
                    <div className="absolute -top-4 left-0 right-0 mx-auto w-max px-4 py-1 bg-purple-600 rounded-full text-sm font-medium">
                      Recommended
                    </div>
                  )}
                  
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-3xl font-bold">
                      ${plan.price}
                    </span>
                    {plan.price > 0 && <span className="text-gray-400 ml-1">/month</span>}
                  </div>
                  
                  <ul className="space-y-3 mb-8 flex-grow">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <AnimatedButton 
                    variant={plan.recommended ? "primary" : "outline"}
                    className="w-full"
                    onClick={() => handlePlanSelect(plan.id)}
                  >
                    Select Plan
                  </AnimatedButton>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Selling?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of AI creators who are already earning from their models on Neural Nexus.
          </p>
          <div className="mt-8 flex justify-center">
            <AnimatedButton
              variant="primary"
              onClick={() => router.push('/dashboard/models/create')}
              className="text-lg px-8 py-3"
            >
              <span className="flex items-center">
                <Upload className="mr-2 h-5 w-5" />
                Start Selling Now
              </span>
            </AnimatedButton>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
} 