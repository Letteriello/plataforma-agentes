import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Topbar } from './Topbar'
import { vi } from 'vitest'

// Mock the CreateAgentDialog to prevent its internal logic from running
vi.mock('@/components/agents/CreateAgentDialog', () => ({
  CreateAgentDialog: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}))

// Mock the ThemeToggle as its implementation is not relevant to this test
vi.mock('@/components/ui/theme-toggle', () => ({
  ThemeToggle: () => <button>Toggle theme</button>,
}))

describe('Topbar', () => {
  it('should render the page title and default actions', () => {
    render(
      <BrowserRouter>
        <Topbar pageTitle="Meu Painel" />
      </BrowserRouter>,
    )

    // Check for the page title
    expect(screen.getByText('Meu Painel')).toBeInTheDocument()

    // Check for the "Criar Agente" button
    expect(
      screen.getByRole('button', { name: /Criar Agente/i }),
    ).toBeInTheDocument()

    // Check for the notification button
    expect(
      screen.getByRole('button', { name: /Notificações/i }),
    ).toBeInTheDocument()

    // Check for the theme toggle button
    expect(
      screen.getByRole('button', { name: /Toggle theme/i }),
    ).toBeInTheDocument()
  })

  it('should render the default title if no pageTitle prop is provided', () => {
    render(
      <BrowserRouter>
        <Topbar />
      </BrowserRouter>,
    )

    expect(screen.getByText('Painel')).toBeInTheDocument()
  })
})
