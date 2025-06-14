import { fireEvent,render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'

import { useAuthStore } from '@/store' // Updated path

import { Topbar } from './Topbar'

// Mock child components and hooks
vi.mock('@/features/agents/components/CreateAgentDialog', () => ({
  CreateAgentDialog: ({ children }: { children: React.ReactNode }) => (
    // Simplified mock: just renders children, assumes button is part of children
    <div data-testid="create-agent-dialog-wrapper">{children}</div>
  ),
}))

vi.mock('@/components/ui/theme-toggle', () => ({
  ThemeToggle: () => <button>Toggle theme</button>,
}))

vi.mock('@/features/auth/store/authStore') // Updated mock path
vi.mock('lucide-react', async () => {
  const actual = await vi.importActual('lucide-react')
  return {
    ...actual,
    Bell: () => <div data-testid="icon-bell" />,
    PlusCircle: () => <div data-testid="icon-plus-circle" />,
    Search: () => <div data-testid="icon-search" />,
    User: () => <div data-testid="icon-user" />,
    Settings: () => <div data-testid="icon-settings" />,
    HelpCircle: () => <div data-testid="icon-help-circle" />,
    LogOut: () => <div data-testid="icon-logout" />,
  }
})

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})


describe('Topbar', () => {
  const mockUser = { name: 'Test User', email: 'test@example.com' }
  const mockLogout = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks();
    // Provide a mock implementation for the store
    (useAuthStore as unknown as vi.Mock).mockReturnValue({
      user: mockUser,
      logout: mockLogout,
    })
  })

  const renderTopbar = (pageTitle?: string) => {
    return render(
      <BrowserRouter>
        <Topbar pageTitle={pageTitle} />
      </BrowserRouter>,
    )
  }

  it('should render the page title and default actions', () => {
    renderTopbar('Meu Painel')

    expect(screen.getByText('Meu Painel')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Criar Agente/i })).toBeInTheDocument()
    // Notification button has an sr-only span, let's find by that or its icon
    expect(screen.getByText('Notificações')).toBeInTheDocument() // Checks the sr-only text
    expect(screen.getByTestId('icon-bell')).toBeInTheDocument() // Checks the icon
    expect(screen.getByRole('button', { name: /Toggle theme/i })).toBeInTheDocument()
  })

  it('should render the default title if no pageTitle prop is provided', () => {
    renderTopbar()
    expect(screen.getByText('Painel')).toBeInTheDocument()
  })

  it('should display user avatar and open dropdown menu on click', async () => {
    renderTopbar()

    // Check for user avatar/initials
    // AvatarImage might not render if src is undefined or errors, so fallback is important
    const avatarFallback = screen.getByText(mockUser.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0,2))
    expect(avatarFallback).toBeInTheDocument()

    // Find the button that triggers the dropdown (it contains the Avatar)
    const avatarButton = avatarFallback.closest('button')
    expect(avatarButton).toBeInTheDocument()

    if (avatarButton) {
      fireEvent.click(avatarButton)
    }

    // Check for dropdown items
    // Use await findByText for items that appear asynchronously after click
    expect(await screen.findByText('Perfil')).toBeInTheDocument()
    expect(await screen.findByText('Configurações')).toBeInTheDocument()
    expect(await screen.findByText('Ajuda')).toBeInTheDocument()
    expect(await screen.findByText('Sair')).toBeInTheDocument()

    // Check for icons within dropdown items
    expect(screen.getByTestId('icon-user').closest('a')).toHaveAttribute('href', '/perfil')
    expect(screen.getByTestId('icon-settings').closest('a')).toHaveAttribute('href', '/configuracoes')
    expect(screen.getByTestId('icon-help-circle').closest('a')).toHaveAttribute('href', '/ajuda')
  })

  it('should call logout and navigate on clicking "Sair"', async () => {
    renderTopbar()

    const avatarFallback = screen.getByText(mockUser.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0,2))
    const avatarButton = avatarFallback.closest('button')
    if (avatarButton) {
      fireEvent.click(avatarButton)
    }

    const logoutButton = await screen.findByText('Sair')
    fireEvent.click(logoutButton)

    expect(mockLogout).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('should render "U" as fallback if user is null', () => {
    (useAuthStore as unknown as vi.Mock).mockReturnValue({
      user: null,
      logout: mockLogout,
    });
    renderTopbar();
    expect(screen.getByText('U')).toBeInTheDocument();
  });
})
