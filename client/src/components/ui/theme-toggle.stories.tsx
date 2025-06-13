import type { Meta, StoryObj } from '@storybook/react';

import { Card, CardContent, CardHeader, CardTitle } from './card';
import { ThemeProvider } from './theme-provider';
import { ThemeToggle } from './theme-toggle';

/**
 * A button component that allows the user to toggle between light and dark themes.
 *
 * **Note:** This component must be used within a `ThemeProvider` to function correctly.
 * For Storybook, the provider is added globally as a decorator.
 */
const meta: Meta<typeof ThemeToggle> = {
  title: 'UI/ThemeToggle',
  component: ThemeToggle,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      // The ThemeProvider is essential for the toggle to work.
      // It manages the theme state and applies it to the document.
      <ThemeProvider defaultTheme="light" storageKey="storybook-theme">
        <div className="p-4 rounded-md bg-background">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ThemeToggle>;

/**
 * The default ThemeToggle. Click the sun/moon icon to switch themes.
 * The Card component is included to demonstrate the theme change in real-time.
 */
export const Default: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <ThemeToggle />
      <Card className="w-64">
        <CardHeader>
          <CardTitle>Themed Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This card changes its appearance based on the selected theme.</p>
        </CardContent>
      </Card>
    </div>
  ),
};
