import type { Meta, StoryObj } from '@storybook/react';
import { Brain, CheckCircle, Rocket, Wrench } from 'lucide-react';

import { Badge, badgeVariants } from './badge';

/**
 * A versatile badge component with multiple visual styles (variants), sizes,
 * and optional icon support. Used to display status, categories, or short info.
 */
const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: Object.keys(badgeVariants.variants.variant),
      description: 'The visual style of the badge.',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
      description: 'The size of the badge.',
    },
    children: {
      control: 'text',
      description: 'The content displayed inside the badge.',
    },
    icon: {
      control: false, // Icons are passed as React nodes, not easily controlled
      description: 'An optional icon to display before the text.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

const variants = Object.keys(
  badgeVariants.variants.variant,
) as (keyof typeof badgeVariants.variants.variant)[];

/**
 * This story showcases all available color variants of the Badge component.
 * Use these variants to convey meaning, such as status or category.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-4">
      {variants.map((variant) => (
        <Badge key={variant} variant={variant} className="capitalize">
          {variant}
        </Badge>
      ))}
    </div>
  ),
};

/**
 * Badges come in three different sizes: `sm`, `default`, and `lg`.
 * Choose the size that best fits the surrounding UI elements.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Badge size="sm">Small</Badge>
      <Badge size="default">Default</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
};

/**
 * An optional `icon` prop can be passed to include a `lucide-react` icon (or any React node)
 * before the badge text, providing additional visual context.
 */
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge variant="success" icon={<CheckCircle className="h-3 w-3" />}>
        Success
      </Badge>
      <Badge variant="deployed" icon={<Rocket className="h-3 w-3" />}>
        Deployed
      </Badge>
      <Badge variant="llm" icon={<Brain className="h-3 w-3" />}>
        LLM Agent
      </Badge>
      <Badge variant="tool" icon={<Wrench className="h-3 w-3" />}>
        Tool Enabled
      </Badge>
    </div>
  ),
};

