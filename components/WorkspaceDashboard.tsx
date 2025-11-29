// FIX: Corrected syntax error in React import.
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Workspace, DashboardFlow, FlowStatus, Notification, SmartInsight, ActivityItem, Template, ResourceLink, User, MarketplaceWorkflow, FlowState, NodeType, Role } from '../types';
import { FlowCard } from './FlowCard'; 
import { 
    Plus, Users, Settings, Search, Play, Edit, BarChart2, Lightbulb, DollarSign,
    TrendingUp, TrendingDown, AlertTriangle, Sparkles, Command, Bell, X,
    Filter, ArrowUpDown, LayoutGrid, List,
    Book, Video, MessageCircle, GitMerge, FileText, CheckCircle,
    Copy, Download, Share2, Bot, LifeBuoy, LogOut, Briefcase, ChevronDown, Check, Trash2,
    FileJson, Brain, Database, Shield, ThumbsUp
} from 'lucide-react';
import { AIGeneratedWorkflowModal } from './AIGeneratedWorkflowModal';
import { WorkflowMarketplaceModal } from './WorkflowMarketplaceModal';
import { WorkspaceSettingsModal } from './WorkspaceSettingsModal';
import { v4 as uuidv4 } from 'uuid';

// --- MOCK DATA ---
const MOCK_USER: User = { id: 'user-1', name: 'John Doe', email: 'john@company.com', avatarInitials: 'JD' };
const MOCK_USERS_DB: Record<string, User> = {
    'user-1': MOCK_USER,
    'user-2': { id: 'user-2', name: 'Jane Smith', email: 'jane@company.com', avatarInitials: 'JS' },
    'user-3': { id: 'user-3', name: 'Peter Jones', email: 'peter@company.com', avatarInitials: 'PJ' },
};
const MOCK_MEMBERS = [
    { userId: 'user-1', role: 'OWNER' as Role },
    { userId: 'user-2', role: 'DESIGNER' as Role },
    { userId: 'user-3', role: 'REVIEWER' as Role },
];
const MOCK_WORKSPACE_OBJ: Workspace = {
  id: 'ws-1',
  name: 'Main Workspace',
  description: 'Financial Strategy Hub',
  flows: [], // The main component already has flows
  members: MOCK_MEMBERS,
  ownerId: 'user-1',
};
const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 'n1', type: 'ERROR', title: 'SEO Content Generator failed', flowName: 'SEO Content Generator', timestamp: Date.now() - 120000, details: 'API key invalid.' },
    { id: 'n2', type: 'WARNING', title: 'High latency detected', flowName: 'Competitor Analysis', timestamp: Date.now() - 900000, details: 'Web Scraper node took 8.3s.' },
    { id: 'n3', type: 'SUCCESS', title: 'Quarterly Report completed', flowName: 'Quarterly Financial Report', timestamp: Date.now() - 3600000, details: 'Cost: $0.023' },
];
const MOCK_INSIGHTS: SmartInsight[] = [
    { id: 'i1', category: 'PERFORMANCE', title: 'Top Performer', primaryMessage: '"Quarterly Financial Report" maintains 92% health.', secondaryDetails: 'Success rate improved 8% this month.', action: { label: 'View', type: 'VIEW' } },
    { id: 'i2', category: 'COST', title: 'Cost Optimization', primaryMessage: 'Switch "SEO Content Generator" to Flash model.', secondaryDetails: 'Est. savings: $15.20/month (−42%)', action: { label: 'Optimize', type: 'OPTIMIZE' } },
    { id: 'i3', category: 'USAGE', title: 'Underutilized Tool', primaryMessage: '"Web Search" is available but only used in 1 flow.', secondaryDetails: 'Consider adding to research workflows.', action: { label: 'Add to Flow', type: 'ADD_TO_FLOW' } },
    { id: 'i4', category: 'COMPLIANCE', title: 'Compliance Alert', primaryMessage: '"SEO Content Generator" lacks fact-check guardrail.', secondaryDetails: 'Recommended for AI-generated content.', action: { label: 'Add Guardrail', type: 'ADD_GUARD' } },
];
const MOCK_ACTIVITY: ActivityItem[] = [
    { id: 'a1', type: 'EXECUTION', title: 'Quarterly Financial Report', details: 'Workflow executed successfully', metrics: 'Runtime: 2.1s • Cost: $0.023', timestamp: Date.now() - 7200000, action: { label: 'View Details', link: '#' } },
    { id: 'a2', type: 'WARNING', title: 'High Latency Detected', details: 'Response time > 5s on Agent Node', metrics: 'Flow: Competitor Analysis Pipeline', timestamp: Date.now() - 900000, action: { label: 'Investigate', link: '#' } },
    { id: 'a3', type: 'ERROR', title: 'SEO Content Generator Failed', details: 'Error: API Authentication Failed', metrics: 'Node: SendGrid Integration', timestamp: Date.now() - 300000, action: { label: 'View Error Logs', link: '#' } },
    { id: 'a4', type: 'SYSTEM', title: 'Workspace Backup', details: 'Automated snapshot created', metrics: 'All workflows backed up successfully', timestamp: Date.now() - 14400000, action: { label: 'View Details', link: '#' } },
];
const MOCK_TEMPLATES: Template[] = [
    { id: 't1', icon: FileText, name: 'SaaS Competitor Audit', description: 'Auto-generates SWOT, pricing table, and feature gap analysis.'},
    { id: 't2', icon: Bot, name: 'SEO Blog Post Generator', description: 'Uses RAG + keyword trends + brand voice to create articles.'},
    { id: 't3', icon: MessageCircle, name: 'Auto-Triage Support', description: 'Routes tickets, drafts replies, and escalates complex cases.'},
    { id: 't4', icon: Database, name: 'Lead Enrichment Pipeline', description: 'Enriches email leads with LinkedIn data and company info.'},
    { id: 't5', icon: Shield, name: 'Contract Review', description: 'Analyzes legal contracts for risky clauses and compliance issues.'},
    { id: 't6', icon: ThumbsUp, name: 'Social Sentiment', description: 'Monitors brand mentions and analyzes sentiment.'}
];
const MOCK_RESOURCES: ResourceLink[] = [
    { icon: Book, label: 'Getting Started Guide', href: '#' },
    { icon: Video, label: 'Video Tutorials', href: '#' },
    { icon: MessageCircle, label: 'Community Forum', href: '#' },
    { icon: LifeBuoy, label: 'Email Support', href: '#' },
];
const MOCK_PRO_TIPS = [
    '"Auto-Triage Support" saves an average of 15 hrs/month for support teams.',
    'Add a Critique node to improve output quality by an average of 23%.',
    'Workflows with human review have 40% fewer errors on average.'
];
const MOCK_MARKETPLACE_WORKFLOWS: MarketplaceWorkflow[] = [
    {
        id: 'market-1',
        title: 'SaaS Competitor Audit',
        description: 'Auto-generates SWOT, pricing table, and feature gap analysis from competitor URLs.',
        category: 'Marketing',
        isVerified: true,
        rating: 4.9,
        authorName: 'CognitoFlow Team',
        downloads: 1250,
        flowState: {
            rootId: 'm1-goal',
            nodes: {
                'm1-goal': { id: 'm1-goal', type: NodeType.GOAL, data: { title: 'SaaS Competitor Audit', description: 'Enter competitor URLs to start.' }, childrenIds: ['m1-agent1'] },
                'm1-agent1': { id: 'm1-agent1', type: NodeType.AGENT, data: { title: 'Data Scraping Agent', description: 'Scrapes features, pricing, and reviews.' }, parentId: 'm1-goal', childrenIds: ['m1-tool1'] },
                'm1-tool1': { id: 'm1-tool1', type: NodeType.TOOL, data: { title: 'Web Scraper', description: 'Extracts data from URLs.' }, parentId: 'm1-agent1', childrenIds: ['m1-agent2'] },
                'm1-agent2': { id: 'm1-agent2', type: NodeType.AGENT, data: { title: 'SWOT Analysis Agent', description: 'Generates a SWOT analysis from scraped data.' }, parentId: 'm1-tool1', childrenIds: [] },
            },
        } as FlowState
    },
    {
        id: 'market-2',
        title: 'SEO Blog Post Generator',
        description: 'Uses RAG + keyword trends + brand voice to create high-quality, optimized articles.',
        category: 'Content',
        isVerified: true,
        rating: 4.8,
        authorName: 'CognitoFlow Team',
        downloads: 2800,
        flowState: {
            rootId: 'm2-goal',
            nodes: {
                'm2-goal': { id: 'm2-goal', type: NodeType.GOAL, data: { title: 'Generate SEO Blog Post', description: 'Input a topic and keywords.' }, childrenIds: ['m2-agent1'] },
                'm2-agent1': { id: 'm2-agent1', type: NodeType.AGENT, data: { title: 'Research Agent', description: 'Finds top-ranking articles and key topics.' }, parentId: 'm2-goal', childrenIds: ['m2-agent2'] },
                'm2-agent2': { id: 'm2-agent2', type: NodeType.AGENT, data: { title: 'Writing Agent', description: 'Drafts the article based on research and brand voice.' }, parentId: 'm2-agent1', childrenIds: ['m2-critique'] },
                'm2-critique': { id: 'm2-critique', type: NodeType.CRITIQUE, data: { title: 'SEO & Readability Check', description: 'Ensures content meets SEO best practices.' }, parentId: 'm2-agent2', childrenIds: [] },
            },
        } as FlowState
    },
    {
        id: 'market-3',
        title: 'Auto-Triage Support Tickets',
        description: 'Categorizes incoming support tickets, drafts replies for common issues, and escalates complex cases.',
        category: 'Support',
        isVerified: false,
        rating: 4.6,
        authorName: 'Community Contributor',
        downloads: 950,
        flowState: {
            rootId: 'm3-goal',
            nodes: {
                'm3-goal': { id: 'm3-goal', type: NodeType.GOAL, data: { title: 'Triage Support Ticket', description: 'Receives new ticket via webhook.' }, childrenIds: ['m3-agent1'] },
                'm3-agent1': { id: 'm3-agent1', type: NodeType.AGENT, data: { title: 'Triage Agent', description: 'Categorizes ticket (e.g., Bug, Feature Request, Billing).' }, parentId: 'm3-goal', childrenIds: ['m3-decision'] },
                'm3-decision': { id: 'm3-decision', type: NodeType.DECISION, data: { title: 'Is this a common issue?', description: 'Checks against a knowledge base of known issues.' }, parentId: 'm3-agent1', childrenIds: ['m3-agent2', 'm3-human'] },
                'm3-agent2': { id: 'm3-agent2', type: NodeType.AGENT, data: { title: 'Auto-Reply Agent', description: 'Drafts a reply using a template.' }, parentId: 'm3-decision', childrenIds: [] },
                'm3-human': { id: 'm3-human', type: NodeType.HUMAN_REVIEW, data: { title: 'Escalate to Support Team', description: 'Assigns the ticket to a human agent.' }, parentId: 'm3-decision', childrenIds: [] },
            },
        } as FlowState
    },
    {
        id: 'market-4',
        title: 'Lead Enrichment Pipeline',
        description: 'Enriches raw email leads with LinkedIn data, company size, and recent news to score potential deals.',
        category: 'Sales',
        isVerified: true,
        rating: 4.7,
        authorName: 'CognitoFlow Team',
        downloads: 3200,
        flowState: {
            rootId: 'm4-goal',
            nodes: {
                'm4-goal': { id: 'm4-goal', type: NodeType.GOAL, data: { title: 'Enrich Sales Leads', description: 'Input a CSV of email addresses.' }, childrenIds: ['m4-agent1'] },
                'm4-agent1': { id: 'm4-agent1', type: NodeType.AGENT, data: { title: 'Data Enrichment Agent', description: 'Queries external databases for lead info.' }, parentId: 'm4-goal', childrenIds: ['m4-tool1'] },
                'm4-tool1': { id: 'm4-tool1', type: NodeType.TOOL, data: { title: 'Clearbit API', description: 'Fetches profile data.' }, parentId: 'm4-agent1', childrenIds: ['m4-agent2'] },
                'm4-agent2': { id: 'm4-agent2', type: NodeType.AGENT, data: { title: 'Lead Scorer', description: 'Calculates lead quality score (0-100).' }, parentId: 'm4-tool1', childrenIds: [] },
            },
        } as FlowState
    },
    {
        id: 'market-5',
        title: 'Legal Contract Review',
        description: 'Analyzes NDAs and MSAs for risky clauses, missing terms, and compliance violations.',
        category: 'Legal',
        isVerified: true,
        rating: 4.9,
        authorName: 'LegalTech Solutions',
        downloads: 1800,
        flowState: {
            rootId: 'm5-goal',
            nodes: {
                'm5-goal': { id: 'm5-goal', type: NodeType.GOAL, data: { title: 'Review Legal Contract', description: 'Upload PDF of contract.' }, childrenIds: ['m5-agent1'] },
                'm5-agent1': { id: 'm5-agent1', type: NodeType.AGENT, data: { title: 'Clause Extractor', description: 'Identifies key clauses and terms.' }, parentId: 'm5-goal', childrenIds: ['m5-critique'] },
                'm5-critique': { id: 'm5-critique', type: NodeType.CRITIQUE, data: { title: 'Risk Assessment', description: 'Flags high-risk terms against playbook.' }, parentId: 'm5-agent1', childrenIds: ['m5-human'] },
                'm5-human': { id: 'm5-human', type: NodeType.HUMAN_REVIEW, data: { title: 'Lawyer Final Approval', description: 'Final sign-off required.' }, parentId: 'm5-critique', childrenIds: [] },
            },
        } as FlowState
    },
    {
        id: 'market-6',
        title: 'Social Sentiment Monitor',
        description: 'Tracks brand mentions on social media and categorizes sentiment to trigger support alerts.',
        category: 'Marketing',
        isVerified: false,
        rating: 4.5,
        authorName: 'GrowthHacker_99',
        downloads: 850,
        flowState: {
            rootId: 'm6-goal',
            nodes: {
                'm6-goal': { id: 'm6-goal', type: NodeType.GOAL, data: { title: 'Monitor Brand Sentiment', description: 'Continuous stream of mentions.' }, childrenIds: ['m6-agent1'] },
                'm6-agent1': { id: 'm6-agent1', type: NodeType.AGENT, data: { title: 'Social Listener', description: 'Filters noise from mentions.' }, parentId: 'm6-goal', childrenIds: ['m6-agent2'] },
                'm6-agent2': { id: 'm6-agent2', type: NodeType.AGENT, data: { title: 'Sentiment Analyzer', description: 'Classifies as Positive, Neutral, Negative.' }, parentId: 'm6-agent1', childrenIds: ['m6-decision'] },
                'm6-decision': { id: 'm6-decision', type: NodeType.DECISION, data: { title: 'Is Negative?', description: 'Route negative sentiment to support.' }, parentId: 'm6-agent2', childrenIds: [] },
            },
        } as FlowState
    }
];
const MOCK_WORKSPACES = [
    { id: 'ws-1', name: 'Main Workspace', icon: '💼' },
    { id: 'ws-2', name: 'R&D Sandbox', icon: '🔬' },
    { id: 'ws-3', name: 'Marketing Team', icon: '📈' },
];

// --- SUB-COMPONENTS ---

const UserSettingsModal = ({ user, onClose }: { user: User, onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-gray-950 border border-gray-800 rounded-xl shadow-2xl w-full max-w-lg animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-xl font-bold text-gray-100">User Settings</h2>
            <p className="text-sm text-gray-500">Manage your profile and preferences.</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={24} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
              <label className="text-xs font-bold text-gray-500">NAME</label>
              <p className="text-gray-200">{user.name}</p>
          </div>
          <div>
              <label className="text-xs font-bold text-gray-500">EMAIL</label>
              <p className="text-gray-200">{user.email}</p>
          </div>
          <p className="pt-4 text-gray-500 text-sm border-t border-gray-800">More settings coming soon...</p>
        </div>
      </div>
    </div>
);

const BillingModal = ({ onClose }: { onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-gray-950 border border-gray-800 rounded-xl shadow-2xl w-full max-w-lg animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
           <div>
            <h2 className="text-xl font-bold text-gray-100">Usage & Billing</h2>
            <p className="text-sm text-gray-500">Manage your subscription and view usage details.</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={24} /></button>
        </div>
        <div className="p-6">
          <p className="text-gray-500">Billing and usage details are not yet available.</p>
        </div>
      </div>
    </div>
);

const Header = ({ user, onCommandPaletteOpen, onNotificationsOpen, onOpenWorkspaceSettings, onOpenUserSettings, onOpenBilling, onSignOut }: { user: User, onCommandPaletteOpen: () => void, onNotificationsOpen: () => void, onOpenWorkspaceSettings: () => void, onOpenUserSettings: () => void, onOpenBilling: () => void, onSignOut: () => void }) => {
    const [isProfileOpen, setProfileOpen] = useState(false);
    const [isWorkspaceOpen, setWorkspaceOpen] = useState(false);
    
    const handleSignOut = () => {
        setProfileOpen(false);
        onSignOut();
    };

    return (
        <header className="fixed top-0 left-0 right-0 h-[72px] bg-bg-primary/80 backdrop-blur-lg border-b border-border-primary z-50 flex items-center px-6 justify-between">
            <div className="flex items-center gap-4">
                <Sparkles className="text-accent-secondary" size={28} />
                <h1 className="text-xl font-bold text-text-primary">CognitoFlow</h1>
                <div className="w-px h-6 bg-border-primary" />
                <div className="flex items-center gap-1 text-sm">
                    <div className="relative">
                        <button onClick={() => setWorkspaceOpen(p => !p)} className="flex items-center gap-1 text-text-tertiary hover:text-text-primary p-1 rounded-md">
                            Workspaces <ChevronDown size={14} className={`transition-transform ${isWorkspaceOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isWorkspaceOpen && (
                            <div className="absolute top-full left-0 mt-2 w-64 bg-bg-card border border-border-primary rounded-lg shadow-2xl animate-fade-in z-50">
                               <div className="p-2">
                                    {MOCK_WORKSPACES.map(ws => (
                                        <a href="#" key={ws.id} className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-bg-hover ${ws.id === 'ws-1' ? 'bg-bg-hover' : ''}`}>
                                            <span className="text-lg">{ws.icon}</span>
                                            <span className="flex-1 font-medium">{ws.name}</span>
                                            {ws.id === 'ws-1' && <Check size={16} className="text-accent-primary" />}
                                        </a>
                                    ))}
                               </div>
                               <div className="p-2 border-t border-border-primary">
                                   <button onClick={() => { onOpenWorkspaceSettings(); setWorkspaceOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-bg-hover"><Settings size={16} /> Workspace Settings</button>
                                   <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-bg-hover"><Plus size={16} /> Create New Workspace</button>
                               </div>
                            </div>
                        )}
                    </div>
                    <span className="text-text-tertiary">/</span>
                    <span className="text-text-primary font-medium">Main Workspace</span>
                </div>
            </div>
            <div className="flex-1 flex justify-center">
                 <button onClick={onCommandPaletteOpen} className="w-full max-w-md h-10 flex items-center gap-2 px-3 bg-bg-input border border-border-primary rounded-lg text-text-tertiary hover:text-text-secondary hover:border-border-hover">
                    <Search size={16} /> Search flows, templates...
                    <span className="ml-auto text-xs font-mono bg-bg-card px-1.5 py-0.5 rounded border border-border-primary">⌘K</span>
                </button>
            </div>
            <div className="flex items-center gap-4">
                <button onClick={onOpenWorkspaceSettings} className="h-9 px-3 flex items-center gap-2 text-sm bg-bg-card border border-border-primary rounded-lg text-text-secondary hover:bg-bg-hover">
                    <Users size={16} /> Invite Members
                </button>
                <button onClick={onNotificationsOpen} className="relative h-9 w-9 flex items-center justify-center bg-bg-card border border-border-primary rounded-lg text-text-secondary hover:bg-bg-hover">
                    <Bell size={16} />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-status-error text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-bg-primary">{MOCK_NOTIFICATIONS.length}</div>
                </button>
                <div className="w-px h-6 bg-border-primary" />
                <div className="relative">
                    <button onClick={() => setProfileOpen(p => !p)} className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-gradient-to-br from-accent-secondary to-accent-primary rounded-full flex items-center justify-center font-bold text-white">{user.avatarInitials}</div>
                    </button>
                    {isProfileOpen && (
                        <div className="absolute top-full right-0 mt-2 w-64 bg-bg-card border border-border-primary rounded-lg shadow-2xl animate-fade-in z-50">
                           <div className="p-4 border-b border-border-primary">
                                <p className="font-semibold text-text-primary">{user.name}</p>
                                <p className="text-sm text-text-tertiary">{user.email}</p>
                           </div>
                           <div className="p-2 text-sm">
                               <button onClick={() => { onOpenUserSettings(); setProfileOpen(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md hover:bg-bg-hover"><Briefcase size={16} /> Profile</button>
                               <button onClick={() => { onOpenUserSettings(); setProfileOpen(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md hover:bg-bg-hover"><Settings size={16} /> Settings</button>
                               <button onClick={() => { onOpenBilling(); setProfileOpen(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md hover:bg-bg-hover"><DollarSign size={16} /> Usage & Billing</button>
                           </div>
                           <div className="p-2 border-t border-border-primary">
                               <button onClick={handleSignOut} className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md hover:bg-bg-hover text-status-error"><LogOut size={16} /> Sign Out</button>
                           </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

const HeroSection = ({ 
    workspaceName, 
    workspaceDesc, 
    onNewFlow, 
    onOpenSettings,
    searchTerm,
    onSearchChange,
    sortOption,
    onSortChange,
    filterOption,
    onFilterChange,
    viewMode,
    onViewModeChange,
    isSortDropdownOpen,
    onToggleSortDropdown,
    isFilterDropdownOpen,
    onToggleFilterDropdown,
    sortOptions,
    filterOptions,
    sortDropdownRef,
    filterDropdownRef,
}: { 
    workspaceName: string, 
    workspaceDesc?: string, 
    onNewFlow: () => void, 
    onOpenSettings: () => void,
    searchTerm: string,
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    sortOption: { value: string, label: string },
    onSortChange: (option: { value: string, label: string }) => void,
    filterOption: string,
    onFilterChange: (option: string) => void,
    viewMode: 'grid' | 'list',
    onViewModeChange: (mode: 'grid' | 'list') => void,
    isSortDropdownOpen: boolean,
    onToggleSortDropdown: () => void,
    isFilterDropdownOpen: boolean,
    onToggleFilterDropdown: () => void,
    sortOptions: { value: string, label: string }[],
    filterOptions: string[],
    sortDropdownRef: React.RefObject<HTMLDivElement>;
    filterDropdownRef: React.RefObject<HTMLDivElement>;
 }) => {
    return (
        <section className="pt-8">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold text-text-primary">{workspaceName}</h2>
                    <p className="text-text-tertiary mt-1">{workspaceDesc}</p>
                </div>
                <button onClick={onOpenSettings} className="h-10 px-4 flex items-center gap-2 text-sm font-medium bg-bg-card border border-border-primary rounded-lg text-text-secondary hover:bg-bg-hover">
                    <Settings size={16} /> Workspace Settings
                </button>
            </div>
            <div className="mt-6 flex items-center gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                    <input 
                        type="text" 
                        placeholder="Search flows..." 
                        value={searchTerm}
                        onChange={onSearchChange}
                        className="w-full h-10 bg-bg-input border border-border-primary rounded-lg pl-9 pr-3 text-sm" 
                    />
                </div>
                <div ref={filterDropdownRef} className="relative">
                    <button onClick={onToggleFilterDropdown} className="h-10 px-4 flex items-center gap-2 text-sm font-medium bg-bg-card border border-border-primary rounded-lg text-text-secondary hover:bg-bg-hover">
                        <Filter size={14} /> Filter: {filterOption} ▾
                    </button>
                    {isFilterDropdownOpen && (
                        <div className="absolute top-full right-0 mt-2 w-40 bg-bg-card border border-border-primary rounded-lg shadow-2xl z-10 animate-fade-in">
                            <div className="p-1">
                                {filterOptions.map(option => (
                                    <button key={option} onClick={() => onFilterChange(option)} className="w-full text-left px-3 py-1.5 text-sm rounded-md hover:bg-bg-hover">{option}</button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                 <div ref={sortDropdownRef} className="relative">
                    <button onClick={onToggleSortDropdown} className="h-10 px-4 flex items-center gap-2 text-sm font-medium bg-bg-card border border-border-primary rounded-lg text-text-secondary hover:bg-bg-hover">
                        <ArrowUpDown size={14} /> Sort: {sortOption.label} ▾
                    </button>
                     {isSortDropdownOpen && (
                        <div className="absolute top-full right-0 mt-2 w-40 bg-bg-card border border-border-primary rounded-lg shadow-2xl z-10 animate-fade-in">
                            <div className="p-1">
                                {sortOptions.map(option => (
                                    <button key={option.value} onClick={() => onSortChange(option)} className="w-full text-left px-3 py-1.5 text-sm rounded-md hover:bg-bg-hover">{option.label}</button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex items-center bg-bg-card border border-border-primary rounded-lg p-0.5">
                    <button onClick={() => onViewModeChange('grid')} className={`h-8 w-8 flex items-center justify-center rounded-md ${viewMode === 'grid' ? 'bg-bg-hover text-text-primary' : 'text-text-tertiary'}`}><LayoutGrid size={16} /></button>
                    <button onClick={() => onViewModeChange('list')} className={`h-8 w-8 flex items-center justify-center rounded-md ${viewMode === 'list' ? 'bg-bg-hover text-text-primary' : 'text-text-tertiary'}`}><List size={16} /></button>
                </div>
                <button onClick={onNewFlow} className="h-10 px-5 flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-accent-secondary to-accent-primary text-white rounded-lg hover:brightness-110 transition-all shadow-lg shadow-glow-primary">
                    <Plus size={16} /> New Flow
                </button>
            </div>
        </section>
    );
};

const MetricCard = ({ label, value, trend, trendColor }: { label: string, value: string, trend: string, trendColor: string }) => (
    <div className="p-5 text-center transition-transform duration-200 hover:scale-105 hover:bg-white/5 cursor-pointer rounded-lg">
        <div className="text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-2">{label}</div>
        <div className="text-3xl font-bold text-text-primary">{value}</div>
        <div className={`flex items-center justify-center gap-1 text-sm font-medium mt-1 ${trendColor}`}>
            {trend.startsWith('↑') ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {trend}
        </div>
    </div>
);

const QuickMetricsBar = () => (
    <section className="mt-8 bg-bg-secondary border-y border-border-primary grid grid-cols-5 divide-x divide-border-primary">
        <MetricCard label="Active Flows" value="2" trend="↑ +1 week" trendColor="text-status-success" />
        <MetricCard label="Runs Today" value="23" trend="↑ +12 (52%)" trendColor="text-status-success" />
        <MetricCard label="Success Rate" value="94.3%" trend="↓ -2.1%" trendColor="text-status-error" />
        <MetricCard label="Cost Today" value="$4.87" trend="↓ -$1.20" trendColor="text-status-success" />
        <MetricCard label="Time Saved" value="~2.5 hrs" trend="↑ +0.8 hrs" trendColor="text-status-success" />
    </section>
);

const EmptyState = ({ onNewFlow, onOpenMarketplace }: { onNewFlow: () => void, onOpenMarketplace: () => void }) => (
    <div className="text-center py-16 bg-bg-secondary/30 border border-border-primary rounded-xl flex flex-col items-center">
        <div className="w-48 h-32 mb-6 flex items-center justify-center text-accent-primary">
            <Sparkles size={64} />
        </div>
        <h3 className="text-2xl font-bold text-text-primary">Welcome to Your Workspace! 👋</h3>
        <p className="text-lg text-text-tertiary mt-2 mb-8">Build your first intelligent AI workflow to get started.</p>
        <div className="max-w-md w-full space-y-4">
             <button onClick={onNewFlow} className="w-full text-left p-6 flex items-center gap-6 bg-bg-card border border-border-primary rounded-lg hover:border-accent-primary/50 transition-colors">
                <Sparkles size={24} className="text-accent-primary"/>
                <div>
                    <h4 className="font-bold text-text-primary">Start from Scratch</h4>
                    <p className="text-sm text-text-tertiary">Design a custom workflow from the ground up.</p>
                </div>
            </button>
             <button onClick={onOpenMarketplace} className="w-full text-left p-6 flex items-center gap-6 bg-bg-card border border-border-primary rounded-lg hover:border-accent-primary/50 transition-colors">
                <FileText size={24} className="text-accent-primary"/>
                <div>
                    <h4 className="font-bold text-text-primary">Browse Templates</h4>
                    <p className="text-sm text-text-tertiary">Use pre-built workflows for common tasks.</p>
                </div>
            </button>
        </div>
    </div>
);

const MainContent = ({ flows, onNewFlow, onOpenFlow, insights, activity, onOpenMarketplace, viewMode, expandedFlowId, setExpandedFlowId, flowCardRefs }: { flows: DashboardFlow[], onNewFlow: () => void, onOpenFlow: (flowId: string) => void, insights: SmartInsight[], activity: ActivityItem[], onOpenMarketplace: () => void, viewMode: 'grid' | 'list', expandedFlowId: string | null, setExpandedFlowId: React.Dispatch<React.SetStateAction<string | null>>, flowCardRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>> }) => {
    
    const gridClass = viewMode === 'grid'
        ? "grid grid-cols-1 lg:grid-cols-2 gap-6"
        : "grid grid-cols-1 gap-4";

    return (
        <div className="mt-8 space-y-10">
            <div>
                <h3 className="text-lg font-bold text-text-secondary uppercase tracking-wider mb-4">Your Flows</h3>
                {flows.length === 0 ? <EmptyState onNewFlow={onNewFlow} onOpenMarketplace={onOpenMarketplace} /> : (
                    <div className={gridClass}>
                        {flows.map((flow: DashboardFlow) => (
                            <div key={flow.id} ref={el => { if (flowCardRefs) flowCardRefs.current[flow.id] = el }}>
                                <FlowCard 
                                    flow={flow} 
                                    onOpenFlow={onOpenFlow} 
                                    viewMode={viewMode} 
                                    isExpanded={flow.id === expandedFlowId}
                                    onExpandToggle={() => setExpandedFlowId(prev => prev === flow.id ? null : flow.id)}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <SmartInsightsSection insights={insights} />
            <RecentActivitySection activity={activity} />
        </div>
    );
};

const SmartInsightsSection = ({ insights }: { insights: SmartInsight[] }) => {
    const categoryStyles: { [key in SmartInsight['category']]: { icon: React.ElementType, color: string, border: string } } = {
        PERFORMANCE: { icon: TrendingUp, color: 'text-status-success', border: 'border-status-success' },
        COST: { icon: DollarSign, color: 'text-status-warning', border: 'border-status-warning' },
        USAGE: { icon: GitMerge, color: 'text-status-info', border: 'border-status-info' },
        COMPLIANCE: { icon: AlertTriangle, color: 'text-status-error', border: 'border-status-error' },
        SUGGESTION: { icon: Lightbulb, color: 'text-accent-primary', border: 'border-accent-primary' },
    };
    return (
        <div>
            <h3 className="text-lg font-bold text-text-secondary uppercase tracking-wider mb-4 flex items-center gap-3"><Lightbulb className="text-status-warning"/> Smart Insights</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {insights.map(insight => {
                    const style = categoryStyles[insight.category];
                    const Icon = style.icon;
                    return (
                        <div key={insight.id} className={`bg-bg-secondary p-5 rounded-lg border border-border-primary border-l-4 ${style.border}`}>
                            <div className="flex justify-between items-start">
                                <div className={`flex items-center gap-2 text-xs font-bold uppercase ${style.color}`}><Icon size={14}/> {insight.title}</div>
                                <button onClick={() => (window as any).handleInsightAction(insight)} className="text-xs font-medium bg-bg-card px-3 py-1 rounded-md text-text-secondary hover:bg-bg-hover">{insight.action.label}</button>
                            </div>
                            <p className="text-text-primary font-medium my-2">{insight.primaryMessage}</p>
                            <p className="text-sm text-text-tertiary">{insight.secondaryDetails}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const RecentActivitySection = ({ activity }: { activity: ActivityItem[] }) => {
     const activityStyles: { [key in ActivityItem['type']]: { icon: React.ElementType, color: string } } = {
        EXECUTION: { icon: CheckCircle, color: 'text-status-success' },
        WARNING: { icon: AlertTriangle, color: 'text-status-warning' },
        ERROR: { icon: X, color: 'text-status-error' },
        SYSTEM: { icon: Settings, color: 'text-status-info' },
    };
    return (
         <div>
            <h3 className="text-lg font-bold text-text-secondary uppercase tracking-wider mb-4 flex items-center gap-3"><BarChart2 /> Recent Activity</h3>
            <div className="bg-bg-secondary p-4 rounded-lg border border-border-primary">
                {activity.map(item => {
                    const style = activityStyles[item.type];
                    const Icon = style.icon;
                    return (
                        <div key={item.id} className="flex items-start gap-4 p-3 border-b border-border-primary last:border-b-0">
                            <Icon size={18} className={`${style.color} mt-1`} />
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <p className="font-medium text-text-primary">{item.title}</p>
                                    <p className="text-xs text-text-tertiary">{new Date(item.timestamp).toLocaleTimeString()}</p>
                                </div>
                                <p className="text-sm text-text-tertiary">{item.details}</p>
                                <p className="text-xs text-text-quaternary font-mono mt-1">{item.metrics}</p>
                            </div>
                             <a href={item.action.link} className="text-xs font-medium text-accent-primary hover:underline self-center">{item.action.label}</a>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const Sidebar = ({ onOpenMarketplace }: { onOpenMarketplace: () => void }) => {
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % MOCK_PRO_TIPS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <aside className="w-[360px] flex-shrink-0 sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto px-6 space-y-8 py-8 custom-scrollbar">
        <div>
          <h3 className="text-sm font-semibold text-text-tertiary uppercase mb-4">⚡ Quick Start</h3>
          <div className="space-y-3">
              {MOCK_TEMPLATES.map(template => (
                  <div key={template.id} className="bg-bg-card border border-border-primary p-4 rounded-lg">
                      <template.icon size={20} className="text-accent-primary mb-2" />
                      <h4 className="font-bold text-text-primary">{template.name}</h4>
                      <p className="text-xs text-text-tertiary mt-1">{template.description}</p>
                      <button onClick={onOpenMarketplace} className="mt-3 w-full text-center text-sm font-medium bg-accent-primary/10 border border-accent-primary/20 text-accent-primary h-9 rounded-lg hover:bg-accent-primary/20">Use Template →</button>
                  </div>
              ))}
          </div>
        </div>
        <div>
            <h3 className="text-sm font-semibold text-text-tertiary uppercase mb-4">📚 Resources</h3>
            <div className="flex flex-col text-text-secondary text-sm">
                {MOCK_RESOURCES.map(res => (
                    <a href={res.href} key={res.label} className="flex items-center gap-3 py-2 border-b border-border-primary hover:text-text-primary last:border-b-0"><res.icon size={16}/> {res.label}</a>
                ))}
            </div>
        </div>
         <div className="bg-gradient-to-br from-status-warning/10 to-accent-primary/10 border border-status-warning/20 p-4 rounded-lg">
            <h4 className="font-bold text-sm text-status-warning mb-2">💡 PRO TIP</h4>
            <p className="text-sm text-text-secondary leading-relaxed transition-opacity duration-500">{MOCK_PRO_TIPS[currentTip]}</p>
        </div>
    </aside>
  );
};

const CommandPalette = ({ onClose }: { onClose: () => void }) => {
    return (
        <div className="fixed inset-0 bg-bg-secondary/70 backdrop-blur-sm z-50 flex justify-center pt-20 animate-fade-in" onClick={onClose}>
            <div className="w-full max-w-2xl bg-bg-card border border-border-primary rounded-xl shadow-2xl overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-border-primary">
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                        <input type="text" placeholder="Search or type a command..." autoFocus className="w-full bg-bg-input border border-border-primary rounded-lg pl-10 pr-4 py-2.5 text-base" />
                    </div>
                </div>
                <div className="p-2 max-h-[60vh] overflow-y-auto text-sm">
                    <div className="p-2">
                        <h4 className="text-xs font-semibold text-text-tertiary uppercase px-2 mb-1">Recent</h4>
                        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-bg-hover"><FileText size={16}/> Quarterly Financial Report</a>
                        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-bg-hover"><FileText size={16}/> Competitor Analysis Pipeline</a>
                    </div>
                     <div className="p-2">
                        <h4 className="text-xs font-semibold text-text-tertiary uppercase px-2 mb-1">Commands</h4>
                        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-bg-hover"><Plus size={16}/> Create New Flow</a>
                        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-bg-hover"><BarChart2 size={16}/> View Analytics</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

const NotificationsPanel = ({ notifications, onClose }: { notifications: Notification[], onClose: () => void }) => {
    const getIcon = (type: Notification['type']) => {
        if (type === 'SUCCESS') return <CheckCircle className="text-status-success" size={18} />;
        if (type === 'WARNING') return <AlertTriangle className="text-status-warning" size={18} />;
        if (type === 'ERROR') return <X className="text-status-error" size={18} />;
        return <Bell size={18}/>
    };
    return (
         <div className="fixed top-0 right-0 h-full w-96 bg-bg-card border-l border-border-primary z-[60] shadow-2xl animate-slide-in-from-right">
             <div className="flex justify-between items-center p-4 border-b border-border-primary">
                 <h3 className="font-bold text-text-primary">Notifications</h3>
                 <button onClick={onClose} className="text-text-tertiary hover:text-text-primary"><X size={20}/></button>
             </div>
             <div className="p-4 space-y-3 overflow-y-auto h-[calc(100%-60px)]">
                 {notifications.map(n => (
                     <div key={n.id} className="flex gap-4 bg-bg-secondary p-3 rounded-lg">
                         <div className="mt-1">{getIcon(n.type)}</div>
                         <div>
                             <p className="font-medium text-text-secondary">{n.title}</p>
                             <p className="text-sm text-text-tertiary">{n.details}</p>
                             <p className="text-xs text-text-quaternary mt-1">{new Date(n.timestamp).toLocaleString()}</p>
                         </div>
                     </div>
                 ))}
             </div>
         </div>
    );
};

const NewFlowModal = ({ onClose, onCreateNewFlow, onOpenAIGenerateModal, onOpenMarketplace, onImportJSON }: { onClose: () => void, onCreateNewFlow: () => void, onOpenAIGenerateModal: () => void, onOpenMarketplace: () => void, onImportJSON: () => void }) => (
    <div className="fixed inset-0 bg-bg-secondary/70 backdrop-blur-sm z-50 flex justify-center items-center animate-fade-in" onClick={onClose}>
        <div className="w-full max-w-xl bg-bg-card border border-border-primary rounded-xl shadow-2xl p-8 animate-scale-in" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-center text-text-primary mb-2">How would you like to start?</h2>
            <p className="text-center text-text-tertiary mb-8">Choose an option to create your new workflow.</p>
            <div className="space-y-4">
                <button onClick={onCreateNewFlow} className="w-full text-left p-6 flex items-center gap-6 bg-bg-secondary border border-border-primary rounded-lg hover:border-accent-primary/50 transition-colors">
                    <Sparkles size={24} className="text-accent-primary"/>
                    <div>
                        <h4 className="font-bold text-text-primary">Start from Scratch</h4>
                        <p className="text-sm text-text-tertiary">Design a custom workflow from the ground up.</p>
                    </div>
                </button>
                 <button onClick={onOpenAIGenerateModal} className="w-full text-left p-6 flex items-center gap-6 bg-bg-secondary border border-border-primary rounded-lg hover:border-accent-primary/50 transition-colors">
                    <Brain size={24} className="text-accent-primary"/>
                    <div>
                        <h4 className="font-bold text-text-primary">AI-Generated Workflow</h4>
                        <p className="text-sm text-text-tertiary">Describe your goal and let AI build it for you.</p>
                    </div>
                </button>
                 <button onClick={onOpenMarketplace} className="w-full text-left p-6 flex items-center gap-6 bg-bg-secondary border border-border-primary rounded-lg hover:border-accent-primary/50 transition-colors">
                    <FileText size={24} className="text-accent-primary"/>
                    <div>
                        <h4 className="font-bold text-text-primary">Use Template</h4>
                        <p className="text-sm text-text-tertiary">Browse pre-built workflows for common tasks.</p>
                    </div>
                </button>
                 <button onClick={onImportJSON} className="w-full text-left p-6 flex items-center gap-6 bg-bg-secondary border border-border-primary rounded-lg hover:border-accent-primary/50 transition-colors">
                    <FileJson size={24} className="text-accent-primary"/>
                    <div>
                        <h4 className="font-bold text-text-primary">Import JSON</h4>
                        <p className="text-sm text-text-tertiary">Upload an existing workflow configuration.</p>
                    </div>
                </button>
            </div>
            <div className="text-center mt-6">
                <button onClick={onClose} className="text-sm text-text-tertiary hover:text-text-primary">Cancel</button>
            </div>
        </div>
    </div>
);


// --- MAIN DASHBOARD COMPONENT ---
interface WorkspaceDashboardProps {
    flows: DashboardFlow[];
    onOpenFlow: (flowId: string) => void;
    onCreateNewFlow: () => void;
    onCreateAIGeneratedFlow: (goal: string) => Promise<void>;
    onCreateFlowFromTemplate: (flowState: FlowState) => void;
    onCreateFlowFromJSON: (jsonString: string) => void;
}

export const WorkspaceDashboard: React.FC<WorkspaceDashboardProps> = ({ flows, onOpenFlow, onCreateNewFlow, onCreateAIGeneratedFlow, onCreateFlowFromTemplate, onCreateFlowFromJSON }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [isNewFlowModalOpen, setNewFlowModalOpen] = useState(false);
  const [isAIGenerateModalOpen, setAIGenerateModalOpen] = useState(false);
  const [isMarketplaceOpen, setMarketplaceOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [isUserSettingsModalOpen, setUserSettingsModalOpen] = useState(false);
  const [isBillingModalOpen, setBillingModalOpen] = useState(false);

  // States for interactive controls
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState({ value: 'lastRun', label: 'Recent' });
  const [activeFilter, setActiveFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [expandedFlowId, setExpandedFlowId] = useState<string | null>(null);
  
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const flowCardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sortOptions = [
    { value: 'lastRun', label: 'Recent' },
    { value: 'title', label: 'Alphabetical' },
    { value: 'health', label: 'Health' },
  ];
  const filterOptions = ['All', 'Active', 'Issues', 'Paused', 'Failed'];

  const filteredAndSortedFlows = useMemo(() => {
    let processedFlows = [...flows];

    // Filtering by activeFilter
    if (activeFilter !== 'All') {
      if (activeFilter === 'Issues') {
        processedFlows = processedFlows.filter(f => f.status === FlowStatus.FAILED || f.health < 90);
      } else {
        processedFlows = processedFlows.filter(f => f.status === activeFilter.toUpperCase());
      }
    }
    
    // Filtering by search term
    if (searchTerm) {
        processedFlows = processedFlows.filter(f =>
            f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Sorting
    processedFlows.sort((a, b) => {
        switch (sortOption.value) {
            case 'title':
                return a.title.localeCompare(b.title);
            case 'health':
                return b.health - a.health;
            case 'lastRun':
            default:
                return b.metrics.lastRun - a.metrics.lastRun;
        }
    });

    return processedFlows;
  }, [flows, activeFilter, searchTerm, sortOption]);


  const [workspace, setWorkspace] = useState<Workspace>(MOCK_WORKSPACE_OBJ);
  const [users, setUsers] = useState<Record<string, User>>(MOCK_USERS_DB);

  const handleUpdateMemberRole = (userId: string, newRole: Role) => {
    setWorkspace(prev => ({
        ...prev,
        members: prev.members.map(m => m.userId === userId ? { ...m, role: newRole } : m)
    }));
  };

  const handleInviteMember = (email: string, role: Role) => {
    const newUserId = `user-${uuidv4()}`;
    const newUser: User = { id: newUserId, name: email.split('@')[0], email, avatarInitials: email.substring(0,2).toUpperCase() };
    setUsers(prev => ({...prev, [newUserId]: newUser}));
    setWorkspace(prev => ({
        ...prev,
        members: [...prev.members, { userId: newUserId, role }]
    }));
  };

  const handleRemoveMember = (userId: string) => {
      setWorkspace(prev => ({
          ...prev,
          members: prev.members.filter(m => m.userId !== userId)
      }));
  };

  const handleOpenWorkspaceSettings = () => setSettingsModalOpen(true);
  
  const handleInsightAction = (insight: SmartInsight) => {
    const match = insight.primaryMessage.match(/"([^"]+)"/);
    let targetFlow: DashboardFlow | undefined;

    if (match && match[1]) {
        const flowTitle = match[1];
        targetFlow = flows.find(f => f.title === flowTitle);
    } else if (insight.primaryMessage.includes("SEO Content Generator")) {
        targetFlow = flows.find(f => f.title === "SEO Content Generator");
    }
    
    if (targetFlow) {
        setExpandedFlowId(targetFlow.id);
        setTimeout(() => {
            flowCardRefs.current[targetFlow!.id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500); // Simulate data loading
    
    (window as any).handleInsightAction = handleInsightAction;

    const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            setCommandPaletteOpen(o => !o);
        }
        if (e.key === 'Escape') {
            setCommandPaletteOpen(false);
            setNotificationsOpen(false);
            setNewFlowModalOpen(false);
            setAIGenerateModalOpen(false);
            setMarketplaceOpen(false);
            setSettingsModalOpen(false);
            setUserSettingsModalOpen(false);
            setBillingModalOpen(false);
        }
    };
    
    const handleClickOutside = (event: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortDropdownOpen(false);
      }
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        clearTimeout(timer);
        window.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('mousedown', handleClickOutside);
        delete (window as any).handleInsightAction;
    };
  }, [flows]);

  const handleImportFromMarketplace = (flowState: FlowState) => {
    onCreateFlowFromTemplate(flowState);
    setMarketplaceOpen(false);
  };

  const handleSignOut = () => {
      console.log("User signed out.");
  }

  const handleOpenMarketplace = () => setMarketplaceOpen(true);

  const handleImportJSONClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        onCreateFlowFromJSON(text);
        setNewFlowModalOpen(false);
      }
    };
    reader.readAsText(file);

    if (event.target) {
      event.target.value = '';
    }
  };


  return (
    <div className="w-screen h-screen overflow-x-hidden">
      <Header 
        user={MOCK_USER} 
        onCommandPaletteOpen={() => setCommandPaletteOpen(true)}
        onNotificationsOpen={() => setNotificationsOpen(true)}
        onOpenWorkspaceSettings={handleOpenWorkspaceSettings}
        onOpenUserSettings={() => setUserSettingsModalOpen(true)}
        onOpenBilling={() => setBillingModalOpen(true)}
        onSignOut={handleSignOut}
      />
      
      {isCommandPaletteOpen && <CommandPalette onClose={() => setCommandPaletteOpen(false)} />}
      {isNotificationsOpen && <NotificationsPanel notifications={MOCK_NOTIFICATIONS} onClose={() => setNotificationsOpen(false)} />}
      {isNewFlowModalOpen && <NewFlowModal 
        onClose={() => setNewFlowModalOpen(false)} 
        onCreateNewFlow={onCreateNewFlow} 
        onOpenAIGenerateModal={() => {
            setNewFlowModalOpen(false);
            setAIGenerateModalOpen(true);
        }}
        onOpenMarketplace={() => {
            setNewFlowModalOpen(false);
            setMarketplaceOpen(true);
        }}
        onImportJSON={handleImportJSONClick}
      />}
      {isAIGenerateModalOpen && <AIGeneratedWorkflowModal 
          onClose={() => setAIGenerateModalOpen(false)} 
          onCreateFlow={onCreateAIGeneratedFlow}
      />}
      {isMarketplaceOpen && <WorkflowMarketplaceModal
          workflows={MOCK_MARKETPLACE_WORKFLOWS}
          onClose={() => setMarketplaceOpen(false)}
          onImport={handleImportFromMarketplace}
      />}
      {isSettingsModalOpen && <WorkspaceSettingsModal
          workspace={workspace}
          users={users}
          onClose={() => setSettingsModalOpen(false)}
          onUpdateMemberRole={handleUpdateMemberRole}
          onInviteMember={handleInviteMember}
          onRemoveMember={handleRemoveMember}
          currentUserRole="OWNER"
      />}
      {isUserSettingsModalOpen && <UserSettingsModal user={MOCK_USER} onClose={() => setUserSettingsModalOpen(false)} />}
      {isBillingModalOpen && <BillingModal onClose={() => setBillingModalOpen(false)} />}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        style={{ display: 'none' }}
      />


      <main className="pt-[72px] flex">
        <div className="flex-1 px-8 pb-8">
            <div className="animate-slide-up-fade-in relative z-30" style={{ animationDelay: '100ms' }}>
                <HeroSection 
                    workspaceName={workspace.name}
                    workspaceDesc={workspace.description}
                    onNewFlow={() => setNewFlowModalOpen(true)}
                    onOpenSettings={handleOpenWorkspaceSettings}
                    searchTerm={searchTerm}
                    onSearchChange={(e) => setSearchTerm(e.target.value)}
                    sortOption={sortOption}
                    onSortChange={(option) => { setSortOption(option); setIsSortDropdownOpen(false); }}
                    filterOption={activeFilter}
                    onFilterChange={(option) => { setActiveFilter(option); setIsFilterDropdownOpen(false); }}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    isSortDropdownOpen={isSortDropdownOpen}
                    onToggleSortDropdown={() => { setIsSortDropdownOpen(p => !p); setIsFilterDropdownOpen(false); }}
                    isFilterDropdownOpen={isFilterDropdownOpen}
                    onToggleFilterDropdown={() => { setIsFilterDropdownOpen(p => !p); setIsSortDropdownOpen(false); }}
                    sortOptions={sortOptions}
                    filterOptions={filterOptions}
                    sortDropdownRef={sortDropdownRef}
                    filterDropdownRef={filterDropdownRef}
                />
            </div>
            <div className="animate-slide-up-fade-in" style={{ animationDelay: '200ms' }}>
                 <QuickMetricsBar />
            </div>
            <div className="animate-slide-up-fade-in" style={{ animationDelay: '300ms' }}>
                 <MainContent 
                    flows={filteredAndSortedFlows}
                    onNewFlow={() => setNewFlowModalOpen(true)} 
                    onOpenFlow={onOpenFlow}
                    insights={MOCK_INSIGHTS}
                    activity={MOCK_ACTIVITY}
                    onOpenMarketplace={handleOpenMarketplace}
                    viewMode={viewMode}
                    expandedFlowId={expandedFlowId}
                    setExpandedFlowId={setExpandedFlowId}
                    flowCardRefs={flowCardRefs}
                />
            </div>
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
            <Sidebar onOpenMarketplace={handleOpenMarketplace} />
        </div>
      </main>
    </div>
  );
};