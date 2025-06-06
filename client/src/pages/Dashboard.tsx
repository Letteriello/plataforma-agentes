import { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';
import { VisaoGeralCard } from '@/components/dashboard/VisaoGeralCard';
import { MeusAgentesCard } from '@/components/dashboard/MeusAgentesCard';
import { AtividadeRecenteCard } from '@/components/dashboard/AtividadeRecenteCard';

export default function DashboardPage() {
  // Busca dados do store
  const { 
    agents, 
    activeAgentsCount, 
    activeSessions, 
    totalSessions24h, 
    recentActivities, 
    fetchDashboardData,
    createAgent,
  } = useDashboardStore();

  // Carrega os dados iniciais
  useEffect(() => {
    fetchDashboardData();
    
    // Atualiza os dados a cada minuto (simulando atualização em tempo real)
    const interval = setInterval(fetchDashboardData, 60000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // Manipuladores de eventos
  const handleCreateAgent = () => {
    const agentName = prompt('Digite o nome do novo agente:');
    if (agentName) {
      createAgent(agentName, 'llm'); // Por padrão, cria um agente do tipo LLM
    }
  };

  const handleAgentClick = (agent: any) => {
    // Navega para a página de detalhes do agente
    console.log('Agent clicked:', agent);
    // navigate(`/agentes/${agent.id}`);
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Cabeçalho */}
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Pesquisar agentes, ferramentas..."
            className="w-full pl-8"
          />
        </div>
      </div>

      {/* Grid principal */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Visão Geral */}
        <div className="md:col-span-1 lg:row-span-2">
          <VisaoGeralCard 
            activeAgents={activeAgentsCount} 
            activeSessions={activeSessions} 
            totalSessions24h={totalSessions24h} 
          />
        </div>

        {/* Meus Agentes */}
        <div className="md:col-span-1 lg:col-span-2">
          <MeusAgentesCard 
            agents={agents} 
            onCreateAgent={handleCreateAgent}
            onAgentClick={handleAgentClick}
          />
        </div>

        {/* Atividade Recente */}
        <div className="md:col-span-2 lg:col-span-3">
          <AtividadeRecenteCard activities={recentActivities} />
        </div>
      </div>
    </div>
  );
}
