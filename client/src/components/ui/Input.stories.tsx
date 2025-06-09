import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Input } from './input';

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'search', 'tel', 'url'],
    },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    value: { control: 'text' }, // For controlled input demonstration
    onChange: { action: 'changed' },
  },
  args: {
    type: 'text',
    placeholder: 'Type here...',
    disabled: false,
    onChange: fn(), // Mock function for onChange
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Default input',
  },
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'user@example.com',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Password',
    value: 'password123', // Show some value for password type
  },
};

export const NumberInput: Story = {
  args: {
    type: 'number',
    placeholder: '0',
  },
};

export const SearchInput: Story = {
  args: {
    type: 'search',
    placeholder: 'Search...',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
    value: 'Cannot edit',
  },
};

export const WithValue: Story = {
  args: {
    value: 'This is a pre-filled value.',
    // To make it interactive in Storybook when value is controlled:
    // You might need a simple wrapper component or use Storybook's 'play' function
    // to simulate typing if you want to show dynamic updates to a controlled input.
    // For now, this just shows an input with a static pre-filled value.
  },
};

// Example of how to make it interactive if it were a controlled component in a real app
// This requires a bit more setup for Storybook to manage state.
// export const Controlled: Story = {
//   render: (args) => {
//     const [value, setValue] = React.useState('');
//     return <Input {...args} value={value} onChange={(e) => setValue(e.target.value)} />;
//   },
//   args: {
//     placeholder: "Controlled input, type here..."
//   }
// };
