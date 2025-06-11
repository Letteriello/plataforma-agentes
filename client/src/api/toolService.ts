import { Tool } from '@/types';
// Removed: import { useToolStore } from '@/store/toolStore';
import mockTools from '@/data/mock-tools.json';

// Removed: const SIMULATED_DELAY_MS = 300;
// Removed: const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface IToolService {
  fetchTools(): Promise<Tool[]>;
  // Removed: addTool(tool: Tool): Promise<Tool>;
  // Removed: updateTool(tool: Tool): Promise<Tool>;
  // Removed: deleteTool(toolId: string): Promise<void>;
}

export const toolService: IToolService = {
  async fetchTools(): Promise<Tool[]> {
    // Removed delay simulation and store logic
    return mockTools as Tool[];
  },

  // Removed addTool, updateTool, and deleteTool methods
};

export default toolService;
