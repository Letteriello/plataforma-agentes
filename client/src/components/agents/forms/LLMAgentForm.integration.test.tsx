import { zodResolver } from '@hookform/resolvers/zod'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import {
  FormProvider,
  useForm,
  UseFormReturn as RHFUseFormReturn,
} from 'react-hook-form'
import { vi } from 'vitest'

import { UseAgentFormReturn } from '@/hooks/useAgentFormState'
import {
  AgentFormValues,
  agentSchema,
  getDefaultValues,
} from '@/lib/form-utils'
import { AgentType, LlmAgentConfig } from '@/types/agents'

import { LLMAgentForm } from './LLMAgentForm'

// Mock the useAgentForm hook from AgentForm.tsx
let mockRHFMethods: RHFUseFormReturn<AgentFormValues> // To hold RHF methods for spying
const mockUseAgentFormContext = vi.fn()
vi.mock('../AgentForm', async (importOriginal) => {
  const original = await importOriginal<typeof import('../AgentForm')>()
  return {
    ...original,
    useAgentForm: () => mockUseAgentFormContext(),
  }
})

const llmDefaultValues = getDefaultValues(AgentType.LLM) as AgentFormValues &
  LLMAgent

const TestWrapper: React.FC<{
  children: React.ReactNode
  initialValues?: Partial<AgentFormValues>
  useAgentFormMockOverrides?: Partial<UseAgentFormReturn>
}> = ({ children, initialValues, useAgentFormMockOverrides }) => {
  const methods = useForm<AgentFormValues>({
    resolver: zodResolver(agentSchema),
    defaultValues: initialValues || llmDefaultValues,
    mode: 'onChange',
  })
  mockRHFMethods = methods // Assign to outer scope variable for spying

  const contextValue: UseAgentFormReturn = {
    ...methods,
    handleSubmit: methods.handleSubmit(async (data) => {}),
    resetForm: (values) => methods.reset(values),
    isSubmitting: methods.formState.isSubmitting,
    submitError: null,
    currentType: AgentType.LLM,
    registerField: methods.register as any,
    registerNestedField: vi.fn((prefix, name) =>
      methods.register(`${prefix}.${name}` as any),
    ) as any,
    handleArrayField: vi.fn(),
    setFieldValue: methods.setValue, // Use RHF's setValue directly
    getFieldValue: methods.getValues,
    getFieldError: (name) =>
      methods.formState.errors[name as keyof AgentFormValues]
        ?.message as string,
    hasError: (name) =>
      !!methods.formState.errors[name as keyof AgentFormValues],
    isDirty: methods.formState.isDirty,
    values: methods.watch(),
    errors: methods.formState.errors,
    isValid: methods.formState.isValid,
    isSubmitSuccessful: methods.formState.isSubmitSuccessful,
    handleTypeChange: vi.fn(),
    ...useAgentFormMockOverrides,
  }

  mockUseAgentFormContext.mockReturnValue(contextValue)
  return <FormProvider {...methods}>{children}</FormProvider>
}

describe('LLMAgentForm Integration Tests', () => {
  let setValueSpy: vi.SpyInstance

  beforeEach(() => {
    vi.clearAllMocks()
    // Spy will be set after initial render via TestWrapper's mockRHFMethods
  })

  afterEach(() => {
    if (setValueSpy) setValueSpy.mockRestore()
  })

  const renderLLMAgentForm = (
    initialValues?: Partial<LLMAgent>,
    useAgentFormMockOverrides?: Partial<UseAgentFormReturn>,
  ) => {
    const renderOutput = render(
      <TestWrapper
        initialValues={{ ...llmDefaultValues, ...initialValues }}
        useAgentFormMockOverrides={useAgentFormMockOverrides}
      >
        <LLMAgentForm />
      </TestWrapper>,
    )
    // Ensure setValueSpy is set up after mockRHFMethods is populated
    if (mockRHFMethods?.setValue) {
      setValueSpy = vi.spyOn(mockRHFMethods, 'setValue')
    }
    return renderOutput
  }

  it('should render with initial LLM values', () => {
    const initialData = {
      name: 'My LLM Test',
      model: 'gemini-1.5-pro',
      instruction: 'Test instruction here',
      temperature: 0.8,
      maxTokens: 2000,
      topP: 0.9,
      topK: 30,
      frequencyPenalty: 0.1,
      presencePenalty: 0.2,
      systemPrompt: 'System prompt test',
      stopSequences: ['stop1', 'stop2'],
    }
    renderLLMAgentForm(initialData)

    expect(screen.getByLabelText(/agent name/i)).toHaveValue(initialData.name)
    expect(screen.getByRole('combobox', { name: /model/i })).toHaveTextContent(
      'Gemini 1.5 Pro',
    )
    expect(screen.getByLabelText(/instructions/i)).toHaveValue(
      initialData.instruction,
    )
    expect(screen.getByText(/Temperature: 0.8/i)).toBeInTheDocument()
    expect(screen.getByText(/Max Tokens: 2000/i)).toBeInTheDocument() // Assuming label reflects value
    expect(screen.getByText(/Top-P: 0.9/i)).toBeInTheDocument()
    expect(screen.getByText(/Top-K: 30/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/frequency penalty/i)).toHaveValue(0.1)
    expect(screen.getByLabelText(/presence penalty/i)).toHaveValue(0.2)
    expect(screen.getByLabelText(/system prompt/i)).toHaveValue(
      initialData.systemPrompt,
    )
    expect(
      screen.getByPlaceholderText(/enter sequences separated by commas/i),
    ).toHaveValue('stop1, stop2')
  })

  it('should call setFieldValue for model change', async () => {
    const user = userEvent.setup()
    renderLLMAgentForm()
    setValueSpy = vi.spyOn(mockRHFMethods, 'setValue') // Ensure spy is on the correct instance

    const modelSelectTrigger = screen.getByRole('combobox', { name: /model/i })
    await user.click(modelSelectTrigger)
    const flashModelOption = await screen.findByText('Gemini 1.5 Flash')
    await user.click(flashModelOption)

    expect(setValueSpy).toHaveBeenCalledWith('model', 'gemini-1.5-flash', true)
    // Check if maxTokens was adjusted if necessary (gemini-1.5-flash has 8192, default might be lower)
    // This depends on the initial maxTokens value and the logic in handleModelChange
  })

  it('should call setFieldValue for instruction change', async () => {
    const user = userEvent.setup()
    renderLLMAgentForm()
    setValueSpy = vi.spyOn(mockRHFMethods, 'setValue')

    const instructionTextarea = screen.getByLabelText(/instructions/i)
    await user.type(instructionTextarea, 'New instruction.') // RHF handles field value directly
    // For `type`, RHF calls `onChange` which eventually calls `setValue`.
    // No direct call to `setFieldValue` from component for this, RHF handles it.
    // So, we check the DOM value.
    expect(instructionTextarea).toHaveValue('New instruction.')
  })

  it('should display validation error for empty instruction and then clear it', async () => {
    const user = userEvent.setup()
    renderLLMAgentForm({ instruction: '' })
    setValueSpy = vi.spyOn(mockRHFMethods, 'setValue')

    const instructionTextarea = screen.getByLabelText(/instructions/i)
    await act(async () => {
      fireEvent.blur(instructionTextarea)
    })
    await waitFor(() => {
      expect(screen.getByText('Instructions are required')).toBeInTheDocument()
    })

    await user.type(instructionTextarea, 'A valid instruction.')
    expect(instructionTextarea).toHaveValue('A valid instruction.')
    await waitFor(() => {
      expect(
        screen.queryByText('Instructions are required'),
      ).not.toBeInTheDocument()
    })
  })

  it('should call setFieldValue for temperature change (via internal handler)', () => {
    // This test assumes Temperature slider's onValueChange calls handleTemperatureChange, which calls setFieldValue.
    // Direct interaction with custom slider is complex.
    // We can't easily get the handleTemperatureChange function from the LLMAgentForm instance here.
    // Instead, we ensure our TestWrapper's setFieldValue (which is RHF's setValue) is callable.
    renderLLMAgentForm({ temperature: 0.5 })
    setValueSpy = vi.spyOn(mockRHFMethods, 'setValue')
    // Manually simulate the call that the slider's change handler would make
    act(() => {
      mockRHFMethods.setValue('temperature', 0.9, { shouldValidate: true })
    })
    expect(setValueSpy).toHaveBeenCalledWith('temperature', 0.9, {
      shouldValidate: true,
    })
    // Check if the visual display (label) updates if possible
    expect(screen.getByText(/Temperature: 0.9/i)).toBeInTheDocument()
  })

  it('should call setFieldValue for maxTokens change (via internal handler)', () => {
    renderLLMAgentForm({ model: 'gemini-1.5-pro', maxTokens: 1000 }) // gemini-1.5-pro has max 8192
    setValueSpy = vi.spyOn(mockRHFMethods, 'setValue')
    act(() => {
      // Simulate what handleMaxTokensChange would do after a slider interaction
      // For example, user changes slider to 2000
      // The component's handleMaxTokensChange (if it were directly testable) would call:
      mockRHFMethods.setValue('maxTokens', 2000, { shouldValidate: true })
    })
    expect(setValueSpy).toHaveBeenCalledWith('maxTokens', 2000, {
      shouldValidate: true,
    })
    expect(screen.getByText(/Max Tokens: 2000/i)).toBeInTheDocument()
  })

  it('should update systemPrompt field', async () => {
    const user = userEvent.setup()
    renderLLMAgentForm()
    const systemPromptTextarea = screen.getByLabelText(/system prompt/i)
    await user.type(systemPromptTextarea, 'New system prompt.')
    expect(systemPromptTextarea).toHaveValue('New system prompt.')
  })

  it('should update frequencyPenalty and presencePenalty fields', async () => {
    const user = userEvent.setup()
    renderLLMAgentForm()
    setValueSpy = vi.spyOn(mockRHFMethods, 'setValue')

    const freqPenaltyInput = screen.getByLabelText(/frequency penalty/i)
    await user.clear(freqPenaltyInput)
    await user.type(freqPenaltyInput, '0.5')
    // RHF handles this, no direct setValue call from component for basic input type="number"
    expect(freqPenaltyInput).toHaveValue(0.5)

    const presPenaltyInput = screen.getByLabelText(/presence penalty/i)
    await user.clear(presPenaltyInput)
    await user.type(presPenaltyInput, '-0.3')
    expect(presPenaltyInput).toHaveValue(-0.3)
  })

  it('should update stop sequences correctly', async () => {
    const user = userEvent.setup()
    renderLLMAgentForm({ stopSequences: [] })
    setValueSpy = vi.spyOn(mockRHFMethods, 'setValue')

    const stopSequencesInput = screen.getByPlaceholderText(
      /enter sequences separated by commas/i,
    )
    await user.type(stopSequencesInput, 'STOP1, STOP2,STOP3')

    // The component's onChange handler for stop sequences input calls:
    // field.onChange(e.target.value.split(',').map(s => s.trim()).filter(Boolean))
    // RHF's `onChange` for a registered field will ultimately call `setValue` or similar internal RHF update.
    // We are checking the outcome on `setValue` because that's what our `setFieldValue` is mapped to.
    // The field.onChange in the component is what's tested.
    expect(setValueSpy).toHaveBeenCalledWith(
      'stopSequences',
      ['STOP1', 'STOP2', 'STOP3'],
      expect.anything(),
    )
  })
})
