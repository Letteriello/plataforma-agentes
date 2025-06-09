import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Textarea } from './textarea';
import { Label } from './label'; // To demonstrate with a label

const meta = {
  title: 'UI/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    value: { control: 'text' }, // For controlled textarea
    rows: { control: 'number' },
    onChange: { action: 'changed' },
  },
  args: {
    placeholder: 'Enter your text here...',
    disabled: false,
    rows: 3, // Default rows in story
    onChange: fn(),
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Uses default args
  },
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: 'Your detailed feedback is appreciated!',
  },
};

export const Disabled: Story = {
  args: {
    value: "This content cannot be edited.",
    disabled: true,
  },
};

export const WithValue: Story = {
  args: {
    value: "This is some pre-filled text in the textarea. \nIt can span multiple lines.",
    rows: 5,
  },
};

export const CustomRows: Story = {
  args: {
    placeholder: 'This textarea has more rows by default.',
    rows: 8,
  },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="message">Your message</Label>
      <Textarea id="message" {...args} />
      <p className="text-sm text-muted-foreground">
        This is a helper text below the textarea.
      </p>
    </div>
  ),
  args: {
    id: 'message-textarea',
    placeholder: 'Type your message here.',
  },
};
