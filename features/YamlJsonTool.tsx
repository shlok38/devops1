import React, { useState } from 'react';
import { ArrowRightLeft, ArrowUpDown, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { CodeBlock } from '../components/ui/CodeBlock';
import { convertYamlJson } from '../services/geminiService';

export const YamlJsonTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'yaml2json' | 'json2yaml'>('yaml2json');
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async () => {
    setError(null);
    setOutput(''); // Clear previous output to indicate new request
    
    if (!input.trim()) {
      setError("Please enter content to convert.");
      return;
    }

    // Local JSON validation before sending to AI
    if (mode === 'json2yaml') {
      try {
        JSON.parse(input);
      } catch (e) {
        setError(`Invalid JSON input: ${(e as Error).message}`);
        return;
      }
    }

    setLoading(true);
    try {
      const result = await convertYamlJson(input, mode === 'yaml2json');
      if (result.startsWith("Error") || result.includes("No response")) {
         setError(result);
      } else {
         setOutput(result);
      }
    } catch (e) {
      setError("An unexpected error occurred during conversion.");
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    setInput(output);
    setOutput(input);
    setMode(prev => prev === 'yaml2json' ? 'json2yaml' : 'yaml2json');
    setError(null);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">YAML <span className="text-cyan-400">&harr;</span> JSON</h2>
          <p className="text-slate-400 text-sm">Smart conversion powered by Gemini AI. Handles complex nesting and comments.</p>
        </div>
        <div className="flex bg-slate-800 p-1 rounded-lg self-start items-center shadow-sm border border-slate-700">
          <button
            onClick={() => setMode('yaml2json')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${mode === 'yaml2json' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            YAML &rarr; JSON
          </button>
          <button
            onClick={() => setMode('json2yaml')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${mode === 'json2yaml' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            JSON &rarr; YAML
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        <div className="flex flex-col min-h-[300px]">
          <div className="flex items-center justify-between mb-2 ml-1">
            <label className="text-sm font-bold text-slate-300 flex items-center">
              {mode === 'yaml2json' ? 'Input YAML' : 'Input JSON'}
              {error && <AlertTriangle className="ml-2 text-red-500 w-4 h-4" />}
            </label>
            <button onClick={handleClear} className="text-xs text-slate-500 hover:text-red-400 flex items-center transition-colors px-2 py-1 rounded hover:bg-slate-800">
              <Trash2 size={12} className="mr-1" /> Clear
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(null); }}
            placeholder={mode === 'yaml2json' ? "Paste YAML here...\n\nname: MyApp\nversion: 1.0" : "Paste JSON here...\n\n{\n  \"name\": \"MyApp\",\n  \"version\": \"1.0\"\n}"}
            className={`flex-1 bg-slate-900 border rounded-lg p-4 font-mono text-sm text-slate-200 focus:ring-1 outline-none custom-scrollbar resize-none transition-colors ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-700 focus:border-cyan-500 focus:ring-cyan-500'}`}
          />
          {error && <div className="text-xs text-red-400 mt-2 px-1 font-mono">{error}</div>}
        </div>

        <div className="flex flex-col min-h-[300px] relative">
          {/* Swap Button centered on desktop, hidden or differently placed on mobile if needed */}
          <div className="absolute top-1/2 -left-3 lg:left-auto lg:-left-9 transform -translate-y-1/2 z-10 hidden lg:block">
             <button 
               onClick={handleSwap}
               disabled={!output && !input}
               className="p-2 bg-slate-800 border border-slate-700 rounded-full text-slate-400 hover:text-cyan-400 hover:border-cyan-500 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
               title="Swap Input/Output"
             >
               <ArrowRightLeft size={16} />
             </button>
          </div>
          
           {/* Mobile Swap Button */}
           <div className="lg:hidden flex justify-center my-2">
             <button 
               onClick={handleSwap}
               disabled={!output && !input}
               className="flex items-center px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-slate-400 hover:text-cyan-400 text-xs disabled:opacity-50"
             >
               <ArrowUpDown size={12} className="mr-2" /> Swap Input/Output
             </button>
           </div>

          <div className="flex items-center justify-between mb-2 ml-1">
             <label className="text-sm font-bold text-slate-300">{mode === 'yaml2json' ? 'Output JSON' : 'Output YAML'}</label>
             {loading && <span className="text-xs text-cyan-400 animate-pulse font-mono">Processing...</span>}
          </div>
          <div className="flex-1 relative">
            {output ? (
              <div className="absolute inset-0 overflow-hidden">
                 <CodeBlock code={output} language={mode === 'yaml2json' ? 'json' : 'yaml'} />
              </div>
            ) : error ? (
              <div className="flex-1 h-full bg-red-500/5 border border-red-500/20 rounded-lg flex flex-col items-center justify-center text-red-400 p-6 text-center animate-in fade-in">
                 <AlertTriangle className="w-8 h-8 mb-2 opacity-50" />
                 <span className="font-medium">Conversion Failed</span>
                 <span className="text-sm mt-1 opacity-80">{error}</span>
              </div>
            ) : (
              <div className="flex-1 h-full bg-slate-900/30 border border-slate-800 border-dashed rounded-lg flex items-center justify-center text-slate-600">
                <span className="text-sm">Output will appear here</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
         <Button onClick={handleConvert} disabled={!input.trim()} isLoading={loading} size="lg" className="w-full sm:w-auto shadow-cyan-900/20 shadow-lg">
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            {mode === 'yaml2json' ? 'Convert to JSON' : 'Convert to YAML'}
         </Button>
      </div>
    </div>
  );
};