import { create } from 'zustand';
import { Tool } from '@/types';
import mockTools from '@/data/mock-tools.json';

interface ToolState {
  tools: Tool[];
  isLoading: boolean;
  error: string | null;
}

interface ToolActions {
  loadTools: (tools: Tool[]) => void;
  addTool: (tool: Tool) => void;
  updateTool: (tool: Tool) => void;
  removeTool: (toolId: string) => void;
}

export const useToolStore = create<ToolState & ToolActions>((set) => ({
  tools: [],
  isLoading: false,
  error: null,
  loadTools: (tools) => set({ tools }),
  addTool: (tool) => set((state) => ({ tools: [...state.tools, tool] })),
  updateTool: (tool) =>
    set((state) => ({ tools: state.tools.map((t) => (t.id === tool.id ? tool : t)) })),
  removeTool: (toolId) =>
    set((state) => ({ tools: state.tools.filter((t) => t.id !== toolId) })),
}));

// Preload mock tools on init
useToolStore.getState().loadTools(mockTools as Tool[]);
