

import React from 'react';
import { Play, SkipForward, RotateCcw, X, Beaker } from 'lucide-react';

interface SimulationControlsProps {
  onStep: () => void;
  onReset: () => void;
  onExit: () => void;
  currentStep: number;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({ onStep, onReset, onExit, currentStep }) => {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900/90 border border-cyan-500/30 rounded-full px-6 py-3 shadow-[0_0_30px_rgba(6,182,212,0.2)] backdrop-blur-md flex items-center gap-6 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
      <div className="flex items-center gap-2 pr-4 border-r border-gray-700">
        <Beaker size={20} className="text-cyan-400 animate-pulse" />
        <div>
          <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Simulation Mode</div>
          <div className="text-[10px] text-gray-400 font-mono">Step: {currentStep}</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={onReset}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
          title="Reset Simulation"
        >
          <RotateCcw size={18} />
        </button>
        
        <button 
          onClick={onStep}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full font-bold text-xs transition-all hover:scale-105 shadow-lg shadow-cyan-900/20"
        >
          <SkipForward size={14} fill="currentColor" /> Step Forward
        </button>
      </div>

      <div className="pl-4 border-l border-gray-700">
        <button 
          onClick={onExit}
          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-full transition-colors"
          title="Exit Simulation"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};