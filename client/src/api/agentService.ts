// src/api/agentService.ts
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
 * @param config - A configuração do agente a ser salva.
 * @returns A configuração do agente salva (com id gerado se novo).
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
 * Deleta um agente do store.
 * @param agentId - O ID do agente a ser deletado.
 */
export const deleteAgent = async (agentId: string): Promise<void> => {
  await delay(SIMULATED_DELAY_MS);
  const { removeAgent } = useAgentStore.getState();
  removeAgent(agentId);
};

/**
 * Busca todos os agentes do store.
 * @returns A lista de agentes cadastrados.
 */
export const fetchAgents = async (): Promise<AnyAgentConfig[]> => {
  await delay(SIMULATED_DELAY_MS / 2);
  const { agents } = useAgentStore.getState();
  return [...agents];
};
