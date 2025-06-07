import React, { useState, useEffect } from 'react';
import { LlmAgentConfig, AgentType, AnyAgentConfig } from '@/types/agent';
import AgentConfigurator from '@/components/agents/AgentConfigurator';
import JsonPreview from './JsonPreview';
import { useAgentStore } from '@/store/agentStore';
import { deepClone } from '@/lib/utils';
import { saveAgent } from '@/api/agentService';

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

const AgentWorkspace: React.FC = () => {
  const activeAgentFromStore = useAgentStore((state) => state.activeAgent);
  const setActiveAgentInStore = useAgentStore((state) => state.setActiveAgent);

  const [currentConfig, setCurrentConfig] = useState<AnyAgentConfig>(() => {
    return activeAgentFromStore ? deepClone(activeAgentFromStore) : deepClone(initialLlmConfig);
  });
  const [isCreatingNew, setIsCreatingNew] = useState(!activeAgentFromStore);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (activeAgentFromStore) {
      setCurrentConfig(deepClone(activeAgentFromStore));
      setIsCreatingNew(false);
    } else {
      setCurrentConfig(deepClone(initialLlmConfig));
      setIsCreatingNew(true);
    }
  }, [activeAgentFromStore]);

  const handleSaveCurrentConfig = async () => {
    if (!currentConfig) return;
    setIsSaving(true);
    try {
      const savedAgent = await saveAgent(currentConfig);
      // Se era um novo agente ou o ID estava vazio antes de salvar
      if (isCreatingNew || !currentConfig.id) {
        setActiveAgentInStore(savedAgent); // Define o agente recém-criado (com ID) como ativo
      } else if (activeAgentFromStore?.id === savedAgent.id) {
        // Se atualizou o agente que já estava ativo, atualiza a referência no store (embora updateAgent já faça isso)
        // e no currentConfig local para ter a versão mais recente (embora saveAgent retorne a mesma instância)
        setActiveAgentInStore(savedAgent); // Garante que o estado ativo é a instância retornada
      }
      // O currentConfig será atualizado pelo useEffect se o activeAgentFromStore mudar
      // ou podemos explicitamente setar aqui se quisermos evitar a dependência do useEffect para este caso:
      // setCurrentConfig(deepClone(savedAgent)); // Opcional: Sincronizar imediatamente o rascunho local
      console.log('Agente salvo com sucesso:', savedAgent);
    } catch (error) {
      console.error('Falha ao salvar o agente:', error);
      // (Futuro: mostrar toast de erro)
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px', height: '100%' }}>
      <div style={{ flex: 1 }}>
        {/* <h2>Agent Workspace</h2> */}
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

import { LlmAgentConfig, AgentType, AnyAgentConfig } from '@/types/agent';
import AgentConfigurator from '@/components/agents/AgentConfigurator';
import JsonPreview from './JsonPreview';
import AgentList from './AgentList';

const mockAgents: AnyAgentConfig[] = [
  {
    id: 'agent_1',
    name: 'Agente de Pesquisa Web',
    type: AgentType.LLM,
    instruction: 'Pesquise na web',
    model: 'gpt-3.5-turbo',
    code_execution: false,
    planning_enabled: false,
    tools: ['web_search']
  },
  {
    id: 'agent_2',
    name: 'Agente Escritor de Artigos',
    type: AgentType.LLM,
    instruction: 'Escreva um artigo',
    model: 'gpt-4',
    code_execution: true,
    planning_enabled: true,
    tools: ['web_search', 'image_generator']
  },
  {
    id: 'agent_3',
    name: 'Agente Tradutor',
    type: AgentType.LLM,
    instruction: 'Traduza o texto',
    model: 'gpt-3.5-turbo',
    code_execution: false,
    planning_enabled: false,
    tools: ['calculator']
  }
];

const AgentWorkspace: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<AnyAgentConfig | null>(null);
  const [agentConfig, setAgentConfig] = useState<AnyAgentConfig | null>(null);

  const handleAgentSelect = (agentId: string) => {
    const selectedAgent = mockAgents.find(agent => agent.id === agentId);
    if (selectedAgent) {
      setSelectedAgent(selectedAgent);
      setAgentConfig(selectedAgent);
    }
  };

  const handleConfigChange = (newConfig: AnyAgentConfig) => {
    setAgentConfig(newConfig);
  };

  const handleSave = () => {
    if (!selectedAgent || !agentConfig) return;
    // TODO: Implement save logic
  };

export default AgentWorkspace;

          />
        )}
      </div>
    </div>
  );
};

export default AgentWorkspace;
