import { zodResolver } from '@hookform/resolvers/zod'
import type { StoryObj } from '@storybook/react'
import { FormProvider, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { AgentType, createDefaultAgentConfig as createDefaultAgent } from '@/types/core/agent'
import { LlmAgentConfigSchema, type LlmAgentConfig } from '@/types/agents'

import { LLMAgentForm } from './LLMAgentForm'

const meta = {
  title: 'Agents/Forms/LLMAgentForm',
  component: LLMAgentForm,
  tags: ['autodocs'],
  args: {
    disabled: false,
    isWizardMode: false,
    defaultValues: undefined as LlmAgentConfig | undefined, // For story setup, not a direct prop
  },
  argTypes: {
    defaultValues: { control: { type: null } }, // Hide from Storybook controls
    className: { control: { type: null } }, // Assuming className is not a primary story control
    isWizardMode: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Este formulário gerencia a configuração de um Agente LLM, incluindo a seleção do modelo e os parâmetros de geração. Ele é projetado para ser usado dentro de um `FormProvider` do `react-hook-form`.'
      }
    }
  },
  decorators: [
  (Story: React.FC<any>, context: { args: { defaultValues?: LlmAgentConfig; disabled?: boolean; isWizardMode?: boolean } }) => {
    const { defaultValues, ...formArgs } = context.args;
    const formMethods = useForm<LlmAgentConfig>({
      resolver: zodResolver(LlmAgentConfigSchema),
defaultValues: defaultValues || (createDefaultAgent(AgentType.LLM) as unknown as LlmAgentConfig),
    });
    const onSubmit = () => {
      alert('Dados do formulário logados no console. Veja a aba "Actions".');
    };
    return (
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)} className="p-8 max-w-4xl mx-auto">
          <Story {...formArgs} />
          <div className="mt-8 flex justify-end">
            <Button type="submit">Salvar Agente</Button>
          </div>
        </form>
      </FormProvider>
    );
  }
]
}

export default meta

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    disabled: false
  }
}

export const Disabled: Story = {
  args: {
    disabled: true
  }
}

export const Editing: Story = {
  args: {
    disabled: false,
    // defaultValues deve ser apenas usado no decorator, não passado como prop para o componente
    defaultValues: {
      ...(createDefaultAgent(AgentType.LLM) as unknown as LlmAgentConfig),
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
        stopSequences: ['FIM']
      }
    }
  }
}
