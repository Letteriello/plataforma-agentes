// client/src/types/agents.ts

// UI-specific Schema Definition (simplified for forms, can be expanded)
export interface UiSchemaDefinition {
  type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'OBJECT' | 'ARRAY';
  description?: string;
  default?: any; // Can be string, number, boolean for primitive types
  enum?: any[]; // Array of allowed values of the specified type
  // For OBJECT type
  properties?: { [key: string]: UiSchemaDefinition }; // Recursive definition for nested objects
  // For ARRAY type
  items?: UiSchemaDefinition; // Definition for items if type is ARRAY
  // required?: string[]; // For object properties, if needed at this level
}

// UI-specific Tool Definition (for forms)
export interface UiToolDefinition {
  name: string;
  description?: string;
  parameters?: {
    [key: string]: UiSchemaDefinition; // Key is parameter name
  };
  required?: string[]; // List of required parameter names
  // outputSchema?: UiSchemaDefinition; // Future: For defining the tool's output structure
}

// Potentially other agent-related types can be added here later,
// e.g., LlmAgentConfig, AgentIdentity, GenerationSettings, SafetySettings, etc.
// consistent with Google ADK.
