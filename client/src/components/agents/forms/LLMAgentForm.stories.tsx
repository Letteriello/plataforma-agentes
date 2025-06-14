import { zodResolver } from '@hookform/resolvers/zod'
import type { Meta, StoryObj } from '@storybook/react'
import { FormProvider, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { createDefaultAgent } from '@/lib/agent-utils'
import { LLMAgentSchema, type LLMAgent } from '@/types/agents'

import { LLMAgentForm } from './LLMAgentForm'

interface StoryArgs {
  defaultValues?: LLMAgent
}

const meta: Meta<typeof LLMAgentForm> = {
  title: 'Agents/Forms/LLMAgentForm',
  component: LLMAgentForm,
  tags: ['autodocs'],
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
    (Story, { args }) => {
      const formMethods = useForm<LLMAgent>({
        resolver: zodResolver(LLMAgentSchema),
        defaultValues: (args as StoryArgs).defaultValues || createDefaultAgent('llm') as LLMAgent
      })

      const onSubmit = (data: LLMAgent) => {
        console.log('Form Submitted', data)
        alert('Dados do formulário logados no console. Veja a aba "Actions".')
      }

      return (
        <FormProvider {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(onSubmit)} className="p-8 max-w-4xl mx-auto">
            <Story />
            <div className="mt-8 flex justify-end">
              <Button type="submit">Salvar Agente</Button>
            </div>
          </form>
        </FormProvider>
      )
    }
  ]
}

export default meta

type Story = StoryObj<typeof meta & { defaultValues?: LLMAgent }>

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
    defaultValues: {
      ...createDefaultAgent('llm') as LLMAgent,
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
