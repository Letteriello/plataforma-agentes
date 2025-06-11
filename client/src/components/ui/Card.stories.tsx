import type { Meta, StoryObj } from '@storybook/react';
import { BellIcon, CheckIcon } from 'lucide-react';
import { Button } from './button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';
import { Input } from './input';
import { Label } from './label';
import { Switch } from './switch';

/**
 * A versatile container for grouping related content. The Card component is
 * composed of multiple subcomponents to provide flexibility in layout.
 * - `Card`: The main container.
 * - `CardHeader`: Container for the title and description.
 * - `CardTitle`: The main heading of the card.
 * - `CardDescription`: A subtitle or description.
 * - `CardContent`: The main content area.
 * - `CardFooter`: The bottom section, typically for actions.
 */
const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    // No specific argTypes for the root Card component itself.
    // Composition is controlled by children.
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

/**
 * A complete card example including a header, content, and a footer with action buttons.
 * This is the most common use case.
 */
export const CompleteExample: Story = {
  render: (args) => (
    <Card {...args} className="w-[380px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the main content area of the card.</p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="secondary">Cancel</Button>
        <Button>Save</Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * A card can be used to wrap a form, providing a clear boundary for user input.
 */
export const WithForm: Story = {
  render: (args) => (
    <Card {...args} className="w-[450px]">
      <CardHeader>
        <CardTitle>Create Project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Name of your project" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Framework</Label>
              <select
                id="framework"
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="next">Next.js</option>
                <option value="sveltekit">SvelteKit</option>
                <option value="astro">Astro</option>
                <option value="nuxt">Nuxt.js</option>
              </select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * This example shows how a card can be used to display a list of notifications,
 * combining text, icons, and interactive elements like a Switch.
 */
export const WithNotifications: Story = {
  render: (args) => (
    <Card {...args} className="w-[420px]">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center space-x-4 rounded-md border p-4">
          <BellIcon />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              Push Notifications
            </p>
            <p className="text-sm text-muted-foreground">
              Send notifications to device.
            </p>
          </div>
          <Switch />
        </div>
        <div>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
            >
              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  Your call has been confirmed.
                </p>
                <p className="text-sm text-muted-foreground">
                  {i + 1} hour{i > 0 && 's'} ago
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <CheckIcon className="mr-2 h-4 w-4" /> Mark all as read
        </Button>
      </CardFooter>
    </Card>
  ),
};
