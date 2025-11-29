import React, { useState, useCallback, useMemo } from 'react';
import { FlowState, FlowNode, NodeData, NodeType, FlowStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';

import { FlowToolbar } from './FlowToolbar';
import { NodePalette } from './NodePalette';
import { FlowView } from './FlowView';
import { NodeDetailPanel } from './NodeDetailPanel';
import { SmartSuggestionsPanel } from './SmartSuggestionsPanel';
import { DataPanel } from './DataPanel';
import { NaturalLanguageCommander } from './NaturalLanguageCommander';


interface FlowEditorPageProps {
  initialFlowState: FlowState;
  onGoBack: () => void;
}

export const FlowEditorPage: React.FC<FlowEditorPageProps> = ({ initialFlowState, onGoBack }) => {
  const [flow, setFlow] = useState<FlowState>(initialFlowState);
  const [isSuggestionsOpen, setSuggestionsOpen] = useState(true);
  const [isDataPanelOpen, setDataPanelOpen] = useState(false);
  const [isCommanderOpen, setIsCommanderOpen] = useState(false);
  const [isProcessingCommand, setIsProcessingCommand] = useState(false);

  const handleSelectNode = useCallback((id: string | null) => {
    setFlow(prevFlow => ({ ...prevFlow, selectedNodeId: id }));
  }, []);

  const handleUpdateNodeData = useCallback((id: string, data: Partial<NodeData>) => {
    setFlow(prevFlow => {
      if (!prevFlow.nodes[id]) return prevFlow;
      return {
        ...prevFlow,
        nodes: {
          ...prevFlow.nodes,
          [id]: {
            ...prevFlow.nodes[id],
            data: { ...prevFlow.nodes[id].data, ...data, isUserEdited: true },
          },
        },
      };
    });
  }, []);

  const handleAddNode = useCallback((parentId: string, type: NodeType = NodeType.TASK) => {
    setFlow(prevFlow => {
      const parentNode = prevFlow.nodes[parentId];
      if (!parentNode) return prevFlow;

      const newNodeId = uuidv4();
      const newNode: FlowNode = {
        id: newNodeId,
        type,
        data: { title: `New ${type.toLowerCase()} Node`, description: '' },
        parentId,
        childrenIds: [],
      };
      
      // If adding an agent, give it a default config
      if (type === NodeType.AGENT) {
          newNode.data.agentConfig = {
              persona: 'Assistant',
              objective: 'Help with the task',
              model: 'gemini-2.5-flash',
              temperature: 0.7,
              topP: 0.95
          };
          newNode.data.title = 'New Agent';
      }

      const newNodes = {
        ...prevFlow.nodes,
        [newNodeId]: newNode,
        [parentId]: {
          ...parentNode,
          childrenIds: [...parentNode.childrenIds, newNodeId],
        },
      };

      return { ...prevFlow, nodes: newNodes };
    });
  }, []);

  const handleDropNode = useCallback((draggedNodeId: string, targetNodeId: string) => {
    setFlow(prevFlow => {
      const { nodes, rootId } = prevFlow;
      const draggedNode = nodes[draggedNodeId];
      const targetNode = nodes[targetNodeId];
  
      // Basic validation
      if (!draggedNode || !targetNode || draggedNodeId === targetNodeId) {
        return prevFlow;
      }
  
      // Prevent moving the root node
      if (draggedNodeId === rootId) {
        return prevFlow;
      }
      
      // Cycle detection: check if the target is a descendant of the dragged node
      let current: FlowNode | undefined = targetNode;
      while (current) {
        if (current.id === draggedNodeId) {
          return prevFlow; // Can't drop a node on its own descendant
        }
        current = current.parentId ? nodes[current.parentId] : undefined;
      }
  
      const newNodes = { ...nodes };
  
      // 1. Remove from old parent
      if (draggedNode.parentId) {
        const oldParent = newNodes[draggedNode.parentId];
        if (oldParent) {
          newNodes[draggedNode.parentId] = {
            ...oldParent,
            childrenIds: oldParent.childrenIds.filter(id => id !== draggedNodeId),
          };
        }
      }
  
      // 2. Add to new parent (handle case where parent is same, it will append to end)
      // We must get the latest state of targetNode from newNodes if it was the oldParent
      const updatedTargetNode = newNodes[targetNodeId] || targetNode;

      newNodes[targetNodeId] = {
        ...updatedTargetNode,
        childrenIds: [...updatedTargetNode.childrenIds, draggedNodeId],
      };
  
      // 3. Update dragged node's parent
      newNodes[draggedNodeId] = {
        ...draggedNode,
        parentId: targetNodeId,
      };
  
      return { ...prevFlow, nodes: newNodes };
    });
  }, []);

  const handleCommand = (command: string) => {
    setIsProcessingCommand(true);
    // Simulate AI processing delay
    setTimeout(() => {
        const lower = command.toLowerCase();
        
        // Simple heuristic for "Add Agent" command
        if ((lower.includes('add') || lower.includes('create')) && lower.includes('agent')) {
            const targetId = flow.selectedNodeId || flow.rootId;
            if (targetId) {
                handleAddNode(targetId, NodeType.AGENT);
            }
        } else if ((lower.includes('add') || lower.includes('create')) && lower.includes('task')) {
             const targetId = flow.selectedNodeId || flow.rootId;
            if (targetId) {
                handleAddNode(targetId, NodeType.TASK);
            }
        }
        
        setIsProcessingCommand(false);
        setIsCommanderOpen(false);
    }, 1000);
  };

  const selectedNode = useMemo(() => {
    if (!flow.selectedNodeId) return null;
    return flow.nodes[flow.selectedNodeId];
  }, [flow.selectedNodeId, flow.nodes]);
  
  const rootNode = useMemo(() => {
      if(!flow.rootId) return null;
      return flow.nodes[flow.rootId];
  }, [flow.rootId, flow.nodes]);


  return (
    <div className="flex flex-col h-screen bg-bg-primary text-text-primary overflow-hidden">
      <FlowToolbar
        flowName={rootNode?.data.title || "Untitled Flow"}
        status={FlowStatus.IDLE}
        onGoBack={onGoBack}
        onRun={() => console.log("Run flow")}
        onSimulate={() => console.log("Simulate flow")}
        onOptimize={() => console.log("Optimize flow")}
        onAutopilot={() => console.log("Autopilot flow")}
        onViewScorecard={() => console.log("View scorecard")}
        onViewCompliance={() => console.log("View compliance")}
        onExport={() => console.log("Export flow")}
        onToggleHeatmap={() => console.log("Toggle heatmap")}
        onOpenCommander={() => setIsCommanderOpen(true)}
        showHeatmap={false}
        isProcessing={false}
        hasScorecard={false}
        hasComplianceIssues={false}
        permissions={{ canEdit: true, canRun: true }}
        flowExists={!!rootNode}
      />
      <div className="flex flex-1 overflow-hidden relative">
        <NodePalette />
        <main className="flex-1 flex flex-col relative">
           <div className="flex-grow relative">
                <FlowView
                    flow={flow}
                    permissions={{ canEdit: true, canRun: true, canReview: true }}
                    onSelectNode={(id) => handleSelectNode(id)}
                    onAddNode={handleAddNode}
                    onDropNode={handleDropNode}
                    onUpdateNodeData={handleUpdateNodeData}
                    onRunNode={() => {}}
                    onCritiqueNode={() => {}}
                    isSuggestionsOpen={isSuggestionsOpen}
                    onToggleSuggestions={() => setSuggestionsOpen(o => !o)}
                />
                <SmartSuggestionsPanel
                    isOpen={isSuggestionsOpen}
                    onToggle={() => setSuggestionsOpen(o => !o)}
                    nodeCount={Object.keys(flow.nodes).length}
                    rootNode={rootNode}
                    onAddPiiGuardrail={() => console.log("Add PII Guardrail")}
                />
                {isCommanderOpen && (
                    <NaturalLanguageCommander 
                        onCommand={handleCommand}
                        onClose={() => setIsCommanderOpen(false)}
                        isProcessing={isProcessingCommand}
                    />
                )}
           </div>
          <DataPanel 
            runHistory={[]} 
            logsOpen={isDataPanelOpen}
            onToggle={() => setDataPanelOpen(o => !o)}
          />
        </main>
        {selectedNode && (
          <aside className="w-96 flex-shrink-0 border-l border-border-primary bg-bg-card animate-in slide-in-from-right-8 duration-300">
            <NodeDetailPanel
              key={selectedNode.id}
              node={selectedNode}
              onUpdateData={handleUpdateNodeData}
            />
          </aside>
        )}
      </div>
    </div>
  );
};