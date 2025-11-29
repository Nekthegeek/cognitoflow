
import React from 'react';
import { ComplianceResult } from '../types';
import { Shield, X, AlertTriangle, CheckCircle, FileText } from 'lucide-react';

interface ComplianceLogModalProps {
    results: { nodeId: string; result: ComplianceResult }[];
    onClose: () => void;
}

export const ComplianceLogModal: React.FC<ComplianceLogModalProps> = ({ results, onClose }) => {
    
    // Sort by severity (DANGER first)
    const sorted = [...results].sort((a, b) => {
        const scoreA = a.result.status === 'DANGER' ? 3 : a.result.status === 'WARNING' ? 2 : 1;
        const scoreB = b.result.status === 'DANGER' ? 3 : b.result.status === 'WARNING' ? 2 : 1;
        return scoreB - scoreA;
    });

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-gray-950 border border-gray-800 rounded-xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden max-h-[90vh]">
                
                <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-gray-900/50">
                    <div className="flex items-center gap-3">
                        <Shield size={24} className="text-red-400" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-100">Ethics & Compliance Engine</h2>
                            <p className="text-sm text-gray-500">Automated audit trail for bias, toxicity, and regulatory risks.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg text-gray-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-gray-900/10 custom-scrollbar space-y-4">
                    {sorted.length === 0 ? (
                         <div className="text-center py-20 text-gray-600">
                             <CheckCircle size={48} className="mx-auto mb-4 text-green-500/50" />
                             <p>No compliance checks recorded yet.</p>
                         </div>
                    ) : sorted.map((item, idx) => (
                        <div key={idx} className="bg-gray-900 border border-gray-800 rounded-lg p-5">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-mono text-gray-500">Node ID: {item.nodeId}</span>
                                        <span className="text-[10px] text-gray-600">{new Date(item.result.scannedAt).toLocaleTimeString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-sm font-bold px-2 py-0.5 rounded uppercase
                                            ${item.result.status === 'DANGER' ? 'bg-red-900/30 text-red-400' :
                                              item.result.status === 'WARNING' ? 'bg-yellow-900/30 text-yellow-400' :
                                              'bg-green-900/30 text-green-400'}`}>
                                            {item.result.status}
                                        </span>
                                        <span className="text-xs font-bold text-gray-400">Score: {item.result.score}/100</span>
                                    </div>
                                </div>
                            </div>
                            
                            {item.result.violations.length > 0 ? (
                                <div className="space-y-3">
                                    {item.result.violations.map((v, vIdx) => (
                                        <div key={vIdx} className="bg-black/20 p-3 rounded border border-gray-800 flex gap-3">
                                            <div className="mt-1">
                                                <AlertTriangle size={16} className={v.severity === 'HIGH' ? 'text-red-500' : 'text-yellow-500'} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-bold text-gray-300">{v.category}</span>
                                                    <span className="text-[10px] text-gray-500 uppercase">{v.severity} Severity</span>
                                                </div>
                                                <p className="text-sm text-gray-400 mb-2">{v.description}</p>
                                                <div className="text-xs text-green-400 flex items-center gap-1">
                                                    <FileText size={10} /> Suggestion: {v.suggestion}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-green-500 flex items-center gap-2"><CheckCircle size={14}/> No violations detected.</p>
                            )}

                            {item.result.piiDetected.length > 0 && (
                                <div className="mt-4 pt-3 border-t border-gray-800">
                                    <span className="text-xs font-bold text-red-400 uppercase">PII Redacted:</span>
                                    <div className="flex gap-2 mt-1 flex-wrap">
                                        {item.result.piiDetected.map((pii, pIdx) => (
                                            <span key={pIdx} className="text-[10px] bg-red-900/20 text-red-300 px-2 py-1 rounded font-mono">{pii}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
