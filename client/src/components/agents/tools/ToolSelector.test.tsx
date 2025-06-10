import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { ToolSelector } from './ToolSelector';
import toolService from '@/api/toolService';

vi.mock('@/api/toolService');

const mockTools = [
  { id: '1', name: 'Search', description: 'Web search tool' },
  { id: '2', name: 'Translate', description: 'Translation tool' },
];

vi.mocked(toolService.fetchTools).mockResolvedValue(mockTools as any);

describe('ToolSelector', () => {
  test('filters tools based on search input', async () => {
    render(<ToolSelector selectedTools={[]} onSelectionChange={() => {}} />);

    // Wait for tools to load
    await screen.findByText('Search');

    fireEvent.change(screen.getByPlaceholderText('Buscar ferramenta...'), { target: { value: 'tran' } });

    expect(screen.getByText('Translate')).toBeInTheDocument();
    expect(screen.queryByText('Search')).not.toBeInTheDocument();
  });
});
