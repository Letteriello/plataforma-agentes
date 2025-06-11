import { vi, describe, beforeEach, test, expect } from 'vitest'
import agentService from './agentService'
import apiClient from '@/api/apiClient' // Import apiClient to mock it
import { AgentType, LlmAgentConfig } from '@/types/agent' // Assuming AnyAgentConfig is not needed for these specific tests now

// Remove store mocks as agentService directly uses apiClient, not the store's state-modifying functions.
// const addAgent = vi.fn();
// const updateAgent = vi.fn();
// const removeAgent = vi.fn();

// vi.mock('@/store/agentStore', () => ({
//   useAgentStore: {
//     getState: () => ({ addAgent, updateAgent, removeAgent }),
//   },
// }));

vi.mock('../apiClient') // Mock apiClient

beforeEach(() => {
  vi.clearAllMocks() // Clears all mocks including apiClient if methods are mocked individually
})

describe('agentService', () => {
  // Tests for saveAgent are removed as saveAgent does not exist on agentService.
  // Proper tests for createAgent and updateAgent would mock apiClient.post and apiClient.put.

  test('deleteAgent should call apiClient.delete with the correct URL', async () => {
    const agentId = 'abc'
    const mockDelete = vi.fn().mockResolvedValueOnce({}) // Mock apiClient.delete
    ;(apiClient.delete as vi.Mock).mockImplementation(mockDelete)

    await agentService.deleteAgent(agentId)

    expect(mockDelete).toHaveBeenCalledWith(`/agents/${agentId}`)
    // We are not checking removeAgent from the store here, as the service doesn't call it.
  })

  // Example test for createAgent (if time permitted, similar for updateAgent)
  test('createAgent should call apiClient.post with the correct config', async () => {
    const configWithoutId: Omit<LlmAgentConfig, 'id'> = {
      name: 'New',
      type: AgentType.LLM,
      instruction: '',
      model: 'gpt',
      code_execution: false,
      planning_enabled: false,
      tools: [],
    }
    const mockPost = vi
      .fn()
      .mockResolvedValueOnce({ data: { ...configWithoutId, id: 'newId' } })
    ;(apiClient.post as vi.Mock).mockImplementation(mockPost)

    await agentService.createAgent(configWithoutId)
    expect(mockPost).toHaveBeenCalledWith('/agents', configWithoutId)
  })
})
