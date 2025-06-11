import { describe, expect, test, vi, afterEach } from 'vitest'
import apiClient from './apiClient'
import {
  fetchTools,
  createTool,
  updateTool,
  deleteTool,
  ToolDTO,
  CreateToolDTO,
} from './toolService'

// Mock o apiClient
vi.mock('./apiClient')

const mockTools: ToolDTO[] = [
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
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('fetchTools', () => {
    test('should fetch tools successfully', async () => {
      // Mock da resposta do apiClient.get
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockTools })

      const tools = await fetchTools()

      expect(apiClient.get).toHaveBeenCalledWith('/tools')
      expect(tools).toEqual(mockTools)
      expect(tools.length).toBe(2)
    })
  })

  describe('createTool', () => {
    test('should create a new tool successfully', async () => {
      const newToolData: CreateToolDTO = {
        name: 'New Tool',
        description: 'A brand new tool.',
      }
      const createdTool: ToolDTO = { id: '3', ...newToolData }

      vi.mocked(apiClient.post).mockResolvedValue({ data: createdTool })

      const result = await createTool(newToolData)

      expect(apiClient.post).toHaveBeenCalledWith('/tools', newToolData)
      expect(result).toEqual(createdTool)
    })
  })

  describe('updateTool', () => {
    test('should update an existing tool successfully', async () => {
      const toolId = '1'
      const updateData: Partial<CreateToolDTO> = {
        name: 'Updated Test Tool 1',
      }
      const updatedTool: ToolDTO = { ...mockTools[0], ...updateData }

      vi.mocked(apiClient.put).mockResolvedValue({ data: updatedTool })

      const result = await updateTool(toolId, updateData)

      expect(apiClient.put).toHaveBeenCalledWith(`/tools/${toolId}`, updateData)
      expect(result).toEqual(updatedTool)
    })
  })

  describe('deleteTool', () => {
    test('should delete a tool successfully', async () => {
      const toolId = '1'
      // Mock para uma resposta sem conteúdo (204 No Content)
      vi.mocked(apiClient.delete).mockResolvedValue({ data: null })

      await deleteTool(toolId)

      expect(apiClient.delete).toHaveBeenCalledWith(`/tools/${toolId}`)
    })
  })
})