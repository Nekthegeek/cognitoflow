
import React, { useState } from 'react';
import { HumanReviewConfig, HumanReviewResult } from '../types';
import { User, CheckCircle, XCircle, Send, MessageSquare } from 'lucide-react';

interface HumanReviewModalProps {
  nodeId: string;
  config: HumanReviewConfig;
  inputData: string;
  onSubmit: (result: HumanReviewResult) => void;
  onClose: () => void;
}

export const HumanReviewModal: React.FC<HumanReviewModalProps> = ({ nodeId, config, inputData, onSubmit, onClose }) => {
  const [comments, setComments] = useState('');
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);

  const handleSubmit = (decision: string) => {
    onSubmit({
      reviewerId: 'current-user', // Mock ID
      decision,
      comments,
      timestamp: Date.now()
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-gray-950 border border-yellow-500/30 rounded-xl shadow-[0_0_50px_rgba(234,179,8,0.1)] w-full max-w-2xl flex flex-col overflow-hidden max-h-[90vh]">
        
        <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-yellow-900/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-500">
              <User size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-100">Human Review Required</h2>
              <p className="text-sm text-yellow-500/80">Pending approval for node execution.</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Instructions</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{config.instructions}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
              <MessageSquare size={14} /> Content for Review
            </h3>
            <div className="bg-black/30 border border-gray-800 rounded-lg p-4 font-mono text-sm text-gray-300 whitespace-pre-wrap max-h-64 overflow-y-auto custom-scrollbar">
              {inputData}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-gray-500 uppercase">Reviewer Comments</h3>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add your feedback or reasoning here..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm text-gray-200 outline-none focus:ring-1 focus:ring-yellow-500 h-24 resize-none"
            />
          </div>

        </div>

        <div className="p-6 border-t border-gray-800 bg-gray-900/50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-bold text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          
          {config.options.map(option => (
            <button
              key={option}
              onClick={() => handleSubmit(option)}
              className={`px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-lg
                ${option.toLowerCase() === 'approve' 
                  ? 'bg-green-600 hover:bg-green-500 text-white shadow-green-900/20' 
                  : option.toLowerCase() === 'reject' 
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/20'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'}
              `}
            >
              {option.toLowerCase() === 'approve' && <CheckCircle size={16} />}
              {option.toLowerCase() === 'reject' && <XCircle size={16} />}
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
