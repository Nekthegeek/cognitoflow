
import React, { useEffect, useState } from 'react';
import { Zap, Loader2, PlayCircle, CheckCircle, Terminal } from 'lucide-react';

interface AutopilotOverlayProps {
    status: 'PLANNING' | 'EXECUTING' | 'REFINING' | 'IDLE';
    log: string[];
    onStop: () => void;
}

export const AutopilotOverlay: React.FC<AutopilotOverlayProps> = ({ status, log, onStop }) => {
    
    return (
        <div className="absolute inset-0 z-40 bg-gray-950/90 backdrop-blur-md flex flex-col items-center justify-center p-8 pointer-events-auto">
            
            <div className="relative w-full max-w-3xl">
                {/* Decorative Elements */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-indigo-500 rounded-2xl blur opacity-30 animate-pulse"></div>
                
                <div className="relative bg-gray-950 border border-gray-800 rounded-2xl p-8 shadow-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-cyan-900/20 flex items-center justify-center text-cyan-400 animate-[spin_4s_linear_infinite]">
                                    <Zap size={24} />
                                </div>
                                <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-full animate-ping"></div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white tracking-tight">Flow Autopilot</h2>
                                <p className="text-sm text-cyan-400 font-mono uppercase tracking-widest">{status}</p>
                            </div>
                        </div>
                        <button onClick={onStop} className="px-6 py-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/50 rounded-lg text-sm font-bold transition-colors">
                            EMERGENCY STOP
                        </button>
                    </div>

                    {/* Terminal Output */}
                    <div className="bg-black/80 rounded-lg p-6 font-mono text-xs h-64 overflow-y-auto custom-scrollbar border border-gray-800/50 shadow-inner">
                        {log.map((line, i) => (
                            <div key={i} className="mb-2 flex gap-2 animate-in slide-in-from-left-2 fade-in duration-300">
                                <span className="text-gray-600">[{new Date().toLocaleTimeString()}]</span>
                                <span className={line.includes('ERROR') ? 'text-red-400' : line.includes('SUCCESS') ? 'text-green-400' : 'text-gray-300'}>
                                    {line}
                                </span>
                            </div>
                        ))}
                        <div className="animate-pulse text-cyan-500">_</div>
                    </div>

                    {/* Progress Indicators */}
                    <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                        <div className={`p-4 rounded-lg border ${status === 'PLANNING' ? 'bg-cyan-900/20 border-cyan-500/50 text-cyan-300' : 'bg-gray-900 border-gray-800 text-gray-600'}`}>
                            <div className="mb-2"><Terminal className="mx-auto" size={20}/></div>
                            <span className="text-xs font-bold uppercase">Planning</span>
                        </div>
                        <div className={`p-4 rounded-lg border ${status === 'EXECUTING' ? 'bg-purple-900/20 border-purple-500/50 text-purple-300' : 'bg-gray-900 border-gray-800 text-gray-600'}`}>
                            <div className="mb-2"><Loader2 className={`mx-auto ${status === 'EXECUTING' ? 'animate-spin' : ''}`} size={20}/></div>
                            <span className="text-xs font-bold uppercase">Executing</span>
                        </div>
                        <div className={`p-4 rounded-lg border ${status === 'REFINING' ? 'bg-indigo-900/20 border-indigo-500/50 text-indigo-300' : 'bg-gray-900 border-gray-800 text-gray-600'}`}>
                            <div className="mb-2"><CheckCircle className="mx-auto" size={20}/></div>
                            <span className="text-xs font-bold uppercase">Refining</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
