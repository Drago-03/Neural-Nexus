"use client";

import React, { useState, useEffect } from 'react';
import { Sun, Moon, Play, Copy, Save, RefreshCw, Layout, Menu, Settings, Monitor, 
  CloudSnow, Home, Cpu, Zap, BookOpen, Coffee, Split, Layers, GitBranch, Database } from 'lucide-react';
import Link from 'next/link';
import CodeEditor from './CodeEditor';
import Terminal from './Terminal';
import FileExplorer from './FileExplorer';
import ExtensionMarketplace from './ExtensionMarketplace';
import PreviewWindow from './PreviewWindow';
import CloudShell from './CloudShell';
import SettingsModal from './SettingsModal';
import AIAssistantPanel from './AIAssistantPanel';
import CodeSamplesPanel from './CodeSamplesPanel';
import { motion } from 'framer-motion';

export default function Playground() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [code, setCode] = useState<string>(`// yooo let's code something lit 🔥
function vibeCheck(mood) {
  if (mood === 'bussin') {
    return 'no cap, fr fr';
  } else {
    return 'mid, tbh';
  }
}

// this function is straight fire 🚫🧢
const sendIt = () => {
  console.log("sending it...");
  return "sent!";
};

// main function to run the whole thing
vibeCheck('bussin');
sendIt();
`);
  const [language, setLanguage] = useState<string>('javascript');
  const [output, setOutput] = useState<string>('');
  const [showFileExplorer, setShowFileExplorer] = useState<boolean>(true);
  const [showExtensions, setShowExtensions] = useState<boolean>(false);
  const [showTerminal, setShowTerminal] = useState<boolean>(true);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showCloudShell, setShowCloudShell] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [fontFamily, setFontFamily] = useState<string>("'Fira Code', monospace");
  const [fontSize, setFontSize] = useState<number>(14);
  const [tabSize, setTabSize] = useState<number>(2);
  const [showAIAssistant, setShowAIAssistant] = useState<boolean>(false);
  const [showCodeSamples, setShowCodeSamples] = useState<boolean>(false);
  const [isSplitView, setIsSplitView] = useState<boolean>(false);

  // Available code samples
  const codeSamples = [
    {
      name: "Hello World",
      language: "javascript",
      code: `// Simple hello world function
console.log("Hello, Neural Nexus!");`
    },
    {
      name: "React Component",
      language: "javascript",
      code: `// Basic React functional component
import React from 'react';

const Button = ({ text, onClick }) => {
  return (
    <button 
      className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-md"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;`
    },
    {
      name: "Neural Network",
      language: "javascript", 
      code: `// Simple neural network with TensorFlow.js
import * as tf from '@tensorflow/tfjs';

// Create a sequential model
const model = tf.sequential();

// Add layers
model.add(tf.layers.dense({
  units: 64,
  activation: 'relu',
  inputShape: [10]
}));
model.add(tf.layers.dense({
  units: 32, 
  activation: 'relu'
}));
model.add(tf.layers.dense({
  units: 1
}));

// Compile the model
model.compile({
  optimizer: 'adam',
  loss: 'meanSquaredError'
});

console.log('Neural network model created! 🧠');`
    }
  ];
  
  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Toggle AI assistant
  const toggleAIAssistant = () => {
    setShowAIAssistant(!showAIAssistant);
    // If opening AI assistant and something else is open, close the other panel
    if (!showAIAssistant) {
      if (showExtensions) setShowExtensions(false);
      if (showCodeSamples) setShowCodeSamples(false);
    }
  };

  // Toggle code samples panel
  const toggleCodeSamples = () => {
    setShowCodeSamples(!showCodeSamples);
    // If opening code samples and something else is open, close the other panel
    if (!showCodeSamples) {
      if (showExtensions) setShowExtensions(false);
      if (showAIAssistant) setShowAIAssistant(false);
    }
  };

  // Toggle split view
  const toggleSplitView = () => {
    setIsSplitView(!isSplitView);
    if (!isSplitView && !showPreview) {
      setShowPreview(true);
    }
  };
  
  // Function to run code
  const runCode = async () => {
    setIsLoading(true);
    setOutput('Running code...\n');
    
    try {
      // In a real app, we would send this to a backend service
      // Here we're simulating execution with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate output based on the code
      if (code.includes('console.log')) {
        const logMatches = code.match(/console\.log\(["'](.*)["']\)/g);
        if (logMatches) {
          logMatches.forEach(match => {
            const content = match.match(/console\.log\(["'](.*?)["']\)/);
            if (content && content[1]) {
              setOutput(prev => prev + content[1] + '\n');
            }
          });
        }
      }
      
      if (code.includes('vibeCheck')) {
        setOutput(prev => prev + 'vibeCheck result: no cap, fr fr\n');
      }
      
      if (code.includes('sendIt')) {
        setOutput(prev => prev + 'sent!\n');
      }

      // Neural network detection
      if (code.includes('neural network') || code.includes('model.add') || code.includes('tf.layers')) {
        setOutput(prev => prev + 'Neural network initialized ✓\n');
        setOutput(prev => prev + 'Training data prepared ✓\n');
        setOutput(prev => prev + 'Model compiled successfully ✓\n');
      }
      
      setOutput(prev => prev + 'Code execution completed successfully! ✨\n');
    } catch (error) {
      setOutput(prev => prev + `Error: ${error}\n`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle code sample selection
  const handleSelectCodeSample = (sampleCode: string, sampleLanguage: string) => {
    setCode(sampleCode);
    setLanguage(sampleLanguage || 'javascript');
    setShowCodeSamples(false);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Run code with Ctrl+Enter or Cmd+Enter
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        runCode();
      }
      
      // Save with Ctrl+S or Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        // Save functionality would go here
        setOutput(prev => prev + 'Code saved!\n');
      }

      // Toggle AI Assistant with Alt+A
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        toggleAIAssistant();
      }

      // Toggle theme with Alt+T
      if (e.altKey && e.key === 't') {
        e.preventDefault();
        toggleTheme();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, showAIAssistant]);
  
  return (
    <div className={`flex flex-col h-screen ${theme === 'dark' ? 'bg-[#1e1e1e] text-gray-300' : 'bg-white text-gray-800'}`}>
      {/* Top navbar */}
      <div className={`flex items-center justify-between px-4 py-2 border-b ${theme === 'dark' ? 'border-[#3d3d3d]' : 'border-[#e0e0e0]'}`}>
        <div className="flex items-center space-x-3">
          <Link href="/" className={`flex items-center px-3 py-1.5 rounded ${theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#f5f5f5]'}`}>
            <Home className="h-5 w-5 mr-1.5" />
            <span className="font-medium">Home</span>
          </Link>
          
          <button 
            onClick={() => setShowFileExplorer(!showFileExplorer)}
            className={`p-2 rounded ${theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#f5f5f5]'}`}
            aria-label="Toggle file explorer"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex items-center space-x-1">
            <span className="text-lg font-medium bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">Neural Nexus</span>
            <span className="text-lg font-medium">Playground</span>
          </div>

          <div className="hidden md:flex items-center space-x-2 ml-4">
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={`px-2 py-1 rounded text-sm ${
                theme === 'dark' 
                  ? 'bg-[#3c3c3c] border-[#5f5f5f] text-white' 
                  : 'bg-[#f5f5f5] border-[#e0e0e0] text-black'
              } border`}
              aria-label="Select programming language"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="typescript">TypeScript</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="java">Java</option>
            </select>

            <button 
              onClick={toggleCodeSamples}
              className={`flex items-center px-3 py-1.5 rounded text-sm ${
                showCodeSamples
                  ? theme === 'dark' ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white'
                  : theme === 'dark' ? 'bg-[#3c3c3c] hover:bg-[#4c4c4c]' : 'bg-[#f5f5f5] hover:bg-[#e5e5e5]'
              }`}
            >
              <BookOpen className="h-4 w-4 mr-1.5" />
              Code Samples
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={runCode}
            disabled={isLoading}
            className={`flex items-center px-3 py-1.5 rounded text-sm ${
              theme === 'dark' 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label="Run code"
          >
            {isLoading ? <RefreshCw className="h-4 w-4 mr-1 animate-spin" /> : <Play className="h-4 w-4 mr-1" />}
            Run
          </button>

          <button
            onClick={toggleSplitView}
            className={`p-2 rounded ${
              isSplitView
                ? theme === 'dark' ? 'bg-[#3c3c3c]' : 'bg-[#f0f0f0]'
                : theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#f5f5f5]'
            }`}
            aria-label="Toggle split view"
            title="Split View"
          >
            <Split className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`p-2 rounded ${
              showPreview
                ? theme === 'dark' ? 'bg-[#3c3c3c]' : 'bg-[#f0f0f0]'
                : theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#f5f5f5]'
            }`}
            aria-label="Toggle preview"
            title="Preview"
          >
            <Monitor className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => setShowCloudShell(!showCloudShell)}
            className={`p-2 rounded ${
              showCloudShell
                ? theme === 'dark' ? 'bg-[#3c3c3c]' : 'bg-[#f0f0f0]'
                : theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#f5f5f5]'
            }`}
            aria-label="Toggle cloud shell"
            title="Cloud Shell"
          >
            <CloudSnow className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => setShowExtensions(!showExtensions)}
            className={`p-2 rounded ${
              showExtensions
                ? theme === 'dark' ? 'bg-[#3c3c3c]' : 'bg-[#f0f0f0]'
                : theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#f5f5f5]'
            }`}
            aria-label="Extensions"
          >
            <Layout className="h-5 w-5" />
          </button>
          
          <button
            onClick={toggleAIAssistant}
            className={`p-2 rounded ${
              showAIAssistant
                ? theme === 'dark' ? 'bg-purple-600' : 'bg-purple-500'
                : theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#f5f5f5]'
            }`}
            aria-label="Toggle AI Assistant"
            title="AI Assistant"
          >
            <Cpu className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => setShowTerminal(!showTerminal)}
            className={`p-2 rounded ${
              showTerminal
                ? theme === 'dark' ? 'bg-[#3c3c3c]' : 'bg-[#f0f0f0]'
                : theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#f5f5f5]'
            }`}
            aria-label="Toggle terminal"
          >
            <span className="font-mono text-sm">{'>'}_</span>
          </button>
          
          <button
            onClick={toggleTheme}
            className={`p-2 rounded ${theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#f5f5f5]'}`}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          
          <button
            className={`p-2 rounded ${theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#f5f5f5]'}`}
            aria-label="Settings"
            onClick={() => setShowSettings(true)}
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* File explorer */}
        {showFileExplorer && (
          <div className={`w-64 border-r flex-shrink-0 ${theme === 'dark' ? 'border-[#3d3d3d]' : 'border-[#e0e0e0]'}`}>
            <FileExplorer 
              theme={theme} 
              onSelectFile={(file) => {
                // In a real app, this would load the file content
                setOutput(`Loading file: ${file.name}\n`);
              }}
            />
          </div>
        )}
        
        {/* Center content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {showPreview ? (
            <div className={`flex-1 flex ${isSplitView ? 'flex-row' : 'flex-col'} overflow-hidden`}>
              <div className={isSplitView ? "w-1/2 overflow-hidden" : "h-1/2 overflow-hidden"}>
                <CodeEditor 
                  code={code} 
                  onChange={setCode} 
                  language={language}
                  theme={theme}
                  onRun={runCode}
                  running={isLoading}
                  fontFamily={fontFamily}
                  fontSize={fontSize}
                  tabSize={tabSize}
                  onDownload={() => {
                    // Simple download implementation
                    const blob = new Blob([code], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `code.${language === 'javascript' ? 'js' : language === 'python' ? 'py' : 'txt'}`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    
                    setOutput(prev => prev + 'Code downloaded!\n');
                  }}
                />
              </div>
              <div className={isSplitView ? "w-1/2 border-l overflow-hidden" : "h-1/2 border-t overflow-hidden"}>
                <PreviewWindow
                  code={code}
                  language={language}
                  theme={theme}
                  onClose={() => setShowPreview(false)}
                />
              </div>
            </div>
          ) : showCloudShell ? (
            <div className="flex-1 overflow-hidden">
              <CloudShell 
                theme={theme}
                onClose={() => setShowCloudShell(false)}
              />
        </div>
      ) : (
            <div className="flex-1 overflow-hidden">
              <CodeEditor 
                code={code} 
                onChange={setCode} 
                language={language}
                theme={theme}
                onRun={runCode}
                running={isLoading}
                fontFamily={fontFamily}
                fontSize={fontSize}
                tabSize={tabSize}
                onDownload={() => {
                  // Simple download implementation
                  const blob = new Blob([code], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `code.${language === 'javascript' ? 'js' : language === 'python' ? 'py' : 'txt'}`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                  
                  setOutput(prev => prev + 'Code downloaded!\n');
                }}
              />
        </div>
      )}
      
          {/* Terminal */}
          {showTerminal && !showCloudShell && (
            <div className={`h-1/3 border-t ${theme === 'dark' ? 'border-[#3d3d3d]' : 'border-[#e0e0e0]'}`}>
              <Terminal 
                output={output} 
                theme={theme}
                onClose={() => setShowTerminal(false)}
              />
            </div>
          )}
        </div>
        
        {/* AI Assistant Panel */}
        {showAIAssistant && (
          <div className={`w-80 border-l flex-shrink-0 ${theme === 'dark' ? 'border-[#3d3d3d]' : 'border-[#e0e0e0]'}`}>
            <AIAssistantPanel 
              theme={theme}
              onClose={() => setShowAIAssistant(false)}
              code={code}
              language={language}
            />
          </div>
        )}
        
        {/* Code Samples Panel */}
        {showCodeSamples && (
          <div className={`w-80 border-l flex-shrink-0 ${theme === 'dark' ? 'border-[#3d3d3d]' : 'border-[#e0e0e0]'}`}>
            <CodeSamplesPanel 
              theme={theme}
              onClose={() => setShowCodeSamples(false)} 
              onSelectSample={handleSelectCodeSample}
            />
          </div>
        )}
        
        {/* Extension marketplace */}
        {showExtensions && (
          <div className={`w-80 border-l flex-shrink-0 ${theme === 'dark' ? 'border-[#3d3d3d]' : 'border-[#e0e0e0]'}`}>
            <ExtensionMarketplace 
              theme={theme}
              onClose={() => setShowExtensions(false)}
            />
        </div>
      )}
    </div>
      
      {/* Status bar */}
      <div className={`flex items-center justify-between px-4 py-1 text-xs border-t ${theme === 'dark' ? 'bg-[#007acc] text-white border-[#3d3d3d]' : 'bg-[#007acc] text-white border-[#e0e0e0]'}`}>
        <div className="flex items-center space-x-4">
          <div>{language}</div>
          <div>Ln 1, Col 1</div>
          <div>Spaces: {tabSize}</div>
          <div>UTF-8</div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <GitBranch className="h-3.5 w-3.5" />
            <span>main</span>
          </div>
          <div className="flex items-center space-x-1">
            <Database className="h-3.5 w-3.5" />
            <span>Neural Engine</span>
            </div>
          <div className="flex items-center">
            <Coffee className="h-3.5 w-3.5 mr-1" />
            <span>v1.2.0</span>
          </div>
          <div>{theme.charAt(0).toUpperCase() + theme.slice(1)}</div>
        </div>
      </div>
      
      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          theme={theme}
          onClose={() => setShowSettings(false)}
          onChangeTheme={setTheme}
          fontFamily={fontFamily}
          onChangeFontFamily={setFontFamily}
          fontSize={fontSize}
          onChangeFontSize={setFontSize}
          tabSize={tabSize}
          onChangeTabSize={setTabSize}
        />
      )}
    </div>
  );
} 