import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import { Input } from './input';
import { Label } from './label';

/**
 * A window overlaid on either the primary window or another dialog window,
 * rendering the content underneath inert.
 * Built on top of Radix UI's Dialog primitive for accessibility.
 *
 * It is composed of several parts:
 * - `Dialog`: The root component.
 * - `DialogTrigger`: A button or element that opens the dialog.
 * - `DialogContent`: The main content of the dialog, includes overlay and layout.
 * - `DialogHeader`: Container for title and description.
 * - `DialogTitle`: The title of the dialog.
 * - `DialogDescription`: A description for the dialog.
 * - `DialogFooter`: The footer, typically for action buttons.
 */
const meta: Meta<typeof Dialog> = {
  title: 'UI/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

/**
 * The most basic usage of a Dialog, showing its main parts.
 * The `DialogTrigger` wraps the element that will open the dialog.
 */
export const BasicUsage: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Basic Dialog</DialogTitle>
          <DialogDescription>
            This is the description for the basic dialog.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">Your content goes here.</div>
        <DialogFooter>
          <Button type="submit">Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * A common use case for a dialog is to host a form.
 * This example shows an "Edit Profile" form within the dialog.
 */
export const FormDialog: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue="Gabriel Letteriello"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              defaultValue="@letteriello"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * When content inside `DialogContent` exceeds the available height,
 * it automatically becomes scrollable.
 */
export const ScrollingContent: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button variant="outline">View Terms of Service</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
        </DialogHeader>
        <div className="max-h-[400px] overflow-y-auto pr-4 space-y-2 text-sm">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
            dignissim, justo eget Pede, tellus. Cras consectetuer, velit sed
            luctus consectetuer, pede justo porta est, eget egestas sem est sed
            neque. In hac habitasse platea dictumst. Nam scelerisque, quam quis
            accumsan ullamcorper, enim dolor imperdiet sem, nec viverra quam
            sem ut quam. In hac habitasse platea dictumst. Nam sed magna. Ut
            tincidunt, purus ac eleifend consectetuer, lectus nisl scelerisque
            sem, vitae tempor pede turpis vel lorem. In hac habitasse platea
            dictumst. Vivamus pretium. Nunc eleifend, elit vel tincidunt
            egestas, ipsum libero congue mi, vitae pulvinar pede justo quis
            risus. Vivamus vel sapien. Aenean commodo, magna quis ultricies
            consectetuer, nisl nunc pulvinar est, sed tempus pede est ut sem.
            Aenean ut erat. Vivamus et nisl. Aenean eleifend, pede vitae
            tincidunt consectetuer, elit elit tempor nisl, sit amet interdum
            nunc est sit amet magna.
          </p>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogTrigger asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
