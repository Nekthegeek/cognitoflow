
import React, { useState } from 'react';
import { SimulationScenario } from '../types';
import { Beaker, X, Activity, AlertTriangle, Zap, Play } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface SimulationConfigModalProps {
    onRun: (scenario: SimulationScenario) => void;
    onClose: () => void;
}

export const SimulationConfigModal: React.FC<SimulationConfigModalProps> = ({ onRun, onClose }) => {
    const [selectedType, setSelectedType] = useState<SimulationScenario['type']>('HAPPY_PATH');
    const [inputVolume, setInputVolume] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('LOW');
    const [errorRate, setErrorRate] = useState(0);

    const handleRun = () => {
        onRun({
            id: uuidv4(),
            name: `${selectedType} Simulation`,
            description: `Generated ${selectedType} scenario with ${inputVolume} volume.`,
            type: selectedType,
            parameters: {
                inputVolume,
                errorInjectionRate: errorRate,
                syntheticDataProfile: 'STANDARD'
            }
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-gray-950 border border-purple-500/30 rounded-xl shadow-[0_0_50px_rgba(168,85,247,0.1)] w-full max-w-2xl flex flex-col overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-purple-900/10">
                    <div className="flex items-center gap-3">
                        <Beaker size={24} className="text-purple-500" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-100">Flow Simulation Mode</h2>
                            <p className="text-sm text-purple-400">Run dry-run forecasts with synthetic data.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg text-gray-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    {/* Scenario Type Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => setSelectedType('HAPPY_PATH')}
                            className={`p-4 rounded-xl border text-left transition-all ${selectedType === 'HAPPY_PATH' ? 'bg-purple-900/20 border-purple-500 shadow-lg shadow-purple-900/20' : 'bg-gray-900 border-gray-800 hover:border-gray-700'}`}
                        >
                            <div className="flex items-center gap-2 mb-2 text-green-400 font-bold"><Zap size={18}/> Happy Path</div>
                            <p className="text-xs text-gray-400">Standard execution flow with valid inputs. Good for baseline costing.</p>
                        </button>
                        <button 
                            onClick={() => setSelectedType('EDGE_CASE')}
                            className={`p-4 rounded-xl border text-left transition-all ${selectedType === 'EDGE_CASE' ? 'bg-purple-900/20 border-purple-500 shadow-lg shadow-purple-900/20' : 'bg-gray-900 border-gray-800 hover:border-gray-700'}`}
                        >
                            <div className="flex items-center gap-2 mb-2 text-yellow-400 font-bold"><AlertTriangle size={18}/> Edge Cases</div>
                            <p className="text-xs text-gray-400">Test boundary conditions and unusual inputs to find breaks.</p>
                        </button>
                        <button 
                            onClick={() => setSelectedType('STRESS_TEST')}
                            className={`p-4 rounded-xl border text-left transition-all ${selectedType === 'STRESS_TEST' ? 'bg-purple-900/20 border-purple-500 shadow-lg shadow-purple-900/20' : 'bg-gray-900 border-gray-800 hover:border-gray-700'}`}
                        >
                            <div className="flex items-center gap-2 mb-2 text-red-400 font-bold"><Activity size={18}/> Stress Test</div>
                            <p className="text-xs text-gray-400">High volume simulation to estimate latency and token limits.</p>
                        </button>
                    </div>

                    {/* Parameters */}
                    <div className="bg-gray-900 p-5 rounded-xl border border-gray-800 space-y-4">
                        <h3 className="text-xs font-bold text-gray-500 uppercase">Configuration</h3>
                        
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-gray-300">Input Volume</label>
                                <span className="text-xs text-purple-400 font-bold">{inputVolume}</span>
                            </div>
                            <div className="flex gap-2">
                                {['LOW', 'MEDIUM', 'HIGH'].map(vol => (
                                    <button 
                                        key={vol} 
                                        onClick={() => setInputVolume(vol as any)}
                                        className={`flex-1 py-1.5 text-xs font-bold rounded ${inputVolume === vol ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'}`}
                                    >
                                        {vol}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                             <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-gray-300">Synthetic Error Rate</label>
                                <span className="text-xs text-purple-400 font-bold">{errorRate}%</span>
                            </div>
                            <input 
                                type="range" min="0" max="50" step="5"
                                value={errorRate} 
                                onChange={(e) => setErrorRate(parseInt(e.target.value))}
                                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                        </div>
                    </div>

                    <button 
                        onClick={handleRun}
                        className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-purple-900/30 transition-transform active:scale-95"
                    >
                        <Play size={20} fill="currentColor"/> Run Simulation
                    </button>
                </div>
            </div>
        </div>
    );
};
