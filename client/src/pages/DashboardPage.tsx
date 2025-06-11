import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// Icons
import { 
  AlertCircle,
  Bell,
  Bot, 
  Clock,
  MessageSquare,
  RefreshCw,
  TrendingUp,
  User,
  Settings,
  HelpCircle,
  LogOut,
} from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Dashboard Components
import { StatsCard } from '@/components/dashboard/StatsCard';
import { AgentStatusCard } from '@/components/dashboard/AgentStatusCard';
import { RecentActivityCard } from '@/components/dashboard/RecentActivityCard';
import { TokenUsageCard } from '@/components/dashboard/TokenUsageCard';
import { AgentActivityCard } from '@/components/dashboard/AgentActivityCard';

// Types
type AgentStatus = 'online' | 'offline' | 'idle' | 'busy';

export interface Agent {
  id: string;
  name: string;
  description: string;
  status: AgentStatus;
  type: 'chat' | 'assistant' | 'automation';
  lastActive: string;
  usage: 'low' | 'medium' | 'high';
  usageStatus: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface DashboardStats {
  totalAgents: number;
  totalInteractions: number;
  successRate: number;
  avgResponseTime: string;
  tokenUsage: number;
  activeAgents: number;
  activeSessions: number;
  [key: string]: string | number; // Add index signature to allow dynamic property access
}

// Hooks and Services
import { createAgent } from '@/api/agentService';

// Types
interface DashboardState {
  stats: DashboardStats | null;
  loading: boolean;
  error: Error | null;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('7d');
  const [timeRange, setTimeRange] = useState('day');
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    stats: {
      totalAgents: 0,
      totalInteractions: 0,
      successRate: 0,
      avgResponseTime: '0s',
      tokenUsage: 0,
      activeAgents: 0,
      activeSessions: 0
    },
    loading: true,
    error: null
  });
  
  // Alias para facilitar o acesso
  const { stats, loading, error } = dashboardState;
  const [agents] = useState<Agent[]>([
    { 
      id: '1', 
      name: 'Assistente de Vendas', 
      description: 'Atendimento ao cliente e vendas',
      status: 'online', 
      type: 'chat', 
      lastActive: '2 minutos atrás',
      usage: 'high',
      usageStatus: 'high',
      createdAt: '2023-01-15',
      updatedAt: '2023-10-20',
      createdBy: 'admin@exemplo.com'
    },
    { 
      id: '2', 
      name: 'Suporte Técnico', 
      description: 'Resolução de problemas técnicos',
      status: 'idle', 
      type: 'assistant', 
      lastActive: '1 hora atrás',
      usage: 'low',
      usageStatus: 'low',
      createdAt: '2023-02-20',
      updatedAt: '2023-10-19',
      createdBy: 'admin@exemplo.com'
    },
    { 
      id: '3', 
      name: 'Automação de Tarefas', 
      description: 'Automatiza tarefas repetitivas',
      status: 'busy', 
      type: 'automation', 
      lastActive: 'agora mesmo',
      usage: 'high',
      usageStatus: 'high',
      createdAt: '2023-03-10',
      updatedAt: '2023-10-21',
      createdBy: 'admin@exemplo.com'
    },
  ]);

  const tokenUsage = [
    { date: '2023-01-01', tokens: 1000 },
    { date: '2023-01-02', tokens: 2000 },
    { date: '2023-01-03', tokens: 1500 },
    { date: '2023-01-04', tokens: 3000 },
    { date: '2023-01-05', tokens: 2500 },
    { date: '2023-01-06', tokens: 4000 },
    { date: '2023-01-07', tokens: 3500 },
  ];

  // Atividades recentes
  const recentActivities = [
    {
      id: '1',
      type: 'agent_created',
      message: 'Novo agente criado: Atendente Virtual',
      timestamp: new Date().toISOString(),
      user: 'João Silva'
    },
    {
      id: '2',
      type: 'agent_updated',
      message: 'Configurações do agente Atendente Virtual atualizadas',
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      user: 'Maria Souza'
    },
    {
      id: '3',
      type: 'agent_deleted',
      message: 'Agente Antigo removido',
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      user: 'Carlos Oliveira'
    },
    {
      id: '4',
      type: 'agent_updated',
      message: 'Modelo do Analista de Dados atualizado',
      timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      user: 'Ana Santos'
    },
    {
      id: '5',
      type: 'agent_created',
      message: 'Novo agente criado: Suporte Técnico',
      timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      user: 'Pedro Alves'
    }
  ];

  const recentActivities = useMemo(() => [
    {
      id: '1',
      type: 'agent_created',
      message: 'Novo agente criado: Atendente Virtual',
      timestamp: new Date().toISOString(),
      user: 'João Silva'
    },
    {
      id: '2',
      type: 'agent_updated',
      message: 'Configurações do agente Atendente Virtual atualizadas',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      user: 'Maria Souza'
    },
    {
      id: '3',
      type: 'agent_deleted',
      message: 'Agente Antigo removido',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      user: 'Carlos Oliveira'
    }
  ], []);

  const refreshData = useCallback(async () => {
    try {
      setDashboardState(prev => ({ ...prev, loading: true, error: null }));
      
      // Simulação de chamada à API
      await new Promise<void>(resolve => setTimeout(resolve, 1000));
      
      // Atualizar dados mockados
      const stats: DashboardStats = {
        totalAgents: agents.length,
        totalInteractions: recentActivities.length,
        successRate: 85, // Exemplo: 85% de sucesso
        avgResponseTime: '1.2s',
        tokenUsage: 15000, // Exemplo: 15.000 tokens usados
        activeAgents: agents.filter(agent => agent.status === 'online' || agent.status === 'busy').length,
        activeSessions: 5, // Exemplo: 5 sessões ativas
      };
      
      setDashboardState(prev => ({ ...prev, stats, loading: false }));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro desconhecido');
      setDashboardState(prev => ({ ...prev, error, loading: false }));
      console.error('Error fetching dashboard data:', error);
    }
  }, [agents, recentActivities]);

  // Handle create agent (simplified version without state updates)
  const handleCreateAgent = useCallback(async (agentData: Omit<Agent, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    try {
      // Simulação de criação de agente
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Agent created:', agentData);
      return { success: true, id: `agent-${Date.now()}` };
    } catch (err) {
      console.error('Error creating agent:', err);
      throw err;
    }
  }, []);

  const handleAgentClick = useCallback((agent: Agent) => {
    navigate(`/agents/${agent.id}`);
  }, [navigate]);
  
  const handleViewAllActivities = useCallback(() => {
    navigate('/activities');
  }, [navigate]);
  
  const handlePeriodChange = useCallback((newPeriod: string) => {
    setPeriod(newPeriod);
    // Aqui você pode adicionar lógica para buscar dados do período selecionado
    void refreshData();
  }, [refreshData]);

  // Render dashboard content based on loading/error state
  const renderDashboardContent = () => {
    const { loading, error, stats } = dashboardState;
    
    if (loading) {
      return <div>Carregando...</div>;
    }

    if (error) {
      return (
        <div className="text-red-500">
          Erro ao carregar dados do dashboard: {error.message}
        </div>
      );
    }

    if (!stats) {
      return <div>Nenhum dado disponível</div>;
    }

    return (
      <div className="space-y-6">
        {/* Seção de Estatísticas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total de Agentes"
            value={stats.totalAgents}
            description={`${stats.activeAgents} ativos`}
            icon={<Bot className="h-4 w-4" />}
          />
          <StatsCard
            title="Interações"
            value={stats.totalInteractions}
            description={`${stats.successRate}% de sucesso`}
            icon={<MessageSquare className="h-4 w-4" />}
          />
          <StatsCard
            title="Tempo Médio de Resposta"
            value={stats.avgResponseTime}
            description="últimos 7 dias"
            icon={<Clock className="h-4 w-4" />}
          />
          <StatsCard
            title="Uso de Tokens"
            value={stats.tokenUsage.toLocaleString()}
            description="este mês"
            icon={<TrendingUp className="h-4 w-4" />}
          />
        </div>

        {/* Seção de Agentes e Atividades */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Status dos Agentes */}
          <AgentStatusCard 
            agents={agents}
            onAgentClick={handleAgentClick}
            className="lg:col-span-1"
          />

          {/* Atividades Recentes */}
          <RecentActivityCard 
            activities={recentActivities}
            onViewAll={handleViewAllActivities}
            className="lg:col-span-1"
          />

          {/* Uso de Tokens */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Uso de Tokens</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => void refreshData()}
                    disabled={dashboardState.loading}
                  >
                    <RefreshCw className={`mr-2 h-4 w-4 ${dashboardState.loading ? 'animate-spin' : ''}`} />
                    Atualizar
                  </Button>
                </div>
              </div>
              <CardDescription>Consumo de tokens nos últimos 7 dias</CardDescription>
            </CardHeader>
            <CardContent>
              <TokenUsageCard 
                data={[
                  { date: '2023-01-01', tokens: 1000 },
                  { date: '2023-01-02', tokens: 2000 },
                  { date: '2023-01-03', tokens: 1500 },
                  { date: '2023-01-04', tokens: 3000 },
                  { date: '2023-01-05', tokens: 2500 },
                  { date: '2023-01-06', tokens: 4000 },
                  { date: '2023-01-07', tokens: 3500 },
                ]}
                isLoading={dashboardState.loading}
                error={dashboardState.error}
              />
            </CardContent>
          </Card>
        </div>

        {/* Atividade dos Agentes */}
        <div className="mt-6">
          <AgentActivityCard
            data={[
              { date: '2023-01-01', activeAgents: 3, interactions: 120 },
              { date: '2023-01-02', activeAgents: 4, interactions: 145 },
              { date: '2023-01-03', activeAgents: 2, interactions: 98 },
              { date: '2023-01-04', activeAgents: 5, interactions: 167 },
              { date: '2023-01-05', activeAgents: 3, interactions: 132 },
              { date: '2023-01-06', activeAgents: 4, interactions: 156 },
              { date: '2023-01-07', activeAgents: 5, interactions: 189 },
            ]}
            period={period}
            onPeriodChange={handlePeriodChange}
            onRefresh={() => void refreshData()}
            isLoading={dashboardState.loading}
          />
        </div>
      </div>
    );
  }, [
    agents,
    handleAgentClick,
    handlePeriodChange,
    handleViewAllActivities,
    dashboardState.loading,
    period,
    recentActivities,
    refreshData,
    dashboardState.stats?.avgResponseTime,
    dashboardState.stats?.successRate,
    dashboardState.stats?.tokenUsage,
    dashboardState.stats?.totalAgents,
    dashboardState.stats?.totalInteractions,
    dashboardState.error
  ]);

  // Renderização condicional de erro
  if (dashboardState.error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] p-6 text-center">
        <div className="bg-destructive/10 p-4 rounded-full mb-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Erro ao carregar dados</h2>
        <p className="text-muted-foreground mb-6">
          Não foi possível carregar os dados do dashboard. Tente novamente mais tarde.
        </p>
        <Button 
          onClick={() => {
            refreshData().catch((err: Error) => {
              console.error('Error refreshing data:', err);
            });
          }}
          variant="outline"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Tentar novamente
        </Button>
      </div>
    )
  }

  // Calculate token usage for the progress bar
  const tokenLimit = 100000; // Example limit
  const totalTokensUsage = tokenUsage.reduce((sum, item) => sum + item.tokens, 0);
  const tokenPercentage = Math.min(Math.round((totalTokensUsage / tokenLimit) * 100), 100);
  const remainingTokens = tokenLimit - totalTokensUsage;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <motion.div 
          initial={{ width: 280 }}
          animate={{ width: isSidebarOpen ? 280 : 80 }}
          className="h-full bg-card border-r border-border/40 flex flex-col transition-all duration-300 ease-in-out"
        >
          <div className="p-4 border-b border-border/40">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              {isSidebarOpen && (
                <h2 className="text-xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Plataforma IA
                </h2>
              )}
            </div>
          </div>
          
          <nav className="flex-1 p-3 space-y-1">
            {[
              { name: 'Dashboard', icon: LayoutDashboard, active: true },
              { name: 'Agentes', icon: Bot },
              { name: 'Conexões', icon: Clock },
              { name: 'Análises', icon: TrendingUp },
              { name: 'Relatórios', icon: FileText },
            ].map((item) => (
              <button
                key={item.name}
                className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                  item.active 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-muted-foreground hover:bg-muted/50'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {isSidebarOpen && <span className="ml-3">{item.name}</span>}
              </button>
            ))}
          </nav>
          
          <div className="p-3 border-t border-border/40">
            <div className="flex items-center p-2 rounded-lg bg-muted/50">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatar.png" />
                <AvatarFallback>US</AvatarFallback>
              </Avatar>
              {isSidebarOpen && (
                <div className="ml-2 flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Usuário</p>
                  <p className="text-xs text-muted-foreground truncate">admin@exemplo.com</p>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 ml-auto"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <ChevronDown className={`h-4 w-4 transition-transform ${!isSidebarOpen ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-muted/20">
          {/* Top Bar */}
          <header className="bg-card border-b border-border/40">
            <div className="px-6 py-3 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-foreground">Painel de Controle</h1>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Pesquisar..."
                    className="w-64 pl-9 h-9 bg-background/80"
                  />
                </div>
                
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/avatar.png" />
                        <AvatarFallback>US</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configurações</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <HelpCircle className="mr-2 h-4 w-4" />
                      <span>Ajuda</span>
                    </DropdownMenuItem>
                    <Separator className="my-1" />
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>
          
          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard 
                  title="Agentes Ativos" 
                  value={`${stats.activeAgents}/${stats.totalAgents}`}
                  description={`${Math.round((stats.activeAgents / stats.totalAgents) * 100)}% ativos`}
                  icon={<Bot className="h-4 w-4" />}
                  trend="up"
                  trendValue="+2"
                />
                <StatsCard 
                  title="Interações" 
                  value={stats.totalInteractions.toLocaleString()}
                  description="+180 esta semana"
                  icon={<MessageSquare className="h-4 w-4" />}
                  trend="up"
                  trendValue="+12.5%"
                />
                <StatsCard 
                  title="Taxa de Sucesso" 
                  value={`${stats.successRate}%`}
                  description="+2.4% em relação ao mês passado"
                  icon={<TrendingUp className="h-4 w-4" />}
                  trend="up"
                  trendValue="+2.4%"
                />
                <StatsCard 
                  title="Tempo de Resposta" 
                  value={stats.avgResponseTime}
                  description="Média de resposta"
                  icon={<Clock className="h-4 w-4" />}
                  trend="down"
                  trendValue="-0.5s"
                />
              </div>
              
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Agent Activity */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Atividade dos Agentes</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Select value={period} onValueChange={setPeriod}>
                          <SelectTrigger className="w-[120px] h-8 text-xs">
                            <SelectValue placeholder="Período" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1d">Hoje</SelectItem>
                            <SelectItem value="7d">Últimos 7 dias</SelectItem>
                            <SelectItem value="1m">Último mês</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center bg-muted/30 rounded-lg">
                      <p className="text-muted-foreground text-sm">Gráfico de atividade dos agentes</p>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Token Usage */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Uso de Tokens</CardTitle>
                      <CardDescription>
                        {totalTokensUsage.toLocaleString()} de {tokenLimit.toLocaleString()} tokens usados
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Limite Mensal</span>
                            <span className="text-sm font-medium">{tokenPercentage}%</span>
                          </div>
                          <Progress value={tokenPercentage} className="h-2" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Restante</p>
                            <p className="font-medium">
                              {remainingTokens.toLocaleString()} tokens
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Média diária</p>
                            <p className="font-medium">
                              {Math.round(remainingTokens / 30).toLocaleString()} tokens
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Status dos Agentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {agents.map((agent) => (
                          <div key={agent.id} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer" onClick={() => handleAgentClick(agent)}>
                            <div className="flex items-center space-x-3">
                              <div className={`h-2.5 w-2.5 rounded-full ${
                                agent.status === 'online' ? 'bg-green-500' : 
                                agent.status === 'busy' ? 'bg-amber-500' : 'bg-muted-foreground/30'
                              }`} />
                              <span className="font-medium">{agent.name}</span>
                            </div>
                            {agent.usage && (
                              <Badge 
                                variant={agent.usage === 'high' ? 'default' : agent.usage === 'medium' ? 'secondary' : 'outline'}
                                className="text-xs"
                              >
                                {agent.usage === 'high' ? 'Alto uso' : agent.usage === 'medium' ? 'Médio uso' : 'Baixo uso'}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Atividade Recente</CardTitle>
                    <Button variant="ghost" size="sm" className="h-8">
                      Ver tudo <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-start">
                        <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium">Novo agente criado</p>
                          <p className="text-sm text-muted-foreground">
                            O agente "Atendente Virtual" foi atualizado com sucesso.
                          </p>
                          <p className="text-xs text-muted-foreground">Há 2 minutos</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;