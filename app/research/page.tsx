"use client";

import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedButton } from '@/components/ui/animated-button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  BookOpen, Download, FileText, Star, Users, 
  ExternalLink, Search, ChevronRight, Link as LinkIcon,
  Shield, Layers, Beaker, Bot
} from 'lucide-react';
import Link from 'next/link';

interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  publishDate: string;
  tags: string[];
  imageUrl?: string;
  pdfUrl: string;
  citations: number;
}

export default function ResearchPage() {
  const [activeTab, setActiveTab] = useState<'papers' | 'projects' | 'datasets'>('papers');
  const [searchQuery, setSearchQuery] = useState('');
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef);
  
  // Fake papers data
  const papers: ResearchPaper[] = [
    {
      id: "paper1",
      title: "NeuroEvolution: Self-Optimizing Neural Networks Through Genetic Algorithms",
      authors: ["Alex Johnson", "Daniel Lee"],
      abstract: "This paper introduces a novel approach to neural network optimization using genetic algorithms that dynamically evolve network architectures. Our method demonstrates significant improvements in both training speed and model performance across multiple domains.",
      publishDate: "2023-08-15",
      tags: ["Neural Networks", "Genetic Algorithms", "Optimization"],
      imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485",
      pdfUrl: "#",
      citations: 128
    },
    {
      id: "paper2",
      title: "Multi-Modal Attention Mechanisms for Improved Visual Reasoning",
      authors: ["Sarah Chen", "Robert Patel"],
      abstract: "We propose a new attention mechanism that integrates visual and textual information more effectively than previous approaches. Our results show a 24% improvement on the Visual QA benchmark and 18% on the CLEVR dataset.",
      publishDate: "2023-11-02",
      tags: ["Computer Vision", "Attention Mechanisms", "Multi-Modal AI"],
      imageUrl: "https://images.unsplash.com/photo-1629752187687-3d3c7ea3a21b",
      pdfUrl: "#",
      citations: 87
    },
    {
      id: "paper3",
      title: "Transfer Learning Optimization for Low-Resource Languages",
      authors: ["Jamal Ibrahim", "Luis Garcia", "Emma Schmidt"],
      abstract: "This research addresses the challenges of applying NLP to low-resource languages through specialized transfer learning techniques. We demonstrate state-of-the-art results on 12 previously underrepresented languages.",
      publishDate: "2023-09-27",
      tags: ["NLP", "Transfer Learning", "Low-Resource Languages"],
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
      pdfUrl: "#",
      citations: 104
    },
    {
      id: "paper4",
      title: "Quantum-Inspired Neural Networks for Combinatorial Optimization",
      authors: ["Jennifer Wu", "Thomas Müller"],
      abstract: "We present a novel neural network architecture inspired by quantum computing principles to solve complex combinatorial optimization problems. Our approach significantly outperforms traditional methods on traveling salesman and graph coloring tasks.",
      publishDate: "2023-10-19",
      tags: ["Quantum Computing", "Optimization", "Neural Networks"],
      imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
      pdfUrl: "#",
      citations: 62
    },
    {
      id: "paper5",
      title: "Hierarchical Reinforcement Learning for Robotic Control",
      authors: ["Marcus Zhang", "Priya Patel", "David Chen"],
      abstract: "This paper presents a hierarchical approach to reinforcement learning that enables robots to learn complex, multi-stage tasks more efficiently. Our method shows 35% faster learning and 42% better performance on manipulation tasks.",
      publishDate: "2024-01-15",
      tags: ["Robotics", "Reinforcement Learning", "Control Systems"],
      imageUrl: "https://images.unsplash.com/photo-1589254065878-42c9da997008",
      pdfUrl: "#",
      citations: 53
    },
    {
      id: "paper6",
      title: "Foundation Models for Scientific Discovery: Protein Structure Prediction",
      authors: ["Elena Rodriguez", "Samantha Kim", "Oliver Brown"],
      abstract: "We introduce a new foundation model architecture specifically designed for scientific discovery, focusing on protein structure prediction. Our approach leverages both evolutionary and physical constraints to achieve state-of-the-art accuracy.",
      publishDate: "2024-02-28",
      tags: ["Foundation Models", "Protein Structure", "Scientific AI"],
      imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69",
      pdfUrl: "#",
      citations: 75
    },
    {
      id: "paper7",
      title: "Federated Learning With Privacy Guarantees for Healthcare Applications",
      authors: ["Jordan Lee", "Aisha Hassan", "Ryan Mitchell"],
      abstract: "This paper presents a novel federated learning approach with formal privacy guarantees suitable for sensitive healthcare data. We demonstrate how multi-party computation can be combined with differential privacy to enable collaborative model training without data sharing.",
      publishDate: "2024-03-10",
      tags: ["Federated Learning", "Privacy", "Healthcare AI"],
      imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef",
      pdfUrl: "#",
      citations: 42
    },
    {
      id: "paper8",
      title: "Emergent Abilities in Large Language Models: Analysis and Prediction",
      authors: ["Nadia Williams", "Kojo Asante", "Wei Zhang"],
      abstract: "Our research provides a framework for understanding and predicting emergent abilities in large language models. By analyzing the correlation between model size, training data, and task performance, we identify key threshold points where new capabilities emerge.",
      publishDate: "2024-04-05",
      tags: ["Large Language Models", "Emergent Abilities", "Scaling Laws"],
      imageUrl: "https://images.unsplash.com/photo-1655720035881-7d60f99c3ebe",
      pdfUrl: "#",
      citations: 81
    }
  ];
  
  // Featured projects
  const projects = [
    {
      title: "Neural Diffusion Models",
      description: "Exploring advanced diffusion techniques for next-generation image synthesis with unprecedented detail and semantic control.",
      status: "Active",
      contributors: 28,
      imageUrl: "https://images.unsplash.com/photo-1522441815192-d9f04eb0615c"
    },
    {
      title: "Adaptive Few-Shot Learning",
      description: "Developing methods that allow AI to quickly learn new concepts from just a few examples, similar to human learning.",
      status: "Active",
      contributors: 16,
      imageUrl: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f"
    },
    {
      title: "Interpretable Deep RL",
      description: "Creating reinforcement learning systems that can explain their decision-making process in human-understandable terms.",
      status: "Recruiting",
      contributors: 12,
      imageUrl: "https://images.unsplash.com/photo-1554475901-4538ddfbccc2"
    },
    {
      title: "Multimodal Foundation Models",
      description: "Building the next generation of foundation models that seamlessly integrate multiple modalities (text, image, audio, video) for more natural AI interactions.",
      status: "Active",
      contributors: 32,
      imageUrl: "https://images.unsplash.com/photo-1642232454436-97787331eb5d"
    },
    {
      title: "AI for Scientific Discovery",
      description: "Using AI to accelerate scientific discovery in chemistry, biology, and materials science through simulation and hypothesis generation.",
      status: "Recruiting",
      contributors: 23,
      imageUrl: "https://images.unsplash.com/photo-1507413245164-6160d8298b31"
    },
    {
      title: "Human-AI Collaboration Systems",
      description: "Exploring new paradigms for humans and AI working together to solve problems more effectively than either could alone.",
      status: "Active",
      contributors: 19,
      imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692"
    }
  ];
  
  // Datasets
  const datasets = [
    {
      name: "MultiModalConvo-100K",
      description: "100,000 multi-turn conversations including text, images, and structured data for training conversational AI models.",
      samples: "100,000",
      size: "18.5 GB",
      tags: ["Conversation", "MultiModal", "NLP"]
    },
    {
      name: "SyntheticPersons-10M",
      description: "Synthetically generated dataset of 10 million person identities with balanced demographics for unbiased ML training.",
      samples: "10,000,000",
      size: "42.3 GB",
      tags: ["Computer Vision", "Synthetic Data", "Fairness"]
    },
    {
      name: "RobotNavigation-HD",
      description: "High-definition simulated environment data for robot navigation tasks with realistic obstacles and physics.",
      samples: "250,000",
      size: "31.7 GB",
      tags: ["Robotics", "Navigation", "Simulation"]
    },
    {
      name: "MedicalMultimodal-5K",
      description: "Curated dataset of 5,000 medical cases with text reports, imaging data, and structured clinical information with full privacy compliance.",
      samples: "5,000",
      size: "78.2 GB",
      tags: ["Healthcare", "MultiModal", "Privacy-Preserving"]
    },
    {
      name: "IndustryProcesses-HD",
      description: "High-fidelity sensor data from industrial processes with annotations for anomaly detection and predictive maintenance.",
      samples: "1,200,000",
      size: "53.8 GB",
      tags: ["Industrial", "Time-Series", "IoT"]
    },
    {
      name: "CodeReasoningBench",
      description: "Comprehensive benchmark for evaluating code understanding, reasoning, and generation abilities of AI models across 12 programming languages.",
      samples: "850,000",
      size: "15.3 GB",
      tags: ["Code", "Reasoning", "Benchmarking"]
    }
  ];
  
  // Research areas
  const researchAreas = [
    {
      title: "Foundational Model Research",
      description: "Advancing the core capabilities of large-scale AI models through innovations in architecture, training methodologies, and optimization techniques.",
      icon: <BookOpen className="h-8 w-8 text-blue-400" />,
      topics: ["Scaling Laws", "Attention Mechanisms", "Training Efficiency", "Knowledge Representation"]
    },
    {
      title: "Trustworthy AI",
      description: "Developing methods to make AI systems more reliable, safe, fair, and aligned with human values and intentions.",
      icon: <Shield className="h-8 w-8 text-green-400" />,
      topics: ["Alignment", "Safety", "Explainability", "Bias Mitigation"]
    },
    {
      title: "Multimodal Intelligence",
      description: "Creating AI systems that can seamlessly understand and generate content across multiple modalities including text, images, audio, and video.",
      icon: <Layers className="h-8 w-8 text-purple-400" />,
      topics: ["Cross-Modal Learning", "Unified Representations", "Modal Translation", "Sensory Integration"]
    },
    {
      title: "AI for Scientific Discovery",
      description: "Applying AI to accelerate breakthroughs in science and medicine through hypothesis generation, experiment design, and data analysis.",
      icon: <Beaker className="h-8 w-8 text-yellow-400" />,
      topics: ["Drug Discovery", "Materials Science", "Protein Engineering", "Climate Modeling"]
    },
    {
      title: "Human-AI Collaboration",
      description: "Exploring new paradigms for humans and AI systems to work together, enhancing human capabilities while addressing AI limitations.",
      icon: <Users className="h-8 w-8 text-pink-400" />,
      topics: ["Interactive Systems", "Cognitive Augmentation", "Adaptive Interfaces", "Feedback Loops"]
    },
    {
      title: "Embodied Intelligence",
      description: "Building AI systems that can perceive, reason about, and act in the physical world through robotics and simulation.",
      icon: <Bot className="h-8 w-8 text-orange-400" />,
      topics: ["Robotic Learning", "Simulation-to-Reality", "Dexterous Manipulation", "Navigation"]
    }
  ];
  
  // Filter papers based on search query
  const filteredPapers = papers.filter(paper => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      paper.title.toLowerCase().includes(query) ||
      paper.abstract.toLowerCase().includes(query) ||
      paper.authors.some(author => author.toLowerCase().includes(query)) ||
      paper.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  // Scroll animation for section titles
  const { scrollYProgress } = useScroll();
  const titleOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0, 0.1], [50, 0]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative pt-32 pb-24 px-4 overflow-hidden"
      >
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              Neural Nexus Research
            </h1>
            <p className="text-xl text-gray-300 mb-10">
              Expanding the boundaries of AI through cutting-edge research, open collaboration, and innovative datasets
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <AnimatedButton 
                variant="primary" 
                size="lg"
                onClick={() => {
                  const papersSection = document.getElementById('papers-section');
                  papersSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Explore Research
                </span>
              </AnimatedButton>
              <Link href="/careers">
                <AnimatedButton 
                  variant="outline" 
                  size="lg"
                >
                  <span className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Join Our Team
                  </span>
                </AnimatedButton>
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Animated background items */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full bg-gradient-to-r from-purple-600/10 to-blue-600/10 blur-xl"
              style={{
                width: `${Math.random() * 200 + 50}px`,
                height: `${Math.random() * 200 + 50}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 50 - 25],
                y: [0, Math.random() * 50 - 25],
                scale: [1, Math.random() * 0.5 + 0.8],
                rotate: [0, Math.random() * 30 - 15],
              }}
              transition={{
                duration: Math.random() * 20 + 15,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        
        {/* Stats counter */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="max-w-4xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            { value: "85+", label: "Research Papers", icon: <FileText className="h-6 w-6 text-blue-400" /> },
            { value: "32", label: "Active Projects", icon: <Star className="h-6 w-6 text-purple-400" /> },
            { value: "14", label: "Open Datasets", icon: <Database className="h-6 w-6 text-pink-400" /> }
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="p-3 bg-white/10 rounded-full mb-4">{stat.icon}</div>
              <h3 className="text-3xl font-bold">{stat.value}</h3>
              <p className="text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>
      
      {/* Main content section */}
      <section id="papers-section" className="py-16 bg-gradient-to-b from-transparent to-gray-900/50">
        <div className="container mx-auto px-4">
          {/* Tabs */}
          <div className="flex justify-center mb-12 overflow-x-auto pb-2">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-1.5 flex">
              {[
                { id: 'papers', label: 'Research Papers', icon: <FileText className="h-4 w-4 mr-2" /> },
                { id: 'projects', label: 'Projects', icon: <Users className="h-4 w-4 mr-2" /> },
                { id: 'datasets', label: 'Datasets', icon: <Database className="h-4 w-4 mr-2" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Search Bar */}
          {activeTab === 'papers' && (
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search papers by title, author, or topic..."
                  className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>
          )}
          
          {/* Content for each tab */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-8"
          >
            {activeTab === 'papers' && (
              <>
                {filteredPapers.length > 0 ? (
                  <div className="grid grid-cols-1 gap-8 max-w-5xl mx-auto">
                    {filteredPapers.map((paper, index) => (
                      <motion.div
                        key={paper.id}
                        variants={itemVariants}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      >
                        <AnimatedCard 
                          className="border border-white/10 hover:border-purple-500/30 transition-colors duration-300"
                          hoverEffect="glow"
                        >
                          <div className="p-0 relative">
                            {paper.imageUrl && (
                              <div className="h-40 overflow-hidden rounded-t-xl relative">
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10" />
                                <img 
                                  src={paper.imageUrl} 
                                  alt={paper.title} 
                                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                                />
                              </div>
                            )}
                            
                            <div className="p-6">
                              <div className="flex flex-wrap gap-2 mb-4">
                                {paper.tags.map((tag, i) => (
                                  <span 
                                    key={i} 
                                    className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              
                              <h3 className="text-xl font-bold mb-2">{paper.title}</h3>
                              
                              <p className="text-gray-400 text-sm mb-4">
                                {paper.authors.join(', ')} • {new Date(paper.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                              </p>
                              
                              <p className="text-gray-300 mb-6 line-clamp-3">
                                {paper.abstract}
                              </p>
                              
                              <div className="flex justify-between items-center">
                                <span className="flex items-center text-purple-300 text-sm">
                                  <LinkIcon className="h-4 w-4 mr-1" /> 
                                  {paper.citations} citations
                                </span>
                                
                                <div className="flex gap-2">
                                  <AnimatedButton
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(paper.pdfUrl, '_blank')}
                                  >
                                    <span className="flex items-center">
                                      <Download className="h-4 w-4 mr-1" />
                                      PDF
                                    </span>
                                  </AnimatedButton>
                                  
                                  <AnimatedButton
                                    variant="primary"
                                    size="sm"
                                    onClick={() => {
                                      // In a real app, navigate to paper details
                                      console.log(`Viewing paper: ${paper.id}`);
                                    }}
                                  >
                                    Read More
                                  </AnimatedButton>
                                </div>
                              </div>
                            </div>
                          </div>
                        </AnimatedCard>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 max-w-md mx-auto"
                    >
                      <Search className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">No papers found</h3>
                      <p className="text-gray-400 mb-6">
                        We couldn't find any papers matching your search query. Try adjusting your search terms.
                      </p>
                      <AnimatedButton
                        onClick={() => setSearchQuery('')}
                      >
                        Clear Search
                      </AnimatedButton>
                    </motion.div>
                  </div>
                )}
              </>
            )}
            
            {activeTab === 'projects' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {projects.map((project, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                  >
                    <AnimatedCard
                      className="h-full overflow-hidden"
                      hoverEffect="lift"
                    >
                      <div className="h-48 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10" />
                        {project.imageUrl && (
                          <img 
                            src={project.imageUrl} 
                            alt={project.title} 
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute top-3 right-3 z-20">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              project.status === 'Active'
                                ? 'bg-green-500/30 text-green-400'
                                : 'bg-blue-500/30 text-blue-400'
                            }`}
                          >
                            {project.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                        <p className="text-gray-300 mb-6">{project.description}</p>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm flex items-center">
                            <Users className="h-4 w-4 mr-2" /> 
                            {project.contributors} contributors
                          </span>
                          
                          <AnimatedButton 
                            variant="primary"
                            size="sm"
                          >
                            Learn More
                          </AnimatedButton>
                        </div>
                      </div>
                    </AnimatedCard>
                  </motion.div>
                ))}
              </div>
            )}
            
            {activeTab === 'datasets' && (
              <div className="max-w-4xl mx-auto">
                {datasets.map((dataset, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="mb-6"
                  >
                    <AnimatedCard>
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                          <h3 className="text-xl font-bold text-white">{dataset.name}</h3>
                          <div className="flex gap-2 mt-2 md:mt-0">
                            <span className="text-sm bg-white/10 px-3 py-1 rounded-full">
                              {dataset.samples} samples
                            </span>
                            <span className="text-sm bg-white/10 px-3 py-1 rounded-full">
                              {dataset.size}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-300 mb-4">{dataset.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {dataset.tags.map((tag, i) => (
                            <span 
                              key={i} 
                              className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex justify-end">
                          <AnimatedButton 
                            variant="primary"
                            size="sm"
                          >
                            <span className="flex items-center">
                              <Download className="h-4 w-4 mr-1" />
                              Download Dataset
                            </span>
                          </AnimatedButton>
                        </div>
                      </div>
                    </AnimatedCard>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>
      
      {/* Research Areas Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-gray-900 to-gray-900/50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Key Research Areas</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our teams are focused on pushing boundaries in these critical domains
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {researchAreas.map((area, index) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 hover:border-purple-500/30 transition-all"
              >
                <div className="mb-4">{area.icon}</div>
                <h3 className="text-xl font-bold mb-2">{area.title}</h3>
                <p className="text-gray-300 mb-4">{area.description}</p>
                <div className="flex flex-wrap gap-2">
                  {area.topics.map(topic => (
                    <span 
                      key={topic} 
                      className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-purple-900/20 backdrop-blur-sm z-0" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-400">
              Join Our Research Community
            </h2>
            <p className="text-gray-300 mb-10 text-lg">
              Collaborate with leading AI researchers, access exclusive datasets, and contribute to groundbreaking projects that shape the future of AI.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <AnimatedButton 
                variant="primary" 
                size="lg"
              >
                <span className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Apply to Collaborate
                </span>
              </AnimatedButton>
              <Link href="/careers">
                <AnimatedButton 
                  variant="outline" 
                  size="lg"
                >
                  <span className="flex items-center">
                    <ExternalLink className="mr-2 h-5 w-5" />
                    View Open Positions
                  </span>
                </AnimatedButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}

// Common DB icon component
function Database({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
} 