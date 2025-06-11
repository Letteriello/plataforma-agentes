import { create } from 'zustand'
import { fetchTools, ToolDTO } from '@/api/toolService'

interface ToolState {
  tools: ToolDTO[]
  isLoading: boolean
  error: string | null
}

interface ToolActions {
  fetchTools: () => Promise<void>
  addTool: (tool: ToolDTO) => void
  updateTool: (tool: ToolDTO) => void
  removeTool: (toolId: string) => void
}

export const useToolStore = create<ToolState & ToolActions>((set) => ({
  tools: [],
  isLoading: false,
  error: null,
  fetchTools: async () => {
    set({ isLoading: true, error: null })
    try {
      const tools = await fetchTools()
      set({ tools, isLoading: false })
    } catch (error) {
      console.error('Failed to fetch tools:', error)
      set({ error: 'Failed to fetch tools.', isLoading: false })
    }
  },
  addTool: (tool: ToolDTO) =>
    set((state) => ({ tools: [...state.tools, tool] })),
  updateTool: (updatedTool: ToolDTO) =>
    set((state) => ({
      tools: state.tools.map((tool) =>
        tool.id === updatedTool.id ? updatedTool : tool,
      ),
    })),
  removeTool: (toolId: string) =>
    set((state) => ({
      tools: state.tools.filter((tool) => tool.id !== toolId),
    })),
}))
