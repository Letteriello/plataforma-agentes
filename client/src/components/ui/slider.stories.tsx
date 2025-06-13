import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';

import { Label } from './label';
import { Slider } from './slider';

/**
 * An interactive control that allows users to select a value from a range.
 * Built on Radix UI's Slider primitive for accessibility.
 */
const meta: Meta<typeof Slider> = {
  title: 'UI/Slider',
  component: Slider,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    defaultValue: {
      control: 'object',
      description: 'The default value of the slider. Must be an array of numbers.',
    },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    disabled: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Slider>;

/**
 * The default slider. Use the controls to adjust its properties.
 */
export const Default: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
  },
};

/**
 * A disabled slider is non-interactive and visually indicates its state.
 */
export const Disabled: Story = {
  args: {
    defaultValue: [75],
    disabled: true,
  },
};

/**
 * A common use case is to display the slider's current value.
 * This example demonstrates a controlled slider using `useState`.
 */
export const WithValueDisplay: Story = {
  render: (args) => {
    const [sliderValue, setSliderValue] = React.useState([25]);
    return (
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="slider-value">Temperature</Label>
          <span className="text-sm font-medium">{sliderValue[0]}°C</span>
        </div>
        <Slider
          {...args}
          id="slider-value"
          value={sliderValue}
          onValueChange={setSliderValue}
          max={100}
          step={1}
        />
      </div>
    );
  },
};
