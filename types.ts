// FIX: Added React import to resolve namespace errors.
import React from 'react';

// --- CORE NODE & FLOW TYPES ---

export enum NodeType {
  GOAL = 'GOAL',
  AGENT = 'AGENT',
  TOOL = 'TOOL',
  CRITIQUE = 'CRITIQUE',
  REFINE = 'REFINE',
  SCORECARD = 'SCORECARD',
  TASK = 'TASK',
  DECISION = 'DECISION',
  HUMAN_REVIEW = 'HUMAN_REVIEW',
}

export interface NodeConfig {
  model: string;
  temperature: number;
  topP: number;
}

export interface HumanReviewConfig {
  instructions: string;
  options: string[];
}

export interface SimulationConfig {
    defaultScenarioType: 'HAPPY_PATH' | 'EDGE_CASE' | 'STRESS_TEST' | 'REGULATORY_AUDIT';
    defaultInputVolume: 'LOW' | 'MEDIUM' | 'HIGH';
    defaultErrorRate: number;
}

export interface AgentConfig {
  persona: string;
  objective: string;
  memoryDepth?: number;
  allowedTools?: string[];
  memoryEnabled?: boolean;
  autonomyLevel?: number;
}

export interface CritiqueConfig {
  rubric: string;
  gradingScale: 'PASS_FAIL' | 'SCORE_1_10' | 'SCORE_0_100';
  focusArea: string;
}

export interface RefineConfig {
  maxIterations: number;
  convergenceThreshold: number;
  strategy: 'DIFFERENCE_PROMPTING' | 'DIRECT_REVISION';
}

export interface ToolExecutionConfig {
  mode: 'SEQUENTIAL' | 'PARALLEL';
  retryCount: number;
  timeoutMs: number;
  continueOnError: boolean;
}

// --- AGENT & MEMORY ---
export interface MemoryEntry {
  id: string;
  content: string;
  tags: string[];
  confidenceScore: number;
  timestamp: number;
  sourceAgentId: string;
}

// --- TOOLS ---
export interface ToolParameter {
  name: string;
  type: 'STRING' | 'NUMBER' | 'BOOLEAN';
  description: string;
  required: boolean;
}

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  category: 'SEARCH' | 'IMAGE' | 'DATA' | 'CUSTOM' | 'UTILITY';
  isCustom?: boolean;
  parameters: ToolParameter[];
  mockResponse?: string;
}

// --- GOAL SETTINGS & EXECUTION ---
// FIX: Converted TriggerType to an enum to allow usage as both a type and a value.
export enum TriggerType {
    SCHEDULE = 'SCHEDULE',
    WEBHOOK = 'WEBHOOK',
    EMAIL = 'EMAIL',
}

export interface ScheduleTriggerConfig {
    type: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    startDate: number;
}

export interface Trigger {
    id: string;
    type: TriggerType;
    isEnabled: boolean;
    config: ScheduleTriggerConfig | { url: string } | { sender: string; subjectKeywords: string[] };
}

export interface RunLog {
    id: string;
    timestamp: number;
    status: 'SUCCESS' | 'FAILURE';
    nodeCount: number;
    durationMs: number;
    cost: number;
}

export interface AlertRule {
    id: string;
    type: 'FAILURE_RATE' | 'COST_SPIKE' | 'LATENCY';
    threshold: number;
    timeWindowMinutes: number;
    channels: string[];
    isEnabled: boolean;
}

export interface Guardrail {
    id: string;
    metric: 'COST_PER_EXECUTION' | 'COST_ACCUMULATED' | 'SENSITIVE_DATA_SCORE' | 'HALLUCINATION_RATE' | 'LATENCY_MS';
    operator: '>' | '<' | '>=' | '<=';
    threshold: number;
    fallbackAction: 'WARN' | 'HUMAN_REVIEW' | 'SWITCH_MODEL' | 'ABORT';
    isEnabled: boolean;
    complianceLabel?: 'GDPR' | 'HIPAA' | 'SOC2' | 'INTERNAL';
}

export interface TestCase {
    id: string;
    name: string;
    startNodeId: string;
    inputData: any;
}

export interface ObjectiveKPI {
    id: string;
    name: string;
    targetValue: string;
    metricType: 'NUMERIC' | 'PERCENTAGE' | 'BOOLEAN';
    source: 'AI_EVALUATION' | 'MANUAL_INPUT';
}


// --- ANALYTICS & REPORTING ---

export interface AnalyticsMetrics {
    estimatedCost: number;
    executionTimeMs: number;
    tokensInput: number;
    tokensOutput: number;
}

export interface ScorecardResult {
    overallScore: number;
    kpiResults: {
        kpiId: string;
        actualValue: string;
        status: 'PASSED' | 'FAILED' | 'PARTIAL';
        aiAnalysis: string;
    }[];
    summary: string;
    generatedAt: number;
}

export interface ComplianceResult {
    score: number;
    status: 'SAFE' | 'WARNING' | 'DANGER';
    violations: {
        category: 'PII' | 'BIAS' | 'TOXICITY';
        severity: 'LOW' | 'HIGH';
        description: string;
        suggestion: string;
    }[];
    piiDetected: string[];
    scannedAt: number;
}

export interface NodeData {
  title: string;
  description?: string;
  isUserEdited?: boolean;
  status?: string;
  analytics?: AnalyticsMetrics;
  agentConfig?: AgentConfig;
  critiqueConfig?: CritiqueConfig;
  refineConfig?: RefineConfig;
  toolConfig?: ToolExecutionConfig;
  simulationConfig?: SimulationConfig;
  humanReviewConfig?: HumanReviewConfig;
  objectives?: ObjectiveKPI[];
  triggers?: Trigger[];
  alertRules?: AlertRule[];
  guardrails?: Guardrail[];
  budget?: { cap: number, autoPause: boolean };
  testCases?: TestCase[];
}

export interface FlowNode {
  id: string;
  type: NodeType;
  data: NodeData;
  parentId?: string;
  childrenIds: string[];
}

export interface FlowState {
  rootId: string | null;
  nodes: Record<string, FlowNode>;
  selectedNodeId?: string | null;
  selectedForMerge?: string[];
  mode?: 'PLANNING' | 'EXECUTION';
  heatmapMode?: boolean;
}

export interface FlowVersion {
  id: string;
  label: string;
  timestamp: number;
  flowState: FlowState;
}

// --- NEW DASHBOARD TYPES ---

// FIX: Converted FlowStatus to an enum to allow usage as both a type and a value.
export enum FlowStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  FAILED = 'FAILED',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
  IDLE = 'IDLE',
}

export interface DashboardFlow {
  id: string;
  icon: string;
  title: string;
  description: string;
  status: FlowStatus;
  health: number; // 0-100
  metrics: {
    avgRuntime: number; // in seconds
    avgCost: number; // in dollars
    successRate: number; // 0-100
    lastRun: number; // timestamp
  };
  warning?: {
    title: string;
    details: string;
    action: {
      label: string;
      nodeId: string;
    };
  };
  pausedInfo?: {
    timestamp: number;
    user: string;
    reason: string;
  };
  errorInfo?: {
    title: string;
    details: string;
    timestamp: number;
  };
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  flows: DashboardFlow[];
  members: any[];
  ownerId: string;
  knowledgeBase?: MemoryEntry[];
  locale?: string;
}

export type NotificationType = 'SUCCESS' | 'WARNING' | 'ERROR';
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  flowName: string;
  timestamp: number;
  details?: string;
}

export type InsightCategory = 'PERFORMANCE' | 'COST' | 'USAGE' | 'COMPLIANCE' | 'SUGGESTION';
export interface SmartInsight {
  id: string;
  category: InsightCategory;
  title: string;
  primaryMessage: string;
  secondaryDetails: string;
  action: {
    label: string;
    type: 'OPTIMIZE' | 'VIEW' | 'ADD_GUARD' | 'ADD_TO_FLOW';
  };
}

export type ActivityType = 'EXECUTION' | 'WARNING' | 'ERROR' | 'SYSTEM';
export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  details: string;
  metrics?: string;
  timestamp: number;
  action: {
    label: string;
    link: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
}

export interface Template {
  id: string;
  icon: React.ElementType;
  name: string;
  description: string;
}

export interface ResourceLink {
  icon: React.ElementType;
  label: string;
  href: string;
}

// --- SIMULATION ---
export interface SimulationScenario {
    id: string;
    name: string;
    description: string;
    type: 'HAPPY_PATH' | 'EDGE_CASE' | 'STRESS_TEST' | 'REGULATORY_AUDIT';
    parameters: {
        inputVolume: 'LOW' | 'MEDIUM' | 'HIGH';
        errorInjectionRate: number;
        syntheticDataProfile: 'STANDARD';
    };
}

export interface SimulationResult {
    scenarioId: string;
    predictedOutcome: string;
    riskAssessment: string;
    estimatedLatencyMs: number;
    estimatedCost: number;
    successProbability: number;
}

// --- MODALS & MISC ---
export type Role = 'OWNER' | 'DESIGNER' | 'REVIEWER' | 'VIEWER';

export interface HumanReviewResult {
    reviewerId: string;
    decision: string;
    comments: string;
    timestamp: number;
}

export interface MarketplaceWorkflow {
    id: string;
    title: string;
    description: string;
    category: string;
    isVerified: boolean;
    rating: number;
    authorName: string;
    downloads: number;
    flowState: FlowState;
}

export type OptimizationType = 'COST' | 'EFFICIENCY' | 'QUALITY';

export interface OptimizationProposal {
    id: string;
    type: OptimizationType;
    title: string;
    description: string;
    changes: any;
}

export interface OptimizationSuggestion {
    id: string;
    type: 'COST' | 'EFFICIENCY' | 'QUALITY';
    title: string;
    description: string;
}

export interface PreFlightIssue {
    id: string;
    severity: 'CRITICAL' | 'WARNING' | 'SUGGESTION';
    title: string;
    description: string;
    targetNodeIds: string[];
}

export interface PreFlightReport {
    healthScore: number;
    estimatedCost: number;
    estimatedTimeS: number;
    issues: PreFlightIssue[];
}

export interface AuditLogEntry {
    id: string;
    timestamp: number;
    userId: string;
    action: string;
    details: string;
}