import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';

/**
 * A foundational component for text-based user input.
 * It's a styled wrapper around the native HTML `<input>` element and accepts all its standard props.
 */
const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'search', 'tel', 'url'],
      description: 'The type of the input field.',
    },
    placeholder: { control: 'text', description: 'Placeholder text.' },
    disabled: { control: 'boolean', description: 'Disables the input.' },
    value: {
      control: 'text',
      description: 'The value of the input (for controlled components).',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

/**
 * The default input field. Use the controls to see different types and states.
 */
export const Default: Story = {
  args: {
    type: 'text',
    placeholder: 'Enter text here...',
  },
};

/**
 * An example of a disabled input field.
 */
export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
};

/**
 * An example of an input with a pre-filled value.
 */
export const WithValue: Story = {
  args: {
    value: 'This is a pre-filled value.',
  },
};

/**
 * For accessibility, always pair an input with a `Label` using `id` and `htmlFor`.
 */
export const WithLabel: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email-input">Email</Label>
      <Input {...args} id="email-input" placeholder="user@example.com" />
    </div>
  ),
  args: {
    type: 'email',
  },
};

/**
 * A common UI pattern is to pair an input with a button.
 * This demonstrates a search input with a submit button.
 */
export const WithButton: Story = {
  render: (args) => (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input {...args} placeholder="Search..." />
      <Button type="submit">Search</Button>
    </div>
  ),
  args: {
    type: 'search',
  },
};
