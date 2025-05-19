"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Maximize2, Minimize2, RefreshCw, ExternalLink, X } from 'lucide-react';

interface PreviewWindowProps {
  code: string;
  language: string;
  theme: 'dark' | 'light';
  onClose: () => void;
}

export default function PreviewWindow({ code, language, theme, onClose }: PreviewWindowProps) {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const refreshPreview = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
    
    if (iframeRef.current) {
      // Force iframe refresh
      iframeRef.current.src = 'about:blank';
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.srcdoc = processCodeForPreview(code, language);
        }
      }, 100);
    }
  };
  
  // Process code based on language
  const processCodeForPreview = (code: string, language: string): string => {
    if (language === 'javascript') {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Preview</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
              padding: 20px;
              line-height: 1.6;
              color: ${theme === 'dark' ? '#e0e0e0' : '#333'};
              background-color: ${theme === 'dark' ? '#1e1e1e' : '#ffffff'};
            }
            .output {
              border: 1px solid ${theme === 'dark' ? '#3d3d3d' : '#e0e0e0'};
              padding: 12px;
              border-radius: 4px;
              background-color: ${theme === 'dark' ? '#252526' : '#f5f5f5'};
              overflow: auto;
              margin-top: 20px;
            }
            .error {
              color: #ff5555;
              border-left: 3px solid #ff5555;
              padding-left: 8px;
              margin: 8px 0;
            }
          </style>
        </head>
        <body>
          <h3>JavaScript Output</h3>
          <div class="output" id="output"></div>
          <script>
            // Override console methods
            const outputEl = document.getElementById('output');
            const originalConsole = { ...console };
            
            console.log = function(...args) {
              originalConsole.log(...args);
              const div = document.createElement('div');
              div.textContent = args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
              ).join(' ');
              outputEl.appendChild(div);
            };
            
            console.error = function(...args) {
              originalConsole.error(...args);
              const div = document.createElement('div');
              div.className = 'error';
              div.textContent = args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
              ).join(' ');
              outputEl.appendChild(div);
            };
            
            // Execute user code with error handling
            try {
              ${code}
            } catch (error) {
              console.error('Error:', error.message);
            }
          </script>
        </body>
        </html>
      `;
    } else if (language === 'html') {
      // For HTML, we can just use the code as-is with minimal wrapper
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>HTML Preview</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
              color: ${theme === 'dark' ? '#e0e0e0' : '#333'};
              background-color: ${theme === 'dark' ? '#1e1e1e' : '#ffffff'};
            }
          </style>
        </head>
        <body>
          ${code}
        </body>
        </html>
      `;
    } else {
      // For other languages, show a placeholder
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Preview</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
              padding: 20px;
              line-height: 1.6;
              color: ${theme === 'dark' ? '#e0e0e0' : '#333'};
              background-color: ${theme === 'dark' ? '#1e1e1e' : '#ffffff'};
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
            .message {
              text-align: center;
              max-width: 500px;
            }
          </style>
        </head>
        <body>
          <div class="message">
            <h3>Preview not available for ${language}</h3>
            <p>Live preview is currently only available for JavaScript and HTML code. Run the code in the terminal to see the output.</p>
          </div>
        </body>
        </html>
      `;
    }
  };
  
  // Initialize preview
  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = processCodeForPreview(code, language);
    }
  }, [code, language, theme]);
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  return (
    <div 
      className={`flex flex-col ${
        isFullscreen 
        ? 'fixed inset-0 z-50' 
        : 'h-full'
      } ${theme === 'dark' ? 'bg-[#1e1e1e] text-gray-300' : 'bg-white text-gray-800'}`}
    >
      {/* Preview header */}
      <div className={`flex items-center justify-between px-4 py-2 border-b ${theme === 'dark' ? 'border-[#3d3d3d]' : 'border-[#e0e0e0]'}`}>
        <div className="flex items-center">
          <h3 className="text-sm font-medium">Preview</h3>
          {language === 'javascript' && <span className="ml-2 text-xs opacity-60">JavaScript</span>}
          {language === 'html' && <span className="ml-2 text-xs opacity-60">HTML</span>}
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={refreshPreview}
            className={`p-1.5 rounded ${theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#f0f0f0]'}`}
            aria-label="Refresh preview"
            title="Refresh preview"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          
          <button 
            onClick={toggleFullscreen}
            className={`p-1.5 rounded ${theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#f0f0f0]'}`}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
          
          <button 
            onClick={onClose}
            className={`p-1.5 rounded ${theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#f0f0f0]'}`}
            aria-label="Close preview"
            title="Close preview"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Preview content */}
      <div className="flex-grow relative">
        {isLoading && (
          <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-30 z-10">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        )}
        
        <iframe
          ref={iframeRef}
          title="Code Preview"
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-popups"
        />
      </div>
    </div>
  );
} 