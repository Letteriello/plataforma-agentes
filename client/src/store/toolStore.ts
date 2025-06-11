import { create } from 'zustand'
import { Tool } from '@/types'
import { toolService } from '@/api/toolService'

interface ToolState {
  tools: Tool[]
  isLoading: boolean
  error: string | null
}

interface ToolActions {
  fetchTools: () => Promise<void>
  addTool: (tool: Tool) => void
  updateTool: (tool: Tool) => void
  removeTool: (toolId: string) => void
}

export const useToolStore = create<ToolState & ToolActions>((set) => ({
  tools: [],
  isLoading: false,
  error: null,
  fetchTools: async () => {
    set({ isLoading: true, error: null })
    try {
      const tools = await toolService.fetchTools()
      set({ tools, isLoading: false })
    } catch (error) {
      console.error('Failed to fetch tools:', error)
      set({ error: 'Failed to fetch tools.', isLoading: false })
    }
  },
  addTool: (tool) => set((state) => ({ tools: [...state.tools, tool] })),
  updateTool: (tool) =>
    set((state) => ({
      tools: state.tools.map((t) => (t.id === tool.id ? tool : t)),
    })),
  removeTool: (toolId) =>
    set((state) => ({ tools: state.tools.filter((t) => t.id !== toolId) })),
}))
