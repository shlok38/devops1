import React from 'react';
import { ToolType } from '../types';
import { Terminal, FileJson, Lock, Clock, Container, Box, Shield } from 'lucide-react';

interface LayoutProps {
  currentTool: ToolType;
  onToolChange: (tool: ToolType) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentTool, onToolChange, children }) => {
  const navItems = [
    { id: ToolType.YAML_JSON, label: 'YAML <> JSON', icon: FileJson },
    { id: ToolType.BASE64, label: 'Base64 Tool', icon: Lock },
    { id: ToolType.CRON, label: 'Cron Helper', icon: Clock },
    { id: ToolType.SSH_GEN, label: 'SSH Helper', icon: Shield },
    { id: ToolType.DOCKERFILE, label: 'Dockerfile Gen', icon: Container },
    { id: ToolType.K8S_MANIFEST, label: 'K8s Manifest', icon: Box },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 flex-shrink-0 border-r border-slate-800 flex flex-col bg-slate-950 z-10">
        <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-800">
          <div className="bg-cyan-600 p-1.5 rounded-md mr-0 lg:mr-3 shadow-lg shadow-cyan-900/50">
            <Terminal className="text-white w-6 h-6" />
          </div>
          <span className="hidden lg:block font-bold text-lg tracking-tight text-white">DevOps<span className="text-cyan-500">Tool</span></span>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 space-y-1 px-2 lg:px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTool === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onToolChange(item.id)}
                className={`w-full flex items-center justify-center lg:justify-start px-2 lg:px-4 py-3 rounded-lg transition-all duration-200 group
                  ${isActive 
                    ? 'bg-slate-800 text-cyan-400 shadow-md border border-slate-700' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
              >
                <Icon className={`w-5 h-5 lg:mr-3 ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span className="hidden lg:block font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 hidden lg:block">
           <div className="text-xs text-slate-500 text-center">
             v1.0.0 &bull; Powered by Gemini
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col relative">
        {/* Header Gradient Line */}
        <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500" />
        
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar scroll-smooth">
           <div className="max-w-7xl mx-auto h-full">
             {children}
           </div>
        </div>
      </main>
    </div>
  );
};