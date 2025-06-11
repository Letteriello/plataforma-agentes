import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';

/**
 * An image element with a fallback for representing a user or agent.
 * It is composed of `Avatar` (the root), `AvatarImage`, and `AvatarFallback`.
 */
const meta: Meta<typeof Avatar> = {
  title: 'UI/Avatar',
  component: Avatar,
  subcomponents: { AvatarImage, AvatarFallback },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the avatar.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

/**
 * The default Avatar. Use the controls to change its size.
 */
export const Default: Story = {
  render: (args) => (
    <Avatar {...args}>
      {/* The image to display. */}
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      {/* The fallback displayed if the image fails to load. */}
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
  args: {
    size: 'md',
  },
};

/**
 * The `AvatarFallback` is displayed automatically when the `AvatarImage` fails to load
 * or if the `src` prop is not provided. It's typically used to show user initials.
 */
export const Fallback: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage
        src="https://this-image-will-definitely-fail.com/nonexistent.png"
        alt="@failed"
      />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
  args: {
    size: 'lg',
  },
};
