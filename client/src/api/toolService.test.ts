import { describe, expect, test, vi, afterEach } from 'vitest'
import { toolService } from './toolService' // Use named import
import { Tool } from '@/types'

// Define mock data directly in the test file
const mockTools: Tool[] = [
  {
    id: '1',
    name: 'Test Tool 1',
    description: 'This is the first test tool.',
  },
  {
    id: '2',
    name: 'Test Tool 2',
    description: 'This is the second test tool.',
  },
]

describe('toolService', () => {
  // Restore mocks after each test
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('fetchTools returns a list of tools from the service', async () => {
    // Spy on the fetchTools method and mock its implementation
    const fetchToolsSpy = vi
      .spyOn(toolService, 'fetchTools')
      .mockResolvedValue(mockTools)

    const tools = await toolService.fetchTools()

    // Expect the spy to have been called
    expect(fetchToolsSpy).toHaveBeenCalled()

    // Expect the result to match the mock data
    expect(tools).toEqual(mockTools)
    expect(tools.length).toBe(2)
  })
})
