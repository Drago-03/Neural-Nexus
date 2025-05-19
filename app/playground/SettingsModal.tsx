"use client";

import React, { useState, useEffect } from 'react';
import { X, Search, Save, RotateCcw, ChevronRight, Check } from 'lucide-react';

interface SettingsModalProps {
  theme: 'dark' | 'light';
  onClose: () => void;
  onChangeTheme: (theme: 'dark' | 'light') => void;
  fontFamily: string;
  onChangeFontFamily: (font: string) => void;
  fontSize: number;
  onChangeFontSize: (size: number) => void;
  tabSize: number;
  onChangeTabSize: (size: number) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  theme,
  onClose,
  onChangeTheme,
  fontFamily,
  onChangeFontFamily,
  fontSize,
  onChangeFontSize,
  tabSize,
  onChangeTabSize
}) => {
  const [activeSection, setActiveSection] = useState<string>('editor');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDirty, setIsDirty] = useState<boolean>(false);
  
  // Local state for changes
  const [localTheme, setLocalTheme] = useState<'dark' | 'light'>(theme);
  const [localFontFamily, setLocalFontFamily] = useState<string>(fontFamily);
  const [localFontSize, setLocalFontSize] = useState<number>(fontSize);
  const [localTabSize, setLocalTabSize] = useState<number>(tabSize);
  
  // Reset local state when props change
  useEffect(() => {
    setLocalTheme(theme);
    setLocalFontFamily(fontFamily);
    setLocalFontSize(fontSize);
    setLocalTabSize(tabSize);
  }, [theme, fontFamily, fontSize, tabSize]);
  
  // Check if any settings have changed
  useEffect(() => {
    if (
      localTheme !== theme ||
      localFontFamily !== fontFamily ||
      localFontSize !== fontSize ||
      localTabSize !== tabSize
    ) {
      setIsDirty(true);
    } else {
      setIsDirty(false);
    }
  }, [localTheme, localFontFamily, localFontSize, localTabSize, theme, fontFamily, fontSize, tabSize]);
  
  // Save changes
  const saveChanges = () => {
    onChangeTheme(localTheme);
    onChangeFontFamily(localFontFamily);
    onChangeFontSize(localFontSize);
    onChangeTabSize(localTabSize);
    setIsDirty(false);
  };
  
  // Reset changes
  const resetChanges = () => {
    setLocalTheme(theme);
    setLocalFontFamily(fontFamily);
    setLocalFontSize(fontSize);
    setLocalTabSize(tabSize);
    setIsDirty(false);
  };
  
  // Filter settings based on search query
  const filterSettings = (items: any[]) => {
    if (!searchQuery) return items;
    
    return items.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  
  const sections = [
    { id: 'editor', label: 'Editor', icon: 'file-text' },
    { id: 'workbench', label: 'Workbench', icon: 'layout' },
    { id: 'extensions', label: 'Extensions', icon: 'package' },
    { id: 'terminal', label: 'Terminal', icon: 'terminal' }
  ];
  
  const editorSettings = [
    {
      title: 'Font Family',
      description: 'Controls the font family in the editor',
      control: (
        <select
          value={localFontFamily}
          onChange={(e) => setLocalFontFamily(e.target.value)}
          className={`px-3 py-1 rounded ${
            theme === 'dark'
              ? 'bg-[#3c3c3c] text-white border-[#5f5f5f]'
              : 'bg-white text-black border-[#d4d4d4]'
          } border`}
          title="Font Family"
          aria-label="Font Family"
        >
          <option value="Consolas, 'Courier New', monospace">Consolas, Courier New</option>
          <option value="'Fira Code', monospace">Fira Code</option>
          <option value="'JetBrains Mono', monospace">JetBrains Mono</option>
          <option value="'Source Code Pro', monospace">Source Code Pro</option>
        </select>
      )
    },
    {
      title: 'Font Size',
      description: 'Controls the font size in pixels',
      control: (
        <div className="flex items-center">
          <input
            type="number"
            min="8"
            max="32"
            value={localFontSize}
            onChange={(e) => setLocalFontSize(parseInt(e.target.value, 10))}
            className={`w-16 px-2 py-1 rounded ${
              theme === 'dark'
                ? 'bg-[#3c3c3c] text-white border-[#5f5f5f]'
                : 'bg-white text-black border-[#d4d4d4]'
            } border`}
            aria-label="Font size"
          />
          <span className="ml-2">px</span>
        </div>
      )
    },
    {
      title: 'Tab Size',
      description: 'Controls the number of spaces a tab is equal to',
      control: (
        <select
          value={localTabSize}
          onChange={(e) => setLocalTabSize(parseInt(e.target.value, 10))}
          className={`px-3 py-1 rounded ${
            theme === 'dark'
              ? 'bg-[#3c3c3c] text-white border-[#5f5f5f]'
              : 'bg-white text-black border-[#d4d4d4]'
          } border`}
          title="Tab Size"
          aria-label="Tab Size"
        >
          <option value="2">2</option>
          <option value="4">4</option>
          <option value="8">8</option>
        </select>
      )
    }
  ];
  
  const workbenchSettings = [
    {
      title: 'Color Theme',
      description: 'Specifies the color theme used in the workbench',
      control: (
        <div className="flex gap-2">
          <button
            onClick={() => setLocalTheme('dark')}
            className={`px-3 py-1 rounded-md flex items-center gap-1 ${
              localTheme === 'dark'
                ? 'bg-blue-600 text-white'
                : theme === 'dark'
                  ? 'bg-[#3c3c3c] text-white'
                  : 'bg-[#f0f0f0] text-black'
            }`}
            aria-label="Set dark theme"
          >
            {localTheme === 'dark' && <Check className="h-4 w-4" />}
            <span>Dark</span>
          </button>
          <button
            onClick={() => setLocalTheme('light')}
            className={`px-3 py-1 rounded-md flex items-center gap-1 ${
              localTheme === 'light'
                ? 'bg-blue-600 text-white'
                : theme === 'dark'
                  ? 'bg-[#3c3c3c] text-white'
                  : 'bg-[#f0f0f0] text-black'
            }`}
            aria-label="Set light theme"
          >
            {localTheme === 'light' && <Check className="h-4 w-4" />}
            <span>Light</span>
          </button>
        </div>
      )
    }
  ];
  
  // Get settings for current section
  const getCurrentSettings = () => {
    switch (activeSection) {
      case 'editor':
        return filterSettings(editorSettings);
      case 'workbench':
        return filterSettings(workbenchSettings);
      default:
        return [];
    }
  };
  
  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50`}
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-4xl h-5/6 flex flex-col rounded-lg overflow-hidden ${
          theme === 'dark' ? 'bg-[#252526] text-gray-300' : 'bg-white text-gray-800'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex justify-between items-center p-4 border-b ${
          theme === 'dark' ? 'border-[#3d3d3d]' : 'border-[#e0e0e0]'
        }`}>
          <h2 className="text-xl font-medium">Settings</h2>
          <button 
            onClick={onClose}
            className={`p-1 rounded-md ${
              theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#f0f0f0]'
            }`}
            aria-label="Close settings"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Search */}
        <div className={`px-4 py-3 border-b ${
          theme === 'dark' ? 'border-[#3d3d3d]' : 'border-[#e0e0e0]'
        }`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search settings"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full py-2 pl-10 pr-4 rounded-md ${
                theme === 'dark' 
                  ? 'bg-[#3c3c3c] border-[#3d3d3d] text-white placeholder-gray-400' 
                  : 'bg-[#f5f5f5] border-[#e0e0e0] text-gray-900 placeholder-gray-500'
              } border focus:outline-none`}
              aria-label="Search settings"
            />
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className={`w-64 flex-shrink-0 border-r overflow-y-auto ${
            theme === 'dark' ? 'bg-[#252526] border-[#3d3d3d]' : 'bg-[#f9f9f9] border-[#e0e0e0]'
          }`}>
            <div className="py-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center w-full px-4 py-2 text-left ${
                    activeSection === section.id
                      ? theme === 'dark' 
                        ? 'bg-[#37373d] text-white' 
                        : 'bg-[#e8e8e8] text-black'
                      : theme === 'dark'
                        ? 'hover:bg-[#2a2d2e] text-gray-300'
                        : 'hover:bg-[#e8e8e8] text-gray-700'
                  }`}
                  aria-label={`${section.label} settings`}
                >
                  <ChevronRight className={`h-4 w-4 mr-2 transition-transform ${
                    activeSection === section.id ? 'transform rotate-90' : ''
                  }`} />
                  <span>{section.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Settings area */}
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-lg font-medium mb-4">
              {sections.find(s => s.id === activeSection)?.label || 'Settings'}
            </h3>
            
            <div className="space-y-6">
              {getCurrentSettings().map((setting, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg ${
                    theme === 'dark' ? 'bg-[#2d2d2d]' : 'bg-[#f5f5f5]'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-medium">{setting.title}</h4>
                      {setting.description && (
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {setting.description}
                        </p>
                      )}
                    </div>
                    {setting.control}
                  </div>
                </div>
              ))}
              
              {getCurrentSettings().length === 0 && (
                <div className="text-center py-8">
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    {searchQuery 
                      ? 'No settings match your search' 
                      : 'No settings available in this section'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        {isDirty && (
          <div className={`p-4 border-t flex items-center justify-between ${
            theme === 'dark' ? 'border-[#3d3d3d] bg-[#252526]' : 'border-[#e0e0e0] bg-[#f9f9f9]'
          }`}>
            <div className="text-sm">
              <span className="text-yellow-500">*</span> You have unsaved changes
            </div>
            <div className="flex gap-3">
              <button
                onClick={resetChanges}
                className={`px-3 py-1.5 rounded flex items-center gap-1 ${
                  theme === 'dark'
                    ? 'bg-[#3c3c3c] hover:bg-[#494949] text-white'
                    : 'bg-[#e0e0e0] hover:bg-[#d0d0d0] text-black'
                }`}
                aria-label="Discard changes"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Discard</span>
              </button>
              <button
                onClick={saveChanges}
                className={`px-3 py-1.5 rounded flex items-center gap-1 ${
                  theme === 'dark'
                    ? 'bg-[#0e639c] hover:bg-[#1177bb] text-white'
                    : 'bg-[#0067c0] hover:bg-[#0078d7] text-white'
                }`}
                aria-label="Save changes"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsModal; 