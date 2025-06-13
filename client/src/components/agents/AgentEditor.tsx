import { useEffect,useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import agentService from '../../api/agentService';
import type { LlmAgentConfig } from '../../types/agents';
import { createDefaultAgent,LlmAgentConfigSchema } from '../../types/agents';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { ComponentSkeleton } from '../ui/component-skeleton';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import { useToast } from '../ui/use-toast';
import { AdvancedAgentForm } from './forms/AdvancedAgentForm';
import AgentMemoryTab from './forms/AgentMemoryTab';
import AgentToolsTab from './forms/AgentToolsTab';
import { BaseAgentForm } from './forms/BaseAgentForm';
import { LLMAgentForm } from './forms/LLMAgentForm';

interface AgentEditorProps {
  isWizardMode?: boolean;
}

export function AgentEditor({
  isWizardMode = false,
}: AgentEditorProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const formMethods = useFormContext<LlmAgentConfig>();

  const [agentData, setAgentData] = useState<LlmAgentConfig>(createDefaultAgent());
  const [isLoading, setIsLoading] = useState(true);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [activeTab, setActiveTab] = useState('identidade');

  const WIZARD_STEPS = [
    'identidade',
    'instrucoes',
    'modelo_geracao',
    'ferramentas',
    'avancado',
    'memoria',
  ];
  const STEP_LABELS: { [key: string]: string } = {
    identidade: 'Identidade',
    instrucoes: 'Instruções',
    modelo_geracao: 'Modelo & Geração',
    ferramentas: 'Ferramentas',
    avancado: 'Avançado',
    memoria: 'Memória',
  };

  const currentStepIndex = WIZARD_STEPS.indexOf(activeTab);

  useEffect(() => {
    if (id) {
      setMode('edit');
      agentService
        .getAgentById(id)
        .then((data) => {
          const parsedData = LlmAgentConfigSchema.parse(data);
          setAgentData(parsedData);
          formMethods.reset(parsedData);
        })
        .catch(() =>
          toast({ variant: 'destructive', title: 'Erro ao carregar o agente' })
        )
        .finally(() => setIsLoading(false));
    } else {
      setMode('create');
      formMethods.reset(createDefaultAgent());
      setIsLoading(false);
    }
  }, [id, formMethods, toast]);

  const handleTabChange = (newTab: string) => {
    if (!isWizardMode) {
      setActiveTab(newTab);
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < WIZARD_STEPS.length - 1) {
      setActiveTab(WIZARD_STEPS[currentStepIndex + 1]);
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setActiveTab(WIZARD_STEPS[currentStepIndex - 1]);
    }
  };

  const handleCancel = () => navigate('/agents');

  if (isLoading) {
    return <ComponentSkeleton />; // Use the new skeleton component
  }

  return (
    <div className="p-6">
      <BaseAgentForm>
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="identidade">Identidade</TabsTrigger>
            <TabsTrigger value="instrucoes">Instruções</TabsTrigger>
            <TabsTrigger value="modelo_geracao">Modelo & Geração</TabsTrigger>
            <TabsTrigger value="ferramentas">Ferramentas</TabsTrigger>
            <TabsTrigger value="avancado">Avançado</TabsTrigger>
            <TabsTrigger value="memoria">Memória</TabsTrigger>
          </TabsList>

          <TabsContent value="identidade" forceMount>
            <Card>
              <CardHeader>
                <CardTitle>Identidade do Agente</CardTitle>
                <CardDescription>
                  Defina o nome, a descrição e a identidade visual do seu agente.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={formMethods.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Agente</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ex: Agente de Vendas" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formMethods.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Descreva o que este agente faz."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="instrucoes" forceMount>
            <Card>
              <CardHeader>
                <CardTitle>Instruções do Sistema</CardTitle>
                <CardDescription>
                  Forneça as diretrizes e o prompt principal para o agente.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={formMethods.control}
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

          <TabsContent value="modelo_geracao" forceMount>
            <LLMAgentForm disabled={isLoading} isWizardMode={isWizardMode} />
          </TabsContent>

          <TabsContent value="ferramentas" forceMount>
            <AgentToolsTab agentId={id} isWizardMode={isWizardMode} />
          </TabsContent>

          <TabsContent value="avancado" forceMount>
            <AdvancedAgentForm />
          </TabsContent>

          <TabsContent value="memoria" forceMount>
            <AgentMemoryTab />
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <div>
            {isWizardMode && (
              <Button
                variant="outline"
                onClick={handlePreviousStep}
                disabled={currentStepIndex === 0 || isLoading}
                className={currentStepIndex === 0 ? 'invisible' : ''}
              >
                Anterior
              </Button>
            )}
          </div>
          <div className="space-x-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            {isWizardMode ? (
              currentStepIndex === WIZARD_STEPS.length - 1 ? (
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Criando...' : 'Criar Agente'}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  disabled={isLoading}
                >
                  Próximo
                </Button>
              )
            ) : (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            )}
          </div>
        </div>
      </BaseAgentForm>
    </div>
  );
}
