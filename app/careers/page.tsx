"use client";

import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Users, 
  Search,
  ArrowRight,
  Globe,
  Laptop,
  Home,
  Building,
  DollarSign,
  GraduationCap,
  HeartHandshake,
  BarChart,
  PenTool,
  Binary,
  Network,
  Headphones
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ApplicationModal from "@/components/ApplicationModal";
import JobListingsModal from "@/components/JobListingsModal";

export default function CareersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState<string | null>(null);
  const [filterDepartment, setFilterDepartment] = useState<string | null>(null);
  const [jobListingsModalOpen, setJobListingsModalOpen] = useState(false);
  const [applicationModalOpen, setApplicationModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<any>(null);
  
  // List of job openings with location information
  const jobOpenings = [
    {
      id: 1,
      title: "AI Research Engineer",
      department: "Engineering",
      location: "Chandigarh, India",
      type: "Full-time",
      remote: false,
      description: "Join our AI research team to develop cutting-edge models and algorithms for our platform. You'll work on optimizing model performance, implementing new features, and pushing the boundaries of what's possible with AI.",
      requirements: [
        "Masters or PhD in Computer Science, Machine Learning, or related field",
        "3+ years experience with deep learning frameworks (PyTorch, TensorFlow)",
        "Strong publication record or demonstrable research experience",
        "Excellent communication skills"
      ]
    },
    {
      id: 2,
      title: "Frontend Developer",
      department: "Engineering",
      location: "Chandigarh, India",
      type: "Full-time",
      remote: false,
      description: "We're looking for a talented frontend developer to create beautiful, responsive interfaces for our AI model marketplace. You'll work closely with designers and backend engineers to implement new features and improve user experience.",
      requirements: [
        "3+ years experience with React/Next.js",
        "Strong TypeScript skills",
        "Experience with modern CSS frameworks (Tailwind, Styled Components)",
        "Eye for design and attention to detail",
        "Experience with state management libraries"
      ]
    },
    {
      id: 3,
      title: "DevOps Engineer",
      department: "Operations",
      location: "Remote",
      type: "Full-time",
      remote: true,
      description: "Help us build and maintain a robust, scalable infrastructure to support our growing platform. You'll be responsible for CI/CD pipelines, cloud resources, monitoring, and ensuring high availability of our services.",
      requirements: [
        "4+ years experience in DevOps roles",
        "Strong knowledge of AWS, GCP, or Azure",
        "Experience with containerization (Docker, Kubernetes)",
        "Familiar with IaC tools (Terraform, CloudFormation)",
        "Strong scripting skills (Bash, Python)"
      ]
    },
    {
      id: 4,
      title: "Machine Learning Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      remote: true,
      description: "Design and implement machine learning systems to power our platform features. You'll work on model serving infrastructure, optimization, and integration of various AI models into our ecosystem.",
      requirements: [
        "BS/MS in Computer Science or related field",
        "3+ years experience building production ML systems",
        "Expertise in Python and ML frameworks",
        "Experience with ML deployment and serving",
        "Understanding of ML ops best practices"
      ]
    },
    {
      id: 5,
      title: "Product Manager",
      department: "Product",
      location: "Chandigarh, India",
      type: "Full-time",
      remote: false,
      description: "Lead the strategy and execution of new product features. You'll gather requirements, define roadmaps, and work with engineering to bring new capabilities to our AI marketplace.",
      requirements: [
        "3+ years experience in product management",
        "Strong understanding of AI technologies",
        "Excellent communication and stakeholder management",
        "Data-driven approach to decision making",
        "Technical background preferred"
      ]
    },
    {
      id: 6,
      title: "Community Manager",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      remote: true,
      description: "Build and nurture our growing community of AI creators and users. You'll manage our social channels, organize events, create content, and be the voice of our users within the company.",
      requirements: [
        "2+ years experience in community management",
        "Strong communication skills",
        "Experience with social media platforms",
        "Interest in AI and technology",
        "Content creation abilities"
      ]
    },
    {
      id: 7,
      title: "Blockchain Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      remote: true,
      description: "Develop smart contracts and blockchain integrations for our platform's ownership transfer and payment features. You'll work with various blockchain technologies to ensure secure and efficient transactions.",
      requirements: [
        "3+ years experience with blockchain development",
        "Experience with Ethereum, Solidity, Web3.js",
        "Understanding of TON, Coinbase, or other blockchain platforms",
        "Strong security mindset",
        "Background in full-stack development"
      ]
    },
    {
      id: 8,
      title: "UI/UX Designer",
      department: "Design",
      location: "Chandigarh, India",
      type: "Full-time",
      remote: false,
      description: "Create intuitive, engaging experiences for our users. You'll design interfaces, conduct user research, and collaborate with engineering to implement your designs.",
      requirements: [
        "3+ years experience in product design",
        "Strong portfolio showing UX process",
        "Proficiency with design tools (Figma, Sketch)",
        "Understanding of design systems",
        "Experience with web application design"
      ]
    },
    {
      id: 9,
      title: "Technical Writer",
      department: "Documentation",
      location: "Remote",
      type: "Part-time",
      remote: true,
      description: "Create clear, comprehensive documentation for our API, SDK, and platform features. You'll work with engineers to understand complex concepts and explain them in accessible language.",
      requirements: [
        "2+ years experience in technical writing",
        "Strong writing and editing skills",
        "Ability to understand technical concepts",
        "Experience with documentation tools",
        "Background in software development a plus"
      ]
    },
    {
      id: 10,
      title: "Data Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      remote: true,
      description: "Build data pipelines and infrastructure to support our analytics and machine learning needs. You'll work with large datasets and ensure data quality, accessibility, and security.",
      requirements: [
        "3+ years experience in data engineering",
        "Experience with data warehousing and ETL",
        "Proficiency with SQL and Python",
        "Experience with big data technologies",
        "Understanding of data modeling"
      ]
    },
    {
      id: 11,
      title: "Senior Backend Engineer",
      department: "Engineering",
      location: "New York, USA",
      type: "Full-time",
      remote: false,
      description: "Design and build scalable backend services that power our AI platform. You'll work on API design, database architecture, and ensuring performance at scale.",
      requirements: [
        "5+ years experience in backend development",
        "Strong knowledge of Node.js, Python, or Go",
        "Experience with SQL and NoSQL databases",
        "Understanding of API design and microservices",
        "Experience with high-throughput systems"
      ]
    },
    {
      id: 12,
      title: "AI Ethics Researcher",
      department: "Research",
      location: "London, UK",
      type: "Full-time",
      remote: false,
      description: "Help us ensure our AI models and platform are developed and used responsibly. You'll research ethical implications, develop guidelines, and work with teams across the company to implement responsible AI practices.",
      requirements: [
        "Advanced degree in ethics, philosophy, AI, or related field",
        "Understanding of machine learning and AI systems",
        "Research experience in AI ethics or responsible tech",
        "Excellent written and verbal communication",
        "Ability to translate complex ethical concepts into practical guidelines"
      ]
    },
    {
      id: 13,
      title: "Growth Marketing Manager",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      remote: true,
      description: "Drive user acquisition and retention for our platform. You'll develop and execute marketing campaigns, analyze performance, and optimize our growth funnel.",
      requirements: [
        "3+ years experience in growth marketing",
        "Data-driven approach to marketing",
        "Experience with digital marketing channels",
        "Knowledge of marketing analytics tools",
        "Prior experience in tech or AI preferred"
      ]
    },
    {
      id: 14,
      title: "Financial Analyst",
      department: "Finance",
      location: "Singapore",
      type: "Full-time",
      remote: false,
      description: "Support our financial planning and analysis. You'll create financial models, analyze business performance, and help inform strategic decisions.",
      requirements: [
        "Bachelor's degree in Finance, Accounting, or related field",
        "2+ years experience in financial analysis",
        "Strong Excel and financial modeling skills",
        "Experience with financial reporting",
        "Attention to detail and analytical mindset"
      ]
    },
    {
      id: 15,
      title: "HR Specialist",
      department: "Human Resources",
      location: "Chandigarh, India",
      type: "Full-time",
      remote: false,
      description: "Support our growing team across all aspects of HR. You'll manage recruitment, onboarding, employee relations, and help maintain our positive company culture.",
      requirements: [
        "3+ years experience in HR roles",
        "Knowledge of HR best practices and employment law",
        "Experience with HR systems and tools",
        "Strong interpersonal and communication skills",
        "Experience in tech companies preferred"
      ]
    },
    {
      id: 16,
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Berlin, Germany",
      type: "Full-time",
      remote: false,
      description: "Ensure our customers get maximum value from our platform. You'll onboard new customers, provide ongoing support, and work to increase customer satisfaction and retention.",
      requirements: [
        "3+ years experience in customer success or account management",
        "Strong communication and relationship-building skills",
        "Experience with CRM tools",
        "Technical aptitude to understand our platform",
        "Problem-solving mindset"
      ]
    },
    {
      id: 17,
      title: "Legal Counsel",
      department: "Legal",
      location: "New York, USA",
      type: "Full-time",
      remote: false,
      description: "Provide legal guidance on a wide range of issues including contracts, compliance, intellectual property, and privacy. You'll help navigate the complex legal landscape of AI technology.",
      requirements: [
        "JD degree and bar admission",
        "3+ years experience in technology law",
        "Understanding of intellectual property and privacy law",
        "Experience with contract drafting and negotiation",
        "Knowledge of AI and data regulations a plus"
      ]
    },
    {
      id: 18,
      title: "Content Marketing Specialist",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      remote: true,
      description: "Create compelling content that educates our audience and drives engagement. You'll produce blog posts, case studies, whitepapers, and other content that showcases our platform and expertise.",
      requirements: [
        "2+ years experience in content marketing",
        "Excellent writing and editing skills",
        "Ability to explain technical concepts clearly",
        "Experience with SEO and content strategy",
        "Familiarity with AI concepts preferred"
      ]
    },
    {
      id: 19,
      title: "Sales Development Representative",
      department: "Sales",
      location: "San Francisco, USA",
      type: "Full-time",
      remote: false,
      description: "Generate and qualify leads for our sales team. You'll reach out to potential customers, understand their needs, and connect them with our solutions.",
      requirements: [
        "1+ years experience in sales or business development",
        "Strong communication and interpersonal skills",
        "Excellent follow-up and organization abilities",
        "Resilient and goal-oriented mindset",
        "Interest in AI and technology"
      ]
    },
    {
      id: 20,
      title: "Enterprise Account Executive",
      department: "Sales",
      location: "London, UK",
      type: "Full-time",
      remote: false,
      description: "Drive revenue growth by selling our AI platform to enterprise clients. You'll build relationships with key stakeholders, understand client needs, and close complex deals.",
      requirements: [
        "5+ years experience in enterprise software sales",
        "Track record of exceeding sales quotas",
        "Experience with solution selling and complex sales cycles",
        "Strong negotiation and relationship-building skills",
        "Understanding of AI and machine learning technologies"
      ]
    },
    {
      id: 21,
      title: "Mobile App Developer",
      department: "Engineering",
      location: "Tokyo, Japan",
      type: "Full-time",
      remote: false,
      description: "Build and maintain our mobile applications for iOS and Android. You'll work on creating a seamless mobile experience for our users to access and interact with AI models.",
      requirements: [
        "3+ years experience in mobile development",
        "Proficiency with React Native or Flutter",
        "Experience with native iOS or Android development",
        "Understanding of mobile UX best practices",
        "Knowledge of RESTful APIs and state management"
      ]
    },
    {
      id: 22,
      title: "Security Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      remote: true,
      description: "Ensure the security of our platform and protect our users' data. You'll conduct security assessments, implement security controls, and respond to security incidents.",
      requirements: [
        "4+ years experience in information security",
        "Knowledge of security frameworks and best practices",
        "Experience with security tools and technologies",
        "Understanding of web application security",
        "Security certifications (CISSP, CEH, etc.) preferred"
      ]
    },
    {
      id: 23,
      title: "Data Scientist",
      department: "Data Science",
      location: "Chandigarh, India",
      type: "Full-time",
      remote: false,
      description: "Extract insights from our platform data to inform product and business decisions. You'll build models, analyze trends, and communicate findings to stakeholders.",
      requirements: [
        "MS/PhD in Computer Science, Statistics, or related field",
        "Strong statistical analysis and modeling skills",
        "Proficiency with Python and data science libraries",
        "Experience with machine learning and data visualization",
        "Ability to communicate complex findings clearly"
      ]
    },
    {
      id: 24,
      title: "IT Support Specialist",
      department: "IT",
      location: "Dublin, Ireland",
      type: "Full-time",
      remote: false,
      description: "Provide technical support to our internal team. You'll troubleshoot hardware and software issues, manage IT infrastructure, and ensure smooth operations.",
      requirements: [
        "2+ years experience in IT support",
        "Knowledge of Windows and Mac operating systems",
        "Experience with networking and IT security",
        "Strong problem-solving and communication skills",
        "IT certifications preferred"
      ]
    },
    {
      id: 25,
      title: "QA Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      remote: true,
      description: "Ensure the quality of our platform through manual and automated testing. You'll develop test plans, create and execute test cases, and work with developers to resolve issues.",
      requirements: [
        "3+ years experience in software QA",
        "Experience with test automation frameworks",
        "Knowledge of API testing and web testing",
        "Strong attention to detail",
        "Understanding of agile development processes"
      ]
    },
    {
      id: 26,
      title: "Project Manager",
      department: "Product",
      location: "Toronto, Canada",
      type: "Full-time",
      remote: false,
      description: "Coordinate and drive the execution of product initiatives. You'll manage timelines, resources, and communication to ensure successful delivery of projects.",
      requirements: [
        "3+ years experience in project management",
        "PMP certification or equivalent preferred",
        "Experience with project management tools",
        "Strong organizational and communication skills",
        "Ability to manage multiple priorities simultaneously"
      ]
    },
    {
      id: 27,
      title: "Graphic Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      remote: true,
      description: "Create visually compelling materials for our brand across digital and print media. You'll design marketing collateral, website graphics, and other visual assets.",
      requirements: [
        "3+ years experience in graphic design",
        "Strong portfolio demonstrating versatile design skills",
        "Proficiency with Adobe Creative Suite",
        "Experience with digital and print design",
        "Understanding of brand guidelines and visual identity"
      ]
    },
    {
      id: 28,
      title: "3D Artist",
      department: "Design",
      location: "Los Angeles, USA",
      type: "Full-time",
      remote: false,
      description: "Create 3D models and animations for our product visualizations and marketing materials. You'll work on bringing AI concepts to life through engaging visual content.",
      requirements: [
        "3+ years experience in 3D modeling and animation",
        "Proficiency with Blender, Maya, or similar tools",
        "Strong portfolio of 3D work",
        "Understanding of lighting, texturing, and rendering",
        "Experience with motion graphics a plus"
      ]
    },
    {
      id: 29,
      title: "Research Scientist - NLP",
      department: "Research",
      location: "Remote",
      type: "Full-time",
      remote: true,
      description: "Advance the state of natural language processing through original research. You'll develop new algorithms, publish papers, and help translate research into product features.",
      requirements: [
        "PhD in Computer Science, NLP, or related field",
        "Strong publication record in NLP research",
        "Experience with large language models",
        "Proficiency with deep learning frameworks",
        "Excellent communication and collaborative skills"
      ]
    },
    {
      id: 30,
      title: "Research Scientist - Computer Vision",
      department: "Research",
      location: "Chandigarh, India",
      type: "Full-time",
      remote: false,
      description: "Push the boundaries of computer vision technology through innovative research. You'll work on developing new visual processing algorithms and techniques.",
      requirements: [
        "PhD in Computer Science, Computer Vision, or related field",
        "Strong publication record in computer vision research",
        "Experience with image generation and processing models",
        "Proficiency with PyTorch or TensorFlow",
        "Ability to implement research prototypes"
      ]
    }
  ];
  
  // Filter jobs based on search query and filters
  const filteredJobs = jobOpenings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = !filterLocation || 
      (filterLocation === 'remote' ? job.remote : job.location.includes(filterLocation));
    
    const matchesDepartment = !filterDepartment || job.department === filterDepartment;
    
    return matchesSearch && matchesLocation && matchesDepartment;
  });
  
  // Extract unique departments for filter
  const departments = Array.from(new Set(jobOpenings.map(job => job.department)));

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/20 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-60 -left-20 w-80 h-80 bg-purple-600/20 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-pink-500"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Join Our Team
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-300 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Help us build the future of AI model sharing and deployment. We're looking for passionate 
              people to join our mission to democratize access to cutting-edge AI technology.
            </motion.p>
            
            <motion.div
              className="flex justify-center space-x-4 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-400" />
                <span>Fast-growing team</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-blue-400" />
                <span>Remote-friendly</span>
              </div>
              <div className="flex items-center space-x-2">
                <Laptop className="h-5 w-5 text-pink-400" />
                <span>Cutting-edge tech</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="pb-8 px-4">
        <div className="container mx-auto">
          <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search positions..."
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <select
                  className="bg-gray-700/50 border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  value={filterLocation || ''}
                  onChange={(e) => setFilterLocation(e.target.value || null)}
                  aria-label="Filter by location"
                >
                  <option value="">All Locations</option>
                  <option value="India">India</option>
                  <option value="remote">Remote</option>
                </select>
                
                <select
                  className="bg-gray-700/50 border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  value={filterDepartment || ''}
                  onChange={(e) => setFilterDepartment(e.target.value || null)}
                  aria-label="Filter by department"
                >
                  <option value="">All Departments</option>
                  {departments.map(department => (
                    <option key={department} value={department}>{department}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Job Listings Section */}
      <section className="pb-20 px-4">
        <div className="container mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-4">Open Positions</h2>
            <p className="text-gray-300">
              Found {filteredJobs.length} open {filteredJobs.length === 1 ? 'position' : 'positions'}
            </p>
          </div>
          
          {filteredJobs.length > 0 ? (
            <div className="space-y-6">
              {filteredJobs.map((job) => (
                <motion.div
                  key={job.id}
                  className="bg-gray-800/30 border border-gray-700/50 rounded-xl overflow-hidden hover:border-purple-500/30 transition-all hover:shadow-md hover:shadow-purple-500/10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                        <div className="flex flex-wrap gap-3 text-sm">
                          <div className="flex items-center text-gray-400">
                            <Briefcase className="h-4 w-4 mr-1" />
                            <span>{job.department}</span>
                          </div>
                          <div className="flex items-center text-gray-400">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center text-gray-400">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{job.type}</span>
                          </div>
                          {job.remote && (
                            <div className="flex items-center text-green-400">
                              <Home className="h-4 w-4 mr-1" />
                              <span>Remote</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4 md:mt-0">
                        <button 
                          onClick={() => {
                            setSelectedPosition(job);
                            setApplicationModalOpen(true);
                          }}
                          className="inline-flex items-center px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                        >
                          Apply Now
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-6">{job.description}</p>
                    
                    <div>
                      <h4 className="font-medium mb-3">Requirements</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-300">
                        {job.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-8 text-center">
              <h3 className="text-xl font-bold mb-2">No positions found</h3>
              <p className="text-gray-300 mb-4">
                Try changing your search or filter settings.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterLocation(null);
                  setFilterDepartment(null);
                }}
                className="text-purple-400 hover:text-purple-300"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </section>
      
      {/* Remote Work Section */}
      <section className="pb-20 px-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="container mx-auto py-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">Work From Anywhere</h2>
              <p className="text-gray-300 mb-6">
                We believe great talent can be found anywhere in the world. That's why many of our positions 
                are available remotely, allowing you to work from the comfort of your home, a co-working space, 
                or anywhere with a good internet connection.
              </p>
              <p className="text-gray-300 mb-6">
                Our team spans multiple time zones and continents, and we've built our processes around 
                asynchronous communication and flexible work hours. We use tools like Slack, Notion, and GitHub 
                to stay connected and collaborative, no matter where we are.
              </p>
              <div className="flex items-center space-x-4">
                <div className="bg-gray-800/70 rounded-full p-2.5">
                  <Globe className="h-6 w-6 text-purple-400" />
                </div>
                <div className="bg-gray-800/70 rounded-full p-2.5">
                  <Home className="h-6 w-6 text-blue-400" />
                </div>
                <div className="bg-gray-800/70 rounded-full p-2.5">
                  <Laptop className="h-6 w-6 text-pink-400" />
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Remote Work Benefits</h3>
                <ul className="space-y-4">
                  <li className="flex">
                    <div className="mr-3 h-6 w-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">✓</div>
                    <div>
                      <span className="font-medium">Flexible hours</span>
                      <p className="text-gray-400 text-sm">Work when you're most productive</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="mr-3 h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">✓</div>
                    <div>
                      <span className="font-medium">Home office stipend</span>
                      <p className="text-gray-400 text-sm">Set up your perfect workspace</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="mr-3 h-6 w-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">✓</div>
                    <div>
                      <span className="font-medium">Regular team meetups</span>
                      <p className="text-gray-400 text-sm">Connect in person several times a year</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="mr-3 h-6 w-6 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400">✓</div>
                    <div>
                      <span className="font-medium">Global team</span>
                      <p className="text-gray-400 text-sm">Work with talented people worldwide</p>
                    </div>
                  </li>
                </ul>
                
                <div className="mt-6">
                  <Link 
                    href="/careers?filter=remote"
                    className="inline-flex items-center px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    View Remote Positions
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* India Office Section */}
      <section className="pb-20 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2 order-2 md:order-1">
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Our Office in Chandigarh</h3>
                <div className="aspect-video bg-gray-900/70 rounded-lg mb-4 overflow-hidden">
                  <Image 
                    src="/images/Chandigarh.png" 
                    alt="Our Chandigarh Office" 
                    width={600} 
                    height={338}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-gray-300 mb-4">
                  Located in the heart of Chandigarh, our India office is a vibrant hub of innovation. 
                  The modern workspace features open collaboration areas, quiet focus zones, 
                  and all the amenities you need for productive work.
                </p>
                
                <div className="mt-6">
                  <button 
                    onClick={() => {
                      setFilterLocation('India');
                      setJobListingsModalOpen(true);
                    }}
                    className="inline-flex items-center px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    View Positions in India
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 order-1 md:order-2">
              <h2 className="text-3xl font-bold mb-4">Join Our India Team</h2>
              <p className="text-gray-300 mb-6">
                Our Chandigarh office serves as the central hub for our engineering, design, and operations teams. 
                Located in the Indie Hub office, the space is designed to foster collaboration, creativity, and innovation.
              </p>
              <p className="text-gray-300 mb-6">
                Team members based in our India office enjoy a range of perks including:
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <div className="mr-2 h-5 w-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mt-0.5">✓</div>
                  <span>Modern workspace with the latest equipment</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 h-5 w-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mt-0.5">✓</div>
                  <span>Daily catered lunches and snacks</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 h-5 w-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mt-0.5">✓</div>
                  <span>Comprehensive health insurance</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 h-5 w-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mt-0.5">✓</div>
                  <span>Regular team events and activities</span>
                </li>
              </ul>
              <p className="text-gray-300">
                We're actively growing our team in India with both junior and senior roles across multiple departments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Apply CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Apply?</h2>
          <p className="text-xl text-gray-300 mb-8">
            We're always looking for talented individuals to join our team. Browse our open positions 
            or apply directly even if you don't see a perfect fit.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => setJobListingsModalOpen(true)}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
            >
              Browse Open Positions
            </button>
            <button
              onClick={() => {
                setSelectedPosition(null);
                setApplicationModalOpen(true);
              }}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
            >
              Apply for a Role
            </button>
          </div>
        </div>
      </section>

      {/* Modals */}
      <JobListingsModal 
        isOpen={jobListingsModalOpen}
        onClose={() => setJobListingsModalOpen(false)}
        positions={jobOpenings}
      />
      
      <ApplicationModal
        isOpen={applicationModalOpen}
        onClose={() => setApplicationModalOpen(false)}
        selectedPosition={selectedPosition}
        positions={jobOpenings}
      />

      <Footer />
    </main>
  );
} 