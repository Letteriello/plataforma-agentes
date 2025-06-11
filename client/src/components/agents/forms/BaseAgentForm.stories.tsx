import type { Meta, StoryObj } from '@storybook/react';
import { z } from 'zod';
import { action } from '@storybook/addon-actions';

import { BaseAgentForm } from './BaseAgentForm';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

// A simple Zod schema for demonstration purposes
const DemoSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
});

type DemoFormValues = z.infer<typeof DemoSchema>;

const meta: Meta<typeof BaseAgentForm> = {
  title: 'Agents/Forms/BaseAgentForm',
  component: BaseAgentForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'O `BaseAgentForm` é um componente wrapper genérico que fornece a estrutura e a lógica de um formulário, incluindo o `FormProvider` do `react-hook-form`, validação com Zod, e botões de submissão/cancelamento. Ele é projetado para encapsular os campos de formulário específicos passados como `children`.',
      },
    },
  },
  argTypes: {
    schema: {
      description: 'O schema Zod usado para validação do formulário.',
      control: { type: null }, // Schema is not a user-editable control
    },
    onSubmit: {
      description: 'Função chamada com os dados válidos do formulário na submissão.',
      action: 'submitted',
    },
    onCancel: {
      description: 'Função chamada quando o botão de cancelar é clicado.',
      action: 'cancelled',
    },
    submitLabel: {
      control: 'text',
      description: 'Texto customizado para o botão de submissão.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Save' },
      },
    },
    cancelLabel: {
      control: 'text',
      description: 'Texto customizado para o botão de cancelamento.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Cancel' },
      },
    },
    className: {
      control: 'text',
      description: 'Classes CSS adicionais para o elemento `<form>`.',
    },
    children: {
      description: 'Os campos do formulário (componentes React) a serem renderizados.',
      control: { type: null },
    },
  },
};

export default meta;

// Definindo o tipo da Story para incluir os argumentos específicos
type Story = StoryObj<
  typeof BaseAgentForm<typeof DemoSchema>
>;

// Componente de formulário de demonstração para ser passado como children
const DemoFormFields = (
  <>
    <FormField
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input placeholder="John Doe" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input placeholder="john.doe@example.com" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </>
);

/**
 * Exemplo de uso padrão do `BaseAgentForm`.
 * Ele envolve os campos de um formulário, fornecendo botões de ação e lógica de validação.
 */
export const Default: Story = {
  args: {
    schema: DemoSchema,
    defaultValues: {
      name: '',
      email: '',
    },
    onSubmit: action('onSubmit'),
    onCancel: action('onCancel'),
    children: DemoFormFields,
    className: 'w-96',
  },
};

/**
 * Exemplo mostrando como customizar os rótulos dos botões de ação.
 */
export const CustomLabels: Story = {
  args: {
    ...Default.args,
    submitLabel: 'Criar Usuário',
    cancelLabel: 'Voltar',
  },
};

/**
 * Exemplo com valores padrão preenchidos, simulando um formulário de edição.
 */
export const WithDefaultValues: Story = {
  args: {
    ...Default.args,
    defaultValues: {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
    },
    submitLabel: 'Salvar Alterações',
  },
};
