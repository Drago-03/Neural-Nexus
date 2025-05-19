"use client";

// The dynamic export configuration at the top ensures this page is only rendered client-side
export const dynamic = "force-dynamic";
export const runtime = "experimental-edge";
export const dynamicParams = true;

// Auto-select region
export const preferredRegion = "auto";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AuthLayout from '@/src/components/auth/AuthLayout';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { Mail, Lock, Github, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useSupabase } from '@/providers/SupabaseProvider';
import { useRouter } from 'next/navigation';
import nextDynamic from 'next/dynamic';
import SignInForm from "@/src/components/auth/SignInForm";

// Dynamically import toast to avoid 'document is not defined' during SSR
const ToastProvider = nextDynamic(
  () => import('react-hot-toast').then((mod) => ({ default: () => null, toast: mod.toast })),
  { ssr: false }
);

export default function SignInPage() {
  // Render flag to ensure we're only rendering on the client
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only render the actual content on the client side
  if (!isClient) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <AuthLayout
      mode="signin"
      title="Welcome Back"
      subtitle="Sign in to your account to access your workspace."
      showBrainAnimation={false}
    >
      <SignInForm />
    </AuthLayout>
  );
} 