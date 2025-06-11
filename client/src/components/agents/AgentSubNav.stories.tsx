import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AgentSubNav } from './AgentSubNav';

const meta: Meta<typeof AgentSubNav> = {
  title: 'Agents/AgentSubNav', // Categorized under 'Agents'
  component: AgentSubNav,
  parameters: {
    layout: 'centered', // Or 'padded' if 'fullscreen' is too much
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AgentSubNav>;

const agentNavigationItems = [
  { name: 'Meus Agentes', href: '/agents' },
  { name: 'Templates', href: '/agents/templates' },
  { name: 'Analytics', href: '/agents/analytics' },
  { name: 'Configurações', href: '/agents/settings' },
];

// Decorator to wrap stories with MemoryRouter
const AgentSubNavDecorator = (StoryComponent: React.ElementType, initialRoute: string) => (
  <MemoryRouter initialEntries={[initialRoute]}>
    <Routes>
      {/* Define routes that AgentSubNav might link to, ensuring active states work */}
      {agentNavigationItems.map(item => (
        <Route key={item.href} path={item.href} element={<StoryComponent />} />
      ))}
      {/* Add a catch-all or specific routes for deeper paths if needed for active state testing */}
      <Route path="/agents/:agentId" element={<StoryComponent />} />
      <Route path="/*" element={<StoryComponent />} /> {/* Fallback */}
    </Routes>
  </MemoryRouter>
);

export const Default: Story = {
  decorators: [(Story) => AgentSubNavDecorator(Story, '/agents')],
};

export const ActiveTemplates: Story = {
  decorators: [(Story) => AgentSubNavDecorator(Story, '/agents/templates')],
};

export const ActiveAnalytics: Story = {
  decorators: [(Story) => AgentSubNavDecorator(Story, '/agents/analytics')],
};

export const ActiveSettings: Story = {
  decorators: [(Story) => AgentSubNavDecorator(Story, '/agents/settings')],
};

// Story to demonstrate active state for "Meus Agentes" when on a sub-path
export const ActiveMyAgentsOnSubPath: Story = {
    decorators: [(Story) => AgentSubNavDecorator(Story, '/agents/some-unique-id')],
};