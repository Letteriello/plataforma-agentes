// Base interface for all agent configurations
export interface AgentConfig {
  id: string; // Unique identifier for the agent
  name: string; // Display name for the agent
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
  // Add other LLM-specific parameters here, e.g., temperature, top_p
}

// Interface for Sequential Agent configuration
export interface SequentialAgentConfig extends AgentConfig {
  type: AgentType.Sequential;
  agents: AgentConfig[]; // List of agents to run in sequence
}

// Interface for Parallel Agent configuration
export interface ParallelAgentConfig extends AgentConfig {
  type: AgentType.Parallel;
  agents: AgentConfig[]; // List of agents to run in parallel
}

// Interface for Loop Agent configuration
export interface LoopAgentConfig extends AgentConfig {
  type: AgentType.Loop;
  agent: AgentConfig; // The agent to run in a loop
  max_iterations?: number; // Optional maximum number of iterations
}

// Union type for any agent configuration
export type AnyAgentConfig = LlmAgentConfig | SequentialAgentConfig | ParallelAgentConfig | LoopAgentConfig;

// Interface for a tool that can be used by an agent
export interface Tool {
  id: string;
  name: string;
  description: string;
  // Parameters specific to the tool, if any
  // Example: parameters: { [key: string]: any };
}

// Interface for an agent definition that might include tools
export interface AgentWithToolsConfig extends AgentConfig {
  tools?: Tool[]; // Optional list of tools
  // mcp_tools?: any[]; // Placeholder for MCP Tools if they have a different structure
}

// Example of extending LlmAgentConfig to include tools
export interface LlmAgentWithToolsConfig extends LlmAgentConfig, AgentWithToolsConfig {}

// You might want to create more specific types like these as you flesh out the application:
// export type AnyAgentWithToolsConfig = LlmAgentWithToolsConfig | ... ;
