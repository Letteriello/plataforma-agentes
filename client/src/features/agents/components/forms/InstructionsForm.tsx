import * as ReactHookForm from 'react-hook-form';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import type { LlmAgentConfig } from '@/types/agents';

interface InstructionsFormProps {
  control: ReactHookForm.Control<LlmAgentConfig>;
}

export function InstructionsForm({ control }: InstructionsFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Instruções do Agente</CardTitle>
        <CardDescription>
          Defina as instruções, o prompt e o comportamento do seu agente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={control}
          name="system_prompt"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Prompt do Sistema</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Você é um assistente prestativo..."
                  rows={10}
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
