import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import { beforeEach,describe, expect, it, vi } from 'vitest'

import { ToolDTO } from '@/api/toolService'
import { useToolStore } from '@/store/toolStore'
import { LLMAgent,LLMAgentSchema } from '@/types/agents'

import AgentToolsTab from './AgentToolsTab'

// Mock o store do Zustand
vi.mock('@/store/toolStore')

const mockTools: ToolDTO[] = [
  { id: 'web_search', name: 'Web Search', description: 'Search the web' },
  { id: 'calculator', name: 'Calculator', description: 'Do math' },
]

// Função auxiliar para renderizar o componente com o contexto do formulário
function renderWithForm(initialValues?: Partial<LLMAgent>) {
  const methods = useForm<LLMAgent>({
    defaultValues: { ...LLMAgentSchema.parse({}), ...initialValues },
  })

  const utils = render(
    <FormProvider {...methods}>
      <AgentToolsTab />
    </FormProvider>,
  )

  return { methods, ...utils }
}

describe('AgentToolsTab', () => {
  beforeEach(() => {
    // Configura o estado mockado do store antes de cada teste
    vi.mocked(useToolStore).mockReturnValue({
      tools: mockTools,
      isLoading: false,
      error: null,
      fetchTools: vi.fn().mockResolvedValue(void 0),
      addTool: vi.fn(),
      updateTool: vi.fn(),
      removeTool: vi.fn(),
    })
  })

  it('should load and display tools from the store', async () => {
    renderWithForm()

    // Verifica se as ferramentas mockadas são renderizadas
    await waitFor(() => {
      expect(screen.getByLabelText('Web Search')).toBeInTheDocument()
      expect(screen.getByLabelText('Calculator')).toBeInTheDocument()
    })
  })

  it('should select a tool and update the form state', async () => {
    const { methods } = renderWithForm()

    await waitFor(() => {
      expect(screen.getByLabelText('Web Search')).toBeInTheDocument()
    })

    const checkbox = screen.getByLabelText('Web Search')
    await userEvent.click(checkbox)

    // Verifica se o valor do formulário foi atualizado corretamente
    expect(methods.getValues('tools')).toContain('web_search')
  })

  it('should display loading state correctly', () => {
    vi.mocked(useToolStore).mockReturnValueOnce({
      tools: [],
      isLoading: true,
      error: null,
      fetchTools: vi.fn(),
      addTool: vi.fn(),
      updateTool: vi.fn(),
      removeTool: vi.fn(),
    })

    renderWithForm()
    expect(screen.getByText('Carregando ferramentas...')).toBeInTheDocument()
  })

  it('should display error state correctly', () => {
    vi.mocked(useToolStore).mockReturnValueOnce({
      tools: [],
      isLoading: false,
      error: 'Failed to load',
      fetchTools: vi.fn(),
      addTool: vi.fn(),
      updateTool: vi.fn(),
      removeTool: vi.fn(),
    })

    renderWithForm()
    expect(screen.getByText(/Erro ao carregar ferramentas/)).toBeInTheDocument()
  })
})