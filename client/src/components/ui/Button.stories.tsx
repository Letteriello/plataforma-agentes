import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Button } from './button'
import { PlusCircle, Mail } from 'lucide-react' // Example icons

// Default metadata for the Button component stories
const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered', // Center the component in the Canvas
  },
  // Tags for autodocs
  tags: ['autodocs'],
  // ArgTypes for better control in Storybook UI
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
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    isLoading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    asChild: { control: 'boolean' },
    children: { control: 'text' },
    onClick: { action: 'clicked' }, // Use Storybook's action addon for onClick
  },
  // Default args
  args: {
    children: 'Button Text',
    isLoading: false,
    disabled: false,
    asChild: false,
    onClick: fn(), // Mock function for onClick
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// Basic stories
export const Default: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive Button',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
}

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
}

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Success Button',
  },
}

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Warning Button',
  },
}

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'Info Button',
  },
}

// Size stories
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
}

export const Icon: Story = {
  args: {
    variant: 'outline', // Icon buttons often use outline or ghost
    size: 'icon',
    children: <PlusCircle className="h-4 w-4" />, // Pass icon as children
    'aria-label': 'Add Item', // Important for accessibility
  },
}

// State stories
export const IsLoading: Story = {
  args: {
    isLoading: true,
    children: 'Loading...',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
}

// With Icons
export const WithLeftIcon: Story = {
  args: {
    variant: 'primary',
    leftIcon: <Mail className="h-4 w-4" />,
    children: 'Email',
  },
}

export const WithRightIcon: Story = {
  args: {
    variant: 'primary',
    rightIcon: <PlusCircle className="h-4 w-4" />,
    children: 'Add New',
  },
}

export const LoadingWithIcons: Story = {
  args: {
    variant: 'primary',
    isLoading: true,
    leftIcon: <Mail className="h-4 w-4" />, // Icon should be hidden by loader
    children: 'Submitting',
  },
}

// Example of asChild (though it's harder to demonstrate visually in Storybook without a child component)
// export const AsChild: Story = {
//   args: {
//     asChild: true,
//     children: <a href="#">Link wrapped by Button styles</a>, // This won't work directly, would need a real child component
//   },
// };
