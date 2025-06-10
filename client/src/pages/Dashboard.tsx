import { Input, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useDashboardData from '@/hooks/useDashboardData';
import agentService from '@/api/agentService';
import { CreateAgentDialog } from '@/components/agents/CreateAgentDialog';
import { VisaoGeralCard } from '@/components/dashboard/VisaoGeralCard';
import { MeusAgentesCard } from '@/components/dashboard/MeusAgentesCard';
import { AtividadeRecenteCard } from '@/components/dashboard/AtividadeRecenteCard';
import { TokenUsageCard } from '@/components/dashboard/TokenUsageCard';

export default function DashboardPage() {
  const navigate = useNavigate();
  const {
    stats,
    agents,
    recentActivities,
    tokenUsage,
    isLoading,
    error,
    refreshData,
  } = useDashboardData();

  // Manipuladores de eventos
  const handleCreateAgent = async (name: string, type: any) => {
    try {
      const saved = await agentService.saveAgent({ id: '', name, type } as any);
      navigate(`/agent/${saved.id}`);
      refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAgentClick = (agent: any) => {
    navigate(`/agent/${agent.id}`);
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

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="agents">Agentes</TabsTrigger>
          <TabsTrigger value="activity">Atividade</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="md:col-span-1 lg:row-span-2">
              <VisaoGeralCard
                activeAgents={stats.activeAgentsCount}
                activeSessions={stats.activeSessions}
                totalSessions24h={stats.totalSessions24h}
                isLoading={isLoading}
                error={error}
              />
            </div>
            <div className="md:col-span-1 lg:col-span-2">
              <MeusAgentesCard
                agents={agents}
                onCreateAgent={() => {}}
                onAgentClick={handleAgentClick}
                createButton={<CreateAgentDialog onConfirm={handleCreateAgent} />}
                isLoading={isLoading}
                error={error}
              />
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <TokenUsageCard data={tokenUsage} isLoading={isLoading} error={error} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="agents">
          <MeusAgentesCard
            agents={agents}
            onCreateAgent={() => {}}
            onAgentClick={handleAgentClick}
            createButton={<CreateAgentDialog onConfirm={handleCreateAgent} />}
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>

        <TabsContent value="activity">
          <AtividadeRecenteCard
            activities={recentActivities}
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
