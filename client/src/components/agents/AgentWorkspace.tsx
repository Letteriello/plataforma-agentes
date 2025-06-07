import React, { useState } from 'react';
import { LlmAgentConfig, AgentType, AnyAgentConfig } from '@/types/agent'; // Assuming '@/' path alias
import { LlmAgentConfig, AgentType } from '@/types/agent'; // Assuming '@/' path alias
import AgentConfigurator from '@/components/agents/AgentConfigurator'; // Assuming '@/' path alias
import JsonPreview from './JsonPreview';

const AgentWorkspace: React.FC = () => {
  const initialLlmConfig: LlmAgentConfig = {
  const initialConfig: LlmAgentConfig = {
    id: crypto.randomUUID(),
    name: '',
    type: AgentType.LLM,
    instruction: '',
    model: 'gpt-3.5-turbo',
    code_execution: false,
    planning_enabled: false,
    tools: [],
  };
  const [agentConfig, setAgentConfig] = useState<AnyAgentConfig>(initialLlmConfig);
    // tools: [] // Uncomment or add if 'tools' is part of LlmAgentConfig and needed
  };
  const [agentConfig, setAgentConfig] = useState<LlmAgentConfig>(initialConfig);

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      <div style={{ flex: 1 }}>
        {/* <h2>Agent Workspace</h2> */}
        <AgentConfigurator agentConfig={agentConfig} onConfigChange={setAgentConfig} />
      </div>
      <div style={{ flex: 1 }}>
        <JsonPreview data={agentConfig} />
      </div>
    </div>
  );
};

export default AgentWorkspace;
