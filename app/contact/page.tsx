"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  MessageSquare, 
  Phone, 
  MapPin, 
  Send, 
  Github, 
  Linkedin, 
  Instagram,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ContactPage = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    reason: "general"
  });
  
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage("Please fill out all required fields");
      setFormStatus("error");
      return;
    }
    
    setFormStatus("submitting");
    
    // Simulate API call
    try {
      // In a real app, replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success
      setFormStatus("success");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        reason: "general"
      });
      setErrorMessage("");
    } catch (error) {
      // Error
      setFormStatus("error");
      setErrorMessage("Something went wrong. Please try again later.");
    }
  };
  
  const contactReasons = [
    { value: "general", label: "General Inquiry" },
    { value: "support", label: "Technical Support" },
    { value: "sales", label: "Sales & Pricing" },
    { value: "partnership", label: "Partnership Opportunities" },
    { value: "careers", label: "Careers & Jobs" }
  ];
  
  const socialLinks = [
    { icon: <Github className="w-6 h-6" />, name: "GitHub", url: "https://github.com/Drago-03/Neural-Nexus", color: "hover:text-white" },
    { icon: <Linkedin className="w-6 h-6" />, name: "LinkedIn", url: "https://www.linkedin.com/in/mantej-singh-arora/", color: "hover:text-blue-600" },
    { icon: <Instagram className="w-6 h-6" />, name: "Instagram", url: "https://instagram.com/aimodelhub", color: "hover:text-pink-600" }
  ];
  
  const contactInfo = [
    { 
      icon: <Mail className="w-6 h-6 text-blue-400" />, 
      title: "Email Us", 
      details: "mantejarora@gmail.com", 
      action: "Email now", 
      link: "mailto:mantejarora@gmail.com" 
    },
    { 
      icon: <Phone className="w-6 h-6 text-green-400" />, 
      title: "Call Us", 
      details: "+91-9805763104", 
      action: "Call now", 
      link: "tel:+919805763104" 
    },
    { 
      icon: <MapPin className="w-6 h-6 text-red-400" />, 
      title: "Visit Us", 
      details: "Indie Hub office, Chandigarh, India", 
      action: "Get directions", 
      link: "https://maps.google.com" 
    },
    { 
      icon: <Clock className="w-6 h-6 text-amber-400" />, 
      title: "Business Hours", 
      details: "Monday-Friday: 9AM-6PM PST", 
      action: "Check hours", 
      link: "/about#hours" 
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-20">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-300 mb-4 max-w-2xl mx-auto">
            Questions? Feedback? Partnership ideas? We're all ears!
          </p>
          <div className="flex justify-center space-x-4 mt-6">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 bg-gray-800 rounded-full transition-all ${social.color} hover:scale-110`}
                whileHover={{ y: -5 }}
                aria-label={`Follow us on ${social.name}`}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-800/40 backdrop-blur-sm p-8 rounded-2xl border border-gray-700"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <MessageSquare className="w-6 h-6 mr-2 text-purple-400" />
              Drop Us a Message
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Enter your name"
                  required
                  aria-label="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Your Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                  aria-label="Your email address"
                />
              </div>
              
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-300 mb-1">
                  Reason for Contact
                </label>
                <select
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  aria-label="Reason for contact"
                >
                  {contactReasons.map((reason) => (
                    <option key={reason.value} value={reason.value}>
                      {reason.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="What's this about?"
                  aria-label="Subject of your message"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                  Your Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="How can we help you?"
                  required
                  aria-label="Your message"
                ></textarea>
              </div>
              
              {formStatus === "error" && (
                <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg flex items-center text-red-200">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span>{errorMessage}</span>
                </div>
              )}
              
              {formStatus === "success" && (
                <div className="p-3 bg-green-900/50 border border-green-700 rounded-lg flex items-center text-green-200">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span>Your message has been sent successfully! We'll get back to you soon.</span>
                </div>
              )}
              
              <button
                type="submit"
                disabled={formStatus === "submitting"}
                className={`w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center transition-all ${
                  formStatus === "submitting"
                    ? "bg-purple-700/50 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                {formStatus === "submitting" ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>
          
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <div 
                  key={index}
                  className="bg-gray-800/40 backdrop-blur-sm p-5 rounded-xl border border-gray-700 hover:border-gray-500 transition-all"
                >
                  <div className="flex items-start">
                    <div className="mr-4">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">{info.title}</h3>
                      <p className="text-gray-300 mb-3">{info.details}</p>
                      <Link 
                        href={info.link} 
                        className="text-sm text-purple-400 hover:text-purple-300 flex items-center"
                      >
                        {info.action}
                        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-6 rounded-xl border border-purple-900/50 mt-8">
              <h3 className="text-xl font-bold mb-3">Looking for premium support?</h3>
              <p className="text-gray-300 mb-4">
                Our Pro and Enterprise plans include priority support with faster response times and dedicated account managers.
              </p>
              <Link 
                href="/pricing" 
                className="inline-block px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-all"
              >
                View Support Plans
              </Link>
            </div>
            
            <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-gray-700 mt-8">
              <h3 className="text-xl font-bold mb-3">Frequently Asked Questions</h3>
              <ul className="space-y-4">
                <li>
                  <h4 className="font-medium mb-1">How fast can I expect a response?</h4>
                  <p className="text-gray-400 text-sm">We typically respond within 24-48 hours on business days.</p>
                </li>
                <li>
                  <h4 className="font-medium mb-1">Do you offer technical support?</h4>
                  <p className="text-gray-400 text-sm">Yes, our team provides support based on your subscription plan level.</p>
                </li>
                <li>
                  <h4 className="font-medium mb-1">Can I schedule a demo?</h4>
                  <p className="text-gray-400 text-sm">Absolutely! Select "Sales & Pricing" as your contact reason, and we'll arrange a demo.</p>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
        
        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-16 rounded-xl overflow-hidden border border-gray-700 h-[400px] relative"
        >
          {/* This would be replaced with an actual map component in a real implementation */}
          <div className="absolute inset-0 bg-gray-800/80 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Our Headquarters</h3>
              <p className="text-gray-300">Indie Hub office, Chandigarh, India</p>
              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-4 inline-block px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-all"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage; 