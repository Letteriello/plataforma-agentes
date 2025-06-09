import { describe, expect, test, vi } from 'vitest';
import toolService from './toolService';
import { useToolStore } from '@/store/toolStore';
import { Tool } from '@/types';

vi.mock('@/store/toolStore');

const mockTools: Tool[] = [
  { id: 't1', name: 'Tool 1', description: 'd1' },
];

(useToolStore as unknown as vi.Mock).getState = vi.fn(() => ({
  tools: mockTools,
  loadTools: vi.fn(),
  addTool: vi.fn(),
  updateTool: vi.fn(),
  removeTool: vi.fn(),
}));

describe('toolService', () => {
  test('fetchTools returns tools', async () => {
    const tools = await toolService.fetchTools();
    expect(tools).toEqual(mockTools);
  });
});
