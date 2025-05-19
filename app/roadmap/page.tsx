"use client";

import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  Database, 
  Code, 
  Activity, 
  Shield, 
  Zap, 
  Users,
  Server,
  ChevronDown,
  ChevronUp,
  Star,
  PenTool,
  Layers,
  Terminal,
  Cpu,
  Link as LinkIcon,
  FileText,
  ClipboardCheck,
  RefreshCw,
  Brain,
  Atom,
  Glasses,
  Wifi,
  Sliders,
  Bot,
  Puzzle,
  Copy,
  Leaf,
  Globe,
  Cloud,
  Lock,
  BarChart,
  Smartphone,
  CircuitBoard as Chip,
  Layout,
  ExternalLink as LinkExternal,
  Beaker as Flask,
  Palette,
  Heart,
  BookOpen,
  Share2,
  Network,
  MousePointer
} from "lucide-react";
import Link from "next/link";

export default function RoadmapPage() {
  const [activeYear, setActiveYear] = useState<string>('2025');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  // Toggle roadmap item details
  const toggleItemDetails = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Roadmap data structure
  const roadmapData = {
    '2025': [
      {
        id: 'q1-2025',
        quarter: 'Q1 2025',
        theme: 'Foundation & Core Platform',
        items: [
          {
            id: 'model-hosting-q1',
            title: 'Model Hosting Platform',
            description: 'Launch initial model hosting capabilities with support for major ML frameworks including PyTorch, TensorFlow, and JAX. Focus on fast deployment and easy configuration.',
            status: 'completed',
            category: 'platform',
            priority: 'high',
            assignee: 'Yet to be assigned',
            github_issue: '1',
            icon: <Server className="h-5 w-5 text-blue-400" />
          },
          {
            id: 'dev-api-q1',
            title: 'Developer API v1',
            description: 'First release of our REST API for programmatic access to hosted models with comprehensive documentation and client libraries for Python, JavaScript, and Go. Includes authentication mechanisms, rate limiting, versioning, and webhook support for event notifications. API design follows OpenAPI 3.0 specification with interactive Swagger documentation.',
            status: 'planned',
            category: 'api',
            priority: 'critical',
            assignee: 'Yet to be assigned',
            github_issue: '2',
            icon: <Code className="h-5 w-5 text-green-400" />
          },
          {
            id: 'auth-system-q1',
            title: 'Authentication System',
            description: 'Secure authentication framework with support for API keys, OAuth, and role-based access control. Includes user management and permissions model.',
            status: 'completed',
            category: 'security',
            priority: 'high',
            assignee: 'Yet to be assigned',
            github_issue: '3',
            icon: <Shield className="h-5 w-5 text-purple-400" />
          },
          {
            id: 'inference-api-q1',
            title: 'Inference API',
            description: 'Low-latency inference API with automatic scaling and support for batch processing. Includes streaming responses for LLMs, optimized image generation, and audio processing. Built on a serverless architecture with edge caching for global performance. Supports concurrent requests, request prioritization, and customizable timeout settings. Pay-per-use pricing model with volume discounts.',
            status: 'planned',
            category: 'api',
            priority: 'high',
            assignee: 'Yet to be assigned',
            github_issue: '4',
            icon: <Zap className="h-5 w-5 text-yellow-400" />
          },
          {
            id: 'monitoring-system-q1',
            title: 'Basic Monitoring System',
            description: 'Implement basic monitoring for platform health, API usage, and model performance. Includes alerting system for critical issues.',
            status: 'completed',
            category: 'platform',
            priority: 'medium',
            assignee: 'Yet to be assigned',
            github_issue: '5',
            icon: <Activity className="h-5 w-5 text-red-400" />
          }
        ]
      },
      {
        id: 'q2-2025',
        quarter: 'Q2 2025',
        theme: 'Marketplace & Community',
        items: [
          {
            id: 'model-marketplace-q2',
            title: 'Model Marketplace Beta',
            description: 'Launch of the model marketplace with monetization options for creators, including subscription and pay-per-call models. Add ratings, reviews, and discovery features.',
            status: 'completed',
            category: 'marketplace',
            priority: 'critical',
            assignee: 'Yet to be assigned',
            github_issue: '6',
            icon: <Database className="h-5 w-5 text-pink-400" />
          },
          {
            id: 'community-features-q2',
            title: 'Community Features',
            description: 'User profiles, forums, and collaboration tools to foster a thriving ecosystem of AI creators and developers. Includes reputation system and community guidelines.',
            status: 'completed',
            category: 'community',
            priority: 'high',
            assignee: 'Yet to be assigned',
            github_issue: '7',
            icon: <Users className="h-5 w-5 text-cyan-400" />
          },
          {
            id: 'model-versioning-q2',
            title: 'Model Versioning',
            description: 'Comprehensive versioning system for models with support for rollbacks, tagging, and automatic changelog generation. Includes A/B testing capabilities.',
            status: 'completed',
            category: 'platform',
            priority: 'high',
            assignee: 'Yet to be assigned',
            github_issue: '8',
            icon: <Layers className="h-5 w-5 text-orange-400" />
          },
          {
            id: 'analytics-q2',
            title: 'Usage Analytics',
            description: 'Detailed analytics for model creators to track usage, performance, and revenue with customizable dashboards. Export functionality for reports in various formats.',
            status: 'completed',
            category: 'platform',
            priority: 'medium',
            assignee: 'Yet to be assigned',
            github_issue: '9',
            icon: <Activity className="h-5 w-5 text-indigo-400" />
          },
          {
            id: 'documentation-portal-q2',
            title: 'Documentation Portal',
            description: 'Create comprehensive documentation portal with tutorials, examples, and API reference. Support for community contributions and multi-language translations.',
            status: 'completed',
            category: 'community',
            priority: 'medium',
            assignee: 'Yet to be assigned',
            github_issue: '10',
            icon: <FileText className="h-5 w-5 text-blue-300" />
          }
        ]
      },
      {
        id: 'q3-2025',
        quarter: 'Q3 2025',
        theme: 'Enterprise & Scale',
        items: [
          {
            id: 'enterprise-features-q3',
            title: 'Enterprise Features',
            description: 'Advanced security, compliance tools, and SLAs for enterprise customers. Includes private deployment options, enhanced RBAC with fine-grained permissions, audit logging for all activities, and compliance certifications (SOC 2, HIPAA, GDPR). Custom SLAs with 99.99% uptime guarantee, dedicated support channels, and enterprise-grade encryption for data at rest and in transit. Integration with enterprise identity providers (Okta, Azure AD) through SAML and OIDC.',
            status: 'in-progress',
            category: 'enterprise',
            priority: 'high',
            assignee: 'Yet to be assigned',
            github_issue: '11',
            icon: <Shield className="h-5 w-5 text-purple-400" />
          },
          {
            id: 'custom-training-q3',
            title: 'Custom Training Infrastructure',
            description: 'Scalable infrastructure for fine-tuning and training custom models with support for distributed training across multiple GPU nodes. Checkpoint management included. Features automatic hyperparameter optimization, experiment tracking with MLflow integration, and custom dataset management with versioning. Supports popular frameworks (PyTorch, TensorFlow, JAX) with containerized environments for reproducibility. GPU/TPU scheduling with cost optimization and preemptible instances support.',
            status: 'in-progress',
            category: 'platform',
            priority: 'high',
            assignee: 'Yet to be assigned',
            github_issue: '12',
            icon: <Cpu className="h-5 w-5 text-red-400" />
          },
          {
            id: 'advanced-monitoring-q3',
            title: 'Advanced Monitoring',
            description: 'Real-time monitoring of model performance, health metrics, and automatic anomaly detection. Integrates with popular observability platforms (Datadog, New Relic, Prometheus) and custom alerting. Features model drift detection, performance degradation alerts, and detailed latency breakdowns. Interactive dashboards with customizable metrics and visualization options. Supports log aggregation with structured logging and query capabilities with retention policies configurable per organization.',
            status: 'in-progress',
            category: 'platform',
            priority: 'medium',
            assignee: 'Yet to be assigned',
            github_issue: '13',
            icon: <Activity className="h-5 w-5 text-blue-400" />
          },
          {
            id: 'partner-api-q3',
            title: 'Partner API',
            description: 'Extended API capabilities for integration partners with higher rate limits and advanced features. Includes specialized endpoints for ecosystem integrations, B2B authentication flow with delegated access, and partner-specific analytics. Supports multi-tenant architecture for partners to serve their customers, white-labeling options, and revenue sharing models. OAuth2 scopes for fine-grained access control and detailed usage reporting for billing reconciliation.',
            status: 'in-progress',
            category: 'api',
            priority: 'medium',
            assignee: 'Yet to be assigned',
            github_issue: '14',
            icon: <LinkIcon className="h-5 w-5 text-green-400" />
          },
          {
            id: 'multi-cloud-deploy-q3',
            title: 'Multi-Cloud Deployment',
            description: 'Support for deploying models across multiple cloud providers (AWS, GCP, Azure) with unified management interface and cost optimization tools. Features intelligent traffic routing based on cost, latency, and availability. Includes automatic failover, geo-replication for high availability, and cloud-specific optimizations. Infrastructure-as-code templates for each cloud provider with Terraform support. Cost analysis and recommendation engine to optimize cloud spending based on usage patterns.',
            status: 'in-progress',
            category: 'infrastructure',
            priority: 'high',
            assignee: 'Yet to be assigned',
            github_issue: '15',
            icon: <Cloud className="h-5 w-5 text-blue-400" />
          },
          {
            id: 'data-privacy-tools-q3',
            title: 'Data Privacy Tools',
            description: 'Tools for ensuring data privacy during model training and inference. Includes PII detection, data anonymization, and compliance with privacy regulations.',
            status: 'in-progress',
            category: 'security',
            priority: 'high',
            assignee: 'Yet to be assigned',
            github_issue: '16',
            icon: <Lock className="h-5 w-5 text-yellow-400" />
          }
        ]
      },
      {
        id: 'q4-2025',
        quarter: 'Q4 2025',
        theme: 'AI Collaboration & Advanced Tools',
        items: [
          {
            id: 'collaborative-workspaces-q4',
            title: 'Collaborative Workspaces',
            description: 'Team-based development environments with real-time collaboration features for model development and deployment. Includes shared notebooks, version control integration with Git, and collaborative model tuning. Features role-based permissions at project level, activity feeds to track changes, and built-in code review workflows. Supports environment replication across team members and scheduled jobs for training and evaluation. Integration with popular IDEs and development tools through plugins.',
            status: 'planned',
            category: 'collaboration',
            priority: 'medium',
            assignee: 'Yet to be assigned',
            github_issue: '16',
            icon: <Users className="h-5 w-5 text-indigo-400" />
          },
          {
            id: 'model-registry-q4',
            title: 'Advanced Model Registry',
            description: 'Comprehensive model registry with metadata, lineage tracking, and governance features. Support for model cards, datasheets, and compliance documentation.',
            status: 'planned',
            category: 'platform',
            priority: 'medium',
            assignee: 'Yet to be assigned',
            github_issue: '18',
            icon: <Database className="h-5 w-5 text-purple-400" />
          },
          {
            id: 'ai-orchestrator-q4',
            title: 'AI Orchestration',
            description: 'Tools for building complex AI workflows that chain multiple models together for advanced use cases. Visual interface for workflow design and testing.',
            status: 'planned',
            category: 'platform',
            priority: 'high',
            assignee: 'Yet to be assigned',
            github_issue: '19',
            icon: <Terminal className="h-5 w-5 text-yellow-400" />
          },
          {
            id: 'federated-learning-q4',
            title: 'Federated Learning',
            description: 'Support for privacy-preserving federated learning across distributed data sources. Includes secure aggregation protocols and differential privacy controls.',
            status: 'planned',
            category: 'platform',
            priority: 'medium',
            assignee: 'Yet to be assigned',
            github_issue: '20',
            icon: <Shield className="h-5 w-5 text-green-400" />
          },
          {
            id: 'model-optimization-q4',
            title: 'Model Optimization Toolkit',
            description: 'Tools for optimizing models for different deployment targets, including quantization, pruning, and distillation. Automated optimization suggestions based on usage patterns.',
            status: 'planned',
            category: 'platform',
            priority: 'medium',
            assignee: 'Yet to be assigned',
            github_issue: '21',
            icon: <Zap className="h-5 w-5 text-blue-400" />
          },
          {
            id: 'custom-viz-tools-q4',
            title: 'Custom Visualization Tools',
            description: 'Advanced visualization tools for model outputs, embeddings, and performance metrics. Interactive dashboards for exploring model behavior and data patterns.',
            status: 'planned',
            category: 'platform',
            priority: 'low',
            assignee: 'Yet to be assigned',
            github_issue: '22',
            icon: <BarChart className="h-5 w-5 text-indigo-400" />
          }
        ]
      }
    ],
    '2026': [
      {
        id: 'q1-2026',
        quarter: 'Q1 2026',
        theme: 'AI Governance & Responsible AI',
        items: [
          {
            id: 'ai-governance-q1',
            title: 'AI Governance Framework',
            description: 'Comprehensive governance tools for enterprise AI deployment including audit trails, approval workflows, and compliance reporting. Integrates with existing risk management systems.',
            status: 'planned',
            category: 'enterprise',
            priority: 'high',
            assignee: 'Yet to be assigned',
            github_issue: '23',
            icon: <Shield className="h-5 w-5 text-purple-400" />
          },
          {
            id: 'model-explainability-q1',
            title: 'Model Explainability Tools',
            description: 'Advanced tools for interpreting and explaining model predictions to improve transparency and trust. Support for various explainability techniques and customizable reports.',
            status: 'planned',
            category: 'platform',
            priority: 'medium',
            assignee: 'Yet to be assigned',
            github_issue: '24',
            icon: <PenTool className="h-5 w-5 text-blue-400" />
          },
          {
            id: 'responsible-ai-q1',
            title: 'Responsible AI Toolkit',
            description: 'Suite of tools for bias detection, fairness metrics, and ethical AI development practices. Includes evaluation frameworks and mitigation strategies for various AI risks.',
            status: 'planned',
            category: 'platform',
            priority: 'high',
            assignee: 'Yet to be assigned',
            github_issue: '25',
            icon: <Star className="h-5 w-5 text-yellow-400" />
          },
          {
            id: 'api-v2-q1',
            title: 'Developer API v2',
            description: 'Major update to our API with new endpoints, improved performance, and enhanced developer experience. Backward compatible with additional features for advanced use cases.',
            status: 'planned',
            category: 'api',
            priority: 'high',
            assignee: 'Yet to be assigned',
            github_issue: '26',
            icon: <Code className="h-5 w-5 text-green-400" />
          },
          {
            id: 'continuous-evaluation-q1',
            title: 'Continuous Model Evaluation',
            description: 'System for continuously evaluating models in production to detect drift, degradation, and potential issues. Automatic alerts and remediation recommendations.',
            status: 'planned',
            category: 'platform',
            priority: 'medium',
            assignee: 'Yet to be assigned',
            github_issue: '27',
            icon: <RefreshCw className="h-5 w-5 text-cyan-400" />
          },
          {
            id: 'compliance-center-q1',
            title: 'AI Compliance Center',
            description: 'Central hub for managing AI compliance with various regulations and standards. Pre-built templates for common compliance requirements and custom policy creation.',
            status: 'planned',
            category: 'enterprise',
            priority: 'medium',
            assignee: 'Yet to be assigned',
            github_issue: '28',
            icon: <ClipboardCheck className="h-5 w-5 text-teal-400" />
          }
        ]
      },
      {
        id: 'q2-2026',
        quarter: 'Q2 2026',
        theme: 'Global Scale & Advanced Infrastructure',
        items: [
          {
            id: 'global-edge-q2',
            title: 'Global Edge Network',
            description: 'Expand our edge computing infrastructure to reduce latency and improve performance globally. Strategic placement of compute resources near users for optimal experience.',
            status: 'planned',
            category: 'infrastructure',
            priority: 'high',
            assignee: 'Yet to be assigned',
            github_issue: '29',
            icon: <Zap className="h-5 w-5 text-orange-400" />
          },
          {
            id: 'hw-acceleration-q2',
            title: 'Hardware Acceleration',
            description: 'Support for specialized AI hardware including TPUs, FPGAs, and custom ASICs for improved performance. Automatic optimization for available hardware resources.',
            status: 'planned',
            category: 'platform',
            priority: 'medium',
            assignee: 'Yet to be assigned',
            github_issue: '30',
            icon: <Cpu className="h-5 w-5 text-red-400" />
          },
          {
            id: 'automated-ml-q2',
            title: 'AutoML Platform',
            description: 'Automated machine learning tools for model selection, hyperparameter tuning, and architecture search. Simplified ML development for non-expert users with guidance and recommendations.',
            status: 'planned',
            category: 'platform',
            priority: 'high',
            assignee: 'Yet to be assigned',
            github_issue: '31',
            icon: <Terminal className="h-5 w-5 text-cyan-400" />
          },
          {
            id: 'enterprise-sso-q2',
            title: 'Enterprise SSO & Advanced Security',
            description: 'Enhanced security features including SAML/SSO integration, IP restrictions, and advanced threat protection. Support for custom security policies and third-party security tools.',
            status: 'planned',
            category: 'enterprise',
            priority: 'high',
            assignee: 'Yet to be assigned',
            github_issue: '32',
            icon: <Shield className="h-5 w-5 text-purple-400" />
          },
          {
            id: 'carbon-footprint-q2',
            title: 'Carbon Footprint Tracking',
            description: 'Tools for tracking and optimizing the carbon footprint of AI model training and inference. Recommendations for more energy-efficient deployment options.',
            status: 'planned',
            category: 'platform',
            priority: 'low',
            assignee: 'Yet to be assigned',
            github_issue: '33',
            icon: <Leaf className="h-5 w-5 text-green-400" />
          },
          {
            id: 'hybrid-cloud-q2',
            title: 'Hybrid Cloud Solutions',
            description: 'Support for hybrid deployments combining on-premises hardware with cloud resources. Seamless management and workload balancing across environments.',
            status: 'planned',
            category: 'infrastructure',
            priority: 'medium',
            assignee: 'Yet to be assigned',
            github_issue: '34',
            icon: <Cloud className="h-5 w-5 text-blue-400" />
          },
          {
            id: 'data-sovereignty-q2',
            title: 'Data Sovereignty Controls',
            description: 'Enhanced controls for ensuring data sovereignty requirements are met for global organizations. Region-specific data handling and storage with compliance verification.',
            status: 'planned',
            category: 'security',
            priority: 'medium',
            assignee: 'Yet to be assigned',
            github_issue: '35',
            icon: <Globe className="h-5 w-5 text-indigo-400" />
          }
        ]
      },
      {
        id: 'q3-2026',
        quarter: 'Q3 2026',
        theme: 'Advanced AI & Ecosystem Expansion',
        items: [
          {
            id: 'multimodal-pipelines-q3',
            title: 'Multimodal AI Pipelines',
            description: 'Advanced tooling for creating and deploying multimodal AI pipelines combining text, image, audio, and video capabilities. Visual editor for complex pipeline design.',
            status: 'planned',
            category: 'platform',
            priority: 'high',
            assignee: 'Yet to be assigned',
            github_issue: '36',
            icon: <Sliders className="h-5 w-5 text-pink-400" />
          },
          {
            id: 'agent-framework-q3',
            title: 'AI Agent Framework',
            description: 'Framework for building autonomous AI agents with reasoning capabilities that can perform complex tasks. Includes tools for agent orchestration and monitoring.',
            status: 'planned',
            category: 'platform',
            priority: 'high',
            assignee: 'Yet to be assigned',
            github_issue: '37',
            icon: <Bot className="h-5 w-5 text-blue-400" />
          },
          {
            id: 'ecosystem-integrations-q3',
            title: 'Ecosystem Integrations Marketplace',
            description: 'Marketplace for third-party tools and integrations that extend the Neural Nexus platform capabilities. Developer portal for building and publishing integrations.',
            status: 'planned',
            category: 'marketplace',
            priority: 'medium',
            assignee: 'Yet to be assigned',
            github_issue: '38',
            icon: <Puzzle className="h-5 w-5 text-green-400" />
          },
          {
            id: 'retrieval-augmentation-q3',
            title: 'Advanced RAG Framework',
            description: 'Sophisticated retrieval-augmented generation framework for building knowledge-intensive applications. Includes vector database integration and advanced retrieval methods.',
            status: 'planned',
            category: 'platform',
            priority: 'high',
            assignee: 'Yet to be assigned',
            github_issue: '39',
            icon: <Database className="h-5 w-5 text-yellow-400" />
          },
          {
            id: 'synthetic-data-q3',
            title: 'Synthetic Data Generation',
            description: 'Tools for generating high-quality synthetic data for model training, testing, and evaluation. Preserves statistical properties while ensuring privacy compliance.',
            status: 'planned',
            category: 'platform',
            priority: 'medium',
            assignee: 'Yet to be assigned',
            github_issue: '40',
            icon: <Copy className="h-5 w-5 text-purple-400" />
          }
        ]
      },
      {
        id: 'q4-2026',
        quarter: 'Q4 2026',
        theme: 'Future of AI & Integration',
        items: [
          {
            id: 'neural-interface-q4',
            title: 'Neural Interface Platform',
            description: 'Cutting-edge platform for developing neural interfaces that connect AI models with human thought processes. Research tools for BCI integration and ethical guidelines.',
            status: 'planned',
            category: 'research',
            priority: 'medium',
            assignee: 'Yet to be assigned',
            github_issue: '41',
            icon: <Brain className="h-5 w-5 text-purple-400" />
          },
          {
            id: 'quantum-ml-q4',
            title: 'Quantum ML Integration',
            description: 'Integration with quantum computing platforms for training and executing quantum machine learning algorithms. Framework for hybrid classical-quantum models.',
            status: 'planned',
            category: 'research',
            priority: 'low',
            assignee: 'Yet to be assigned',
            github_issue: '42',
            icon: <Atom className="h-5 w-5 text-blue-400" />
          },
          {
            id: 'ar-vr-integration-q4',
            title: 'AR/VR Integration',
            description: 'Tools for integrating AI models with augmented and virtual reality applications. Low-latency inference and spatial understanding capabilities.',
            status: 'planned',
            category: 'platform',
            priority: 'medium',
            assignee: 'Yet to be assigned',
            github_issue: '43',
            icon: <Glasses className="h-5 w-5 text-cyan-400" />
          },
          {
            id: 'iot-edge-ai-q4',
            title: 'IoT & Edge AI Platform',
            description: 'Comprehensive platform for deploying and managing AI on edge devices and IoT networks. Includes model compression and optimization for resource-constrained environments.',
            status: 'planned',
            category: 'platform',
            priority: 'high',
            assignee: 'Yet to be assigned',
            github_issue: '44',
            icon: <Wifi className="h-5 w-5 text-green-400" />
          },
          {
            id: 'governance-framework-q4',
            title: 'AI Governance Framework',
            description: 'Comprehensive governance tools for responsible AI development including bias detection, explainability reports, and regulatory compliance checks. Features model cards documentation system, automated ethical review based on industry standards, and fairness metrics across demographic groups. Includes continuous monitoring for regulatory changes with compliance alerts and audit trails for model decisions. Support for customizable approval workflows and governance policies specific to industry verticals.',
            status: 'planned',
            category: 'enterprise',
            priority: 'high',
            assignee: 'Yet to be assigned',
            github_issue: '17',
            icon: <ClipboardCheck className="h-5 w-5 text-purple-400" />
          },
          {
            id: 'edge-deployment-q4',
            title: 'Edge Deployment Options',
            description: 'Lightweight deployment options for running models on edge devices and browsers. Includes model compression techniques (quantization, pruning, distillation) and optimized runtime environments. Support for WebAssembly, TensorFlow Lite, ONNX Runtime, and PyTorch Mobile with automated conversion pipelines. Features offline capability, delta updates for model weights, and performance profiling tools for edge environments. Compatible with ARM, RISC-V architectures and various mobile/IoT platforms.',
            status: 'planned',
            category: 'platform',
            priority: 'medium',
            assignee: 'Yet to be assigned',
            github_issue: '18',
            icon: <Smartphone className="h-5 w-5 text-green-400" />
          },
          {
            id: 'platform-evolution-q4',
            title: 'Platform 2.0 Architecture',
            description: 'Major platform evolution incorporating learnings and feedback from years of operation. Reimagined architecture for the next generation of AI development and deployment. Features microservices architecture with domain-driven design, event-driven communication through Kafka, and polyglot persistence for optimal data storage. Includes canary deployments, blue-green deployment strategies, and zero-downtime migration paths from v1. Enhanced scalability with regionalized deployments and multi-cluster Kubernetes orchestration.',
            status: 'planned',
            category: 'platform',
            priority: 'high',
            assignee: 'Yet to be assigned',
            github_issue: '60',
            icon: <Atom className="h-5 w-5 text-purple-400" />
          }
        ]
      }
    ],
    '2027': [
      {
        id: 'q1-2027',
        quarter: 'Q1 2027',
        theme: 'SDK & Developer Tools',
        items: [
          {
            id: 'core-sdk-q1',
            title: 'Core SDK Release',
            description: 'Launch of the official Neural Nexus SDK with comprehensive libraries for Python, JavaScript, Rust, and Go. Includes high-level abstractions and low-level control for all platform capabilities.',
            status: 'planned',
            category: 'sdk',
            priority: 'critical',
            assignee: 'Yet to be assigned',
            github_issue: '45',
            icon: <Code className="h-5 w-5 text-blue-400" />
          },
          {
            id: 'mobile-sdk-q1',
            title: 'Mobile SDK (iOS & Android)',
            description: 'Native SDK for iOS and Android platforms enabling AI capabilities in mobile applications. Optimized for on-device inference with efficient resource utilization.',
            status: 'planned',
            category: 'sdk',
            priority: 'high',
            assignee: 'Yet to be assigned',
            github_issue: '46',
            icon: <Smartphone className="h-5 w-5 text-green-400" />
          },
          {
            id: 'visual-tools-q1',
            title: 'Visual Model Builder',
            description: 'No-code/low-code interface for model customization and deployment. Drag-and-drop components for building AI applications without programming expertise.',
            status: 'planned',
            category: 'platform',
            priority: 'medium',
            assignee: 'Yet to be assigned',
            github_issue: '47',
            icon: <Palette className="h-5 w-5 text-purple-400" />
          },
          {
            id: 'data-connectors-q1',
            title: 'Universal Data Connectors',
            description: 'Extensive library of connectors for integrating with popular data sources, databases, and third-party services. Simplified data ingestion for model training and inference.',
            status: 'planned',
            category: 'sdk',
            priority: 'high',
            assignee: 'Yet to be assigned',
            github_issue: '48',
            icon: <LinkExternal className="h-5 w-5 text-cyan-400" />
          }
        ]
      },
      {
        id: 'q2-2027',
        quarter: 'Q2 2027',
        theme: 'Edge Computing & IoT Support',
        items: [
          {
            id: 'edge-runtime-q2',
            title: 'Edge Runtime Environment',
            description: 'Specialized runtime for deploying models to edge devices with limited resources. Optimized for low latency and minimal footprint across diverse hardware.',
            status: 'planned',
            category: 'platform',
            priority: 'high',
            assignee: 'Yet to be assigned',
            github_issue: '49',
            icon: <Zap className="h-5 w-5 text-orange-400" />
          },
          {
            id: 'iot-integrations-q2',
            title: 'IoT Device Integrations',
            description: 'Support for common IoT platforms and protocols enabling AI capabilities on connected devices. Includes reference implementations for popular hardware.',
            status: 'planned',
            category: 'sdk',
            priority: 'medium',
            assignee: 'Yet to be assigned',
            github_issue: '50',
            icon: <Wifi className="h-5 w-5 text-blue-400" />
          },
          {
            id: 'embedded-sdk-q2',
            title: 'Embedded Systems SDK',
            description: 'Ultra-lightweight SDK for microcontrollers and embedded systems with minimal resource requirements. Enables AI at the extreme edge of computing.',
            status: 'planned',
            category: 'sdk',
            priority: 'medium',
            assignee: 'Yet to be assigned',
            github_issue: '51',
            icon: <Chip className="h-5 w-5 text-green-400" />
          },
          {
            id: 'offline-capabilities-q2',
            title: 'Offline-First Capabilities',
            description: 'Support for fully offline operation with synchronization when connectivity is restored. Resilient operation in intermittent network environments.',
            status: 'planned',
            category: 'platform',
            priority: 'high',
            assignee: 'Yet to be assigned',
            github_issue: '52',
            icon: <Cloud className="h-5 w-5 text-purple-400" />
          }
        ]
      },
      {
        id: 'q3-2027',
        quarter: 'Q3 2027',
        theme: 'Advanced Integrations & Ecosystem',
        items: [
          {
            id: 'ide-integrations-q3',
            title: 'IDE Extensions & Plugins',
            description: 'Official plugins for popular IDEs (VS Code, JetBrains, etc.) providing seamless development experience with code completion, documentation, and debugging tools.',
            status: 'planned',
            category: 'sdk',
            priority: 'medium',
            assignee: 'Yet to be assigned',
            github_issue: '53',
            icon: <Terminal className="h-5 w-5 text-blue-400" />
          },
          {
            id: 'ci-cd-integrations-q3',
            title: 'CI/CD Pipeline Integrations',
            description: 'Integrations with popular CI/CD platforms for automated testing and deployment of AI models. Includes quality gates and approval workflows.',
            status: 'planned',
            category: 'platform',
            priority: 'high',
            assignee: 'Yet to be assigned',
            github_issue: '54',
            icon: <RefreshCw className="h-5 w-5 text-green-400" />
          },
          {
            id: 'ecosystem-partners-q3',
            title: 'Ecosystem Partners Program',
            description: 'Formalized program for technology partners to build certified integrations and extensions. Includes partner API access, technical support, and co-marketing opportunities.',
            status: 'planned',
            category: 'community',
            priority: 'medium',
            assignee: 'Yet to be assigned',
            github_issue: '55',
            icon: <Puzzle className="h-5 w-5 text-yellow-400" />
          },
          {
            id: 'browser-sdk-q3',
            title: 'Web Browser SDK',
            description: 'Optimized browser-based SDK for running AI models directly in web browsers with WebGL/WebGPU acceleration. Enables advanced AI capabilities without server-side processing.',
            status: 'planned',
            category: 'sdk',
            priority: 'high',
            assignee: 'Yet to be assigned',
            github_issue: '56',
            icon: <Globe className="h-5 w-5 text-purple-400" />
          }
        ]
      },
      {
        id: 'q4-2027',
        quarter: 'Q4 2027',
        theme: 'Next-Gen AI & Platform Evolution',
        items: [
          {
            id: 'next-gen-models-q4',
            title: 'Next-Gen AI Model Support',
            description: 'Support for emerging model architectures and paradigms including neuromorphic computing models and bio-inspired AI systems. Stay at the cutting edge of AI research.',
            status: 'planned',
            category: 'platform',
            priority: 'medium',
            assignee: 'Yet to be assigned',
            github_issue: '57',
            icon: <Brain className="h-5 w-5 text-pink-400" />
          },
          {
            id: 'cross-platform-sdk-q4',
            title: 'Universal Cross-Platform SDK',
            description: 'Single unified SDK providing consistent experience across all supported platforms and languages. Write once, deploy anywhere philosophy for AI applications.',
            status: 'planned',
            category: 'sdk',
            priority: 'critical',
            assignee: 'Yet to be assigned',
            github_issue: '58',
            icon: <Layout className="h-5 w-5 text-blue-400" />
          },
          {
            id: 'ar-vr-sdk-q4',
            title: 'AR/VR/XR Integration Kit',
            description: 'Specialized SDK components for augmented, virtual, and mixed reality applications. Optimized for spatial computing and immersive AI experiences.',
            status: 'planned',
            category: 'sdk',
            priority: 'medium',
            assignee: 'Yet to be assigned',
            github_issue: '59',
            icon: <Glasses className="h-5 w-5 text-indigo-400" />
          },
          {
            id: 'platform-evolution-q4',
            title: 'Platform 2.0 Architecture',
            description: 'Major platform evolution incorporating learnings and feedback from years of operation. Reimagined architecture for the next generation of AI development and deployment.',
            status: 'planned',
            category: 'platform',
            priority: 'high',
            assignee: 'Yet to be assigned',
            github_issue: '60',
            icon: <Atom className="h-5 w-5 text-purple-400" />
          },
          {
            id: 'core-sdk-2027-q1',
            title: 'Core SDK Release',
            description: 'Comprehensive Software Development Kit for deep integration with Neural Nexus platform. Provides native bindings for major programming languages (Python, JavaScript, Go, Rust, Java, C++) with idiomatic APIs for each ecosystem. Features automatic request batching, connection pooling, circuit breaking, and exponential backoff retry logic. Includes local development environment with mock services, extensive test helpers, and performance benchmarking tools. Comprehensive documentation with code samples, tutorials and migration guides from alternative platforms.',
            status: 'planned',
            category: 'sdk',
            priority: 'critical',
            assignee: 'Yet to be assigned',
            github_issue: '31',
            icon: <Code className="h-5 w-5 text-violet-400" />
          },
          {
            id: 'mobile-sdk-2027-q1',
            title: 'Mobile SDK (iOS & Android)',
            description: 'Native mobile SDKs for iOS and Android platforms with optimized performance and battery usage. Implements efficient model serving with on-device inference prioritization and intelligent cloud offloading. Features offline capability with data synchronization, background processing for large operations, and memory-efficient model loading. Includes UI components for common AI interfaces (camera input, text generation, voice interaction) following platform design guidelines. Supports ARKit/ARCore integration for AR experiences and CoreML/TensorFlow Lite compatibility.',
            status: 'planned',
            category: 'sdk',
            priority: 'high',
            assignee: 'Yet to be assigned',
            github_issue: '32',
            icon: <Smartphone className="h-5 w-5 text-pink-400" />
          },
          {
            id: 'visual-model-builder-2027-q1',
            title: 'Visual Model Builder',
            description: 'Sophisticated visual interface for model architecture design and hyperparameter optimization. Features interactive node-based editor for neural network design with real-time validation and performance estimation. Includes searchable component library of architecture patterns (ResNets, Transformers, etc.) with visual explanation of each building block. Supports custom component creation with version control and sharing. Generates production-ready code in PyTorch, TensorFlow or JAX with comprehensive integration tests. Includes collaborative features for team-based model design.',
            status: 'planned',
            category: 'platform',
            priority: 'medium',
            assignee: 'Yet to be assigned',
            github_issue: '33',
            icon: <PenTool className="h-5 w-5 text-cyan-400" />
          },
          {
            id: 'universal-data-connectors-2027-q2',
            title: 'Universal Data Connectors',
            description: 'Extensive library of data connectors for seamless integration with diverse data sources. Supports structured databases (SQL, NoSQL), data warehouses, data lakes, streaming sources, and specialized AI datasets. Features schema inference, automated data quality validation, and privacy-aware data handling with PII detection. Includes incremental sync capabilities, event-driven processing pipelines, and transformation recipes for common ML preprocessing tasks. Built-in monitoring for data drift and automated documentation of lineage for compliance purposes. Integration with popular data engineering tools (Airflow, dbt, Prefect) for complex workflows.',
            status: 'planned',
            category: 'platform',
            priority: 'high',
            assignee: 'Yet to be assigned',
            github_issue: '35',
            icon: <Database className="h-5 w-5 text-green-400" />
          }
        ]
      }
    ]
  };

  // Filter roadmap items by category
  const filterRoadmapByCategory = (items: any[]) => {
    if (activeCategory === 'all') return items;
    return items.filter(item => item.category === activeCategory);
  };

  // Clean up completed items by removing priority and assignee info
  const cleanCompletedItems = (items: any[]) => {
    return items.map(item => {
      if (item.status === 'completed') {
        return {
          ...item,
          priority: undefined,
          assignee: undefined
        };
      }
      return item;
    });
  };

  // Get current year's data
  const currentYearData = roadmapData[activeYear as keyof typeof roadmapData] || [];

  // Animation variants for timeline items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  // Status indicator component
  const StatusIndicator = ({ status }: { status: string }) => {
    const statusStyles = {
      completed: "bg-gradient-to-r from-green-500 to-emerald-600 text-green-100",
      'in-progress': "bg-gradient-to-r from-blue-500 to-indigo-600 text-blue-100",
      planned: "bg-gradient-to-r from-purple-500 to-violet-600 text-purple-100",
    };
    
    const statusIcons = {
      completed: <CheckCircle className="h-4 w-4 mr-1" />,
      'in-progress': <Clock className="h-4 w-4 mr-1" />,
      planned: <Calendar className="h-4 w-4 mr-1" />,
    };
    
    return (
      <span className={`${statusStyles[status as keyof typeof statusStyles]} px-2.5 py-1 rounded-full text-xs flex items-center shadow-lg`}>
        {statusIcons[status as keyof typeof statusIcons]}
        {status === 'completed' ? 'Completed' : status === 'in-progress' ? 'In Progress' : 'Planned'}
      </span>
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />

      {/* Hero Section with enhanced animations */}
      <section className="pt-28 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/30 rounded-full filter blur-3xl opacity-30"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.4, 0.3]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div 
            className="absolute top-60 -left-20 w-80 h-80 bg-blue-600/30 rounded-full filter blur-3xl opacity-30"
            animate={{ 
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ 
              duration: 7,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1
            }}
          />
          <motion.div 
            className="absolute -bottom-40 right-20 w-80 h-80 bg-pink-600/30 rounded-full filter blur-3xl opacity-30"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.45, 0.3]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 2
            }}
          />
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 inline-block"
            >
              <span className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full text-sm font-medium">
                Our Vision
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-pink-500"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Innovation Roadmap
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-300 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Explore our ambitious journey to revolutionize AI deployment and development.
              From foundational infrastructure to cutting-edge research, witness our evolution
              into the ultimate platform for the next generation of AI innovation.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="https://github.com/Drago-03/Neural-Nexus/issues" 
                  target="_blank"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 rounded-lg font-medium transition-all shadow-lg shadow-purple-500/20"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                  >
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                  Submit Feature Request
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/community" 
                  className="inline-flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-all border border-gray-700/50 shadow-lg"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Join Our Community
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline Filters Section with enhanced UI */}
      <section className="py-8 px-4 bg-gray-900/50 sticky top-16 z-20 backdrop-blur-sm border-y border-gray-800/50 shadow-md">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Year Selection */}
            <div className="flex gap-2">
              {['2025', '2026', '2027'].map((year) => (
                <motion.button
                  key={year}
                  onClick={() => setActiveYear(year)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeYear === year 
                      ? 'bg-gradient-to-r from-purple-600 to-violet-700 text-white shadow-lg' 
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {year}
                </motion.button>
              ))}
            </div>
            
            {/* Category Filter with enhanced styling */}
            <div className="flex flex-wrap gap-2">
              <motion.button
                onClick={() => setActiveCategory('all')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  activeCategory === 'all' 
                    ? 'bg-gray-700 text-white shadow-lg' 
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
                }`}
              >
                All
              </motion.button>
              <motion.button
                onClick={() => setActiveCategory('platform')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  activeCategory === 'platform' 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Platform
              </motion.button>
              <motion.button
                onClick={() => setActiveCategory('api')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  activeCategory === 'api' 
                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg' 
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
                }`}
              >
                API
              </motion.button>
              <motion.button
                onClick={() => setActiveCategory('sdk')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  activeCategory === 'sdk' 
                    ? 'bg-gradient-to-r from-violet-600 to-violet-700 text-white shadow-lg' 
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
                }`}
              >
                SDK
              </motion.button>
              <motion.button
                onClick={() => setActiveCategory('marketplace')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  activeCategory === 'marketplace' 
                    ? 'bg-gradient-to-r from-pink-600 to-pink-700 text-white shadow-lg' 
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Marketplace
              </motion.button>
              <motion.button
                onClick={() => setActiveCategory('enterprise')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  activeCategory === 'enterprise' 
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg' 
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Enterprise
              </motion.button>
              <motion.button
                onClick={() => setActiveCategory('security')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  activeCategory === 'security' 
                    ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white shadow-lg' 
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Security
              </motion.button>
              <motion.button
                onClick={() => setActiveCategory('community')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  activeCategory === 'community' 
                    ? 'bg-gradient-to-r from-cyan-600 to-cyan-700 text-white shadow-lg' 
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Community
              </motion.button>
              <motion.button
                onClick={() => setActiveCategory('research')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  activeCategory === 'research' 
                    ? 'bg-gradient-to-r from-fuchsia-600 to-fuchsia-700 text-white shadow-lg' 
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Research
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Timeline Section with enhanced animations */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <motion.div 
            className="space-y-16 relative"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Vertical timeline line with glow effect */}
            <div className="absolute left-12 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-600 via-blue-600 to-pink-600 hidden md:block"></div>
            
            {currentYearData.map((quarter, index) => (
              <div key={quarter.id} className="relative">
                {/* Quarter heading with theme */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="mb-6 md:ml-20"
                >
                  {/* Timeline point for quarter - enhanced with animation */}
                  <motion.div 
                    className="absolute left-10 w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 border-4 border-gray-900 hidden md:flex items-center justify-center shadow-lg shadow-purple-500/20"
                    whileInView={{
                      scale: [1, 1.2, 1],
                      backgroundColor: ["#9333ea", "#3b82f6", "#9333ea"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <motion.div
                      className="w-2 h-2 bg-white rounded-full"
                      animate={{
                        scale: [1, 1.3, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                  </motion.div>
                  
                  <div className="md:flex md:items-end md:gap-4">
                    <motion.h2 
                      className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500"
                      whileInView={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      {quarter.quarter}
                    </motion.h2>
                    <div className="text-lg text-gray-300 font-medium">
                      {quarter.theme}
                    </div>
                  </div>
                </motion.div>
                
                {/* Quarter roadmap items with enhanced grid and animations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:ml-20">
                  {filterRoadmapByCategory(cleanCompletedItems(quarter.items)).map((item) => (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      whileHover={{ 
                        y: -5,
                        boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.2)",
                        borderColor: "rgba(124, 58, 237, 0.4)"
                      }}
                      onClick={() => toggleItemDetails(item.id)}
                      className={`
                        bg-gray-800/30 border border-gray-700/50 rounded-xl overflow-hidden hover:border-gray-600/70 
                        transition-all duration-300 cursor-pointer backdrop-blur-sm
                        ${item.status === 'completed' ? 'border-l-4 border-l-green-500' : 
                          item.status === 'in-progress' ? 'border-l-4 border-l-blue-500' : 
                          'border-l-4 border-l-purple-500'}
                      `}
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`
                              p-2 rounded-lg ${
                                item.status === 'completed' ? 'bg-green-500/20' :
                                item.status === 'in-progress' ? 'bg-blue-500/20' :
                                'bg-purple-500/20'
                              }`
                            }>
                              {item.icon}
                            </div>
                            <h3 className="text-lg font-bold">{item.title}</h3>
                          </div>
                          <StatusIndicator status={item.status} />
                        </div>
                        
                        <p className={`text-gray-300 text-sm mb-3 ${expandedItems[item.id] ? '' : 'line-clamp-2'}`}>
                          {item.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                            item.category === 'platform' ? 'bg-blue-900/30 text-blue-400 border border-blue-900/50' :
                            item.category === 'api' ? 'bg-green-900/30 text-green-400 border border-green-900/50' :
                            item.category === 'sdk' ? 'bg-violet-900/30 text-violet-400 border border-violet-900/50' :
                            item.category === 'marketplace' ? 'bg-pink-900/30 text-pink-400 border border-pink-900/50' :
                            item.category === 'enterprise' ? 'bg-purple-900/30 text-purple-400 border border-purple-900/50' :
                            item.category === 'security' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-900/50' :
                            item.category === 'community' ? 'bg-cyan-900/30 text-cyan-400 border border-cyan-900/50' :
                            item.category === 'infrastructure' ? 'bg-orange-900/30 text-orange-400 border border-orange-900/50' :
                            item.category === 'collaboration' ? 'bg-indigo-900/30 text-indigo-400 border border-indigo-900/50' :
                            item.category === 'research' ? 'bg-fuchsia-900/30 text-fuchsia-400 border border-fuchsia-900/50' :
                            'bg-gray-900/30 text-gray-400 border border-gray-900/50'
                          }`}>
                            {item.category}
                          </span>
                          
                          {expandedItems[item.id] && item.status !== 'completed' && (
                            <div className="flex gap-2 items-center flex-wrap">
                              {item.priority && (
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  item.priority === 'critical' ? 'bg-red-900/30 text-red-400 border border-red-900/50' :
                                  item.priority === 'high' ? 'bg-orange-900/30 text-orange-400 border border-orange-900/50' :
                                  item.priority === 'medium' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-900/50' :
                                  'bg-green-900/30 text-green-400 border border-green-900/50'
                                }`}>
                                  {item.priority} priority
                                </span>
                              )}
                              {item.assignee && (
                                <span className="text-xs px-2 py-1 rounded-full bg-gray-800/70 text-gray-300 border border-gray-700">
                                  {item.assignee}
                                </span>
                              )}
                              {item.github_issue && (
                                <span className="text-xs px-2 py-1 rounded-full bg-indigo-900/30 text-indigo-400 border border-indigo-900/50">
                                  Issue #{item.github_issue}
                                </span>
                              )}
                            </div>
                          )}

                          {!expandedItems[item.id] && (
                            <motion.span 
                              className="text-xs text-purple-400 cursor-pointer"
                              whileHover={{ scale: 1.05 }}
                            >
                              Show details
                            </motion.span>
                          )}
                          {expandedItems[item.id] && (
                            <motion.span 
                              className="text-xs text-purple-400 cursor-pointer"
                              whileHover={{ scale: 1.05 }}
                            >
                              Hide details
                            </motion.span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}

            {/* Empty state if no items match filter */}
            {filterRoadmapByCategory(currentYearData.flatMap(q => q.items)).length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-10 text-center md:ml-20"
              >
                <div className="text-gray-400 mb-2">No items found for this category in {activeYear}</div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory('all')}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm mt-2"
                >
                  Reset filter
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
} 