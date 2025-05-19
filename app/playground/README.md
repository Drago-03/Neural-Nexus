# Neural Nexus Playground

A full-featured VS Code-like playground for web development.

## Features

- 🔥 Modern code editor with syntax highlighting
- 🌓 Dark/light theme support 
- 🧩 Extension marketplace for downloading plugins
- 🖥️ Terminal with command execution
- ☁️ Cloud shell for remote command execution
- 🗄️ File explorer with GitHub integration
- 👀 Live preview of HTML/CSS/JavaScript
- ⚙️ Customizable settings (font, size, indentation)
- 📦 Extension ecosystem

## Components

- **CodeEditor**: Core editing component with line numbers, syntax highlighting
- **Terminal**: Interactive terminal for command outputs
- **CloudShell**: Remote terminal with cloud capabilities
- **FileExplorer**: Navigation through project files
- **ExtensionMarketplace**: Browse and install extensions
- **PreviewWindow**: Live rendering of code
- **SettingsModal**: Customize editor preferences

## Usage

The playground is accessible from the `/playground` route. All components can be imported individually:

```tsx
import { 
  CodeEditor, 
  Terminal, 
  CloudShell, 
  FileExplorer,
  ExtensionMarketplace,
  PreviewWindow,
  SettingsModal
} from '@/app/playground';
```

## Extension System

Extensions can be downloaded from GitHub and integrated directly into the playground.
Check out the `/extensions` page for available extensions. 