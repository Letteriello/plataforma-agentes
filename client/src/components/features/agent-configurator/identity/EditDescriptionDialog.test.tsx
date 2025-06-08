import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { EditDescriptionDialog } from './EditDescriptionDialog';

describe('EditDescriptionDialog', () => {
  const mockOnSave = vi.fn();
  const mockOnOpenChange = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('deve chamar onSave com a nova descrição e fechar o diálogo', async () => {
    const user = userEvent.setup();
    render(
      <EditDescriptionDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        initialDescription="Descrição inicial"
        onSave={mockOnSave}
      />
    );

    const textarea = screen.getByPlaceholderText(/Descreva o propósito/i);
    await user.clear(textarea);
    await user.type(textarea, 'Nova descrição fantástica');

    const saveButton = screen.getByRole('button', { name: /Salvar Descrição/i });
    await user.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith('Nova descrição fantástica');
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('deve fechar o diálogo ao clicar em cancelar', async () => {
    const user = userEvent.setup();
    render(
      <EditDescriptionDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        initialDescription="Descrição inicial"
        onSave={mockOnSave}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /Cancelar/i });
    await user.click(cancelButton);

    expect(mockOnSave).not.toHaveBeenCalled();
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });
});
