import type { Meta, StoryObj } from '@storybook/react';

import {
  AGENT_STATUS_ACTIVE,
  AGENT_STATUS_DEFAULT,
  AGENT_STATUS_DEPLOYING,
  AGENT_STATUS_ERROR,
  AGENT_STATUS_IDLE,
  AGENT_STATUS_PENDING,
  AGENT_STATUS_UNKNOWN,
} from '@/constants/agentStatus';

import { StatusBadge } from './StatusBadge';

/**
 * A specialized badge that displays a status with a corresponding icon and color.
 * It maps a status string to a predefined visual representation, ensuring consistency.
 */
const meta: Meta<typeof StatusBadge> = {
  title: 'UI/StatusBadge',
  component: StatusBadge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    status: {
      control: { type: 'select' },
      options: [
        AGENT_STATUS_DEFAULT,
        AGENT_STATUS_ACTIVE,
        AGENT_STATUS_PENDING,
        AGENT_STATUS_DEPLOYING,
        AGENT_STATUS_IDLE,
        AGENT_STATUS_ERROR,
        AGENT_STATUS_UNKNOWN,
      ],
      description: 'The status to display.',
    },
    label: {
      control: 'text',
      description: 'Optional custom label to override the default status text.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

/**
 * The main interactive story. Use the controls to see how the badge changes based on the status.
 */
export const Interactive: Story = {
  args: {
    status: AGENT_STATUS_ACTIVE,
  },
};

/**
 * A gallery displaying all available status variants for easy comparison.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <StatusBadge status={AGENT_STATUS_ACTIVE} />
      <StatusBadge status={AGENT_STATUS_PENDING} />
      <StatusBadge status={AGENT_STATUS_DEPLOYING} />
      <StatusBadge status={AGENT_STATUS_IDLE} />
      <StatusBadge status={AGENT_STATUS_ERROR} />
      <StatusBadge status={AGENT_STATUS_DEFAULT} />
      <StatusBadge status={AGENT_STATUS_UNKNOWN} />
    </div>
  ),
};

/**
 * The badge label can be customized. If no label is provided, it defaults to the status name.
 */
export const WithCustomLabel: Story = {
  args: {
    status: AGENT_STATUS_DEPLOYING,
    label: 'Publishing...',
  },
};
