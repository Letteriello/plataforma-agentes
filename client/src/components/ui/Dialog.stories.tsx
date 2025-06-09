import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './dialog'; // Import all necessary Dialog components
import { Button } from './button'; // For trigger and actions
import { Input } from './input';   // Example content
import { Label } from './label';   // Example content

const meta = {
  title: 'UI/Dialog',
  component: Dialog, // The main Root component
  parameters: {
    layout: 'centered', // Dialogs are typically centered
  },
  tags: ['autodocs'],
  // Args for the Dialog (Root) component itself might include `open`, `onOpenChange` for controlled dialogs
  argTypes: {
    // open: { control: 'boolean' },
    // onOpenChange: { action: 'openChange' },
  },
  args: {
    // onOpenChange: fn(),
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Default Dialog Title</DialogTitle>
          <DialogDescription>
            This is a description for the default dialog. You can add more details here.
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" defaultValue="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" defaultValue="@peduarte" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  args: {},
};

export const WithCustomFooter: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button variant="secondary">Dialog with Custom Footer</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogDescription>
            Are you sure you want to perform this action? This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="destructive">
            Confirm
          </Button>
          {/* DialogClose can be used here if needed, or manage open state */}
          <DialogTrigger asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  args: {},
};

export const SimpleMessage: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button variant="ghost">Show Simple Message</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Notification</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Your submission has been received successfully. We will review it shortly.</p>
        </div>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button>OK</Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  args: {},
};

// Story for a dialog that might be wider
export const WideDialog: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button>Open Wide Dialog</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl"> {/* Use Tailwind class for wider dialog */}
        <DialogHeader>
          <DialogTitle>Extended Content View</DialogTitle>
          <DialogDescription>
            This dialog has more horizontal space for larger content.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-3">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          <img src="https://via.placeholder.com/600x200" alt="Placeholder" className="w-full h-auto rounded-md" />
        </div>
        <DialogFooter>
          <DialogTrigger asChild><Button variant="outline">Close</Button></DialogTrigger>
          <Button>Primary Action</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  args: {},
};

// Example of a controlled Dialog (though less common for basic stories)
// export const ControlledDialog: Story = {
//   render: (args) => {
//     const [isOpen, setIsOpen] = React.useState(false);
//     return (
//       <>
//         <Button onClick={() => setIsOpen(true)}>Open Controlled Dialog</Button>
//         <Dialog open={isOpen} onOpenChange={setIsOpen} {...args}>
//           {/* No DialogTrigger needed if controlled externally */}
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Controlled Dialog</DialogTitle>
//             </DialogHeader>
//             <p className="py-4">This dialog's open state is managed by React state.</p>
//             <DialogFooter>
//               <Button onClick={() => setIsOpen(false)}>Close</Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </>
//     );
//   },
//   args: {},
// };
