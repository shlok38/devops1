import React, { useState } from 'react';
import { Clock, HelpCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { convertCron } from '../services/geminiService';

export const CronTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProcess = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const response = await convertCron(input);
      setResult(response);
    } catch (e) {
      setResult("Error processing cron expression.");
    } finally {
      setLoading(false);
    }
  };

  const examples = [
    "*/15 * * * *",
    "Every Friday at 5pm",
    "0 0 1 1 *",
    "Run every 5 minutes between 9am and 5pm"
  ];

  return (
    <div className="max-w-3xl mx-auto h-full flex flex-col space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Clock className="mr-3 text-cyan-400" /> 
          Cron Translator
        </h2>
        <p className="text-slate-400">
          Type a Cron expression to get an explanation, OR type plain English to get a Cron expression.
        </p>
      </div>

      <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 space-y-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Expression or Description</label>
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleProcess()}
              placeholder="e.g., */5 * * * * OR 'Every day at midnight'"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 pl-4 pr-32 text-slate-200 font-mono focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
            />
            <div className="absolute right-2 top-2">
              <Button size="sm" onClick={handleProcess} isLoading={loading} disabled={!input.trim()}>
                Translate
              </Button>
            </div>
          </div>
        </div>

        {result && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-cyan-900/50 rounded-lg p-6 shadow-inner">
              <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-wider mb-2">Result</h3>
              <p className="text-lg sm:text-xl text-white font-medium leading-relaxed">{result}</p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Try an example</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {examples.map((ex, i) => (
            <button
              key={i}
              onClick={() => setInput(ex)}
              className="text-left px-4 py-3 bg-slate-900 border border-slate-800 hover:border-cyan-700/50 hover:bg-slate-800 rounded-lg text-slate-300 text-sm font-mono transition-all"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};