import { useAgentStore } from "@/store/agentStore";
import { AnyAgentConfig } from '@/types';

export interface IAgentService {
  /** Retorna a lista de agentes */
  fetchAgents(): Promise<AnyAgentConfig[]>;
  /** Busca um agente pelo id */
  fetchAgentById(agentId: string): Promise<AnyAgentConfig>;
  /** Salva (cria ou atualiza) um agente */
  saveAgent(config: AnyAgentConfig): Promise<AnyAgentConfig>;
  /** Remove um agente */
  deleteAgent(agentId: string): Promise<void>;
}

const SIMULATED_DELAY_MS = 300;
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const agentService: IAgentService = {
  async fetchAgents() {
    await delay(SIMULATED_DELAY_MS);
    const { agents } = useAgentStore.getState();
    return [...agents];
  },

  async fetchAgentById(agentId: string) {
    await delay(SIMULATED_DELAY_MS);
    const { agents } = useAgentStore.getState();
    const found = agents.find(a => a.id === agentId);
    if (!found) throw new Error('Agent not found');
    return found;
  },

  async saveAgent(config: AnyAgentConfig) {
    await delay(SIMULATED_DELAY_MS);
    const { addAgent, updateAgent } = useAgentStore.getState();
    let saved = { ...config };
    if (config.id && config.id !== '') {
      updateAgent(saved);
    } else {
      saved.id = crypto.randomUUID();
      addAgent(saved);
    }
    return saved;
  },

  async deleteAgent(agentId: string) {
    await delay(SIMULATED_DELAY_MS);
    const { removeAgent } = useAgentStore.getState();
    removeAgent(agentId);
  },
};

export default agentService;
