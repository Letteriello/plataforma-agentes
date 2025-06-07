import React from 'react';
import { render, screen } from '@testing-library/react';
import AgentList from './AgentList';
import { useAgentStore } from '@/store/agentStore';
import { AnyAgentConfig, AgentType } from '@/types/agent';

// Mock o useAgentStore
jest.mock('@/store/agentStore');

const mockAgents: AnyAgentConfig[] = [
  {
    id: 'agent-1',
    name: 'Agente Alpha',
    type: AgentType.LLM,
    instruction: 'Instrução Alpha',
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    max_tokens: 100,
    code_execution: false,
    planning_enabled: false,
  },
  {
    id: 'agent-2',
    name: 'Agente Beta',
    type: AgentType.LLM,
    instruction: 'Instrução Beta',
    model: 'gpt-4',
    temperature: 0.5,
    max_tokens: 150,
    code_execution: true,
    planning_enabled: true,
  },
  {
    id: 'agent-3',
    name: 'Agente Gamma',
    type: AgentType.Sequential,
    instruction: 'Instrução Gamma',
    agents: [],
  },
];

describe('AgentList Component', () => {
  beforeEach(() => {
    // Reseta o mock antes de cada teste
    (useAgentStore as jest.Mock).mockReturnValue({
      agents: mockAgents,
      // Adicione outros estados/seletores do store que AgentList possa usar, se houver
      // Por exemplo: activeAgent: null, setActiveAgent: jest.fn(), etc.
    });
  });

  test('renders all agents when searchTerm is empty', () => {
    render(<AgentList title="Meus Agentes" />);

    // Verifica se os nomes dos agentes estão presentes
    expect(screen.getByText('Agente Alpha')).toBeInTheDocument();
    expect(screen.getByText('Agente Beta')).toBeInTheDocument();
    expect(screen.getByText('Agente Gamma')).toBeInTheDocument();
  });

  // Mais testes virão aqui (para filtro, seleção, etc.)
});
