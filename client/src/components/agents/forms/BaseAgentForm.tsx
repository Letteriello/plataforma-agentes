import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { BaseAgent, BaseAgentSchema } from '@/types/agents';

type BaseAgentFormProps<T extends z.ZodType> = {
  defaultValues?: z.infer<T>;
  onSubmit: (values: z.infer<T>) => void;
  onCancel: () => void;
  children: React.ReactNode;
  schema: T;
  submitLabel?: string;
  cancelLabel?: string;
  className?: string;
};

export function BaseAgentForm<T extends z.ZodType>({
  defaultValues,
  onSubmit,
  onCancel,
  children,
  schema,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  className = '',
}: BaseAgentFormProps<T>) {
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any,
  });

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)} 
          className={`space-y-6 ${className}`}
        >
          <div className="space-y-4">
            {children}
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={onCancel}
            >
              {cancelLabel}
            </Button>
            <Button type="submit">
              {submitLabel}
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
}
