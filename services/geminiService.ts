



import { GoogleGenAI, Tool, FunctionDeclaration, Type } from "@google/genai";
// FIX: Added missing type imports which are now defined in types.ts
import { AgentConfig, ToolDefinition, CritiqueConfig, RefineConfig, ToolExecutionConfig, MemoryEntry, ObjectiveKPI, ScorecardResult, FlowState, ComplianceResult, SimulationScenario, SimulationResult, FlowNode, NodeType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelName = 'gemini-2.5-flash';

export const executeAgentNode = async (
  agentConfig: AgentConfig, 
  context: string, 
  allTools: ToolDefinition[], 
  relevantMemories: MemoryEntry[] = [],
  locale?: string
): Promise<{ finalOutput: string; thoughtProcess: string; newMemories: Partial<MemoryEntry>[] }> => {
  const allowedTools = agentConfig.allowedTools ? allTools.filter(t => agentConfig.allowedTools!.includes(t.id)) : [];
  
  const geminiTools: Tool[] = [];
  const hasSearch = allowedTools.some(t => t.id === 'google-search');
  if (hasSearch) geminiTools.push({ googleSearch: {} });
  
  const funcDecls = allowedTools.filter(t => t.id !== 'google-search').map(mapToolToDeclaration);
  if (funcDecls.length > 0) {
    geminiTools.push({ functionDeclarations: funcDecls });
  }
  
  const autonomy = agentConfig.autonomyLevel ?? 50;
  
  let systemInstruction = `Persona: ${agentConfig.persona}
Objective: ${agentConfig.objective}
Autonomy Level: ${autonomy}%

You are an advanced "Cognitive Agent Orchestrator". 
1. Maintain goal persistence.
2. Evaluate your own progress (Self-Correction).
3. Utilize the "Cognitive Memory Layer" to learn from past experiences.
4. Output specific "Learnings" that should be stored in long-term memory for future agents.

You must output a JSON object: { 
  "thoughtProcess": "Internal monologue...", 
  "finalOutput": "Result...", 
  "learnings": [{ "content": "Fact or strategy learned", "tags": ["tag1"] }] 
}`;
  
  if (locale) systemInstruction += ` Respond in ${locale}.`;
  
  if (relevantMemories.length > 0) {
      const memoryText = relevantMemories.map(m => `- [${m.tags.join(', ')}] ${m.content} (Confidence: ${m.confidenceScore})`).join('\n');
      systemInstruction += `\n\nRELEVANT LONG-TERM MEMORIES:\n${memoryText}`;
  }

  const prompt = `Context:\n${context}\n\nStart execution.`;

  // FIX: Conditionally set responseMimeType. The googleSearch tool is not compatible with responseMimeType.
  const config: any = {
    systemInstruction: systemInstruction,
    tools: geminiTools,
    ...(agentConfig.temperature !== undefined && { temperature: agentConfig.temperature }),
    ...(agentConfig.topP !== undefined && { topP: agentConfig.topP }),
  };

  if (!hasSearch) {
    config.responseMimeType = "application/json";
  }

  const response = await ai.models.generateContent({
    model: agentConfig.model || modelName,
    contents: prompt,
    config,
  });

  const text = response.text || "{}";
  try {
    const json = JSON.parse(text);
    return {
      finalOutput: json.finalOutput || text,
      thoughtProcess: json.thoughtProcess || "No thought process generated.",
      newMemories: json.learnings || []
    };
  } catch (e) {
    return {
      finalOutput: text,
      thoughtProcess: "Failed to parse JSON response.",
      newMemories: []
    };
  }
};

export const executeCritiqueNode = async (
  config: CritiqueConfig,
  inputContent: string
): Promise<{ finalOutput: string; thoughtProcess: string }> => {
  const systemInstruction = `You are an expert Judge and Critic.
Your Role: Evaluate the provided content based strictly on the following rubric.
Rubric: "${config.rubric || 'General Quality Assessment'}"
Focus Area: "${config.focusArea || 'Accuracy and Clarity'}"
Grading Scale: ${config.gradingScale}

Output a JSON object: { "score": "The score based on the scale", "critique": "Detailed feedback", "finalOutput": "A summary of the critique for the next step", "thoughtProcess": "Reasoning behind the score" }`;

  const response = await ai.models.generateContent({
    model: modelName,
    contents: `Content to Evaluate:\n${inputContent}`,
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json"
    }
  });
  
  const text = response.text || "{}";
  try {
    const json = JSON.parse(text);
    return {
      finalOutput: `Score: ${json.score}\nFeedback: ${json.critique}`,
      thoughtProcess: json.thoughtProcess
    };
  } catch (e) {
    return { finalOutput: text, thoughtProcess: "Failed to parse critique." };
  }
};

export const executeRefineNode = async (
  config: RefineConfig,
  originalContent: string,
  critiqueFeedback: string
): Promise<{ finalOutput: string; thoughtProcess: string }> => {
  const strategyInstruction = config.strategy === 'DIFFERENCE_PROMPTING' 
    ? "Analyze the differences between the current state and the desired state implied by the critique. Generate a revision that bridges this gap."
    : "Rewrite the content directly to address all points in the critique.";

  const systemInstruction = `You are a Revision Specialist.
Task: Improve the original content based on the provided critique.
Strategy: ${strategyInstruction}
Max Iterations allowed: ${config.maxIterations} (This is iteration 1)

Output a JSON object: { "finalOutput": "The revised content", "thoughtProcess": "Explanation of changes made", "changes": ["List of specific improvements"] }`;

  const response = await ai.models.generateContent({
    model: modelName,
    contents: `Original Content:\n${originalContent}\n\nCritique:\n${critiqueFeedback}`,
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json"
    }
  });

  const text = response.text || "{}";
  try {
    const json = JSON.parse(text);
    return {
      finalOutput: json.finalOutput,
      thoughtProcess: `${json.thoughtProcess}\nChanges: ${JSON.stringify(json.changes)}`
    };
  } catch (e) {
    return { finalOutput: text, thoughtProcess: "Failed to parse revision." };
  }
};

export const executeToolNode = async (
    toolDefinition: ToolDefinition,
    config: ToolExecutionConfig,
    inputContext: string
): Promise<{ finalOutput: string; thoughtProcess: string }> => {
    const systemInstruction = `You are a Tool Execution Engine.
Tool Name: ${toolDefinition.name}
Description: ${toolDefinition.description}
Configuration: Mode=${config.mode}, Retries=${config.retryCount}, Timeout=${config.timeoutMs}ms

Your task is to SIMULATE the execution of this tool.
Output a JSON object: { "status": "SUCCESS" | "ERROR", "finalOutput": "The tool result", "thoughtProcess": "How the tool processed the input" }`;

    const response = await ai.models.generateContent({
        model: modelName,
        contents: `Input Context:\n${inputContext}\n\nMock Response Pattern:\n${toolDefinition.mockResponse || '{}'}`,
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json"
        }
    });

    const text = response.text || "{}";
    try {
        const json = JSON.parse(text);
        return {
            finalOutput: json.finalOutput,
            thoughtProcess: `[Tool: ${toolDefinition.name}] Status: ${json.status}\n${json.thoughtProcess}`
        };
    } catch (e) {
        return { finalOutput: text, thoughtProcess: "Tool execution simulation failed." };
    }
};

export const generateToolDocumentation = async (
    name: string,
    params: any[]
): Promise<string> => {
    const prompt = `Generate a concise but technical description for a tool named "${name}" with parameters: ${JSON.stringify(params)}. Include intended use cases.`;
    const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt
    });
    return response.text || "No documentation generated.";
};

export const evaluateObjectiveScorecard = async (
    kpis: ObjectiveKPI[],
    flowOutput: string
): Promise<ScorecardResult> => {
    const systemInstruction = `You are an Objective Scorecard Evaluator.
Your Task: Evaluate the provided flow output against the defined Key Performance Indicators (KPIs).
For each KPI, determine if it was PASSED, FAILED, or PARTIAL based on the evidence in the output.
Assign an overall confidence score (0-100).

Output JSON: { "overallScore": number, "kpiResults": [{ "kpiId": "id", "actualValue": "value found", "status": "PASSED"|"FAILED"|"PARTIAL", "aiAnalysis": "Reasoning" }], "summary": "Executive summary" }`;

    const response = await ai.models.generateContent({
        model: modelName,
        contents: `KPIs Defined:\n${JSON.stringify(kpis)}\n\nFlow Final Output:\n${flowOutput}`,
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json"
        }
    });

    const text = response.text || "{}";
    try {
        return JSON.parse(text) as ScorecardResult;
    } catch (e) {
        return {
            overallScore: 0,
            kpiResults: [],
            summary: "Failed to generate scorecard.",
            generatedAt: Date.now()
        };
    }
};

export const planAutopilotStep = async (
    flowState: FlowState,
    goalDescription: string
): Promise<{ action: string; reasoning: string; targetNodeId?: string; newNodeType?: string }> => {
    const nodeSummary = Object.values(flowState.nodes).map(n => `ID: ${n.id}, Type: ${n.type}, Status: ${n.data.status || 'PENDING'}`).join('\n');
    
    const systemInstruction = `You are the "Flow Autopilot" engine for CognitoFlow.
Goal: ${goalDescription}
Current Flow State:
${nodeSummary}

Your job is to decide the next immediate step to move closer to the goal.
Actions allowed: "ADD_NODE", "EXECUTE_NODE", "CRITIQUE_NODE", "FINISH".

Output JSON: { "action": "ACTION_NAME", "reasoning": "Why this step?", "targetNodeId": "ID if executing", "newNodeType": "AGENT"|"TOOL"|"CRITIQUE" if adding }`;

    const response = await ai.models.generateContent({
        model: modelName,
        contents: "Decide the next step.",
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json"
        }
    });

    const text = response.text || "{}";
    try {
        return JSON.parse(text);
    } catch (e) {
        return { action: "FINISH", reasoning: "Error parsing plan." };
    }
};

export const scanForCompliance = async (
    content: string
): Promise<ComplianceResult> => {
    const systemInstruction = `You are the "Ethics & Compliance Engine" for an enterprise AI system.
Your Task: Scan the provided content for safety violations.
Policies to Enforce:
1. No PII (Emails, Phones, SSN, Addresses).
2. No Gender/Racial/Religious Bias.
3. No Toxicity or harmful instructions.

Output JSON: {
  "score": number (0-100, where 100 is perfectly safe),
  "status": "SAFE" | "WARNING" | "DANGER",
  "violations": [
    { "category": "PII"|"BIAS"|"TOXICITY", "severity": "LOW"|"HIGH", "description": "Details", "suggestion": "Fix" }
  ],
  "piiDetected": ["redacted_email@example.com", "redacted_phone"]
}`;

    const response = await ai.models.generateContent({
        model: modelName,
        contents: `Content to Scan:\n${content}`,
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json"
        }
    });

    const text = response.text || "{}";
    try {
        const result = JSON.parse(text);
        return {
            ...result,
            scannedAt: Date.now()
        };
    } catch (e) {
        return {
            score: 0,
            status: "DANGER",
            violations: [{ category: "TOXICITY", severity: "HIGH", description: "Scan failed to parse.", suggestion: "Retry" }],
            piiDetected: [],
            scannedAt: Date.now()
        };
    }
};

export const runFlowSimulation = async (
    scenario: SimulationScenario,
    nodeDescription: string
): Promise<SimulationResult> => {
    const systemInstruction = `You are the "Flow Simulation Mode" engine.
Scenario: ${scenario.name} (${scenario.type})
Params: Input=${scenario.parameters.inputVolume}, ErrorRate=${scenario.parameters.errorInjectionRate}
Task: Predict the outcome of a workflow node WITHOUT executing it. Generate synthetic results based on the node description.

Output JSON: {
  "predictedOutcome": "Simulated output...",
  "riskAssessment": "Risk analysis...",
  "estimatedLatencyMs": number,
  "estimatedCost": number,
  "successProbability": number (0-1)
}`;

    const response = await ai.models.generateContent({
        model: modelName,
        contents: `Node Description: ${nodeDescription}\nGenerate synthetic simulation data.`,
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json"
        }
    });

    const text = response.text || "{}";
    try {
        const result = JSON.parse(text);
        return {
            scenarioId: scenario.id,
            ...result
        };
    } catch (e) {
        return {
            scenarioId: scenario.id,
            predictedOutcome: "Simulation failed.",
            riskAssessment: "Unknown",
            estimatedLatencyMs: 0,
            estimatedCost: 0,
            successProbability: 0
        };
    }
};

// FIX: Added interfaces for AI response to ensure type safety and resolve property access errors.
interface AINode {
  id: string;
  type: string;
  title: string;
  description: string;
  parentId: string | null;
  childrenIds: string[];
}

interface AISuggestedStructure {
  rootId: string;
  nodes: Record<string, AINode>;
}


export const suggestFlowStructure = async (goal: string): Promise<Partial<FlowState>> => {
  const systemInstruction = `You are a "Workflow Architect" for CognitoFlow, an AI orchestration platform.
Your task is to decompose a high-level user goal into a logical sequence of workflow nodes.
The available node types are: GOAL, AGENT, TOOL, CRITIQUE, REFINE, SCORECARD.

Rules:
1. The first node must always be of type 'GOAL'.
2. Create a simple, linear chain of 3 to 5 nodes.
3. For each node, provide a unique ID (e.g., 'node-1'), type, title, description, parentId (null for root), and childrenIds (an array with one ID or empty).
4. The 'title' should be a concise action, and 'description' should explain its purpose.

Output a valid JSON object with the following structure: {
  "rootId": "The ID of the root GOAL node",
  "nodes": {
    "node-1": { "id": "node-1", "type": "GOAL", "title": "...", "description": "...", "parentId": null, "childrenIds": ["node-2"] },
    "node-2": { "id": "node-2", "type": "AGENT", "title": "...", "description": "...", "parentId": "node-1", "childrenIds": ["node-3"] },
    "...": {}
  }
}`;

  const response = await ai.models.generateContent({
    model: modelName,
    contents: `User Goal: "${goal}"`,
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json"
    }
  });

  const text = response.text || "{}";
  try {
    const suggestedStructure: AISuggestedStructure = JSON.parse(text);
    
    if (!suggestedStructure.rootId || !suggestedStructure.nodes) {
      throw new Error("Invalid structure from AI: missing rootId or nodes");
    }

    // Map AI response to FlowNode structure
    const finalNodes: Record<string, FlowNode> = {};
    for (const nodeId in suggestedStructure.nodes) {
      const aiNode = suggestedStructure.nodes[nodeId];
      finalNodes[nodeId] = {
        id: aiNode.id,
        type: aiNode.type as NodeType,
        data: {
          title: aiNode.title,
          description: aiNode.description,
        },
        parentId: aiNode.parentId || undefined,
        childrenIds: aiNode.childrenIds || [],
      };
    }

    return {
      rootId: suggestedStructure.rootId,
      nodes: finalNodes
    };

  } catch (e) {
    console.error("Failed to suggest flow structure:", e);
    return { // Fallback
      rootId: 'fallback-1',
      nodes: {
        'fallback-1': {
          id: 'fallback-1',
          type: NodeType.GOAL,
          data: { title: goal, description: 'AI suggestion failed, starting with a basic goal.' },
          childrenIds: []
        }
      }
    };
  }
};


const mapToolToDeclaration = (tool: ToolDefinition): FunctionDeclaration => {
  return {
    name: tool.name.replace(/\s+/g, '_').toLowerCase(),
    description: tool.description,
    parameters: {
      type: Type.OBJECT,
      properties: tool.parameters.reduce((acc, param) => {
        acc[param.name] = {
          type: (Type as any)[param.type as keyof typeof Type] || Type.STRING,
          description: param.description
        };
        return acc;
      }, {} as any),
      required: tool.parameters.filter(p => p.required).map(p => p.name)
    }
  };
};