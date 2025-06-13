// Arquivo: client/src/types/tools/tool.types.ts

/**
 * Parâmetro de uma ferramenta.
 */
export interface ToolParameterDTO {
  name: string;
  description: string | null;
  type: string; // ex: 'string', 'number', 'boolean'
  required: boolean;
  options?: string[]; // Para tipos enum ou select
  default_value?: any;
}

/**
 * Definição de uma ferramenta para a UI, pode incluir informações adicionais
 * que não vêm diretamente do backend DTO.
 */
export interface UiToolDefinition extends ToolDTO {
  // Campos adicionais específicos da UI, se houver
  // Por exemplo, um ícone ou uma categoria
  icon?: string;
  category?: string;
}

/**
 * Data Transfer Object (DTO) para uma ferramenta, como recebido do backend.
 */
export interface ToolDTO {
  id: string;
  name: string;
  description: string | null;
  parameters: ToolParameterDTO[];
  tags?: string[];
  owner_id?: string; // ID do usuário proprietário
  is_public: boolean; // Se a ferramenta é pública
  is_system_tool?: boolean; // Se é uma ferramenta do sistema (não editável/excluível pelo usuário comum)
  version: string; // Versão da ferramenta
  created_at: string; // Timestamp de criação
  updated_at: string; // Timestamp da última atualização
}

/**
 * DTO para uma lista paginada de ferramentas.
 */
export interface PaginatedToolsDTO {
  items: ToolDTO[];
  total: number;
  page: number;
  size: number;
  pages: number;
}
