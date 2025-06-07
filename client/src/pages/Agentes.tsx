import React, { useState } from 'react';
import AgentList from '@/components/agents/AgentList';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AgentWorkspace from '@/components/agents/AgentWorkspace';
import { useAgentStore } from '@/store/agentStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KnowledgeBaseManager } from "@/components/knowledge"; // Ajustado para usar o index.ts

const AgentesPage: React.FC = () => {
  const activeAgent = useAgentStore((state: any) => state.activeAgent);
  const setActiveAgent = useAgentStore((state: any) => state.setActiveAgent);
  const [searchTerm, setSearchTerm] = useState('');

  // Define um valor padrão para a aba e permite que ele seja controlado se necessário no futuro.
  // Para esta tarefa, defaultValue é suficiente.
  // const [activeTab, setActiveTab] = useState("configuracao");

  return (
    <Tabs defaultValue="configuracao" className="flex flex-col h-[calc(100vh-4rem)] p-4 md:p-6 gap-4"> {/* Ajustado h-full para viewport menos header (aprox) */}
      <TabsList className="w-full md:w-auto md:self-start">
        <TabsTrigger value="configuracao">Configuração de Agentes</TabsTrigger>
        <TabsTrigger value="conhecimento">Base de Conhecimento</TabsTrigger>
      </TabsList>

      <TabsContent value="configuracao" className="flex-grow overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
          {/* Coluna da Lista de Agentes - bg-card e shadow aplicados para consistência */}
          <div className="md:col-span-1 h-full overflow-y-auto rounded-lg border bg-card text-card-foreground shadow-sm p-4 flex flex-col gap-4">
            <Input
              type="text"
              placeholder="Buscar agentes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />
            <Button
              variant="primary"
              className="w-full mb-2"
              onClick={() => setActiveAgent(null)}
            >
              + Novo Agente
            </Button>
            <AgentList
              onAgentClick={(agent) => setActiveAgent(agent)}
              activeAgentId={activeAgent?.id}
              title="Meus Agentes"
              searchTerm={searchTerm}
            />
          </div>
          {/* Coluna do Workspace do Agente - p-0 para que o Card interno controle o padding */}
          <div className="md:col-span-2 h-full overflow-y-auto rounded-lg border bg-card text-card-foreground shadow-sm p-0">
            {/* O AgentWorkspace já tem um padding interno se necessário, ou pode ser ajustado */}
            {/* O AgentConfigurator dentro do Workspace é que precisa de padding, geralmente. */}
            {/* Para garantir que o conteúdo interno tenha padding, podemos adicionar um wrapper ou garantir que AgentWorkspace lide com isso. */}
            {/* Por ora, AgentWorkspace pode precisar de um wrapper Card ou padding em seu root. */}
            {/* Adicionando um padding aqui como exemplo, mas o ideal é que o componente filho (AgentWorkspace) gerencie seu padding interno */}
            <div className="p-6 h-full">
              <AgentWorkspace />
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="conhecimento" className="flex-grow overflow-auto">
        {/* KnowledgeBaseManager já é um Card, então não precisa de wrapper Card extra */}
        <KnowledgeBaseManager />
      </TabsContent>
    </Tabs>
  );
};

export default AgentesPage;
