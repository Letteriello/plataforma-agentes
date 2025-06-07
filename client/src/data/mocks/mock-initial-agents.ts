import { AnyAgentConfig, AgentType } from '@/types/agent'; // Ajuste o caminho se necessário

export const mockInitialAgents: AnyAgentConfig[] = [
  {
    id: 'agent_llm_1',
    name: 'Agente de Chat Simples',
    type: AgentType.LLM,
    instruction: 'Você é um assistente amigável que responde a perguntas.',
    model: 'gpt-3.5-turbo',
    tools: ['web_search'],
    code_execution: false,
    planning_enabled: false,
  },
  {
    id: 'agent_llm_2',
    name: 'Gerador de Código Python',
    type: AgentType.LLM,
    instruction: 'Escreva scripts Python com base nas solicitações do usuário. Use as ferramentas disponíveis se necessário.',
    model: 'gpt-4',
    tools: ['code_interpreter'],
    code_execution: true,
    planning_enabled: true,
  },
  {
    id: 'agent_seq_1',
    name: 'Workflow de Pesquisa e Resumo',
    type: AgentType.Sequential,
    agents: [
      // Mock de sub-agentes pode ser mais simples aqui ou referenciar IDs que seriam resolvidos depois
      // Por enquanto, vamos deixar vazio ou com mocks simples.
      // Para um mock mais completo, os sub-agentes também seriam AnyAgentConfig.
      // Exemplo:
      // { id: 'sub_search', name: 'Pesquisador Web (sub)', type: AgentType.LLM, instruction: 'Busque X', model: 'gpt-3.5-turbo' },
      // { id: 'sub_summarize', name: 'Sumarizador (sub)', type: AgentType.LLM, instruction: 'Resuma o texto fornecido', model: 'gpt-3.5-turbo' }
    ],
  },
];
