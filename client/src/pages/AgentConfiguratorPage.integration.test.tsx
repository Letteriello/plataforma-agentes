import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import AgentConfiguratorPage from './AgentConfiguratorPage';
import * as agentService from '@/api/agentService';

vi.mock('@/api/agentService', () => ({
  __esModule: true,
  default: { saveAgent: vi.fn().mockResolvedValue({ success: true }) },
  agentService: { saveAgent: vi.fn().mockResolvedValue({ success: true }) }
}));

describe.skip('AgentConfiguratorPage Integration Flow', () => {
  it('deve permitir que o usuário edite a descrição e veja a atualização na tela', async () => {
    const user = userEvent.setup();
    render(<AgentConfiguratorPage />);

    const descriptionDisplay = screen.getByLabelText(/Descrição do Agente/i);
    expect(descriptionDisplay).toHaveValue('Um agente de IA para testes.');

    const editButton = screen.getByRole('button', { name: /Editar Descrição/i });
    await user.click(editButton);

    const dialogTextarea = screen.getByPlaceholderText(/Descreva o propósito/i);
    await user.clear(dialogTextarea);
    await user.type(dialogTextarea, 'Nova descrição integrada');

    const saveButton = screen.getByRole('button', { name: /Salvar Descrição/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(descriptionDisplay).toHaveValue('Nova descrição integrada');
  });

  it('deve mostrar um erro se o nome do agente estiver em branco ao salvar', async () => {
    const user = userEvent.setup();
    render(<AgentConfiguratorPage />);

    const nameInput = screen.getByLabelText(/Nome do Agente/i);
    await user.clear(nameInput);

    const mainSaveButton = screen.getByRole('button', { name: /Salvar Configuração do Agente/i });
    await user.click(mainSaveButton);

    expect(agentService.agentService.saveAgent).not.toHaveBeenCalled();
    expect(await screen.findByText(/O nome do agente é obrigatório/i)).toBeInTheDocument();
  });
});
