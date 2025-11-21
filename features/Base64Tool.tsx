import React, { useState, useEffect } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { CodeBlock } from '../components/ui/CodeBlock';

export const Base64Tool: React.FC = () => {
  const [text, setText] = useState('');
  const [encoded, setEncoded] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    if (!text) {
      setEncoded('');
      return;
    }

    try {
      if (mode === 'encode') {
        setEncoded(btoa(text));
      } else {
        setEncoded(atob(text));
      }
    } catch (e) {
      setError('Invalid Base64 string');
      setEncoded('');
    }
  }, [text, mode]);

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto w-full space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">Base64 Utilities</h2>
        <p className="text-slate-400">Secure client-side encoding and decoding. Data never leaves your browser.</p>
      </div>

      <div className="bg-slate-900 rounded-xl p-1 shadow-lg border border-slate-800 self-center flex">
        <button
          onClick={() => { setMode('encode'); setText(''); }}
          className={`flex items-center px-6 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'encode' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Lock className="w-4 h-4 mr-2" />
          Encoder
        </button>
        <button
          onClick={() => { setMode('decode'); setText(''); }}
          className={`flex items-center px-6 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'decode' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Unlock className="w-4 h-4 mr-2" />
          Decoder
        </button>
      </div>

      <div className="grid gap-8">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            {mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={`w-full h-32 bg-slate-800/50 border ${error ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700 focus:border-cyan-500'} rounded-lg p-4 text-slate-200 font-mono text-sm focus:ring-1 focus:ring-cyan-500 outline-none transition-colors`}
            placeholder={mode === 'encode' ? 'Type secret message...' : 'Paste base64 string...'}
          />
          {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">Result</label>
          <div className="bg-slate-950 rounded-lg border border-slate-800">
             <CodeBlock code={encoded || '// Result will appear here'} label={mode === 'encode' ? 'BASE64' : 'PLAINTEXT'} />
          </div>
        </div>
      </div>
    </div>
  );
};