import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';

/**
 * A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.
 * Built on Radix UI for accessibility.
 *
 * **Note:** You must wrap your application in a `TooltipProvider` for tooltips to work.
 */
const meta: Meta<typeof Tooltip> = {
  title: 'UI/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  subcomponents: { TooltipProvider, TooltipTrigger, TooltipContent },
  argTypes: {
    delayDuration: {
      control: { type: 'number', min: 0, step: 100 },
      description: 'The duration from when the mouse enters the trigger until the tooltip opens.',
      table: {
        category: 'Provider Props',
        defaultValue: { summary: '700ms' },
      },
    },
    side: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
      description: 'The preferred side of the trigger to render the tooltip against.',
      table: {
        category: 'Content Props',
        defaultValue: { summary: 'top' },
      },
    },
    sideOffset: {
      control: 'number',
      description: 'The distance in pixels from the trigger.',
      table: {
        category: 'Content Props',
        defaultValue: { summary: '4' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default Tooltip. Use the controls to change its position and delay.
 */
export const Default: Story = {
  render: ({ side, sideOffset, delayDuration, ...args }) => (
    // Provider sets the delay duration for all tooltips within it.
    <TooltipProvider delayDuration={delayDuration}>
      {/* The main Tooltip container. */}
      <Tooltip {...args}>
        {/* The element that triggers the tooltip. `asChild` is used to pass props to the child Button. */}
        <TooltipTrigger asChild>
          <Button variant="outline">Hover over me</Button>
        </TooltipTrigger>
        {/* The content of the tooltip. Props like `side` and `sideOffset` are passed here. */}
        <TooltipContent side={side} sideOffset={sideOffset}>
          <p>This is a tooltip!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  args: {
    delayDuration: 300,
    side: 'top',
    sideOffset: 4,
  },
};
