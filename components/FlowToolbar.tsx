


import React from 'react';
import { FlowStatus } from '../types';
import { ChevronLeft, Activity, Zap, Beaker, Play, Target, Shield, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface FlowToolbarProps {
  flowName: string;
  status: FlowStatus;
  lastRun?: number;
  onRun: () => void;
  onSimulate: () => void;
  onOptimize: () => void;
  onAutopilot: () => void;
  onViewScorecard: () => void;
  onViewCompliance: () => void;
  onExport: () => void;
  onGoBack: () => void;
  onToggleHeatmap: () => void;
  showHeatmap: boolean;
  isProcessing: boolean;
  hasScorecard: boolean;
  hasComplianceIssues: boolean;
  permissions: {
    canEdit: boolean;
    canRun: boolean;
  };
  flowExists: boolean;
}

export const FlowToolbar: React.FC<FlowToolbarProps> = ({
  flowName,
  status,
  lastRun,
  onRun,
  onSimulate,
  onOptimize,
  onAutopilot,
  onViewScorecard,
  onViewCompliance,
  onExport,
  onGoBack,
  onToggleHeatmap,
  showHeatmap,
  isProcessing,
  hasScorecard,
  hasComplianceIssues,
  permissions,
  flowExists
}) => {

  const getStatusInfo = () => {
    switch(status) {
      case FlowStatus.RUNNING: return { icon: <Loader2 size={12} className="animate-spin" />, text: 'Running', color: 'text-blue-400' };
      case FlowStatus.COMPLETED: return { icon: <CheckCircle size={12} />, text: 'Completed', color: 'text-green-400' };
      case FlowStatus.ERROR: return { icon: <XCircle size={12} />, text: 'Failed', color: 'text-red-400' };
      default: return { icon: <AlertCircle size={12} />, text: 'Idle', color: 'text-gray-500' };
    }
  };
  const statusInfo = getStatusInfo();
  
  return (
    <div className="h-14 border-b border-gray-800 flex items-center justify-between px-4 bg-gray-900 z-40 shrink-0 shadow-sm">
      <div className="flex items-center gap-4">
        <button onClick={onGoBack} className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-sm font-medium">
          <ChevronLeft size={16} /> Dashboard
        </button>
        <div className="h-6 w-px bg-gray-700 mx-2"></div>
        <div>
          <h1 className="text-sm font-bold text-gray-200">{flowName}</h1>
           <div className={`flex items-center gap-1.5 text-xs font-bold ${statusInfo.color}`}>
            {statusInfo.icon}
            <span>{statusInfo.text}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {hasComplianceIssues && (
            <button onClick={onViewCompliance} className="flex items-center gap-2 px-3 py-1.5 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded-md text-xs font-bold transition-colors border border-red-500/30 animate-pulse">
                <Shield size={14} /> Compliance Alert
            </button>
        )}
        
        <button 
            onClick={onToggleHeatmap} 
            disabled={!flowExists}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-colors border disabled:opacity-50 disabled:cursor-not-allowed ${showHeatmap ? 'bg-orange-900/20 border-orange-500/50 text-orange-400' : 'bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-400'}`}
            title="Toggle Performance Heatmap"
        >
            <Activity size={14} /> Heatmap
        </button>
        
        {hasScorecard && (
             <button onClick={onViewScorecard} className="flex items-center gap-2 px-3 py-1.5 bg-green-900/20 hover:bg-green-900/40 text-green-400 rounded-md text-xs font-bold transition-colors border border-green-500/30">
                <Target size={14} /> Scorecard
             </button>
        )}

        {permissions.canEdit && (
          <>
            <button onClick={onOptimize} disabled={!flowExists} className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-yellow-400 rounded-md text-xs font-bold transition-colors border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
              <Zap size={14} /> Optimize
            </button>
            <button onClick={onSimulate} className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-purple-400 rounded-md text-xs font-bold transition-colors border border-gray-700">
              <Beaker size={14} /> Simulate
            </button>
            <button onClick={onAutopilot} className="flex items-center gap-2 px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md text-xs font-bold transition-colors shadow-lg shadow-cyan-900/20">
               <Play size={14} fill="currentColor" /> Autopilot
            </button>
          </>
        )}
      </div>
    </div>
  );
};