import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Progress } from './progress';

/**
 * Displays an indicator showing the completion progress of a task,
 * controlled by the `value` prop (from 0 to 100).
 * The colors are derived from the current theme's primary and secondary colors.
 */
const meta: Meta<typeof Progress> = {
  title: 'UI/Progress',
  component: Progress,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'The current progress value (0-100).',
    },
  },
  decorators: [
    // Adds a container to give the progress bar a defined width in the story.
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Progress>;

/**
 * The default progress bar. Use the Controls addon to change the value.
 */
export const Default: Story = {
  args: {
    value: 33,
  },
};

/**
 * This example shows how to dynamically update the progress value over time
 * using React's `useState` and `useEffect` hooks.
 */
export const DynamicExample: Story = {
  render: () => {
    const [progress, setProgress] = React.useState(10);

    // Simulate progress loading
    React.useEffect(() => {
      const timer = setTimeout(() => setProgress(80), 500);
      return () => clearTimeout(timer);
    }, []);

    return <Progress value={progress} />;
  },
};
