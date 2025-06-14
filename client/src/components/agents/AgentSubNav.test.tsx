// client/src/components/agents/AgentSubNav.test.tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { vi } from 'vitest';


import { AgentSubNav } from './AgentSubNav';

// Mock useLocation
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: vi.fn(),
  };
});

// Mock cn utility if it becomes problematic, though usually it's fine
// vi.mock('@/lib/utils', async () => {
//   const actual = await vi.importActual('@/lib/utils');
//   return {
//     ...actual,
//     cn: (...inputs: any[]) => inputs.filter(Boolean).join(' '),
//   };
// });

const mockAgentNavigationItems = [
  { name: 'Meus Agentes', href: '/agents' },
  { name: 'Templates', href: '/agents/templates' },
  { name: 'Analytics', href: '/agents/analytics' },
  { name: 'Configurações', href: '/agents/settings' },
];

describe('AgentSubNav', () => {
  const renderAgentSubNav = (currentPath: string) => {
    (useLocation as any).mockReturnValue({ pathname: currentPath });
    return render(
      <MemoryRouter initialEntries={[currentPath]}>
        <AgentSubNav />
      </MemoryRouter>
    );
  };

  it('should render all navigation items with correct labels and hrefs', () => {
    renderAgentSubNav('/agents');

    mockAgentNavigationItems.forEach(item => {
      const linkElement = screen.getByText(item.name);
      expect(linkElement).toBeInTheDocument();
      expect(linkElement.closest('a')).toHaveAttribute('href', item.href);
    });
  });

  it.each(mockAgentNavigationItems.map(item => [item.name, item.href]))(
    'should apply active styling to "%s" link when on path "%s"',
    (name, path) => {
      renderAgentSubNav(path as string);
      const linkElement = screen.getByText(name as string);
      // Check for a class that indicates active state.
      // Based on AgentSubNav: 'text-primary bg-accent'
      // The actual class might be a result of cn(), so we check for key parts.
      expect(linkElement.closest('button')).toHaveClass(/text-primary/);
      expect(linkElement.closest('button')).toHaveClass(/bg-accent/);
    }
  );

  it('should apply active styling to "Meus Agentes" when on a sub-path like /agents/id', () => {
    renderAgentSubNav('/agents/some-agent-id');
    const linkElement = screen.getByText('Meus Agentes');
    expect(linkElement.closest('button')).toHaveClass(/text-primary/);
    expect(linkElement.closest('button')).toHaveClass(/bg-accent/);
  });


  it('should not apply active styling to other links when on a specific path', () => {
    const activePath = '/agents/templates';
    renderAgentSubNav(activePath);

    mockAgentNavigationItems.forEach(item => {
      const linkElement = screen.getByText(item.name);
      if (item.href !== activePath) {
        // Check for classes that indicate inactive state.
        // Based on AgentSubNav: 'text-muted-foreground hover:bg-transparent hover:underline'
        expect(linkElement.closest('button')).toHaveClass(/text-muted-foreground/);
        // Note: hover states are harder to test directly with RTL without interaction.
      }
    });
  });
});