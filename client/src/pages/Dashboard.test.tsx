import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom'; // Using MemoryRouter for isolated testing

import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { useDashboardMetrics } from '@/features/dashboard/hooks/useDashboardMetrics';

import Dashboard from './Dashboard';

// Mock the custom hooks
jest.mock('@/features/dashboard/hooks/useDashboard');
jest.mock('@/features/dashboard/hooks/useDashboardMetrics');

// Mock react-chartjs-2
jest.mock('react-chartjs-2', () => ({
  Line: jest.fn(() => <div data-testid="mock-line-chart">Mock Line Chart</div>),
}));

// Default mock implementation for useDashboard
const mockUseDashboard = useDashboard as jest.Mock;
// Default mock implementation for useDashboardMetrics
const mockUseDashboardMetrics = useDashboardMetrics as jest.Mock;

const queryClient = new QueryClient();

const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        {children}
      </MemoryRouter>
    </QueryClientProvider>
  );
};

const renderDashboard = () => {
  return render(<Dashboard />, { wrapper: AllTheProviders });
};

describe('Dashboard Page', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockUseDashboard.mockReturnValue({
      stats: {
        totalAgents: 10,
        activeAgents: 5,
        tokenUsage: 50000,
        successRate: 95,
        avgResponseTime: '1.2s',
        // Add other expected stats properties with default mock values
      },
      loading: false,
      error: null,
      refresh: jest.fn(),
    });

    mockUseDashboardMetrics.mockReturnValue({
      stats: { /* general metrics stats if any, often combined or derived */ },
      tokenMetrics: {
        tokenLimit: 100000,
        totalTokensUsage: 50000,
        tokenPercentage: 50,
        remainingTokens: 50000,
        dailyAverage: 1666,
        // tokenUsageData: [] // This was the prop for TokenUsageCard, ensure it's mocked if needed by the card directly
      },
      agentMetrics: {
        activeAgents: 5,
        totalAgents: 10,
        activePercentage: 50,
        // agents: [] // This was the prop for AgentActivityCard, ensure it's mocked if needed by the card directly
      },
    });
  });

  test('renders dashboard page without crashing', () => {
    renderDashboard();
    // Check for a high-level element, like the main dashboard container or a title
    // For now, just ensuring it doesn't throw an error during render is a good start.
    // We'll add more specific assertions next.
    expect(screen.getByText(/Visão Geral do Dashboard/i)).toBeInTheDocument();
  });

  describe('Stats Cards', () => {
    test('renders all four StatsCards', () => {
      renderDashboard();
      expect(screen.getByText('Total de Agentes')).toBeInTheDocument();
      expect(screen.getByText('Uso de Tokens')).toBeInTheDocument();
      expect(screen.getByText('Taxa de Sucesso')).toBeInTheDocument();
      expect(screen.getByText('Tempo de Resposta')).toBeInTheDocument();
    });

    test('renders "Total de Agentes" card with correct data', () => {
      renderDashboard();
      // Values from mockUseDashboard.stats
      expect(screen.getByText('Total de Agentes').closest('.mantine-Card-root') || screen.getByText('Total de Agentes').closest('div[class*="Card"]')).toHaveTextContent('10'); // totalAgents
      expect(screen.getByText('Total de Agentes').closest('.mantine-Card-root') || screen.getByText('Total de Agentes').closest('div[class*="Card"]')).toHaveTextContent('5 ativos'); // activeAgents
    });

    test('renders "Uso de Tokens" card with correct data', () => {
      renderDashboard();
      // Value from mockUseDashboard.stats, description from mockUseDashboardMetrics.tokenMetrics
      expect(screen.getByText('Uso de Tokens').closest('.mantine-Card-root') || screen.getByText('Uso de Tokens').closest('div[class*="Card"]')).toHaveTextContent('50,000'); // tokenUsage formatted
      expect(screen.getByText('Uso de Tokens').closest('.mantine-Card-root') || screen.getByText('Uso de Tokens').closest('div[class*="Card"]')).toHaveTextContent('50% do limite mensal'); // tokenPercentage
    });

    test('renders "Taxa de Sucesso" card with correct data', () => {
      renderDashboard();
      // Value from mockUseDashboard.stats
      expect(screen.getByText('Taxa de Sucesso').closest('.mantine-Card-root') || screen.getByText('Taxa de Sucesso').closest('div[class*="Card"]')).toHaveTextContent('95%'); // successRate
      expect(screen.getByText('Taxa de Sucesso').closest('.mantine-Card-root') || screen.getByText('Taxa de Sucesso').closest('div[class*="Card"]')).toHaveTextContent('Baseado nas últimas interações');
    });

    test('renders "Tempo de Resposta" card with correct data', () => {
      renderDashboard();
      // Value from mockUseDashboard.stats
      expect(screen.getByText('Tempo de Resposta').closest('.mantine-Card-root') || screen.getByText('Tempo de Resposta').closest('div[class*="Card"]')).toHaveTextContent('1.2s'); // avgResponseTime
      expect(screen.getByText('Tempo de Resposta').closest('.mantine-Card-root') || screen.getByText('Tempo de Resposta').closest('div[class*="Card"]')).toHaveTextContent('Média de resposta');
    });
  });

  describe('TokenUsageCard', () => {
    test('renders TokenUsageCard with title and mock chart', () => {
      renderDashboard();
      expect(screen.getByText('Uso de Tokens').closest('div[class*="Card"]')).toBeInTheDocument(); // Title check is part of StatsCard, this checks the chart card title
      // Find the specific TokenUsageCard by its more unique title if necessary, or a data-testid
      // For now, assuming the title "Uso de Tokens" is unique enough for this card's header
      const tokenUsageCard = screen.getAllByText('Uso de Tokens').find(el => el.tagName === 'H3' || el.classList.contains('text-lg'))?.closest('div[class*="Card"]');
      expect(tokenUsageCard).toBeInTheDocument();
      expect(screen.getByTestId('mock-line-chart')).toBeInTheDocument();
    });
  });

  describe('AgentActivityCard', () => {
    test('renders AgentActivityCard with title and period selector', () => {
      renderDashboard();
      expect(screen.getByText('Atividade dos Agentes')).toBeInTheDocument();
      expect(screen.getByText('Hoje')).toBeInTheDocument(); // Checks if one of the SelectItems is rendered
      // More robust: check for the SelectTrigger with a placeholder or current value
      expect(screen.getByRole('combobox', { name: /período/i })).toBeInTheDocument();
    });

    test('AgentActivityCard displays content based on mockAgentActivityData from Dashboard.tsx', () => {
      renderDashboard();
      // Since mockAgentActivityData in Dashboard.tsx is not empty, 
      // it should display the message for data presence.
      // The actual mock data has 3 records.
      expect(screen.getByText(/Gráfico de atividade dos agentes/i)).toBeInTheDocument();
      expect(screen.getByText(/3 registros no período selecionado/i)).toBeInTheDocument();
    });
  });

  // TODO: Add tests for interactions (e.g., period change, refresh button)
});
