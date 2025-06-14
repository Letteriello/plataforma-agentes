import * as ReactHookForm from 'react-hook-form';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { LlmAgentConfig } from '@/types/agents';

interface IdentityFormProps {
  control: ReactHookForm.Control<LlmAgentConfig>;
}

export function IdentityForm({ control }: IdentityFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Identidade do Agente</CardTitle>
        <CardDescription>
          Defina o nome, a descrição e a identidade visual do seu agente.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="name"
          render={({ field }: { field: any }) => (
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
          control={control}
          name="description"
          render={({ field }: { field: any }) => (
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
  );
}
