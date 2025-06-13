import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/react';
import { FormProvider,useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { createDefaultAgent,LLMAgent, LLMAgentSchema } from '@/types/agents';

import { LLMAgentForm } from './LLMAgentForm';

const meta: Meta<typeof LLMAgentForm> = {
  title: 'Agents/Forms/LLMAgentForm',
  component: LLMAgentForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Este formulário gerencia a configuração de um Agente LLM, incluindo a seleção do modelo e os parâmetros de geração. Ele é projetado para ser usado dentro de um `FormProvider` do `react-hook-form`.',
      },
    },
  },
  // Documentação das props para o painel de Controles do Storybook
  argTypes: {
    disabled: {
      control: 'boolean',
      description:
        'Desabilita todos os campos do formulário, útil para estados de carregamento ou somente leitura.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    className: {
      control: 'text',
      description: 'Classes CSS adicionais para customizar o container do formulário.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '""' },
      },
    },
  },
  // O decorator agora aceita `defaultValues` dos args da story
  decorators: [
    (Story, { args }) => {
      // Use os defaultValues da story, ou crie um novo agente se não for fornecido
      const defaultValues = (args as any).defaultValues || createDefaultAgent('llm');

      const formMethods = useForm<LLMAgent>({
        resolver: zodResolver(LLMAgentSchema),
        defaultValues,
      });

      const onSubmit = (data: any) => {
        console.log('Form Submitted', data);
        alert('Dados do formulário logados no console. Veja a aba "Actions".');
      };

      return (
        <FormProvider {...formMethods}>
          <form
            onSubmit={formMethods.handleSubmit(onSubmit)}
            className="p-8 max-w-4xl mx-auto"
          >
            <Story />
            <div className="mt-8 flex justify-end">
              <Button type="submit">Salvar Agente</Button>
            </div>
          </form>
        </FormProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof LLMAgentForm & { defaultValues?: LLMAgent }>;

/**
 * Estado padrão do formulário, para criar um novo agente.
 * Todos os campos são interativos e preenchidos com os valores padrão definidos no `createDefaultAgent`.
 */
export const Default: Story = {
  args: {
    disabled: false,
  },
};

/**
 * Estado desabilitado do formulário.
 * Útil para visualizar como o formulário se comporta em modo de "somente leitura" ou durante uma operação de submissão.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

/**
 * Formulário preenchido com dados de um agente existente.
 * Demonstra o estado de "edição", com todos os campos populados, incluindo a estrutura aninhada `generateContentConfig`.
 */
export const Editing: Story = {
  args: {
    disabled: false,
    defaultValues: {
      ...createDefaultAgent('llm'),
      id: 'agent-123',
      name: 'Agente de Análise de Sentimento',
      description: 'Este agente analisa o sentimento de textos em português.',
      model: 'gemini-1.5-flash',
      instruction:
        'Você é um especialista em análise de sentimento. Analise o texto fornecido e retorne "positivo", "negativo" ou "neutro".',
      generateContentConfig: {
        temperature: 0.5,
        maxOutputTokens: 100,
        topP: 0.9,
        topK: 20,
        stopSequences: ['FIM'],
      },
    },
  },
};
