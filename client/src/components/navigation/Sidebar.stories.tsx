import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Route,Routes } from 'react-router-dom'; // Updated imports
import { vi } from 'vitest';

import { useAuthStore } from '@/store/authStore';

import { Sidebar } from './Sidebar';

// Mock the auth store for Storybook
vi.mock('@/store/authStore');
(useAuthStore as any).mockReturnValue({
  user: { name: 'Storybook User', email: 'storybook@example.com' },
  logout: () => console.log('Logout action triggered in Storybook'), // Add mock logout
});

const meta: Meta<typeof Sidebar> = {
  title: 'Navigation/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'], // Add autodocs tag
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

const SidebarDecorator = (StoryComponent: React.ElementType, initialRoute: string = '/dashboard') => (
  <MemoryRouter initialEntries={[initialRoute]}>
    <Routes> {/* Required for NavLink to determine active state */}
      <Route path="/*" element={<StoryComponent />} />
    </Routes>
  </MemoryRouter>
);


export const Expanded: Story = {
  args: {
    isCollapsed: false,
    onMouseEnter: () => console.log('Mouse enter'),
    onMouseLeave: () => console.log('Mouse leave'),
  },
  decorators: [(Story) => SidebarDecorator(Story, '/dashboard')], // Show "Painel" as active
};

export const ExpandedActiveAgents: Story = { // New story for a different active link
  args: {
    ...Expanded.args,
  },
  decorators: [(Story) => SidebarDecorator(Story, '/agents')], // Show "Meus Agentes" as active
};

export const Collapsed: Story = {
  args: {
    isCollapsed: true,
    onMouseEnter: () => console.log('Mouse enter'),
    onMouseLeave: () => console.log('Mouse leave'),
  },
  decorators: [(Story) => SidebarDecorator(Story, '/chat')], // Show "Chat" as active (icon only)
};
