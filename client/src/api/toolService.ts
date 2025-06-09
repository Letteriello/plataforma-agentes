import { Tool } from '@/types';
import { useToolStore } from '@/store/toolStore';
import mockTools from '@/data/mock-tools.json';

const SIMULATED_DELAY_MS = 300;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface IToolService {
  fetchTools(): Promise<Tool[]>;
  addTool(tool: Tool): Promise<Tool>;
  updateTool(tool: Tool): Promise<Tool>;
  deleteTool(toolId: string): Promise<void>;
}

export const toolService: IToolService = {
  async fetchTools() {
    await delay(SIMULATED_DELAY_MS);
    const { tools, loadTools } = useToolStore.getState();
    if (tools.length === 0) {
      loadTools(mockTools as Tool[]);
    }
    return [...useToolStore.getState().tools];
  },

  async addTool(tool: Tool) {
    await delay(SIMULATED_DELAY_MS);
    useToolStore.getState().addTool(tool);
    return tool;
  },

  async updateTool(tool: Tool) {
    await delay(SIMULATED_DELAY_MS);
    useToolStore.getState().updateTool(tool);
    return tool;
  },

  async deleteTool(toolId: string) {
    await delay(SIMULATED_DELAY_MS);
    useToolStore.getState().removeTool(toolId);
  },
};

export default toolService;
