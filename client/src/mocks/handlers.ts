import { http, HttpResponse, delay } from 'msw';
import { AnyAgentConfig, AgentType, LlmAgentConfig } from '@/types/core/agent'; // Using core types

let mockAgentsDB: AnyAgentConfig[] = [
  {
    id: 'agent-1',
    name: 'LLM Agent 1',
    type: AgentType.LLM,
    model: 'gpt-3.5-turbo',
    instruction: 'You are agent 1',
    version: '1.0.0',
    description: 'Description for LLM Agent 1',
    isPublic: true,
    tags: ['llm', 'test'],
    temperature: 0.7,
    maxTokens: 1000,
    topP: 1,
    topK: 40,
    stopSequences: [],
    frequencyPenalty: 0,
    presencePenalty: 0,
    systemPrompt: '',
    tools: [],
  },
  {
    id: 'agent-2',
    name: 'Sequential Agent 2',
    type: AgentType.SEQUENTIAL,
    agents: [],
    version: '1.0.0',
    description: 'Description for Sequential Agent 2',
    isPublic: false,
    tags: ['workflow'],
    workflowType: 'sequential', // Required for SequentialAgentConfig
    maxIterations: 10,
    stopCondition: '',
    continueOnError: false,
  },
];

// Helper to reset the mock DB for tests if needed
export const resetMockAgentsDB = (initialState?: AnyAgentConfig[]) => {
  mockAgentsDB = initialState ? JSON.parse(JSON.stringify(initialState)) : [
    {
      id: 'agent-1', name: 'LLM Agent 1', type: AgentType.LLM, model: 'gpt-3.5-turbo', instruction: 'You are agent 1', version: '1.0.0', description: 'Description for LLM Agent 1', isPublic: true, tags: ['llm', 'test'], temperature: 0.7, maxTokens: 1000, topP: 1, topK: 40, stopSequences: [], frequencyPenalty: 0, presencePenalty: 0, systemPrompt: '', tools: []
    },
    {
      id: 'agent-2', name: 'Sequential Agent 2', type: AgentType.SEQUENTIAL, agents: [], version: '1.0.0', description: 'Description for Sequential Agent 2', isPublic: false, tags: ['workflow'], workflowType: 'sequential', maxIterations: 10, stopCondition: '', continueOnError: false,
    },
  ];
};


export const handlers = [
  // Fetch all agents
  http.get('/api/agents', async () => {
    await delay(100);
    return HttpResponse.json(mockAgentsDB);
  }),

  // Fetch agent by ID
  http.get('/api/agents/:id', async ({ params }) => {
    await delay(100);
    const agent = mockAgentsDB.find(a => a.id === params.id);
    if (agent) {
      return HttpResponse.json(agent);
    }
    return new HttpResponse(null, { status: 404, statusText: 'Agent not found' });
  }),

  // Save agent (Create or Update)
  http.post('/api/agents', async ({ request }) => {
    await delay(150);
    const newAgentData = await request.json() as Partial<AnyAgentConfig>;

    if (!newAgentData.name || !newAgentData.type) {
        return HttpResponse.json({ message: 'Name and type are required' }, { status: 400 });
    }

    if (newAgentData.id) { // Update
      const index = mockAgentsDB.findIndex(a => a.id === newAgentData.id);
      if (index !== -1) {
        // Ensure all required fields are present for the specific agent type after merge
        const updatedAgent = { ...mockAgentsDB[index], ...newAgentData } as AnyAgentConfig;
        mockAgentsDB[index] = updatedAgent;
        return HttpResponse.json(updatedAgent);
      } else {
        // This case should ideally not happen if ID is managed by backend for updates
        // For mocks, we can treat as error or create if desired. Here, error.
        return new HttpResponse(null, { status: 404, statusText: 'Agent to update not found' });
      }
    } else { // Create
      const newAgent = {
        id: `agent-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        version: '1.0.0',
        description: '',
        isPublic: false,
        tags: [],
        // Defaults for LLM if type is LLM, adjust as needed for other types
        ...(newAgentData.type === AgentType.LLM && {
            model: 'default-model',
            instruction: 'default instruction',
            temperature: 0.7, maxTokens: 1024, topP: 1, topK: 40,
            tools: [], stopSequences: [], frequencyPenalty: 0, presencePenalty: 0, systemPrompt: '',
        }),
        ...(newAgentData.type === AgentType.SEQUENTIAL && {
            agents: [], workflowType: 'sequential', maxIterations: 10, stopCondition: '', continueOnError: false,
        }),
        // Add other type defaults here
        ...newAgentData,
      } as AnyAgentConfig;
      mockAgentsDB.push(newAgent);
      return HttpResponse.json(newAgent, { status: 201 });
    }
  }),

  // Alternative for Update if using PUT
   http.put('/api/agents/:id', async ({ request, params }) => {
    await delay(150);
    const updatedData = await request.json() as Partial<AnyAgentConfig>;
    const agentId = params.id;

    if (!updatedData.name || !updatedData.type) {
        return HttpResponse.json({ message: 'Name and type are required' }, { status: 400 });
    }

    const index = mockAgentsDB.findIndex(a => a.id === agentId);
    if (index !== -1) {
      mockAgentsDB[index] = { ...mockAgentsDB[index], ...updatedData } as AnyAgentConfig;
      return HttpResponse.json(mockAgentsDB[index]);
    }
    return new HttpResponse(null, { status: 404, statusText: 'Agent not found for update' });
  }),

  // Delete agent
  http.delete('/api/agents/:id', async ({ params }) => {
    await delay(100);
    const initialLength = mockAgentsDB.length;
    mockAgentsDB = mockAgentsDB.filter(a => a.id !== params.id);
    if (mockAgentsDB.length < initialLength) {
      return new HttpResponse(null, { status: 204 });
    }
    return new HttpResponse(null, { status: 404, statusText: 'Agent not found for deletion' });
  }),
];

// Example of a specific error handler (e.g., server error for one endpoint)
export const serverErrorHandlers = [
    http.get('/api/agents', () => {
        return new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' })
    })
];
