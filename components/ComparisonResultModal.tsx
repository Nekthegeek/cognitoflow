
import React from 'react';
import { NodeConfig } from '../types';
import { X, Trophy, DollarSign, Clock, Check } from 'lucide-react';

interface ComparisonResult {
  nodeId: string;
  modelConfig: NodeConfig;
  output: string;
  cost: number;
  durationMs: number;
  score?: number;
}

interface ComparisonResultModalProps {
  results: ComparisonResult[];
  onSelectWinner: (nodeId: string) => void;
  onClose: () => void;
}

export const ComparisonResultModal: React.FC<ComparisonResultModalProps> = ({ results, onSelectWinner, onClose }) => {
  // Simple heuristic for winner: highest score, or lowest cost if no score
  const sortedResults = [...results].sort((a, b) => {
    if (a.score !== undefined && b.score !== undefined) return b.score - a.score;
    return a.cost - b.cost;
  });
  const winnerId = sortedResults[0]?.nodeId;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-gray-950 border border-gray-800 rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2">
              <Trophy className="text-yellow-500" size={24} /> Model Comparison Results
            </h2>
            <p className="text-sm text-gray-500">Select the best performing model for this task.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg text-gray-500 hover:text-white transition-colors">
            Close
          </button>
        </div>

        <div className="flex-1 overflow-x-auto p-6 bg-gray-900/30 custom-scrollbar">
          <div className="flex gap-6 min-w-max h-full">
            {results.map((result) => {
              const isWinner = result.nodeId === winnerId;
              return (
                <div 
                  key={result.nodeId} 
                  className={`w-[400px] flex flex-col bg-gray-900 border rounded-xl overflow-hidden transition-all
                    ${isWinner ? 'border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.1)]' : 'border-gray-800 hover:border-gray-700'}
                  `}
                >
                  <div className={`p-4 border-b ${isWinner ? 'bg-yellow-900/10 border-yellow-500/20' : 'border-gray-800'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-gray-400 uppercase">Model</span>
                      {isWinner && <span className="text-[10px] bg-yellow-500 text-black font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Trophy size={10} /> Recommended</span>}
                    </div>
                    <h3 className="text-lg font-bold text-gray-200">{result.modelConfig.model}</h3>
                    <div className="flex gap-2 mt-2 text-[10px] text-gray-500 font-mono">
                      <span>Temp: {result.modelConfig.temperature}</span>
                      <span>TopP: {result.modelConfig.topP}</span>
                    </div>
                  </div>

                  <div className="flex-1 p-4 overflow-y-auto custom-scrollbar border-b border-gray-800 bg-black/20">
                    <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">{result.output}</pre>
                  </div>

                  <div className="p-4 bg-gray-900">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-800 rounded p-2">
                        <span className="text-[10px] text-gray-500 uppercase block mb-1">Cost</span>
                        <div className="text-sm font-mono text-green-400 flex items-center gap-1">
                          <DollarSign size={12} /> {result.cost.toFixed(5)}
                        </div>
                      </div>
                      <div className="bg-gray-800 rounded p-2">
                        <span className="text-[10px] text-gray-500 uppercase block mb-1">Duration</span>
                        <div className="text-sm font-mono text-blue-400 flex items-center gap-1">
                          <Clock size={12} /> {result.durationMs}ms
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => onSelectWinner(result.nodeId)}
                      className={`w-full py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors
                        ${isWinner ? 'bg-yellow-600 hover:bg-yellow-500 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-300'}
                      `}
                    >
                      {isWinner ? 'Select Winner' : 'Select This Model'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
