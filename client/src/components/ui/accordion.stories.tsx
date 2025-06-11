import type { Meta, StoryObj } from '@storybook/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './accordion';

/**
 * A vertically stacked set of interactive headings that each reveal a section of content.
 * This component is built on top of Radix UI's Accordion primitive for accessibility.
 */
const meta: Meta<typeof Accordion> = {
  title: 'UI/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `A vertically stacked set of interactive headings that each reveal a section of content. Built using Radix UI for accessibility.`,
      },
    },
  },
  argTypes: {
    type: {
      control: { type: 'radio' },
      options: ['single', 'multiple'],
      description: 'Determines whether one or multiple items can be opened at the same time.',
      table: {
        defaultValue: { summary: 'single' },
      },
    },
    collapsible: {
      control: 'boolean',
      description: 'When type is "single", allows closing the currently open item.',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Accordion>;

const faqItems = [
  {
    value: 'item-1',
    question: 'Is it accessible?',
    answer: 'Yes. It adheres to the WAI-ARIA design pattern.',
  },
  {
    value: 'item-2',
    question: 'Is it styled?',
    answer: 'Yes. It comes with default styles that match other components.',
  },
  {
    value: 'item-3',
    question: 'Is it animated?',
    answer: 'Yes. It\'s animated by default, but this can be customized.',
  },
];

/**
 * The default behavior of the accordion allows only one item to be open at a time.
 * Clicking a new item will close the previous one.
 */
export const Single: Story = {
  args: {
    type: 'single',
    collapsible: true,
    className: 'w-full',
  },
  render: (args) => (
    <Accordion {...args}>
      {faqItems.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

/**
 * By setting the `type` prop to `multiple`, you can allow multiple items to be
 * open simultaneously. The `collapsible` prop is ignored in this mode.
 */
export const Multiple: Story = {
  args: {
    type: 'multiple',
    className: 'w-full',
  },
  render: (args) => (
    <Accordion {...args}>
      {faqItems.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </A
