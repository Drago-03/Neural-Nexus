"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Brand from './Brand';
import { Github, Linkedin, Mail } from 'lucide-react';
import Image from 'next/image';

const Footer = () => {
  const footerLinks = {
    product: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Documentation', href: '/docs' },
      { label: 'API Reference', href: '/api-docs' },
      { label: 'Model Hosting', href: '/hosting' },
      { label: 'Research', href: '/research' },
      { label: 'Open Source', href: '/open-source' }
    ],
    community: [
      { label: 'Showcase', href: '/showcase' },
      { label: 'Blog', href: '/blog' },
      { label: 'Tutorials', href: '/tutorials' },
      { label: 'Discord', href: 'https://discord.gg/FrtydvAh', isExternal: true },
      { label: 'GitHub', href: 'https://github.com/Drago-03/Neural-Nexus', isExternal: true }
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' }
    ]
  };

  const socialLinks = [
    { icon: <Github className="w-5 h-5" />, href: 'https://github.com/Drago-03/Neural-Nexus', label: 'GitHub' },
    { 
      icon: (
        <div className="w-5 h-5 relative">
          <Image src="/images/discord.png" alt="Discord" width={20} height={20} className="object-contain" />
        </div>
      ), 
      href: 'https://discord.gg/FrtydvAh', 
      label: 'Discord' 
    },
    { icon: <Linkedin className="w-5 h-5" />, href: 'https://www.linkedin.com/in/mantej-singh-arora/', label: 'LinkedIn' },
    { icon: <Mail className="w-5 h-5" />, href: 'mailto:mantejarora@gmail.com', label: 'Email' }
  ];

  return (
    <footer className="relative z-10 bg-gray-900/50 border-t border-gray-800 w-full">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand and Description */}
          <div className="lg:col-span-2">
            <Brand size="md" className="mb-4" />
            <p className="text-gray-400 mb-6 max-w-md">
              The ultimate platform for AI model sharing and deployment. 
              Join our community of creators and innovators shaping the future of AI.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  whileHover={{ y: -3 }}
                  aria-label={link.label}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              {footerLinks.community.map((link, index) => (
                <li key={index}>
                  {link.isExternal ? (
                    <a 
                      href={link.href} 
                      className="text-gray-400 hover:text-white transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Neural Nexus. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 