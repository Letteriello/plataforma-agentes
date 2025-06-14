// Arquivo: client/src/features/tools/types.ts
// FONTE ÚNICA DA VERDADE PARA TIPOS DE FERRAMENTAS

// --- Enums e Tipos Fundamentais ---

export type ToolType = 'TOOL_CODE' | 'API';

// --- Tipos e Interfaces Core ---

// Define a more specific type for return type schema
export type ReturnTypeSchema = {
  type: 'object' | 'string' | 'number' | 'boolean' | 'array' | 'null';
  properties?: Record<string, ReturnTypeSchema>;
  items?: ReturnTypeSchema;
  required?: string[];
  description?: string;
  format?: string;
  enum?: Array<string | number | boolean | null>;
  default?: unknown;
  [key: string]: unknown;
};

// --- DTOs (Data Transfer Objects) - Contrato com a API Backend ---

export interface ToolParameterDTO {
  id: string; // UUID
  tool_id: string; // UUID
  name: string;
  type: string;
  description?: string | null;
  default_value?: string | null;
  is_required: boolean;
  created_at: string; // ISO datetime string
}

export interface ToolDTO {
  id: string; // UUID
  user_id?: string | null; // UUID, null for system tools
  name: string;
  description?: string | null;
  tool_type: ToolType;
  api_endpoint?: string | null;
  return_type_schema?: ReturnTypeSchema | null;
  is_system_tool: boolean;
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
  parameters: ToolParameterDTO[];
}

export interface PaginatedToolsDTO {
  items: ToolDTO[];
  total: number;
  page: number;
  size: number;
  total_pages: number;
}

export interface ToolParameterCreateDTO {
  name: string;
  type: string;
  description?: string | null;
  default_value?: string | null;
  is_required: boolean;
}

export interface CreateToolDTO {
  name: string;
  description?: string | null;
  tool_type: ToolType;
  api_endpoint?: string | null;
  return_type_schema?: ReturnTypeSchema | null;
  parameters: ToolParameterCreateDTO[];
}

export interface UpdateToolDTO {
  name?: string;
  description?: string | null;
  tool_type?: ToolType;
  api_endpoint?: string | null;
  return_type_schema?: ReturnTypeSchema | null;
  parameters?: ToolParameterCreateDTO[];
}

// --- Tipos Específicos da UI ---

/**
 * Define a estrutura de uma ferramenta para a interface do usuário,
 * incluindo a configuração de seus parâmetros.
 */
export interface UiToolDefinition {
  id: string;
  name: string;
  description: string;
  parameters: {
    [key: string]: {
      type: 'STRING' | 'NUMBER' | 'BOOLEAN';
      description?: string;
      default?: string | number | boolean;
      enum?: (string | number)[];
    };
  };
  required: string[];
}
