import React, { useState, useEffect } from 'react';
import { Box, Activity } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { CodeBlock } from '../components/ui/CodeBlock';
import { generateK8sManifest } from '../services/geminiService';
import { K8sGenParams } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const K8sGenerator: React.FC = () => {
  const [params, setParams] = useState<K8sGenParams>({
    kind: 'Deployment',
    name: 'my-app',
    image: 'nginx:latest',
    replicas: 3,
    namespace: 'default',
    port: 80
  });
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any[]>([]);

  // Simulate calculating stats based on replicas
  useEffect(() => {
    // Assuming default limits per pod: 0.5 CPU, 512Mi RAM
    const cpuPerPod = 0.5;
    const memPerPod = 512;
    
    setStats([
      {
        name: 'CPU Cores',
        Requested: params.replicas * (cpuPerPod * 0.5), // Request is usually lower
        Limit: params.replicas * cpuPerPod,
      },
      {
        name: 'Memory (MiB)',
        Requested: params.replicas * (memPerPod * 0.5),
        Limit: params.replicas * memPerPod,
      }
    ]);
  }, [params.replicas]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
    setParams({ ...params, [e.target.name]: val });
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await generateK8sManifest(params);
      setOutput(res);
    } catch (e) {
      setOutput('# Error generating Manifest.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Box className="mr-3 text-cyan-400" />
            K8s Manifest Gen
          </h2>
          <p className="text-slate-400 text-sm mt-1">Generate Deployments, Services, and Pods with resource best practices.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Inputs */}
        <div className="lg:col-span-1 bg-slate-900/50 p-5 rounded-xl border border-slate-800 h-fit space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
               <label className="block text-xs font-medium text-slate-400 mb-1">Kind</label>
                <select 
                  name="kind" 
                  value={params.kind} 
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-slate-200 text-sm focus:border-cyan-500 outline-none"
                >
                  <option>Deployment</option>
                  <option>Service</option>
                  <option>Pod</option>
                  <option>StatefulSet</option>
                </select>
            </div>
            
            <div>
               <label className="block text-xs font-medium text-slate-400 mb-1">Name</label>
               <input 
                 name="name"
                 value={params.name}
                 onChange={handleChange}
                 className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-slate-200 text-sm focus:border-cyan-500 outline-none"
               />
            </div>
             <div>
               <label className="block text-xs font-medium text-slate-400 mb-1">Namespace</label>
               <input 
                 name="namespace"
                 value={params.namespace}
                 onChange={handleChange}
                 className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-slate-200 text-sm focus:border-cyan-500 outline-none"
               />
            </div>
            
            <div className="col-span-2">
               <label className="block text-xs font-medium text-slate-400 mb-1">Image</label>
               <input 
                 name="image"
                 value={params.image}
                 onChange={handleChange}
                 placeholder="e.g. nginx:1.21"
                 className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-slate-200 text-sm font-mono focus:border-cyan-500 outline-none"
               />
            </div>

            <div>
               <label className="block text-xs font-medium text-slate-400 mb-1">Replicas</label>
               <input 
                 name="replicas"
                 type="number"
                 min="1"
                 max="50"
                 value={params.replicas}
                 onChange={handleChange}
                 className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-slate-200 text-sm focus:border-cyan-500 outline-none"
               />
            </div>
             <div>
               <label className="block text-xs font-medium text-slate-400 mb-1">Port</label>
               <input 
                 name="port"
                 type="number"
                 value={params.port}
                 onChange={handleChange}
                 className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-slate-200 text-sm focus:border-cyan-500 outline-none"
               />
            </div>
          </div>
          <Button onClick={handleGenerate} isLoading={loading} className="w-full">
            Generate YAML
          </Button>

          {/* Resource Viz */}
          <div className="pt-4 border-t border-slate-800 mt-4">
            <div className="flex items-center text-slate-400 text-xs font-bold mb-4 uppercase">
              <Activity size={12} className="mr-2" /> Estimated Resource Pool
            </div>
            <div className="h-48 w-full">
               <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                    itemStyle={{ color: '#f8fafc' }}
                    cursor={{fill: '#1e293b'}}
                  />
                  <Bar dataKey="Requested" fill="#0891b2" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="Limit" fill="#ec4899" radius={[4, 4, 0, 0]} barSize={20} />
                  <Legend wrapperStyle={{fontSize: '10px', paddingTop: '10px'}} />
                </BarChart>
              </ResponsiveContainer>
            </div>
             <p className="text-[10px] text-slate-500 text-center mt-2">Based on generic default limits per pod.</p>
          </div>
        </div>

        {/* Output */}
        <div className="lg:col-span-2 flex flex-col min-h-[400px]">
          <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden relative">
            {output ? (
              <CodeBlock code={output} language="yaml" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-sm">
                Manifest YAML will appear here
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};