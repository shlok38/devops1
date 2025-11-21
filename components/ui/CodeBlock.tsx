import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  label?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'text', label }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-lg overflow-hidden border border-slate-700 bg-slate-900 shadow-md">
      {(label || language) && (
        <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
          <span className="text-xs font-mono text-slate-400 uppercase">{label || language}</span>
          <button 
            onClick={handleCopy}
            className="text-slate-400 hover:text-cyan-400 transition-colors"
            title="Copy to clipboard"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
      )}
      <div className="p-4 overflow-x-auto custom-scrollbar">
        <pre className="text-sm font-mono text-slate-300 leading-relaxed whitespace-pre-wrap break-all">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};