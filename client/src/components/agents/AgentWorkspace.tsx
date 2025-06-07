// src/components/agents/AgentWorkspace.tsx
import React, { useState, useEffect } from 'react';
import { AgentType, AnyAgentConfig, LlmAgentConfig } from '@/types/agent';
import AgentConfigurator from '@/components/agents/AgentConfigurator';
import JsonPreview from './JsonPreview';
import { useAgentStore } from '@/store/agentStore';
import { deepClone } from '@/lib/utils';
import { saveAgent } from '@/api/agentService';
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
 * Ele gerencia o estado da configuração atual e interage com o `agentService` para persistir as mudanças.
 */
const AgentWorkspace: React.FC = () => {
  const activeAgentFromStore = useAgentStore((state) => state.activeAgent);
  const setActiveAgentInStore = useAgentStore((state) => state.setActiveAgent);

  const [currentConfig, setCurrentConfig] = useState<AnyAgentConfig>(
    activeAgentFromStore ? deepClone(activeAgentFromStore) : deepClone(initialLlmConfig)
  );
  const [isCreatingNew, setIsCreatingNew] = useState(!activeAgentFromStore);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Sincroniza o workspace com o agente ativo no store
    const agentToLoad = activeAgentFromStore || initialLlmConfig;
    setCurrentConfig(deepClone(agentToLoad));
    setIsCreatingNew(!activeAgentFromStore);
  }, [activeAgentFromStore]);

  /**
   * Manipula o salvamento da configuração atual do agente,
   * exibindo toasts de sucesso ou erro.
   */
  const handleSaveCurrentConfig = async () => {
    setIsSaving(true);
    try {
      const savedAgent = await saveAgent(currentConfig);
      setActiveAgentInStore(savedAgent);
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
        <AgentConfigurator
          agentConfig={currentConfig}
          onConfigChange={setCurrentConfig}
          onSave={handleSaveCurrentConfig}
          isSaving={isSaving}
          isCreatingNew={isCreatingNew}
        />
      </div>
      <div style={{ flex: 1 }}>
        <JsonPreview data={currentConfig} />
      </div>
    </div>
  );
};

export default AgentWorkspace;
