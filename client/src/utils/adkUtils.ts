import { LlmAgentConfig, ToolDefinition, GenerateContentConfig, SchemaDefinition } from '@/types/adk';

/**
 * Converte os dados do formulário para o formato esperado pelo Google ADK
 */
export function formatAgentForAdk(formData: any): LlmAgentConfig {
  // Extrai as configurações de geração de conteúdo
  const generateContentConfig: GenerateContentConfig = {
    temperature: formData.temperature,
    maxOutputTokens: formData.maxOutputTokens,
    topP: formData.topP,
    topK: formData.topK,
    stopSequences: formData.stopSequences?.split('\n').filter(Boolean),
    frequencyPenalty: formData.frequencyPenalty,
    presencePenalty: formData.presencePenalty,
    logitBias: formData.logitBias,
    safetySettings: formData.safetySettings?.map((s: any) => ({
      category: s.category,
      threshold: s.threshold,
    })),
  };

  // Formata as ferramentas para o formato ADK
  const tools: ToolDefinition[] = formData.tools?.map((tool: any) => ({
    name: tool.name,
    description: tool.description,
    parameters: {
      type: 'object',
      properties: tool.parameters.reduce((acc: Record<string, any>, param: any) => {
        acc[param.name] = {
          type: param.type,
          description: param.description,
          ...(param.required !== undefined && { required: param.required }),
          ...(param.default !== undefined && { default: param.default }),
        };
        return acc;
      }, {}),
      required: tool.parameters
        .filter((param: any) => param.required)
        .map((param: any) => param.name),
    },
    // Esta função seria implementada para chamar a ferramenta real
    execute: async (params: Record<string, any>) => {
      console.log(`Executing tool ${tool.name} with params:`, params);
      // Implementação real da chamada da ferramenta
      return { result: 'Tool executed successfully' };
    },
  })) || [];

  // Constrói o objeto de configuração do agente
  const agentConfig: LlmAgentConfig = {
    name: formData.name,
    model: formData.model,
    description: formData.description,
    instruction: formData.instruction,
    tools,
    generateContentConfig,
    inputSchema: formData.inputSchema ? JSON.parse(formData.inputSchema) : undefined,
    outputSchema: formData.outputSchema ? JSON.parse(formData.outputSchema) : undefined,
    outputKey: formData.outputKey,
    includeContents: formData.includeContents,
    planner: formData.planner,
    codeExecutor: formData.codeExecutor,
  };

  return agentConfig;
}

/**
 * Valida a configuração do agente antes de enviar para o ADK
 */
export function validateAgentConfig(config: LlmAgentConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!config.name?.trim()) {
    errors.push('O nome do agente é obrigatório');
  }

  if (!config.model?.trim()) {
    errors.push('O modelo do agente é obrigatório');
  }

  if (!config.description?.trim()) {
    errors.push('A descrição do agente é obrigatória');
  }

  if (!config.instruction?.trim()) {
    errors.push('As instruções do agente são obrigatórias');
  }

  // Valida as ferramentas
  config.tools?.forEach((tool, index) => {
    if (!tool.name?.trim()) {
      errors.push(`Ferramenta ${index + 1}: O nome é obrigatório`);
    }
    
    if (!tool.description?.trim()) {
      errors.push(`Ferramenta ${tool.name || index + 1}: A descrição é obrigatória`);
    }
    
    // Valida os parâmetros da ferramenta
    Object.entries(tool.parameters?.properties || {}).forEach(([paramName, paramDef]) => {
      if (!paramDef.type) {
        errors.push(`Ferramenta ${tool.name}: O tipo do parâmetro '${paramName}' é obrigatório`);
      }
      
      if (!paramDef.description?.trim()) {
        errors.push(`Ferramenta ${tool.name}: A descrição do parâmetro '${paramName}' é obrigatória`);
      }
    });
  });

  // Valida os esquemas de entrada/saída
  if (config.inputSchema) {
    try {
      JSON.parse(JSON.stringify(config.inputSchema));
    } catch (error) {
      errors.push('O esquema de entrada não é um JSON válido');
    }
  }

  if (config.outputSchema) {
    try {
      JSON.parse(JSON.stringify(config.outputSchema));
    } catch (error) {
      errors.push('O esquema de saída não é um JSON válido');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Cria um objeto de configuração padrão para um novo agente
 */
export function createDefaultAgentConfig(): LlmAgentConfig {
  return {
    name: '',
    model: 'gemini-2.0-flash',
    description: '',
    instruction: '',
    tools: [],
    generateContentConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
      topP: 1,
      topK: 40,
    },
    includeContents: 'default',
  };
}

/**
 * Cria uma definição de ferramenta padrão
 */
export function createDefaultToolDefinition(): ToolDefinition {
  return {
    name: '',
    description: '',
    parameters: {
      type: 'object',
      properties: {},
      required: [],
    },
    execute: async () => ({}),
  };
}

/**
 * Cria uma definição de parâmetro padrão
 */
export function createDefaultParameterDefinition(): any {
  return {
    name: '',
    type: 'string',
    description: '',
    required: true,
  };
}

/**
 * Converte um esquema para uma string JSON formatada
 */
export function schemaToString(schema: SchemaDefinition | undefined): string {
  if (!schema) return '';
  return JSON.stringify(schema, null, 2);
}

/**
 * Converte uma string JSON para um esquema
 */
export function stringToSchema(jsonString: string): SchemaDefinition | undefined {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Erro ao converter string para esquema:', error);
    return undefined;
  }
}
