import React from 'react';
import { FlowNode, NodeType, NodeData, ObjectiveKPI, HumanReviewConfig } from '../types';
import { Brain, Plus, Gavel, RefreshCw, AlertTriangle, Scale, Wrench, ShieldAlert, Zap, Target, Trash2, Beaker, Activity, CheckCircle, GitMerge, UserCheck } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface NodeDetailPanelProps {
    node: FlowNode;
    onUpdateData: (id: string, data: Partial<NodeData>) => void;
}

export const NodeDetailPanel: React.FC<NodeDetailPanelProps> = ({ node, onUpdateData }) => {
    
    // KPI Helper functions
    const addKPI = () => {
        const currentKPIs = node.data.objectives || [];
        onUpdateData(node.id, { 
            objectives: [...currentKPIs, { id: uuidv4(), name: 'New KPI', targetValue: '', metricType: 'NUMERIC', source: 'AI_EVALUATION' }] 
        });
    };
    
    const updateKPI = (id: string, field: keyof ObjectiveKPI, value: any) => {
        const currentKPIs = node.data.objectives || [];
        const updated = currentKPIs.map(k => k.id === id ? { ...k, [field]: value } : k);
        onUpdateData(node.id, { objectives: updated });
    };
    
    const removeKPI = (id: string) => {
        const currentKPIs = node.data.objectives || [];
        onUpdateData(node.id, { objectives: currentKPIs.filter(k => k.id !== id) });
    };
    
    // Human Review config update handler (FIXED)
    const handleHumanReviewUpdate = (updates: Partial<HumanReviewConfig>) => {
        const currentConfig = node.data.humanReviewConfig || { instructions: '', options: [] };
        onUpdateData(node.id, {
            humanReviewConfig: { ...currentConfig, ...updates }
        });
    };


    return (
        <div className="p-4 bg-gray-900 h-full border-l border-gray-800 overflow-y-auto">
            <h2 className="text-lg font-bold text-white mb-4">Node Details</h2>
            
            {node.type === NodeType.GOAL && (
                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 space-y-4">
                    <h4 className="text-xs font-bold text-purple-400 uppercase flex items-center gap-2">
                        <Beaker size={14}/> Flow Simulation Config
                    </h4>
                    <p className="text-[10px] text-gray-500">
                        Define default parameters for "What-If" analysis and forecasting simulations on this workflow.
                    </p>

                    <div className="space-y-3">
                         <div>
                            <label className="text-xs text-gray-500 block mb-1">Default Scenario Type</label>
                            <select 
                                value={node.data.simulationConfig?.defaultScenarioType || 'HAPPY_PATH'}
                                onChange={(e) => onUpdateData(node.id, { 
                                    simulationConfig: { ...node.data.simulationConfig, defaultScenarioType: e.target.value } as any 
                                })}
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-xs text-gray-200 outline-none"
                            >
                                <option value="HAPPY_PATH">Happy Path (Baseline)</option>
                                <option value="EDGE_CASE">Edge Case Analysis</option>
                                <option value="STRESS_TEST">Stress Test (High Volume)</option>
                                <option value="REGULATORY_AUDIT">Regulatory Audit</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                 <label className="text-xs text-gray-500 block mb-1">Input Volume</label>
                                 <select 
                                    value={node.data.simulationConfig?.defaultInputVolume || 'MEDIUM'}
                                    onChange={(e) => onUpdateData(node.id, { 
                                        simulationConfig: { ...node.data.simulationConfig, defaultInputVolume: e.target.value } as any 
                                    })}
                                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-xs text-gray-200 outline-none"
                                >
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                </select>
                            </div>
                             <div>
                                 <label className="text-xs text-gray-500 block mb-1">Error Rate (%)</label>
                                 <input 
                                    type="number" min="0" max="100"
                                    value={node.data.simulationConfig?.defaultErrorRate ?? 0}
                                    onChange={(e) => onUpdateData(node.id, { 
                                        simulationConfig: { ...node.data.simulationConfig, defaultErrorRate: parseInt(e.target.value) } as any 
                                    })}
                                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-xs text-gray-200 outline-none"
                                />
                            </div>
                        </div>

                        <div className="bg-black/20 p-2 rounded border border-purple-500/20">
                             <div className="flex items-center gap-2 mb-1">
                                <Activity size={12} className="text-purple-400" />
                                <span className="text-[10px] font-bold text-purple-300">Forecasting Enabled</span>
                             </div>
                             <p className="text-[10px] text-gray-500">
                                The AI will use these settings to predict cost, latency, and success probability before execution.
                             </p>
                        </div>
                    </div>
                </div>
            )}

            {node.type === NodeType.AGENT && (
               <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-lg p-4 space-y-4">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase flex items-center gap-2"><Brain size={14}/> Cognitive Agent Configuration</h4>
                  <div><label className="text-xs text-gray-500 block mb-1">Persona</label><input value={node.data.agentConfig?.persona || ''} onChange={(e) => onUpdateData(node.id, { agentConfig: { ...node.data.agentConfig, persona: e.target.value } as any })} className="w-full bg-black/40 border border-indigo-500/30 rounded p-2 text-xs text-indigo-100"/></div>
                  <div><label className="text-xs text-gray-500 block mb-1">Objective</label><textarea value={node.data.agentConfig?.objective || ''} onChange={(e) => onUpdateData(node.id, { agentConfig: { ...node.data.agentConfig, objective: e.target.value } as any })} className="w-full bg-black/40 border border-indigo-500/30 rounded p-2 text-xs text-indigo-100" rows={3}/></div>
                  
                  {/* Autonomy Controls */}
                  <div className="bg-black/20 p-3 rounded-md space-y-3">
                      <div className="flex justify-between items-center">
                          <label className="text-xs font-semibold text-gray-400">Autonomy Level</label>
                          <span className="text-[10px] text-indigo-400 font-mono">{node.data.agentConfig?.autonomyLevel ?? 50}%</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-gray-600">Manual</span>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          step="10"
                          value={node.data.agentConfig?.autonomyLevel ?? 50} 
                          onChange={(e) => onUpdateData(node.id, { agentConfig: { ...node.data.agentConfig, autonomyLevel: parseInt(e.target.value) } as any })}
                          className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                        <span className="text-[10px] text-gray-600">Auto</span>
                      </div>
                      <div className="pt-2 border-t border-white/5">
                          <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Human Override Triggers</label>
                          <div className="flex gap-2 flex-wrap">
                              <span className="text-[10px] px-2 py-1 bg-indigo-900/30 text-indigo-300 rounded border border-indigo-500/20 cursor-pointer hover:bg-indigo-900/50">Low Confidence &lt; 70%</span>
                              <span className="text-[10px] px-2 py-1 bg-indigo-900/30 text-indigo-300 rounded border border-indigo-500/20 cursor-pointer hover:bg-indigo-900/50">High Cost &gt; $5</span>
                              <button className="text-[10px] px-2 py-1 bg-gray-800 text-gray-400 rounded hover:text-white flex items-center gap-1"><Plus size={10}/> Add</button>
                          </div>
                      </div>
                  </div>

                  {/* Cognitive Memory Layer Configuration */}
                  <div className="bg-black/20 p-3 rounded-md space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-xs font-semibold text-indigo-300 flex items-center gap-2">
                             <Brain size={12} /> Cognitive Memory Layer
                          </label>
                          <p className="text-[10px] text-gray-500">Persistent cross-flow knowledge graph.</p>
                        </div>
                        <button 
                            onClick={() => onUpdateData(node.id, { 
                                agentConfig: { 
                                    ...node.data.agentConfig, 
                                    memoryEnabled: !node.data.agentConfig?.memoryEnabled,
                                    memoryDepth: !node.data.agentConfig?.memoryEnabled ? 5 : node.data.agentConfig?.memoryDepth // Default to 5 when enabling
                                } as any 
                            })} 
                            className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${node.data.agentConfig?.memoryEnabled ? 'bg-indigo-600' : 'bg-gray-700'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${node.data.agentConfig?.memoryEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </button>
                      </div>

                      {node.data.agentConfig?.memoryEnabled && (
                          <div className="pt-2 border-t border-white/5 space-y-3 animate-in slide-in-from-top-2 fade-in duration-200">
                              <div>
                                  <div className="flex justify-between items-center mb-1">
                                      <label className="text-xs text-gray-400">Memory Depth (Context Window)</label>
                                      <span className="text-[10px] text-indigo-400 font-mono">{node.data.agentConfig?.memoryDepth ?? 5} Items</span>
                                  </div>
                                  <input 
                                      type="range" min="1" max="20" 
                                      value={node.data.agentConfig?.memoryDepth ?? 5}
                                      onChange={(e) => onUpdateData(node.id, { agentConfig: { ...node.data.agentConfig, memoryDepth: parseInt(e.target.value) } as any })}
                                      className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                  />
                              </div>
                              
                              <div className="flex items-start gap-2 bg-indigo-900/20 p-2 rounded text-[10px] text-indigo-200 border border-indigo-500/20">
                                  <CheckCircle size={12} className="mt-0.5 shrink-0" />
                                  <span>
                                      Agent will automatically store <strong>key decisions</strong> and <strong>strategic learnings</strong> to the shared Knowledge Base after execution.
                                  </span>
                              </div>
                          </div>
                      )}
                  </div>
               </div>
            )}

            {node.type === NodeType.TOOL && (
                <div className="bg-orange-950/20 border border-orange-500/30 rounded-lg p-4 space-y-4">
                    <h4 className="text-xs font-bold text-orange-400 uppercase flex items-center gap-2"><Wrench size={14}/> Tool Execution Logic</h4>
                    <p className="text-[10px] text-gray-500">Configures how this tool interacts with external APIs and handles errors.</p>
                    
                    <div className="bg-black/20 p-3 rounded-md space-y-3">
                         <label className="text-xs font-semibold text-gray-400 flex items-center gap-1"><Zap size={12}/> Execution Mode</label>
                         <div className="flex gap-2">
                             <button 
                                onClick={() => onUpdateData(node.id, { toolConfig: { ...node.data.toolConfig, mode: 'SEQUENTIAL' } as any })}
                                className={`flex-1 py-2 text-[10px] font-bold rounded border transition-colors ${node.data.toolConfig?.mode === 'SEQUENTIAL' || !node.data.toolConfig?.mode ? 'bg-orange-900/40 border-orange-500 text-orange-300' : 'bg-gray-900 border-gray-700 text-gray-500'}`}
                             >
                                Sequential
                             </button>
                             <button 
                                onClick={() => onUpdateData(node.id, { toolConfig: { ...node.data.toolConfig, mode: 'PARALLEL' } as any })}
                                className={`flex-1 py-2 text-[10px] font-bold rounded border transition-colors ${node.data.toolConfig?.mode === 'PARALLEL' ? 'bg-orange-900/40 border-orange-500 text-orange-300' : 'bg-gray-900 border-gray-700 text-gray-500'}`}
                             >
                                Parallel Fork
                             </button>
                         </div>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-xs text-gray-500">Retry Attempts</label>
                                <span className="text-[10px] text-orange-400 font-mono">{node.data.toolConfig?.retryCount ?? 0}</span>
                            </div>
                            <input 
                                type="range" min="0" max="5" 
                                value={node.data.toolConfig?.retryCount ?? 0}
                                onChange={(e) => onUpdateData(node.id, { toolConfig: { ...node.data.toolConfig, retryCount: parseInt(e.target.value) } as any })}
                                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-xs text-gray-500">Timeout (ms)</label>
                                <span className="text-[10px] text-orange-400 font-mono">{node.data.toolConfig?.timeoutMs ?? 5000}ms</span>
                            </div>
                            <input 
                                type="range" min="1000" max="30000" step="1000"
                                value={node.data.toolConfig?.timeoutMs ?? 5000}
                                onChange={(e) => onUpdateData(node.id, { toolConfig: { ...node.data.toolConfig, timeoutMs: parseInt(e.target.value) } as any })}
                                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between bg-red-900/10 p-2 rounded border border-red-900/30">
                         <div className="flex items-center gap-2">
                             <ShieldAlert size={14} className="text-red-400"/>
                             <label className="text-xs text-red-200">Continue on Error</label>
                         </div>
                         <input 
                            type="checkbox" 
                            checked={node.data.toolConfig?.continueOnError ?? false}
                            onChange={(e) => onUpdateData(node.id, { toolConfig: { ...node.data.toolConfig, continueOnError: e.target.checked } as any })}
                            className="rounded bg-gray-800 border-gray-600 text-red-500 focus:ring-red-500"
                         />
                    </div>
                </div>
            )}

            {node.type === NodeType.CRITIQUE && (
                <div className="bg-red-950/20 border border-red-500/30 rounded-lg p-4 space-y-4">
                    <h4 className="text-xs font-bold text-red-400 uppercase flex items-center gap-2"><Gavel size={14}/> LLM-as-Judge Configuration</h4>
                    <p className="text-[10px] text-gray-500">Define the rubric and criteria for evaluating the output of previous nodes.</p>
                    
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">Evaluation Rubric</label>
                        <textarea 
                            placeholder="e.g. Check for factual accuracy, tone consistency, and grammar."
                            value={node.data.critiqueConfig?.rubric || ''}
                            onChange={(e) => onUpdateData(node.id, { critiqueConfig: { ...node.data.critiqueConfig, rubric: e.target.value } as any })}
                            className="w-full bg-black/40 border border-red-500/30 rounded p-2 text-xs text-red-100 placeholder-red-900/50" rows={4}
                        />
                    </div>
                    
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">Primary Focus Area</label>
                        <input 
                            placeholder="e.g. Technical Correctness"
                            value={node.data.critiqueConfig?.focusArea || ''}
                            onChange={(e) => onUpdateData(node.id, { critiqueConfig: { ...node.data.critiqueConfig, focusArea: e.target.value } as any })}
                            className="w-full bg-black/40 border border-red-500/30 rounded p-2 text-xs text-red-100"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                         <label className="text-xs text-gray-500">Grading Scale</label>
                         <select 
                            value={node.data.critiqueConfig?.gradingScale || 'SCORE_1_10'}
                            onChange={(e) => onUpdateData(node.id, { critiqueConfig: { ...node.data.critiqueConfig, gradingScale: e.target.value } as any })}
                            className="bg-black/40 border border-red-500/30 rounded p-1 text-xs text-red-100 outline-none"
                         >
                             <option value="PASS_FAIL">Pass / Fail</option>
                             <option value="SCORE_1_10">Score (1-10)</option>
                             <option value="SCORE_0_100">Score (0-100)</option>
                         </select>
                    </div>
                </div>
            )}

            {node.type === NodeType.REFINE && (
                <div className="bg-teal-950/20 border border-teal-500/30 rounded-lg p-4 space-y-4">
                    <h4 className="text-xs font-bold text-teal-400 uppercase flex items-center gap-2"><RefreshCw size={14}/> Revision Engine</h4>
                    <p className="text-[10px] text-gray-500">Configures how the content should be improved based on critique feedback.</p>

                    <div className="bg-black/20 p-3 rounded-md space-y-3">
                         <div className="flex justify-between items-center">
                              <label className="text-xs font-semibold text-gray-400">Max Iterations</label>
                              <span className="text-[10px] text-teal-400 font-mono">{node.data.refineConfig?.maxIterations ?? 1}</span>
                         </div>
                         <input 
                            type="range" min="1" max="5" step="1"
                            value={node.data.refineConfig?.maxIterations ?? 1} 
                            onChange={(e) => onUpdateData(node.id, { refineConfig: { ...node.data.refineConfig, maxIterations: parseInt(e.target.value) } as any })}
                            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
                         />
                         <p className="text-[10px] text-gray-500 flex items-center gap-1"><AlertTriangle size={10} /> Higher iterations increase cost and time.</p>
                    </div>

                    <div className="bg-black/20 p-3 rounded-md space-y-3">
                         <div className="flex justify-between items-center">
                              <label className="text-xs font-semibold text-gray-400">Convergence Threshold</label>
                              <span className="text-[10px] text-teal-400 font-mono">{node.data.refineConfig?.convergenceThreshold ?? 0.8}</span>
                         </div>
                         <input 
                            type="range" min="0.1" max="1.0" step="0.1"
                            value={node.data.refineConfig?.convergenceThreshold ?? 0.8} 
                            onChange={(e) => onUpdateData(node.id, { refineConfig: { ...node.data.refineConfig, convergenceThreshold: parseFloat(e.target.value) } as any })}
                            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
                         />
                         <p className="text-[10px] text-gray-500">Stops refinement if quality score meets this threshold.</p>
                    </div>

                    <div className="flex flex-col gap-2">
                         <label className="text-xs text-gray-500">Revision Strategy</label>
                         <div className="flex gap-2">
                             <button 
                                onClick={() => onUpdateData(node.id, { refineConfig: { ...node.data.refineConfig, strategy: 'DIFFERENCE_PROMPTING' } as any })}
                                className={`flex-1 py-2 text-[10px] font-bold rounded border transition-colors ${node.data.refineConfig?.strategy === 'DIFFERENCE_PROMPTING' ? 'bg-teal-900/40 border-teal-500 text-teal-300' : 'bg-gray-900 border-gray-700 text-gray-500'}`}
                             >
                                Difference-Based
                             </button>
                             <button 
                                onClick={() => onUpdateData(node.id, { refineConfig: { ...node.data.refineConfig, strategy: 'DIRECT_REVISION' } as any })}
                                className={`flex-1 py-2 text-[10px] font-bold rounded border transition-colors ${node.data.refineConfig?.strategy === 'DIRECT_REVISION' ? 'bg-teal-900/40 border-teal-500 text-teal-300' : 'bg-gray-900 border-gray-700 text-gray-500'}`}
                             >
                                Direct Rewrite
                             </button>
                         </div>
                    </div>
                </div>
            )}

            {node.type === NodeType.SCORECARD && (
                <div className="bg-green-950/20 border border-green-500/30 rounded-lg p-4 space-y-4">
                     <h4 className="text-xs font-bold text-green-400 uppercase flex items-center gap-2"><Target size={14}/> Scorecard KPIs</h4>
                     <p className="text-[10px] text-gray-500">Define the Key Performance Indicators to measure the success of the workflow at this step.</p>
                     
                     <div className="space-y-3">
                         {(node.data.objectives || []).map(kpi => (
                             <div key={kpi.id} className="bg-black/20 p-3 rounded-md border border-gray-800">
                                 <div className="flex justify-between items-start mb-2">
                                     <input 
                                        value={kpi.name}
                                        onChange={(e) => updateKPI(kpi.id, 'name', e.target.value)}
                                        className="bg-transparent text-xs font-bold text-gray-200 border-b border-gray-700 focus:border-green-500 outline-none w-2/3"
                                        placeholder="KPI Name"
                                     />
                                     <button onClick={() => removeKPI(kpi.id)} className="text-gray-600 hover:text-red-400"><Trash2 size={12}/></button>
                                 </div>
                                 <div className="flex gap-2">
                                     <input 
                                         value={kpi.targetValue}
                                         onChange={(e) => updateKPI(kpi.id, 'targetValue', e.target.value)}
                                         className="bg-gray-800 border border-gray-700 rounded p-1 text-[10px] text-gray-300 w-1/2"
                                         placeholder="Target (e.g. >80%)"
                                     />
                                     <select 
                                         value={kpi.source}
                                         onChange={(e) => updateKPI(kpi.id, 'source', e.target.value)}
                                         className="bg-gray-800 border border-gray-700 rounded p-1 text-[10px] text-gray-300 w-1/2"
                                     >
                                         <option value="AI_EVALUATION">AI Evaluation</option>
                                         <option value="MANUAL_INPUT">Manual</option>
                                     </select>
                                 </div>
                             </div>
                         ))}
                         <button onClick={addKPI} className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-green-400 text-xs font-bold rounded border border-gray-700 flex items-center justify-center gap-2 transition-colors">
                             <Plus size={12}/> Add KPI
                         </button>
                     </div>
                </div>
            )}
            
            {node.type === NodeType.DECISION && (
                <div className="bg-green-950/20 border border-green-500/30 rounded-lg p-4 space-y-4">
                    <h4 className="text-xs font-bold text-green-400 uppercase flex items-center gap-2"><GitMerge size={14}/> Decision Logic</h4>
                    <p className="text-sm text-gray-500">Decision configuration coming soon.</p>
                </div>
            )}

            {node.type === NodeType.HUMAN_REVIEW && (
                <div className="bg-pink-950/20 border border-pink-500/30 rounded-lg p-4 space-y-4">
                    <h4 className="text-xs font-bold text-pink-400 uppercase flex items-center gap-2"><UserCheck size={14}/> Human Review Config</h4>
                     <div>
                        <label className="text-xs text-gray-500 block mb-1">Instructions for Reviewer</label>
                        <textarea 
                            value={node.data.humanReviewConfig?.instructions || ''}
                            onChange={(e) => handleHumanReviewUpdate({ instructions: e.target.value })}
                            className="w-full bg-black/40 border border-pink-500/30 rounded p-2 text-xs text-pink-100" rows={3}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">Decision Options (comma-separated)</label>
                        <input 
                            value={node.data.humanReviewConfig?.options.join(', ') || ''}
                            onChange={(e) => handleHumanReviewUpdate({ options: e.target.value.split(',').map(s => s.trim()) })}
                            className="w-full bg-black/40 border border-pink-500/30 rounded p-2 text-xs text-pink-100"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};