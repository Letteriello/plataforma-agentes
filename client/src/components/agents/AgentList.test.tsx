import React from 'react'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import AgentList from './AgentList'
import { useAgentStore } from '@/components/features/agents-list/store/agentStore'
import { AnyAgentConfig, AgentType } from '@/types/agent'

// Mock o useAgentStore
vi.mock('@/components/features/agents-list/store/agentStore')

const mockAgents: AnyAgentConfig[] = [
  {
    id: 'agent-1',
    name: 'Agente Alpha',
    type: AgentType.LLM,
    instruction: 'Instrução Alpha',
    model: 'gpt-3.5-turbo',
    code_execution: false,
    planning_enabled: false,
  },
  {
    id: 'agent-2',
    name: 'Agente Beta',
    type: AgentType.LLM,
    instruction: 'Instrução Beta',
    model: 'gpt-4',
    code_execution: true,
    planning_enabled: true,
  },
  {
    id: 'agent-3',
    name: 'Agente Gamma',
    type: AgentType.Sequential,
    agents: [],
  },
];

describe('AgentList Component', () => {
  beforeEach(() => {
    // Reseta o mock antes de cada teste retornando o estado solicitado
    vi.mocked(useAgentStore).mockImplementation((selector: any) =>
      selector({ agents: mockAgents })
    )
  })

  test('renders all agents when searchTerm is empty', () => {
    render(<AgentList title="Meus Agentes" />);

    // Verifica se os nomes dos agentes estão presentes
    expect(screen.getByText('Agente Alpha')).toBeInTheDocument();
    expect(screen.getByText('Agente Beta')).toBeInTheDocument();
    expect(screen.getByText('Agente Gamma')).toBeInTheDocument();
  });

  test('filters agents based on searchTerm (case-insensitive)', () => {
    render(<AgentList title="Meus Agentes" searchTerm="alpha" />);

    expect(screen.getByText('Agente Alpha')).toBeInTheDocument();
    expect(screen.queryByText('Agente Beta')).not.toBeInTheDocument();
    expect(screen.queryByText('Agente Gamma')).not.toBeInTheDocument();
  });

  test('filters agents based on searchTerm (partial match)', () => {
    render(<AgentList title="Meus Agentes" searchTerm="Agent" />); // Deve corresponder a todos

    expect(screen.getByText('Agente Alpha')).toBeInTheDocument();
    expect(screen.getByText('Agente Beta')).toBeInTheDocument();
    expect(screen.getByText('Agente Gamma')).toBeInTheDocument();
  });

  test('shows "Nenhum agente encontrado" when searchTerm matches no agents', () => {
    render(<AgentList title="Meus Agentes" searchTerm="Omega" />);

    expect(screen.getByText('Nenhum agente encontrado.')).toBeInTheDocument();
    expect(screen.queryByText('Agente Alpha')).not.toBeInTheDocument();
    expect(screen.queryByText('Agente Beta')).not.toBeInTheDocument();
    expect(screen.queryByText('Agente Gamma')).not.toBeInTheDocument();
  });

  test('renders call to action when list is empty and onCreateAgent provided', () => {
    render(
      <AgentList
        title="Meus Agentes"
        agents={[]}
        onCreateAgent={vi.fn()}
      />,
    );

    expect(screen.getByText('Nenhum agente encontrado.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /criar novo agente/i })).toBeInTheDocument();
  });

  // Mais testes virão aqui (para seleção, exclusão, etc.)
});
