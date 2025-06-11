import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'
import { Topbar } from './Topbar'
import { vi } from 'vitest'

// Mock child components that are not the focus of this story
vi.mock('@/components/agents/CreateAgentDialog', () => ({
  CreateAgentDialog: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}))

vi.mock('@/components/ui/theme-toggle', () => ({
  ThemeToggle: () => <button>Toggle Theme</button>,
}))

const meta: Meta<typeof Topbar> = {
  title: 'Navigation/Topbar',
  component: Topbar,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof Topbar>

export const Default: Story = {
  args: {
    pageTitle: 'Dashboard',
  },
}

export const WithAgentSelector: Story = {
  args: {
    pageTitle: 'Chat',
    agentsForSelector: [
      { id: '1', title: 'Agent 1' },
      { id: '2', title: 'Agent 2' },
    ],
    selectedAgentIdForSelector: '1',
    onSelectAgentForSelector: (id) => console.log('Selected agent:', id),
  },
}
