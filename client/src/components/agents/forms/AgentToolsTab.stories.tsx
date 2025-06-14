import type { Meta, StoryObj } from '@storybook/react';
import { http } from 'msw';
import { FormProvider, useForm } from 'react-hook-form';

import { ToolDTO } from '@/api/toolService';
import { TooltipProvider } from '@/components/ui/tooltip';

import AgentToolsTab from './AgentToolsTab';

// Mock data for tools, simulating what an API would return.
const mockTools: ToolDTO[] = [
  {
    id: 'tool-weather-123',
    name: 'get_weather',
    description: 'Fetches the current weather for a given location.',
    parameters: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'The city and state, e.g., San Francisco, CA',
        },
        unit: {
          type: 'string',
          description: 'The unit for temperature, either "celsius" or "fahrenheit".',
          enum: ['celsius', 'fahrenheit'],
        },
      },
      required: ['location'],
    },
  },
  {
    id: 'tool-calculator-456',
    name: 'calculator',
    description: 'Performs a mathematical calculation.',
    parameters: {
      type: 'object',
      properties: {
        expression: {
          type: 'string',
          description: 'The mathematical expression to evaluate, e.g., "2 + 2 * 4".',
        },
      },
      required: ['expression'],
    },
  },
  {
    id: 'tool-db-query-789',
    name: 'database_query',
    description: 'Executes a read-only SQL query against the analytics database.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The SQL query to execute.',
        },
      },
      required: ['query'],
    },
  },
];

const meta: Meta<typeof AgentToolsTab> = {
  title: 'Agents/Forms/AgentToolsTab',
  component: AgentToolsTab,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Esta aba permite que o usuário selecione ferramentas (Tools) para o agente a partir de uma lista de ferramentas predefinidas. Ela lida com os estados de carregamento, erro e sucesso da busca de ferramentas via API.',
      },
    },
  },
  decorators: [
    (Story, { args }) => {
      const formMethods = useForm({
        // Use defaultValues from the story's args, or a default state
        defaultValues: (args as any).defaultValues || {
          tools: [],
          detailedToolDefinitions: [],
        },
      });

      return (
        <TooltipProvider>
          <FormProvider {...formMethods}>
            <div className="p-6 max-w-4xl mx-auto">
              <Story />
            </div>
          </FormProvider>
        </TooltipProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof meta & { defaultValues?: { tools: string[] } }>;

/**
 * O estado padrão, exibindo uma lista de ferramentas disponíveis. 
 * O usuário pode selecionar quais ferramentas o agente poderá usar.
 */
export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/tools', (req, res, ctx) => {
          return res(ctx.json(mockTools));
        }),
      ],
    },
  },
};

/**
 * Simula um cenário de edição onde múltiplas ferramentas já vêm selecionadas.
 */
export const MultipleToolsSelected: Story = {
  args: {
    defaultValues: {
      tools: [mockTools[0].id, mockTools[2].id], // Pre-seleciona a ferramenta de clima e de banco de dados
    },
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/tools', (req, res, ctx) => {
          return res(ctx.json(mockTools));
        }),
      ],
    },
  },
};

/**
 * Simula o estado de carregamento, exibindo um esqueleto de UI enquanto as ferramentas são buscadas.
 */
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/tools', (req, res, ctx) => {
          return res(ctx.delay('infinite')); // Simula uma resposta de API pendente
        }),
      ],
    },
  },
};

/**
 * Simula um estado de erro na API. Uma mensagem de erro é exibida para o usuário.
 */
export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/tools', (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ message: 'Falha ao buscar ferramentas' }));
        }),
      ],
    },
  },
};

/**
 * Simula um estado onde nenhuma ferramenta está disponível. A UI deve exibir uma mensagem indicando que a lista está vazia.
 */
export const NoToolsAvailable: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/tools', (req, res, ctx) => {
          return res(ctx.json([])); // Retorna um array vazio
        }),
      ],
    },
  },
};
