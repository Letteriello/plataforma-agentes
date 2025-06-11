import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { Sidebar } from './Sidebar'
import { useAuthStore } from '@/store/authStore'

// Mock the auth store
vi.mock('@/store/authStore')

// Mock lucide-react icons
vi.mock('lucide-react', async () => {
  const actual = await vi.importActual('lucide-react')
  return {
    ...actual,
    LayoutDashboard: () => <div data-testid="icon-dashboard" />,
    MessageCircle: () => <div data-testid="icon-chat" />,
    FlaskConical: () => <div data-testid="icon-playground" />,
    Users: () => <div data-testid="icon-users" />,
    History: () => <div data-testid="icon-history" />,
    Rocket: () => <div data-testid="icon-rocket" />,
    Wrench: () => <div data-testid="icon-wrench" />,
    BrainCircuit: () => <div data-testid="icon-brain" />,
    Settings: () => <div data-testid="icon-settings" />,
    Bot: () => <div data-testid="icon-bot" />, // Added Bot for completeness
  }
})


describe('Sidebar', () => {
  beforeEach(() => {
    // Provide a mock implementation for the store
    ;(useAuthStore as any).mockReturnValue({
      user: { name: 'Test User', email: 'test@example.com' },
    })
  })

  const renderSidebar = (isCollapsed = false) => {
    return render(
      <BrowserRouter>
        <Sidebar
          isCollapsed={isCollapsed}
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
        />
      </BrowserRouter>,
    )
  }

  it('should render all navigation sections and labels when expanded', () => {
    renderSidebar(false)

    // Check for main navigation items
    expect(screen.getByText('Painel')).toBeInTheDocument()
    expect(screen.getByText('Chat')).toBeInTheDocument()
    expect(screen.getByText('Playground')).toBeInTheDocument()
    // expect(screen.getByText('Criar Agente')).toBeInTheDocument() // This item seems to have been removed from Sidebar.tsx

    // Check for section titles
    expect(screen.getByText('Gerenciamento')).toBeInTheDocument()
    expect(screen.getByText('Recursos')).toBeInTheDocument()

    // Check for agent management items
    expect(screen.getByText('Meus Agentes')).toBeInTheDocument()
    expect(screen.getByText('Sessões')).toBeInTheDocument()
    expect(screen.getByText('Deploy')).toBeInTheDocument()

    // Check for resources items
    expect(screen.getByText('Ferramentas')).toBeInTheDocument()
    expect(screen.getByText('Memória')).toBeInTheDocument()

    // Check for user settings section
    expect(screen.getByText('Test User')).toBeInTheDocument()
    // The text "Configurações" is now part of the user name display, not a separate label
    // We can check for the presence of the settings icon or the link itself.
    expect(screen.getByTestId('icon-settings')).toBeInTheDocument()
  })

  it('should not render labels when collapsed, but icons should be present', () => {
    renderSidebar(true)

    // Labels should not be visible
    expect(screen.queryByText('Painel')).not.toBeInTheDocument()
    expect(screen.queryByText('Gerenciamento')).not.toBeInTheDocument()
    expect(screen.queryByText('Recursos')).not.toBeInTheDocument()
    expect(screen.queryByText('Test User')).not.toBeInTheDocument()

    // Icons should be present
    expect(screen.getByTestId('icon-dashboard')).toBeInTheDocument()
    expect(screen.getByTestId('icon-chat')).toBeInTheDocument()
    expect(screen.getByTestId('icon-playground')).toBeInTheDocument()
    expect(screen.getByTestId('icon-users')).toBeInTheDocument()
    expect(screen.getByTestId('icon-history')).toBeInTheDocument()
    expect(screen.getByTestId('icon-rocket')).toBeInTheDocument()
    expect(screen.getByTestId('icon-wrench')).toBeInTheDocument()
    expect(screen.getByTestId('icon-brain')).toBeInTheDocument()
    expect(screen.getByTestId('icon-settings')).toBeInTheDocument()
  })

  it('should have correct href attributes for navigation links', () => {
    renderSidebar(false)

    expect(screen.getByText('Painel').closest('a')).toHaveAttribute('href', '/dashboard')
    expect(screen.getByText('Chat').closest('a')).toHaveAttribute('href', '/chat')
    expect(screen.getByText('Playground').closest('a')).toHaveAttribute('href', '/playground')
    expect(screen.getByText('Meus Agentes').closest('a')).toHaveAttribute('href', '/agents')
    expect(screen.getByText('Sessões').closest('a')).toHaveAttribute('href', '/sessions')
    expect(screen.getByText('Deploy').closest('a')).toHaveAttribute('href', '/deploy')
    expect(screen.getByText('Ferramentas').closest('a')).toHaveAttribute('href', '/tools')
    expect(screen.getByText('Memória').closest('a')).toHaveAttribute('href', '/memory')
    // For the settings link, it's within the user profile display
    // We can find it by role or by the text within its paragraph if unique enough, or by testid on the icon
    const settingsLink = screen.getByTestId('icon-settings').closest('a')
    expect(settingsLink).toHaveAttribute('href', '/configuracoes')
  })
})
