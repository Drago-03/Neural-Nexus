"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, X, Download, Copy, Maximize2, Minimize2, RefreshCw } from 'lucide-react';

interface CloudShellProps {
  theme: 'dark' | 'light';
  onClose: () => void;
}

export default function CloudShell({ theme, onClose }: CloudShellProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [outputHistory, setOutputHistory] = useState<{ type: 'command' | 'output' | 'error'; content: string }[]>([
    { type: 'output', content: 'Neural Nexus Cloud Shell v1.0.0' },
    { type: 'output', content: 'Type "help" to see available commands.' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const outputContainerRef = useRef<HTMLDivElement>(null);
  
  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  // Scroll to bottom whenever output changes
  useEffect(() => {
    if (outputContainerRef.current) {
      outputContainerRef.current.scrollTop = outputContainerRef.current.scrollHeight;
    }
  }, [outputHistory]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentCommand(e.target.value);
  };
  
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle up/down arrow keys for command history
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentCommand('');
      }
    } else if (e.key === 'Enter') {
      executeCommand();
    }
  };
  
  const executeCommand = async () => {
    if (!currentCommand.trim()) return;
    
    // Add command to history
    setCommandHistory(prev => [...prev, currentCommand]);
    setHistoryIndex(-1);
    
    // Add command to output
    setOutputHistory(prev => [...prev, { type: 'command', content: `$ ${currentCommand}` }]);
    setIsLoading(true);
    
    try {
      // Process command (in a real app, this would call an API)
      const output = await processCommand(currentCommand);
      
      // Add output to history
      setOutputHistory(prev => [...prev, ...output]);
    } catch (error) {
      setOutputHistory(prev => [...prev, { type: 'error', content: `Error: ${error}` }]);
    } finally {
      setIsLoading(false);
      setCurrentCommand('');
      
      // Focus input after command execution
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };
  
  const processCommand = async (command: string): Promise<{ type: 'output' | 'error'; content: string }[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const cmd = command.trim().toLowerCase();
    const parts = cmd.split(' ');
    
    if (cmd === 'help') {
      return [
        { type: 'output', content: 'Available commands:' },
        { type: 'output', content: '  help         - Show this help menu' },
        { type: 'output', content: '  clear        - Clear the terminal' },
        { type: 'output', content: '  echo [text]  - Print text to the console' },
        { type: 'output', content: '  ls           - List files in current directory' },
        { type: 'output', content: '  npm [args]   - Run npm commands' },
        { type: 'output', content: '  git [args]   - Run git commands' },
        { type: 'output', content: '  deploy       - Deploy your app to Neural Nexus Cloud' }
      ];
    } else if (cmd === 'clear') {
      setOutputHistory([
        { type: 'output', content: 'Neural Nexus Cloud Shell v1.0.0' },
        { type: 'output', content: 'Type "help" to see available commands.' }
      ]);
      return [];
    } else if (parts[0] === 'echo') {
      const text = parts.slice(1).join(' ');
      return [{ type: 'output', content: text }];
    } else if (cmd === 'ls') {
      return [
        { type: 'output', content: 'app/          components/    node_modules/    package.json' },
        { type: 'output', content: 'public/       styles/        next.config.js   README.md' }
      ];
    } else if (parts[0] === 'npm') {
      if (parts[1] === 'install' || parts[1] === 'i') {
        return [
          { type: 'output', content: `Installing ${parts.slice(2).join(' ')}...` },
          { type: 'output', content: 'added 42 packages in 2.1s' }
        ];
      } else if (parts[1] === 'run') {
        return [
          { type: 'output', content: `> neural-nexus@1.0.0 ${parts[2]}` },
          { type: 'output', content: `> next ${parts[2]}` },
          { type: 'output', content: 'ready - started server on 0.0.0.0:3000, url: http://localhost:3000' }
        ];
      } else {
        return [{ type: 'error', content: `Unknown npm command: ${parts.slice(1).join(' ')}` }];
      }
    } else if (parts[0] === 'git') {
      if (parts[1] === 'status') {
        return [
          { type: 'output', content: 'On branch main' },
          { type: 'output', content: 'Your branch is up to date with \'origin/main\'.' },
          { type: 'output', content: 'Changes not staged for commit:' },
          { type: 'output', content: '  (use "git add <file>..." to update what will be committed)' },
          { type: 'output', content: '  modified:   app/playground/page.tsx' }
        ];
      } else if (parts[1] === 'add') {
        return [{ type: 'output', content: `Added ${parts.slice(2).join(' ')} to staging area` }];
      } else if (parts[1] === 'commit') {
        return [{ type: 'output', content: '[main a1b2c3d] ' + (parts.includes('-m') ? parts[parts.indexOf('-m') + 1] : 'Commit changes') }];
      } else {
        return [{ type: 'error', content: `Unknown git command: ${parts.slice(1).join(' ')}` }];
      }
    } else if (cmd === 'deploy') {
      return [
        { type: 'output', content: '🚀 Deploying to Neural Nexus Cloud...' },
        { type: 'output', content: '⚙️ Building application...' },
        { type: 'output', content: '✅ Build successful!' },
        { type: 'output', content: '📦 Uploading assets...' },
        { type: 'output', content: '🔄 Updating deployment...' },
        { type: 'output', content: '✨ Deployment complete!' },
        { type: 'output', content: '🌐 Your app is live at: https://your-app.neural-nexus.cloud' }
      ];
    } else {
      return [{ type: 'error', content: `Command not found: ${command}` }];
    }
  };
  
  const copyOutput = () => {
    const text = outputHistory.map(item => item.content).join('\n');
    navigator.clipboard.writeText(text);
  };
  
  const downloadOutput = () => {
    const text = outputHistory.map(item => item.content).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'neural-nexus-cloud-shell-output.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  return (
    <div 
      className={`flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-50' : 'h-full'
      } ${theme === 'dark' ? 'bg-[#1e1e1e] text-gray-300' : 'bg-white text-gray-800'}`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between p-2 border-b ${theme === 'dark' ? 'border-[#3d3d3d]' : 'border-[#e0e0e0]'}`}>
        <div className="flex items-center">
          <TerminalIcon className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Neural Nexus Cloud Shell</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <button 
            onClick={copyOutput}
            className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#f0f0f0]'}`}
            title="Copy output"
            aria-label="Copy output"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button 
            onClick={downloadOutput}
            className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#f0f0f0]'}`}
            title="Download output"
            aria-label="Download output"
          >
            <Download className="h-4 w-4" />
          </button>
          <button 
            onClick={toggleFullscreen}
            className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#f0f0f0]'}`}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
          <button 
            onClick={onClose}
            className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#f0f0f0]'}`}
            title="Close cloud shell"
            aria-label="Close cloud shell"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Terminal output */}
      <div 
        ref={outputContainerRef}
        className={`flex-1 p-4 font-mono text-sm overflow-auto ${
          theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white'
        }`}
      >
        {outputHistory.map((item, index) => (
          <div key={index} className="whitespace-pre-wrap mb-1">
            <span className={
              item.type === 'command' 
                ? 'text-blue-400' 
                : item.type === 'error' 
                  ? 'text-red-400' 
                  : theme === 'dark' ? 'text-green-300' : 'text-green-600'
            }>
              {item.content}
            </span>
          </div>
        ))}
        
        {/* Current command input */}
        <div className="flex items-center mt-2">
          <span className="text-blue-400 mr-2">$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentCommand}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            className={`flex-1 bg-transparent outline-none ${
              theme === 'dark' ? 'text-gray-300 caret-white' : 'text-gray-800 caret-black'
            }`}
            disabled={isLoading}
            placeholder="Type a command..."
            aria-label="Command input"
            title="Enter a command and press Enter to execute"
          />
          {isLoading && <RefreshCw className="h-4 w-4 ml-2 animate-spin text-gray-500" />}
        </div>
      </div>
      
      {/* Command bar */}
      <div className={`p-2 border-t flex items-center ${theme === 'dark' ? 'border-[#3d3d3d] bg-[#252526]' : 'border-[#e0e0e0] bg-[#f3f3f3]'}`}>
        <button 
          onClick={executeCommand}
          disabled={!currentCommand.trim() || isLoading}
          className={`flex items-center px-3 py-1 rounded text-xs ${
            !currentCommand.trim() || isLoading
              ? theme === 'dark' ? 'bg-gray-700 text-gray-500' : 'bg-gray-300 text-gray-500'
              : theme === 'dark' 
                ? 'bg-[#0e639c] hover:bg-[#1177bb] text-white' 
                : 'bg-[#0067c0] hover:bg-[#0078d7] text-white'
          }`}
          title="Run command"
          aria-label="Run command"
        >
          <Play className="h-3 w-3 mr-1" />
          Run
        </button>
        
        <div className="ml-4 text-xs">
          <span className="opacity-70">Type 'help' for available commands</span>
        </div>
      </div>
    </div>
  );
} 