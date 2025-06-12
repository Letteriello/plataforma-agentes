import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFormContext } from 'react-hook-form';

// Helper to validate JSON
const isJSON = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export function AdvancedAgentForm() {
  const { control } = useFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações Avançadas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="autonomy_level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nível de Autonomia</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o nível de autonomia" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="auto">Automático</SelectItem>
                  <SelectItem value="ask">Perguntar Sempre</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                'Automático' permite que o agente execute ações sem confirmação. 'Perguntar Sempre' exige aprovação para cada ação.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="planner_config"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Configuração do Planejador (JSON)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={5}
                  placeholder='{\"type\": \"react\", \"max_iterations\": 5}'
                  value={field.value ? JSON.stringify(field.value, null, 2) : ''}
                  onChange={(e) => {
                    field.onChange(isJSON(e.target.value) ? JSON.parse(e.target.value) : e.target.value);
                  }}
                />
              </FormControl>
              <FormDescription>
                Defina a configuração para o planejador do agente.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="security_config"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Configuração de Segurança (JSON)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={5}
                  placeholder='{\"allow_code_execution\": true, \"allowed_domains\": [\"example.com\"]}'
                  value={field.value ? JSON.stringify(field.value, null, 2) : ''}
                  onChange={(e) => {
                    field.onChange(isJSON(e.target.value) ? JSON.parse(e.target.value) : e.target.value);
                  }}
                />
              </FormControl>
              <FormDescription>
                Defina as políticas de segurança para a execução do agente.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="code_executor_config"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Configuração do Executor de Código (JSON)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={5}
                  placeholder='{\"timeout\": 300, \"sandboxed\": true}'
                  value={field.value ? JSON.stringify(field.value, null, 2) : ''}
                  onChange={(e) => {
                    field.onChange(isJSON(e.target.value) ? JSON.parse(e.target.value) : e.target.value);
                  }}
                />
              </FormControl>
              <FormDescription>
                Defina a configuração para o ambiente de execução de código.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
