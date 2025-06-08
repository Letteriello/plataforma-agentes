/**
 * Esquema para parâmetros e tipos de retorno de ferramentas
 */
export interface SchemaDefinition {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'integer' | 'null';
  description?: string;
  format?: string;
  enum?: Array<string | number | boolean | null>;
  items?: SchemaDefinition;
  properties?: Record<string, SchemaDefinition>;
  required?: string[];
  additionalProperties?: boolean | SchemaDefinition;
  minItems?: number;
  maxItems?: number;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number | boolean;
  exclusiveMaximum?: number | boolean;
  pattern?: string;
  default?: any;
  [key: string]: any; // Para propriedades adicionais
}

/**
 * Definição de uma ferramenta que o agente pode usar
 */
export interface ToolDefinition {
  /** Nome único da ferramenta */
  name: string;
  
  /** Descrição clara do que a ferramenta faz */
  description: string;
  
  /** Esquema dos parâmetros da ferramenta */
  parameters: {
    type: 'object';
    properties: Record<string, SchemaDefinition>;
    required?: string[];
    additionalProperties?: boolean;
  };
  
  /** Função que será chamada quando a ferramenta for invocada */
  execute: (params: Record<string, any>) => Promise<any>;
  
  /** Esquema de saída da ferramenta (opcional) */
  outputSchema?: SchemaDefinition;
}

/**
 * Configurações de geração de conteúdo para o modelo de linguagem
 */
export interface GenerateContentConfig {
  /** Controla a aleatoriedade (0.0 a 1.0) */
  temperature?: number;
  
  /** Número máximo de tokens a serem gerados */
  maxOutputTokens?: number;
  
  /** Amostragem de núcleo (0.0 a 1.0) */
  topP?: number;
  
  /** Número de tokens mais prováveis a serem considerados */
  topK?: number;
  
  /** Sequências que, se geradas, farão o modelo parar */
  stopSequences?: string[];
  
  /** Penalidade por frequência de tokens */
  frequencyPenalty?: number;
  
  /** Penalidade por presença de tokens */
  presencePenalty?: number;
  
  /** Viés de logit para tokens específicos */
  logitBias?: Record<string, number>;
  
  /** Configurações de segurança */
  safetySettings?: Array<{
    category: string;
    threshold: 'BLOCK_NONE' | 'BLOCK_ONLY_HIGH' | 'BLOCK_MEDIUM_AND_ABOVE' | 'BLOCK_LOW_AND_ABOVE';
  }>;
}

/**
 * Configuração principal de um agente LLM no Google ADK
 */
export interface LlmAgentConfig {
  /** Identificador único do agente */
  name: string;
  
  /** Modelo de linguagem a ser usado (ex: "gemini-2.0-flash") */
  model: string;
  
  /** Descrição clara do propósito e capacidades do agente */
  description: string;
  
  /** 
   * Instruções detalhadas para o agente
   * Pode incluir personalidade, restrições e diretrizes de comportamento
   */
  instruction: string;
  
  /** Ferramentas que o agente pode utilizar */
  tools?: ToolDefinition[];
  
  /** Configurações de geração de conteúdo */
  generateContentConfig?: GenerateContentConfig;
  
  /** Esquema de entrada esperado pelo agente (opcional) */
  inputSchema?: SchemaDefinition;
  
  /** Esquema de saída do agente (opcional) */
  outputSchema?: SchemaDefinition;
  
  /** Chave de saída a ser usada (útil para respostas estruturadas) */
  outputKey?: string;
  
  /** Configuração de como incluir o histórico de contexto */
  includeContents?: 'default' | 'none' | 'all';
  
  /** Referência para um planejador (opcional) */
  planner?: string;
  
  /** Referência para um executor de código (opcional) */
  codeExecutor?: string;
}

/**
 * Agente de fluxo de trabalho que gerencia múltiplos agentes
 */
export interface WorkflowAgentConfig {
  /** Identificador único do fluxo de trabalho */
  id: string;
  
  /** Nome amigável do fluxo de trabalho */
  name: string;
  
  /** Descrição do fluxo de trabalho */
  description: string;
  
  /** Lista de agentes que compõem o fluxo de trabalho */
  agents: Array<{
    /** Referência ao ID do agente */
    agentId: string;
    
    /** Ordem de execução (opcional, pode ser determinado pelo fluxo) */
    order?: number;
    
    /** Condição para execução (opcional) */
    condition?: string;
  }>;
  
  /** Configurações específicas do fluxo de trabalho */
  settings?: {
    /** Tipo de fluxo de trabalho (sequencial, paralelo, etc.) */
    type: 'sequential' | 'parallel' | 'conditional';
    
    /** Máximo de execuções paralelas (para fluxos paralelos) */
    maxConcurrent?: number;
    
    /** Política de retentativa (opcional) */
    retryPolicy?: {
      maxAttempts: number;
      initialDelayMs: number;
      maxDelayMs: number;
      multiplier: number;
    };
  };
}
