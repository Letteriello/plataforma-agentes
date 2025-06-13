import type { Meta, StoryObj } from '@storybook/react';

import { Skeleton } from './skeleton';

/**
 * A component to display a placeholder preview of your content before it has loaded.
 * The shape and size of the skeleton are controlled by utility classes passed via `className`.
 */
const meta: Meta<typeof Skeleton> = {
  title: 'UI/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Custom CSS classes for styling the skeleton (e.g., h-4, w-full, rounded-full).',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

/**
 * Skeletons can be shaped into circles or rectangles to match the content they are replacing.
 */
export const Shapes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[150px]" />
      </div>
    </div>
  ),
};

/**
 * A practical example of using skeletons to build a loading state for a card component.
 */
export const CardExample: Story = {
  render: () => (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  ),
};
