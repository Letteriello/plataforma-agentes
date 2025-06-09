import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';
import { CheckCircle, XCircle, AlertTriangle, Info, Power, PowerOff, Clock, Rocket, Brain, Wrench, UserCircle } from 'lucide-react'; // Example icons

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default', 'secondary', 'destructive', 'outline',
        'success', 'error', 'warning', 'info',
        'online', 'offline', 'pending', 'deployed',
        'llm', 'tool', 'user'
      ],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
    },
    children: { control: 'text' },
    // icon: { control: 'object' } // Icons are harder to control directly in Storybook args
  },
  args: {
    children: 'Badge Text',
    size: 'default',
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { variant: 'default', children: 'Default' } };
export const Secondary: Story = { args: { variant: 'secondary', children: 'Secondary' } };
export const Destructive: Story = { args: { variant: 'destructive', children: 'Destructive' } };
export const Outline: Story = { args: { variant: 'outline', children: 'Outline' } };

// Status Variants
export const Success: Story = { args: { variant: 'success', children: 'Success', icon: <CheckCircle className="h-3 w-3" /> } };
export const ErrorBadge: Story = { args: { variant: 'error', children: 'Error', icon: <XCircle className="h-3 w-3" /> } }; // Renamed to avoid conflict with Storybook error type
export const Warning: Story = { args: { variant: 'warning', children: 'Warning', icon: <AlertTriangle className="h-3 w-3" /> } };
export const Info: Story = { args: { variant: 'info', children: 'Info', icon: <Info className="h-3 w-3" /> } };

// Agent Status Variants
export const Online: Story = { args: { variant: 'online', children: 'Online', icon: <Power className="h-3 w-3" /> } };
export const Offline: Story = { args: { variant: 'offline', children: 'Offline', icon: <PowerOff className="h-3 w-3" /> } };
export const Pending: Story = { args: { variant: 'pending', children: 'Pending', icon: <Clock className="h-3 w-3" /> } };
export const Deployed: Story = { args: { variant: 'deployed', children: 'Deployed', icon: <Rocket className="h-3 w-3" /> } };

// LLM Specific Variants
export const LLMBadge: Story = { args: { variant: 'llm', children: 'LLM', icon: <Brain className="h-3 w-3" /> } }; // Renamed
export const ToolBadge: Story = { args: { variant: 'tool', children: 'Tool', icon: <Wrench className="h-3 w-3" /> } }; // Renamed
export const UserBadge: Story = { args: { variant: 'user', children: 'User', icon: <UserCircle className="h-3 w-3" /> } }; // Renamed


// Size Variants
export const Small: Story = { args: { variant: 'default', size: 'sm', children: 'Small Badge' } };
export const Large: Story = { args: { variant: 'default', size: 'lg', children: 'Large Badge' } };

// With Icon Only (using size 'default' which might be small for just an icon)
export const IconOnly: Story = {
  args: {
    variant: 'success',
    size: 'default', // Or 'icon' if such a size was defined for fitting icons better
    children: <CheckCircle className="h-4 w-4" />, // Pass icon as children, remove text
    // For true icon-only badges, ensure padding/size is appropriate.
    // The current Badge component wraps children in a span, so this will render the icon.
  },
};

export const OutlineWithIcon: Story = {
  args: {
    variant: 'outline',
    icon: <Info className="h-3 w-3" />,
    children: 'More Details',
  },
};
