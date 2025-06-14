import { act,render } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'

import { Toaster } from '@/components/ui/toaster' // Needed if toasts are rendered

import { AgentEditor } from './AgentEditor'

// Mock dependencies
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
    toasts: [], // Add the missing toasts array
  }),
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    // @ts-expect-error -- useNavigate's actual type isn't needed for this mock
    ...actual, // import and retain default behavior
    useNavigate: () => vi.fn(),
    useParams: () => ({ id: undefined }), // Mock for 'create' mode
  }
})

// Mock a sub-component that might be complex or not relevant to this snapshot
vi.mock('@/components/agents/forms/LLMAgentForm', () => ({
  LLMAgentForm: () => (
    <div data-testid="mock-llm-agent-form">LLMAgentForm Mock</div>
  ),
}))

// Mock another sub-component
vi.mock('@/components/agents/AgentDeployTab', () => ({
  __esModule: true, // This is important for modules with default exports
  default: () => (
    <div data-testid="mock-agent-deploy-tab">AgentDeployTab Mock</div>
  ),
}))

describe('AgentEditor', () => {
  it('should match snapshot for create mode', async () => {
    let container
    // Use act for updates related to useEffect and state changes
    // The AgentEditor initializes a default agent which might involve state updates
    await act(async () => {
      const rendered = render(
        <MemoryRouter>
          <AgentEditor />
          <Toaster />{' '}
          {/* Include Toaster if toast messages can be triggered on render */}
        </MemoryRouter>,
      )
      container = rendered.container
    })
    expect(container).toMatchSnapshot()
  })
})
