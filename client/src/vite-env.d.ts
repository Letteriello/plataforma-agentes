/// <reference types="vite/client" />
/// <reference types="@testing-library/react" />
/// <reference types="@storybook/react" />
declare module 'react-hook-form';
declare module '@hookform/resolvers/zod';

declare module '@/types/agents' {
  export interface LLMAgent {
    id: string;
    name: string;
    model: string;
    // Add other required properties
  }
  
  export interface LlmAgentConfig {
    id: string;
    name: string;
    isPublic: boolean;
    tools?: UiToolDefinition[];
    knowledgeBaseIds?: string[];
    temperature?: number;
    maxTokens?: number;
    // Other required properties
  }
}

declare module '@/types/dashboard' {
  export type AgentStatus = 'online'|'offline'|'pending'|'error';
  export interface Activity {
    // Activity properties
  }
  export interface AgentActivityData {
    // Agent activity data properties
  }
  export interface DashboardStats {
    // Dashboard stats properties
  }
}

declare module '@/api/agentService' {
  export interface AgentDetailDTO {
    id: string;
    created_at: string;
    updated_at: string;
    user_id: string;
    tools?: ToolDTO[];
    knowledgeBaseIds?: string[];
    // Other required properties
  }
  
  export interface AgentSummaryDTO {
    id: string;
    name: string;
    status: 'online'|'offline'|'pending';
    // Add other summary properties
  }
  
  export function createAgent(agent: AgentDetailDTO): Promise<AgentDetailDTO>;
  export function deleteAgent(id: string): Promise<void>;
}

declare module '@/api/toolService' {
  export interface Tool {
    id: string;
    name: string;
    description?: string;
    // Add other tool properties
  }

  export type ToolType = 'function'|'api'|'plugin';
  
  export interface ToolDTO extends Tool {
    parameters?: Record<string, any>;
    // Additional DTO properties
  }
  
  export interface CreateToolDTO {
    // Create tool properties
  }
  
  export interface UpdateToolDTO {
    // Update tool properties
  }
  
  export function createTool(tool: CreateToolDTO): Promise<ToolDTO>;
  export function updateTool(id: string, tool: UpdateToolDTO): Promise<ToolDTO>;
}
