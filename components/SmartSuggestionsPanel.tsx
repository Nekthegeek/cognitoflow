
import React from 'react';
import { FlowNode } from '../types';
import { Lightbulb, Shield, X, Bot } from 'lucide-react';

interface SmartSuggestionsPanelProps {
    isOpen: boolean;
    onToggle: () => void;
    nodeCount: number;
    rootNode: FlowNode | null;
    onAddPiiGuardrail: () => void;
}

export const SmartSuggestionsPanel: React.FC<SmartSuggestionsPanelProps> = ({ isOpen, onToggle, nodeCount, rootNode, onAddPiiGuardrail }) => {
    
    if (!isOpen) {
        return (
            <button
                onClick={onToggle}
                className="absolute bottom-6 right-6 z-40 w-16 h-16 bg-primary-600 hover:bg-primary-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-primary-900/40 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-primary-500 animate-in fade-in zoom-in-50 duration-300"
                aria-label="Open Smart Suggestions"
            >
                <Lightbulb size={28} />
            </button>
        );
    }

    return (
        <div className="absolute top-0 right-0 h-full w-72 bg-gray-900/80 backdrop-blur-md border-l border-gray-800 p-4 shrink-0 space-y-4 z-30 animate-in slide-in-from-right-8 duration-300">
            <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                    <Lightbulb size={14} className="text-yellow-400" /> Smart Suggestions
                </h3>
                <button onClick={onToggle} className="text-gray-500 hover:text-white transition-colors" aria-label="Close Smart Suggestions">
                    <X size={16} />
                </button>
            </div>

            {nodeCount < 4 ? (
                <div className="flex flex-col items-center justify-center text-center h-full text-gray-500 p-4 -mt-8">
                    <Bot size={32} className="mb-4" />
                    <p className="text-sm font-bold text-gray-400">Keep Building!</p>
                    <p className="text-xs mt-1">As your workflow grows, I'll provide contextual tips here to improve it.</p>
                </div>
            ) : (
                <>
                    <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700/50 text-xs text-gray-400 space-y-3">
                       <p>🚀 Based on your goal: <b className="text-gray-200">"{rootNode?.data.title || '...'}"</b></p>
                       <ul className="list-disc list-inside space-y-2 pl-1">
                           <li>Add a "Scorecard" to measure success.</li>
                           <li>Set a "Cost Guardrail" to $5.00 per run.</li>
                       </ul>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
                        <p className="text-xs text-gray-400 mb-2">🧠 You haven’t used <b className="text-indigo-400">Cognitive Agent</b> yet — try building a "Researcher".</p>
                        <button className="w-full text-center text-xs font-bold bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 py-1.5 rounded border border-indigo-500/30">Add Agent</button>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
                        <p className="text-xs text-gray-400 mb-2">🛡️ <b className="text-red-400">Compliance Risk:</b> Add a PII guardrail to flag sensitive data for human review.</p>
                        <button 
                            onClick={onAddPiiGuardrail}
                            className="w-full text-center text-xs font-bold bg-red-600/30 hover:bg-red-600/50 text-red-200 py-1.5 rounded border border-red-500/30 flex items-center justify-center gap-2">
                            <Shield size={12}/> Add PII Guardrail
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};
