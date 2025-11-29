


import React, { useState } from 'react';
import { NodeData, Trigger, TriggerType, ScheduleTriggerConfig, RunLog, AlertRule, Guardrail, TestCase, ObjectiveKPI } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Activity, X, Calendar, Bell, Shield, DollarSign, Beaker, Plus, Trash2, CheckCircle, AlertCircle, Clock, Lock, FileText, UserCheck, RefreshCw, AlertTriangle, Scale, Target } from 'lucide-react';

interface GoalSettingsModalProps {
  goalTitle: string;
  data: NodeData;
  onUpdate: (data: Partial<NodeData>) => void;
  onClose: () => void;
}

export const GoalSettingsModal: React.FC<GoalSettingsModalProps> = ({ goalTitle, data, onUpdate, onClose }) => {
  const [activeTab, setActiveTab] = useState<'triggers' | 'alerting' | 'guardrails' | 'budget' | 'testing' | 'scorecard'>('scorecard');

  const handleUpdate = (field: keyof NodeData, value: any) => {
    onUpdate({ [field]: value });
  };
  
  const TABS = [
    { id: 'scorecard', label: 'Objective Scorecard', icon: Target },
    { id: 'guardrails', label: 'Guardrail Engine', icon: Shield },
    { id: 'triggers', label: 'Triggers', icon: Calendar },
    { id: 'alerting', label: 'Alerting', icon: Bell },
    { id: 'budget', label: 'Budgeting', icon: DollarSign },
    { id: 'testing', label: 'Testing & QA', icon: Beaker },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-950 border border-gray-800 rounded-xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-gray-800 bg-gray-900/50">
          <div>
            <h2 className="text-lg font-bold text-gray-100 flex items-center gap-2">
              <Activity className="text-primary-500" size={20} />
              Goal Settings
            </h2>
            <p className="text-sm text-gray-500">{goalTitle}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-gray-800 px-5 bg-gray-900/30 overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'border-primary-500 text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {activeTab === 'scorecard' && <ScorecardTab kpis={data.objectives || []} onUpdate={(val) => handleUpdate('objectives', val)} />}
          {activeTab === 'triggers' && <TriggersTab triggers={data.triggers || []} onUpdate={(val) => handleUpdate('triggers', val)} />}
          {activeTab === 'alerting' && <AlertingTab rules={data.alertRules || []} onUpdate={(val) => handleUpdate('alertRules', val)} />}
          {activeTab === 'guardrails' && <GuardrailEngineTab rails={data.guardrails || []} onUpdate={(val) => handleUpdate('guardrails', val)} />}
          {activeTab === 'budget' && <BudgetTab budget={data.budget} onUpdate={(val) => handleUpdate('budget', val)} />}
          {activeTab === 'testing' && <TestingTab cases={data.testCases || []} onUpdate={(val) => handleUpdate('testCases', val)} />}
        </div>
      </div>
    </div>
  );
};

// Sub-components

const ScorecardTab: React.FC<{ kpis: ObjectiveKPI[], onUpdate: (val: ObjectiveKPI[]) => void }> = ({ kpis, onUpdate }) => {
    const addKPI = () => onUpdate([...kpis, { id: uuidv4(), name: 'New KPI', targetValue: '', metricType: 'NUMERIC', source: 'AI_EVALUATION' }]);
    const removeKPI = (id: string) => onUpdate(kpis.filter(k => k.id !== id));
    const updateKPI = (id: string, field: keyof ObjectiveKPI, value: any) => {
        onUpdate(kpis.map(k => k.id === id ? { ...k, [field]: value } : k));
    };

    return (
        <div className="space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
                <div className="flex items-center gap-3 mb-2">
                    <Target size={20} className="text-green-500" />
                    <div>
                        <h3 className="text-sm font-bold text-gray-200">Goal Success Quantification</h3>
                        <p className="text-xs text-gray-500">Define what success looks like. The AI will generate a post-mortem scorecard based on these KPIs.</p>
                    </div>
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase">Key Performance Indicators</h3>
                    <button onClick={addKPI} className="text-xs bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded flex items-center gap-1 font-bold">
                        <Plus size={12}/> Add KPI
                    </button>
                </div>

                <div className="space-y-3">
                    {kpis.map(kpi => (
                        <div key={kpi.id} className="bg-gray-900 p-4 rounded-lg border border-gray-800 flex flex-col md:flex-row gap-4 items-start md:items-center">
                            <div className="flex-1 space-y-2 w-full">
                                <div className="flex gap-2">
                                    <input 
                                        type="text" value={kpi.name} onChange={e => updateKPI(kpi.id, 'name', e.target.value)}
                                        className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm text-gray-200"
                                        placeholder="KPI Name (e.g. Conversion Rate)"
                                    />
                                    <select 
                                        value={kpi.metricType} onChange={e => updateKPI(kpi.id, 'metricType', e.target.value)}
                                        className="bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-xs text-gray-400"
                                    >
                                        <option value="NUMERIC">Numeric</option>
                                        <option value="PERCENTAGE">Percentage</option>
                                        <option value="BOOLEAN">Yes/No</option>
                                    </select>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <span className="text-xs text-gray-500 font-bold uppercase w-12">Target</span>
                                    <input 
                                        type="text" value={kpi.targetValue} onChange={e => updateKPI(kpi.id, 'targetValue', e.target.value)}
                                        className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-gray-200"
                                        placeholder="Target Value (e.g. > 20%)"
                                    />
                                    <select 
                                        value={kpi.source} onChange={e => updateKPI(kpi.id, 'source', e.target.value)}
                                        className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-gray-400"
                                    >
                                        <option value="AI_EVALUATION">AI Evaluation</option>
                                        <option value="MANUAL_INPUT">Manual Input</option>
                                    </select>
                                </div>
                            </div>
                            <button onClick={() => removeKPI(kpi.id)} className="text-gray-600 hover:text-red-400 p-2"><Trash2 size={16}/></button>
                        </div>
                    ))}
                    {kpis.length === 0 && <p className="text-center text-xs text-gray-600 py-4 italic">No KPIs defined yet.</p>}
                </div>
            </div>
        </div>
    );
};

const GuardrailEngineTab: React.FC<{ rails: Guardrail[], onUpdate: (val: Guardrail[]) => void }> = ({ rails, onUpdate }) => {
    
    const applyTemplate = (type: 'GDPR' | 'HIPAA' | 'SOC2' | 'BUDGET') => {
        let newRails: Guardrail[] = [];
        const base = { id: '', isEnabled: true };
        
        switch (type) {
            case 'GDPR':
                newRails = [
                    { ...base, id: uuidv4(), metric: 'SENSITIVE_DATA_SCORE', operator: '>', threshold: 0.1, fallbackAction: 'HUMAN_REVIEW', complianceLabel: 'GDPR' },
                    { ...base, id: uuidv4(), metric: 'HALLUCINATION_RATE', operator: '>', threshold: 10, fallbackAction: 'WARN', complianceLabel: 'GDPR' }
                ];
                break;
            case 'HIPAA':
                 newRails = [
                    { ...base, id: uuidv4(), metric: 'SENSITIVE_DATA_SCORE', operator: '>', threshold: 0.05, fallbackAction: 'ABORT', complianceLabel: 'HIPAA' },
                    { ...base, id: uuidv4(), metric: 'LATENCY_MS', operator: '>', threshold: 5000, fallbackAction: 'SWITCH_MODEL', complianceLabel: 'HIPAA' }
                ];
                break;
            case 'SOC2':
                 newRails = [
                    { ...base, id: uuidv4(), metric: 'COST_PER_EXECUTION', operator: '>', threshold: 2.0, fallbackAction: 'HUMAN_REVIEW', complianceLabel: 'SOC2' }
                ];
                break;
            case 'BUDGET':
                 newRails = [
                    { ...base, id: uuidv4(), metric: 'COST_ACCUMULATED', operator: '>', threshold: 10.0, fallbackAction: 'ABORT', complianceLabel: 'INTERNAL' },
                    { ...base, id: uuidv4(), metric: 'COST_PER_EXECUTION', operator: '>', threshold: 0.5, fallbackAction: 'SWITCH_MODEL', complianceLabel: 'INTERNAL' }
                ];
                break;
        }
        onUpdate([...rails, ...newRails]);
    };

    const addRail = () => onUpdate([...rails, { id: uuidv4(), metric: 'COST_PER_EXECUTION', operator: '>', threshold: 0.5, fallbackAction: 'WARN', isEnabled: true, complianceLabel: 'INTERNAL' }]);
    
    const removeRail = (id: string) => onUpdate(rails.filter(t => t.id !== id));
    
    const updateRail = (id: string, field: keyof Guardrail, value: any) => {
        onUpdate(rails.map(r => r.id === id ? { ...r, [field]: value } : r));
    };

    return (
        <div className="space-y-8">
            {/* Template Library */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
                <h3 className="text-sm font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                    <Scale size={16} className="text-primary-400"/> Compliance Templates
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button onClick={() => applyTemplate('GDPR')} className="p-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-left transition-colors group">
                        <div className="flex items-center gap-2 text-blue-400 font-bold mb-1"><Lock size={14}/> GDPR</div>
                        <p className="text-[10px] text-gray-500 group-hover:text-gray-400">Strict PII detection & Review</p>
                    </button>
                    <button onClick={() => applyTemplate('HIPAA')} className="p-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-left transition-colors group">
                        <div className="flex items-center gap-2 text-red-400 font-bold mb-1"><FileText size={14}/> HIPAA</div>
                        <p className="text-[10px] text-gray-500 group-hover:text-gray-400">PHI Zero-Tolerance Policy</p>
                    </button>
                    <button onClick={() => applyTemplate('SOC2')} className="p-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-left transition-colors group">
                        <div className="flex items-center gap-2 text-green-400 font-bold mb-1"><Shield size={14}/> SOC2</div>
                        <p className="text-[10px] text-gray-500 group-hover:text-gray-400">Audit & Ops Control</p>
                    </button>
                     <button onClick={() => applyTemplate('BUDGET')} className="p-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-left transition-colors group">
                        <div className="flex items-center gap-2 text-yellow-400 font-bold mb-1"><DollarSign size={14}/> Budget</div>
                        <p className="text-[10px] text-gray-500 group-hover:text-gray-400">Cost Capping & Model Switching</p>
                    </button>
                </div>
            </div>

            {/* Guardrail Rules */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-gray-400 uppercase flex items-center gap-2">
                        <Shield size={16} className="text-primary-400"/> Active Guardrails
                    </h3>
                    <button onClick={addRail} className="text-xs bg-primary-600 hover:bg-primary-500 text-white px-3 py-1.5 rounded flex items-center gap-1 font-bold">
                        <Plus size={12}/> Add Custom Rule
                    </button>
                </div>

                {rails.length === 0 ? (
                    <div className="text-center py-10 bg-gray-900/50 border border-dashed border-gray-800 rounded-lg">
                        <Shield size={32} className="mx-auto text-gray-700 mb-2"/>
                        <p className="text-sm text-gray-500">No guardrails active. Apply a template or add a custom rule.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {rails.map(rail => (
                            <div key={rail.id} className="bg-gray-900 p-4 rounded-lg border border-gray-800 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between group hover:border-gray-600 transition-colors">
                                <div className="flex flex-col gap-3 flex-1 w-full">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-1.5 rounded text-[10px] font-bold uppercase border 
                                            ${rail.complianceLabel === 'GDPR' ? 'bg-blue-900/20 text-blue-400 border-blue-900/50' : 
                                              rail.complianceLabel === 'HIPAA' ? 'bg-red-900/20 text-red-400 border-red-900/50' : 
                                              'bg-gray-800 text-gray-400 border-gray-700'}`}>
                                            {rail.complianceLabel || 'CUSTOM'}
                                        </div>
                                        <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                                            <input type="checkbox" checked={rail.isEnabled} onChange={(e) => updateRail(rail.id, 'isEnabled', e.target.checked)} className="rounded bg-gray-800 border-gray-600 text-primary-500 focus:ring-primary-500"/>
                                            Enabled
                                        </label>
                                    </div>

                                    <div className="flex gap-2 items-center flex-wrap">
                                        <span className="text-xs text-gray-500 font-bold uppercase">If</span>
                                        <select 
                                            value={rail.metric} onChange={(e) => updateRail(rail.id, 'metric', e.target.value)}
                                            className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-gray-200 outline-none"
                                        >
                                            <option value="COST_ACCUMULATED">Total Cost</option>
                                            <option value="COST_PER_EXECUTION">Cost Per Task</option>
                                            <option value="HALLUCINATION_RATE">Hallucination Rate</option>
                                            <option value="SENSITIVE_DATA_SCORE">PII Score</option>
                                            <option value="LATENCY_MS">Latency (ms)</option>
                                        </select>
                                        
                                        <select 
                                            value={rail.operator} onChange={(e) => updateRail(rail.id, 'operator', e.target.value)}
                                            className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-gray-200 outline-none w-16"
                                        >
                                            <option value=">">&gt;</option>
                                            <option value="<">&lt;</option>
                                            <option value=">=">&ge;</option>
                                            <option value="<=">&le;</option>
                                        </select>

                                        <input 
                                            type="number" 
                                            value={rail.threshold} onChange={(e) => updateRail(rail.id, 'threshold', parseFloat(e.target.value))}
                                            className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-gray-200 outline-none w-20"
                                        />
                                    </div>
                                    
                                    <div className="flex gap-2 items-center flex-wrap">
                                        <span className="text-xs text-gray-500 font-bold uppercase">Then</span>
                                        <select 
                                            value={rail.fallbackAction} onChange={(e) => updateRail(rail.id, 'fallbackAction', e.target.value)}
                                            className={`rounded px-2 py-1 text-xs outline-none font-bold border transition-colors
                                                ${rail.fallbackAction === 'ABORT' ? 'bg-red-900/20 text-red-400 border-red-900/50' : 
                                                  rail.fallbackAction === 'HUMAN_REVIEW' ? 'bg-yellow-900/20 text-yellow-400 border-yellow-900/50' :
                                                  rail.fallbackAction === 'SWITCH_MODEL' ? 'bg-blue-900/20 text-blue-400 border-blue-900/50' :
                                                  'bg-gray-800 text-gray-300 border-gray-700'}`}
                                        >
                                            <option value="WARN">Log Warning</option>
                                            <option value="HUMAN_REVIEW">Escalate to Human</option>
                                            <option value="SWITCH_MODEL">Switch Model</option>
                                            <option value="ABORT">Abort Workflow</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <button onClick={() => removeRail(rail.id)} className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors self-center">
                                    <Trash2 size={16}/>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};


const TriggersTab: React.FC<{ triggers: Trigger[], onUpdate: (val: Trigger[]) => void }> = ({ triggers, onUpdate }) => {
    const addTrigger = (type: TriggerType) => {
        let config: any;
        if (type === TriggerType.SCHEDULE) config = { type: 'DAILY', startDate: Date.now() };
        if (type === TriggerType.WEBHOOK) config = { url: `https://api.cognitoflow.ai/trigger/${uuidv4()}` };
        if (type === TriggerType.EMAIL) config = { sender: '', subjectKeywords: [] };
        onUpdate([...triggers, { id: uuidv4(), type, isEnabled: true, config }]);
    };
    const removeTrigger = (id: string) => onUpdate(triggers.filter(t => t.id !== id));
    
    return <div className="space-y-4">
        <button onClick={() => addTrigger(TriggerType.SCHEDULE)} className="text-xs bg-gray-800 p-2 rounded">Add Schedule Trigger</button>
        {triggers.map(trigger => <div key={trigger.id} className="bg-gray-900 p-3 rounded border border-gray-800">
            <div className="flex justify-between items-center">
                <span className="text-sm font-bold">{trigger.type}</span>
                <button onClick={() => removeTrigger(trigger.id)}><Trash2 size={14} /></button>
            </div>
        </div>)}
    </div>
};

const AlertingTab: React.FC<{ rules: AlertRule[], onUpdate: (val: AlertRule[]) => void }> = ({ rules, onUpdate }) => {
    const addRule = () => onUpdate([...rules, { id: uuidv4(), type: 'FAILURE_RATE', threshold: 50, timeWindowMinutes: 60, channels: [], isEnabled: true }]);
    return <div className="space-y-4">
        <button onClick={addRule} className="text-xs bg-gray-800 p-2 rounded">Add Alert Rule</button>
        {rules.map(rule => <div key={rule.id} className="bg-gray-900 p-3 rounded border border-gray-800">{rule.type}</div>)}
    </div>
};

const BudgetTab: React.FC<{ budget?: { cap: number, autoPause: boolean }, onUpdate: (val: any) => void }> = ({ budget, onUpdate }) => (
    <div className="space-y-4">
        <div>
            <label className="text-xs font-bold text-gray-500">Goal Budget Cap ($)</label>
            <input type="number" value={budget?.cap || ''} onChange={e => onUpdate({ ...budget, cap: parseFloat(e.target.value) })} className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm" />
        </div>
        <div className="flex items-center gap-2">
            <input type="checkbox" checked={budget?.autoPause || false} onChange={e => onUpdate({ ...budget, autoPause: e.target.checked })} />
            <label className="text-sm">Auto-pause when budget is reached</label>
        </div>
    </div>
);

const TestingTab: React.FC<{ cases: TestCase[], onUpdate: (val: TestCase[]) => void }> = ({ cases, onUpdate }) => {
    const addCase = () => onUpdate([...cases, { id: uuidv4(), name: 'New Test Case', startNodeId: '', inputData: {} }]);
    return <div className="space-y-4">
        <button onClick={addCase} className="text-xs bg-gray-800 p-2 rounded">Add Test Case</button>
        {cases.map(tc => <div key={tc.id} className="bg-gray-900 p-3 rounded border border-gray-800">{tc.name}</div>)}
    </div>
};