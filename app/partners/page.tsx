"use client"; // Keep this at the very top for Client Components

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Navbar from "@/components/Navbar"; // Assuming this path is correct
import Footer from "@/components/Footer"; // Assuming this path is correct
import PartnerCard from '../../src/components/ui/PartnerCard'; // Adjust this path if PartnerCard is elsewhere, e.g., '@/components/ui/PartnerCard' or '../components/ui/PartnerCard'

import {
  ArrowRight,
  X,
  CheckCircle,
  ChevronLeft,
  Send,
  Sparkles,
  Zap,
  Globe,
  Code,
  Server,
  ClipboardCheck,
  FileSignature,
  Rocket,
  Search,
  ExternalLink,
  Clock,
  Shield,
  Users,
  AlertCircle
} from 'lucide-react';
import Image from 'next/image';

export default function PartnersPage() {
  console.log("--- Navigated to PartnersPage ---");

  // Define partnerCategories directly within the component
  const partnerCategories = [
    {
      name: "Technology Leaders",
      id: "tech-leaders",
      partners: [
        { name: "Google", logo: "/partners/7123025_logo_google_g_icon.svg", description: "Strategic AI research partner..." },
        { name: "Microsoft", logo: "/partners/microsoft.svg", description: "Infrastructure partner..." },
        { name: "Meta", logo: "/partners/icons8-meta.svg", description: "Research partner specializing in multimodal AI models..." },
        { name: "Intel", logo: "/partners/intel.svg", description: "Semiconductor and AI hardware innovation." },
        { name: "AMD", logo: "/partners/amd.svg", description: "High-performance computing and graphics solutions." },
        { name: "NVIDIA", logo: "partners/icons8-nvidia.svg", description: "Hardware acceleration partner..." },
        { name: "IBM", logo: "/partners/icons8-ibm.svg", description: "Enterprise integration partner..." },
        { name: "Qualcomm", logo: "/partners/qualcomm.svg", description: "Mobile and edge AI processing." },
        { name: "Samsung", logo: "/partners/samsung.svg", description: "Global technology and electronics leader." },
      ],
    },
    {
      name: "Open Source",
      id: "open-source",
      partners: [
        { name: "Hugging Face", logo: "/partners/huggingface.svg", description: "Open-source AI models and tools." },
        { name: "Kaggle", logo: "/partners/kaggle.svg", description: "Data science and machine learning community." },
        { name: "GitHub", logo: "/partners/github.svg", description: "Code hosting and version control." },
        { name: "PyTorch", logo: "/partners/pytorch.svg", description: "Open-source machine learning framework." },
        { name: "TensorFlow", logo: "/partners/tensorflow.svg", description: "Open-source machine learning library." },
        { name: "Apache Foundation", logo: "/partners/apache.svg", description: "Supports open-source software projects." },
        { name: "NumFOCUS", logo: "/partners/numfocus.svg", description: "Promotes open-source scientific computing." },
        { name: "OpenAI", logo: "/partners/icons8-chatgpt.svg", description: "Research collaboration partner..." },
      ],
    },
    {
      name: "Content Partners",
      id: "content-partners",
      partners: [
        { name: "Coursera", logo: "/partners/coursera.svg", description: "Online learning platform." },
        { name: "Udacity", logo: "/partners/udacity.svg", description: "Online courses and nanodegrees." },
        { name: "edX", logo: "/partners/edx.svg", description: "Online university courses." },
        { name: "DataCamp", logo: "/partners/datacamp.svg", description: "Interactive data science education." },
        { name: "O'Reilly", logo: "/partners/oreilly.svg", description: "Technical books and online training." },
        { name: "IEEE", logo: "/partners/ieee.svg", description: "Professional organization for engineers." },
        { name: "ACM", logo: "/partners/acm.svg", description: "World's largest computing society." },
        { name: "arXiv", logo: "/partners/arxiv.svg", description: "Open-access archive for scientific papers." },
      ],
    },
    {
      name: "Developer Tools",
      id: "developer-tools",
      partners: [
        { name: "Postman", logo: "/partners/postman.svg", description: "API development environment." },
        { name: "MongoDB", logo: "/partners/mongodb.svg", description: "NoSQL database." },
        { name: "Redis", logo: "/partners/redis.svg", description: "In-memory data structure store." },
        { name: "Docker", logo: "/partners/docker.svg", description: "Containerization platform." },
        { name: "Kubernetes", logo: "/partners/kubernetes.svg", description: "Container orchestration system." },
        { name: "GitLab", logo: "/partners/gitlab.svg", description: "DevOps platform." },
        { name: "CircleCI", logo: "/partners/circleci.svg", description: "Continuous integration and delivery." },
        { name: "Atlassian", logo: "/partners/atlassian.svg", description: "Developer tools suite (Jira, Confluence)." },
      ],
    },
    {
      name: "Cloud/Infrastructure",
      id: "cloud-infra",
      partners: [
        { name: "AWS", logo: "/partners/aws.svg", description: "Amazon Web Services." },
        { name: "Azure", logo: "/partners/azure.svg", description: "Microsoft Azure cloud computing." },
        { name: "GCP", logo: "/partners/gcp.svg", description: "Google Cloud Platform." },
        { name: "DigitalOcean", logo: "/partners/digitalocean.svg", description: "Cloud computing for developers." },
        { name: "Oracle Cloud", logo: "/partners/oracle.svg", description: "Oracle's cloud services." },
        { name: "IBM Cloud", logo: "/partners/ibmcloud.svg", description: "IBM's suite of cloud services." },
        { name: "Cloudflare", logo: "/partners/cloudflare.svg", description: "Web performance and security." },
        { name: "Vercel", logo: "/partners/vercel.svg", description: "Platform for frontend developers." },
      ],
    },
    {
      name: "Research Institutions",
      id: "research-institutions",
      partners: [
        { name: "MIT", logo: "/partners/mit.svg", description: "Massachusetts Institute of Technology." },
        { name: "Stanford AI Lab", logo: "/partners/stanford.svg", description: "Stanford University AI research." },
        { name: "Berkeley AI Research", logo: "/partners/berkeley.svg", description: "UC Berkeley AI research." },
        { name: "DeepMind", logo: "/partners/deepmind.svg", description: "Google AI research company." },
        { name: "Allen AI Institute", logo: "/partners/allenai.svg", description: "AI research for the common good." },
        { name: "MILA", logo: "/partners/mila.svg", description: "Quebec AI Institute." },
        { name: "FAIR", logo: "/partners/fair.svg", description: "Meta AI Research." },
      ],
    },
  ];

  // All state declarations should be directly inside PartnersPage
  const [activeTab, setActiveTab] = useState(partnerCategories[0]?.id || ""); // Added optional chaining and fallback
  const selectedCategory = partnerCategories.find(
    (category) => category.id === activeTab
  );

  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    partnershipType: 'technology',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setFormStatus('success');
      setFormData({
        name: '',
        email: '',
        company: '',
        partnershipType: 'technology',
        message: ''
      });
    } catch (error) {
      setFormStatus('error');
    }
  };

  const partnershipTypes = [
    {
      icon: <Globe className="h-6 w-6 text-blue-400" />,
      name: "Technology Partner",
      description: "Ideal for companies offering complementary technology that enhances our platform's capabilities and expands user functionality.",
      benefits: [
        "Priority API access with increased rate limits",
        "Co-marketing campaigns with shared audience targeting",
        "Joint webinars and featured speaking opportunities",
        "Featured listing in our marketplace with premium positioning",
        "Early access to beta features and product roadmap"
      ],
      idealFor: "SaaS platforms, infrastructure providers, and technology vendors with complementary offerings.",
      bgGradient: "from-blue-600/20 to-cyan-600/20"
    },
    {
      icon: <Sparkles className="h-6 w-6 text-purple-400" />,
      name: "Research Partner",
      description: "For academic institutions and research labs working on cutting-edge AI research, with opportunities for collaborative innovation.",
      benefits: [
        "Access to exclusive research datasets and benchmarks",
        "Research collaboration opportunities with our AI team",
        "Joint paper publishing and conference presentations",
        "Academic discounts for platform usage and compute credits",
        "Internship and recruitment pipeline for graduate students"
      ],
      idealFor: "Universities, research institutes, and independent labs focused on AI advancement.",
      bgGradient: "from-purple-600/20 to-pink-600/20"
    },
    {
      icon: <Code className="h-6 w-6 text-green-400" />,
      name: "Solution Partner",
      description: "For consultants and system integrators who implement AI solutions for clients and can extend our platform's reach into new markets.",
      benefits: [
        "Implementation certification program with tiered benefits",
        "Lead sharing and referral commissions",
        "Comprehensive training and enablement resources",
        "Partner portal access with sales and technical materials",
        "Co-selling opportunities with our sales team"
      ],
      idealFor: "Consulting firms, system integrators, and boutique AI implementation specialists.",
      bgGradient: "from-green-600/20 to-emerald-600/20"
    },
    {
      icon: <Server className="h-6 w-6 text-amber-400" />,
      name: "Strategic Alliance",
      description: "Deep, multi-faceted partnerships aligned on long-term industry transformation and market leadership in AI deployment.",
      benefits: [
        "Executive sponsorship and quarterly business reviews",
        "Joint product roadmap planning and influence",
        "Co-innovation lab access and shared R&D initiatives",
        "Exclusive event participation and thought leadership",
        "Custom commercial terms and enterprise support"
      ],
      idealFor: "Enterprise organizations, cloud providers, and industry leaders seeking transformative partnerships.",
      bgGradient: "from-amber-600/20 to-orange-600/20"
    }
  ];

  const partnershipProcess = [
    {
      title: "Initial Contact",
      description: "Fill out our partnership inquiry form with details about your organization and partnership goals. Our team will reach out within 48 hours to schedule an introductory call.",
      icon: <Send className="h-5 w-5 text-white" />
    },
    {
      title: "Discovery Session",
      description: "In a detailed 60-minute session, we'll explore your technology, business model, and how our platforms can integrate to create mutual value for our users.",
      icon: <Search className="h-5 w-5 text-white" />
    },
    {
      title: "Partnership Proposal",
      description: "Our team will craft a customized partnership plan including integration points, co-marketing opportunities, and revenue sharing models based on our discussion.",
      icon: <ClipboardCheck className="h-5 w-5 text-white" />
    },
    {
      title: "Technical Integration",
      description: "Our engineering teams will collaborate to establish the technical foundation for the partnership, with dedicated support throughout the integration process.",
      icon: <Code className="h-5 w-5 text-white" />
    },
    {
      title: "Agreement & Onboarding",
      description: "We'll finalize terms, execute agreements, and create a comprehensive onboarding plan including technical documentation and training resources.",
      icon: <FileSignature className="h-5 w-5 text-white" />
    },
    {
      title: "Launch & Growth",
      description: "We'll coordinate a joint market launch with PR, social media announcements, and ongoing quarterly business reviews to scale our partnership.",
      icon: <Rocket className="h-5 w-5 text-white" />
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />

    <section className="py-24 px-4 relative bg-gray-950 text-white overflow-hidden">
        
        <div className="absolute inset-0 z-[-1] radial-gradient-partners"></div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="text-9xl font-extrabold text-center mt-10 mb-20
                       bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500
                       drop-shadow-lg leading-tight"
          >
            Our Partners
            <span className="block text-3xl font-medium text-gray-400 mt-2 mb-50">
              Forging strong connections to drive innovation.
            </span>
          </motion.h2>

          <div className="partner-tabs-container">
          
            <div className="flex flex-wrap gap-3 mb-12 w-full justify-center">
              {partnerCategories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(0,0,0,0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    relative px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 ease-in-out
                    focus:outline-none focus:ring-4 focus:ring-blue-500/50 w-30
                    ${activeTab === category.id
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/40'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700/70 hover:text-white border border-gray-700'
                    }
                  `}
                >
                  {category.name}
                  {activeTab === category.id && (
                    <motion.span
                      layoutId="activeTabIndicator"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

          
            <AnimatePresence mode="wait"> 
              {selectedCategory && selectedCategory.partners.length > 0 ? (
                <motion.div
                  key={activeTab} 
                  initial={{ opacity: 0, y: 40, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -40, scale: 0.98 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 25,
                    duration: 0.7,
                    ease: "easeOut"
                  }}
                  // Adjusted grid columns for wider cards:
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 p-4"
                >
                  {selectedCategory.partners.map((partner, index) => (
                    <PartnerCard key={partner.name} partner={partner} index={index} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="no-partners-message"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6 }}
                  className="
                    bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg
                    rounded-2xl shadow-xl p-16 text-center mx-auto max-w-2xl mt-8 mb-4
                    border border-gray-700 flex flex-col items-center justify-center
                  "
                >
                  <p className="text-gray-300 text-6xl mb-6 animate-bounce-slow">✨</p>
                  <p className="text-white text-3xl font-bold mb-4 leading-relaxed">
                    No partners found for this category yet!
                  </p>
                  <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
                    We're constantly expanding our network. Check back soon for exciting new collaborations and updates!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Partnership Types */}
      <section className="py-20 px-4 bg-black/50">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">Partnership Types</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We offer several types of partnerships to suit different organizations and goals.
              Find the right fit for your business.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {partnershipTypes.map((type, index) => (
              <motion.div
                key={type.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 10px 25px -5px rgba(123, 97, 255, 0.2)"
                }}
                className={`bg-gradient-to-br ${type.bgGradient} backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 overflow-hidden relative`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-transparent z-0"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-lg bg-black/50 backdrop-blur-sm flex items-center justify-center mr-4 border border-white/10">
                      {type.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white">{type.name}</h3>
                  </div>
                  <p className="text-gray-300 mb-4">{type.description}</p>

                  <div className="mb-4 inline-block px-3 py-1 bg-black/30 rounded-full text-xs font-medium backdrop-blur-sm border border-white/10">
                    Ideal for: {type.idealFor}
                  </div>

                  <h4 className="text-sm uppercase text-gray-400 mb-2 mt-6 font-semibold">Key Benefits:</h4>
                  <ul className="space-y-2">
                    {type.benefits.map((benefit, i) => (
                      <motion.li
                        key={i}
                        className="flex items-start"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + (i * 0.1) }}
                      >
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{benefit}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-black/50 hover:bg-black/70 rounded-lg border border-white/10 text-sm font-medium transition-all"
                      aria-label={`Learn more about ${type.name} partnership`}
                    >
                      Learn More
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Journey */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4 text-white">Partnership Journey</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A straightforward process to establish a productive and valuable partnership
            </p>
          </motion.div>

          <div className="relative py-10">
            {/* Timeline Line with Gradient */}
            <motion.div
              className="absolute z-10 left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-violet-500 via-blue-500 to-cyan-500 rounded-full"
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />

            {/* Process Steps Container */}
            <div className="space-y-24 md:space-y-28">
              {partnershipProcess.map((step, index) => (
                <div
                  key={step.title}
                  className="relative flex items-center w-full"
                >
                  {/* Content Block */}
                  <motion.div
                    className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:mr-auto md:text-right md:pr-16' : 'md:ml-auto md:text-left md:pl-16'}`}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.4, delay: index * 0.2 + 0.1, ease: "easeOut" }}
                  >
                    <h3 className="text-xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">
                      {step.title}
                    </h3>
                    <p className="text-gray-400">
                      {step.description}
                    </p>
                  </motion.div>

                  {/* Timeline Circle */}
                  <motion.div
                    className="absolute z-30 right-[638px]  transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br shadow-lg border border-white/10"
                    style={{
                      background: [
                        "linear-gradient(to bottom right, #a78bfa, #8ab4f8)",
                        "linear-gradient(to bottom right, #d8b4fe, #818cf8)",
                        "linear-gradient(to bottom right, #c084fc, #60a5fa)",
                        "linear-gradient(to bottom right, #a855f7, #3b82f6)",
                        "linear-gradient(to bottom right, #9333ea, #22d3ee)",
                        "linear-gradient(to bottom right, #8b5cf6, #14b8a6)",
                      ][index % 6],
                    }}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                      delay: 0.3 + index * 0.2,
                    }}
                  >
                    <div className="text-white text-sm md:text-base">{step.icon}</div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Contact CTA */}
      <section className="py-24 px-4 bg-gradient-to-r from-violet-900/30 via-blue-900/30 to-cyan-900/30 relative overflow-hidden">
        {/* Background animation elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-violet-500/10 to-blue-500/10 blur-3xl"
              style={{
                width: `${Math.random() * 300 + 200}px`,
                height: `${Math.random() * 300 + 200}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 50 - 25],
                y: [0, Math.random() * 50 - 25],
                scale: [1, Math.random() * 0.2 + 0.9],
              }}
              transition={{
                duration: Math.random() * 10 + 20,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>

        <div className="container mx-auto relative z-10">
          <div className="bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 max-w-4xl mx-auto p-8 md:p-12 shadow-xl">
            <motion.div
              className="text-center max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Ready to Transform the Future of AI Together?
              </motion.h2>

              <motion.p
                className="text-xl text-gray-300 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Join our ecosystem of innovation partners who are shaping the next generation of AI technologies and applications.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <motion.button
                  onClick={() => setShowContactForm(true)}
                  className="px-8 py-4 bg-gradient-to-r from-violet-600 to-blue-600 rounded-lg font-medium text-white shadow-lg shadow-blue-500/25 flex items-center justify-center group transition-all hover:from-violet-500 hover:to-blue-500"
                  whileHover={{ scale: 1.05, boxShadow: "0 15px 30px -10px rgba(79, 70, 229, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.span
                    className="flex items-center"
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                  >
                    <Zap className="mr-2 h-5 w-5 text-white group-hover:animate-pulse" />
                    Contact Our Partnership Team
                    <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:opacity-100 transition-all" />
                  </motion.span>
                </motion.button>

                <span className="text-gray-400">or</span>

                <Link href="/partners/success-stories" className="text-white underline-offset-4 decoration-blue-500 underline hover:decoration-2 transition-all flex items-center">
                  View Partner Success Stories <ExternalLink className="ml-1 h-4 w-4" />
                </Link>
              </motion.div>

              <motion.div
                className="mt-10 flex flex-wrap justify-center gap-6 items-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="flex items-center bg-black/40 rounded-full px-4 py-2 backdrop-blur-sm border border-white/10">
                  <Clock className="h-4 w-4 text-blue-400 mr-2" />
                  <span className="text-sm text-gray-300">Response within 48 hours</span>
                </div>
                <div className="flex items-center bg-black/40 rounded-full px-4 py-2 backdrop-blur-sm border border-white/10">
                  <Shield className="h-4 w-4 text-green-400 mr-2" />
                  <span className="text-sm text-gray-300">Confidential discussions</span>
                </div>
                <div className="flex items-center bg-black/40 rounded-full px-4 py-2 backdrop-blur-sm border border-white/10">
                  <Users className="h-4 w-4 text-purple-400 mr-2" />
                  <span className="text-sm text-gray-300">Dedicated partnership manager</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form Modal */}
      <AnimatePresence>
        {showContactForm && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => formStatus !== 'submitting' && setShowContactForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 border border-gray-700/50 rounded-xl p-8 max-w-xl w-full relative shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => formStatus !== 'submitting' && setShowContactForm(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                disabled={formStatus === 'submitting'}
                aria-label="Close partnership inquiry form"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-2xl font-bold mb-4">Partnership Inquiry</h3>

              {formStatus === 'success' ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 15, stiffness: 200 }}
                  >
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </motion.div>
                  <h4 className="text-xl font-semibold mb-2">Thank You!</h4>
                  <p className="text-gray-400 mb-6">
                    Your partnership inquiry has been received. Our team will get back to you within 48 hours.
                  </p>
                  <motion.button
                    onClick={() => {
                      setShowContactForm(false);
                      setFormStatus('idle');
                    }}
                    className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Close
                  </motion.button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={formStatus === 'submitting'}
                        placeholder="Your full name"
                        aria-label="Your name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={formStatus === 'submitting'}
                        placeholder="Your email address"
                        aria-label="Your email"
                      />
                    </div>
                    {/* The rest of your form fields */}
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-400 mb-1">Company (Optional)</label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={formStatus === 'submitting'}
                        placeholder="Your company name"
                        aria-label="Your company"
                      />
                    </div>

                    <div>
                      <label htmlFor="partnershipType" className="block text-sm font-medium text-gray-400 mb-1">Partnership Type</label>
                      <select
                        id="partnershipType"
                        name="partnershipType"
                        value={formData.partnershipType}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={formStatus === 'submitting'}
                        aria-label="Select partnership type"
                      >
                        <option value="technology">Technology Partner</option>
                        <option value="research">Research Partner</option>
                        <option value="solution">Solution Partner</option>
                        <option value="strategic">Strategic Alliance</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        required
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                        disabled={formStatus === 'submitting'}
                        placeholder="Describe your proposed partnership and goals."
                        aria-label="Your message"
                      ></textarea>
                    </div>
                  </div>

                  {formStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center text-red-400 mb-4"
                    >
                      <AlertCircle className="h-5 w-5 mr-2" />
                      Failed to send message. Please try again.
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    className={`w-full py-3 rounded-lg font-semibold text-white flex items-center justify-center transition-all
                      ${formStatus === 'submitting'
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-lg shadow-blue-500/25'
                      }`}
                    disabled={formStatus === 'submitting'}
                    whileHover={formStatus !== 'submitting' ? { scale: 1.02 } : {}}
                    whileTap={formStatus !== 'submitting' ? { scale: 0.98 } : {}}
                  >
                    {formStatus === 'submitting' ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Submit Inquiry
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}