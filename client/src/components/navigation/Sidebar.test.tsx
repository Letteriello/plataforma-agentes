import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { Sidebar } from './Sidebar'
import { useAuthStore } from '@/store/authStore'

// Mock the auth store
vi.mock('@/store/authStore')

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

  it('should render all navigation sections when expanded', () => {
    renderSidebar(false)

    // Check for main navigation items
    expect(screen.getByText('Painel')).toBeInTheDocument()
    expect(screen.getByText('Chat')).toBeInTheDocument()
    expect(screen.getByText('Playground')).toBeInTheDocument()
    expect(screen.getByText('Criar Agente')).toBeInTheDocument()

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
    expect(screen.getByText('Configurações')).toBeInTheDocument()
  })

  it('should not render labels when collapsed', () => {
    renderSidebar(true)

    // Labels should not be visible
    expect(screen.queryByText('Painel')).not.toBeInTheDocument()
    expect(screen.queryByText('Gerenciamento')).not.toBeInTheDocument()
    expect(screen.queryByText('Recursos')).not.toBeInTheDocument()

    expect(screen.queryByText('Test User')).not.toBeInTheDocument()
  })
})
