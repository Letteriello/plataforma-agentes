import { http, HttpResponse } from 'msw';
import { v4 as uuidv4 } from 'uuid';

import type { AgentDetailDTO, AgentSummaryDTO, CreateAgentDTO, UpdateAgentDTO } from '@/api/agentService';
import type { ToolDTO } from '@/api/toolService';
import { AgentType } from '@/types/adk';

// Mock Database for Agents
let mockAgents: AgentDetailDTO[] = [
  {
    id: 'agent-1',
    name: 'Weather Forecaster',
    description: 'Provides weather forecasts.',
    type: AgentType.LLM,
    instruction: 'You are a weather forecaster. Provide the weather for the given location.',
  },
  {
    id: 'agent-2',
    name: 'Email Assistant',
    description: 'Helps with writing and sending emails.',
    type: AgentType.LLM,
    instruction: 'You are an email assistant. Help the user with their emails.',
  },
];

export const resetMockAgentsDB = () => {
  mockAgents = [
    {
      id: 'agent-1',
      name: 'Weather Forecaster',
      description: 'Provides weather forecasts.',
      type: AgentType.LLM,
      instruction: 'You are a weather forecaster. Provide the weather for the given location.',
    },
    {
      id: 'agent-2',
      name: 'Email Assistant',
      description: 'Helps with writing and sending emails.',
      type: AgentType.LLM,
      instruction: 'You are an email assistant. Help the user with their emails.',
    },
  ];
};

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
    const summaryList: AgentSummaryDTO[] = mockAgents.map(({ id, name, description, type }) => ({ id, name, description, type: type as 'LLM' | 'Workflow' | 'Custom' }));
    return HttpResponse.json(summaryList);
  }),

  http.get('/api/agents/:id', ({ params }) => {
    const agent = mockAgents.find(a => a.id === params.id);
    if (agent) {
      return HttpResponse.json(agent);
    } else {
      return new HttpResponse(null, { status: 404 });
    }
  }),

  http.post('/api/agents', async ({ request }) => {
    const newAgentData = await request.json() as CreateAgentDTO;
    const newAgent: AgentDetailDTO = {
      id: uuidv4(),
      ...newAgentData,
    };
    mockAgents.push(newAgent);
    return HttpResponse.json(newAgent, { status: 201 });
  }),

  http.put('/api/agents/:id', async ({ params, request }) => {
    const updateData = await request.json() as UpdateAgentDTO;
    const agentIndex = mockAgents.findIndex(a => a.id === params.id);
    if (agentIndex !== -1) {
      mockAgents[agentIndex] = { ...mockAgents[agentIndex], ...updateData };
      return HttpResponse.json(mockAgents[agentIndex]);
    } else {
      return new HttpResponse(null, { status: 404 });
    }
  }),

  http.delete('/api/agents/:id', ({ params }) => {
    const agentIndex = mockAgents.findIndex(a => a.id === params.id);
    if (agentIndex !== -1) {
      mockAgents.splice(agentIndex, 1);
      return new HttpResponse(null, { status: 204 });
    } else {
      return new HttpResponse(null, { status: 404 });
    }
  }),
];
