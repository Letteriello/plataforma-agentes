import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './textarea';
import { Label } from './label';

/**
 * A component for multi-line text input.
 * It's a styled wrapper around the native HTML `<textarea>` element.
 */
const meta: Meta<typeof Textarea> = {
  title: 'UI/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text to display when the textarea is empty.',
    },
    disabled: {
      control: 'boolean',
      description: 'If true, the textarea will be disabled.',
    },
    value: {
      control: 'text',
      description: 'The value of the textarea (for controlled components).',
    },
    rows: {
      control: 'number',
      description: 'The visible number of lines in the textarea.',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Textarea>;

/**
 * The default textarea. Use the controls to see its different states.
 */
export const Default: Story = {
  args: {
    placeholder: 'Type your message here.',
    rows: 4,
  },
};

/**
 * A disabled textarea is not interactive.
 */
export const Disabled: Story = {
  args: {
    value: 'This content cannot be edited.',
    disabled: true,
  },
};

/**
 * A textarea with a pre-filled value.
 */
export const WithValue: Story = {
  args: {
    value:
      'This is some pre-filled text in the textarea. It can span multiple lines.',
    rows: 5,
  },
};

/**
 * A common use case is to pair a textarea with a label for accessibility and clarity.
 */
export const WithLabel: Story = {
  render: (args) => (
    <div className="grid w-full gap-2">
      <Label htmlFor="message">Your message</Label>
      <Textarea {...args} id="message" />
      <p className="text-sm text-muted-foreground">
        You can @mention other users and organizations.
      </p>
    </div>
  ),
  args: {
    placeholder: 'Type your message here.',
  },
};
