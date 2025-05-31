"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AnimatedButton } from '@/components/ui/animated-button';
import { 
  Upload, FileUp, ArrowLeft, Save, Eye, AlertCircle 
} from 'lucide-react';

export default function CreateModelPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    tags: '',
    file: null,
    image: null
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        [e.target.name]: file
      }));
      
      // Clear error when field is updated
      if (errors[e.target.name]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[e.target.name];
          return newErrors;
        });
      }
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Model name is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Model description is required";
    }
    
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }
    
    if (!formData.file) {
      newErrors.file = "Model file is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would upload the file and form data to your API
      console.log('Form data submitted:', formData);
      
      // Redirect to success page
      router.push('/dashboard/models?success=true');
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({
        form: "An error occurred while submitting your model. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />
      
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <div className="mb-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 md:p-8"
        >
          <h1 className="text-3xl font-bold mb-6">Create New Model</h1>
          
          {errors.form && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
              <p className="text-red-300">{errors.form}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2">Model Name*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 rounded-lg bg-gray-900/70 border ${
                  errors.name ? 'border-red-500/50' : 'border-gray-700/50'
                } focus:outline-none focus:border-purple-500/50`}
                placeholder="Enter your model name"
              />
              {errors.name && (
                <p className="mt-1 text-red-400 text-sm">{errors.name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Description*</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 rounded-lg bg-gray-900/70 border ${
                  errors.description ? 'border-red-500/50' : 'border-gray-700/50'
                } focus:outline-none focus:border-purple-500/50 min-h-[100px]`}
                placeholder="Describe your model's capabilities, use cases, and any special features"
              />
              {errors.description && (
                <p className="mt-1 text-red-400 text-sm">{errors.description}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2">Category*</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  aria-label="Model Category"
                  className={`w-full px-4 py-2 rounded-lg bg-gray-900/70 border ${
                    errors.category ? 'border-red-500/50' : 'border-gray-700/50'
                  } focus:outline-none focus:border-purple-500/50`}
                >
                  <option value="">Select a category</option>
                  <option value="computer-vision">Computer Vision</option>
                  <option value="nlp">Natural Language Processing</option>
                  <option value="audio">Audio Processing</option>
                  <option value="generative">Generative AI</option>
                  <option value="reinforcement-learning">Reinforcement Learning</option>
                  <option value="other">Other</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-red-400 text-sm">{errors.category}</p>
                )}
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-900/70 border border-gray-700/50 focus:outline-none focus:border-purple-500/50"
                  placeholder="0.00 (free)"
                />
                <p className="mt-1 text-gray-500 text-sm">Leave empty for free models</p>
              </div>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Tags</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-900/70 border border-gray-700/50 focus:outline-none focus:border-purple-500/50"
                placeholder="ai, machine-learning, computer-vision (comma separated)"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Model File*</label>
              <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                errors.file ? 'border-red-500/50' : 'border-gray-700/50'
              }`}>
                <div className="flex flex-col items-center">
                  <FileUp className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-300 mb-2">
                    {formData.file 
                      ? `Selected: ${(formData.file as File).name}` 
                      : 'Drag and drop your model file, or click to select'}
                  </p>
                  <p className="text-gray-500 text-sm">Supported formats: .h5, .pkl, .pt, .onnx, .zip</p>
                  <input
                    type="file"
                    name="file"
                    id="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".h5,.pkl,.pt,.onnx,.zip"
                  />
                  <label
                    htmlFor="file"
                    className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer transition-colors"
                  >
                    Select File
                  </label>
                </div>
              </div>
              {errors.file && (
                <p className="mt-1 text-red-400 text-sm">{errors.file}</p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Preview Image</label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center border-gray-700/50">
                <div className="flex flex-col items-center">
                  {formData.image ? (
                    <div className="mb-4">
                      <img 
                        src={URL.createObjectURL(formData.image as File)} 
                        alt="Preview" 
                        className="max-h-40 rounded-lg"
                      />
                    </div>
                  ) : (
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  )}
                  <p className="text-gray-300 mb-2">
                    {formData.image 
                      ? `Selected: ${(formData.image as File).name}` 
                      : 'Add a preview image for your model (optional)'}
                  </p>
                  <input
                    type="file"
                    name="image"
                    id="image"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  <label
                    htmlFor="image"
                    className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer transition-colors"
                  >
                    {formData.image ? 'Change Image' : 'Select Image'}
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              <AnimatedButton
                variant="outline"
                type="button"
                onClick={() => router.push('/sell-your-model')}
              >
                Cancel
              </AnimatedButton>
              
              <div className="flex gap-3">
                <AnimatedButton
                  variant="secondary"
                  type="button"
                  onClick={() => console.log('Preview')}
                >
                  <span className="flex items-center">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </span>
                </AnimatedButton>
                
                <AnimatedButton
                  variant="primary"
                  type="submit"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  <span className="flex items-center">
                    <Save className="mr-2 h-4 w-4" />
                    {isSubmitting ? 'Submitting...' : 'Submit Model'}
                  </span>
                </AnimatedButton>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
} 