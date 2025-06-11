import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';
import { LoadingSpinner } from './loading-spinner';

/**
 * A simple, infinitely spinning loader component to indicate a process is running.
 * It uses the `Loader2` icon from `lucide-react` and can be fully customized via `className`.
 */
const meta: Meta<typeof LoadingSpinner> = {
  title: 'UI/LoadingSpinner',
  component: LoadingSpinner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    className: {
      control: 'text',
      description:
        'Custom Tailwind CSS classes for size (h-*, w-*) and color (text-*).',
    },
  },
};

export default meta;
type Story = StoryObj<typeof LoadingSpinner>;

/**
 * The default spinner with its standard size (h-5, w-5).
 */
export const Default: Story = {
  args: {},
};

/**
 * You can easily change the spinner's size by providing height and width utility classes.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <LoadingSpinner className="h-4 w-4" />
      <LoadingSpinner className="h-8 w-8" />
      <LoadingSpinner className="h-12 w-12" />
    </div>
  ),
};

/**
 * The color of the spinner can be changed using text color utility classes.
 */
export const Colors: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <LoadingSpinner className="text-primary" />
      <LoadingSpinner className="text-destructive" />
      <LoadingSpinner className="text-success" />
    </div>
  ),
};

/**
 * A common use case is to display the spinner inside a button to indicate a loading state.
 */
export const InsideButton: Story = {
  render: () => (
    <Button disabled>
      <LoadingSpinner className="mr-2 h-4 w-4" />
      Please wait
    </Button>
  ),
};
