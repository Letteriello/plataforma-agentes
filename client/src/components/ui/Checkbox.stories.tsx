import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Checkbox } from './checkbox';
import { Label } from './label';

/**
 * A control that allows the user to toggle between checked and not checked.
 * It is built on top of a native `input[type="checkbox"]` element and supports
 * all of its props.
 */
const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    checked: {
      control: 'select',
      options: [true, false, 'indeterminate'],
      description: 'The state of the checkbox.',
    },
    disabled: { control: 'boolean', description: 'Disables the checkbox.' },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

/**
 * This story shows the basic states of the Checkbox: unchecked, checked, and disabled.
 */
export const BasicStates: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <Checkbox id="state-unchecked" />
        <Label htmlFor="state-unchecked">Unchecked</Label>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Checkbox id="state-checked" checked />
        <Label htmlFor="state-checked">Checked</Label>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Checkbox id="state-disabled" disabled />
        <Label htmlFor="state-disabled" className="text-muted-foreground">
          Disabled
        </Label>
      </div>
    </div>
  ),
};

/**
 * For accessibility, it's crucial to pair the `Checkbox` with a `Label`.
 * Use the `id` prop on the Checkbox and the `htmlFor` prop on the Label.
 */
export const WithLabel: Story = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" {...args} />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
};

/**
 * The indeterminate state is useful for "select all" functionality in lists.
 * It must be controlled via JavaScript by setting the `indeterminate` property on the input element.
 */
export const Indeterminate: Story = {
  render: () => {
    const [checked, setChecked] = React.useState<boolean | 'indeterminate'>(
      'indeterminate',
    );
    const ref = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
      if (ref.current) {
        ref.current.indeterminate = checked === 'indeterminate';
      }
    }, [checked]);

    return (
      <div className="flex items-center space-x-2">
        <Checkbox
          ref={ref}
          id="indeterminate-checkbox"
          checked={checked === true}
          onCheckedChange={(isChecked) =>
            setChecked(isChecked ? true : false)
          }
        />
        <Label htmlFor="indeterminate-checkbox">Indeterminate State</Label>
      </div>
    );
  },
};

