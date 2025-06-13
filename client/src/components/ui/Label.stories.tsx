import type { Meta, StoryObj } from '@storybook/react';

import { Checkbox } from './checkbox';
import { Input } from './input';
import { Label } from './label';

/**
 * Renders an accessible label associated with a form control.
 * Built on Radix UI's Label primitive, it provides crucial accessibility
 * by connecting the label text to a specific input field via the `htmlFor` prop.
 * Clicking the label focuses the corresponding input.
 */
const meta: Meta<typeof Label> = {
  title: 'UI/Label',
  component: Label,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    children: { control: 'text', description: 'The content of the label.' },
    htmlFor: {
      control: 'text',
      description: 'The id of the element the label is associated with.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

/**
 * The default usage of a Label associated with an Input field.
 * This is the most common and recommended pattern.
 */
export const Default: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label {...args} htmlFor="email-input">
        Email
      </Label>
      <Input type="email" id="email-input" placeholder="user@example.com" />
    </div>
  ),
  args: {
    htmlFor: 'email-input',
  },
};

/**
 * A Label can also be associated with other form elements, like a Checkbox.
 */
export const WithCheckbox: Story = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms-checkbox" />
      <Label {...args} htmlFor="terms-checkbox">
        Accept terms and conditions
      </Label>
    </div>
  ),
  args: {
    htmlFor: 'terms-checkbox',
  },
};

/**
 * The Label automatically appears disabled when the associated input is disabled.
 * This is achieved using the `peer-disabled` utility class in the component's styling.
 */
export const Disabled: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label {...args} htmlFor="disabled-input">
        Name (disabled)
      </Label>
      <Input type="text" id="disabled-input" disabled placeholder="Cannot edit" />
    </div>
  ),
  args: {
    htmlFor: 'disabled-input',
  },
};
