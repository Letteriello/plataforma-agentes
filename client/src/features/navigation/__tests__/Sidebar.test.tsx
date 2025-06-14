import { fireEvent,render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'

import { useAuthStore } from '@/store' // Updated path

import { Sidebar } from './Sidebar'

// Mock the auth store
vi.mock('@/features/auth/store/authStore') // Updated mock path

// Mock lucide-react icons
vi.mock('lucide-react', async () => {
  const actual = await vi.importActual('lucide-react')
  return {
    ...actual,
    LayoutDashboard: () => <div data-testid="icon-layout-dashboard" />,
    FlaskConical: () => <div data-testid="icon-flask-conical" />,
    Users: () => <div data-testid="icon-users" />,
    Rocket: () => <div data-testid="icon-rocket" />,
    Wrench: () => <div data-testid="icon-wrench" />,
    BrainCircuit: () => <div data-testid="icon-brain-circuit" />,
    Settings: () => <div data-testid="icon-settings" />,
    Bot: () => <div data-testid="icon-bot" />,
    Library: () => <div data-testid="icon-library" />,
    Beaker: () => <div data-testid="icon-beaker" />,
    Scale: () => <div data-testid="icon-scale" />,
    ShieldCheck: () => <div data-testid="icon-shield-check" />,
    FileText: () => <div data-testid="icon-file-text" />,
    GitBranch: () => <div data-testid="icon-git-branch" />,
    ChevronDownIcon: () => <div data-testid="icon-chevron-down" />,
    BarChart: () => <div data-testid="icon-bar-chart" />,
    ClipboardList: () => <div data-testid="icon-clipboard-list" />,
  }
})


describe('Sidebar', () => {
  beforeEach(() => {
    // Provide a mock implementation for the store
    ;(useAuthStore as unknown as vi.Mock).mockReturnValue({
      user: { name: 'Test User', email: 'test@example.com' },
    })
  })

  const renderSidebar = (isCollapsed = false) => {
    return render(
      <BrowserRouter>
        <Sidebar
          isCollapsed={isCollapsed}
          isMobileMenuOpen={false} // Added default prop
          setIsMobileMenuOpen={() => {}} // Added default prop
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
    expect(screen.getByText('Playground')).toBeInTheDocument()
    expect(screen.getByText('Dashboard ROI')).toBeInTheDocument()

    // Check for section titles
    expect(screen.getByText('Gerenciamento')).toBeInTheDocument()
    expect(screen.getByText('Recursos')).toBeInTheDocument() // This is the main Recursos button/label
    expect(screen.getByText('Governança')).toBeInTheDocument()
    expect(screen.getByText('Orquestração')).toBeInTheDocument()


    // Check for agent management items
    expect(screen.getByText('Meus Agentes')).toBeInTheDocument()
    expect(screen.getByText('Deploy')).toBeInTheDocument()

    // Check for resources items
    // "Ferramentas" and "Memória" are sub-items and should not be visible initially
    expect(screen.queryByText('Ferramentas')).not.toBeInTheDocument()
    expect(screen.queryByText('Memória')).not.toBeInTheDocument()
    // "Biblioteca" and "Sandbox" are direct items
    expect(screen.getByText('Biblioteca')).toBeInTheDocument()
    expect(screen.getByText('Sandbox')).toBeInTheDocument()

    // Check for Governance items
    expect(screen.getByText('Governança')).toBeInTheDocument() // The link itself
    expect(screen.getByText('Cofre')).toBeInTheDocument()
    // Assuming "Auditoria" under Governance is distinct from the one in Orchestration by context or link if needed
    expect(screen.getAllByText('Auditoria')[0]).toBeInTheDocument() // First instance for Governance
    expect(screen.getByText('Painel QA')).toBeInTheDocument()

    // Check for Orchestration items
    expect(screen.getByText('Orquestração')).toBeInTheDocument() // The link itself
    expect(screen.getAllByText('Auditoria')[1]).toBeInTheDocument() // Second instance for Orchestration


    // Check for user settings section
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByTestId('icon-settings')).toBeInTheDocument()
  })

  it('should not render labels when collapsed, but icons should be present', () => {
    renderSidebar(true)

    // Labels should not be visible
    expect(screen.queryByText('Painel')).not.toBeInTheDocument()
    expect(screen.queryByText('Playground')).not.toBeInTheDocument()
    expect(screen.queryByText('Dashboard ROI')).not.toBeInTheDocument()

    expect(screen.queryByText('Gerenciamento')).not.toBeInTheDocument() // Section title
    expect(screen.queryByText('Meus Agentes')).not.toBeInTheDocument()
    expect(screen.queryByText('Deploy')).not.toBeInTheDocument()

    expect(screen.queryByText('Recursos')).not.toBeInTheDocument() // Section title / main item label
    expect(screen.queryByText('Ferramentas')).not.toBeInTheDocument()
    expect(screen.queryByText('Memória')).not.toBeInTheDocument()
    expect(screen.queryByText('Biblioteca')).not.toBeInTheDocument()
    expect(screen.queryByText('Sandbox')).not.toBeInTheDocument()

    expect(screen.queryByText('Governança')).not.toBeInTheDocument() // Section title / main item label
    expect(screen.queryByText('Cofre')).not.toBeInTheDocument()
    // queryAllByText for Auditoria as there are two, neither should be visible
    screen.queryAllByText('Auditoria').forEach(item => expect(item).not.toBeInTheDocument());
    expect(screen.queryByText('Painel QA')).not.toBeInTheDocument()

    expect(screen.queryByText('Orquestração')).not.toBeInTheDocument() // Section title / main item label
    // queryAllByText for Auditoria, checking the Orchestration one specifically is hard without more context if they are identical.
    // If they are visually distinct (e.g. different parent sections when expanded), this test is fine.
    // For now, ensuring no "Auditoria" text is visible is the main goal when collapsed.

    expect(screen.queryByText('Test User')).not.toBeInTheDocument()

    // Icons should be present
    expect(screen.getByTestId('icon-layout-dashboard')).toBeInTheDocument()
    expect(screen.getByTestId('icon-flask-conical')).toBeInTheDocument()
    expect(screen.getByTestId('icon-bar-chart')).toBeInTheDocument() // For Dashboard ROI

    expect(screen.getByTestId('icon-users')).toBeInTheDocument() // Meus Agentes
    expect(screen.getByTestId('icon-rocket')).toBeInTheDocument() // Deploy

    // For "Recursos" section:
    // The main "Recursos" item icon (Library)
    // "Ferramentas" and "Memória" icons should NOT be present as they are sub-items
    // "Biblioteca" icon (Library)
    // "Sandbox" icon (Beaker)
    // Since "Recursos", "Biblioteca", "Sandbox" might share icons or have distinct ones:
    // The test below assumes "Recursos" parent item has one icon, and "Biblioteca", "Sandbox" have their own.
    // There will be two 'icon-library' if Recursos parent and Biblioteca item both use it.
    expect(screen.getAllByTestId('icon-library').length).toBeGreaterThanOrEqual(1) // For Recursos parent and/or Biblioteca
    expect(screen.queryByTestId('icon-wrench')).not.toBeInTheDocument() // Ferramentas sub-item
    expect(screen.queryByTestId('icon-brain-circuit')).not.toBeInTheDocument() // Memória sub-item
    expect(screen.getByTestId('icon-beaker')).toBeInTheDocument() // Sandbox

    // Governance Icons
    expect(screen.getByTestId('icon-scale')).toBeInTheDocument() // Governança
    expect(screen.getByTestId('icon-shield-check')).toBeInTheDocument() // Cofre
    // For "Auditoria" and "Painel QA", assuming FileText and ClipboardList are used respectively.
    // If "Auditoria" uses FileText, there will be multiple, ensure at least one for Governance section.
    expect(screen.getAllByTestId('icon-file-text').length).toBeGreaterThanOrEqual(1) // Auditoria (at least one)
    expect(screen.getByTestId('icon-clipboard-list')).toBeInTheDocument() // Painel QA

    // Orchestration Icons
    expect(screen.getByTestId('icon-git-branch')).toBeInTheDocument() // Orquestração
    // Ensure the second FileText icon for the other "Auditoria" is present
    expect(screen.getAllByTestId('icon-file-text').length).toBeGreaterThanOrEqual(2) // Auditoria (at least two now)


    expect(screen.getByTestId('icon-settings')).toBeInTheDocument()
  })

  it('should have correct href attributes for navigation links', () => {
    renderSidebar(false)

    expect(screen.getByText('Painel').closest('a')).toHaveAttribute('href', '/dashboard')
    expect(screen.getByText('Playground').closest('a')).toHaveAttribute('href', '/playground')
    expect(screen.getByText('Dashboard ROI').closest('a')).toHaveAttribute('href', '/roi-dashboard')

    expect(screen.getByText('Meus Agentes').closest('a')).toHaveAttribute('href', '/agents')
    expect(screen.getByText('Deploy').closest('a')).toHaveAttribute('href', '/deploy')

    // "Recursos" main item does not have href. Sub-items are tested in expand/collapse test.
    expect(screen.getByText('Biblioteca').closest('a')).toHaveAttribute('href', '/biblioteca')
    expect(screen.getByText('Sandbox').closest('a')).toHaveAttribute('href', '/simulation-sandbox')

    // Governance links
    expect(screen.getByText('Governança').closest('a')).toHaveAttribute('href', '/governance')
    expect(screen.getByText('Cofre').closest('a')).toHaveAttribute('href', '/cofre')
    // Need to distinguish the two "Auditoria" links.
    // This is tricky if the text is identical. Assuming the first one found is for Governance for now.
    // A more robust way would be to get them within their sections if possible, or use more specific queries.
    expect(screen.getAllByText('Auditoria')[0].closest('a')).toHaveAttribute('href', '/audit-logs')
    expect(screen.getByText('Painel QA').closest('a')).toHaveAttribute('href', '/qa-panel')

    // Orchestration links
    expect(screen.getByText('Orquestração').closest('a')).toHaveAttribute('href', '/orchestration')
    expect(screen.getAllByText('Auditoria')[1].closest('a')).toHaveAttribute('href', '/auditoria')


    const settingsLink = screen.getByTestId('icon-settings').closest('a')
    expect(settingsLink).toHaveAttribute('href', '/settings') // Updated from /configuracoes
  })

  it('should expand and collapse "Recursos" section to show/hide sub-items', () => {
    renderSidebar(false) // Sidebar must be expanded

    // Initially, sub-items should not be visible
    expect(screen.queryByText('Ferramentas')).not.toBeInTheDocument()
    expect(screen.queryByText('Memória')).not.toBeInTheDocument()

    // Find the "Recursos" button. Since it's a button element when it has sub-items and no href.
    // We can get it by text "Recursos" that is not a link.
    // Or, more reliably, if it has a specific role or testid.
    // For now, assuming the text "Recursos" that is not a NavLink (<a> tag) is the button.
    // The structure is: <div> <button> <icon/> <span>Recursos</span> <chevron/> </button> </div>
    // So, getByText('Recursos') should target the span, then .closest('button')
    const recursosButton = screen.getByText('Recursos').closest('button')
    expect(recursosButton).toBeInTheDocument()

    // Click to expand
    fireEvent.click(recursosButton!)
    expect(screen.getByText('Ferramentas')).toBeInTheDocument()
    expect(screen.getByText('Memória')).toBeInTheDocument()

    // Check hrefs for newly visible items
    expect(screen.getByText('Ferramentas').closest('a')).toHaveAttribute('href', '/tools')
    expect(screen.getByText('Memória').closest('a')).toHaveAttribute('href', '/memory')


    // Click to collapse
    fireEvent.click(recursosButton!)
    expect(screen.queryByText('Ferramentas')).not.toBeInTheDocument()
    expect(screen.queryByText('Memória')).not.toBeInTheDocument()
  })
})
