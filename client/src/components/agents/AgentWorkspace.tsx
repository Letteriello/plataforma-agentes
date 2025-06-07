import React, { useState, useEffect } from 'react';
import { LlmAgentConfig, AgentType, AnyAgentConfig } from '@/types/agent';
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
  code_execution: false as boolean,
  planning_enabled: false as boolean,
  tools: [],
};

const AgentWorkspace: React.FC = () => {
  const activeAgentFromStore = useAgentStore((state: any) => state.activeAgent);
  const setActiveAgentInStore = useAgentStore((state: any) => state.setActiveAgent);

  const [currentConfig, setCurrentConfig] = useState<AnyAgentConfig>(() => {
    return activeAgentFromStore ? deepClone(activeAgentFromStore) : deepClone(initialLlmConfig);
  });
  const [isCreatingNew, setIsCreatingNew] = useState(!activeAgentFromStore);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (activeAgentFromStore) {
      // Garante que code_execution e planning_enabled nunca sejam undefined
      const cloned = deepClone(activeAgentFromStore);
      if (cloned.type === AgentType.LLM) {
        cloned.code_execution = cloned.code_execution ?? false;
        cloned.planning_enabled = cloned.planning_enabled ?? false;
      }
      // Normaliza campos obrigatórios para LLM
      if (cloned.type === AgentType.LLM) {
        cloned.code_execution = cloned.code_execution ?? false;
        cloned.planning_enabled = cloned.planning_enabled ?? false;
        cloned.model = cloned.model ?? 'gpt-3.5-turbo';
      }
      setCurrentConfig(cloned);
      setIsCreatingNew(false);
    } else {
      // Garante que code_execution e planning_enabled nunca sejam undefined
      const cloned = deepClone(initialLlmConfig);
      cloned.code_execution = cloned.code_execution ?? false;
      cloned.planning_enabled = cloned.planning_enabled ?? false;
      // Normaliza campos obrigatórios para LLM
      if (cloned.type === AgentType.LLM) {
        cloned.code_execution = cloned.code_execution ?? false;
        cloned.planning_enabled = cloned.planning_enabled ?? false;
        cloned.model = cloned.model ?? 'gpt-3.5-turbo';
      }
      setCurrentConfig(cloned);
      setIsCreatingNew(true);
    }
  }, [activeAgentFromStore]);

  const { toast } = useToast();

  const handleSaveCurrentConfig = async () => {
    if (!currentConfig) return;
    setIsSaving(true);
    try {
      const savedAgent = await saveAgent(currentConfig);
      if (isCreatingNew || !currentConfig.id) {
        setActiveAgentInStore(savedAgent);
      } else if (activeAgentFromStore?.id === savedAgent.id) {
        setActiveAgentInStore(savedAgent);
      }
      toast({
        title: 'Agente salvo com sucesso!',
        description: `O agente "${savedAgent.name}" foi salvo.`,
        variant: 'success',
      });
    } catch (error) {
      console.error('Falha ao salvar o agente:', error);
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
    <div style={{ display: 'flex', gap: '20px', padding: '20px', height: '100%' }}>
      <div style={{ flex: 1 }}>
        {/* <h2>Agent Workspace</h2> */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">
            {isCreatingNew ? (
              <span className="text-primary">Novo Agente</span>
            ) : (
              currentConfig?.name || 'Editar Agente'
            )}
          </h2>
        </div>
        <AgentConfigurator
          agentConfig={currentConfig}
          onConfigChange={(config) => setCurrentConfig(config)}
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
