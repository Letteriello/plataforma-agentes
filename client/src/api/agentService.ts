// src/api/agentService.ts
import { AnyAgentConfig } from '@/types/agent';
import { useAgentStore } from '@/store/agentStore';

const SIMULATED_DELAY_MS = 500;

/**
 * Simula um atraso de rede.
 * @param {number} ms - Duração do atraso em milissegundos.
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Salva (cria ou atualiza) uma configuração de agente.
 * @param {AnyAgentConfig} config - A configuração do agente a ser salva.
 * @returns {Promise<AnyAgentConfig>} Uma promessa que resolve com a configuração do agente salva.
 */
export const saveAgent = async (config: AnyAgentConfig): Promise<AnyAgentConfig> => {
  await delay(SIMULATED_DELAY_MS);

  const { addAgent, updateAgent } = useAgentStore.getState();
  let savedConfig = { ...config };

  if (config.id && config.id !== '') {
    updateAgent(savedConfig);
  } else {
    savedConfig.id = crypto.randomUUID();
    addAgent(savedConfig);
  }
  return savedConfig;
};

/**
 * Deleta um agente.
 * @param {string} agentId - O ID do agente a ser deletado.
 * @returns {Promise<void>}
 */
export const deleteAgent = async (agentId: string): Promise<void> => {
  await delay(SIMULATED_DELAY_MS);
  const { removeAgent } = useAgentStore.getState();
  removeAgent(agentId);
};

/**
 * Busca todos os agentes.
 * @returns {Promise<AnyAgentConfig[]>} Uma promessa que resolve com a lista de todos os agentes.
 */
export const fetchAgents = async (): Promise<AnyAgentConfig[]> => {
  await delay(SIMULATED_DELAY_MS / 2);
  const { agents } = useAgentStore.getState();
  return [...agents];
};
