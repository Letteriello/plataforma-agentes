import { beforeEach, describe, expect, test, vi } from 'vitest'

import agentService from '@/api/agentService'
import apiClient from '@/api/apiClient'
import { AgentType } from '@/types/agents';
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
    const newAgentData: Omit<LlmAgentConfig, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'tools'> & { tools?: SharedUiToolDefinition[], knowledgeBaseIds?: string[] } = {
      name: 'Test Agent',
      description: 'A description for the test agent.',
      // type: AgentType.LLM, // This should be implicitly set by LlmAgentConfig or handled by the service
      model: 'gpt-4-test',
      instruction: 'You are a helpful test assistant.',
      generateContentConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
        topP: 1.0, // Add default or ensure it's optional in LlmAgentConfigSchema if not provided
        topK: 40,  // Add default or ensure it's optional
      },
      isPublic: false,
      version: '1.0.0',
      // autonomy_level and other LlmAgentConfig specific fields might be needed if not optional
      tools: [], 
      knowledgeBaseIds: [],
    };

    // The expected response from the API would be the full LlmAgentConfig
    const expectedResponse: LlmAgentConfig = {
      ...newAgentData,
      id: 'new-agent-id',
      userId: 'test-user-id', // Corrected to camelCase
      createdAt: new Date().toISOString(), // Corrected to camelCase
      updatedAt: new Date().toISOString(), // Corrected to camelCase
      type: AgentType.LLM, // LlmAgentConfig should have this
      // Ensure all fields from LlmAgentConfig are present or correctly spread from newAgentData
      // model, instruction, generateContentConfig are spread from newAgentData
      // isPublic, version are spread
      // autonomy_level, security_config, planner_config, code_executor_config might be needed if not optional and not in newAgentData
      tools: [] as ToolDTO[], 
    };
    mockedApiClient.post.mockResolvedValueOnce({ data: expectedResponse });

    await agentService.createAgent(newAgentData);

    // The agentService.createAgent function transforms newAgentData before sending it to apiClient.post.
    // We need to assert against the transformed payload (CreateAgentAPIPayload).
    // The service spreads newAgentData and replaces tools.
    const expectedApiPayload = {
      name: newAgentData.name,
      description: newAgentData.description,
      model: newAgentData.model,
      instruction: newAgentData.instruction,
      temperature: newAgentData.generateContentConfig.temperature,
      max_output_tokens: newAgentData.generateContentConfig.maxOutputTokens,
      top_p: newAgentData.generateContentConfig.topP,
      top_k: newAgentData.generateContentConfig.topK,
      isPublic: newAgentData.isPublic,
      version: newAgentData.version,
      knowledge_base_ids: [],
      tools: [],
    };

     
    expect(mockedApiClient.post).toHaveBeenCalledWith('/agents', expectedApiPayload);
     
    expect(mockedApiClient.post).toHaveBeenCalledTimes(1);
  });
})
