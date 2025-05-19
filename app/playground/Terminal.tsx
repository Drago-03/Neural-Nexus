"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, ChevronDown, ChevronsRight, ExternalLink } from 'lucide-react';

interface TerminalProps {
  output: string;
  theme: string;
  onClose: () => void;
}

export default function Terminal({ output, theme, onClose }: TerminalProps) {
  const [activeTab, setActiveTab] = useState('terminal');
  const [terminalHeight, setTerminalHeight] = useState(200);
  const resizeRef = useRef<HTMLDivElement>(null);
  const initialY = useRef<number>(0);
  const initialHeight = useRef<number>(200);
  
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };
  
  // Handle terminal resize
  useEffect(() => {
    const resizeElement = resizeRef.current;
    
    if (!resizeElement) return;
    
    const handleMouseDown = (e: MouseEvent) => {
      initialY.current = e.clientY;
      initialHeight.current = terminalHeight;
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      const delta = initialY.current - e.clientY;
      const newHeight = Math.max(100, Math.min(500, initialHeight.current + delta));
      setTerminalHeight(newHeight);
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    resizeElement.addEventListener('mousedown', handleMouseDown);
    
    return () => {
      resizeElement.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [terminalHeight]);
  
  return (
    <div 
      className={`border-t ${theme === 'dark' ? 'bg-[#1e1e1e] border-[#2d2d2d]' : 'bg-white border-[#e0e0e0]'}`}
      style={{ height: `${terminalHeight}px` }}
    >
      {/* Resize handle */}
      <div 
        ref={resizeRef}
        className={`w-full h-1 cursor-ns-resize hover:bg-blue-500 transition-colors`}
        title="Resize terminal"
      />
      
      {/* Terminal header */}
      <div className={`flex justify-between items-center px-2 py-1 ${theme === 'dark' ? 'bg-[#252526]' : 'bg-[#f3f3f3]'} border-b ${theme === 'dark' ? 'border-[#3d3d3d]' : 'border-[#e0e0e0]'}`}>
        <div className="flex items-center text-xs">
          <button 
            onClick={() => handleTabClick('terminal')}
            className={`px-3 py-1 ${activeTab === 'terminal' ? (theme === 'dark' ? 'bg-[#1e1e1e] text-white' : 'bg-white text-black') : ''}`}
            title="Terminal"
          >
            TERMINAL
          </button>
          <button 
            onClick={() => handleTabClick('problems')}
            className={`px-3 py-1 ${activeTab === 'problems' ? (theme === 'dark' ? 'bg-[#1e1e1e] text-white' : 'bg-white text-black') : ''}`}
            title="Problems"
          >
            PROBLEMS
          </button>
          <button 
            onClick={() => handleTabClick('output')}
            className={`px-3 py-1 ${activeTab === 'output' ? (theme === 'dark' ? 'bg-[#1e1e1e] text-white' : 'bg-white text-black') : ''}`}
            title="Output"
          >
            OUTPUT
          </button>
          <button 
            onClick={() => handleTabClick('debug')}
            className={`px-3 py-1 ${activeTab === 'debug' ? (theme === 'dark' ? 'bg-[#1e1e1e] text-white' : 'bg-white text-black') : ''}`}
            title="Debug console"
          >
            DEBUG CONSOLE
          </button>
        </div>
        
        <div className="flex items-center">
          <button 
            className={`p-1 rounded-sm ${theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e1e1e1]'}`}
            title="New terminal"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button 
            className={`p-1 rounded-sm ${theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e1e1e1]'}`}
            title="Open external terminal"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
          <button 
            onClick={onClose}
            className={`p-1 rounded-sm ${theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e1e1e1]'}`}
            title="Close terminal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Terminal content */}
      <div className="relative h-full">
        <div className={`absolute top-0 left-0 right-0 bottom-0 overflow-auto ${theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
          {activeTab === 'terminal' && (
            <div className="p-2 font-mono text-sm">
              <div className={`flex items-center mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                <ChevronsRight className="h-4 w-4 mr-1" />
                <span>neuralnexus@cloudshell:~$</span>
              </div>
              
              <pre className={`whitespace-pre-wrap ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>
                {output || 'Terminal ready. Run code to see output.'}
              </pre>
              
              <div className="flex items-center mt-1">
                <ChevronsRight className="h-4 w-4 mr-1" />
                <span contentEditable className="focus:outline-none min-w-[200px]"></span>
                <span className={`animate-blink ${theme === 'dark' ? 'bg-white' : 'bg-black'}`} style={{ width: '1px', height: '14px' }}></span>
              </div>
            </div>
          )}
          
          {activeTab === 'problems' && (
            <div className="p-2 font-mono text-sm flex flex-col items-center justify-center h-full">
              <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>No problems detected</span>
            </div>
          )}
          
          {activeTab === 'output' && (
            <div className="p-2 font-mono text-sm">
              <pre className={`whitespace-pre-wrap ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                {output || 'No output to display.'}
              </pre>
            </div>
          )}
          
          {activeTab === 'debug' && (
            <div className="p-2 font-mono text-sm flex flex-col items-center justify-center h-full">
              <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Debug session not started</span>
              <button className={`mt-2 px-3 py-1 text-xs ${theme === 'dark' ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white'} rounded`}>
                Start Debugging
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 