

import React, { useMemo } from 'react';
import { FlowState, FlowNode } from '../types';

interface FlowMinimapProps {
  flow: FlowState;
}

export const FlowMinimap: React.FC<FlowMinimapProps> = ({ flow }) => {
  const { rootId, nodes } = flow;

  // Helper to calculate tree depth and width for a rudimentary layout
  const treeLayout = useMemo(() => {
    if (!rootId || !nodes[rootId]) return null;

    const levels: Record<number, string[]> = {};
    const maxDepth = 0;
    
    const traverse = (nodeId: string, depth: number) => {
      if (!levels[depth]) levels[depth] = [];
      levels[depth].push(nodeId);
      
      const node = nodes[nodeId];
      if (node) {
        node.childrenIds.forEach(childId => traverse(childId, depth + 1));
      }
    };

    traverse(rootId, 0);

    return levels;
  }, [flow]);

  if (!treeLayout) return null;

  const depths = Object.keys(treeLayout).map(Number).sort((a, b) => a - b);
  const maxDepth = depths[depths.length - 1];
  const maxWidth = Math.max(...Object.values(treeLayout).map((arr: string[]) => arr.length));

  // Canvas size
  const width = 180;
  const height = 120;
  
  // Calculate node positions
  const nodePositions: {x: number, y: number, id: string}[] = [];
  const connections: {x1: number, y1: number, x2: number, y2: number}[] = [];

  depths.forEach(depth => {
     const rowNodes = treeLayout[depth];
     const y = (depth / (maxDepth + 1 || 1)) * height + 10;
     const rowWidth = rowNodes.length;
     
     rowNodes.forEach((nodeId, index) => {
         // Center nodes in the row
         const x = (width / (rowWidth + 1)) * (index + 1);
         nodePositions.push({ x, y, id: nodeId });
         
         // Find parent to draw line
         const node = nodes[nodeId];
         if (node.parentId) {
             const parentPos = nodePositions.find(p => p.id === node.parentId);
             if (parentPos) {
                 connections.push({ x1: parentPos.x, y1: parentPos.y, x2: x, y2: y });
             }
         }
     });
  });

  return (
    <div className="absolute bottom-4 left-4 bg-gray-900/80 border border-gray-700 rounded-lg p-2 shadow-xl backdrop-blur-sm pointer-events-none z-40">
       <p className="text-[10px] text-gray-500 uppercase font-bold mb-1 ml-1">Map</p>
       <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {connections.map((conn, i) => (
              <line key={i} x1={conn.x1} y1={conn.y1} x2={conn.x2} y2={conn.y2} stroke="#4B5563" strokeWidth="1" />
          ))}
          {nodePositions.map(pos => {
              const node = nodes[pos.id];
              const isRoot = node.id === rootId;
              return (
                  <circle 
                    key={pos.id} 
                    cx={pos.x} 
                    cy={pos.y} 
                    r={isRoot ? 4 : 2.5} 
                    fill={isRoot ? '#6366f1' : '#9CA3AF'} 
                    className={flow.selectedNodeId === pos.id ? 'stroke-white stroke-2' : ''}
                  />
              );
          })}
       </svg>
    </div>
  );
};