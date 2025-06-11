import type { Meta, StoryObj } from '@storybook/react'
import { Label } from './label'
import { Input } from './input' // To demonstrate `htmlFor`
import { Checkbox } from './checkbox' // To demonstrate with checkbox

const meta = {
  title: 'UI/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' },
    htmlFor: { control: 'text' },
  },
  args: {
    children: 'This is a label',
  },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Default Label Text',
  },
}

export const AssociatedWithInput: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label {...args} htmlFor="email-input">
        Email Address
      </Label>
      <Input type="email" id="email-input" placeholder="user@example.com" />
    </div>
  ),
  args: {
    children: 'Email Address', // This will be overridden by render function's Label content
    htmlFor: 'email-input', // This arg is passed to the Label in render
  },
}

export const AssociatedWithCheckbox: Story = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms-checkbox" />
      <Label {...args} htmlFor="terms-checkbox">
        Accept terms and conditions
      </Label>
    </div>
  ),
  args: {
    children: 'Accept terms and conditions',
    htmlFor: 'terms-checkbox',
  },
}

export const RequiredMarker: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label {...args} htmlFor="name-input">
        Full Name <span className="text-destructive">*</span>
      </Label>
      <Input type="text" id="name-input" placeholder="Your full name" />
    </div>
  ),
  args: {
    // Children is provided within the render function for this complex example
    htmlFor: 'name-input',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates a common pattern for indicating required fields. The asterisk is not part of the Label component itself.',
      },
    },
  },
}

// The Label component itself doesn't have disabled styling tied to an input's disabled state directly through its own props.
// The `peer-disabled` styles apply if the Label is associated with a disabled input element via `htmlFor`.
export const WithDisabledPeerInput: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label {...args} htmlFor="disabled-input-example">
        Your Name (disabled input)
      </Label>
      <Input
        type="text"
        id="disabled-input-example"
        placeholder="Cannot type here"
        disabled
      />
    </div>
  ),
  args: {
    children: 'Your Name (disabled input)', // This will be overridden
    htmlFor: 'disabled-input-example',
  },
}
