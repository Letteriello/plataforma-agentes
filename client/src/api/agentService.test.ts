import { beforeEach, describe, expect, test, vi } from 'vitest'

import apiClient from '@/api/apiClient'
import agentService from '@/api/agentService'
import { AgentType, type LlmAgentConfig } from '@/types/adk'

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

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockedApiClient.delete).toHaveBeenCalledWith(`/agents/${agentId}`)
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockedApiClient.delete).toHaveBeenCalledTimes(1)
  })

  test('createAgent should call apiClient.post with the correct payload', async () => {
    const newAgentConfig: Omit<LlmAgentConfig, 'id'> = {
      name: 'Test Agent',
      description: 'A description for the test agent.',
      type: AgentType.LLM,
      instruction: 'Be a helpful assistant.',
      model: 'gpt-4-turbo',
      codeExecution: true,
      planningEnabled: true,
      tools: [],
    }

    // Simulate a successful API response
    const expectedResponse = { ...newAgentConfig, id: 'new-agent-id' }
    mockedApiClient.post.mockResolvedValueOnce({ data: expectedResponse })

    await agentService.createAgent(newAgentConfig)

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockedApiClient.post).toHaveBeenCalledWith('/agents', newAgentConfig)
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockedApiClient.post).toHaveBeenCalledTimes(1)
  })
})
