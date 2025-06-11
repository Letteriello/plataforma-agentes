import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button' // To trigger toasts
import { useToast } from './use-toast' // The hook to trigger toasts
import { ToastAction } from './toaster' // The ToastAction component for actions in toasts

// Meta configuration for the Toast stories
const meta = {
  title: 'UI/Toast',
  // We don't really render the Toast component directly in stories,
  // but rather trigger it. We can associate with Toaster or Button.
  // For simplicity, let's make a dummy component or associate with Button.
  component: Button, // Or a custom component that triggers toasts
  parameters: {
    layout: 'centered',
  },

  decorators: [
    // The ToastProvider and Toaster are already in preview.tsx,
    // so individual stories don't need to re-add them.
    (Story) => (
      <div className="flex flex-col space-y-4">
        <Story />
        {/* Toaster is rendered globally by the decorator in preview.tsx */}
      </div>
    ),
  ],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// Story to demonstrate default toast
export const Default: Story = {
  render: () => {
    const { toast } = useToast()
    return (
      <Button
        variant="outline"
        onClick={() => {
          toast({
            title: 'Scheduled: Catch up ',
            description: 'Friday, February 10, 2023 at 5:57 PM',
          })
        }}
      >
        Show Default Toast
      </Button>
    )
  },
}

// Story for success toast
export const Success: Story = {
  render: () => {
    const { toast } = useToast()
    return (
      <Button
        variant="outline"
        onClick={() => {
          toast({
            variant: 'success',
            title: 'Success!',
            description: 'Your changes have been saved successfully.',
          })
        }}
      >
        Show Success Toast
      </Button>
    )
  },
}

// Story for destructive toast
export const Destructive: Story = {
  render: () => {
    const { toast } = useToast()
    return (
      <Button
        variant="destructive"
        onClick={() => {
          toast({
            variant: 'destructive',
            title: 'Uh oh! Something went wrong.',
            description: 'There was a problem with your request.',
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          })
        }}
      >
        Show Destructive Toast
      </Button>
    )
  },
}

export const WithTitleOnly: Story = {
  render: () => {
    const { toast } = useToast()
    return (
      <Button
        variant="outline"
        onClick={() => {
          toast({
            title: 'Event Notification',
          })
        }}
      >
        Toast with Title Only
      </Button>
    )
  },
}

export const WithAction: Story = {
  render: () => {
    const { toast } = useToast()
    return (
      <Button
        variant="secondary"
        onClick={() => {
          toast({
            title: 'Update Available',
            description:
              'A new version of the software is available for download.',
            action: (
              <ToastAction
                altText="UpdateNow"
                onClick={() => alert('Update clicked!')}
              >
                Update Now
              </ToastAction>
            ),
            duration: 8000, // Longer duration for action
          })
        }}
      >
        Show Toast with Action
      </Button>
    )
  },
}

export const LongDescription: Story = {
  render: () => {
    const { toast } = useToast()
    return (
      <Button
        variant="outline"
        onClick={() => {
          toast({
            title: 'System Maintenance Advisory',
            description:
              'Please be advised that system maintenance will occur tonight from 11:00 PM to 2:00 AM. ' +
              'During this period, services may be temporarily unavailable. We apologize for any inconvenience.',
            duration: 10000, // Longer duration
          })
        }}
      >
        Toast with Long Description
      </Button>
    )
  },
}

export const NoAutoDismiss: Story = {
  render: () => {
    const { toast } = useToast()
    return (
      <Button
        variant="outline"
        onClick={() => {
          toast({
            title: 'Important: Action Required',
            description:
              'This toast will not dismiss automatically. Please click the close button.',
            duration: 0, // 0 means no auto-dismiss
            action: (
              <ToastAction
                altText="Dismiss"
                onClick={() => {
                  /* Logic to dismiss if not using default close */
                }}
              >
                OK
              </ToastAction>
            ),
          })
        }}
      >
        Toast (No Auto-Dismiss)
      </Button>
    )
  },
}
