

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, X, Loader2 } from 'lucide-react';

interface NaturalLanguageCommanderProps {
  onCommand: (command: string) => void;
  onClose: () => void;
  isProcessing: boolean;
}

export const NaturalLanguageCommander: React.FC<NaturalLanguageCommanderProps> = ({ onCommand, onClose, isProcessing }) => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onCommand(input);
      setInput('');
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50">
      <div className="bg-gray-900/95 border border-primary-500/50 rounded-2xl shadow-[0_0_40px_rgba(79,70,229,0.2)] backdrop-blur-xl overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
        <div className="flex items-center justify-between px-4 py-3 bg-primary-900/20 border-b border-primary-500/20">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-primary-400" />
            <span className="text-xs font-bold text-primary-200 uppercase tracking-wider">AI Workflow Editor</span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={14} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-2 flex gap-2 items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Try "Add a critique step after the search node" or "Make all tasks run in parallel"...'
            className="flex-1 bg-transparent border-none text-gray-200 placeholder-gray-500 focus:ring-0 text-sm px-3 py-2"
            disabled={isProcessing}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isProcessing}
            className="p-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
};