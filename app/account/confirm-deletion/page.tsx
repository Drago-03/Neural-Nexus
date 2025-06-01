"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertTriangle, Check, Clock, Download, FileArchive, FileText, Key, Loader2, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function ConfirmDeletionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const token = searchParams.get('token');
  const userId = searchParams.get('userId');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [deletionTime, setDeletionTime] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  
  // Processing states for different export options
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isExportingApiKeys, setIsExportingApiKeys] = useState(false);
  const [isExportingData, setIsExportingData] = useState(false);
  
  // Track completion for each export option
  const [reportGenerated, setReportGenerated] = useState(false);
  const [apiKeysExported, setApiKeysExported] = useState(false);
  const [dataExported, setDataExported] = useState(false);
  
  // Handle confirming account deletion
  const confirmDeletion = async () => {
    if (!token || !userId) {
      setStatus('error');
      setErrorMessage('Missing token or user ID');
      return;
    }
    
    try {
      // Call the API to confirm deletion
      const response = await fetch(`/api/user/delete-account?token=${token}&userId=${userId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to confirm account deletion');
      }
      
      const data = await response.json();
      
      // Set success status
      setStatus('success');
      
      // Calculate deletion time (24 hours from now)
      const deletionDate = new Date();
      deletionDate.setHours(deletionDate.getHours() + 24);
      setDeletionTime(deletionDate);
      
      // Update countdown immediately
      updateCountdown(deletionDate);
      
      // Start countdown timer
      const interval = setInterval(() => {
        updateCountdown(deletionDate);
      }, 1000);
      
      // Clean up interval on unmount
      return () => clearInterval(interval);
      
    } catch (error: any) {
      console.error('Error confirming deletion:', error);
      setStatus('error');
      setErrorMessage(error.message || 'An error occurred while confirming account deletion');
    }
  };
  
  // Handle canceling account deletion
  const cancelDeletion = async () => {
    try {
      // Show loading toast
      toast.loading('Canceling account deletion...');
      
      // Call API to cancel deletion (this would be implemented in a real app)
      // For demo purposes, we'll just redirect to the dashboard
      router.push('/dashboard');
      
      // Show success toast
      toast.success('Account deletion canceled successfully');
      
    } catch (error: any) {
      console.error('Error canceling deletion:', error);
      toast.error(error.message || 'An error occurred while canceling account deletion');
    }
  };
  
  // Update countdown timer
  const updateCountdown = (targetDate: Date) => {
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();
    
    if (difference <= 0) {
      setTimeRemaining('Account deleted');
      return;
    }
    
    // Calculate hours, minutes, seconds
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    // Format time remaining
    setTimeRemaining(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
  };
  
  // Handle generating account report
  const handleGenerateReport = async () => {
    if (isGeneratingReport) return;
    
    try {
      setIsGeneratingReport(true);
      
      // Call API to generate report
      const response = await fetch('/api/user/generate-report');
      const data = await response.json();
      
      if (!data.success) throw new Error(data.error || 'Failed to generate report');
      
      // Simulate file download
      const blob = new Blob([JSON.stringify(data.data.reportData, null, 2)], {type: 'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.data.reportName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setReportGenerated(true);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report. Please try again.');
    } finally {
      setIsGeneratingReport(false);
    }
  };
  
  // Handle exporting API keys
  const handleExportApiKeys = async () => {
    if (isExportingApiKeys) return;
    
    try {
      setIsExportingApiKeys(true);
      
      // Call API to export API keys
      const response = await fetch('/api/user/export-api-keys');
      const data = await response.json();
      
      if (!data.success) throw new Error(data.error || 'Failed to export API keys');
      
      // Simulate file download
      const blob = new Blob([JSON.stringify(data.data.exportData, null, 2)], {type: 'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.data.exportName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setApiKeysExported(true);
    } catch (error) {
      console.error('Error exporting API keys:', error);
      toast.error('Failed to export API keys. Please try again.');
    } finally {
      setIsExportingApiKeys(false);
    }
  };
  
  // Handle exporting user data
  const handleExportData = async () => {
    if (isExportingData) return;
    
    try {
      setIsExportingData(true);
      
      // Call API to export user data
      const response = await fetch('/api/user/export-data');
      const data = await response.json();
      
      if (!data.success) throw new Error(data.error || 'Failed to export data');
      
      // Simulate file download
      const blob = new Blob([JSON.stringify(data.data, null, 2)], {type: 'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setDataExported(true);
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export user data. Please try again.');
    } finally {
      setIsExportingData(false);
    }
  };
  
  // Confirm deletion on mount
  useEffect(() => {
    if (token && userId) {
      confirmDeletion();
    } else {
      setStatus('error');
      setErrorMessage('Missing token or user ID');
    }
  }, [token, userId]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <h1 className="text-xl font-bold">Account Deletion</h1>
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
              Back to Dashboard
            </Link>
          </div>
          
          <div className="p-6">
            {status === 'loading' && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 mb-4 flex items-center justify-center">
                  <Loader2 className="h-10 w-10 text-purple-500 animate-spin" />
                </div>
                <p className="text-gray-400">Confirming your account deletion request...</p>
              </div>
            )}
            
            {status === 'error' && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 mb-4 flex items-center justify-center bg-red-900/20 rounded-full">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
                <h2 className="text-lg font-medium mb-2">Error Confirming Deletion</h2>
                <p className="text-gray-400 text-center max-w-md mb-6">{errorMessage || 'An error occurred while confirming your account deletion request.'}</p>
                <Link 
                  href="/dashboard" 
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-white font-medium"
                >
                  Return to Dashboard
                </Link>
              </div>
            )}
            
            {status === 'success' && (
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="w-16 h-16 mb-4 flex items-center justify-center bg-green-900/20 rounded-full">
                    <Check className="h-8 w-8 text-green-500" />
                  </div>
                  <h2 className="text-lg font-medium mb-2">Account Deletion Confirmed</h2>
                  <p className="text-gray-400 text-center max-w-md">
                    Your account will be permanently deleted in 24 hours. You can cancel the deletion process by logging in during this time.
                  </p>
                </div>
                
                {/* Countdown Timer */}
                <div className="bg-gray-800/50 rounded-lg p-4 flex items-center gap-4 border border-amber-700/30">
                  <Clock className="h-8 w-8 text-amber-500" />
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">Time Remaining Until Deletion</h3>
                    <div className="text-2xl font-mono text-amber-400">{timeRemaining}</div>
                  </div>
                  <button
                    onClick={cancelDeletion}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white"
                  >
                    Cancel Deletion
                  </button>
                </div>
                
                {/* Data Export Options */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Export Your Data Before Deletion</h3>
                  <p className="text-gray-400 mb-4">
                    Make sure to download any data you wish to keep before your account is deleted.
                  </p>
                  
                  <div className="space-y-3">
                    <button
                      onClick={handleGenerateReport}
                      disabled={isGeneratingReport}
                      className={`w-full p-4 rounded-lg border transition-colors flex items-center justify-between ${
                        reportGenerated 
                          ? 'bg-green-900/20 border-green-700/30' 
                          : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg mr-3 ${reportGenerated ? 'bg-green-900/30' : 'bg-gray-700/50'}`}>
                          <FileText className={`h-5 w-5 ${reportGenerated ? 'text-green-400' : 'text-gray-400'}`} />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">Generate Account Report</p>
                          <p className="text-xs text-gray-400">Summary of your account activity and usage</p>
                        </div>
                      </div>
                      {isGeneratingReport ? (
                        <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                      ) : reportGenerated ? (
                        <Check className="h-5 w-5 text-green-400" />
                      ) : (
                        <Download className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    
                    <button
                      onClick={handleExportApiKeys}
                      disabled={isExportingApiKeys}
                      className={`w-full p-4 rounded-lg border transition-colors flex items-center justify-between ${
                        apiKeysExported 
                          ? 'bg-green-900/20 border-green-700/30' 
                          : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg mr-3 ${apiKeysExported ? 'bg-green-900/30' : 'bg-gray-700/50'}`}>
                          <Key className={`h-5 w-5 ${apiKeysExported ? 'text-green-400' : 'text-gray-400'}`} />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">Export API Keys</p>
                          <p className="text-xs text-gray-400">Secure backup of your API keys</p>
                        </div>
                      </div>
                      {isExportingApiKeys ? (
                        <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                      ) : apiKeysExported ? (
                        <Check className="h-5 w-5 text-green-400" />
                      ) : (
                        <Download className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    
                    <button
                      onClick={handleExportData}
                      disabled={isExportingData}
                      className={`w-full p-4 rounded-lg border transition-colors flex items-center justify-between ${
                        dataExported 
                          ? 'bg-green-900/20 border-green-700/30' 
                          : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg mr-3 ${dataExported ? 'bg-green-900/30' : 'bg-gray-700/50'}`}>
                          <FileArchive className={`h-5 w-5 ${dataExported ? 'text-green-400' : 'text-gray-400'}`} />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">Export Account Data</p>
                          <p className="text-xs text-gray-400">Complete backup of your account data</p>
                        </div>
                      </div>
                      {isExportingData ? (
                        <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                      ) : dataExported ? (
                        <Check className="h-5 w-5 text-green-400" />
                      ) : (
                        <Download className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Help Info */}
                <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 mt-6">
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold block">Need help?</span>
                    If you're having second thoughts or need assistance, contact our support team at <a href="mailto:support@neuralnexus.ai" className="text-purple-400 hover:underline">support@neuralnexus.ai</a>
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 