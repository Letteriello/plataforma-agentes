// Arquivo: client/src/types/tools/index.ts

export type {
  PaginatedToolsDTO,
  ToolDTO,
  ToolParameterDTO,
  UiToolDefinition,
} from './tool.types';
export * from './tool.types';

// Mocks temporários para ToolSchema/ToolDTOSchema
export const ToolSchema = {} as Record<string, never>;
export const ToolDTOSchema = {} as Record<string, never>;
