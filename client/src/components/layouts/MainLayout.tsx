import { useState } from 'react';
import { Outlet, useMatches } from 'react-router-dom';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Topbar } from '@/components/navigation/Topbar';
import { cn } from '@/lib/utils';

const MainLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const matches = useMatches();
  const routeWithTitle = [...matches].reverse().find(match => typeof (match.handle as any)?.title === 'string');
  const dynamicTitle = routeWithTitle ? (routeWithTitle.handle as any).title : undefined;

  // Estado para o ID do agente selecionado.
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);



  // TODO: Substituir este mock pela lógica de listagem de agentes reais
  const allMockAgentsForSelector = [
    { id: 'agent-001', title: 'Agente Alpha' },
    { id: 'agent-007', title: 'Agente Nexus Prime' },
    { id: 'agent-sigma-001', title: 'Agente Sigma (Coletor)' },
    { id: 'agent-omega-003', title: 'Agente Omega (Analítico)' },
  ];


  return (
    <div className="flex h-screen bg-muted/40">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onMouseEnter={() => setIsSidebarCollapsed(false)}
        onMouseLeave={() => setIsSidebarCollapsed(true)}
      />
      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300 ease-in-out h-full overflow-hidden",
          isSidebarCollapsed ? "pl-20" : "pl-64"
        )}
      >
        <Topbar
          pageTitle={dynamicTitle}
          agentsForSelector={allMockAgentsForSelector} // Updated to use new mock
          selectedAgentIdForSelector={selectedAgentId}
          onSelectAgentForSelector={setSelectedAgentId}
        />
        {/* Outlet Panel - Agora ocupa todo o espaço abaixo da Topbar */}
        <div className="flex-1 h-full overflow-y-auto bg-muted/20 dark:bg-muted/10">
  <main className="p-4 md:p-6">
    <Outlet />
  </main>
</div>
      </div>
    </div>
  );
};

export default MainLayout;
