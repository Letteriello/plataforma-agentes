import { useState } from 'react'; // Adicionar useState
import { Outlet, useMatches } from 'react-router-dom';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Topbar } from '@/components/navigation/Topbar';

 // Importar tipo

const MainLayout = () => {
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
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar Panel */}
      <div className="flex-none w-64 md:w-72 lg:w-80 xl:w-[340px] h-full overflow-y-auto border-r border-border bg-card shadow-lg dark:shadow-slate-700/50">
          {/* Adicionada classe 'sm:w-64' para telas pequenas e aumentada um pouco a largura em telas maiores, e adicionado shadow */}
        <Sidebar />
      </div>

      {/* Main Area Panel (contains Topbar, Context Panel, and Outlet) */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
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
