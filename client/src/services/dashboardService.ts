import type { Agent, Activity } from '@/store/dashboardStore';

export interface DashboardStats {
  activeAgentsCount: number;
  activeSessions: number;
  totalSessions24h: number;
}

const apiDelay = () => new Promise(resolve => setTimeout(resolve, 500));

export const getDashboardStats = async (): Promise<DashboardStats> => {
  await apiDelay();
  return {
    activeAgentsCount: 5,
    activeSessions: 12,
    totalSessions24h: 147,
  };
};

export const getRecentAgents = async (): Promise<Agent[]> => {
  await apiDelay();
  return [
    { id: '1', name: 'Agente de Vendas', status: 'online', lastActive: new Date().toISOString(), type: 'llm' },
    { id: '2', name: 'Suporte ao Cliente', status: 'busy', lastActive: new Date(Date.now() - 3e5).toISOString(), type: 'workflow' },
    { id: '3', name: 'Análise de Dados', status: 'offline', lastActive: new Date(Date.now() - 7.2e6).toISOString(), type: 'tool' },
  ];
};

export const getRecentActivities = async (): Promise<Activity[]> => {
  await apiDelay();
  return [
    { id: '1', type: 'success', message: 'Novo agente "Análise de Dados" criado com sucesso.', timestamp: new Date().toISOString() },
    { id: '2', type: 'info', message: 'Atualização de sistema agendada para hoje à noite.', timestamp: new Date(Date.now() - 1.8e6).toISOString() },
    { id: '3', type: 'warning', message: 'Alta utilização de CPU no servidor principal.', timestamp: new Date(Date.now() - 7.2e6).toISOString() },
  ];
};
