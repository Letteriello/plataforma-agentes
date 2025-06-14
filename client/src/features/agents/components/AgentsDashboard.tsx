import { useVirtualizer } from '@tanstack/react-virtual';
import {
  AlertTriangle, 
  Loader2,
  PlusIcon,
  RefreshCw, 
  SearchIcon,
  Users,
} from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AgentSummaryDTO } from '@/api/agentService';
import agentService from '@/api/agentService';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useAgents } from '@/features/agents/hooks/useAgents';

import { AgentListItem } from './AgentListItem';

export function AgentsDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { agents: fetchedAgentsData, isLoading, error, refetchAgents } = useAgents();

  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});
  const [agentToDelete, setAgentToDelete] = useState<AgentSummaryDTO | null>(null);

  const parentRef = React.useRef<HTMLDivElement>(null);

  const filteredAgents = React.useMemo(
    () =>
      (fetchedAgentsData || []).filter(
        (agent: AgentSummaryDTO) =>
          (!searchQuery ||
            agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (agent.description &&
              agent.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase()))) &&
          true
      ),
    [fetchedAgentsData, searchQuery]
  );

  const rowVirtualizer = useVirtualizer({
    count: filteredAgents.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 110, 
    overscan: 5,
  });

  const navigateToEdit = (id: string) => navigate(`/agents/edit/${id}`);
  const navigateToRun = (id: string) => navigate(`/agents/run/${id}`);

  const handleDeleteRequest = (agent: AgentSummaryDTO) => {
    setAgentToDelete(agent);
  };

  const confirmDelete = async () => {
    if (!agentToDelete) return;

    const { id, name } = agentToDelete;
    setIsDeleting((prev) => ({ ...prev, [id]: true }));
    try {
      await agentService.deleteAgent(id);
      refetchAgents();
      toast({
        title: 'Agente excluído',
        description: `O agente "${name}" foi excluído com sucesso.`,
        variant: 'success',
      });
    } catch (err) {
      toast({
        title: 'Erro ao excluir Agente',
        description: (err as Error)?.message || 'Não foi possível excluir o agente.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting((prev) => ({ ...prev, [id]: false }));
      setAgentToDelete(null);
    }
  };

  const memoizedHandleDeleteRequest = useCallback(handleDeleteRequest, []);
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading agents...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen items-center justify-center text-destructive">
        <AlertTriangle className="h-12 w-12" />
        <p className="mt-4 text-lg">Error loading agents: {error.message}</p>
        <Button onClick={refetchAgents} className="mt-4">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-2xl flex items-center">
            <Users className="mr-3 h-6 w-6" />
            Meus Agentes
          </CardTitle>
          <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search agents by name or description..."
                className="w-full rounded-lg bg-background pl-8 md:w-[250px] lg:w-[350px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => navigate('/agents/new')}>
              <PlusIcon className="mr-2 h-4 w-4" /> Create Agent
            </Button>
            <Button onClick={refetchAgents} variant="outline" title="Refresh agents list">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAgents.length === 0 ? (
             <div className="text-center py-10">
               <SearchIcon className="mx-auto h-12 w-12 text-gray-400" />
               <h3 className="text-center text-muted-foreground">
                 {
                   searchQuery
                     ? 'Nenhum agente corresponde aos seus critérios.'
                     : 'Nenhum agente encontrado. Crie um para começar.'
                 }
              </h3>
              {!searchQuery && fetchedAgentsData && fetchedAgentsData.length === 0 && (
                <Button
                  className="mt-4"
                  onClick={() => navigate('/agents/new')}
                 >
                   <PlusIcon className="mr-2 h-4 w-4" />
                   Create Agent
                 </Button>
               )}
             </div>
          ) : (
            <div
              ref={parentRef}
              className="space-y-2 overflow-y-auto"
              style={{ maxHeight: '600px' /* Adjust height as needed */ }}
            >
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative',
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                  const agent = filteredAgents[virtualItem.index] as AgentSummaryDTO; 
                  if (!agent) return null;
                  return (
                    <div
                      key={agent.id}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                    >
                      <AgentListItem
                        agent={agent} // Removed 'as any' as AgentListItem now expects AgentSummaryDTO
                        onEdit={navigateToEdit}
                        onRun={navigateToRun}
                        onDelete={() => memoizedHandleDeleteRequest(agent)}
                        isDeleting={isDeleting[agent.id] || false}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!agentToDelete} onOpenChange={(isOpen) => !isOpen && setAgentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o agente &quot;<strong>{agentToDelete?.name}</strong>&quot; e todos os seus dados associados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
