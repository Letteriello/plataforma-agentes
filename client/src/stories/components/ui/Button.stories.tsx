import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@/components/ui/button'
import { Plus, Loader2 } from 'lucide-react'

// Meta information for the component
const meta = {
  title: 'Components/UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A customizable button component with various styles and states.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'destructive',
        'outline',
        'ghost',
        'link',
        'success',
        'warning',
        'info',
      ],
      description: 'The visual style of the button',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'The size of the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether the button is in a loading state',
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// Default button
const Template: Story = {
  render: (args) => <Button {...args}>Button</Button>,
}

// Variants
export const Primary: Story = {
  ...Template,
  args: {
    variant: 'primary',
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

export const Ghost: Story = {
  ...Template,
  args: {
    variant: 'ghost',
  },
}

export const Link: Story = {
  ...Template,
  args: {
    variant: 'link',
  },
}

// Status variants
export const Success: Story = {
  ...Template,
  args: {
    variant: 'success',
  },
}

export const Warning: Story = {
  ...Template,
  args: {
    variant: 'warning',
  },
}

export const Info: Story = {
  ...Template,
  args: {
    variant: 'info',
  },
}

// Sizes
export const Small: Story = {
  ...Template,
  args: {
    size: 'sm',
  },
}

export const Large: Story = {
  ...Template,
  args: {
    size: 'lg',
  },
}

// States
export const Disabled: Story = {
  ...Template,
  args: {
    disabled: true,
  },
}

export const Loading: Story = {
  ...Template,
  args: {
    isLoading: true,
  },
}

// With Icons
export const WithLeftIcon: Story = {
  ...Template,
  render: (args) => (
    <Button {...args}>
      <Plus className="mr-2 h-4 w-4" />
      Add Item
    </Button>
  ),
}

export const WithRightIcon: Story = {
  ...Template,
  render: (args) => (
    <Button {...args}>
      Continue
      <Plus className="ml-2 h-4 w-4" />
    </Button>
  ),
}

// Icon Button
export const IconOnly: Story = {
  ...Template,
  args: {
    size: 'icon',
    children: <Plus className="h-4 w-4" />,
    'aria-label': 'Add',
  },
}
