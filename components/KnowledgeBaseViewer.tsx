

import React, { useState } from 'react';
import { MemoryEntry } from '../types';
import { Database, X, Brain, Search, Sparkles } from 'lucide-react';

interface KnowledgeBaseViewerProps {
  knowledgeBase?: MemoryEntry[];
  onClose: () => void;
}

export const KnowledgeBaseViewer: React.FC<KnowledgeBaseViewerProps> = ({ knowledgeBase = [], onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock semantic search filter (in reality this would be vector search)
  const filteredMemories = knowledgeBase.filter(m => 
     m.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
     m.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-gray-950 border border-gray-800 rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                <Brain size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-100">Cognitive Memory Layer</h2>
              <p className="text-sm text-gray-500">Persistent, cross-flow knowledge graph.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg text-gray-500 hover:text-white transition-colors">
            Close
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-800 bg-gray-900/30">
            <div className="relative">
                <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" size={16} />
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Semantic search (e.g., 'decisions about pricing')..."
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-sm text-gray-200 focus:ring-1 focus:ring-indigo-500 outline-none placeholder-gray-600"
                />
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-900/10 custom-scrollbar">
            {knowledgeBase.length > 0 ? (
                <div className="space-y-4">
                    {filteredMemories.map((memory) => (
                        <div key={memory.id} className="bg-gray-900 border border-gray-800 rounded-lg p-5 hover:border-indigo-500/30 transition-all group">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex gap-2">
                                    {memory.tags.map(tag => (
                                        <span key={tag} className="text-[10px] uppercase font-bold text-indigo-300 bg-indigo-900/30 px-2 py-0.5 rounded">{tag}</span>
                                    ))}
                                </div>
                                <span className="text-[10px] text-gray-600 font-mono">{new Date(memory.timestamp).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-gray-300 mb-3 leading-relaxed">
                                {memory.content}
                            </p>
                            <div className="flex items-center justify-between text-[10px] text-gray-500 border-t border-gray-800 pt-3 mt-2">
                                <span>Source Agent: <span className="text-gray-400 font-bold">{memory.sourceAgentId.substring(0,8)}</span></span>
                                <span>Confidence: {(memory.confidenceScore * 100).toFixed(0)}%</span>
                            </div>
                        </div>
                    ))}
                    {filteredMemories.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                             No memories found matching "{searchTerm}".
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-20 text-gray-600">
                    <Database size={48} className="mx-auto mb-4 opacity-30" />
                    <h3 className="text-lg font-bold text-gray-500">Memory Empty</h3>
                    <p className="text-sm mt-2 max-w-sm mx-auto">Agents with "Long-Term Memory" enabled will automatically populate this layer with key learnings and decisions.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};