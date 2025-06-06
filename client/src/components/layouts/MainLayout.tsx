import { useState } from 'react'; // Adicionar useState
import { Outlet, useMatches } from 'react-router-dom';
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

export function MainLayout() {
  const matches = useMatches();
  const routeWithTitle = [...matches].reverse().find(match => typeof (match.handle as any)?.title === 'string');
  const dynamicTitle = routeWithTitle ? (routeWithTitle.handle as any).title : undefined;

  // Estado para o ID do agente selecionado.
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  // TODO: Substituir este mock pela lógica de busca de dados do agente real
  const currentAgentDataForPanel: ContextPanelData | null = selectedAgentId ? {
    id: selectedAgentId,
    title: `Agente ${selectedAgentId}`,
    description: `Descrição detalhada do Agente ${selectedAgentId}. Este agente é especializado em...`,
    imageUrl: `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${selectedAgentId}&backgroundColor=22d3ee,09090b,3b82f6&radius=8&scale=80&size=96`,
    status: { text: 'active', label: 'Status Operacional' },
    properties: [
      { label: 'Última Atividade', value: '2025-07-20 10:00:00' },
      { label: 'Versão do ADK', value: '1.3.0' },
    ],
  } : null;

  // TODO: Substituir este mock pela lógica de listagem de agentes reais
  const allMockAgentsForSelector = [
    { id: 'agent-001', title: 'Agente Alpha' },
    { id: 'agent-007', title: 'Agente Nexus Prime' },
    { id: 'agent-sigma-001', title: 'Agente Sigma (Coletor)' },
    { id: 'agent-omega-003', title: 'Agente Omega (Analítico)' },
  ];


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
            agentsForSelector={allMockAgentsForSelector} // Updated to use new mock
            selectedAgentIdForSelector={selectedAgentId}
            onSelectAgentForSelector={setSelectedAgentId}
          />
          <ResizablePanelGroup
            direction="horizontal"
            className="flex-1" 
          >
            {/* Context Panel */}
            <ResizablePanel defaultSize={30} minSize={20} className="bg-card border-r border-border">
              <ContextPanel data={currentAgentDataForPanel} />
            </ResizablePanel>
            <ResizableHandle withHandle />

            {/* Outlet Panel */}
            <ResizablePanel defaultSize={70}>
              <div className="h-full overflow-y-auto p-6">
                <main>
                  <Outlet />
                </main>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
