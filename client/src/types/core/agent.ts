import { Tool, ToolParameter } from './tool'

/**
 * Base interface for all agent configurations
 * Follows Google ADK and A2A Protocol specifications
 */
export interface AgentConfig {
  // Core Identification
  id: string // Unique identifier for the agent
  name: string // Display name for the agent
  description?: string // Human-readable description of the agent's purpose
  version: string // Version of the agent (e.g., "1.0.0")
  type: AgentType // Type of the agent

  // A2A Protocol Support
  capabilities?: AgentCapabilities // Optional capabilities supported by the agent
  securitySchemes?: SecurityScheme[] // Authentication and security requirements

  // Metadata
  iconUrl?: string // URL to an icon for the agent
  provider?: AgentProvider // Information about the provider
  documentationUrl?: string // Link to documentation
}

/**
 * Agent Capabilities
 * Defines what the agent can do and how it can be interacted with
 */
export interface AgentCapabilities {
  inputModes?: string[] // Supported input modes (e.g., ["text", "audio", "image"])
  outputModes?: string[] // Supported output modes
  supportsStreaming?: boolean // Whether the agent supports streaming responses
  supportsMultiTurn?: boolean // Whether the agent supports multi-turn conversations
  supportsFiles?: boolean // Whether the agent can handle file uploads
  maxFileSize?: number // Maximum file size in bytes
  supportedFileTypes?: string[] // List of supported file MIME types
}

/**
 * Security Scheme for agent authentication
 */
export interface SecurityScheme {
  type: 'apiKey' | 'oauth2' | 'bearer' | 'basic'
  name: string
  description?: string
  in: 'header' | 'query' | 'cookie'
  scheme?: string
  bearerFormat?: string
  flows?: any // OAuth2 flows
}

/**
 * Agent Provider Information
 */
export interface AgentProvider {
  name: string
  url?: string
  email?: string
}

/**
 * Enum for different agent types based on Google ADK
 */
export enum AgentType {
  // Core Agent Types
  LLM = 'llm', // Standard LLM-based agent
  WORKFLOW = 'workflow', // Workflow agent (sequential, parallel, etc.)
  TOOL = 'tool', // Tool agent (wraps a specific tool)

  // Workflow Agent Subtypes
  SEQUENTIAL = 'sequential', // Sequential workflow agent
  PARALLEL = 'parallel', // Parallel workflow agent
  LOOP = 'loop', // Loop workflow agent

  // Specialized Agent Types
  A2A = 'a2a', // A2A Protocol compliant agent
  REACT = 'react', // ReAct agent
  PLANNER = 'planner', // Planning agent
  EXECUTOR = 'executor', // Execution agent
  SUPERVISOR = 'supervisor', // Supervisor/Orchestrator agent
}

/**
 * LLM Agent Configuration
 * For agents powered by large language models
 */
export interface LlmAgentConfig extends AgentConfig {
  type: AgentType.LLM

  // Core Configuration
  model: string // Model identifier (e.g., "gemini-2.0-flash")
  instruction: string // System prompt/instruction for the agent

  // Generation Parameters
  temperature?: number // Default: 0.7
  maxOutputTokens?: number // Maximum tokens to generate
  topP?: number // Nucleus sampling parameter
  topK?: number // Top-k sampling parameter

  // Advanced Features
  tools?: Tool[] // Tools available to the agent
  codeExecution?: boolean // Whether code execution is enabled
  planningEnabled?: boolean // Whether planning is enabled

  // Safety and Moderation
  safetySettings?: SafetySetting[] // Content safety settings

  // Data Structuring
  inputSchema?: object // JSON Schema for input validation
  outputSchema?: object // JSON Schema for output validation
  outputKey?: string // Key to extract from the response

  // Context Management
  includeContents?: 'default' | 'none' // How to include context

  // Advanced
  planner?: any // Planner configuration
  codeExecutor?: any // Code executor configuration
}

/**
 * Base workflow agent type that all workflow agents must extend
 */
type BaseWorkflowAgent = AgentConfig & {
  workflowType: 'sequential' | 'parallel' | 'loop'
}

/**
 * Sequential Workflow Agent Configuration
 * Executes agents one after another
 */
export interface SequentialAgentConfig extends BaseWorkflowAgent {
  type: AgentType.SEQUENTIAL
  workflowType: 'sequential'
  agents: AnyAgentConfig[]
  maxIterations?: number
  stopCondition?: string
  continueOnError?: boolean
  errorHandler?: AnyAgentConfig
}

/**
 * Parallel Workflow Agent Configuration
 * Executes agents in parallel
 */
export interface ParallelAgentConfig extends BaseWorkflowAgent {
  type: AgentType.PARALLEL
  workflowType: 'parallel'
  agents: AnyAgentConfig[]
  maxConcurrent?: number
  continueOnError?: boolean
  errorHandler?: AnyAgentConfig
}

/**
 * Loop Workflow Agent Configuration
 * Executes an agent in a loop
 */
export interface LoopAgentConfig extends BaseWorkflowAgent {
  type: AgentType.LOOP
  workflowType: 'loop'
  agent: AnyAgentConfig
  maxIterations: number
  condition?: string
  continueOnError?: boolean
  errorHandler?: AnyAgentConfig
}

/**
 * Union type for workflow agents
 */
export type WorkflowAgentConfig =
  | SequentialAgentConfig
  | ParallelAgentConfig
  | LoopAgentConfig

/**
 * A2A Protocol Agent Configuration
 * For agents that communicate using the Agent-to-Agent Protocol
 */
export interface A2AAgentConfig extends AgentConfig {
  type: AgentType.A2A

  // A2A Protocol Configuration
  endpoint: string // Base URL for A2A API
  version: string // A2A Protocol version (e.g., "1.0.0")

  // Authentication
  authType?: 'none' | 'api_key' | 'oauth2' | 'bearer'
  authConfig?: {
    apiKey?: string
    tokenUrl?: string
    clientId?: string
    clientSecret?: string
    scopes?: string[]
  }

  // Capabilities
  supportsPush?: boolean // Whether the agent supports push notifications
  supportedFormats?: string[] // Supported message formats
}

/**
 * Safety Setting for content moderation
 */
export interface SafetySetting {
  category:
    | 'HARM_CATEGORY_HARASSMENT'
    | 'HARM_CATEGORY_HATE_SPEECH'
    | 'HARM_CATEGORY_SEXUALLY_EXPLICIT'
    | 'HARM_CATEGORY_DANGEROUS_CONTENT'
  threshold:
    | 'BLOCK_NONE'
    | 'BLOCK_ONLY_HIGH'
    | 'BLOCK_MEDIUM_AND_ABOVE'
    | 'BLOCK_LOW_AND_ABOVE'
}

/**
 * Union type for any agent configuration
 */
export type AnyAgentConfig =
  | LlmAgentConfig
  | WorkflowAgentConfig
  | SequentialAgentConfig
  | ParallelAgentConfig
  | LoopAgentConfig
  | A2AAgentConfig

/**
 * Helper type for agent cards (A2A Protocol)
 */
export interface AgentCard {
  name: string
  description: string
  version: string
  url: string
  iconUrl?: string
  provider?: AgentProvider
  capabilities: AgentCapabilities
  securitySchemes?: SecurityScheme[]
  defaultInputModes: string[]
  defaultOutputModes: string[]
  skills: AgentSkill[]
  supportsAuthenticatedExtendedCard?: boolean
}

/**
 * Agent Skill (A2A Protocol)
 */
export interface AgentSkill {
  name: string
  description: string
  inputSchema?: object
  outputSchema?: object
  parameters?: ToolParameter[]
}

/**
 * Helper function to create a default agent configuration
 */
export function createDefaultAgentConfig(type: AgentType): AnyAgentConfig {
  const baseConfig: Partial<AgentConfig> = {
    id: `agent-${Date.now()}`,
    name: 'Novo Agente',
    description: 'Descrição do agente',
    version: '1.0.0',
    type,
  }

  switch (type) {
    case AgentType.LLM:
      return {
        ...baseConfig,
        type: AgentType.LLM,
        model: 'gemini-1.5-pro',
        instruction: 'Você é um assistente útil.',
        temperature: 0.7,
        tools: [],
      } as LlmAgentConfig

    case AgentType.SEQUENTIAL:
      return {
        ...baseConfig,
        type: AgentType.SEQUENTIAL,
        workflowType: 'sequential',
        agents: [],
      } as SequentialAgentConfig

    case AgentType.PARALLEL:
      return {
        ...baseConfig,
        type: AgentType.PARALLEL,
        workflowType: 'parallel',
        agents: [],
        maxConcurrent: 3,
      } as ParallelAgentConfig

    case AgentType.LOOP:
      return {
        ...baseConfig,
        type: AgentType.LOOP,
        workflowType: 'loop',
        agents: [],
        maxIterations: 5,
      } as unknown as LoopAgentConfig

    case AgentType.A2A:
      return {
        ...baseConfig,
        type: AgentType.A2A,
        endpoint: 'https://api.example.com/a2a',
        version: '1.0.0',
        authType: 'none',
      } as A2AAgentConfig

    default:
      throw new Error(`Unsupported agent type: ${type}`)
  }
}
