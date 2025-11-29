
import React from 'react';
import { ScorecardResult } from '../types';
import { Target, CheckCircle, XCircle, AlertCircle, X, Award, BarChart } from 'lucide-react';

interface ObjectiveScorecardModalProps {
    scorecard: ScorecardResult;
    onClose: () => void;
}

export const ObjectiveScorecardModal: React.FC<ObjectiveScorecardModalProps> = ({ scorecard, onClose }) => {
    
    const getStatusColor = (status: string) => {
        switch(status) {
            case 'PASSED': return 'text-green-500';
            case 'FAILED': return 'text-red-500';
            default: return 'text-yellow-500';
        }
    };
    
    const getStatusIcon = (status: string) => {
        switch(status) {
            case 'PASSED': return <CheckCircle size={16} />;
            case 'FAILED': return <XCircle size={16} />;
            default: return <AlertCircle size={16} />;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-gray-950 border border-gray-800 rounded-xl shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden max-h-[90vh]">
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-gray-900/50">
                    <div className="flex items-center gap-3">
                        <Award size={24} className="text-yellow-500" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-100">Objective Scorecard</h2>
                            <p className="text-sm text-gray-500">Post-mortem analysis of goal success.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg text-gray-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    
                    {/* Overall Score */}
                    <div className="flex justify-center mb-8">
                         <div className="relative w-40 h-40 flex items-center justify-center">
                             <svg className="w-full h-full transform -rotate-90">
                                 <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-gray-800" />
                                 <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" 
                                    strokeDasharray={440} 
                                    strokeDashoffset={440 - (440 * scorecard.overallScore) / 100}
                                    className={scorecard.overallScore > 80 ? 'text-green-500' : scorecard.overallScore > 50 ? 'text-yellow-500' : 'text-red-500'} 
                                 />
                             </svg>
                             <div className="absolute flex flex-col items-center">
                                 <span className="text-4xl font-bold text-gray-100">{scorecard.overallScore}</span>
                                 <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Score</span>
                             </div>
                         </div>
                    </div>
                    
                    {/* Summary */}
                    <div className="bg-gray-900 p-5 rounded-lg border border-gray-800 mb-8">
                        <h3 className="text-sm font-bold text-gray-400 uppercase mb-2 flex items-center gap-2"><BarChart size={14}/> Executive Summary</h3>
                        <p className="text-sm text-gray-300 leading-relaxed">{scorecard.summary}</p>
                    </div>

                    {/* KPI Breakdown */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">KPI Breakdown</h3>
                        {scorecard.kpiResults.map((result, idx) => (
                            <div key={idx} className="bg-gray-900 border border-gray-800 rounded-lg p-5 flex flex-col md:flex-row gap-5 items-start">
                                <div className={`p-2 rounded-full bg-opacity-20 flex-shrink-0 ${result.status === 'PASSED' ? 'bg-green-900 text-green-500' : result.status === 'FAILED' ? 'bg-red-900 text-red-500' : 'bg-yellow-900 text-yellow-500'}`}>
                                     {getStatusIcon(result.status)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                         <h4 className="text-base font-bold text-gray-200">KPI {idx + 1}</h4>
                                         <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${getStatusColor(result.status)} bg-gray-950 border border-gray-800`}>{result.status}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 font-mono mb-2">Actual: {result.actualValue}</div>
                                    <p className="text-sm text-gray-400 bg-black/20 p-3 rounded border border-gray-800/50">
                                        {result.aiAnalysis}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};
