import { Tool } from '@/types'

export interface IToolService {
  fetchTools(): Promise<Tool[]>
  // Future methods for a real API service:
  // addTool(tool: Tool): Promise<Tool>;
  // updateTool(tool: Tool): Promise<Tool>;
  // deleteTool(toolId: string): Promise<void>;
}

export const toolService: IToolService = {
  async fetchTools(): Promise<Tool[]> {
    // This is a mock implementation.
    // In a real application, this would make an API call.
    console.log('Fetching tools from mock service...')
    // Simulate an API call with a delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    // Return an empty array to simulate no tools being available initially.
    return []
  },
}

export default toolService
