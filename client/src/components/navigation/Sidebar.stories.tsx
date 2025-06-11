import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { useAuthStore } from '@/store/authStore'
import { vi } from 'vitest'

// Mock the auth store for Storybook
vi.mock('@/store/authStore')
;(useAuthStore as any).mockReturnValue({
  user: { name: 'Storybook User', email: 'storybook@example.com' },
})

const meta: Meta<typeof Sidebar> = {
  title: 'Navigation/Sidebar',
  component: Sidebar,
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
type Story = StoryObj<typeof Sidebar>

export const Expanded: Story = {
  args: {
    isCollapsed: false,
    onMouseEnter: () => {},
    onMouseLeave: () => {},
  },
}

export const Collapsed: Story = {
  args: {
    isCollapsed: true,
    onMouseEnter: () => {},
    onMouseLeave: () => {},
  },
}
