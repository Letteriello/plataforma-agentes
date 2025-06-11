import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './select' // Import all necessary Select components

const meta = {
  title: 'UI/Select',
  component: Select, // The main root component
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // Args for the Select (Root) component itself
    disabled: { control: 'boolean' },
    // value: { control: 'text' }, // Controlled value
    // onValueChange: { action: 'value changed' },
  },
  args: {
    disabled: false,
    // onValueChange: fn(),
  },
} satisfies Meta<typeof Select>

export default meta

// Define a base Story type that uses the render function for complex components
type Story = StoryObj<typeof meta>

// Helper function to create a common Select structure for stories
const renderSelect = (
  args: React.ComponentProps<typeof Select> & {
    placeholder?: string
    items: { value: string; label: string; disabled?: boolean }[]
    withLabel?: string
    withSeparator?: boolean
  },
) => (
  <Select {...args} onValueChange={fn(args.onValueChange || (() => {}))}>
    <SelectTrigger className="w-[280px]">
      <SelectValue placeholder={args.placeholder || 'Select an option'} />
    </SelectTrigger>
    <SelectContent>
      {args.withLabel && <SelectLabel>{args.withLabel}</SelectLabel>}
      <SelectGroup>
        {args.items
          .slice(
            0,
            args.withSeparator
              ? Math.ceil(args.items.length / 2)
              : args.items.length,
          )
          .map((item) => (
            <SelectItem
              key={item.value}
              value={item.value}
              disabled={item.disabled}
            >
              {item.label}
            </SelectItem>
          ))}
        {args.withSeparator && <SelectSeparator />}
        {args.withSeparator &&
          args.items.slice(Math.ceil(args.items.length / 2)).map((item) => (
            <SelectItem
              key={item.value}
              value={item.value}
              disabled={item.disabled}
            >
              {item.label}
            </SelectItem>
          ))}
      </SelectGroup>
    </SelectContent>
  </Select>
)

const fruitItems = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'grapes', label: 'Grapes' },
  { value: 'pineapple', label: 'Pineapple' },
]

const timeZoneItems = [
  { value: 'est', label: 'Eastern Standard Time (EST)' },
  { value: 'cst', label: 'Central Standard Time (CST)' },
  { value: 'mst', label: 'Mountain Standard Time (MST)' },
  { value: 'pst', label: 'Pacific Standard Time (PST)' },
  { value: 'akst', label: 'Alaska Standard Time (AKST)', disabled: true },
  { value: 'hst', label: 'Hawaii Standard Time (HST)' },
]

export const Default: Story = {
  render: renderSelect,
  args: {
    placeholder: 'Select a fruit',
    items: fruitItems,
  },
}

export const WithLabelAndSeparator: Story = {
  render: renderSelect,
  args: {
    placeholder: 'Select a timezone',
    items: timeZoneItems,
    withLabel: 'Timezones',
    withSeparator: true,
  },
}

export const DisabledSelect: Story = {
  render: renderSelect,
  args: {
    placeholder: 'Select a fruit (disabled)',
    items: fruitItems,
    disabled: true,
  },
}

export const WithDefaultValue: Story = {
  render: (args) => renderSelect({ ...args, defaultValue: 'banana' }), // defaultValue is a direct prop of Select
  args: {
    placeholder: 'Select a fruit',
    items: fruitItems,
  },
}

export const DisabledItem: Story = {
  render: renderSelect,
  args: {
    placeholder: 'Select a timezone',
    items: timeZoneItems.map((item) =>
      item.value === 'akst' ? { ...item, disabled: true } : item,
    ),
    withLabel: 'Timezones (Alaska disabled)',
  },
}

// Example for longer content in SelectContent to show scroll behavior
const longItemList = Array.from({ length: 20 }, (_, i) => ({
  value: `item-${i + 1}`,
  label: `Item ${i + 1}`,
}))

export const WithScrollingContent: Story = {
  render: renderSelect,
  args: {
    placeholder: 'Select an item',
    items: longItemList,
  },
}
