import { Tool } from "./tool";
// Base interface for all agent configurations
export interface AgentConfig {
  id: string; // Unique identifier for the agent
  name: string; // Display name for the agent
  description?: string; // Optional description for the agent
  type: AgentType; // Type of the agent
}

// Enum for different agent types
export enum AgentType {
  LLM = 'LlmAgent',
  Sequential = 'SequentialAgent',
  Parallel = 'ParallelAgent',
  Loop = 'LoopAgent',
  // Add other agent types as needed
}

// Interface for LLM Agent configuration
export interface LlmAgentConfig extends AgentConfig {
  type: AgentType.LLM;
  instruction: string;
  model: string;
  // Generation parameters
  temperature?: number;
  maxOutputTokens?: number;
  topP?: number;
  topK?: number;
  code_execution?: boolean;
  planning_enabled?: boolean;
  tools?: string[]; // <--- Adicionar esta linha
  // Add other LLM-specific parameters here, e.g., temperature, top_p
}

// Interface for Sequential Agent configuration
export interface SequentialAgentConfig extends AgentConfig {
  type: AgentType.Sequential;
  agents: AnyAgentConfig[]; // <--- Corrigido para AnyAgentConfig[]
}

// Interface for Parallel Agent configuration
export interface ParallelAgentConfig extends AgentConfig {
  type: AgentType.Parallel;
  agents: AnyAgentConfig[]; // <--- Corrigido para AnyAgentConfig[]
}

// Interface for Loop Agent configuration
export interface LoopAgentConfig extends AgentConfig {
  type: AgentType.Loop;
  agent: AnyAgentConfig; // <--- Corrigido para AnyAgentConfig (um único agente, mas pode ser qualquer tipo)
  max_iterations?: number; // Optional maximum number of iterations
}

// Helper type for agents that contain other agents (workflows)
export interface WorkflowAgentConfig extends AgentConfig {
  agents: AnyAgentConfig[];
}

// Union type for any agent configuration
export type AnyAgentConfig = LlmAgentConfig | SequentialAgentConfig | ParallelAgentConfig | LoopAgentConfig;

// Interface for an agent definition that might include tools
export interface AgentWithToolsConfig extends AgentConfig {
  tools?: Tool[]; // Optional list of tools
  // mcp_tools?: any[]; // Placeholder for MCP Tools if they have a different structure
}

// Example of extending LlmAgentConfig to include tools
export interface LlmAgentWithToolsConfig extends LlmAgentConfig, AgentWithToolsConfig {}

// You might want to create more specific types like these as you flesh out the application:
// export type AnyAgentWithToolsConfig = LlmAgentWithToolsConfig | ... ;
