import React, { useState } from 'react';
import { Shield, Terminal, Key } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { CodeBlock } from '../components/ui/CodeBlock';
import { generateSshCommand } from '../services/geminiService';

export const SshTool: React.FC = () => {
  const [email, setEmail] = useState('');
  const [type, setType] = useState('ed25519');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await generateSshCommand(email, type);
      setOutput(res);
    } catch (e) {
      setOutput("Error generating command.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-full flex flex-col space-y-8">
       <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Shield className="mr-3 text-cyan-400" /> 
          SSH Key Gen Helper
        </h2>
        <p className="text-slate-400">
          Generate the correct terminal commands to create secure SSH keys for GitHub, GitLab, or servers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl space-y-5">
             <div>
               <label className="block text-sm font-medium text-slate-300 mb-2">Key Type</label>
               <div className="grid grid-cols-2 gap-3">
                 <button 
                    onClick={() => setType('ed25519')}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${type === 'ed25519' ? 'border-cyan-500 bg-cyan-900/20 text-white' : 'border-slate-700 bg-slate-950 text-slate-400 hover:border-slate-600'}`}
                 >
                    Ed25519 (Recommended)
                 </button>
                 <button 
                    onClick={() => setType('rsa')}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${type === 'rsa' ? 'border-cyan-500 bg-cyan-900/20 text-white' : 'border-slate-700 bg-slate-950 text-slate-400 hover:border-slate-600'}`}
                 >
                    RSA 4096
                 </button>
               </div>
             </div>

             <div>
               <label className="block text-sm font-medium text-slate-300 mb-2">Comment (Email)</label>
               <input 
                 type="email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 placeholder="devops@example.com"
                 className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:border-cyan-500 outline-none"
               />
             </div>

             <Button onClick={handleGenerate} isLoading={loading} disabled={!email} className="w-full">
                <Terminal className="w-4 h-4 mr-2" />
                Generate Command
             </Button>
         </div>

         <div className="space-y-4">
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 flex items-center space-x-4">
               <div className="p-3 bg-yellow-900/20 rounded-full">
                 <Key className="text-yellow-500 w-6 h-6" />
               </div>
               <div>
                 <h4 className="text-slate-200 font-medium text-sm">Why Ed25519?</h4>
                 <p className="text-slate-500 text-xs mt-1">It's more secure and faster than RSA. It's the modern standard for SSH keys.</p>
               </div>
            </div>

            {output && (
               <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Run this in terminal</label>
                  <CodeBlock code={output} language="bash" />
               </div>
            )}
         </div>
      </div>
    </div>
  );
};