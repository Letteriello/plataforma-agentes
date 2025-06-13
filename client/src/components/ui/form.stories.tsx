import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from './button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';
import { Input } from './input';
import { Toaster } from './toaster';
import { useToast } from './use-toast';

/**
 * A form component that integrates `react-hook-form` with `zod` for validation.
 * It provides a structured way to build accessible and reusable forms.
 */
const meta: Meta<typeof Form> = {
  title: 'UI/Form',
  component: Form,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `This component is a wrapper around react-hook-form, designed to simplify form creation and validation. It uses Zod for schema validation and provides a set of accessible subcomponents (FormField, FormItem, FormLabel, etc.) to structure your forms consistently.`,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
        <Toaster />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Form>;

// 1. Define your form schema using Zod.
const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
});

// The component that renders the form.
const ProfileFormExample = () => {
  const { toast } = useToast();

  // 2. Initialize the form with react-hook-form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
    },
  });

  // 3. Define the submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    });
  }

  // 4. Build the form structure.
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="example@company.com" {...field} />
              </FormControl>
              <FormDescription>Your email address will not be shared.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

/**
 * This example demonstrates a complete form with validation, submission handling, and toast notifications.
 * It showcases how to structure fields using `FormField`, `FormItem`, and other provided components.
 */
export const ProfileForm: Story = {
  render: () => <ProfileFormExample />,
};

