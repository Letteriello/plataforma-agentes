import type { Meta, StoryObj } from '@storybook/react'
import {
  AlertTriangle,
  Check,
  Info,
  User,
  Workflow,
  X,
  Zap,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'

// Meta information for the component
const meta = {
  title: 'Components/UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A small status descriptor for UI elements.',
      },
    },
  },

  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'secondary',
        'destructive',
        'outline',
        'success',
        'error',
        'warning',
        'info',
        'active',
        'inactive',
        'pending',
        'llm',
        'workflow',
      ],
      description: 'The visual style of the badge',
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

// Default badge
const Template: Story = {
  render: (args) => <Badge {...args}>Badge</Badge>,
}

// Variants
export const Default: Story = {
  ...Template,
  args: {
    variant: 'default',
  },
}

export const Secondary: Story = {
  ...Template,
  args: {
    variant: 'secondary',
  },
}

export const Destructive: Story = {
  ...Template,
  args: {
    variant: 'destructive',
  },
}

export const Outline: Story = {
  ...Template,
  args: {
    variant: 'outline',
  },
}

// Status variants
export const Success: Story = {
  ...Template,
  args: {
    variant: 'success',
    children: 'Success',
  },
}

export const Error: Story = {
  ...Template,
  args: {
    variant: 'error',
    children: 'Error',
  },
}

export const Warning: Story = {
  ...Template,
  args: {
    variant: 'warning',
    children: 'Warning',
  },
}

export const Info: Story = {
  ...Template,
  args: {
    variant: 'info',
    children: 'Information',
  },
}

// Agent status variants
export const Active: Story = {
  ...Template,
  args: {
    variant: 'active',
    children: 'Active',
  },
}

export const Inactive: Story = {
  ...Template,
  args: {
    variant: 'inactive',
    children: 'Inactive',
  },
}

export const Pending: Story = {
  ...Template,
  args: {
    variant: 'pending',
    children: 'Pending',
  },
}

// Special type variants
export const LLM: Story = {
  ...Template,
  args: {
    variant: 'llm',
    children: 'LLM',
  },
}

export const Workflow: Story = {
  ...Template,
  args: {
    variant: 'workflow',
    children: 'Workflow',
  },
}

// With Icons
export const WithIcon: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Badge variant="success">
          <Check className="mr-1 h-3 w-3" />
          Success
        </Badge>
        <Badge variant="destructive">
          <X className="mr-1 h-3 w-3" />
          Error
        </Badge>
        <Badge variant="warning">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Warning
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="info">
          <Info className="mr-1 h-3 w-3" />
          Information
        </Badge>
        <Badge variant="active">
          <User className="mr-1 h-3 w-3" />
          Active
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="llm">
          <Zap className="mr-1 h-3 w-3" />
          LLM Agent
        </Badge>
        <Badge variant="workflow">
          <Workflow className="mr-1 h-3 w-3" />
          Workflow
        </Badge>
      </div>
    </div>
  ),
}

// Usage examples
export const UsageExamples: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 text-sm font-medium">Status Indicators</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="success">Running</Badge>
          <Badge variant="warning">Degraded</Badge>
          <Badge variant="destructive">Error</Badge>
          <Badge variant="inactive">Offline</Badge>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Agent Types</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="llm">LLM</Badge>
          <Badge variant="workflow">Workflow</Badge>
          <Badge variant="info">Integration</Badge>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">With Counters</h3>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span>Active Agents</span>
            <Badge variant="success">12</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>Pending</span>
            <Badge variant="warning">3</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>Errors</span>
            <Badge variant="destructive">2</Badge>
          </div>
        </div>
      </div>
    </div>
  ),
}
