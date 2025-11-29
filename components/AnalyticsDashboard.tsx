

import React from 'react';
import { AnalyticsMetrics, OptimizationSuggestion } from '../types';
import { X, DollarSign, Clock, Zap, Lightbulb, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

interface AnalyticsDashboardProps {
  metrics: AnalyticsMetrics;
  suggestions: OptimizationSuggestion[];
  onClose: () => void;
  onApplySuggestion: (suggestionId: string) => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ metrics, suggestions, onClose, onApplySuggestion }) => {
  return (
    <div className="fixed right-0 top-0 h-full w-[400px] bg-gray-950 border-l border-gray-800 shadow-2xl z-50 flex flex-col transition-transform duration-300">
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div>
          <h2 className="text-sm font-bold text-gray-100 uppercase tracking-wider flex items-center gap-2">
             <ActivityIcon className="text-primary-500" /> Flow Analytics
          </h2>
          <p className="text-[10px] text-gray-500">Real-time performance metrics</p>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-6">
        
        {/* Metrics Cards */}
        <div className="grid grid-cols-2 gap-3">
           <div className="bg-gray-900 border border-gray-800 p-3 rounded-lg">
              <div className="text-[10px] text-gray-500 uppercase font-bold mb-1 flex items-center gap-1">
                 <DollarSign size={12} className="text-green-500" /> Est. Cost
              </div>
              <div className="text-xl font-mono text-gray-200">${metrics.estimatedCost.toFixed(4)}</div>
           </div>
           <div className="bg-gray-900 border border-gray-800 p-3 rounded-lg">
              <div className="text-[10px] text-gray-500 uppercase font-bold mb-1 flex items-center gap-1">
                 <Clock size={12} className="text-blue-500" /> Duration
              </div>
              <div className="text-xl font-mono text-gray-200">{(metrics.executionTimeMs / 1000).toFixed(2)}s</div>
           </div>
           <div className="bg-gray-900 border border-gray-800 p-3 rounded-lg col-span-2">
              <div className="text-[10px] text-gray-500 uppercase font-bold mb-1 flex items-center gap-1">
                 <Zap size={12} className="text-yellow-500" /> Token Usage
              </div>
              <div className="flex justify-between items-end">
                 <div>
                    <span className="text-xs text-gray-500">Input</span>
                    <div className="text-lg font-mono text-gray-200">{metrics.tokensInput}</div>
                 </div>
                 <div className="text-right">
                    <span className="text-xs text-gray-500">Output</span>
                    <div className="text-lg font-mono text-gray-200">{metrics.tokensOutput}</div>
                 </div>
              </div>
           </div>
        </div>

        {/* Suggestions */}
        <div>
           <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
              <Lightbulb size={14} className="text-yellow-400" /> AI Optimizations
           </h3>
           
           {suggestions.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-gray-800 rounded-lg">
                 <CheckCircle size={24} className="mx-auto text-green-500/50 mb-2" />
                 <p className="text-xs text-gray-500">No optimizations found. Flow is healthy.</p>
              </div>
           ) : (
              <div className="space-y-3">
                 {suggestions.map(suggestion => (
                    <div key={suggestion.id} className="bg-gray-900 border border-gray-800 rounded-lg p-3 hover:border-gray-700 transition-colors">
                       <div className="flex items-start gap-3">
                          <div className={`p-1.5 rounded mt-0.5
                             ${suggestion.type === 'COST' ? 'bg-green-900/30 text-green-400' :
                               suggestion.type === 'EFFICIENCY' ? 'bg-blue-900/30 text-blue-400' :
                               'bg-purple-900/30 text-purple-400'}
                          `}>
                             {suggestion.type === 'COST' && <DollarSign size={14} />}
                             {suggestion.type === 'EFFICIENCY' && <Zap size={14} />}
                             {suggestion.type === 'QUALITY' && <AlertTriangle size={14} />}
                          </div>
                          <div className="flex-1">
                             <h4 className="text-sm font-bold text-gray-200 mb-1">{suggestion.title}</h4>
                             <p className="text-xs text-gray-400 leading-relaxed mb-3">{suggestion.description}</p>
                             <button 
                               onClick={() => onApplySuggestion(suggestion.id)}
                               className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded flex items-center gap-2 transition-colors"
                             >
                                Apply Fix <ArrowRight size={12} />
                             </button>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           )}
        </div>
      </div>
    </div>
  );
};

// Helper icon
const ActivityIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="16" height="16" viewBox="0 0 24 24" 
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    className={className}
  >
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);