import { http, HttpResponse } from 'msw';
import { v4 as uuidv4 } from 'uuid';

import { AgentType, type AgentCreateDTO, type AgentDetailDTO, type AgentSummaryDTO, type AgentUpdateDTO } from '@/types/agents';
import type { ToolDTO } from '@/types/tools';

// Mock Database for Agents
let mockAgents: AgentDetailDTO[] = [];

const createInitialAgents = (): AgentDetailDTO[] => [
  {
    id: 'agent-1',
    name: 'Weather Forecaster',
    description: 'Provides weather forecasts.',
    model: 'gpt-4',
    instruction: 'You are a weather forecaster. Provide the weather for the given location.',
    temperature: 0.7,
    max_output_tokens: 1024,
    top_p: 1,
    top_k: 40,
    autonomy_level: 'auto',
    is_public: true,
    version: '1.0.0',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: 'user-1',
    tools: [],
  },
  {
    id: 'agent-2',
    name: 'Email Assistant',
    description: 'Helps with writing and sending emails.',
    model: 'claude-2',
    instruction: 'You are an email assistant. Help the user with their emails.',
    temperature: 0.8,
    max_output_tokens: 2048,
    top_p: 1,
    top_k: 40,
    autonomy_level: 'ask',
    is_public: false,
    version: '1.1.0',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: 'user-1',
    tools: [],
  },
];

export const resetMockAgentsDB = () => {
  mockAgents = createInitialAgents();
};

// Initialize DB
resetMockAgentsDB();

const mockTools: ToolDTO[] = [
  {
    id: '1',
    name: 'get_weather',
    description: 'Get the current weather for a specific location.',
    parameters: {
      type: 'object',
      properties: {
        location: { type: 'string', description: 'The city and state, e.g., San Francisco, CA' },
      },
      required: ['location'],
    },
  },
  {
    id: '2',
    name: 'send_email',
    description: 'Sends an email to a recipient.',
    parameters: {
      type: 'object',
      properties: {
        recipient: { type: 'string', description: 'Email address of the recipient.' },
        subject: { type: 'string', description: 'The subject of the email.' },
        body: { type: 'string', description: 'The body content of the email.' },
      },
      required: ['recipient', 'subject', 'body'],
    },
  },
];

export const handlers = [
  // Tools API
  http.get('/api/tools', () => {
    return HttpResponse.json(mockTools);
  }),

  // Agents API - CRUD
  http.get('/api/agents', () => {
    const summaryList: AgentSummaryDTO[] = mockAgents.map(
      ({ id, name, description, is_public, version, created_at, updated_at }) => ({
        id,
        name,
        description,
        type: AgentType.LLM, // All mocks are currently LLM type
        is_public,
        version,
        created_at,
        updated_at,
        avatar_url: null,
      }),
    );
    return HttpResponse.json(summaryList);
  }),

  http.get('/api/agents/:id', ({ params }) => {
    const agent = mockAgents.find(a => a.id === params.id);
    return agent ? HttpResponse.json(agent) : new HttpResponse(null, { status: 404 });
  }),

  http.post('/api/agents', async ({ request }) => {
    const newAgentData = (await request.json()) as AgentCreateDTO;
    const newAgent: AgentDetailDTO = {
      id: uuidv4(),
      ...newAgentData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: 'user-1', // Mocked user
      tools: [], // Tools are associated separately
    };
    mockAgents.push(newAgent);
    return HttpResponse.json(newAgent, { status: 201 });
  }),

  http.put('/api/agents/:id', async ({ params, request }) => {
    const updateData = (await request.json()) as AgentUpdateDTO;
    const agentIndex = mockAgents.findIndex(a => a.id === params.id);
    if (agentIndex !== -1) {
      mockAgents[agentIndex] = { ...mockAgents[agentIndex], ...updateData };
      return HttpResponse.json(mockAgents[agentIndex]);
    }
    return new HttpResponse(null, { status: 404 });
  }),

  http.delete('/api/agents/:id', ({ params }) => {
    const agentIndex = mockAgents.findIndex(a => a.id === params.id);
    if (agentIndex !== -1) {
      mockAgents.splice(agentIndex, 1);
      return new HttpResponse(null, { status: 204 });
    }
    return new HttpResponse(null, { status: 404 });
  }),
];
