import React, { useState } from 'react';
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

  return (
    <div className="flex h-full">
      <div className="flex-1">
        <AgentList
          agents={mockAgents}
          selectedAgentIds={selectedAgent ? [selectedAgent.id] : []}
          onAgentToggle={handleAgentSelect}
          selectable={true}
          title="Agentes Disponíveis"
        />
      </div>
      <div className="w-96 border-l">
        {agentConfig && (
          <AgentConfigurator
            agentConfig={agentConfig!}
            onConfigChange={handleConfigChange}
          />
        )}
      </div>
    </div>
  );
};

export default AgentWorkspace;
