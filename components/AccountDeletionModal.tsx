"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Download, FileText, Key, FileArchive, X, Check, Loader2, Lock, Mail, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface AccountDeletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => Promise<void>;
  userData: {
    email?: string;
    username?: string;
  };
}

const AccountDeletionModal: React.FC<AccountDeletionModalProps> = ({
  isOpen,
  onClose,
  onConfirmDelete,
  userData
}) => {
  // Modal steps: warning -> export -> confirmation -> email_sent
  const [step, setStep] = useState<'warning' | 'export' | 'confirmation' | 'email_sent'>('warning');
  const [confirmText, setConfirmText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Processing states for different export options
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isExportingApiKeys, setIsExportingApiKeys] = useState(false);
  const [isExportingData, setIsExportingData] = useState(false);
  
  // Track completion for each export option
  const [reportGenerated, setReportGenerated] = useState(false);
  const [apiKeysExported, setApiKeysExported] = useState(false);
  const [dataExported, setDataExported] = useState(false);
  
  // Input ref for focus management
  const confirmInputRef = useRef<HTMLInputElement>(null);
  
  // Reset modal state when closed
  const handleClose = () => {
    setStep('warning');
    setConfirmText('');
    setIsProcessing(false);
    setReportGenerated(false);
    setApiKeysExported(false);
    setDataExported(false);
    onClose();
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
      a.download = `user-data-${userData?.username || 'export'}-${new Date().toISOString().split('T')[0]}.json`;
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
  
  // Handle proceeding to confirmation step
  const handleProceedToConfirmation = () => {
    setStep('confirmation');
    // Focus the confirmation input when it becomes visible
    setTimeout(() => {
      if (confirmInputRef.current) {
        confirmInputRef.current.focus();
      }
    }, 100);
  };
  
  // Handle final delete confirmation - now sends an email instead of immediately deleting
  const handleConfirmDelete = async () => {
    if (isProcessing) return;
    if (confirmText !== "sudo delete my account") return;
    
    try {
      setIsProcessing(true);
      
      // Call the API to initiate account deletion
      const response = await fetch('/api/user/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to initiate account deletion');
      }
      
      const data = await response.json();
      
      // Show the email sent confirmation
      setStep('email_sent');
      
    } catch (error) {
      console.error('Error initiating account deletion:', error);
      toast.error('Failed to initiate account deletion. Please try again.');
      setIsProcessing(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative bg-gray-900 border border-gray-800 rounded-xl shadow-2xl shadow-purple-900/20 overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
            
            {/* Warning Step */}
            {step === 'warning' && (
              <div className="p-6">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-900/30 rounded-full border border-red-500/30">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
                
                <h2 className="text-xl font-bold text-center mb-2">Delete Account</h2>
                <p className="text-gray-400 text-center mb-6">
                  This action cannot be undone. All your data will be permanently deleted.
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <p className="text-sm text-gray-300">
                      <span className="font-semibold block">Before you delete:</span>
                      Consider exporting your data first. You'll lose access to your models, API keys, and other content.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={handleClose}
                    className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setStep('export')}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-white font-medium"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
            
            {/* Export Step */}
            {step === 'export' && (
              <div className="p-6">
                <h2 className="text-xl font-bold text-center mb-2">Export Your Data</h2>
                <p className="text-gray-400 text-center mb-6">
                  Export your data before deleting your account
                </p>
                
                <div className="space-y-4 mb-6">
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
                
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={() => setStep('warning')}
                    className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-gray-300"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleProceedToConfirmation}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-white font-medium"
                  >
                    Continue to Delete
                  </button>
                </div>
              </div>
            )}
            
            {/* Confirmation Step */}
            {step === 'confirmation' && (
              <div className="p-6">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-900/30 rounded-full border border-red-500/30">
                  <Lock className="h-8 w-8 text-red-500" />
                </div>
                
                <h2 className="text-xl font-bold text-center mb-2">Final Confirmation</h2>
                <p className="text-gray-400 text-center mb-6">
                  To confirm deletion, please type the following:
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <p className="text-sm text-gray-300">
                      <span className="font-semibold text-amber-400">Important:</span> We'll send a confirmation link to your email. Your account will be scheduled for deletion after you click that link and will be permanently deleted in 48 hours.
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="confirm-text" className="block text-sm font-medium text-gray-400 mb-1">
                      Type <span className="font-mono font-bold text-red-400">sudo delete my account</span> to confirm
                    </label>
                    <input
                      ref={confirmInputRef}
                      id="confirm-text"
                      type="text"
                      placeholder="sudo delete my account"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={() => setStep('export')}
                    className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-gray-300"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    disabled={confirmText !== "sudo delete my account" || isProcessing}
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors text-white font-medium flex items-center justify-center ${
                      confirmText === "sudo delete my account" && !isProcessing
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-gray-700 cursor-not-allowed'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending Email...
                      </>
                    ) : (
                      'Send Confirmation Email'
                    )}
                  </button>
                </div>
              </div>
            )}
            
            {/* Email Sent Step */}
            {step === 'email_sent' && (
              <div className="p-6">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-amber-900/30 rounded-full border border-amber-500/30">
                  <Mail className="h-8 w-8 text-amber-500" />
                </div>
                
                <h2 className="text-xl font-bold text-center mb-2">Confirmation Email Sent</h2>
                <p className="text-gray-400 text-center mb-6">
                  We've sent a confirmation link to your registered email address
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-gray-800/50 rounded-lg border border-amber-700/30 flex items-start gap-3">
                    <Clock className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-amber-300 font-medium mb-1">48-Hour Grace Period</p>
                      <p className="text-sm text-gray-300">
                        After clicking the confirmation link, your account will be scheduled for deletion and permanently removed after 48 hours. You can cancel the deletion by logging in during this period.
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <p className="text-sm text-gray-300">
                      <span className="font-semibold block">Check your inbox and spam folder:</span>
                      If you don't see the email within a few minutes, check your spam folder or try again.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AccountDeletionModal; 