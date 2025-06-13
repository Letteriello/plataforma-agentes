import { create } from 'zustand'

import { fetchTools as apiFetchTools,ToolDTO } from '@/api/toolService'

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
      const tools = await apiFetchTools()
      set({ tools, isLoading: false })
    } catch (error) {
      console.error('Failed to fetch tools:', error)
      set({ error: 'Failed to fetch tools.', isLoading: false })
    }
  },
  addTool: (tool: ToolDTO) =>
    set((state: ToolState) => ({ tools: [...state.tools, tool] })),
  updateTool: (updatedTool: ToolDTO) =>
    set((state: ToolState) => ({
      tools: state.tools.map((t) => (t.id === updatedTool.id ? updatedTool : t)),
    })),
  removeTool: (toolId: string) =>
    set((state: ToolState) => ({
      tools: state.tools.filter((t) => t.id !== toolId),
    })),
}))
