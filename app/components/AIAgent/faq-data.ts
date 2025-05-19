interface FAQ {
  question: string;
  answer: string;
  category: string;
}

export const faq: FAQ[] = [
  {
    question: "What is Neural Nexus?",
    answer: "Neural Nexus is a platform for creating, testing, deploying, and monetizing AI models. We provide tools for both developers and non-technical users to leverage artificial intelligence in their projects.",
    category: "General"
  },
  {
    question: "How do I sign up for Neural Nexus?",
    answer: "You can sign up by clicking the 'Sign Up' button in the navigation bar. We offer account creation using email and password, or you can sign up with your Google or GitHub account for quicker access.",
    category: "Account"
  },
  {
    question: "Is Neural Nexus free to use?",
    answer: "We offer a free tier that allows you to explore most features with usage limits. Premium plans start at $19/month with increased usage limits and additional features. Enterprise plans with custom pricing are available for large organizations.",
    category: "Pricing"
  },
  {
    question: "What types of AI models are supported?",
    answer: "Neural Nexus supports a wide range of AI models including but not limited to: language models, computer vision models, audio processing models, and multi-modal models. You can upload pre-trained models or train new ones on our platform.",
    category: "Technology"
  },
  {
    question: "How do I upload my own model?",
    answer: "Navigate to the Dashboard, select 'My Models', and click 'Upload New Model'. You'll need to provide model files, metadata, and optionally documentation. We support most common model formats including PyTorch, TensorFlow, ONNX, and more.",
    category: "Usage"
  },
  {
    question: "Can I monetize my AI models?",
    answer: "Yes! Neural Nexus Marketplace allows you to list your models for others to use, either for free or for a fee. You can set pricing, usage terms, and receive payments through our platform. We handle the infrastructure, you focus on creating valuable models.",
    category: "Marketplace"
  },
  {
    question: "What's the Neural Nexus Playground?",
    answer: "The Playground is our interactive development environment where you can write code, test AI models, and experiment with different features. It includes a code editor, terminal, file explorer, and real-time preview of your work.",
    category: "Features"
  },
  {
    question: "How secure is my data on Neural Nexus?",
    answer: "Security is our top priority. We use industry-standard encryption for data at rest and in transit. Your models and data are isolated, and we offer various privacy controls. We're compliant with major regulations including GDPR and CCPA.",
    category: "Security"
  },
  {
    question: "Do you offer an API?",
    answer: "Yes, we provide a comprehensive REST API that allows you to integrate Neural Nexus functionality into your applications. API documentation is available in your dashboard, along with SDKs for popular programming languages.",
    category: "Development"
  },
  {
    question: "How do I connect my GitHub repository?",
    answer: "In your dashboard, go to 'Integrations' and select GitHub. You'll be prompted to authorize Neural Nexus to access your repositories. Once connected, you can sync code between GitHub and our platform for seamless development.",
    category: "Integrations"
  },
  {
    question: "Can I deploy my models to production?",
    answer: "Absolutely! Neural Nexus offers one-click deployment options. Your models can be deployed as APIs, containerized services, or edge deployments depending on your needs. We handle scaling, monitoring, and reliability for you.",
    category: "Deployment"
  },
  {
    question: "What programming languages are supported?",
    answer: "Our platform primarily supports Python for AI development, but the Playground IDE supports multiple languages including JavaScript, TypeScript, HTML/CSS, Java, and more for building applications that use AI models.",
    category: "Development"
  },
  {
    question: "How do I get support?",
    answer: "We offer multiple support channels: documentation, community forums, email support, and live chat. Premium plans include priority support with faster response times. You can access support from your dashboard or by emailing support@neuralnexus.ai.",
    category: "Support"
  },
  {
    question: "Is there a limit to how many models I can create?",
    answer: "Free accounts can create up to 5 models with limited compute resources. Premium accounts can create up to 20 models with more compute resources. Enterprise accounts have customizable limits based on your needs.",
    category: "Limits"
  },
  {
    question: "Can I collaborate with others on my projects?",
    answer: "Yes! Neural Nexus supports team collaboration. You can invite team members, assign roles and permissions, and work together on models and applications. Premium plans include more collaboration features and team member slots.",
    category: "Collaboration"
  },
  {
    question: "How do I train a model on my own data?",
    answer: "Upload your dataset in the Dashboard under 'Datasets', then create a new model or select an existing one to fine-tune. Our platform provides tools to prepare, clean, and augment your data, and guides you through the training process.",
    category: "Training"
  },
  {
    question: "What compute resources are available for training?",
    answer: "We offer various compute options including CPU, GPU, and TPU resources. Free accounts have access to limited compute. Premium accounts get priority access to more powerful resources. You can also connect your own cloud compute if needed.",
    category: "Resources"
  },
  {
    question: "Do you support real-time inference?",
    answer: "Yes, our platform supports real-time inference through API endpoints and WebSocket connections. You can integrate real-time AI capabilities into your applications with low-latency responses optimized for production use.",
    category: "Features"
  },
  {
    question: "What are Neural Tokens and how do they work?",
    answer: "Neural Tokens are our platform's credit system for AI compute resources. Each account gets a monthly allocation based on plan tier. Tokens are consumed when you train models, run inferences, or use platform features. Additional tokens can be purchased as needed.",
    category: "Billing"
  },
  {
    question: "Can I export my models to use elsewhere?",
    answer: "Yes, you can export models in standard formats like ONNX, PyTorch, TensorFlow, or as containerized services. However, certain platform-specific optimizations may not transfer to other environments.",
    category: "Portability"
  }
]; 