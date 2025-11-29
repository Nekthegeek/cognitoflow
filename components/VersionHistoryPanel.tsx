import React from 'react';
import { FlowVersion } from '../types';
import { GitBranch, Clock, RotateCcw, X } from 'lucide-react';

interface VersionHistoryPanelProps {
  versions: FlowVersion[];
  onRestore: (version: FlowVersion) => void;
  onClose: () => void;
}

export const VersionHistoryPanel: React.FC<VersionHistoryPanelProps> = ({ versions, onRestore, onClose }) => {
  return (
    <div className="fixed left-0 top-0 h-full w-[300px] bg-gray-950 border-r border-gray-800 shadow-2xl z-50 flex flex-col transition-transform duration-300">
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <h2 className="text-sm font-bold text-gray-100 uppercase tracking-wider flex items-center gap-2">
           <GitBranch size={16} className="text-primary-500" /> Version History
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3">
        {versions.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <GitBranch size={24} className="mx-auto mb-2 opacity-50" />
            <p className="text-xs">No saved versions yet.</p>
            <p className="text-[10px] mt-1">Create a snapshot to track progress.</p>
          </div>
        ) : (
          [...versions].reverse().map((version) => (
            <div key={version.id} className="bg-gray-900 border border-gray-800 rounded p-3 hover:border-gray-600 transition-colors group">
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold text-gray-200">{version.label}</span>
                <span className="text-[10px] text-gray-600 font-mono">{new Date(version.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-gray-500 mb-3">
                 <Clock size={10} />
                 <span>{new Date(version.timestamp).toLocaleDateString()}</span>
              </div>
              
              <button 
                onClick={() => onRestore(version)}
                className="w-full py-1.5 bg-gray-800 hover:bg-gray-700 text-primary-400 text-xs rounded flex items-center justify-center gap-2 transition-colors opacity-80 hover:opacity-100"
              >
                <RotateCcw size={12} /> Restore Snapshot
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};