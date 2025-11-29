

import React, { useState, useRef } from 'react';
import { NodeType } from '../types';
import { Brain, Gavel, RefreshCw, Target, FileText, Wrench, GitMerge, UserCheck, ChevronDown } from 'lucide-react';

const PaletteItem: React.FC<{ item: any }> = ({ item }) => {
    const previewRef = useRef<HTMLDivElement>(null);

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('application/json', JSON.stringify({ type: 'NEW_NODE', nodeType: item.type }));
        if (previewRef.current) {
            e.dataTransfer.setDragImage(previewRef.current, 144, 50); // Center the preview on the cursor
        }
    };
    
    return (
        <>
            <div 
                draggable
                onDragStart={handleDragStart}
                className="group p-3 bg-gray-800 rounded-lg cursor-grab border border-gray-700 hover:border-gray-500 transition-colors shadow-sm"
            >
                <div className="flex items-center gap-3">
                    <item.icon size={16} className={item.color} />
                    <span className="text-sm font-bold text-gray-200">{item.label}</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-2 leading-snug">{item.description}</p>
            </div>
            
            {/* Hidden, but rendered preview for drag image */}
            <div ref={previewRef} className="fixed -left-[9999px] -top-[9999px]">
                <div className="relative flex flex-col w-72 p-3 rounded-lg border bg-gray-900 border-primary-500 shadow-lg text-white">
                    <div className="flex items-center justify-between mb-2 pr-6">
                        <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded bg-opacity-20 ${item.color.replace('text-', 'bg-').replace('-400', '-500/20')}`}>
                                <item.icon size={14} className={item.color} />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider opacity-90">{item.label}</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-gray-200 mb-1">{item.label}</h3>
                        <p className="text-xs text-gray-400 line-clamp-2">{item.description}</p>
                    </div>
                </div>
            </div>
        </>
    );
};


export const NodePalette: React.FC = () => {
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

    const basicItems = [
        { type: NodeType.TASK, label: 'Prompt Node', icon: FileText, color: 'text-blue-400', description: "Instruct an AI model to perform a specific task." },
        { type: NodeType.TOOL, label: 'Tool Call', icon: Wrench, color: 'text-orange-400', description: "Execute a pre-defined tool like web search or an API." },
        { type: NodeType.DECISION, label: 'Decision', icon: GitMerge, color: 'text-green-400', description: "Branch the workflow based on conditions or logic." },
        { type: NodeType.HUMAN_REVIEW, label: 'Human Review', icon: UserCheck, color: 'text-pink-400', description: "Pause the flow and request human input or approval." }
    ];

    const advancedItems = [
        { type: NodeType.AGENT, label: 'Cognitive Agent', icon: Brain, color: 'text-indigo-400', description: "Autonomous agent with persona, tools, and memory." },
        { type: NodeType.CRITIQUE, label: 'Critique (Judge)', icon: Gavel, color: 'text-yellow-400', description: "Evaluate outputs against a defined rubric." },
        { type: NodeType.REFINE, label: 'Self-Correction Loop', icon: RefreshCw, color: 'text-teal-400', description: "Iteratively improve content based on critique." },
        { type: NodeType.SCORECARD, label: 'Objective Scorecard', icon: Target, color: 'text-green-400', description: "Quantify success against defined KPIs." },
    ];

    return (
        <div className="w-64 bg-gray-900 border-r border-gray-800 p-4 shrink-0">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-4">Basics</h3>
            <div className="space-y-3">
                {basicItems.map(item => (
                    <PaletteItem key={item.type} item={item} />
                ))}
            </div>

            <div className="my-4 pt-4 border-t border-gray-800">
                <button 
                    onClick={() => setIsAdvancedOpen(!isAdvancedOpen)} 
                    className="w-full flex justify-between items-center text-left"
                >
                    <h3 className="text-xs font-bold text-gray-400 uppercase">Advanced</h3>
                    <ChevronDown 
                        size={16} 
                        className={`text-gray-500 transition-transform duration-200 ${isAdvancedOpen ? 'rotate-180' : ''}`} 
                    />
                </button>
            </div>
            
            {isAdvancedOpen && (
                <div className="space-y-3 animate-in fade-in duration-300">
                    {advancedItems.map(item => (
                        <PaletteItem key={item.type} item={item} />
                    ))}
                </div>
            )}
        </div>
    );
};