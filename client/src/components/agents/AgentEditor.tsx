import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

import { LLMAgentForm } from './forms/LLMAgentForm'
import AgentToolsTab from './forms/AgentToolsTab'
import { BaseAgentForm } from './forms/BaseAgentForm';
import agentService from '@/api/agentService'; // Added agentService import
import type { CreateAgentDTO } from '@/api/agentService'; // For createAgent payload type
import { LlmAgentConfig, createDefaultAgent, LlmAgentConfigSchema, AgentType } from '@/types/agents'; // Added AgentType if not already there

const WIZARD_STEPS = [
  'identidade',
  'instrucoes',
  'modelo_geracao',
  'ferramentas',
  'memoria',
]
const STEP_LABELS: { [key: string]: string } = {
  identidade: 'Identidade',
  instrucoes: 'Instruções',
  modelo_geracao: 'Modelo & Geração',
  ferramentas: 'Ferramentas',
  memoria: 'Memória',
}

// Dados mock atualizados para refletir a nova estrutura aninhada do ADK
const mockAgents: LlmAgentConfig[] = [
  {
    id: '1',
    name: 'Customer Support Bot',
    description: 'Handles customer inquiries and support tickets',
    type: AgentType.LLM,
    model: 'gemini-1.5-pro',
    instruction:
      'You are a helpful customer support assistant. Be polite and professional.',
    generateContentConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
      topP: 1,
      topK: 40,
      stopSequences: [],
    },
    tools: ['tool-1', 'tool-2'],
    // Propriedades base
    version: '1.0.0',
    isPublic: true,
    tags: ['support', 'gemini'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export function AgentEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const [agent, setAgent] = useState<AnyAgentConfig | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  useEffect(() => {
    if (id) {
      setMode('edit');
      setIsLoading(true);
      agentService.fetchAgentById(id)
        .then(data => {
          // O AgentDetailDTO retornado é compatível com LlmAgentConfig
          // e o estado agent é AnyAgentConfig, então a atribuição direta é ok.
          setAgent(data as AnyAgentConfig); 
        })
        .catch(err => {
          console.error('Failed to fetch agent:', err);
          toast({
            variant: 'destructive',
            title: 'Erro ao carregar agente',
            description: (err as Error)?.message || 'Não foi possível encontrar o agente.',
          });
          navigate('/agents');
        })
        .finally(() => setIsLoading(false));
    } else {
      setMode('create');
      // Cria um novo agente com a estrutura padrão correta
      // createDefaultAgent retorna AnyAgentConfig, compatível com o estado agent.
      setAgent(createDefaultAgent(AgentType.LLM)); 
    }
  }, [id, navigate, toast])

  const handleNextStep = () => {
    if (currentStepIndex < WIZARD_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }

  const handleTabChange = (value: string) => {
    const stepIndex = WIZARD_STEPS.indexOf(value)
    if (stepIndex !== -1) {
      setCurrentStepIndex(stepIndex)
    }
  }

  const handleCancel = () => {
    navigate('/agents')
  }

  const handleSubmit = async (values: LlmAgentConfig) => {
    setIsLoading(true);
    const currentAgentId = id; // id from useParams()

    try {
      if (mode === 'create') {
        // Destructure to get tools and remove id, createdAt, updatedAt for the payload
        // The 'tools' array from 'values' contains the IDs of selected tools.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _id, createdAt, updatedAt, tools, ...agentDataForCreation } = values;
        
        // Create the agent first (payload should not include 'tools' if backend handles it separately)
        const newAgent = await agentService.createAgent(agentDataForCreation as CreateAgentDTO);
        toast({
          title: 'Agente criado com sucesso!',
          description: `O agente "${newAgent.name}" foi criado.`,
        });

        const toolsToAssociate = tools || []; // These are string IDs from the form
        if (toolsToAssociate.length > 0) {
          toast({ title: "Info", description: `Associando ${toolsToAssociate.length} ferramentas...` });
          const associationPromises = toolsToAssociate.map(toolId =>
            agentService.associateToolWithAgent(newAgent.id, toolId)
          );
          // Use Promise.allSettled to handle individual successes/failures
          const results = await Promise.allSettled(associationPromises);
          
          results.forEach((result, index) => {
            if (result.status === 'rejected') {
              console.error(`Failed to associate tool ${toolsToAssociate[index]}:`, result.reason);
              toast({
                title: 'Erro na associação de ferramenta',
                description: `Falha ao associar ferramenta ID "${toolsToAssociate[index]}". Motivo: ${(result.reason as Error)?.message || 'Erro desconhecido'}`,
                variant: 'destructive',
              });
            }
          });
        }
        navigate(`/agents/${newAgent.id}/edit`); // Navigate to the new agent's edit page

      } else if (mode === 'edit' && currentAgentId) {
        // In edit mode, AgentToolsTab handles tool associations directly.
        // The main update payload should not include the 'tools' array.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _id, createdAt, updatedAt, tools, ...agentDataForUpdate } = values;
        
        const updatedAgent = await agentService.updateAgent(currentAgentId, agentDataForUpdate as any); // Cast if UpdateAgentDTO is different
        toast({
          title: 'Agente salvo com sucesso!',
          description: `O agente "${updatedAgent.name}" foi atualizado.`,
        });
        // Stay on the edit page or navigate to /agents as preferred. Staying is common.
        navigate(`/agents/${currentAgentId}/edit`); 
      }
    } catch (err) {
      console.error(`Failed to ${mode === 'create' ? 'create' : 'update'} agent:`, err);
      toast({
        variant: 'destructive',
        title: `Erro ao ${mode === 'create' ? 'criar' : 'salvar'} agente`,
        description: (err as Error)?.message || 'Não foi possível salvar o agente.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (!agent) {
    return <div>Carregando...</div> // Ou um componente de esqueleto
  }

  return (
    <div className="container mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">
          {mode === 'create' ? 'Criar Novo Agente' : `Editar Agente: ${agent.name}`}
        </h1>
        <p className="text-muted-foreground mt-2">
          Siga os passos para configurar seu agente LLM.
        </p>
      </header>

      <BaseAgentForm
        schema={LLMAgentSchema}
        defaultValues={agent}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      >
        <Tabs
          value={WIZARD_STEPS[currentStepIndex]}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-5 mb-6">
            {WIZARD_STEPS.map((step) => (
              <TabsTrigger key={step} value={step}>
                {STEP_LABELS[step]}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="identidade">
            <Card>
              <CardHeader>
                <CardTitle>Identidade do Agente</CardTitle>
                <CardDescription>
                  Dê um nome e uma descrição para identificar seu agente.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ex: Agente de Vendas" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Ex: Responsável por qualificar leads e agendar reuniões."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="instrucoes">
            <Card>
              <CardHeader>
                <CardTitle>Instruções</CardTitle>
                <CardDescription>
                  Defina o comportamento e a personalidade do seu agente.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  name="instruction"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={12}
                          placeholder="Você é um assistente prestativo..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="modelo_geracao">
            <LLMAgentForm disabled={isLoading} />
          </TabsContent>

          <TabsContent value="ferramentas">
            <AgentToolsTab agentId={id} />
          </TabsContent>

          <TabsContent value="memoria">
            <Card>
              <CardHeader>
                <CardTitle>Memória</CardTitle>
                <CardDescription>
                  Defina as configurações de memória do seu agente.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Em breve: Funcionalidade de configuração de memória.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <div>
            <Button
              variant="outline"
              onClick={handlePreviousStep}
              disabled={currentStepIndex === 0 || isLoading}
              className={currentStepIndex === 0 ? 'invisible' : ''}
            >
              Anterior
            </Button>
          </div>
          <div className="space-x-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            {currentStepIndex === WIZARD_STEPS.length - 1 ? (
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? mode === 'create'
                    ? 'Criando...'
                    : 'Salvando...'
                  : mode === 'create'
                    ? 'Criar Agente'
                    : 'Salvar Alterações'}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleNextStep}
                disabled={currentStepIndex === WIZARD_STEPS.length - 1 || isLoading}
              >
                Próximo
              </Button>
            )}
          </div>
        </div>
      </BaseAgentForm>
    </div>
  )
}
