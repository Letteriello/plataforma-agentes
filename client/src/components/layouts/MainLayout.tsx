import { useState } from 'react'; // Adicionar useState
import { useMatches } from 'react-router-dom';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Topbar } from '@/components/navigation/Topbar';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { ContextPanel } from '@/components/context/ContextPanel'; // Importar ContextPanel
import type { ContextPanelData } from '@/components/context/types'; // Importar tipo
 // Importar tipo
import { AgentList } from '@/components/agents/AgentList'; // Nova importação
import type { AgentCardData } from '@/components/agents/types'; // Nova importação

export function MainLayout() {
  const matches = useMatches();
  const routeWithTitle = [...matches].reverse().find(match => typeof (match.handle as any)?.title === 'string');
  const dynamicTitle = routeWithTitle ? (routeWithTitle.handle as any).title : undefined;

  // Array de dados mock para múltiplos agentes
  const allMockAgents: ContextPanelData[] = [
    {
      id: 'agent-007',
      title: 'Agente Nexus Prime',
      description: 'Agente de elite especializado em operações complexas e análise de dados em tempo real. Monitora continuamente o fluxo de informações da plataforma.',
      imageUrl: `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=NexusPrime&backgroundColor=22d3ee,09090b,3b82f6&radius=8&scale=80&size=96`,
      status: { text: 'active', label: 'Status Operacional' },
      properties: [
        { label: 'Última Atividade', value: '2025-06-06 15:30:10' },
        { label: 'Tarefas Ativas', value: 12 },
        { label: 'Modelo de IA Primário', value: 'Nexus-GPT-5-Turbo' },
        { label: 'Precisão Média', value: '98.7%' },
        { label: 'Latência Média (ms)', value: 150 },
        { label: 'Versão do ADK', value: '1.2.0' },
      ],
    },
    {
      id: 'agent-sigma-001',
      title: 'Agente Sigma (Coletor)',
      description: 'Responsável pela coleta e pré-processamento de dados de múltiplas fontes. Otimizado para alta ingestão e normalização.',
      imageUrl: `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=SigmaCollector&backgroundColor=7c3aed,c026d3&radius=8&scale=80&size=96`,
      status: { text: 'pending', label: 'Status' },
      properties: [
        { label: 'Última Atividade', value: '2025-06-06 16:05:22' },
        { label: 'Fontes de Dados Ativas', value: 5 },
        { label: 'Taxa de Ingestão (eventos/s)', value: 2500 },
        { label: 'Erros de Processamento (24h)', value: 3 },
        { label: 'Versão do ADK', value: '1.1.5' },
      ],
    },
    {
      id: 'agent-omega-003',
      title: 'Agente Omega (Analítico)',
      description: 'Focado em análise preditiva e detecção de anomalias. Utiliza modelos de machine learning avançados.',
      imageUrl: `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=OmegaAnalytics&backgroundColor=f59e0b,ea580c&radius=8&scale=80&size=96`,
      status: { text: 'error', label: 'Status Crítico' },
      properties: [
        { label: 'Última Atividade', value: '2025-06-06 12:10:00' },
        { label: 'Modelos Carregados', value: 7 },
        { label: 'Anomalias Detectadas (1h)', value: 0 },
        { label: 'Último Erro Fatal', value: 'Falha ao carregar modelo X (ID: model-err-991)' },
        { label: 'Versão do ADK', value: '1.2.0' },
      ],
    },
  ];

  // Estado para o ID do agente selecionado. Inicializa com o ID do primeiro agente, se existir.
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(
    allMockAgents.length > 0 ? allMockAgents[0].id : null
  );

  // Encontra os dados do agente selecionado com base no selectedAgentId
  const currentAgentDataForPanel: ContextPanelData | null =
    allMockAgents.find(agent => agent.id === selectedAgentId) || null;

  // Prepara os dados para o AgentList mapeando de ContextPanelData para AgentCardData
  const agentListData: AgentCardData[] = allMockAgents.map(agent => {
    // Fornece valores padrão para status se não estiver definido
    const defaultStatus = {
      text: 'unknown' as const,
      label: 'Status desconhecido'
    };
    
    return {
      id: agent.id,
      title: agent.title,
      imageUrl: agent.imageUrl,
      status: agent.status ? {
        text: agent.status.text || 'unknown',
        label: agent.status.label || 'Status desconhecido'
      } : defaultStatus,
      // shortDescription: agent.description?.substring(0, 70) + '...', // Exemplo futuro
    };
  });

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-screen w-full overflow-hidden bg-background"
    >
      {/* Sidebar Panel */}
      <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
        <div className="h-full overflow-y-auto"> 
          <Sidebar />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />

      {/* Main Area Panel (contains Topbar, Context Panel, and Outlet) */}
      <ResizablePanel defaultSize={80}>
        <div className="flex flex-col h-full">
          <Topbar
            pageTitle={dynamicTitle}
            agentsForSelector={allMockAgents.map(agent => ({ id: agent.id, title: agent.title }))}
            selectedAgentIdForSelector={selectedAgentId}
            onSelectAgentForSelector={setSelectedAgentId}
          />
          <ResizablePanelGroup
            direction="horizontal"
            className="flex-1" 
          >
            {/* Context Panel */}
            {/* O ResizablePanel agora tem bg-card e border-r. Não precisa de padding. */}
            <ResizablePanel defaultSize={30} minSize={20} className="bg-card border-r border-border">
              <ContextPanel data={currentAgentDataForPanel} />
            </ResizablePanel>
            <ResizableHandle withHandle />

            {/* Outlet Panel - Temporariamente substituído pelo AgentList para teste */}
            <ResizablePanel defaultSize={70}>
              <div className="h-full overflow-y-auto p-6"> {/* Padding movido para este div */}
                {/* <main>
                  <Outlet />
                </main> */}
                <h2 className="text-xl font-semibold mb-4">Lista de Agentes (Visualização de Teste)</h2>
                <AgentList
                  agents={agentListData}
                  selectedAgentId={selectedAgentId}
                  onAgentSelect={setSelectedAgentId} // Reutiliza a função de seleção do estado
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
