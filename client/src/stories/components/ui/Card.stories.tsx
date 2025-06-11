import type { Meta, StoryObj } from '@storybook/react'
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Check, MoreVertical, Star, MessageSquare, Share2 } from 'lucide-react'

// Meta information for the component
const meta = {
  title: 'Components/UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible container component for displaying content with an optional header and footer.',
      },
    },
  },

  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the card',
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

// Default card
const Template: Story = {
  render: (args) => (
    <Card className="w-[350px]" {...args}>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here. You can put any content inside the card.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Continue</Button>
      </CardFooter>
    </Card>
  ),
}

export const Default: Story = {
  ...Template,
}

// Card with image header
export const WithImage: Story = {
  render: (args) => (
    <Card className="w-[350px] overflow-hidden" {...args}>
      <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-600" />
      <CardHeader>
        <CardTitle>Featured Article</CardTitle>
        <CardDescription>Published on June 6, 2023</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          This is a featured article with an image header. The content of the
          article would go here.
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Technology</Badge>
          <Badge variant="secondary">Design</Badge>
          <Badge variant="secondary">UI/UX</Badge>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" size="sm">
          Read more
        </Button>
        <div className="flex items-center text-sm text-muted-foreground">
          <span>5 min read</span>
        </div>
      </CardFooter>
    </Card>
  ),
}

// Card with user profile
export const UserProfile: Story = {
  render: (args) => (
    <Card className="w-[300px] text-center" {...args}>
      <CardHeader>
        <div className="flex justify-center">
          <Avatar className="h-24 w-24">
            <AvatarImage src="https://github.com/shadcn.png" alt="User" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-xl">John Doe</CardTitle>
        <p className="text-muted-foreground">Product Designer</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Creating beautiful user experiences and interfaces that people love to
          use.
        </p>
        <div className="mt-4 flex justify-center gap-4">
          <Button variant="outline" size="sm">
            <MessageSquare className="mr-2 h-4 w-4" />
            Message
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  ),
}

// Card with stats
export const StatsCard: Story = {
  render: (args) => (
    <Card className="w-full max-w-md" {...args}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Project Statistics</CardTitle>
        <CardDescription>Overview of your project metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-4">
            <div className="text-2xl font-bold">1,234</div>
            <div className="text-sm text-muted-foreground">Total Visits</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-2xl font-bold">567</div>
            <div className="text-sm text-muted-foreground">Sign-ups</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-2xl font-bold">45.8%</div>
            <div className="text-sm text-muted-foreground">Conversion</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-2xl font-bold">2.3m</div>
            <div className="text-sm text-muted-foreground">Impressions</div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">
          View Detailed Report
        </Button>
      </CardFooter>
    </Card>
  ),
}

// Card with list
export const ListCard: Story = {
  render: (args) => {
    const tasks = [
      { id: 1, title: 'Complete project proposal', completed: true },
      { id: 2, title: 'Review pull requests', completed: true },
      { id: 3, title: 'Update documentation', completed: false },
      { id: 4, title: 'Fix critical bugs', completed: false },
      { id: 5, title: 'Deploy to production', completed: false },
    ]

    return (
      <Card className="w-[350px]" {...args}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tasks</CardTitle>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>5 tasks, 2 completed</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ul>
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center border-b px-6 py-3 last:border-b-0"
              >
                <Button
                  variant={task.completed ? 'outline' : 'ghost'}
                  size="icon"
                  className="h-6 w-6 rounded-full mr-3"
                >
                  {task.completed && <Check className="h-4 w-4" />}
                </Button>
                <span
                  className={`flex-1 ${
                    task.completed ? 'line-through text-muted-foreground' : ''
                  }`}
                >
                  {task.title}
                </span>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Star className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="justify-center">
          <Button variant="ghost" size="sm">
            Add new task
          </Button>
        </CardFooter>
      </Card>
    )
  },
}

// Card with tabs
export const WithTabs: Story = {
  render: (args) => {
    return (
      <Card className="w-[400px]" {...args}>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <div className="flex border-b">
            <Button
              variant="ghost"
              className="rounded-none border-b-2 border-primary"
            >
              Overview
            </Button>
            <Button variant="ghost" className="rounded-none">
              Users
            </Button>
            <Button variant="ghost" className="rounded-none">
              Revenue
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-center justify-center bg-muted/50 rounded-md">
            <p className="text-muted-foreground">
              Analytics content would go here
            </p>
          </div>
        </CardContent>
      </Card>
    )
  },
}
