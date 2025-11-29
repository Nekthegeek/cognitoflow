

import React from 'react';
import { OptimizationProposal, OptimizationType } from '../types';
import { X, Zap, ArrowRight, Check, CheckCircle } from 'lucide-react';

interface OptimizationReviewModalProps {
  proposals: OptimizationProposal[];
  onApply: (proposal: OptimizationProposal) => void;
  onReject?: (id: string) => void;
  onClose: () => void;
}

export const OptimizationReviewModal: React.FC<OptimizationReviewModalProps> = ({ proposals, onApply, onReject, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-gray-950 border border-gray-800 rounded-xl shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden max-h-[85vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Zap size={24} className="text-yellow-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-100">Optimization Proposals</h2>
              <p className="text-sm text-gray-500">AI-suggested