import type { Meta, StoryObj } from '@storybook/react';
import { Mail, PlusCircle } from 'lucide-react';

import { Button, buttonVariants } from './button';

/**
 * A clickable button component with various styles, sizes, and states.
 * It can include icons and supports loading and disabled states.
 */
const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: Object.keys(buttonVariants.variants.variant),
      description: 'The visual style of the button.',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'The size of the button.',
    },
    isLoading: { control: 'boolean', description: 'Shows a loading spinner.' },
    disabled: { control: 'boolean', description: 'Disables the button.' },
    children: { control: 'text', description: 'The content of the button.' },
    leftIcon: { control: false, description: 'Icon to display on the left.' },
    rightIcon: { control: false, description: 'Icon to display on the right.' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

const variants = Object.keys(
  buttonVariants.variants.variant,
) as (keyof typeof buttonVariants.variants.variant)[];

/**
 * This story showcases all available style variants of the Button.
 * Each variant is designed for a different semantic purpose.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      {variants.map((variant) => (
        <Button key={variant} variant={variant} className="capitalize">
          {variant}
        </Button>
      ))}
    </div>
  ),
};

/**
 * Buttons are available in three main sizes: `sm`, `default`, and `lg`.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

/**
 * The `leftIcon` and `rightIcon` props can be used to add icons to the button.
 * The loader will automatically replace icons when `isLoading` is true.
 */
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button leftIcon={<Mail className="h-4 w-4" />}>Email</Button>
      <Button rightIcon={<PlusCircle className="h-4 w-4" />}>Add New</Button>
      <Button isLoading leftIcon={<Mail className="h-4 w-4" />}>
        Submitting
      </Button>
    </div>
  ),
};

/**
 * The `icon` size is perfect for creating buttons that only contain an icon.
 * Remember to provide an `aria-label` for accessibility.
 */
export const IconButton: Story = {
  render: () => (
    <Button size="icon" aria-label="Add to favorites">
      <PlusCircle className="h-4 w-4" />
    </Button>
  ),
};

/**
 * The button supports `disabled` and `isLoading` states.
 * The `isLoading` state will also disable the button and show a spinner.
 */
export const States: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button disabled>Disabled</Button>
      <Button isLoading>Loading</Button>
    </div>
  ),
};

/**
 * The `link` variant styles the button to look like a hyperlink.
 * It's useful for actions that should appear less prominent.
 */
export const AsLink: Story = {
  render: () => <Button variant="link">Click me</Button>,
};

