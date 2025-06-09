// src/components/agents/AgentWorkspace.tsx
import React, { useEffect, useState } from 'react';
import { AgentType, AnyAgentConfig, LlmAgentConfig } from '@/types/agent';
import AgentConfigurator from '@/components/agents/AgentConfigurator';
import JsonPreview from './JsonPreview';
import { useAgentStore } from '@/store/agentStore';
import { useAgentConfigStore } from '@/store/agentConfigStore';
import { deepClone } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

const initialLlmConfig: LlmAgentConfig = {
  id: '',
  name: '',
  type: AgentType.LLM,
  instruction: '',
  model: 'gpt-3.5-turbo',
  code_execution: false,
  planning_enabled: false,
  tools: [],
};

/**
 * O Workspace do Agente é o ambiente principal para criar e configurar agentes.
 * Ele gerencia o estado da configuração atual e persiste as mudanças via store.
 */
const AgentWorkspace: React.FC = () => {
  const activeAgentFromStore = useAgentStore((state) => state.activeAgent);
  const setActiveAgentInStore = useAgentStore((state) => state.setActiveAgent);

  const { currentConfig, setConfig } = useAgentConfigStore((state) => ({
    currentConfig: state.currentConfig,
    setConfig: state.setConfig,
  }));
  const [isCreatingNew, setIsCreatingNew] = useState(!activeAgentFromStore);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Sincroniza o workspace com o agente ativo no store
    const agentToLoad = activeAgentFromStore
      ? deepClone(activeAgentFromStore)
      : deepClone(initialLlmConfig);
    setConfig(agentToLoad);
    setIsCreatingNew(!activeAgentFromStore);
  }, [activeAgentFromStore, setConfig]);

  /**
   * Manipula o salvamento da configuração atual do agente,
   * exibindo toasts de sucesso ou erro.
   */
  const saveAgent = useAgentStore((state) => state.saveAgent);

  const handleSaveCurrentConfig = async () => {
    if (!currentConfig) return;
    setIsSaving(true);
    try {
      const savedAgent = await saveAgent(currentConfig);
      setActiveAgentInStore(savedAgent);
      setConfig(savedAgent);
      toast({
        title: 'Agente salvo com sucesso!',
        description: `O agente "${savedAgent.name}" foi salvo.`,
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Erro ao salvar agente',
        description: 'Ocorreu um erro ao tentar salvar o agente.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '20px', height: '100%' }}>
      <div style={{ flex: 1 }}>
        <h2 className="text-lg font-semibold mb-4">
          {isCreatingNew ? 'Novo Agente' : `Editando: ${currentConfig?.name}`}
        </h2>
        {currentConfig && (
          <AgentConfigurator
            agentConfig={currentConfig}
            onSave={handleSaveCurrentConfig}
            isSaving={isSaving}
            isCreatingNew={isCreatingNew}
          />
        )}
      </div>
      <div style={{ flex: 1 }}>
        {currentConfig && <JsonPreview data={currentConfig} />}
      </div>
    </div>
  );
};

export default AgentWorkspace;
