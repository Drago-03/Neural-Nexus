"use client";

import React from 'react';
import { Code, X, Copy, ExternalLink } from 'lucide-react';

interface CodeSamplesPanelProps {
  theme: 'dark' | 'light';
  onClose: () => void;
  onSelectSample: (code: string, language: string) => void;
}

// Code samples with different languages
const CODE_SAMPLES = [
  {
    name: "Gen Z Functions",
    language: "javascript",
    description: "Simple functions using Gen Z slang",
    code: `// Vibe check function - returns slang based on the mood
function vibeCheck(mood) {
  if (mood === 'bussin') {
    return 'no cap, fr fr';
  } else {
    return 'mid, tbh';
  }
}

// Send it function - just sends it
const sendIt = () => {
  console.log("sending it...");
  return "sent!";
};

// Execute the functions
vibeCheck('bussin');
sendIt();`
  },
  {
    name: "React Button",
    language: "jsx",
    description: "A simple React button component",
    code: `import React from 'react';

const Button = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-6 py-2 rounded-md font-medium text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 transition-opacity"
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
    description: "Simple TensorFlow.js neural network",
    code: `// Create a simple neural network model
const model = tf.sequential();

// Add layers to the model
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

// Ready for training...`
  },
  {
    name: "CSS Animation",
    language: "css",
    description: "Cool gradient animation",
    code: `.gradient-bg {
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 3rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}`
  },
  {
    name: "Python Data Analysis",
    language: "python",
    description: "Basic data analysis with pandas",
    code: `import pandas as pd
import matplotlib.pyplot as plt

# Load data from CSV
df = pd.read_csv('data.csv')

# Display basic stats
print(df.describe())

# Create a simple visualization
plt.figure(figsize=(10, 6))
df['score'].hist(bins=20, alpha=0.8)
plt.title('Distribution of Scores')
plt.xlabel('Score')
plt.ylabel('Frequency')
plt.grid(alpha=0.3)
plt.show()`
  },
  {
    name: "React Hook",
    language: "jsx",
    description: "Custom React hook for dark mode",
    code: `import { useState, useEffect } from 'react';

function useDarkMode() {
  // Initialize state from localStorage or system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return JSON.parse(savedMode);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Effect to handle changes
  useEffect(() => {
    // Update localStorage
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    
    // Update document classes
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Return state and toggle function
  return [isDarkMode, setIsDarkMode];
}

export default useDarkMode;`
  }
];

export default function CodeSamplesPanel({ theme, onClose, onSelectSample }: CodeSamplesPanelProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div 
        className={`px-4 py-3 border-b flex justify-between items-center ${
          theme === 'dark' ? 'bg-[#252526] border-[#3d3d3d]' : 'bg-[#f3f3f3] border-[#e0e0e0]'
        }`}
      >
        <div className="flex items-center">
          <Code className="h-5 w-5 mr-2 text-purple-500" />
          <h3 className="font-medium">Code Samples</h3>
        </div>
        <button 
          onClick={onClose}
          className={`p-1 rounded-sm ${theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e5e5e5]'}`}
          aria-label="Close Code Samples"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      {/* Samples list */}
      <div 
        className={`flex-1 overflow-y-auto p-4 space-y-4 ${
          theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white'
        }`}
      >
        <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Click on any sample to load it in the editor
        </p>
        
        <div className="grid grid-cols-1 gap-4">
          {CODE_SAMPLES.map((sample, index) => (
            <div 
              key={index}
              onClick={() => onSelectSample(sample.code, sample.language)}
              className={`cursor-pointer rounded-lg p-4 border transition-colors ${
                theme === 'dark' 
                  ? 'bg-[#2d2d2d] border-[#3d3d3d] hover:bg-[#3a3a3a]' 
                  : 'bg-[#f9f9f9] border-[#e0e0e0] hover:bg-[#f0f0f0]'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">{sample.name}</h4>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {sample.description}
                  </p>
                </div>
                <div className={`px-2 py-1 text-xs rounded ${
                  theme === 'dark' ? 'bg-[#0e639c] text-white' : 'bg-[#e8f5fe] text-[#0078d4]'
                }`}>
                  {sample.language}
                </div>
              </div>
              
              <div className={`mt-3 text-xs font-mono p-2 rounded max-h-32 overflow-hidden relative ${
                theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-[#f0f0f0]'
              }`}>
                <pre className="opacity-75">{sample.code.split('\n').slice(0, 5).join('\n')}
{sample.code.split('\n').length > 5 ? '...' : ''}</pre>
                
                <div className={`absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity ${
                  theme === 'dark' ? 'bg-[#1a1a1a]/80' : 'bg-[#f0f0f0]/80'
                }`}>
                  <button className={`px-3 py-1.5 rounded text-sm flex items-center ${
                    theme === 'dark' ? 'bg-[#3c3c3c] hover:bg-[#4c4c4c] text-white' : 'bg-[#e5e5e5] hover:bg-[#d5d5d5] text-black'
                  }`}>
                    <Copy className="h-3.5 w-3.5 mr-1.5" />
                    <span>Use this Sample</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <div className={`p-3 border-t text-center text-xs ${
        theme === 'dark' ? 'border-[#3d3d3d] bg-[#252526] text-gray-400' : 'border-[#e0e0e0] bg-[#f3f3f3] text-gray-600'
      }`}>
        <a 
          href="https://github.com/yourusername/neural-nexus" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center hover:underline"
        >
          <span>Find more code samples on GitHub</span>
          <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      </div>
    </div>
  );
} 