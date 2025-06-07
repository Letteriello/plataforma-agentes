import { AnyAgentConfig } from '@/types/agent';
import { useAgentStore } from '@/store/agentStore';

const SIMULATED_DELAY_MS = 500;

/**
 * Simula um atraso de rede.
 * @param ms - Duração do atraso em milissegundos.
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Salva (cria ou atualiza) uma configuração de agente.
 * Interage diretamente com o store Zustand para simular um backend.
 * @param config - A configuração do agente a ser salva.
 * @returns Uma promessa que resolve com a configuração do agente salva (incluindo ID se for novo).
 */
export const saveAgent = async (config: AnyAgentConfig): Promise<AnyAgentConfig> => {
  await delay(SIMULATED_DELAY_MS);

  const { addAgent, updateAgent } = useAgentStore.getState();
  let savedConfig = { ...config };

  // Simular um erro aleatório (descomente para testar)
  // if (Math.random() < 0.2) {
  //   console.error("Simulated API Error: Failed to save agent");
  //   throw new Error("Falha simulada ao salvar o agente.");
  // }

  if (config.id && config.id !== '') { // Se tem ID, é uma atualização
    updateAgent(savedConfig);
  } else { // Sem ID ou ID vazio, é um novo agente
    savedConfig.id = crypto.randomUUID(); // Gerar ID para novo agente
    addAgent(savedConfig);
  }
  console.log('Agent saved (mock API):', savedConfig);
  return savedConfig;
};

/**
 * Deleta um agente.
 * Interage diretamente com o store Zustand.
 * @param agentId - O ID do agente a ser deletado.
 * @returns Uma promessa que resolve quando a operação é concluída.
 */
export const deleteAgent = async (agentId: string): Promise<void> => {
  await delay(SIMULATED_DELAY_MS);

  // Simular um erro aleatório (descomente para testar)
  // if (Math.random() < 0.2) {
  //   console.error("Simulated API Error: Failed to delete agent");
  //   throw new Error("Falha simulada ao deletar o agente.");
  // }

  const { removeAgent } = useAgentStore.getState();
  removeAgent(agentId);
  console.log('Agent deleted (mock API):', agentId);
};

/**
 * Busca todos os agentes.
 * Retorna os agentes diretamente do store Zustand.
 * @returns Uma promessa que resolve com a lista de todos os agentes.
 */
export const fetchAgents = async (): Promise<AnyAgentConfig[]> => {
  await delay(SIMULATED_DELAY_MS / 2); // Menor delay para fetch
  const { agents } = useAgentStore.getState();
  console.log('Agents fetched (mock API):', agents);
  return [...agents]; // Retornar uma cópia para simular imutabilidade da API
};

// Poderia adicionar fetchAgentById(agentId) se necessário no futuro.
