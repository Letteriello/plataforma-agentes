import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Checkbox } from './checkbox';
import { Label } from './label'; // To demonstrate with a label
import React from 'react'; // For JSX

const meta = {
  title: 'UI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    // id: { control: 'text' }, // Useful for pairing with Label
    onChange: { action: 'changed' },
  },
  args: {
    checked: false,
    disabled: false,
    onChange: fn(),
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // No specific args, will use defaults (unchecked)
  },
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const DisabledUnchecked: Story = {
  args: {
    disabled: true,
    checked: false,
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
  },
};

// Story to demonstrate usage with a Label component
export const WithLabel: Story = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" {...args} />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
  args: {
    id: 'terms-checkbox', // ensure id matches label's htmlFor
  },
};

export const WithLabelChecked: Story = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox id="subscribe" {...args} />
      <Label htmlFor="subscribe">Subscribe to newsletter</Label>
    </div>
  ),
  args: {
    id: 'subscribe-checkbox',
    checked: true,
  },
};

export const WithLabelDisabled: Story = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox id="feature" {...args} />
      <Label htmlFor="feature" className={args.disabled ? 'text-muted-foreground' : ''}>
        Enable experimental feature (disabled)
      </Label>
    </div>
  ),
  args: {
    id: 'feature-checkbox',
    disabled: true,
    checked: false,
  },
};
