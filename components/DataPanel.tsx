import React, { useState } from 'react';
import { RunLog } from '../types';
import { Terminal, Database, DollarSign, ChevronUp, ChevronDown } from 'lucide-react';

interface DataPanelProps {
  runHistory: RunLog[];
  logsOpen: boolean;
  onToggle: () => void;
}

export const DataPanel: React.FC<DataPanelProps> = ({ runHistory, logsOpen, onToggle }) => {
  const [activeTab, setActiveTab] = useState<'logs' | 'variables' | 'cost'>('logs');

  if (!logsOpen) {
    return (
      <div className="h-8 bg-gray-900 border-t border-gray-800 flex items-center justify-between px-4 cursor-pointer hover:bg-gray-850 transition-colors" onClick={onToggle}>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1 font-bold uppercase"><Terminal size={12} /> Data Layer</span>
          <span className="w-px h-3 bg-gray-700"></span>
          <span>{runHistory.length} Events Logged</span>
        </div>
        <ChevronUp size={14} className="text-gray-500" />
      </div>
    );
  }

  return (
    <div className="h-64 bg-gray-900 border-t border-gray-800 flex flex-col shrink-0 animate-in slide-in-from-bottom-10 fade-in duration-200">
      <div className="flex items-center justify-between px-2 bg-gray-850 border-b border-gray-800">
        <div className="flex">
          <button 
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 text-xs font-bold uppercase flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'logs' ? 'border-primary-500 text-primary-400 bg-gray-800' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
          >
            <Terminal size={12} /> Live Logs
          </button>
          <button 
            onClick={() => setActiveTab('variables')}
            className={`px-4 py-2 text-xs font-bold uppercase flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'variables' ? 'border-primary-500 text-primary-400 bg-gray-800' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
          >
            <Database size={12} /> Variables
          </button>
          <button 
            onClick={() => setActiveTab('cost')}
            className={`px-4 py-2 text-xs font-bold uppercase flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'cost' ? 'border-primary-500 text-primary-400 bg-gray-800' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
          >
            <DollarSign size={12} /> Cost Tracker
          </button>
        </div>
        <div className="flex items-center gap-2">
           <button onClick={onToggle} className="p-1 hover:bg-gray-700 rounded text-gray-500">
             <ChevronDown size={14} />
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs custom-scrollbar bg-black/20">
        {activeTab === 'logs' && (
          <div className="space-y-1">
            {runHistory.length === 0 ? (
              <div className="text-gray-600 italic">No execution logs yet. Run the workflow to see events.</div>
            ) : (
              [...runHistory].reverse().map((log, idx) => (
                <div key={log.id} className="flex gap-2">
                  <span className="text-gray-500">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                  <span className={`${log.status === 'SUCCESS' ? 'text-green-400' : log.status === 'FAILURE' ? 'text-red-400' : 'text-blue-400'}`}>
                    {log.status}
                  </span>
                  <span className="text-gray-300">
                    Finished {log.nodeCount} node(s) in {log.durationMs}ms. Cost: ${log.cost.toFixed(5)}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
        {activeTab === 'variables' && (
           <div className="text-gray-500 italic p-2">Global variables and context data will appear here.</div>
        )}
        {activeTab === 'cost' && (
           <div className="text-gray-500 italic p-2">Detailed cost breakdown by node and model will appear here.</div>
        )}
      </div>
    </div>
  );
};
