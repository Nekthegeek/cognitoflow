import React, { useState } from 'react';
import { FlowState, NodeType, FlowNode } from '../types';
import { NodeCard } from './NodeCard';
import { FlowMinimap } from './FlowMinimap';
import { Plus, Minus, Maximize, Hand } from 'lucide-react';

interface Permissions {
  canEdit: boolean;
  canRun: boolean;
  canReview: boolean;
}

interface FlowViewProps {
  flow: FlowState;
  permissions: Permissions;
  onSelectNode: (id: string) => void;
  onRunNode: (id: string) => void;
  onCritiqueNode: (id: string) => void;
  onToggleMerge?: (id: string) => void;
  onDeleteNode?: (id: string) => void;
  onMoveNode?: (id: string, direction: 'up' | 'down') => void;
  onDecomposeNode?: (id: string) => void;
  onAddNode?: (parentId: string, type?: NodeType) => void;
  onDropNode?: (draggedId: string, targetId: string) => void;
  onUpdateNodeData?: (id: string, data: Partial<FlowNode['data']>) => void;
  pulsingAddNextButtonNodeId?: string | null;
}

const TreeNode: React.FC<{ 
  nodeId: string; 
  flow: FlowState; 
  onSelect: (id: string) => void;
  onRun: (id: string) => void;
  onCritique: (id: string) => void;
  permissions?: Permissions;
  onToggleMerge?: (id: string) => void;
  onDelete?: (id: string) => void;
  onMove?: (id: string, direction: 'up' | 'down') => void;
  onDecompose?: (id: string) => void;
  onAddNode?: (parentId: string, type?: NodeType) => void;
  onDropNode?: (draggedId: string, targetId: string) => void;
  heatmapMode?: boolean; 
  onUpdateData?: (id: string, data: Partial<FlowNode['data']>) => void;
  pulsingAddNextButtonNodeId?: string | null;
}> = (props) => {
  const { nodeId, flow, onSelect, onRun, onCritique, permissions, onToggleMerge, onDelete, onMove, onDecompose, onAddNode, onDropNode, heatmapMode, onUpdateData, pulsingAddNextButtonNodeId } = props;
  const node = flow.nodes[nodeId];
  if (!node) return null;
  
  const safePermissions = permissions || { canEdit: false, canRun: false, canReview: false };
  const isPlanning = flow.mode === 'PLANNING';
  const isProblematicNode = (n: FlowNode) => n.data.analytics ? n.data.analytics.estimatedCost > 0.1 : false;
  const hasChildren = node.childrenIds.length > 0;

  return (
    <div className="flex items-start">
      <div className="shrink-0 pt-8">
        <NodeCard 
          node={node} 
          isSelected={flow.selectedNodeId === node.id}
          isMergeSelected={flow.selectedForMerge?.includes(node.id)}
          onSelect={onSelect}
          onRun={onRun}
          onCritique={onCritique}
          onToggleMerge={onToggleMerge}
          onDelete={onDelete}
          onMove={onMove}
          onDecompose={onDecompose}
          permissions={safePermissions}
          showAnalytics={!isPlanning}
          showHeatmap={heatmapMode}
          isProblematic={isProblematicNode(node)}
          onUpdateData={onUpdateData}
          onAddNode={onAddNode}
          onDropNode={onDropNode}
          isWaitingForNextNode={pulsingAddNextButtonNodeId === nodeId}
        />
      </div>

      {hasChildren && (
        <div className="relative pl-12">
          {/* Vertical line connecting all children branches */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-700" />
          
          <div className="flex flex-col">
            {node.childrenIds.map(childId => (
              <div key={childId} className="relative">
                {/* Horizontal line connecting this child to the vertical line */}
                <div className="absolute left-0 top-1/2 w-6 h-0.5 bg-gray-700 -translate-y-px" />
                <TreeNode nodeId={childId} {...props} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


export const FlowView: React.FC<FlowViewProps> = (props) => {
  const [isPanning, setIsPanning] = useState(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
        setIsPanning(true);
    }
  };

  const nodeCount = Object.keys(props.flow.nodes).length;

  return (
    <div 
      onMouseDown={handleMouseDown}
      onMouseUp={() => setIsPanning(false)}
      onMouseLeave={() => setIsPanning(false)}
      className={`
        overflow-auto h-full p-16 min-w-full flex items-start relative 
        ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}
        ${props.flow.rootId ? 'flow-canvas-bg' : ''}
      `}
    >
      {props.flow.mode === 'PLANNING' && nodeCount > 2 && <FlowMinimap flow={props.flow} />}
      
      {props.flow.rootId ? (
          <TreeNode 
            nodeId={props.flow.rootId} 
            flow={props.flow} 
            onSelect={props.onSelectNode}
            onRun={props.onRunNode}
            onCritique={props.onCritiqueNode}
            permissions={props.permissions}
            onToggleMerge={props.onToggleMerge}
            onDelete={props.onDeleteNode}
            onMove={props.onMoveNode}
            onDecompose={props.onDecomposeNode}
            onAddNode={props.onAddNode}
            onDropNode={props.onDropNode}
            heatmapMode={props.flow.heatmapMode}
            onUpdateData={props.onUpdateNodeData}
            pulsingAddNextButtonNodeId={props.pulsingAddNextButtonNodeId}
          />
      ) : (
          <div className="m-auto text-center text-gray-500">
              <p>Start by adding a node from the palette on the left.</p>
          </div>
      )}
      
      {props.flow.rootId && (
        <div className="absolute bottom-4 right-4 flex flex-col gap-1.5 z-40">
          <button title="Zoom In" className="w-10 h-10 flex items-center justify-center bg-gray-900/80 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"><Plus size={16} /></button>
          <button title="Zoom Out" className="w-10 h-10 flex items-center justify-center bg-gray-900/80 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"><Minus size={16} /></button>
          <button title="Fit to View" className="w-10 h-10 flex items-center justify-center bg-gray-900/80 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"><Maximize size={16} /></button>
        </div>
      )}
    </div>
  );
};
