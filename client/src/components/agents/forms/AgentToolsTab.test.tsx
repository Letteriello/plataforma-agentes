import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import { vi } from 'vitest';
import { AgentToolsTab } from './AgentToolsTab';
import toolService from '@/api/toolService';
import { LLMAgentSchema, LLMAgent } from '@/types/agents';

vi.mock('@/api/toolService');

const mockTools = [
  { id: 'web_search', name: 'Web Search', description: 'Search the web' },
  { id: 'calculator', name: 'Calculator', description: 'Do math' },
];

(toolService.fetchTools as unknown as vi.Mock).mockResolvedValue(mockTools);

function renderWithForm(initial?: Partial<LLMAgent>) {
  const methods = useForm<LLMAgent>({ defaultValues: { ...LLMAgentSchema.parse({}), ...initial } });
  const utils = render(
    <FormProvider {...methods}>
      <AgentToolsTab />
    </FormProvider>
  );
  return { methods, ...utils };
}

describe('AgentToolsTab', () => {
  it('loads and selects tools', async () => {
    const { methods } = renderWithForm();
    await waitFor(() => {
      expect(screen.getByLabelText('Web Search')).toBeInTheDocument();
    });

    const checkbox = screen.getByLabelText('Web Search');
    await userEvent.click(checkbox);
    expect(methods.getValues('tools')).toContain('web_search');
  });
});
