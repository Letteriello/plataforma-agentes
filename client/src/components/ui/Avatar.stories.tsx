import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarFallback, AvatarImage } from './avatar'; // Import all parts

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    // Children for Avatar are typically AvatarImage and AvatarFallback
  },
  args: {
    size: 'md',
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

export const Small: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://github.com/storybookjs.png" alt="Storybook" />
      <AvatarFallback>SB</AvatarFallback>
    </Avatar>
  ),
  args: {
    size: 'sm',
  },
};

export const Large: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://github.com/vercel.png" alt="Vercel" />
      <AvatarFallback>VC</AvatarFallback>
    </Avatar>
  ),
  args: {
    size: 'lg',
  },
};

export const WithFallbackOnly: Story = {
  render: (args) => (
    <Avatar {...args}>
      {/* No AvatarImage provided, or if src was invalid */}
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
  args: {
    // You can also test with an invalid image src to see fallback
    // src: "https://invalid-url-to-force-fallback.png"
  },
};

export const FallbackWithLongerText: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarFallback>USER</AvatarFallback>
    </Avatar>
  ),
  args: {
    size: 'lg',
  },
};

export const FallbackWithDelay: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://via.placeholder.com/150/FFFFFF/000000?text=Loading...&Pdelay=2000" alt="Delayed Load" />
      <AvatarFallback>LD</AvatarFallback>
    </Avatar>
  ),
  args: {
    // Note: The Pdelay parameter in placeholder.com URLs simulates network delay.
    // Storybook might not show the fallback state dynamically unless the image actually fails or is slow.
    // To reliably show fallback, omit AvatarImage or provide an invalid src.
  },
  parameters: {
    docs: {
      description: {
        story: 'This story attempts to show a fallback during a slow image load. ' +
                 'However, reliably demonstrating this in Storybook might require an actual failing or very slow image URL, ' +
                 'or manipulating the AvatarImage component to simulate a load failure.',
      },
    },
  },
};
