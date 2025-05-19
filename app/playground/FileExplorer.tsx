"use client";

import React, { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, Plus, Trash, RefreshCw, MoreHorizontal, FileText, Code, FileJson } from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileItem[];
  extension?: string;
  active?: boolean;
}

interface FileExplorerProps {
  theme: string;
  onSelectFile: (file: FileItem) => void;
}

export default function FileExplorer({ theme, onSelectFile }: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['workspace', 'src']);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [activeFile, setActiveFile] = useState<string | null>('main');
  
  // Mock file structure
  const files: FileItem[] = [
    {
      id: 'workspace',
      name: 'neural-nexus-workspace',
      type: 'folder',
      children: [
        {
          id: 'src',
          name: 'src',
          type: 'folder',
          children: [
            {
              id: 'main',
              name: 'main.js',
              type: 'file',
              extension: 'js',
              active: true
            },
            {
              id: 'utils',
              name: 'utils.js',
              type: 'file',
              extension: 'js'
            },
            {
              id: 'types',
              name: 'types.d.ts',
              type: 'file',
              extension: 'ts'
            }
          ]
        },
        {
          id: 'configs',
          name: 'configs',
          type: 'folder',
          children: [
            {
              id: 'config',
              name: 'config.json',
              type: 'file',
              extension: 'json'
            },
            {
              id: 'settings',
              name: 'settings.json',
              type: 'file',
              extension: 'json'
            }
          ]
        },
        {
          id: 'readme',
          name: 'README.md',
          type: 'file',
          extension: 'md'
        },
        {
          id: 'package',
          name: 'package.json',
          type: 'file',
          extension: 'json'
        }
      ]
    }
  ];
  
  const toggleFolder = (folderId: string) => {
    if (expandedFolders.includes(folderId)) {
      setExpandedFolders(expandedFolders.filter(id => id !== folderId));
    } else {
      setExpandedFolders([...expandedFolders, folderId]);
    }
  };
  
  const handleFileSelect = (file: FileItem) => {
    if (file.type === 'file') {
      setActiveFile(file.id);
      onSelectFile(file);
    }
  };
  
  const getFileIcon = (extension?: string) => {
    switch (extension) {
      case 'js':
        return <Code className="h-4 w-4 text-yellow-400" />;
      case 'ts':
        return <Code className="h-4 w-4 text-blue-400" />;
      case 'json':
        return <FileJson className="h-4 w-4 text-yellow-600" />;
      case 'md':
        return <FileText className="h-4 w-4 text-blue-300" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };
  
  const renderFileTree = (items: FileItem[], depth = 0) => {
    return items.map(item => (
      <div key={item.id}>
        <div 
          className={`flex items-center pl-${depth * 4} py-1 hover:bg-opacity-30 cursor-pointer ${
            hoveredItem === item.id 
              ? theme === 'dark' ? 'bg-[#2a2d2e]' : 'bg-[#e8e8e8]' 
              : ''
          } ${
            activeFile === item.id 
              ? theme === 'dark' ? 'bg-[#313131] text-white' : 'bg-[#e4e6f1]' 
              : ''
          }`}
          onMouseEnter={() => setHoveredItem(item.id)}
          onMouseLeave={() => setHoveredItem(null)}
          onClick={() => item.type === 'folder' ? toggleFolder(item.id) : handleFileSelect(item)}
          style={{ paddingLeft: `${depth * 12 + 4}px` }}
        >
          {item.type === 'folder' && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(item.id);
              }}
              className="mr-1 focus:outline-none"
              title={expandedFolders.includes(item.id) ? "Collapse folder" : "Expand folder"}
            >
              {expandedFolders.includes(item.id) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}
          
          {item.type === 'folder' ? (
            <Folder className={`h-4 w-4 mr-1.5 ${expandedFolders.includes(item.id) ? 'text-blue-400' : 'text-yellow-400'}`} />
          ) : (
            <span className="mr-1.5">{getFileIcon(item.extension)}</span>
          )}
          
          <span className="text-sm truncate">{item.name}</span>
          
          {hoveredItem === item.id && (
            <div className="ml-auto flex mr-1">
              {item.type === 'file' && (
                <button 
                  className={`p-0.5 rounded-sm ${theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e1e1e1]'}`}
                  title="Delete file"
                >
                  <Trash className="h-3.5 w-3.5" />
                </button>
              )}
              {item.type === 'folder' && (
                <button 
                  className={`p-0.5 rounded-sm ${theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e1e1e1]'}`}
                  title="New file"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
        
        {item.type === 'folder' && expandedFolders.includes(item.id) && item.children && (
          <div>
            {renderFileTree(item.children, depth + 1)}
          </div>
        )}
      </div>
    ));
  };
  
  return (
    <div 
      className={`w-[250px] border-r ${
        theme === 'dark' 
          ? 'bg-[#252526] border-[#3d3d3d] text-gray-300' 
          : 'bg-[#f3f3f3] border-[#e0e0e0] text-gray-800'
      } h-full flex flex-col`}
    >
      {/* Explorer header */}
      <div className={`px-4 py-2 flex justify-between items-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
        <h3 className="font-bold uppercase text-xs">Explorer</h3>
        <div className="flex space-x-1">
          <button 
            className={`p-1 rounded-sm ${theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e1e1e1]'}`}
            title="New file"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button 
            className={`p-1 rounded-sm ${theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e1e1e1]'}`}
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button 
            className={`p-1 rounded-sm ${theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e1e1e1]'}`}
            title="More actions"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Files list */}
      <div className="overflow-auto flex-grow">
        {renderFileTree(files)}
      </div>
      
      {/* GitHub integration section */}
      <div className={`px-4 py-2 border-t ${theme === 'dark' ? 'border-[#3d3d3d]' : 'border-[#e0e0e0]'}`}>
        <h4 className="font-bold uppercase text-xs flex items-center mb-2">
          <GitBranch className="h-4 w-4 mr-1" />
          GitHub Integration
        </h4>
        <button 
          className={`w-full py-1 px-2 text-xs text-center rounded ${
            theme === 'dark' 
              ? 'bg-blue-700 hover:bg-blue-600 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          Connect to Repository
        </button>
      </div>
    </div>
  );
}

// GitBranch component since it's not included in the imports
function GitBranch({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <line x1="6" y1="3" x2="6" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  );
} 