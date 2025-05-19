"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Layers, Settings, ChevronDown, X, Maximize2, Minimize2, Play, Download, GitBranch, Save, RefreshCw, Copy, Loader2 } from 'lucide-react';
import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedButton } from '@/components/ui/animated-button';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  language: string;
  theme: 'dark' | 'light';
  onRun: () => void;
  running: boolean;
  onDownload: () => void;
  fontFamily?: string;
  fontSize?: number;
  tabSize?: number;
}

export default function CodeEditor({
  code,
  onChange,
  language,
  theme,
  onRun,
  running,
  onDownload,
  fontFamily = "'Fira Code', monospace",
  fontSize = 14,
  tabSize = 2
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeFile, setActiveFile] = useState('main');
  const [lineNumbers, setLineNumbers] = useState<string[]>([]);
  
  const files = [
    { id: 'main', name: language === 'javascript' ? 'main.js' : language === 'python' ? 'main.py' : language === 'java' ? 'Main.java' : 'main.txt', active: true },
    { id: 'config', name: 'config.json', active: false },
  ];

  // Generate line numbers whenever code changes
  useEffect(() => {
    const lines = code.split('\n');
    const numbers = lines.map((_, i) => (i + 1).toString());
    setLineNumbers(numbers);
  }, [code]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Run code with Ctrl+Enter or Cmd+Enter
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        onRun();
      }
      
      // Handle tab key for indentation in the textarea
      if (e.key === 'Tab' && document.activeElement === textareaRef.current) {
        e.preventDefault();
        const start = textareaRef.current?.selectionStart || 0;
        const end = textareaRef.current?.selectionEnd || 0;
        
        // Use the tabSize prop to determine how many spaces to insert
        const spaces = ' '.repeat(tabSize);
        
        // Insert tab at cursor position
        const newCode = code.substring(0, start) + spaces + code.substring(end);
        onChange(newCode);
        
        // Move cursor after the inserted tab
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + tabSize;
          }
        }, 0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, onRun, onChange, tabSize]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`relative flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : 'h-full'}`}>
      {/* VS Code-like header */}
      <div className={`flex items-center justify-between px-2 py-1 border-b ${theme === 'dark' ? 'bg-[#1e1e1e] border-[#2d2d2d]' : 'bg-[#f3f3f3] border-[#e0e0e0]'}`}>
        <div className="flex items-center">
          {/* Explorer icon */}
          <button 
            className={`p-1 rounded-sm ${theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e1e1e1]'}`}
            aria-label="Toggle explorer"
            title="Toggle explorer"
          >
            <Layers className="h-4 w-4" />
          </button>
          
          {/* File tabs */}
          <div className="flex ml-2 text-xs">
            {files.map(file => (
              <button
                key={file.id}
                onClick={() => setActiveFile(file.id)}
                className={`px-3 py-1 flex items-center gap-1 border-r 
                  ${file.id === activeFile 
                    ? theme === 'dark' 
                      ? 'bg-[#252526] text-white border-t-2 border-t-blue-500' 
                      : 'bg-white text-black border-t-2 border-t-blue-500'
                    : theme === 'dark'
                      ? 'bg-[#2d2d2d] text-gray-400 hover:bg-[#323232]' 
                      : 'bg-[#ececec] text-gray-700 hover:bg-[#e5e5e5]'
                  } ${theme === 'dark' ? 'border-[#2d2d2d]' : 'border-[#e0e0e0]'}`}
                aria-label={`Open ${file.name}`}
                title={file.name}
              >
                {file.name}
                <X className="h-3 w-3 opacity-0 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={toggleFullscreen} 
            className={`p-1 rounded-sm ${theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e8e8e8]'}`}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>
      
      {/* Main editor content */}
      <div className="flex flex-grow overflow-hidden">
        {/* Left sidebar - file explorer */}
        <div className={`w-10 flex flex-col items-center pt-2 ${theme === 'dark' ? 'bg-[#252526]' : 'bg-[#f3f3f3] border-r border-[#e0e0e0]'}`}>
          <button 
            className={`p-2 rounded-sm mb-2 ${theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e1e1e1]'}`}
            aria-label="Explorer"
            title="Explorer"
          >
            <Layers className="h-5 w-5" />
          </button>
          <button 
            className={`p-2 rounded-sm mb-2 ${theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e1e1e1]'}`}
            aria-label="Source Control"
            title="Source Control"
          >
            <GitBranch className="h-5 w-5" />
          </button>
          <button 
            className={`p-2 rounded-sm mb-2 ${theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e1e1e1]'}`}
            aria-label="Settings"
            title="Settings"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
        
        {/* Editor main content */}
        <div className="flex-grow flex">
          {/* Line numbers */}
          <div className={`p-4 text-xs font-mono text-right pr-2 pt-4 select-none ${theme === 'dark' ? 'bg-[#1e1e1e] text-gray-500' : 'bg-[#f5f5f5] text-gray-500'}`}>
            {lineNumbers.map((num, i) => (
              <div key={i} className="leading-6">{num}</div>
            ))}
          </div>
          
          {/* Code area */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full h-full font-mono text-sm resize-none outline-none ${
              theme === 'dark' ? 'bg-[#1e1e1e] text-gray-300' : 'bg-white text-gray-800'
            } py-1 px-12`}
            style={{ 
              lineHeight: '1.5rem',
              fontFamily: fontFamily,
              fontSize: `${fontSize}px`
            }}
            aria-label="Code editor"
            spellCheck="false"
          />
        </div>
      </div>
      
      {/* Bottom toolbar */}
      <div className={`flex justify-between items-center px-4 py-1 text-xs ${theme === 'dark' ? 'bg-[#007acc] text-white' : 'bg-[#0066b8] text-white'}`}>
        <div className="flex items-center gap-4">
          <span>{language.toUpperCase()}</span>
          <span>Line: {code.split('\n').length}</span>
          <span>UTF-8</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 hover:underline" aria-label="Git branch: main" title="Git branch: main">
            <GitBranch className="h-3 w-3" />
            <span>main</span>
          </button>
          
          <button className="flex items-center gap-1 hover:underline" aria-label="Sync changes" title="Sync changes">
            <RefreshCw className="h-3 w-3" />
            <span>Sync</span>
          </button>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="absolute bottom-12 right-4 flex space-x-2">
        <button
          onClick={onRun}
          disabled={running}
          className={`px-4 py-2 rounded-md flex items-center ${
            running 
            ? 'bg-gray-700 cursor-not-allowed text-gray-400' 
            : theme === 'dark'
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
          aria-label={running ? "Running code..." : "Run code"}
          title={running ? "Running code..." : "Run code"}
        >
          <Play className="h-4 w-4 mr-1" />
          {running ? 'Running...' : 'Run'}
        </button>
        
        <button
          onClick={onDownload}
          className={`p-2 rounded-md ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          aria-label="Download code"
          title="Download code"
        >
          <Download className="h-4 w-4" />
        </button>
        
        <button
          className={`p-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-600 hover:bg-gray-700 text-white'}`}
          aria-label="Save code"
          title="Save code"
        >
          <Save className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
} 