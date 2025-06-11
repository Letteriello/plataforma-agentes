import { describe, expect, test, vi } from 'vitest';
import toolService from './toolService';
// Removed: import { useToolStore } from '@/store/toolStore';
import { Tool } from '@/types'; // Tool might still be needed if mock-tools.json uses it
import mockToolsData from '@/data/mock-tools.json'; // Import the actual mock data

// Removed: vi.mock('@/store/toolStore');

// Removed: const mockTools: Tool[] = [ ... ];

// Removed: (useToolStore as unknown as vi.Mock).getState = vi.fn(...);

describe('toolService', () => {
  test('fetchTools returns tools directly from mock JSON', async () => {
    const tools = await toolService.fetchTools();
    // Ensure the type casting if mockToolsData is not already Tool[]
    expect(tools).toEqual(mockToolsData as Tool[]);
  });
});
