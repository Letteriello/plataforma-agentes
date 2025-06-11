import type { Meta, StoryObj } from '@storybook/react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card' // Import all necessary Card components
import { Button } from './button' // Example content
import { Label } from './label' // Example content
import { Input } from './input' // Example content
import { Checkbox } from './checkbox' // Example content

const meta = {
  title: 'UI/Card',
  component: Card, // Main Card component
  parameters: {
    layout: 'padded', // Use padded to give some space around the card
  },

  // No specific args for the Card root usually, props are passed to children or are HTML attributes
  argTypes: {
    // children: { control: 'object' } // Content of the card
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="w-[380px]">
      <CardHeader>
        <CardTitle>Default Card Title</CardTitle>
        <CardDescription>This is a default card description.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          This is the main content area of the card. You can put any React nodes
          here.
        </p>
        <p className="mt-2">
          For example, some more text, lists, or other components.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" size="sm" className="mr-2">
          Cancel
        </Button>
        <Button size="sm">Save</Button>
      </CardFooter>
    </Card>
  ),
  args: {},
}

export const WithFormElements: Story = {
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
              {/* Minimal Select for demonstration, real one would need items */}
              <select
                id="framework"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="" disabled selected>
                  Select a framework
                </option>
                <option value="next">Next.js</option>
                <option value="vite">Vite</option>
                <option value="astro">Astro</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="public-access" />
              <Label htmlFor="public-access">Allow public access</Label>
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
  args: {},
}

export const SimpleContent: Story = {
  render: (args) => (
    <Card {...args} className="w-[300px]">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className=" flex items-center space-x-4 rounded-md border p-4">
          <BellIcon /> {/* Placeholder for an icon */}
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              Push Notifications
            </p>
            <p className="text-sm text-muted-foreground">
              Send notifications to device.
            </p>
          </div>
          <Switch /> {/* Placeholder for a Switch */}
        </div>
        <div>
          <p className="text-sm text-muted-foreground p-4">
            Email notifications are handled in your profile settings.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <CheckIcon className="mr-2 h-4 w-4" /> Mark all as read{' '}
          {/* Placeholder */}
        </Button>
      </CardFooter>
    </Card>
  ),
  args: {},
  // Adding placeholder icons for the story to render without error
  decorators: [
    (Story) => {
      // Define placeholder BellIcon and CheckIcon if not available globally
      // @ts-ignore
      if (typeof BellIcon === 'undefined')
        global.BellIcon = () => (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
          </svg>
        )
      // @ts-ignore
      if (typeof CheckIcon === 'undefined')
        global.CheckIcon = () => (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        )
      // @ts-ignore
      if (typeof Switch === 'undefined')
        global.Switch = () => (
          <div
            style={{
              width: 40,
              height: 20,
              borderRadius: 10,
              backgroundColor: '#ccc',
            }}
            data-testid="switch-placeholder"
          />
        )
      return <Story />
    },
  ],
}

export const OnlyContent: Story = {
  render: (args) => (
    <Card {...args} className="w-[300px] text-center">
      <CardContent className="p-6">
        <p className="font-semibold text-lg">This card has only content.</p>
        <p className="text-muted-foreground mt-1">
          Useful for simple displays.
        </p>
      </CardContent>
    </Card>
  ),
  args: {},
}

export const NoFooter: Story = {
  render: (args) => (
    <Card {...args} className="w-[350px]">
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
        <CardDescription>Information about the user.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>
            <strong>Name:</strong> Ada Lovelace
          </p>
          <p>
            <strong>Email:</strong> ada@example.com
          </p>
          <p>
            <strong>Joined:</strong> January 1, 2023
          </p>
        </div>
      </CardContent>
      {/* No CardFooter here */}
    </Card>
  ),
  args: {},
}
