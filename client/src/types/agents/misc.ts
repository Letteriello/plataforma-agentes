import { z } from 'zod'

// Esquema para a definição de uma ferramenta que um agente pode usar.
export const ToolSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  parameters: z.array(z.object({
    name: z.string(),
    type: z.string(),
    description: z.string(),
    required: z.boolean(),
  })),
  returns: z.string(),
});

export type Tool = z.infer<typeof ToolSchema>;

// Esquema para a ferramenta no contexto de um formulário da UI.
export const FormToolSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'O nome da ferramenta é obrigatório'),
  description: z.string().min(1, 'A descrição é obrigatória'),
  argument_schema: z.record(z.any()).optional(),
  return_type: z.string().optional(),
});

export type FormTool = z.infer<typeof FormToolSchema>;

// Esquema para as configurações de segurança, alinhado com a API do Gemini.
export const SafetySettingSchema = z.object({
  category: z.enum([
    'HARM_CATEGORY_HARASSMENT',
    'HARM_CATEGORY_HATE_SPEECH',
    'HARM_CATEGORY_SEXUALLY_EXPLICIT',
    'HARM_CATEGORY_DANGEROUS_CONTENT',
  ]),
  threshold: z.enum([
    'BLOCK_NONE',
    'BLOCK_ONLY_HIGH',
    'BLOCK_MEDIUM_AND_ABOVE',
    'BLOCK_LOW_AND_ABOVE',
  ]),
});

export type SafetySetting = z.infer<typeof SafetySettingSchema>;
