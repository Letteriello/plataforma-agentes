import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { AgentForm, AgentFormValues } from './AgentForm';
import { getDefaultValues } from '@/lib/form-utils';
import { vi } from 'vitest';
import { AgentType } from '@/types/agents'; // Using the enum-like strings from types/agents/index.ts

// Mocks
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

const mockToast = vi.fn();
vi.mock('@/components/ui/use-toast', () => ({
  toast: (...args: any[]) => mockToast(...args),
}));

// Mock sub-forms to isolate AgentForm logic if needed, or allow them to render
vi.mock('./forms/LLMAgentForm', () => ({
  LLMAgentForm: () => <div data-testid="llm-agent-form-mock">LLM Agent Form Mock</div>,
}));


const mockNavigate = vi.fn();
(require('react-router-dom') as any).useNavigate = () => mockNavigate;


describe('AgentForm Integration Tests', () => {
  let onSubmitMock: vi.Mock<[values: AgentFormValues], Promise<void>>;
  const llmDefaultValues = getDefaultValues(AgentType.LLM);

  beforeEach(() => {
    vi.clearAllMocks();
    onSubmitMock = vi.fn(async (values) => {});
  });

  const renderAgentForm = (props: Partial<React.ComponentProps<typeof AgentForm>> = {}) => {
    const defaultProps: React.ComponentProps<typeof AgentForm> = {
      agent: llmDefaultValues,
      onSubmit: onSubmitMock,
      isLoading: false,
      isEditing: false,
    };
    return render(<AgentForm {...defaultProps} {...props} />);
  };

  it('should render the form with initial values for an LLM agent', () => {
    renderAgentForm({ agent: { ...llmDefaultValues, name: 'My Test LLM Agent' } });

    expect(screen.getByLabelText(/name/i)).toHaveValue('My Test LLM Agent');
    expect(screen.getByTestId('llm-agent-form-mock')).toBeInTheDocument();
    // Check if AgentTypeSelector is present (not editing)
    expect(screen.getByText('Select the type of agent you want to create.')).toBeInTheDocument();
  });

  it('should not render AgentTypeSelector when isEditing is true', () => {
    renderAgentForm({ agent: { ...llmDefaultValues, name: 'My Test LLM Agent' }, isEditing: true });
    expect(screen.queryByText('Select the type of agent you want to create.')).not.toBeInTheDocument();
  });

  it('should update input fields correctly', async () => {
    const user = userEvent.setup();
    renderAgentForm();

    const nameInput = screen.getByLabelText(/name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'New Agent Name');
    expect(nameInput).toHaveValue('New Agent Name');

    const descriptionInput = screen.getByLabelText(/description/i);
    await user.clear(descriptionInput);
    await user.type(descriptionInput, 'New agent description.');
    expect(descriptionInput).toHaveValue('New agent description.');
  });

  it('should call onSubmit with form values when form is valid and submitted', async () => {
    const user = userEvent.setup();
    const initialAgentData = { ...llmDefaultValues, name: 'Valid Agent', instruction: 'Valid Instruction' };
     // For LLM, 'instruction' is also required. Since LLMAgentForm is mocked, we rely on schema for default values.
     // getDefaultValues for LLM should provide a default instruction if the schema demands it.
     // If LLMAgentForm were real, we'd fill its fields too.

    renderAgentForm({ agent: initialAgentData });

    const nameInput = screen.getByLabelText(/name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Super Valid Agent');

    // If LLMAgentForm was real, we'd interact with its 'instruction' field.
    // For now, assume the default from getDefaultValues or the mock is sufficient.
    // The schema for LLM agent in form-utils.ts has instruction as required.
    // getDefaultValues(AgentType.LLM) uses llmAgentSchema.parse({}) which provides default for instruction.

    const submitButton = screen.getByRole('button', { name: /create agent/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Super Valid Agent',
        type: AgentType.LLM,
        // instruction: 'Valid Instruction', // This would come from LLM form if not mocked
      }));
    });
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Agent created' }));
  });

  it('should display validation error for empty name on submit attempt', async () => {
    const user = userEvent.setup();
    renderAgentForm({ agent: { ...llmDefaultValues, name: '' } }); // Start with an empty name

    const submitButton = screen.getByRole('button', { name: /create agent/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });
    expect(onSubmitMock).not.toHaveBeenCalled();
    expect(mockToast).not.toHaveBeenCalled();
  });

  it('should display generic submission error if onSubmit throws and no specific field errors', async () => {
    const user = userEvent.setup();
    const errorMessage = "Network error, failed to save";
    onSubmitMock.mockRejectedValueOnce(new Error(errorMessage));
    renderAgentForm({ agent: { ...llmDefaultValues, name: 'Test Submit Error' }});

    const submitButton = screen.getByRole('button', { name: /create agent/i });
    await user.click(submitButton);

    await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
     expect(mockToast).not.toHaveBeenCalled(); // Toast for success shouldn't be called
  });


  it('should change agent type and render the appropriate placeholder for non-LLM types', async () => {
    const user = userEvent.setup();
    renderAgentForm();

    // AgentTypeSelector is complex to interact with directly without knowing its internals.
    // We'll assume selecting a different type (e.g., Sequential) via its UI works.
    // The key is that form.handleTypeChange is called, which updates form.currentType.
    // For this test, we can simulate this change by re-rendering with a different agent type,
    // or by directly invoking a change if AgentTypeSelector exposes a clear way.

    // Let's find the select element for AgentTypeSelector (assuming it uses a standard select or similar)
    // This is a bit fragile as it depends on AgentTypeSelector's implementation details.
    // A better way would be if AgentTypeSelector had a clear data-testid or role.
    // For now, let's assume it's a button/select that opens options.
    // The component AgentTypeSelector uses Radix UI Select.

    // Click the trigger for AgentTypeSelector
    const typeSelectorTrigger = screen.getByRole('combobox'); // Radix Select trigger has role 'combobox'
    await user.click(typeSelectorTrigger);

    // Click the 'Sequential' option
    // This assumes AgentType.SEQUENTIAL is 'sequential'
    const sequentialOption = await screen.findByText('Sequential Workflow'); // Text from getAgentTypeDisplayName
    await user.click(sequentialOption);

    // After type change, LLM form mock should disappear, and placeholder for Sequential should appear.
    expect(screen.queryByTestId('llm-agent-form-mock')).not.toBeInTheDocument();
    expect(screen.getByText(/sequential agent configuration coming soon/i)).toBeInTheDocument();
  });

  it('should call onCancel when cancel button is clicked if onCancel is provided', async () => {
    const user = userEvent.setup();
    const onCancelMock = vi.fn();
    renderAgentForm({ onCancel: onCancelMock });

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(onCancelMock).toHaveBeenCalledTimes(1);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should navigate to /agents when cancel button is clicked if onCancel is not provided', async () => {
    const user = userEvent.setup();
    renderAgentForm({ onCancel: undefined }); // No onCancel prop

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith('/agents');
  });

});
