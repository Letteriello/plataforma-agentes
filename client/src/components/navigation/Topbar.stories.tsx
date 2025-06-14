import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Route,Routes } from 'react-router-dom'; // Updated imports
import { vi } from 'vitest';

import { useAuthStore } from '@/store/authStore'; // Added

import { Topbar } from './Topbar';

// Mock child components and hooks
vi.mock('@/components/agents/CreateAgentDialog', () => ({
  CreateAgentDialog: ({ children }: { children: React.ReactNode }) => (
    // Simplified mock: just renders children, assumes button is part of children
    <div data-testid="create-agent-dialog-wrapper">{children}</div>
  ),
}));

vi.mock('@/components/ui/theme-toggle', () => ({
  ThemeToggle: () => <button>Toggle Theme</button>,
}));

// Mock useAuthStore
vi.mock('@/store/authStore');
const mockUser = { name: 'Storybook User', email: 'storybook@example.com' };
const mockLogout = () => {};

// Mock useNavigate
const mockNavigateFn = () => {};
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigateFn,
  };
});


const meta: Meta<typeof Topbar> = {
  title: 'Navigation/Topbar',
  component: Topbar,
  parameters: {
    layout: 'fullscreen', // Ensures the component uses the full space
  },
  tags: ['autodocs'],
  // argTypes for controlling props in Storybook UI if needed
  argTypes: {
    pageTitle: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Topbar>;

// Decorator to wrap stories with necessary providers
const TopbarDecorator = (StoryComponent: React.ElementType) => {
  // Setup the mock return value before each story that needs it
  (useAuthStore as unknown as vi.Mock).mockReturnValue({
    user: mockUser,
    logout: mockLogout,
  });
  return (
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/*" element={<StoryComponent />} />
      </Routes>
    </MemoryRouter>
  );
};

export const DefaultWithUser: Story = {
  args: {
    pageTitle: 'Dashboard Principal',
  },
  decorators: [TopbarDecorator],
};

export const NoTitleWithUser: Story = {
  args: {
    // pageTitle is undefined, should default to "Painel"
  },
  decorators: [TopbarDecorator],
};

export const WithAnonymousUser: Story = {
  args: {
    pageTitle: 'Página Pública',
  },
  decorators: [
    (StoryComponent) => {
      (useAuthStore as unknown as vi.Mock).mockReturnValue({
        user: null, // Simulate anonymous user
        logout: mockLogout,
      });
      return (
        <MemoryRouter initialEntries={['/']}>
           <Routes>
            <Route path="/*" element={<StoryComponent />} />
          </Routes>
        </MemoryRouter>
      );
    },
  ],
};
