import React, { useState } from 'react';
import { FlowNode, NodeType, NodeData } from '../types';
import { Target, FileText, Brain, Wrench, Gavel, GitMerge, UserCheck, RefreshCw, Edit2, Check, Plus, Settings, MoreVertical, Trash2 } from 'lucide-react';

interface NodeCardProps {
  node: FlowNode;
  isSelected: boolean;
  isMergeSelected?: boolean;
  onSelect: (id: string) => void;
  onRun: (id: string) => void;
  onCritique: (id: string) => void;
  onToggleMerge?: (id: string) => void;
  onDelete?: (id: string) => void;
  onMove?: (id: string, direction: 'up' | 'down') => void;
  onDecompose?: (id: string) => void;
  permissions: { canEdit: boolean; canRun: boolean; canReview: boolean };
  showAnalytics?: boolean;
  showHeatmap?: boolean;
  isProblematic?: boolean;
  onUpdateData?: (id:string, data: Partial<NodeData>) => void;
  onAddNode?: (parentId: string, type?: NodeType) => void;
  onDropNode?: (draggedId: string, targetId: string) => void;
  isWaitingForNextNode?: boolean;
}

const iconMap: { [key in NodeType]: React.ElementType } = {
  [NodeType.GOAL]: Target,
  [NodeType.TASK]: FileText,
  [NodeType.AGENT]: Brain,
  [NodeType.TOOL]: Wrench,
  [NodeType.CRITIQUE]: Gavel,
  [NodeType.REFINE]: RefreshCw,
  [NodeType.SCORECARD]: Target,
  [NodeType.DECISION]: GitMerge,
  [NodeType.HUMAN_REVIEW]: UserCheck,
};

const colorMap: { [key in NodeType]: { bg: string; text: string; border: string; accent: string; } } = {
    [NodeType.GOAL]: { bg: 'bg-indigo-900/30', text: 'text-indigo-300', border: 'border-indigo-500/50', accent: 'accent-indigo-500' },
    [NodeType.TASK]: { bg: 'bg-blue-900/30', text: 'text-blue-300', border: 'border-blue-500/50', accent: 'accent-blue-500' },
    [NodeType.AGENT]: { bg: 'bg-purple-900/30', text: 'text-purple-300', border: 'border-purple-500/50', accent: 'accent-purple-500' },
    [NodeType.TOOL]: { bg: 'bg-orange-900/30', text: 'text-orange-300', border: 'border-orange-500/50', accent: 'accent-orange-500' },
    [NodeType.CRITIQUE]: { bg: 'bg-yellow-900/30', text: 'text-yellow-300', border: 'border-yellow-500/50', accent: 'accent-yellow-500' },
    [NodeType.REFINE]: { bg: 'bg-teal-900/30', text: 'text-teal-300', border: 'border-teal-500/50', accent: 'accent-teal-500' },
    [NodeType.SCORECARD]: { bg: 'bg-green-900/30', text: 'text-green-300', border: 'border-green-500/50', accent: 'accent-green-500' },
    [NodeType.DECISION]: { bg: 'bg-green-900/30', text: 'text-green-300', border: 'border-green-500/50', accent: 'accent-green-500' },
    [NodeType.HUMAN_REVIEW]: { bg: 'bg-pink-900/30', text: 'text-pink-300', border: 'border-pink-500/50', accent: 'accent-pink-500' },
};

const AddNextButton: React.FC<{ parentId: string; onAddNode?: (parentId: string, type?: NodeType) => void; onDropNode?: (draggedId: string, targetId: string) => void; isPulsing?: boolean;}> = ({ parentId, onAddNode, onDropNode, isPulsing }) => {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };
    const handleDragEnter = (e: React.DragEvent) => { 
        e.preventDefault(); 
        if (e.dataTransfer.types.includes('application/json')) {
            setIsDragOver(true);
        }
    };
    const handleDragLeave = () => setIsDragOver(false);
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        try {
            const data = JSON.parse(e.dataTransfer.getData('application/json'));
            if (data.type === 'NEW_NODE' && onAddNode) {
                onAddNode(parentId, data.nodeType);
            } else if (data.type === 'MOVE_NODE' && onDropNode && data.nodeId !== parentId) {
                onDropNode(data.nodeId, parentId);
            }
        } catch (err) {
            console.error("Failed to parse drop data in AddNextButton", err);
        }
    };
    
    return (
        <button
            onClick={() => onAddNode?.(parentId, NodeType.TASK)}
            onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}
            className={`w-full mt-3 h-10 border-2 border-dashed rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-200
                ${isDragOver ? 'border-accent-primary bg-accent-primary/10 text-accent-primary' : 'border-gray-700 hover:border-gray-600 text-gray-500 hover:text-gray-400'}
                ${isPulsing ? 'animate-pulse-button-glow' : ''}
            `}
        >
            <Plus size={14} className="mr-1" /> {isDragOver ? 'Drop Node' : 'Add Next'}
        </button>
    );
};


export const NodeCard: React.FC<NodeCardProps> = ({ node, isSelected, onSelect, onUpdateData, onAddNode, isWaitingForNextNode, onDropNode }) => {
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingDesc, setIsEditingDesc] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => onUpdateData?.(node.id, { title: e.target.value });
    const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => onUpdateData?.(node.id, { description: e.target.value });
    
    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('application/json', JSON.stringify({ type: 'MOVE_NODE', nodeId: node.id }));
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };
    
    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // Check content type only, as reading data is restricted in dragEnter
        if (e.dataTransfer.types.includes('application/json')) {
            setIsDragOver(true);
        }
    };
    
    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        try {
            const data = JSON.parse(e.dataTransfer.getData('application/json'));

            if (data.type === 'NEW_NODE' && onAddNode) {
                onAddNode(node.id, data.nodeType);
            } else if (data.type === 'MOVE_NODE' && onDropNode && data.nodeId !== node.id) {
                onDropNode(data.nodeId, node.id);
            }
        } catch (err) {
            console.error("Failed to parse drop data in NodeCard", err);
        }
    };

    const Icon = iconMap[node.type];
    const colors = colorMap[node.type];
    const isLeafNode = node.childrenIds.length === 0;
    const isRootNode = !node.parentId;
    const isDraggable = node.type !== NodeType.GOAL;

    const baseClasses = `relative flex flex-col p-4 rounded-lg border-2 transition-all duration-200 group/node shadow-md`;
    const selectedClasses = isSelected 
        ? `border-accent-primary shadow-2xl shadow-accent-primary/10 scale-105` 
        : isDragOver
            ? `border-accent-secondary scale-105 shadow-2xl shadow-accent-secondary/10`
            : 'border-gray-800 hover:border-gray-700';
    
    const widthClass = node.type === NodeType.GOAL ? 'w-96' : 'w-80';

    const dragHandlers = {
        onDragStart: handleDragStart,
        onDragEnter: handleDragEnter,
        onDragLeave: handleDragLeave,
        onDragOver: handleDragOver,
        onDrop: handleDrop,
    };

    return (
        <div
            onClick={(e) => { e.stopPropagation(); onSelect(node.id); }}
            draggable={isDraggable}
            {...dragHandlers}
            className={`${baseClasses} ${selectedClasses} ${widthClass} ${colors.bg} ${isDraggable ? 'cursor-grab' : 'cursor-default'}`}
        >
            {/* Input connector */}
            {!isRootNode && (
              <div className="absolute top-1/2 -translate-y-1/2 -left-[9px] w-4 h-4 rounded-full bg-gray-950 border-2 border-gray-600 group-hover/node:border-accent-primary transition-colors"></div>
            )}
            {/* Output connector */}
            {!isLeafNode && (
              <div className="absolute top-1/2 -translate-y-1/2 -right-[9px] w-4 h-4 rounded-full bg-gray-950 border-2 border-gray-600 group-hover/node:border-accent-primary transition-colors"></div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Icon size={14} className={colors.text} />
                    <span className={`text-xs font-bold uppercase ${colors.text}`}>{node.type}</span>
                </div>
                <button className="text-gray-500 hover:text-white"><MoreVertical size={16} /></button>
            </div>
            {/* Title */}
            {isEditingTitle ? (
                <input type="text" value={node.data.title} onChange={handleTitleChange} onBlur={() => setIsEditingTitle(false)} autoFocus className={`w-full bg-transparent text-lg font-bold text-text-primary outline-none border-b-2 ${colors.border}`} />
            ) : (
                <h3 onClick={() => setIsEditingTitle(true)} className="text-lg font-bold text-text-primary flex items-center gap-2">{node.data.title} <Edit2 size={12} className="text-gray-600 opacity-0 group-hover/node:opacity-100 transition-opacity" /></h3>
            )}
            {/* Description */}
            {isEditingDesc ? (
                <textarea value={node.data.description || ''} onChange={handleDescChange} onBlur={() => setIsEditingDesc(false)} autoFocus className={`w-full mt-2 bg-transparent text-sm text-text-secondary outline-none border-b-2 ${colors.border} resize-none`} rows={3} />
            ) : (
                <p onClick={() => setIsEditingDesc(true)} className="text-sm text-text-secondary mt-2 min-h-[20px]">{node.data.description || <span className="text-gray-500 italic">[+ Add Description]</span>}</p>
            )}

            {isLeafNode && (
                <AddNextButton parentId={node.id} onAddNode={onAddNode} onDropNode={onDropNode} isPulsing={isWaitingForNextNode} />
            )}
        </div>
    );
};