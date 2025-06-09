import { AnyAgentConfig } from '@/types';
import { mockInitialAgents } from '@/data/mocks/mock-initial-agents';

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

let agentsData: AnyAgentConfig[] = [...mockInitialAgents];

export const agentService: IAgentService = {
  async fetchAgents() {
    await delay(SIMULATED_DELAY_MS);
    return [...agentsData];
  },

  async fetchAgentById(agentId: string) {
    await delay(SIMULATED_DELAY_MS);
    const found = agentsData.find(a => a.id === agentId);
    if (!found) throw new Error('Agent not found');
    return { ...found };
  },

  async saveAgent(config: AnyAgentConfig) {
    await delay(SIMULATED_DELAY_MS);
    let saved = { ...config };
    if (config.id && agentsData.some(a => a.id === config.id)) {
      agentsData = agentsData.map(a => (a.id === config.id ? saved : a));
    } else {
      saved.id = saved.id && saved.id !== '' ? saved.id : crypto.randomUUID();
      agentsData.push(saved);
    }
    return saved;
  },

  async deleteAgent(agentId: string) {
    await delay(SIMULATED_DELAY_MS);
    agentsData = agentsData.filter(a => a.id !== agentId);
  },
};

export const __resetAgents = (agents: AnyAgentConfig[] = mockInitialAgents) => {
  agentsData = [...agents];
};

export default agentService;
