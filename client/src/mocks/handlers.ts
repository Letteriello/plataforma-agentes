import { http, HttpResponse, delay } from 'msw';
import { v4 as uuidv4 } from 'uuid';
import { AnyAgentConfig, AgentType, LlmAgentConfig } from '@/types/core/agent'; // Using core types

// Define a simplified Document type for mock purposes
interface MockDocument {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
  status: 'Processando' | 'Concluído' | 'Falhou';
  // Add other relevant fields if necessary for your components
  knowledgeBaseId?: string; // Optional: to associate document with KB
}

// In-memory store for documents, keyed by knowledgeBaseId
let mockDocumentsDB = new Map<string, MockDocument[]>();

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

// Helper to reset the mock Documents DB for tests
export const resetMockDocumentsDB = () => {
  mockDocumentsDB.clear();
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
//
//   // Save agent (Create or Update)
  http.post('/api/agents', async ({ request }) => {
    await delay(150);
    const newAgentData = await request.json() as Partial<AnyAgentConfig>;

    if (!newAgentData || !newAgentData.name || !newAgentData.type) { // Added check for newAgentData itself
        return HttpResponse.json({ message: 'Invalid agent data: Name and type are required' }, { status: 400 });
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

  // Mock document upload
  http.post('/api/knowledge-bases/:id/documents', async ({ request, params }) => {
    await delay(500); // Simulate network latency

    let fileName = 'mock-document.pdf';
    let fileSize = Math.floor(Math.random() * 100000) + 10000; // Random size between 10KB and 1MB

    try {
      const formData = await request.formData();
      const file = formData.get('file'); // Assuming the file input name is 'file'
      if (file && typeof file === 'object' && 'name' in file) {
        fileName = file.name;
        if ('size' in file) {
            fileSize = file.size;
        }
      }
    } catch (e) {
      // FormData might not be fully processed or available in all test environments for MSW
      // Or the request might not actually contain FormData.
      // We can ignore this for basic mock and use defaults.
      console.warn('Could not process FormData in mock handler:', e);
    }

    const knowledgeBaseId = params.id as string;

    const newDocument: MockDocument = {
      id: uuidv4(),
      name: fileName,
      size: fileSize,
      uploadDate: new Date().toISOString(),
      status: 'Processando',
      knowledgeBaseId: knowledgeBaseId, // Store KB ID with doc
    };

    // Add to our in-memory DB
    const existingDocuments = mockDocumentsDB.get(knowledgeBaseId) || [];
    mockDocumentsDB.set(knowledgeBaseId, [...existingDocuments, newDocument]);

    return HttpResponse.json(newDocument, { status: 201 });
  }),

  // Mock get documents by Knowledge Base ID
  http.get('/api/knowledge-bases/:id/documents', async ({ params }) => {
    await delay(200);
    const knowledgeBaseId = params.id as string;
    const documents = mockDocumentsDB.get(knowledgeBaseId) || [];
    return HttpResponse.json(documents);
  }),
];

// Example of a specific error handler (e.g., server error for one endpoint)
export const serverErrorHandlers = [
    http.get('/api/agents', () => {
        return new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' })
    })
];
