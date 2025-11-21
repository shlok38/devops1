import React, { useState } from 'react';
import { Container, Download, Terminal } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { CodeBlock } from '../components/ui/CodeBlock';
import { generateDockerfile } from '../services/geminiService';
import { DockerGenParams } from '../types';

export const DockerfileGenerator: React.FC = () => {
  const [params, setParams] = useState<DockerGenParams>({
    language: 'Node.js',
    version: '18-alpine',
    port: '3000',
    envVars: 'NODE_ENV=production',
    extras: ''
  });
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setParams({ ...params, [e.target.name]: e.target.value });
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await generateDockerfile(params);
      setOutput(res);
    } catch (e) {
      setOutput('# Error generating Dockerfile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-4 flex flex-col space-y-6 overflow-y-auto pr-2 custom-scrollbar">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Container className="mr-3 text-cyan-400" />
            Dockerfile Gen
          </h2>
          <p className="text-slate-400 text-sm mt-1">Create optimized, multi-stage Dockerfiles instantly.</p>
        </div>

        <div className="space-y-4 bg-slate-900/50 p-5 rounded-xl border border-slate-800">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Language / Stack</label>
            <select 
              name="language" 
              value={params.language} 
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-slate-200 text-sm focus:border-cyan-500 outline-none"
            >
              <option>Node.js</option>
              <option>Python</option>
              <option>Go (Golang)</option>
              <option>Rust</option>
              <option>Java (Spring Boot)</option>
              <option>Nginx (Static Site)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Base Image Tag</label>
            <input 
              name="version"
              value={params.version}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-slate-200 text-sm font-mono focus:border-cyan-500 outline-none"
              placeholder="e.g. 18-alpine, 3.11-slim"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Exposed Port</label>
            <input 
              name="port"
              value={params.port}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-slate-200 text-sm font-mono focus:border-cyan-500 outline-none"
              placeholder="3000"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Environment Variables</label>
            <textarea 
              name="envVars"
              value={params.envVars}
              onChange={handleChange}
              rows={3}
              className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-slate-200 text-sm font-mono focus:border-cyan-500 outline-none resize-none"
              placeholder="KEY=VALUE"
            />
          </div>

           <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Extra Requirements</label>
            <textarea 
              name="extras"
              value={params.extras}
              onChange={handleChange}
              rows={2}
              className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-slate-200 text-sm font-mono focus:border-cyan-500 outline-none resize-none"
              placeholder="e.g. Install ffmpeg, use yarn"
            />
          </div>

          <Button onClick={handleGenerate} isLoading={loading} className="w-full">
            Generate Dockerfile
          </Button>
        </div>
      </div>

      <div className="lg:col-span-8 flex flex-col min-h-[400px]">
        <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex flex-col">
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
             <div className="flex items-center space-x-2">
               <Terminal size={16} className="text-slate-500" />
               <span className="text-xs font-mono text-slate-400">Dockerfile</span>
             </div>
             {output && (
               <button className="text-xs flex items-center text-cyan-400 hover:text-cyan-300">
                 <Download size={14} className="mr-1" /> Download
               </button>
             )}
          </div>
          <div className="flex-1 relative overflow-auto custom-scrollbar">
             {output ? (
               <div className="p-0">
                  <CodeBlock code={output} language="dockerfile" />
               </div>
             ) : (
               <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-sm">
                 Configure settings and click Generate
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};