import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { LlmAgentConfig } from '@/types/agent'

import { AgentIdentity } from './AgentIdentity'

vi.mock('./EditDescriptionDialog', () => ({
  EditDescriptionDialog: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div>Diálogo de Descrição Aberto</div> : null,
}))

describe('AgentIdentity', () => {
  const mockConfig: Partial<LlmAgentConfig> = {
    name: 'Agente Teste',
    description: 'Descrição de teste.',
    model: 'gemini-pro',
  }

  const mockOnInputChange = vi.fn()
  const mockOnSelectChange = vi.fn()
  const mockOnDescriptionSave = vi.fn()

  it('deve renderizar os valores iniciais corretamente', () => {
    render(
      <AgentIdentity
        config={mockConfig as LlmAgentConfig}
        onInputChange={mockOnInputChange}
        onSelectChange={mockOnSelectChange}
        onDescriptionSave={mockOnDescriptionSave}
      />,
    )

    expect(screen.getByLabelText(/Nome do Agente/i)).toHaveValue('Agente Teste')
    expect(screen.getByLabelText(/Descrição do Agente/i)).toHaveValue(
      'Descrição de teste.',
    )
    expect(screen.getByText('Gemini Pro')).toBeInTheDocument()
  })

  it('deve chamar onInputChange quando o nome do agente é alterado', async () => {
    const user = userEvent.setup()
    render(
      <AgentIdentity
        config={mockConfig as LlmAgentConfig}
        onInputChange={mockOnInputChange}
        onSelectChange={mockOnSelectChange}
        onDescriptionSave={mockOnDescriptionSave}
      />,
    )

    const nameInput = screen.getByLabelText(/Nome do Agente/i)
    await user.clear(nameInput)
    await user.type(nameInput, 'Novo Nome')

    expect(mockOnInputChange).toHaveBeenCalled()
  })

  it('deve abrir o diálogo de descrição ao clicar no botão editar', async () => {
    const user = userEvent.setup()
    render(
      <AgentIdentity
        config={mockConfig as LlmAgentConfig}
        onInputChange={mockOnInputChange}
        onSelectChange={mockOnSelectChange}
        onDescriptionSave={mockOnDescriptionSave}
      />,
    )

    expect(
      screen.queryByText('Diálogo de Descrição Aberto'),
    ).not.toBeInTheDocument()

    const editButton = screen.getByRole('button', { name: /Editar Descrição/i })
    await user.click(editButton)

    expect(screen.getByText('Diálogo de Descrição Aberto')).toBeInTheDocument()
  })
})
