"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Check, 
  X, 
  Zap, 
  CreditCard, 
  Building, 
  ChevronDown,
  ChevronUp,
  Sparkles,
  Trophy,
  Rocket,
  Star
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  const toggleFaq = (index: number) => {
    if (activeFaq === index) {
      setActiveFaq(null);
    } else {
      setActiveFaq(index);
    }
  };

  const pricingTiers = [
    {
      name: "Free",
      icon: <Star className="w-10 h-10 text-blue-400" />,
      description: "Perfect for getting started",
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        "Host unlimited public models, datasets",
        "Create unlimited orgs with no member limits",
        "Access the latest ML tools and open source",
        "Community support",
        "5,000 API calls per month",
        "Basic compute with free CPUs"
      ],
      limitedFeatures: [
        "No private models",
        "Limited compute resources",
        "Standard response times"
      ],
      ctaText: "Get Started",
      popular: false
    },
    {
      name: "Pro",
      icon: <Trophy className="w-10 h-10 text-amber-400" />,
      description: "Unlock advanced features",
      monthlyPrice: 9,
      yearlyPrice: 99,
      features: [
        "Everything in Free tier",
        "ZeroGPU and Dev Mode for Spaces",
        "Free credits across all Inference Providers",
        "Early access to upcoming features",
        "Pro badge on your profile",
        "100,000 API calls per month",
        "Pay-as-you-go option for additional usage"
      ],
      limitedFeatures: [
        "No enterprise features",
        "Standard SLA"
      ],
      ctaText: "Subscribe Now",
      popular: true
    },
    {
      name: "Enterprise Hub",
      icon: <Building className="w-10 h-10 text-purple-400" />,
      description: "Accelerate your AI roadmap",
      monthlyPrice: 20,
      yearlyPrice: 200,
      features: [
        "Everything in Pro tier",
        "SSO and SAML support",
        "Select data location with Storage Regions",
        "Precise actions reviews with Audit logs",
        "Granular access control with Resource groups",
        "Centralized token control and approval",
        "Dataset Viewer for private datasets",
        "Advanced compute options for Spaces",
        "5x more ZeroGPU quota for members",
        "Deploy Inference on your own Infra",
        "Managed billing with yearly commits",
        "Priority support",
        "Unlimited API calls"
      ],
      limitedFeatures: [],
      ctaText: "Contact Sales",
      popular: false
    }
  ];

  const comparisonFeatures = [
    {
      category: "Core Features",
      items: [
        {
          name: "Public Models Access",
          free: true,
          pro: true,
          enterprise: true
        },
        {
          name: "API Access",
          free: true,
          pro: true,
          enterprise: true
        },
        {
          name: "Storage",
          free: "1GB",
          pro: "15GB",
          enterprise: "Unlimited"
        }
      ]
    },
    {
      category: "Advanced Features",
      items: [
        {
          name: "Custom Model Hosting",
          free: false,
          pro: "Up to 5",
          enterprise: "Unlimited"
        },
        {
          name: "Private Models",
          free: false,
          pro: true,
          enterprise: true
        },
        {
          name: "Custom Training",
          free: false,
          pro: true,
          enterprise: true
        },
        {
          name: "Model Versioning",
          free: false,
          pro: true,
          enterprise: true
        }
      ]
    },
    {
      category: "Support",
      items: [
        {
          name: "Support Level",
          free: "Community",
          pro: "Email",
          enterprise: "24/7 Priority"
        },
        {
          name: "SLA Guarantee",
          free: false,
          pro: false,
          enterprise: true
        },
        {
          name: "Dedicated Account Manager",
          free: false,
          pro: false,
          enterprise: true
        }
      ]
    }
  ];

  const faqs = [
    {
      question: "Can I switch between plans?",
      answer: "Absolutely! You can upgrade, downgrade or cancel your subscription at any time. When upgrading, you'll get immediate access to your new plan's features. When downgrading, the change will take effect at the end of your current billing cycle."
    },
    {
      question: "What happens when I reach my API limit?",
      answer: "When you reach your API limit, requests will be rate-limited and return a 429 status code. You can monitor your usage in the dashboard and upgrade if you need higher limits. Pro users have much higher limits, and Enterprise users get custom limits based on their needs."
    },
    {
      question: "How do I get started with the Free tier?",
      answer: "Just sign up with your email and you'll instantly get access to the Free tier features. No credit card required. You can explore public models, run inferences with the API (with rate limits), and check out what the platform has to offer."
    },
    {
      question: "Is there a trial period for paid plans?",
      answer: "Yes! We offer a 14-day free trial of the Pro plan. You can cancel anytime during the trial period and won't be charged. This gives you a chance to test out all the Pro features and see if they're a good fit for your needs."
    },
    {
      question: "Can I host my own models on the Free tier?",
      answer: "The Free tier doesn't include custom model hosting. You'll need to upgrade to our Pro plan to host your own models. On the Pro plan, you can host up to 5 custom models, and on Enterprise, you get unlimited model hosting."
    },
    {
      question: "Do you offer academic or non-profit discounts?",
      answer: "Yes! We offer special pricing for academic institutions, researchers, and non-profit organizations. Contact our sales team for more information on these discounts and to see if you qualify."
    }
  ];

  const getPrice = (tier: typeof pricingTiers[0]) => {
    if (tier.monthlyPrice === null) return "Custom";
    
    if (tier.monthlyPrice === 0) return "Free";
    
    if (billingCycle === "yearly") {
      return `$${tier.yearlyPrice}/year`;
    } else {
      return `$${tier.monthlyPrice}/month`;
    }
  };

  const getSavingsText = (tier: typeof pricingTiers[0]) => {
    if (billingCycle === "yearly" && tier.monthlyPrice && tier.monthlyPrice > 0) {
      const monthlyCost = tier.monthlyPrice * 12;
      const savings = monthlyCost - tier.yearlyPrice!;
      const percentage = Math.round((savings / monthlyCost) * 100);
      return `Save $${savings} (${percentage}%)`;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            No hidden fees, no cap. Choose the plan that's right for your vibe and scale as you grow.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-12">
            <span className={`mr-3 ${billingCycle === "monthly" ? "text-white" : "text-gray-400"}`}>Monthly</span>
            <div 
              className="relative w-14 h-7 bg-gray-700 rounded-full cursor-pointer"
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
            >
              <div 
                className={`absolute top-1 w-5 h-5 rounded-full transition-all ${
                  billingCycle === "yearly" ? "bg-purple-500 right-1" : "bg-gray-300 left-1"
                }`} 
              />
            </div>
            <span className={`ml-3 flex items-center gap-2 ${billingCycle === "yearly" ? "text-white" : "text-gray-400"}`}>
              Yearly
              {billingCycle === "yearly" && (
                <span className="inline-block bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                  2 months free
                </span>
              )}
            </span>
          </div>
        </motion.div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className={`relative rounded-2xl overflow-hidden ${
                tier.popular 
                  ? "border-2 border-purple-500 bg-gradient-to-b from-gray-800/80 to-gray-900/80" 
                  : "border border-gray-700 bg-gray-800/50"
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-purple-500 text-white text-xs font-bold px-3 py-1 transform rotate-0 origin-top-right">
                    MOST POPULAR
                  </div>
                </div>
              )}
              
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="mb-2">{tier.icon}</div>
                    <h3 className="text-2xl font-bold">{tier.name}</h3>
                    <p className="text-gray-400 mt-1">{tier.description}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">{getPrice(tier)}</span>
                    {tier.monthlyPrice !== null && tier.monthlyPrice > 0 && (
                      <span className="ml-2 text-gray-400">/{billingCycle === "monthly" ? "month" : "year"}</span>
                    )}
                  </div>
                  {getSavingsText(tier) && (
                    <div className="mt-1 text-green-400 text-sm font-medium">
                      {getSavingsText(tier)}
                    </div>
                  )}
                </div>
                
                <Link 
                  href={tier.name === "Enterprise Hub" ? "/contact" : "/signup"}
                  className={`block w-full py-3 px-4 rounded-lg text-center font-medium transition-all ${
                    tier.popular
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : "bg-gray-700 hover:bg-gray-600 text-white"
                  }`}
                >
                  {tier.ctaText}
                </Link>
                
                <div className="mt-8">
                  <p className="font-medium mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    What's included:
                  </p>
                  <ul className="space-y-3">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                    
                    {tier.limitedFeatures.length > 0 && (
                      <>
                        <li className="pt-2">
                          <p className="font-medium mb-3 text-gray-400 flex items-center gap-2">
                            Limitations:
                          </p>
                        </li>
                        {tier.limitedFeatures.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <X className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                            <span className="text-gray-400">{feature}</span>
                          </li>
                        ))}
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Plan Comparison</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-4 px-6 text-left">Features</th>
                  <th className="py-4 px-6 text-center">Free Tier</th>
                  <th className="py-4 px-6 text-center bg-purple-900/30">Pro</th>
                  <th className="py-4 px-6 text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((category, catIndex) => (
                  <React.Fragment key={catIndex}>
                    <tr className="bg-gray-800/30">
                      <td colSpan={4} className="py-3 px-6 font-medium">{category.category}</td>
                    </tr>
                    {category.items.map((item, itemIndex) => (
                      <tr key={itemIndex} className="border-b border-gray-700/50">
                        <td className="py-4 px-6">{item.name}</td>
                        <td className="py-4 px-6 text-center">
                          {typeof item.free === "boolean" ? (
                            item.free ? (
                              <Check className="w-5 h-5 text-green-400 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-gray-500 mx-auto" />
                            )
                          ) : (
                            <span>{item.free}</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-center bg-purple-900/10">
                          {typeof item.pro === "boolean" ? (
                            item.pro ? (
                              <Check className="w-5 h-5 text-green-400 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-gray-500 mx-auto" />
                            )
                          ) : (
                            <span>{item.pro}</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-center">
                          {typeof item.enterprise === "boolean" ? (
                            item.enterprise ? (
                              <Check className="w-5 h-5 text-green-400 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-gray-500 mx-auto" />
                            )
                          ) : (
                            <span>{item.enterprise}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Compute Pricing Options */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-10 text-center">Additional Computing Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Spaces Hardware */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm"
            >
              <h3 className="text-xl font-bold mb-2">Spaces Hardware</h3>
              <p className="text-gray-400 mb-4">Upgrade your Space compute</p>
              <div className="mb-4">
                <span className="text-2xl font-bold">$0</span>
                <span className="text-gray-400">/hour</span>
              </div>
              <p className="text-sm text-purple-400 mb-4">Starting at</p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Free CPUs</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Build more advanced Spaces</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>7 optimized hardware options</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>From CPU to GPU to Accelerators</span>
                </li>
              </ul>
            </motion.div>

            {/* Inference Endpoints */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm"
            >
              <h3 className="text-xl font-bold mb-2">Inference Endpoints</h3>
              <p className="text-gray-400 mb-4">Deploy models on fully managed infrastructure</p>
              <div className="mb-4">
                <span className="text-2xl font-bold">$0.032</span>
                <span className="text-gray-400">/hour</span>
              </div>
              <p className="text-sm text-purple-400 mb-4">Starting at</p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Deploy dedicated Endpoints in seconds</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Keep your costs low</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Fully-managed autoscaling</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Enterprise security</span>
                </li>
              </ul>
            </motion.div>

            {/* API Usage */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm"
            >
              <h3 className="text-xl font-bold mb-2">API Usage</h3>
              <p className="text-gray-400 mb-4">Pay only for what you use</p>
              <div className="mb-4">
                <span className="text-2xl font-bold">$0.001</span>
                <span className="text-gray-400">/1000 tokens</span>
              </div>
              <p className="text-sm text-purple-400 mb-4">Starting at</p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Ultra low per-token pricing</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Volume discounts available</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>No minimum commitments</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Transparent usage dashboard</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="max-w-4xl mx-auto mb-20"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`border border-gray-700 rounded-xl overflow-hidden ${
                  activeFaq === index ? "bg-gray-800/50" : "bg-gray-800/20"
                }`}
              >
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-medium">{faq.question}</span>
                  {activeFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                
                {activeFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-300">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center"
        >
          <div className="max-w-3xl mx-auto p-8 rounded-xl bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-sm border border-blue-500/20">
            <h2 className="text-3xl font-bold mb-4">Ready to level up your AI game?</h2>
            <p className="text-gray-300 mb-6">
              Start building with our platform today. No credit card required for the free tier.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/signup" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full font-medium transition-all transform hover:scale-105">
                Get Started Free
              </Link>
              <Link href="/contact" className="px-8 py-3 bg-transparent hover:bg-gray-800 border border-blue-500 rounded-full font-medium transition-all">
                Talk to Sales
              </Link>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage; 