


import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ToolDefinition, ToolParameter } from '../types';
import { Search, Plus, Trash2, Box, Code, Save, Zap, Globe, Image as ImageIcon, Database, Check, PlayCircle, FileText, Loader2 } from 'lucide-react';
import { generateToolDocumentation } from '../services/geminiService';

interface ToolsMarketplaceModalProps {
  availableTools: ToolDefinition[];
  installedToolIds: string[];
  onInstall: (toolId: string) => void;
  onUninstall: (toolId: string) => void;
  onCreateCustomTool: (tool: ToolDefinition) => void;
  onClose: () => void;
}

export const ToolsMarketplaceModal: React.FC<ToolsMarketplaceModalProps> = ({
  availableTools,
  installedToolIds,
  onInstall,
  onUninstall,
  onCreateCustomTool,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'builder'>('catalog');
  const [searchTerm, setSearchTerm] = useState('');

  // Builder State
  const [builderName, setBuilderName] = useState('');
  const [builderDesc, setBuilderDesc] = useState('');
  const [builderCategory, setBuilderCategory] = useState<ToolDefinition['category']>('CUSTOM');
  const [builderParams, setBuilderParams] = useState<ToolParameter[]>([]);
  const [builderMockResponse, setBuilderMockResponse] = useState('{"status": "success", "data": "Sample Data"}');
  const [isGeneratingDocs, setIsGeneratingDocs] = useState(false);
  
  // Sandbox State
  const [sandboxInput, setSandboxInput] = useState('');
  const [sandboxOutput, setSandboxOutput] = useState('');

  const handleAddParam = () => {
    setBuilderParams([...builderParams, { name: '', type: 'STRING', description: '', required: true }]);
  };

  const updateParam = (idx: number, field: keyof ToolParameter, value: any) => {
    const newParams = [...builderParams];
    newParams[idx] = { ...newParams[idx], [field]: value };
    setBuilderParams(newParams);
  };

  const removeParam = (idx: number) => {
    setBuilderParams(builderParams.filter((_, i) => i !== idx));
  };

  const handleCreateTool = () => {
    if (!builderName || !builderDesc) return;
    const newTool: ToolDefinition = {
      id: `custom-${uuidv4()}`,
      name: builderName,
      description: builderDesc,
      category: builderCategory,
      isCustom: true,
      parameters: builderParams,
      mockResponse: builderMockResponse
    };
    onCreateCustomTool(newTool);
    setActiveTab('catalog');
    // Reset form
    setBuilderName('');
    setBuilderDesc('');
    setBuilderParams([]);
    setSandboxOutput('');
    setSandboxInput('');
  };

  const handleAutoDoc = async () => {
      if (!builderName) return;
      setIsGeneratingDocs(true);
      try {
          const doc = await generateToolDocumentation(builderName, builderParams);
          setBuilderDesc(doc);
      } catch (e) {
          console.error(e);
      } finally {
          setIsGeneratingDocs(false);
      }
  };

  const handleRunSandbox = () => {
      // Simple mock sandbox run
      setSandboxOutput(`Running tool '${builderName}'...\nInput: ${sandboxInput}\n\n[SIMULATION] Executing logic...\n\nOutput:\n${builderMockResponse}`);
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'SEARCH': return <Globe size={20} className="text-blue-400" />;
      case 'IMAGE': return <ImageIcon size={20} className="text-pink-400" />;
      case 'DATA': return <Database size={20} className="text-green-400" />;
      default: return <Zap size={20} className="text-purple-400" />;
    }
  };

  const filteredTools = availableTools.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-gray-950 border border-gray-800 rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Box size={24} className="text-primary-500" />
            <div>
              <h2 className="text-xl font-bold text-gray-100">Tool Fusion Engine</h2>
              <p className="text-sm text-gray-500">Chain, fork, and fuse external APIs into AI-native actions.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg text-gray-500 hover:text-white transition-colors">
            Close
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800 px-6">
          <button 
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'catalog' ? 'border-primary-500 text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
          >
            Tool Marketplace
          </button>
          <button 
            onClick={() => setActiveTab('builder')}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'builder' ? 'border-primary-500 text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
          >
            Custom Tool Builder
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-900/30 custom-scrollbar">
          
          {activeTab === 'catalog' && (
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tools..."
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-sm text-gray-200 focus:ring-1 focus:ring-primary-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTools.map(tool => {
                  const isInstalled = installedToolIds.includes(tool.id);
                  return (
                    <div key={tool.id} className="bg-gray-900 border border-gray-800 rounded-lg p-5 flex flex-col justify-between hover:border-gray-700 transition-colors">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                           <div className="flex items-center gap-3">
                             <div className="p-2 bg-gray-800 rounded-lg">
                               {getIcon(tool.category)}
                             </div>
                             <div>
                               <h3 className="text-base font-bold text-gray-200">{tool.name}</h3>
                               <span className="text-[10px] uppercase font-bold text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">{tool.category}</span>
                             </div>
                           </div>
                           {tool.isCustom && <span className="text-[10px] text-purple-400 border border-purple-500/30 px-1.5 py-0.5 rounded">Custom</span>}
                        </div>
                        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{tool.description}</p>
                      </div>
                      
                      <button 
                        onClick={() => isInstalled ? onUninstall(tool.id) : onInstall(tool.id)}
                        className={`w-full py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors
                          ${isInstalled 
                            ? 'bg-gray-800 text-gray-400 hover:bg-red-900/20 hover:text-red-400' 
                            : 'bg-primary-600 hover:bg-primary-500 text-white'
                          }
                        `}
                      >
                        {isInstalled ? 'Installed' : 'Install Tool'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'builder' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left Column: Configuration */}
                <div className="space-y-6">
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                        <h3 className="text-lg font-bold text-gray-200 mb-4 flex items-center gap-2">
                        <Code size={20} className="text-primary-500" /> Basic Information
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Tool Name</label>
                                <input 
                                value={builderName} onChange={e => setBuilderName(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-gray-200 outline-none" placeholder="e.g., Company Lookup"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                                    <button 
                                        onClick={handleAutoDoc} 
                                        disabled={isGeneratingDocs || !builderName}
                                        className="text-[10px] flex items-center gap-1 text-primary-400 hover:text-primary-300 disabled:opacity-50"
                                    >
                                        {isGeneratingDocs ? <Loader2 size={10} className="animate-spin"/> : <FileText size={10} />}
                                        Auto-Gen Docs
                                    </button>
                                </div>
                                <textarea 
                                value={builderDesc} onChange={e => setBuilderDesc(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-gray-200 outline-none" rows={4} placeholder="Describe logic, error handling, and expected inputs..."
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Category</label>
                                <select 
                                value={builderCategory} onChange={e => setBuilderCategory(e.target.value as any)}
                                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-gray-200 outline-none"
                                >
                                    <option value="CUSTOM">Custom</option>
                                    <option value="DATA">Data Analysis</option>
                                    <option value="UTILITY">Utility</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-200 flex items-center gap-2">
                            <Database size={20} className="text-green-500" /> Parameters
                            </h3>
                            <button onClick={handleAddParam} className="text-xs bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded text-primary-400 font-bold flex items-center gap-1">
                            <Plus size={12} /> Add Field
                            </button>
                        </div>
                        
                        {builderParams.length === 0 && <p className="text-sm text-gray-600 italic">No parameters defined.</p>}

                        <div className="space-y-3">
                        {builderParams.map((param, idx) => (
                            <div key={idx} className="flex gap-2 items-start bg-gray-950 p-3 rounded border border-gray-800">
                                <div className="flex-1 space-y-2">
                                    <div className="flex gap-2">
                                        <input 
                                        value={param.name} onChange={e => updateParam(idx, 'name', e.target.value)}
                                        placeholder="Param Name" className="flex-1 bg-gray-800 border border-gray-700 rounded p-1 text-xs text-gray-200"
                                        />
                                        <select 
                                        value={param.type} onChange={e => updateParam(idx, 'type', e.target.value)}
                                        className="bg-gray-800 border border-gray-700 rounded p-1 text-xs text-gray-200"
                                        >
                                            <option value="STRING">String</option>
                                            <option value="NUMBER">Number</option>
                                            <option value="BOOLEAN">Boolean</option>
                                        </select>
                                    </div>
                                    <input 
                                        value={param.description} onChange={e => updateParam(idx, 'description', e.target.value)}
                                        placeholder="Description (Used by AI)" className="w-full bg-gray-800 border border-gray-700 rounded p-1 text-xs text-gray-200"
                                    />
                                </div>
                                <button onClick={() => removeParam(idx)} className="text-gray-600 hover:text-red-400 mt-1"><Trash2 size={14} /></button>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Testing & Sandbox */}
                <div className="space-y-6">
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                        <h3 className="text-lg font-bold text-gray-200 mb-4 flex items-center gap-2">
                        <Zap size={20} className="text-yellow-500" /> Mock & Simulation
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">Define a JSON response to simulate this tool's execution.</p>
                        <textarea 
                            value={builderMockResponse} onChange={e => setBuilderMockResponse(e.target.value)}
                            className="w-full bg-gray-950 border border-gray-700 rounded p-3 text-xs text-green-400 font-mono mb-4" rows={6}
                        />
                    </div>

                    <div className="bg-gray-900 border border-purple-500/30 rounded-lg p-6">
                        <h3 className="text-lg font-bold text-purple-300 mb-4 flex items-center gap-2">
                            <Box size={20} /> Tool Sandbox
                        </h3>
                        <p className="text-xs text-gray-500 mb-3">Securely test your integration before deploying.</p>
                        
                        <div className="space-y-3">
                            <input 
                                value={sandboxInput} 
                                onChange={e => setSandboxInput(e.target.value)}
                                placeholder="Enter test arguments (JSON or text)..."
                                className="w-full bg-black/40 border border-purple-500/20 rounded p-2 text-xs text-gray-300 font-mono"
                            />
                            <button 
                                onClick={handleRunSandbox}
                                className="w-full py-2 bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/50 text-purple-200 rounded font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                            >
                                <PlayCircle size={14} /> Run Test in Sandbox
                            </button>
                            <div className="bg-black/60 p-3 rounded border border-gray-800 min-h-[100px] max-h-[200px] overflow-y-auto">
                                <pre className="text-[10px] text-green-400 font-mono whitespace-pre-wrap">
                                    {sandboxOutput || "// Output will appear here..."}
                                </pre>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleCreateTool}
                        disabled={!builderName || !builderDesc}
                        className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-900/20"
                    >
                        <Save size={18} /> Create & Install Custom Tool
                    </button>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};