import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { TagInput } from './tag-input';

/**
 * A controlled input component for entering and managing a list of tags.
 * It supports features like max tags, max length, and keyboard interactions for adding/removing tags.
 */
const meta: Meta<typeof TagInput> = {
  title: 'UI/TagInput',
  component: TagInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text to display when the input is empty.',
    },
    tags: {
      control: 'object',
      description: 'An array of strings representing the current tags.',
    },
    onTagsChange: {
      action: 'tagsChanged',
      description: 'Callback function invoked when the tags array changes.',
    },
    maxTags: {
      control: 'number',
      description: 'The maximum number of tags allowed.',
    },
    maxLength: {
      control: 'number',
      description: 'The maximum character length for a single tag.',
    },
    disabled: {
      control: 'boolean',
      description: 'If true, the input is disabled and cannot be interacted with.',
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
type Story = StoryObj<typeof TagInput>;

/**
 * An interactive story that allows you to test all the features of the TagInput.
 * Use the controls panel to change props like `maxTags`, `maxLength`, and `disabled`.
 */
export const Interactive: Story = {
  render: (args) => {
    // The component is controlled, so we manage its state here.
    const [tags, setTags] = React.useState(args.tags || ['react', 'typescript']);

    const handleTagsChange = (newTags: string[]) => {
      setTags(newTags);
      // Forward the action to the Storybook actions panel
      args.onTagsChange?.(newTags);
    };

    return <TagInput {...args} tags={tags} onTagsChange={handleTagsChange} />;
  },
  args: {
    placeholder: 'Add a tag...',
    tags: ['nextjs', 'storybook', 'tailwind'],
    maxTags: 8,
    maxLength: 20,
    disabled: false,
  },
};
