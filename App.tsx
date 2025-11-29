import React, { useState, useCallback } from 'react';
import { WorkspaceDashboard } from './components/WorkspaceDashboard';
import { FlowEditorPage } from './components/FlowEditorPage';
import { FlowState, NodeType, DashboardFlow, FlowStatus, RefineConfig } from './types';
import { v4 as uuidv4 } from 'uuid';

// --- MOCK DATA for the entire application ---

const MOCK_DASHBOARD_FLOWS: DashboardFlow[] = [
    { id: 'flow-1', icon: '📊', title: 'Quarterly Financial Report', description: 'Aggregates data from Xero and generates PDF report.', status: FlowStatus.ACTIVE, health: 92, metrics: { avgRuntime: 2.1, avgCost: 0.023, successRate: 98, lastRun: Date.now() - 7200000 }},
    { id: 'flow-2', icon: '🔍', title: 'Competitor Analysis Pipeline', description: 'Automated scraping and SWOT analysis.', status: FlowStatus.ACTIVE, health: 84, metrics: { avgRuntime: 4.2, avgCost: 0.120, successRate: 84, lastRun: Date.now() - 3600000 }, warning: { title: 'Performance Warning', details: 'Node "Web Scraper" averaging 4.2s (target: <2s)', action: { label: 'Optimize This Node', nodeId: 'node-123' }}},
    { id: 'flow-3', icon: '✍️', title: 'SEO Content Generator', description: 'Generate blog posts based on trending keywords.', status: FlowStatus.PAUSED, health: 45, metrics: { avgRuntime: 5.3, avgCost: 0.085, successRate: 45, lastRun: Date.now() - 259200000 }, pausedInfo: { timestamp: Date.now() - 259200000, user: 'John Doe', reason: 'Waiting for content calendar approval' }},
    { id: 'flow-4', icon: '📧', title: 'Email Campaign Workflow', description: 'Automated email personalization and scheduling.', status: FlowStatus.FAILED, health: 12, metrics: { avgRuntime: 0, avgCost: 0, successRate: 12, lastRun: Date.now() - 900000 }, errorInfo: { title: 'API Authentication Failed', details: 'Node "SendGrid Integration" returned 401 Unauthorized', timestamp: Date.now() - 900000 }}
];


const MOCK_FLOW_STATES: Record<string, FlowState> = {
  'flow-1': {
    rootId: 'goal-1',
    nodes: {
      'goal-1': { id: 'goal-1', type: NodeType.GOAL, data: { title: 'Quarterly Financial Report', description: 'Aggregates data from Xero and generates PDF report.' }, childrenIds: ['agent-1', 'agent-2', 'agent-3', 'agent-4'], parentId: undefined },
      'agent-1': { id: 'agent-1', type: NodeType.AGENT, data: { title: 'Data Aggregator Agent', description: 'Fetches financial data from sources.' }, parentId: 'goal-1', childrenIds: ['tool-1'] },
      'tool-1': { id: 'tool-1', type: NodeType.TOOL, data: { title: 'Xero API Call', description: 'Get P&L statement.' }, parentId: 'agent-1', childrenIds: ['critique-1'] },
      'critique-1': { id: 'critique-1', type: NodeType.CRITIQUE, data: { title: 'Validate Data', description: 'Check for anomalies in the financial data.' }, parentId: 'tool-1', childrenIds: ['refine-1'] },
      'refine-1': {
        id: 'refine-1',
        type: NodeType.REFINE,
        data: {
          title: 'Refine Report Data',
          description: 'Iteratively improve the data based on critique.',
          refineConfig: {
            strategy: 'DIFFERENCE_PROMPTING',
            maxIterations: 3,
            convergenceThreshold: 0.8
          } as RefineConfig
        },
        parentId: 'critique-1',
        childrenIds: []
      },
      'agent-2': { id: 'agent-2', type: NodeType.AGENT, data: { title: 'Report Formatting Agent', description: 'Formats the aggregated data into a presentable report.' }, parentId: 'goal-1', childrenIds: [] },
      'agent-3': { id: 'agent-3', type: NodeType.AGENT, data: { title: 'Data Researcher Agent', description: 'Find and summarize the latest market trends for Product X' }, parentId: 'goal-1', childrenIds: [] },
      'agent-4': { id: 'agent-4', type: NodeType.AGENT, data: { title: 'Data Researcher Agent', description: 'Find and summarize the latest market trends for Product X' }, parentId: 'goal-1', childrenIds: [] }
    },
    selectedNodeId: null,
  },
  'flow-2': {
    rootId: 'goal-2',
    nodes: {
      'goal-2': { id: 'goal-2', type: NodeType.GOAL, data: { title: 'Competitor Analysis Pipeline', description: 'Automated scraping and SWOT analysis.' }, childrenIds: ['agent-2-0'], parentId: undefined },
      'agent-2-0': { id: 'agent-2-0', type: NodeType.AGENT, data: { title: 'Competitor Identification Agent', description: 'Identifies top 3 competitors based on the initial goal.' }, parentId: 'goal-2', childrenIds: ['agent-2'] },
      'agent-2': { id: 'agent-2', type: NodeType.AGENT, data: { title: 'Web Scraping Agent', description: 'Scrapes competitor websites for data.' }, parentId: 'agent-2-0', childrenIds: ['agent-2-1'] },
      'agent-2-1': { id: 'agent-2-1', type: NodeType.AGENT, data: { title: 'SWOT Analysis Agent', description: 'Performs SWOT analysis on scraped data.' }, parentId: 'agent-2', childrenIds: ['critique-2-1'] },
      'critique-2-1': { id: 'critique-2-1', type: NodeType.CRITIQUE, data: { title: 'Review SWOT Analysis', description: 'Check the SWOT analysis for clarity, completeness, and actionable insights.' }, parentId: 'agent-2-1', childrenIds: ['refine-2-1'] },
      'refine-2-1': { id: 'refine-2-1', type: NodeType.REFINE, data: { title: 'Improve SWOT Analysis', description: 'Refine the SWOT based on the critique, making it more concise and impactful.' }, parentId: 'critique-2-1', childrenIds: ['agent-2-2'] },
      'agent-2-2': { id: 'agent-2-2', type: NodeType.AGENT, data: { title: 'Executive Summary Agent', description: 'Generates a concise executive summary from the refined SWOT analysis.' }, parentId: 'refine-2-1', childrenIds: [] }
    },
    selectedNodeId: null
  },
   'flow-3': {
    rootId: 'goal-3',
    nodes: {
      'goal-3': { id: 'goal-3', type: NodeType.GOAL, data: { title: 'SEO Content Generator', description: 'Generate blog posts based on trending keywords.' }, childrenIds: [], parentId: undefined },
    },
    selectedNodeId: null
  },
   'flow-4': {
    rootId: 'goal-4',
    nodes: {
      'goal-4': { id: 'goal-4', type: NodeType.GOAL, data: { title: 'Email Campaign Workflow', description: 'Automated email personalization and scheduling.' }, childrenIds: [], parentId: undefined },
    },
    selectedNodeId: null
  }
};


const App: React.FC = () => {
  const [dashboardFlows, setDashboardFlows] = useState<DashboardFlow[]>(MOCK_DASHBOARD_FLOWS);
  const [flowStates, setFlowStates] = useState<Record<string, FlowState>>(MOCK_FLOW_STATES);
  
  const [view, setView] = useState<'dashboard' | 'editor'>('dashboard');
  const [currentFlowId, setCurrentFlowId] = useState<string | null>(null);

  const handleOpenFlow = useCallback((flowId: string) => {
    setCurrentFlowId(flowId);
    setView('editor');
  }, []);

  const handleGoBack = useCallback(() => {
    setView('dashboard');
    setCurrentFlowId(null);
  }, []);

  const handleCreateNewFlow = useCallback(() => {
    const newFlowId = `flow-${uuidv4()}`;
    const newGoalNodeId = `goal-${uuidv4()}`;

    const newDashboardFlow: DashboardFlow = {
      id: newFlowId,
      icon: 'Default',
      title: 'Untitled Flow',
      description: 'A new workflow. Click to edit and add a description.',
      status: FlowStatus.ACTIVE,
      health: 100,
      metrics: {
        avgRuntime: 0,
        avgCost: 0,
        successRate: 100,
        lastRun: Date.now(),
      },
    };

    const newFlowState: FlowState = {
      rootId: newGoalNodeId,
      nodes: {
        [newGoalNodeId]: {
          id: newGoalNodeId,
          type: NodeType.GOAL,
          data: {
            title: 'Untitled Goal',
            description: 'Define the main objective for this workflow.',
          },
          childrenIds: [],
        },
      },
      selectedNodeId: null,
    };

    setDashboardFlows(prev => [newDashboardFlow, ...prev]);
    setFlowStates(prev => ({ ...prev, [newFlowId]: newFlowState }));
    
    handleOpenFlow(newFlowId);
  }, [handleOpenFlow]);

  if (view === 'editor' && currentFlowId) {
    const flowState = flowStates[currentFlowId];
    if (!flowState) {
        handleGoBack();
        return null;
    }
    return <FlowEditorPage initialFlowState={flowState} onGoBack={handleGoBack} />;
  }

  return <WorkspaceDashboard flows={dashboardFlows} onOpenFlow={handleOpenFlow} onCreateNewFlow={handleCreateNewFlow} />;
};

export default App;