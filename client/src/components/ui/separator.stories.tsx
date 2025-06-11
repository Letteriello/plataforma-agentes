import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from './separator';

/**
 * A visual separator component to divide and group content.
 * Built on Radix UI's Separator primitive for accessibility.
 * It can be displayed horizontally or vertically.
 */
const meta: Meta<typeof Separator> = {
  title: 'UI/Separator',
  component: Separator,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'The orientation of the separator.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Separator>;

/**
 * The default horizontal separator, used to divide content sections.
 */
export const Horizontal: Story = {
  render: () => (
    <div className="w-80">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
        <p className="text-sm text-muted-foreground">
          An open-source UI component library.
        </p>
      </div>
      <Separator className="my-4" />
      <p className="text-sm text-muted-foreground">
        Provides accessible, unstyled components for building high-quality
        design systems.
      </p>
    </div>
  ),
};

/**
 * A vertical separator, used to divide inline elements.
 */
export const Vertical: Story = {
  render: () => (
    <div className="flex h-10 items-center space-x-4 text-sm">
      <div>Blog</div>
      <Separator orientation="vertical" />
      <div>Docs</div>
      <Separator orientation="vertical" />
      <div>Source</div>
    </div>
  ),
};
