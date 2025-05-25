"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AnimatedButton } from '@/components/ui/animated-button';
import { 
  X, Upload, FileText, Terminal, Book, Database, LayoutGrid, 
  Server, Brain, AlertTriangle, HelpCircle, Plus, Trash2, Loader,
  Code, Github, GitBranch, Gift, Bookmark, FileCode, Share2, 
  Globe, Lock, Zap, Heart, Award, Coffee, DollarSign
} from 'lucide-react';

interface UploadModalProps {
  onClose: () => void;
}

// Define the types of models that can be uploaded
const MODEL_TYPES = [
  { id: 'text-generation', name: 'Text Generation', icon: <Terminal className="h-5 w-5" /> },
  { id: 'image-generation', name: 'Image Generation', icon: <LayoutGrid className="h-5 w-5" /> },
  { id: 'audio-generation', name: 'Audio Processing', icon: <FileText className="h-5 w-5" /> },
  { id: 'multimodal', name: 'Multimodal', icon: <Brain className="h-5 w-5" /> },
  { id: 'embedding', name: 'Embedding', icon: <Database className="h-5 w-5" /> },
  { id: 'computer-vision', name: 'Computer Vision', icon: <LayoutGrid className="h-5 w-5" /> },
  { id: 'reinforcement-learning', name: 'Reinforcement Learning', icon: <GitBranch className="h-5 w-5" /> },
  { id: 'fine-tuned', name: 'Fine-tuned', icon: <Zap className="h-5 w-5" /> },
  { id: 'other', name: 'Other', icon: <HelpCircle className="h-5 w-5" /> }
];

// Define contribution types for open source models
const CONTRIBUTION_TYPES = [
  { id: 'individual', name: 'Individual Project', icon: <Heart className="h-5 w-5 text-pink-400" /> },
  { id: 'academic', name: 'Academic Research', icon: <Book className="h-5 w-5 text-blue-400" /> },
  { id: 'community', name: 'Community Project', icon: <Share2 className="h-5 w-5 text-green-400" /> },
  { id: 'corporate', name: 'Corporate Open Source', icon: <Award className="h-5 w-5 text-amber-400" /> },
  { id: 'hackathon', name: 'Hackathon Project', icon: <Zap className="h-5 w-5 text-purple-400" /> }
];

// Define chunk size for large file uploads (5MB)
const CHUNK_SIZE = 5 * 1024 * 1024;

export default function UploadModal({ onClose }: UploadModalProps) {
  // Gen-Z style variable names
  const [modelName, setModelName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [modelFiles, setModelFiles] = useState<File[]>([]);
  const [readmeFile, setReadmeFile] = useState<File | null>(null);
  const [datasetFiles, setDatasetFiles] = useState<File[]>([]);
  const [codeExamples, setCodeExamples] = useState<{language: string, code: string}[]>([
    { language: 'python', code: '# Example code to use this model\nimport ...' }
  ]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [modelType, setModelType] = useState<string>('text-generation');
  const [testingEnabled, setTestingEnabled] = useState(false);
  const [demoEnabled, setDemoEnabled] = useState(false);
  const [selectedLargeModel, setSelectedLargeModel] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [licenseType, setLicenseType] = useState<string>('mit');
  const [versionTag, setVersionTag] = useState<string>('1.0.0');
  const [contributionType, setContributionType] = useState<string>('');
  const [isOpenSource, setIsOpenSource] = useState(false);
  const [githubRepo, setGithubRepo] = useState<string>('');
  const [paperUrl, setPaperUrl] = useState<string>('');
  const [framework, setFramework] = useState<string>('');
  const [allowDonations, setAllowDonations] = useState(false);
  const [currentCodeEditIndex, setCurrentCodeEditIndex] = useState<number | null>(null);
  const [hardware, setHardware] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [totalProgress, setTotalProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
  const [resumableUploads, setResumableUploads] = useState<{[key: string]: {uploadId: string, chunks: number, uploaded: number}}>({});

  // Large model options for demo integration
  const largeModelOptions = [
    { id: 'gpt4', name: 'GPT-4 Turbo' },
    { id: 'claude3', name: 'Claude 3 Opus' },
    { id: 'gemini', name: 'Gemini Pro' },
    { id: 'llama3', name: 'Llama 3' },
    { id: 'mistral', name: 'Mistral Large' }
  ];

  // Frameworks options
  const frameworkOptions = [
    { id: 'pytorch', name: 'PyTorch' },
    { id: 'tensorflow', name: 'TensorFlow' },
    { id: 'keras', name: 'Keras' },
    { id: 'jax', name: 'JAX' },
    { id: 'onnx', name: 'ONNX' },
    { id: 'huggingface', name: 'Hugging Face Transformers' },
    { id: 'fastai', name: 'FastAI' },
    { id: 'other', name: 'Other' }
  ];

  // License options with more choices
  const licenseOptions = [
    { id: 'mit', name: 'MIT License' },
    { id: 'apache', name: 'Apache 2.0' },
    { id: 'gpl', name: 'GPL 3.0' },
    { id: 'cc-by', name: 'Creative Commons (CC BY)' },
    { id: 'cc-by-sa', name: 'Creative Commons (CC BY-SA)' },
    { id: 'cc-by-nc', name: 'Creative Commons (CC BY-NC)' },
    { id: 'cc-by-nc-sa', name: 'Creative Commons (CC BY-NC-SA)' },
    { id: 'proprietary', name: 'Proprietary' },
    { id: 'llama', name: 'Llama 2 Community License' },
    { id: 'openrail', name: 'OpenRAIL' }
  ];

  // Hardware requirements options
  const hardwareOptions = [
    { id: 'cpu', name: 'CPU Only' },
    { id: 'gpu-consumer', name: 'Consumer GPU (8-12GB VRAM)' },
    { id: 'gpu-mid', name: 'Mid-range GPU (16-24GB VRAM)' },
    { id: 'gpu-high', name: 'High-end GPU (32GB+ VRAM)' },
    { id: 'multi-gpu', name: 'Multiple GPUs' },
    { id: 'tpu', name: 'TPU' },
    { id: 'cloud', name: 'Cloud-optimized' }
  ];

  const handleModelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const newFiles = Array.from(e.target.files);
      setModelFiles([...modelFiles, ...newFiles]);
    }
  };

  const handleReadmeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setReadmeFile(e.target.files[0]);
    }
  };

  const handleDatasetFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const newFiles = Array.from(e.target.files);
      setDatasetFiles([...datasetFiles, ...newFiles]);
    }
  };

  const removeModelFile = (index: number) => {
    const updatedFiles = [...modelFiles];
    updatedFiles.splice(index, 1);
    setModelFiles(updatedFiles);
  };

  const removeDatasetFile = (index: number) => {
    const updatedFiles = [...datasetFiles];
    updatedFiles.splice(index, 1);
    setDatasetFiles(updatedFiles);
  };

  const handleCodeExampleChange = (index: number, field: 'language' | 'code', value: string) => {
    const newExamples = [...codeExamples];
    newExamples[index][field] = value;
    setCodeExamples(newExamples);
  };

  const addCodeExample = () => {
    setCodeExamples([...codeExamples, { language: 'javascript', code: '// Example code\n' }]);
  };

  const removeCodeExample = (index: number) => {
    const newExamples = [...codeExamples];
    newExamples.splice(index, 1);
    setCodeExamples(newExamples);
  };

  const handleSubmitStep1 = () => {
    if (!modelName) {
      setError("Yo, your model needs a name!");
      return;
    }
    if (!description) {
      setError("Gotta add a description, fam!");
      return;
    }
    if (isOpenSource && !githubRepo) {
      setError("Open source contributions need a GitHub repo link!");
      return;
    }
    if (isOpenSource && !contributionType) {
      setError("Please select what type of open source contribution this is!");
      return;
    }
    setError('');
    setCurrentStep(2);
  };

  const handleSubmitStep2 = () => {
    if (modelFiles.length === 0) {
      setError("Can't upload nothing, bestie! Select at least one model file!");
      return;
    }
    setError('');
    setCurrentStep(3);
  };

  // Function to handle chunked file upload
  const uploadFileInChunks = async (file: File, index: number) => {
    const fileName = file.name;
    const fileSize = file.size;
    const numChunks = Math.ceil(fileSize / CHUNK_SIZE);
    let uploadId = '';
    
    // Initialize progress tracking for this file
    setUploadProgress(prev => ({...prev, [fileName]: 0}));
    
    try {
      // Check if we have a resumable upload for this file
      if (resumableUploads[fileName]) {
        // Resume previous upload
        uploadId = resumableUploads[fileName].uploadId;
        const uploadedChunks = resumableUploads[fileName].uploaded;
        
        // Start from where we left off
        for (let i = uploadedChunks; i < numChunks; i++) {
          const start = i * CHUNK_SIZE;
          const end = Math.min(fileSize, start + CHUNK_SIZE);
          const chunk = file.slice(start, end);
          
          // Upload chunk
          const formData = new FormData();
          formData.append('file', chunk);
          formData.append('uploadId', uploadId);
          formData.append('chunkIndex', i.toString());
          formData.append('totalChunks', numChunks.toString());
          
          const response = await fetch('/api/upload/chunk', {
            method: 'POST',
            body: formData,
          });
          
          if (!response.ok) {
            throw new Error(`Failed to upload chunk ${i}`);
          }
          
          // Update progress
          const progress = Math.round(((i + 1) / numChunks) * 100);
          setUploadProgress(prev => ({...prev, [fileName]: progress}));
          
          // Update resumable upload info
          setResumableUploads(prev => ({
            ...prev, 
            [fileName]: {
              ...prev[fileName],
              uploaded: i + 1
            }
          }));
        }
      } else {
        // Start new upload
        // Initialize the upload
        const initResponse = await fetch('/api/upload/init', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileName,
            fileSize,
            fileType: file.type,
            totalChunks: numChunks,
          }),
        });
        
        if (!initResponse.ok) {
          throw new Error('Failed to initialize upload');
        }
        
        const initData = await initResponse.json();
        uploadId = initData.uploadId;
        
        // Store resumable upload info
        setResumableUploads(prev => ({
          ...prev, 
          [fileName]: {
            uploadId,
            chunks: numChunks,
            uploaded: 0
          }
        }));
        
        // Upload chunks
        for (let i = 0; i < numChunks; i++) {
          const start = i * CHUNK_SIZE;
          const end = Math.min(fileSize, start + CHUNK_SIZE);
          const chunk = file.slice(start, end);
          
          // Upload chunk
          const formData = new FormData();
          formData.append('file', chunk);
          formData.append('uploadId', uploadId);
          formData.append('chunkIndex', i.toString());
          formData.append('totalChunks', numChunks.toString());
          
          const response = await fetch('/api/upload/chunk', {
            method: 'POST',
            body: formData,
          });
          
          if (!response.ok) {
            throw new Error(`Failed to upload chunk ${i}`);
          }
          
          // Update progress
          const progress = Math.round(((i + 1) / numChunks) * 100);
          setUploadProgress(prev => ({...prev, [fileName]: progress}));
          
          // Update resumable upload info
          setResumableUploads(prev => ({
            ...prev, 
            [fileName]: {
              ...prev[fileName],
              uploaded: i + 1
            }
          }));
        }
      }
      
      // Complete the upload
      const completeResponse = await fetch('/api/upload/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uploadId,
          fileName,
        }),
      });
      
      if (!completeResponse.ok) {
        throw new Error('Failed to complete upload');
      }
      
      const completeData = await completeResponse.json();
      return completeData.fileUrl;
      
    } catch (error) {
      console.error(`Error uploading file ${fileName}:`, error);
      throw error;
    }
  };

  // Updated function to handle submission with chunked uploads
  const handleFinalSubmit = async () => {
    setIsUploading(true);
    setUploadStatus('uploading');
    
    try {
      // Upload model files
      const modelFileUrls = [];
      
      // Upload files in parallel with Promise.all
      for (let i = 0; i < modelFiles.length; i++) {
        const fileUrl = await uploadFileInChunks(modelFiles[i], i);
        modelFileUrls.push(fileUrl);
      }
      
      // Upload readme file if provided
      let readmeUrl = '';
      if (readmeFile) {
        readmeUrl = await uploadFileInChunks(readmeFile, 0);
      }
      
      // Upload dataset files if provided
      const datasetFileUrls = [];
      for (let i = 0; i < datasetFiles.length; i++) {
        const fileUrl = await uploadFileInChunks(datasetFiles[i], i);
        datasetFileUrls.push(fileUrl);
      }
      
      // All files uploaded, now create the model in the database
      setUploadStatus('processing');
      
      const modelData = {
        name: modelName,
        description,
        type: modelType,
        tags: tags.split(',').map(tag => tag.trim()),
        files: modelFileUrls,
        readme: readmeUrl,
        datasets: datasetFileUrls,
        price: price ? parseFloat(price) : 0,
        isPrivate,
        licenseType,
        version: versionTag,
        isOpenSource,
        githubRepo: isOpenSource ? githubRepo : '',
        paperUrl,
        framework,
        allowDonations,
        hardware,
        codeExamples,
        testing: {
          enabled: testingEnabled,
          demoEnabled,
          largeModel: demoEnabled ? selectedLargeModel : ''
        }
      };
      
      const response = await fetch('/api/models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(modelData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create model: ${response.statusText}`);
      }
      
      const data = await response.json();
      setUploadStatus('success');
      
      // Clear the resumable uploads since we're done
      setResumableUploads({});
      
      // Redirect to model page after short delay
      setTimeout(() => {
        window.location.href = `/models/${data.id}`;
      }, 2000);
      
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setError(error.message || 'Something went wrong during upload');
    } finally {
      setIsUploading(false);
    }
  };

  // Calculate total progress across all files
  useEffect(() => {
    if (Object.keys(uploadProgress).length === 0) {
      setTotalProgress(0);
      return;
    }
    
    const totalProgressValue = Object.values(uploadProgress).reduce((sum, progress) => sum + progress, 0) / Object.keys(uploadProgress).length;
    setTotalProgress(Math.round(totalProgressValue));
  }, [uploadProgress]);

  return (
    <motion.div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 overflow-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-gradient-to-b from-gray-900 to-black border border-white/10 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with steps indicator */}
        <div className="relative p-6 border-b border-white/10">
          <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Upload Your AI Model
          </h2>
          
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close upload modal"
              title="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
          <div className="flex justify-between items-center mt-6">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div 
                  className={`rounded-full w-8 h-8 flex items-center justify-center ${
                    currentStep >= step 
                      ? 'bg-gradient-to-r from-purple-400 to-pink-500 text-white' 
                      : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {step}
                </div>
                <div 
                  className={`ml-2 text-sm ${currentStep >= step ? 'text-white' : 'text-gray-400'}`}
                >
                  {step === 1 ? 'Basic Info' : step === 2 ? 'Upload Files' : 'Options'}
                </div>
                {step < 3 && (
                  <div 
                    className={`h-1 w-10 mx-2 ${
                      currentStep > step ? 'bg-gradient-to-r from-purple-400 to-pink-500' : 'bg-gray-800'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-200 text-sm">{error}</span>
          </div>
        )}
        
        {/* Content based on current step */}
        <div className="p-6">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
          <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Model Name*</label>
                <input 
                  type="text" 
                  className="w-full p-3 bg-black/30 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="Enter a fire name for your model"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description*</label>
                <textarea 
                  className="w-full p-3 bg-black/30 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none"
                  rows={3}
                  placeholder="Spill the tea on what your model can do..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Model Type*</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {MODEL_TYPES.map((type) => (
                    <button
                      key={type.id}
                      className={`flex items-center p-3 rounded-lg border transition-colors ${
                        modelType === type.id 
                          ? 'border-purple-500 bg-purple-900/20' 
                          : 'border-white/10 bg-black/30 hover:border-purple-500/50'
                      }`}
                      onClick={() => setModelType(type.id)}
                    >
                      <div className="mr-2">{type.icon}</div>
                      <span className="text-sm">{type.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="is-open-source"
                  className="mr-2 w-4 h-4 accent-purple-500"
                  checked={isOpenSource}
                  onChange={() => setIsOpenSource(!isOpenSource)}
                />
                <label htmlFor="is-open-source" className="text-sm flex items-center">
                  <Github className="h-4 w-4 mr-1 text-gray-400" />
                  This is an open source contribution
                </label>
              </div>
              
              {isOpenSource && (
                <div className="p-4 bg-purple-900/10 border border-purple-500/30 rounded-lg mb-4">
                  <h3 className="text-sm font-medium mb-3">Contribution Details</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs mb-1">GitHub Repository URL</label>
                      <input 
                        type="text" 
                        className="w-full p-2 bg-black/30 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none"
                        placeholder="https://github.com/username/repo"
                        value={githubRepo}
                        onChange={(e) => setGithubRepo(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs mb-1">Research Paper URL (optional)</label>
                      <input 
                        type="text" 
                        className="w-full p-2 bg-black/30 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none"
                        placeholder="https://arxiv.org/abs/..."
                        value={paperUrl}
                        onChange={(e) => setPaperUrl(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="block text-xs mb-2">Contribution Type</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {CONTRIBUTION_TYPES.map((type) => (
                        <button
                          key={type.id}
                          className={`flex items-center p-2 text-xs rounded-lg border ${
                            contributionType === type.id
                              ? 'border-purple-500 bg-purple-900/20'
                              : 'border-white/10 bg-black/30 hover:border-purple-500/50'
                          }`}
                          onClick={() => setContributionType(type.id)}
                        >
                          <div className="mr-1">{type.icon}</div>
                          <span>{type.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="allow-donations"
                      className="mr-2 w-4 h-4 accent-purple-500"
                      checked={allowDonations}
                      onChange={() => setAllowDonations(!allowDonations)}
                    />
                    <label htmlFor="allow-donations" className="text-xs flex items-center">
                      <Coffee className="h-3 w-3 mr-1 text-amber-400" />
                      Enable donations for this open source project
                    </label>
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                <input 
                  type="text" 
                  className="w-full p-3 bg-black/30 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="e.g. rad, fire, lit, clutch"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Framework</label>
                  <select
                    className="w-full p-3 bg-black/30 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none"
                    value={framework}
                    onChange={(e) => setFramework(e.target.value)}
                    aria-label="Framework"
                  >
                    <option value="">Select Framework</option>
                    {frameworkOptions.map(option => (
                      <option key={option.id} value={option.id}>{option.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Hardware Requirements</label>
                  <select
                    className="w-full p-3 bg-black/30 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none"
                    value={hardware}
                    onChange={(e) => setHardware(e.target.value)}
                    aria-label="Hardware Requirements"
                  >
                    <option value="">Select Requirements</option>
                    {hardwareOptions.map(option => (
                      <option key={option.id} value={option.id}>{option.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                  <label className="block text-sm font-medium mb-2">
                    {isOpenSource ? (
                      <span className="flex items-center">
                        <Gift className="h-4 w-4 mr-1 text-green-400" />
                        Suggested Donation (USD)
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-green-400" />
                        Price (USD)
                      </span>
                    )}
                  </label>
                <input 
                  type="number" 
                    className="w-full p-3 bg-black/30 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none"
                    placeholder={isOpenSource ? "Suggested donation amount" : "0.00 or leave blank for free"}
                  min="0"
                  step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Version Tag</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-black/30 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none"
                    placeholder="e.g. 1.0.0"
                    value={versionTag}
                    onChange={(e) => setVersionTag(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is-private"
                    className="mr-2 w-4 h-4 accent-purple-500"
                    checked={isPrivate}
                    onChange={() => setIsPrivate(!isPrivate)}
                    disabled={isOpenSource}
                  />
                  <label htmlFor="is-private" className="text-sm flex items-center">
                    {isPrivate ? (
                      <Lock className="h-4 w-4 mr-1 text-amber-400" />
                    ) : (
                      <Globe className="h-4 w-4 mr-1 text-blue-400" />
                    )}
                    {isPrivate ? "Private model (invite only)" : "Public model (visible to all)"}
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">License Type</label>
                  <select
                    className="w-full p-3 bg-black/30 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none"
                    value={licenseType}
                    onChange={(e) => setLicenseType(e.target.value)}
                    aria-label="License Type"
                  >
                    {licenseOptions.map(option => (
                      <option key={option.id} value={option.id}>{option.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 2: Upload Files */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Model Files Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Model Files*</label>
                <div className="p-6 border border-dashed border-white/20 rounded-lg text-center">
              <div className="mb-4">
                    <Upload className="h-10 w-10 mx-auto text-purple-400 mb-2" />
                <h3 className="text-lg font-medium">Upload Model Files</h3>
                <p className="text-sm text-gray-400 mt-1">
                  Drag and drop your model files or click to browse
                </p>
              </div>
              
              <input
                type="file"
                    id="model-file-upload"
                className="hidden"
                    multiple
                    onChange={handleModelFileChange}
              />
              
                  <label htmlFor="model-file-upload">
                <AnimatedButton
                  variant="outline"
                  size="md"
                  className="mx-auto"
                >
                  <FileText className="mr-2 h-4 w-4" /> Select Files
                </AnimatedButton>
              </label>
              
                  {modelFiles.length > 0 && (
                    <div className="mt-4 text-sm border-t border-white/10 pt-4">
                      <h4 className="font-medium mb-2">Selected Files ({modelFiles.length})</h4>
                      <div className="max-h-40 overflow-y-auto">
                        {modelFiles.map((file, index) => (
                          <div key={index} className="flex justify-between items-center py-2 px-3 bg-black/20 rounded mb-2">
                            <span className="truncate max-w-[200px]">{file.name}</span>
                            <button 
                              onClick={() => removeModelFile(index)}
                              className="text-red-400 hover:text-red-300"
                              aria-label={`Remove file ${file.name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* README Upload (Optional) */}
              <div>
                <label className="block text-sm font-medium mb-2">README.md (Optional)</label>
                <div className="p-4 border border-dashed border-white/20 rounded-lg text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Book className="h-5 w-5 text-blue-400 mr-2" />
                    <h3 className="text-sm font-medium">Add Documentation</h3>
                  </div>
                  
                  <input
                    type="file"
                    id="readme-file-upload"
                    className="hidden"
                    accept=".md,.txt"
                    onChange={handleReadmeFileChange}
                  />
                  
                  <label htmlFor="readme-file-upload">
                    <AnimatedButton
                      variant="ghost"
                      size="sm"
                      className="mx-auto"
                    >
                      {readmeFile ? 'Change File' : 'Select File'}
                    </AnimatedButton>
                  </label>
                  
                  {readmeFile && (
                    <div className="mt-2 text-xs text-green-400">
                      {readmeFile.name} selected
                    </div>
                  )}
                </div>
              </div>
              
              {/* Dataset Files Upload */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Dataset Files (Optional)</label>
                  <span className="text-xs text-gray-400">For fine-tuning or evaluation</span>
                </div>
                <div className="p-4 border border-dashed border-white/20 rounded-lg text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Database className="h-5 w-5 text-purple-400 mr-2" />
                    <h3 className="text-sm font-medium">Add Datasets</h3>
                  </div>
                  
                  <input
                    type="file"
                    id="dataset-file-upload"
                    className="hidden"
                    multiple
                    onChange={handleDatasetFileChange}
                  />
                  
                  <label htmlFor="dataset-file-upload">
                    <AnimatedButton
                      variant="ghost"
                      size="sm"
                      className="mx-auto"
                    >
                      Select Files
                    </AnimatedButton>
                  </label>
                  
                  {datasetFiles.length > 0 && (
                    <div className="mt-2 text-sm">
                      <div className="max-h-24 overflow-y-auto">
                        {datasetFiles.map((file, index) => (
                          <div key={index} className="flex justify-between items-center py-1 px-2 bg-black/20 rounded mb-1 text-xs">
                            <span className="truncate max-w-[150px]">{file.name}</span>
                            <button 
                              onClick={() => removeDatasetFile(index)}
                              className="text-red-400 hover:text-red-300"
                              aria-label={`Remove dataset file ${file.name}`}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {datasetFiles.length > 0 && (
                <div className="mt-3 space-y-3">
                  <div>
                    <label className="block text-xs mb-1">Dataset Description</label>
                    <textarea 
                      className="w-full p-2 text-sm bg-black/30 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none" 
                      rows={2}
                      placeholder="Describe your dataset (format, size, features, etc.)"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Dataset Examples (optional)</label>
                    <textarea 
                      className="w-full p-2 text-sm bg-black/30 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none font-mono" 
                      rows={3}
                      placeholder="Example data entries (e.g. JSON format)"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="dataset-public"
                      className="mr-2 w-3 h-3 accent-purple-500"
                    />
                    <label htmlFor="dataset-public" className="text-xs">Make dataset publicly available</label>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Step 3: Advanced Options */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Enable Testing */}
              <div className="p-4 bg-black/30 border border-white/10 rounded-lg">
                <div className="flex items-start mb-3">
                  <input
                    type="checkbox"
                    id="enable-testing"
                    className="mr-3 w-4 h-4 mt-1 accent-purple-500"
                    checked={testingEnabled}
                    onChange={() => setTestingEnabled(!testingEnabled)}
                  />
                  <div>
                    <label htmlFor="enable-testing" className="font-medium">Enable Test Models</label>
                    <p className="text-xs text-gray-400 mt-1">
                      Allow users to test your model with limited parameters before purchasing
                    </p>
                  </div>
                </div>
                
                {testingEnabled && (
                  <div className="ml-7 mt-3 p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Testing Configuration</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs mb-1">Max test uses</label>
                        <input 
                          type="number" 
                          className="w-full p-2 text-sm bg-black/30 border border-white/10 rounded-lg" 
                          placeholder="e.g. 5"
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Test timeout (seconds)</label>
                        <input 
                          type="number" 
                          className="w-full p-2 text-sm bg-black/30 border border-white/10 rounded-lg" 
                          placeholder="e.g. 30"
                          min="10"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="block text-xs mb-1">Test scenarios</label>
                      <textarea
                        className="w-full p-2 text-sm bg-black/30 border border-white/10 rounded-lg"
                        rows={2}
                        placeholder="Describe testing scenarios (e.g. 'Text classification', 'Image generation with basic prompts')"
                      />
                    </div>
                    
                    <div className="flex items-center text-xs">
                      <input
                        type="checkbox"
                        id="test-feedback"
                        className="mr-2 w-3 h-3 accent-purple-500"
                      />
                      <label htmlFor="test-feedback">Collect feedback from testers</label>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Demo with Large Model */}
              <div className="p-4 bg-black/30 border border-white/10 rounded-lg">
                <div className="flex items-start mb-3">
                  <input
                    type="checkbox"
                    id="enable-demo"
                    className="mr-3 w-4 h-4 mt-1 accent-purple-500"
                    checked={demoEnabled}
                    onChange={() => setDemoEnabled(!demoEnabled)}
                  />
                  <div>
                    <label htmlFor="enable-demo" className="font-medium">Enable Demo with Large AI Model</label>
                    <p className="text-xs text-gray-400 mt-1">
                      Use a large foundation model to generate interactive demo examples
                    </p>
                  </div>
                </div>
                
                {demoEnabled && (
                  <div className="ml-7 mt-3 p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Select Large Model</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {largeModelOptions.map(model => (
                        <button
                          key={model.id}
                          className={`text-left p-2 rounded border text-sm ${
                            selectedLargeModel === model.id
                              ? 'bg-purple-900/40 border-purple-500'
                              : 'bg-black/20 border-white/10 hover:border-purple-500/50'
                          }`}
                          onClick={() => setSelectedLargeModel(model.id)}
                        >
                          <span className="font-medium">{model.name}</span>
                        </button>
                      ))}
                    </div>
                    
                    {selectedLargeModel && (
                      <div className="mt-3">
                        <label className="block text-xs mb-1">Demo prompt examples</label>
                        <textarea
                          className="w-full p-2 text-sm bg-black/30 border border-white/10 rounded-lg"
                          rows={3}
                          placeholder="Add examples of prompts that work well with your model..."
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Extra Options */}
              <div className="p-4 bg-black/30 border border-white/10 rounded-lg">
                <h4 className="text-sm font-medium mb-3">Additional Options</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured-request"
                      className="mr-2 w-4 h-4 accent-purple-500"
                    />
                    <label htmlFor="featured-request" className="text-sm">Request to be featured on homepage</label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="api-access"
                      className="mr-2 w-4 h-4 accent-purple-500"
                    />
                    <label htmlFor="api-access" className="text-sm">Enable API access for this model</label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="fine-tuning"
                      className="mr-2 w-4 h-4 accent-purple-500"
                    />
                    <label htmlFor="fine-tuning" className="text-sm">Allow others to fine-tune this model</label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="versioning"
                      className="mr-2 w-4 h-4 accent-purple-500"
                    />
                    <label htmlFor="versioning" className="text-sm">Enable version control</label>
                  </div>
                </div>
              </div>

              {/* Code Examples */}
              <div className="mt-6 p-4 bg-black/30 border border-white/10 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-medium flex items-center">
                    <FileCode className="h-4 w-4 mr-1 text-cyan-400" />
                    Code Examples
                  </h4>
                  <button
                    onClick={addCodeExample}
                    className="text-xs bg-black/30 hover:bg-black/50 border border-white/10 px-2 py-1 rounded flex items-center"
                    type="button"
                    aria-label="Add code example"
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add Example
                  </button>
                </div>
                
                <div className="space-y-4">
                  {codeExamples.map((example, index) => (
                    <div key={index} className="border border-gray-800 rounded overflow-hidden">
                      <div className="flex justify-between items-center bg-gray-900 px-3 py-2">
                        <div className="flex-1">
                          <select
                            className="bg-transparent border-none text-sm focus:outline-none"
                            value={example.language}
                            onChange={(e) => handleCodeExampleChange(index, 'language', e.target.value)}
                            aria-label={`Language for code example ${index + 1}`}
                          >
                            <option value="python">Python</option>
                            <option value="javascript">JavaScript</option>
                            <option value="typescript">TypeScript</option>
                            <option value="java">Java</option>
                            <option value="csharp">C#</option>
                            <option value="cpp">C++</option>
                            <option value="bash">Bash</option>
                            <option value="json">JSON</option>
                          </select>
                        </div>
                        <button
                          onClick={() => removeCodeExample(index)}
                          className="text-red-400 hover:text-red-300"
                          type="button"
                          aria-label={`Remove code example ${index + 1}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="p-2">
                        <textarea
                          value={example.code}
                          onChange={(e) => handleCodeExampleChange(index, 'code', e.target.value)}
                          className="w-full p-2 bg-black/30 border border-gray-800 rounded text-sm font-mono focus:outline-none focus:border-purple-500"
                          rows={5}
                          placeholder={`// Example code in ${example.language}`}
                          aria-label={`Code example ${index + 1} content`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
            
            {/* Action Buttons */}
          <div className="flex justify-between pt-6 border-t border-white/10 mt-6">
            {currentStep > 1 ? (
              <AnimatedButton
                variant="ghost"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Back
              </AnimatedButton>
            ) : (
              <div></div> // Empty div for spacing
            )}
            
            <div>
              {currentStep < 3 ? (
                <AnimatedButton
                  variant="primary"
                  onClick={currentStep === 1 ? handleSubmitStep1 : handleSubmitStep2}
                >
                  Continue
                </AnimatedButton>
              ) : (
              <AnimatedButton
                variant="primary"
                  isLoading={isUploading}
                  onClick={handleFinalSubmit}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <span className="flex items-center">
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </span>
                  ) : (
                    'Complete Upload'
                  )}
              </AnimatedButton>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 