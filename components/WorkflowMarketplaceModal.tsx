

import React, { useState } from 'react';
import { MarketplaceWorkflow, FlowState } from '../types';
import { ShoppingBag, X, Search, Star, Download, CheckCircle } from 'lucide-react';

interface WorkflowMarketplaceModalProps {
  workflows: MarketplaceWorkflow[];
  onImport: (flowState: FlowState) => void;
  onClose: () => void;
}

export const WorkflowMarketplaceModal: React.FC<WorkflowMarketplaceModalProps> = ({ workflows, onImport, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');

  const filteredWorkflows = workflows.filter(w => {
    const termMatch = w.title.toLowerCase().includes(searchTerm.toLowerCase()) || w.description.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = category === 'All' || w.category === category;
    return termMatch && categoryMatch;
  });

  const categories = ['All', ...new Set(workflows.map(w => w.category))];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-gray-950 border border-gray-800 rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <ShoppingBag size={24} className="text-primary-500" />
            <div>
              <h2 className="text-xl font-bold text-gray-100">Workflow Marketplace</h2>
              <p className="text-sm text-gray-500">Discover pre-built templates to kickstart your goals.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg text-gray-500 hover:text-white transition-colors">
            Close
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900/30">
            <div className="flex items-center gap-2">
                {categories.map(cat => (
                    <button 
                        key={cat} 
                        onClick={() => setCategory(cat)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-full transition-colors ${category === cat ? 'bg-primary-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            <div className="relative w-1/3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search templates..."
                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm text-gray-200 focus:ring-1 focus:ring-primary-500 outline-none"
              />
            </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkflows.map(workflow => (
              <div key={workflow.id} className="bg-gray-900 border border-gray-800 rounded-lg p-5 flex flex-col justify-between hover:border-primary-500/30 transition-colors group">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">{workflow.category}</span>
                    {workflow.isVerified && (
                        <span className="text-xs font-bold text-blue-400 bg-blue-900/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle size={12} /> Verified
                        </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-100 mb-2 group-hover:text-primary-400 transition-colors">{workflow.title}</h3>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-3">{workflow.description}</p>
                </div>
                
                <div className="mt-auto">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                            <Star size={14} className="text-yellow-500" />
                            <span className="font-bold text-gray-300">{workflow.rating.toFixed(1)}</span>
                            <span>by {workflow.authorName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Download size={12} />
                            <span>{workflow.downloads.toLocaleString()}</span>
                        </div>
                    </div>
                    <button 
                      onClick={() => onImport(workflow.flowState)}
                      className="w-full py-2 rounded-lg text-sm font-bold bg-primary-600 hover:bg-primary-500 text-white transition-colors"
                    >
                      Import Workflow
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};