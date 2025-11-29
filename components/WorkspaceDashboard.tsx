
import React, { useState, useMemo, useEffect } from 'react';
import { Workspace, DashboardFlow, FlowStatus, Notification, SmartInsight, ActivityItem, Template, ResourceLink, User } from '../types';
import { FlowCard } from './FlowCard'; 
import { 
    Plus, Users, Settings, Search, Play, Edit, BarChart2, Lightbulb, DollarSign,
    TrendingUp, TrendingDown, AlertTriangle, Sparkles, Command, Bell, X,
    Filter, ArrowUpDown, LayoutGrid, List,
    Book, Video, MessageCircle, GitMerge, FileText, CheckCircle,
    Copy, Download, Share2, Bot, LifeBuoy, LogOut, Briefcase, ChevronDown, Check, Trash2,
    FileJson, Brain
} from 'lucide-react';

// --- MOCK DATA ---
const MOCK_USER: User = { id: 'user-1', name: 'John Doe', email: 'john@company.com', avatarInitials: 'JD' };
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
    { id: 't3', icon: MessageCircle, name: 'Auto-Triage Support', description: 'Routes tickets, drafts replies, and escalates complex cases.'}
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

// --- SUB-COMPONENTS ---

const Header = ({ user, onCommandPaletteOpen, onNotificationsOpen }: { user: User, onCommandPaletteOpen: () => void, onNotificationsOpen: () => void }) => {
    const [isProfileOpen, setProfileOpen] = useState(false);
    return (
        <header className="fixed top-0 left-0 right-0 h-[72px] bg-bg-primary/80 backdrop-blur-lg border-b border-border-primary z-50 flex items-center px-6 justify-between">
            <div className="flex items-center gap-4">
                <Sparkles className="text-accent-secondary" size={28} />
                <h1 className="text-xl font-bold text-text-primary">CognitoFlow</h1>
                <div className="w-px h-6 bg-border-primary" />
                <div className="text-sm">
                    <span className="text-text-tertiary">Workspaces ▾ / </span>
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
                <button className="h-9 px-3 flex items-center gap-2 text-sm bg-bg-card border border-border-primary rounded-lg text-text-secondary hover:bg-bg-hover">
                    <Users size={16} /> 2
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
                               <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-bg-hover"><Briefcase size={16} /> Profile</a>
                               <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-bg-hover"><Settings size={16} /> Settings</a>
                               <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-bg-hover"><DollarSign size={16} /> Usage & Billing</a>
                           </div>
                           <div className="p-2 border-t border-border-primary">
                               <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-bg-hover text-status-error"><LogOut size={16} /> Sign Out</a>
                           </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

const HeroSection = ({ workspaceName, workspaceDesc, onNewFlow }: { workspaceName: string, workspaceDesc?: string, onNewFlow: () => void }) => {
    return (
        <section className="pt-8">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold text-text-primary">{workspaceName}</h2>
                    <p className="text-text-tertiary mt-1">{workspaceDesc}</p>
                </div>
                <button className="h-10 px-4 flex items-center gap-2 text-sm font-medium bg-bg-card border border-border-primary rounded-lg text-text-secondary hover:bg-bg-hover">
                    <Settings size={16} /> Workspace Settings
                </button>
            </div>
            <div className="mt-6 flex items-center gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                    <input type="text" placeholder="Search flows..." className="w-full h-10 bg-bg-input border border-border-primary rounded-lg pl-9 pr-3 text-sm" />
                </div>
                <button className="h-10 px-4 flex items-center gap-2 text-sm font-medium bg-bg-card border border-border-primary rounded-lg text-text-secondary hover:bg-bg-hover">
                    <Filter size={14} /> Filter ▾
                </button>
                <button className="h-10 px-4 flex items-center gap-2 text-sm font-medium bg-bg-card border border-border-primary rounded-lg text-text-secondary hover:bg-bg-hover">
                    <ArrowUpDown size={14} /> Sort: Recent ▾
                </button>
                <div className="flex items-center bg-bg-card border border-border-primary rounded-lg p-0.5">
                    <button className="h-8 w-8 flex items-center justify-center rounded-md bg-bg-hover text-text-primary"><LayoutGrid size={16} /></button>
                    <button className="h-8 w-8 flex items-center justify-center rounded-md text-text-tertiary"><List size={16} /></button>
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

const EmptyState = ({ onNewFlow }: { onNewFlow: () => void }) => (
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
             <button className="w-full text-left p-6 flex items-center gap-6 bg-bg-card border border-border-primary rounded-lg hover:border-accent-primary/50 transition-colors">
                <FileText size={24} className="text-accent-primary"/>
                <div>
                    <h4 className="font-bold text-text-primary">Browse Templates</h4>
                    <p className="text-sm text-text-tertiary">Use pre-built workflows for common tasks.</p>
                </div>
            </button>
        </div>
    </div>
);

const MainContent = ({ flows, onNewFlow, onOpenFlow, insights, activity }: { flows: DashboardFlow[], onNewFlow: () => void, onOpenFlow: (flowId: string) => void, insights: SmartInsight[], activity: ActivityItem[] }) => {
    const [activeTab, setActiveTab] = useState('All');
    
    const filteredFlows = useMemo(() => {
        if (activeTab === 'Active') return flows.filter(f => f.status === FlowStatus.ACTIVE);
        if (activeTab === 'Issues') return flows.filter(f => f.status === FlowStatus.FAILED || f.health < 90);
        return flows;
    }, [flows, activeTab]);

    return (
        <div className="mt-8 space-y-10">
            <div>
                <h3 className="text-lg font-bold text-text-secondary uppercase tracking-wider mb-4">Your Flows</h3>
                <div className="flex gap-2 mb-6">
                    {['All', 'Active', 'Issues'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${activeTab === tab ? 'bg-accent-primary/10 border-accent-primary/30 text-accent-primary' : 'bg-transparent border-border-primary text-text-tertiary hover:bg-bg-hover'}`}
                        >
                            {tab} ({tab === 'All' ? flows.length : tab === 'Active' ? flows.filter((f) => f.status === FlowStatus.ACTIVE).length : flows.filter((f) => f.status === FlowStatus.FAILED || f.health < 90).length})
                        </button>
                    ))}
                </div>
                {flows.length === 0 ? <EmptyState onNewFlow={onNewFlow} /> : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredFlows.map((flow: DashboardFlow) => <FlowCard key={flow.id} flow={flow} onOpenFlow={onOpenFlow} />)}
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
                                <button className="text-xs font-medium bg-bg-card px-3 py-1 rounded-md text-text-secondary hover:bg-bg-hover">{insight.action.label}</button>
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

const Sidebar = () => {
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
                      <button className="mt-3 w-full text-center text-sm font-medium bg-accent-primary/10 border border-accent-primary/20 text-accent-primary h-9 rounded-lg hover:bg-accent-primary/20">Use Template →</button>
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

const NewFlowModal = ({ onClose, onCreateNewFlow }: { onClose: () => void, onCreateNewFlow: () => void }) => (
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
                 <button className="w-full text-left p-6 flex items-center gap-6 bg-bg-secondary border border-border-primary rounded-lg hover:border-accent-primary/50 transition-colors">
                    <Brain size={24} className="text-accent-primary"/>
                    <div>
                        <h4 className="font-bold text-text-primary">AI-Generated Workflow</h4>
                        <p className="text-sm text-text-tertiary">Describe your goal and let AI build it for you.</p>
                    </div>
                </button>
                 <button className="w-full text-left p-6 flex items-center gap-6 bg-bg-secondary border border-border-primary rounded-lg hover:border-accent-primary/50 transition-colors">
                    <FileText size={24} className="text-accent-primary"/>
                    <div>
                        <h4 className="font-bold text-text-primary">Use Template</h4>
                        <p className="text-sm text-text-tertiary">Browse pre-built workflows for common tasks.</p>
                    </div>
                </button>
                 <button className="w-full text-left p-6 flex items-center gap-6 bg-bg-secondary border border-border-primary rounded-lg hover:border-accent-primary/50 transition-colors">
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
}

export const WorkspaceDashboard: React.FC<WorkspaceDashboardProps> = ({ flows, onOpenFlow, onCreateNewFlow }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [isNewFlowModalOpen, setNewFlowModalOpen] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500); // Simulate data loading
    
    const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            setCommandPaletteOpen(o => !o);
        }
        if (e.key === 'Escape') {
            setCommandPaletteOpen(false);
            setNotificationsOpen(false);
            setNewFlowModalOpen(false);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
        clearTimeout(timer);
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="w-screen h-screen overflow-x-hidden">
      <Header 
        user={MOCK_USER} 
        onCommandPaletteOpen={() => setCommandPaletteOpen(true)}
        onNotificationsOpen={() => setNotificationsOpen(true)}
      />
      
      {isCommandPaletteOpen && <CommandPalette onClose={() => setCommandPaletteOpen(false)} />}
      {isNotificationsOpen && <NotificationsPanel notifications={MOCK_NOTIFICATIONS} onClose={() => setNotificationsOpen(false)} />}
      {isNewFlowModalOpen && <NewFlowModal onClose={() => setNewFlowModalOpen(false)} onCreateNewFlow={onCreateNewFlow} />}

      <main className="pt-[72px] flex">
        <div className="flex-1 px-8 pb-8">
            <div className="animate-slide-up-fade-in" style={{ animationDelay: '100ms' }}>
                <HeroSection 
                    workspaceName="Main Workspace"
                    workspaceDesc="Financial Strategy Hub"
                    onNewFlow={() => setNewFlowModalOpen(true)}
                />
            </div>
            <div className="animate-slide-up-fade-in" style={{ animationDelay: '200ms' }}>
                 <QuickMetricsBar />
            </div>
            <div className="animate-slide-up-fade-in" style={{ animationDelay: '300ms' }}>
                 <MainContent 
                    flows={flows} 
                    onNewFlow={() => setNewFlowModalOpen(true)} 
                    onOpenFlow={onOpenFlow}
                    insights={MOCK_INSIGHTS}
                    activity={MOCK_ACTIVITY}
                />
            </div>
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
            <Sidebar />
        </div>
      </main>
    </div>
  );
};