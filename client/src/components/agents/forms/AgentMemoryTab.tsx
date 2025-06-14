import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import type { KnowledgeBaseDTO } from '../../../api/memoryService';
import { memoryService } from '../../../api/memoryService';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/card';
import { Checkbox } from '../../ui/checkbox';
import { ComponentSkeleton } from '../../ui/component-skeleton';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';

const AgentMemoryTab: React.FC = () => {
  const { control, getValues, setValue } = useFormContext();
  const [availableKbs, setAvailableKbs] = useState<KnowledgeBaseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadKnowledgeBases = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const paginatedResult = await memoryService.getKnowledgeBases({}); // Assumindo que a função aceita filtros
        setAvailableKbs(paginatedResult.items); // Assumindo que a resposta é paginada com um array 'items'
      } catch (err) {
        setError('Falha ao carregar as bases de conhecimento.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadKnowledgeBases();
  }, []);

  if (isLoading) {
    return <ComponentSkeleton className="h-48 w-full" />;
  }

  if (error) {
    return <p className="text-destructive">{error}</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Memória de Longo Prazo</CardTitle>
        <CardDescription>
          Conecte bases de conhecimento para fornecer contexto adicional ao seu
          agente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={control}
          name="knowledgeBaseIds"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Bases de Conhecimento Disponíveis</FormLabel>
                <FormDescription>
                  Selecione as bases que o agente poderá consultar.
                </FormDescription>
              </div>
              <div className="space-y-3">
                {availableKbs.length > 0 ? (
                  availableKbs.map((kb) => (
                    <FormField
                      key={kb.id}
                      control={control}
                      name="knowledgeBaseIds"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(kb.id)}
                              onCheckedChange={(checked) => {
                                const currentIds = getValues().knowledgeBaseIds || [];
                                return checked
                                  ? field.onChange([...currentIds, kb.id])
                                  : field.onChange(
                                      currentIds.filter((id: string) => id !== kb.id)
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {kb.name}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Nenhuma base de conhecimento encontrada.
                  </p>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default AgentMemoryTab;
