import React from 'react';
import { DashboardFlow } from '../types';
import { Edit, BarChart2, Play, AlertTriangle, Clock, DollarSign, Check, Calendar, GitMerge, UserCheck, RefreshCw, Archive, RotateCcw, MessageSquare, Brain, Wrench, Gavel, Target, FileText } from 'lucide-react';

interface FlowCardProps {
  flow: DashboardFlow;
  onOpenFlow: (flowId: string) => void;
}

const iconMap: { [key: string]: React.ReactElement } = {
  '📊': <BarChart2 size={20} />,
  '🔍': <MessageSquare size={20} />,
  '✍️': <FileText size={20} />,
  '📧': <MessageSquare size={20} />,
  'Default': <GitMerge size={20} />,
};

const Metric = ({ icon, label, value }: { icon: React.ReactElement; label: string; value: string | number }) => (
  <div className="flex items-center gap-1.5" title={label}>
    {icon}
    <span className="font-semibold text-text-secondary">{value}</span>
  </div>
);

export const FlowCard: React.FC<FlowCardProps> = ({ flow, onOpenFlow }) => {
  const statusStyles = {
    ACTIVE: {
      healthy: {
        border: 'border-status-success',
        badgeBg: 'bg-status-success/10',
        badgeText: 'text-status-success',
        healthText: 'text-status-success',
      },
      warning: {
        border: 'border-status-warning',
        badgeBg: 'bg-status-warning/10',
        badgeText: 'text-status-warning',
        healthText: 'text-status-warning',
      },
    },
    PAUSED: {
      border: 'border-status-inactive',
      badgeBg: 'bg-status-inactive/10',
      badgeText: 'text-status-inactive',
      healthText: 'text-status-inactive',
    },
    FAILED: {
      border: 'border-status-error',
      badgeBg: 'bg-status-error/10',
      badgeText: 'text-status-error',
      healthText: 'text-status-error',
    },
     RUNNING: {
      border: 'border-status-info',
      badgeBg: 'bg-status-info/10',
      badgeText: 'text-status-info',
      healthText: 'text-status-info',
    },
     COMPLETED: {
      border: 'border-status-success',
      badgeBg: 'bg-status-success/10',
      badgeText: 'text-status-success',
      healthText: 'text-status-success',
    },
     ERROR: {
      border: 'border-status-error',
      badgeBg: 'bg-status-error/10',
      badgeText: 'text-status-error',
      healthText: 'text-status-error',
    },
     IDLE: {
      border: 'border-status-inactive',
      badgeBg: 'bg-status-inactive/10',
      badgeText: 'text-status-inactive',
      healthText: 'text-status-inactive',
    },
  };

  const getStatusStyle = () => {
    if (flow.status === 'ACTIVE') {
      return flow.health >= 90 ? statusStyles.ACTIVE.healthy : statusStyles.ACTIVE.warning;
    }
    const style = statusStyles[flow.status];
    return style || statusStyles.PAUSED; // Fallback
  };

  const style = getStatusStyle();

  return (
    <div className={`relative bg-bg-card border border-border-primary border-l-4 ${style.border} rounded-xl p-6 flex flex-col gap-4 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-2xl hover:border-accent-primary/50 ${flow.status === 'PAUSED' ? 'opacity-80' : ''}`}>
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          {iconMap[flow.icon] || iconMap['Default']}
          <div>
            <h3 onClick={() => onOpenFlow(flow.id)} className="font-semibold text-lg text-text-primary cursor-pointer hover:underline">{flow.title}</h3>
            <p className="text-sm text-text-tertiary line-clamp-1">{flow.description}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${style.badgeBg} ${style.badgeText}`}>
            <div className={`w-2 h-2 rounded-full ${style.border.replace('border-', 'bg-')}`}></div>
            {flow.status}
          </div>
          <div className={`font-bold text-lg ${style.healthText}`}>{flow.health}%</div>
        </div>
      </div>

      {/* Contextual Info Box */}
      {flow.status === 'ACTIVE' && flow.health < 90 && flow.warning && (
        <div className="bg-status-warning/10 border border-status-warning/20 rounded-lg p-4 text-sm">
          <div className="flex items-center gap-2 font-bold text-status-warning mb-2">
            <AlertTriangle size={16} /> PERFORMANCE WARNING
          </div>
          <p className="text-text-secondary mb-3">{flow.warning.details}</p>
          <button className="text-xs font-bold text-status-warning hover:underline">{flow.warning.action.label} →</button>
        </div>
      )}
      {flow.status === 'PAUSED' && flow.pausedInfo && (
        <div className="bg-status-inactive/10 border border-status-inactive/20 rounded-lg p-4 text-sm text-text-tertiary italic">
          Paused {new Date(flow.pausedInfo.timestamp).toLocaleDateString()} by {flow.pausedInfo.user}. Reason: "{flow.pausedInfo.reason}"
        </div>
      )}
      {flow.status === 'FAILED' && flow.errorInfo && (
        <div className="bg-status-error/10 border border-status-error/20 rounded-lg p-4 text-sm">
          <div className="flex items-center gap-2 font-bold text-status-error mb-2">
            <AlertTriangle size={16} /> ERROR: {flow.errorInfo.title}
          </div>
          <p className="text-text-secondary mb-3 font-mono text-xs">{flow.errorInfo.details}</p>
          <div className="flex gap-2">
            <button className="text-xs font-bold text-status-error hover:underline">View Error Logs</button>
            <button className="text-xs font-bold text-status-error hover:underline">Fix Configuration</button>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="bg-bg-primary/50 rounded-lg p-3 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-sm">
        <Metric icon={<Clock size={16} className="text-text-tertiary" />} label="Average Runtime" value={`${flow.metrics.avgRuntime}s`} />
        <Metric icon={<DollarSign size={16} className="text-text-tertiary" />} label="Average Cost" value={`$${flow.metrics.avgCost.toFixed(3)}`} />
        <Metric icon={<Check size={16} className="text-text-tertiary" />} label="Success Rate" value={`${flow.metrics.successRate}%`} />
        <Metric icon={<Calendar size={16} className="text-text-tertiary" />} label="Last Run" value={new Date(flow.metrics.lastRun).toLocaleString()} />
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mt-auto pt-4 border-t border-border-primary">
        <div className="flex gap-2">
          <button className="px-4 h-9 flex items-center gap-2 text-sm font-medium bg-bg-hover/50 border border-border-primary rounded-lg text-text-secondary hover:bg-bg-hover hover:border-border-hover">
            <Edit size={14} /> Edit
          </button>
          <button className="px-4 h-9 flex items-center gap-2 text-sm font-medium bg-bg-hover/50 border border-border-primary rounded-lg text-text-secondary hover:bg-bg-hover hover:border-border-hover">
            <BarChart2 size={14} /> Analytics
          </button>
        </div>
        <div className="flex gap-2">
          {flow.status === 'PAUSED' && (
            <button className="px-5 h-9 flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-accent-secondary to-accent-primary text-white rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-glow-primary">
              <Play size={14} /> Resume
            </button>
          )}
          {flow.status === 'ACTIVE' && (
            <button className="px-5 h-9 flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-accent-secondary to-accent-primary text-white rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-glow-primary">
              <Play size={14} /> Run Now
            </button>
          )}
          {flow.status === 'FAILED' && (
             <>
              <button className="px-4 h-9 flex items-center gap-2 text-sm font-medium bg-bg-hover/50 border border-border-primary rounded-lg text-text-secondary hover:bg-bg-hover hover:border-border-hover hover:text-status-error">
                <Archive size={14} /> Archive
              </button>
              <button className="px-5 h-9 flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-accent-secondary to-accent-primary text-white rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-glow-primary">
                <RotateCcw size={14} /> Retry
              </button>
             </>
          )}
        </div>
      </div>
    </div>
  );
};
