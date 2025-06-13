import { beforeEach, describe, expect, test, vi } from 'vitest'

import agentService from '@/api/agentService'
import apiClient from '@/api/apiClient'
import type { LlmAgentConfig } from '@/types/agents';
import type { ToolDTO, UiToolDefinition as SharedUiToolDefinition } from '@/types/tools';

// Mock the apiClient module to isolate the service from actual API calls
vi.mock('@/api/apiClient')

// Get a typed mock object for assertions
const mockedApiClient = vi.mocked(apiClient, true)

beforeEach(() => {
  // Reset mocks before each test to ensure isolation
  vi.clearAllMocks()
})

describe('agentService', () => {
  test('deleteAgent should call apiClient.delete with the correct URL', async () => {
    const agentId = 'test-agent-id'
    mockedApiClient.delete.mockResolvedValueOnce({})

    await agentService.deleteAgent(agentId)

     
    expect(mockedApiClient.delete).toHaveBeenCalledWith(`/agents/${agentId}`)
     
    expect(mockedApiClient.delete).toHaveBeenCalledTimes(1)
  })

  test('createAgent should call apiClient.post with the correct payload', async () => {
    // Define the payload based on the expected type for createAgent's first parameter
    const newAgentData: Omit<LlmAgentConfig, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'tools'> & { tools?: SharedUiToolDefinition[], knowledgeBaseIds?: string[] } = {
      name: 'Test Agent',
      description: 'A description for the test agent.',
      system_prompt: 'You are a helpful test assistant.',
      llm_model: 'gpt-4-test',
      temperature: 0.7,
      max_tokens: 500,
      is_public: false,
      version: '1.0.0',
      tools: [], // Empty array of tools (UiToolDefinition compatible)
      knowledgeBaseIds: [],
    };

    // The expected response from the API would be the full LlmAgentConfig
    const expectedResponse: LlmAgentConfig = {
      ...newAgentData,
      id: 'new-agent-id',
      user_id: 'test-user-id',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tools: [] as ToolDTO[], // createAgent internally converts UiToolDefinition to ToolDTO for API, and API returns LlmAgentConfig with ToolDTO[]
    };
    mockedApiClient.post.mockResolvedValueOnce({ data: expectedResponse });

    await agentService.createAgent(newAgentData);

    // The agentService.createAgent function transforms newAgentData before sending it to apiClient.post.
    // We need to assert against the transformed payload (CreateAgentAPIPayload).
    const expectedApiPayload = {
      name: 'Test Agent',
      description: 'A description for the test agent.',
      system_prompt: 'You are a helpful test assistant.',
      llm_model: 'gpt-4-test',
      temperature: 0.7,
      max_tokens: 500,
      is_public: false,
      version: '1.0.0',
      tools: [], // Transformed to ToolDTO[]
      knowledge_base_ids: [],
    };

     
    expect(mockedApiClient.post).toHaveBeenCalledWith('/agents', expectedApiPayload);
     
    expect(mockedApiClient.post).toHaveBeenCalledTimes(1);
  });
})
