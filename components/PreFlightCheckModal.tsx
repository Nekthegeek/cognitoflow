import React from 'react';
import { PreFlightReport, PreFlightIssue } from '../types';
import { X, ShieldCheck, DollarSign, Clock, AlertTriangle, Lightbulb, CheckCircle, ArrowRight } from 'lucide-react';

interface PreFlightCheckModalProps {
  report: PreFlightReport | null;
  onClose: () => void;
  onJumpToNode: (nodeId: string) => void;
}

const HealthScoreGauge: React.FC<{ score: number }> = ({ score }) => {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;
  const color = score > 80 ? 'text-green-500' : score > 50 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-gray-800"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r="40"
          cx="50"
          cy="50"
        />
        <circle
          className={`transform -rotate-90 origin-center transition-all duration-1000 ${color}`}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="40"
          cx="50"
          cy="50"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-bold ${color}`}>{score}</span>
        <span className="text-xs text-gray-400">Health</span>
      </div>
    </div>
  );
};

const IssueCard: React.FC<{ issue: PreFlightIssue; onJump: (id: string) => void }> = ({ issue, onJump }) => {
  const severityMap = {
    CRITICAL: { icon: AlertTriangle, color: 'red', bg: 'red' },
    WARNING: { icon: AlertTriangle, color: 'yellow', bg: 'yellow' },
    SUGGESTION: { icon: Lightbulb, color: 'blue', bg: 'blue' },
  };
  const severity = severityMap[issue.severity];
  const Icon = severity.icon;

  return (
    <div className={`bg-gray-900 border-l-4 border-${severity.color}-500 rounded-r-lg p-4`}>
      <div className="flex items-start gap-3">
        <div className={`p-1.5 rounded-full bg-${severity.bg}-900/20 text-${severity.color}-400 mt-1`}>
          <Icon size={16} />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-gray-200">{issue.title}</h4>
          <p className="text-xs text-gray-400 mt-1 mb-3">{issue.description}</p>
          <button
            onClick={() => onJump(issue.targetNodeIds[0])}
            className="text-xs font-bold text-primary-400 hover:text-primary-300 flex items-center gap-1"
          >
            Jump to Node <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};


export const PreFlightCheckModal: React.FC<PreFlightCheckModalProps> = ({ report, onClose, onJumpToNode }) => {
  if (!report) return null;

  const criticalIssues = report.issues.filter(i => i.severity === 'CRITICAL');
  const warnings = report.issues.filter(i => i.severity === 'WARNING');
  const suggestions = report.issues.filter(i => i.severity === 'SUGGESTION');

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-gray-950 border border-gray-800 rounded-xl shadow-2xl w-full max-w-3xl h-[90vh] flex flex-col overflow-hidden">
        
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <ShieldCheck size={24} className="text-primary-500" />
            <div>
              <h2 className="text-xl font-bold text-gray-100">Pre-Flight Check Report</h2>
              <p className="text-sm text-gray-500">Proactive analysis of your workflow design.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg text-gray-500 hover:text-white transition-colors">
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-900/30 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex flex-col items-center justify-center">
              <HealthScoreGauge score={report.healthScore} />
            </div>
            <div className="md:col-span-2 space-y-4">
              <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg flex items-center gap-4">
                <DollarSign size={24} className="text-green-400" />
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase">Estimated Cost</div>
                  <div className="text-2xl font-mono text-gray-100">${report.estimatedCost.toFixed(4)}</div>
                </div>
              </div>
              <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg flex items-center gap-4">
                <Clock size={24} className="text-blue-400" />
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase">Estimated Time</div>
                  <div className="text-2xl font-mono text-gray-100">{report.estimatedTimeS.toFixed(1)}s</div>
                </div>
              </div>
            </div>
          </div>

          {report.issues.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-gray-800 rounded-xl bg-gray-900/50">
                <CheckCircle size={48} className="mx-auto text-green-500/50 mb-4" />
                <h3 className="text-lg font-bold text-gray-300">No Issues Found</h3>
                <p className="text-sm text-gray-500 mt-2">Your workflow passed all checks and is ready for execution.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {criticalIssues.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-red-400 uppercase mb-3">Critical ({criticalIssues.length})</h3>
                  <div className="space-y-3">
                    {criticalIssues.map(issue => <IssueCard key={issue.id} issue={issue} onJump={id => { onJumpToNode(id); onClose(); }} />)}
                  </div>
                </div>
              )}
               {warnings.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-yellow-400 uppercase mb-3">Warnings ({warnings.length})</h3>
                  <div className="space-y-3">
                    {warnings.map(issue => <IssueCard key={issue.id} issue={issue} onJump={id => { onJumpToNode(id); onClose(); }} />)}
                  </div>
                </div>
              )}
               {suggestions.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-blue-400 uppercase mb-3">Suggestions ({suggestions.length})</h3>
                  <div className="space-y-3">
                    {suggestions.map(issue => <IssueCard key={issue.id} issue={issue} onJump={id => { onJumpToNode(id); onClose(); }} />)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};