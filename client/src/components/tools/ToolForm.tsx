import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, PlusCircle } from 'lucide-react';
import { Tool, ToolCreateSchema, ToolUpdateSchema } from '@/services/toolService';

const parameterSchema = z.object({
  name: z.string().min(1, 'O nome do parâmetro é obrigatório.'),
  description: z.string().min(1, 'A descrição é obrigatória.'),
  type: z.enum(['string', 'number', 'boolean'], { required_error: 'O tipo é obrigatório.' }),
  required: z.boolean(),
  default_value: z.string().optional(),
});

export const toolFormSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres.'),
  type: z.literal('custom_api'),
  api_endpoint: z.string().url('Deve ser uma URL válida.'),
  api_method: z.enum(['GET', 'POST', 'PUT', 'DELETE'], { required_error: 'O método da API é obrigatório.' }),
  api_headers: z.string().optional().refine((val) => {
    if (!val) return true;
    try {
      JSON.parse(val);
      return true;
    } catch (e) {
      return false;
    }
  }, { message: 'Os cabeçalhos devem ser um objeto JSON válido.' }),
  parameters: z.array(parameterSchema).optional(),
});

export type ToolFormValues = z.infer<typeof toolFormSchema>;

interface ToolFormProps {
  onSubmit: (values: ToolFormValues) => void;
  initialData?: Tool | null;
  isSubmitting: boolean;
}

export const ToolForm: React.FC<ToolFormProps> = ({ onSubmit, initialData, isSubmitting }) => {
  const form = useForm<ToolFormValues>({
    resolver: zodResolver(toolFormSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      description: initialData?.description ?? '',
      type: 'custom_api',
      api_endpoint: initialData?.api_endpoint ?? '',
      api_method: initialData?.api_method ?? 'GET',
      api_headers: initialData?.api_headers ? JSON.stringify(initialData.api_headers, null, 2) : '',
      parameters: initialData?.parameters ?? [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'parameters',
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Ferramenta</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Buscar Clima" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descreva o que esta ferramenta faz." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-medium">Configuração da API</h3>
            <FormField
              control={form.control}
              name="api_endpoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endpoint da API</FormLabel>
                  <FormControl>
                    <Input placeholder="https://api.example.com/data" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="api_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Método HTTP</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um método" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="api_headers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cabeçalhos (JSON)</FormLabel>
                  <FormControl>
                    <Textarea placeholder='{\n  "Authorization": "Bearer YOUR_API_KEY",\n  "Content-Type": "application/json"\n}' {...field} />
                  </FormControl>
                  <FormDescription>Insira um objeto JSON válido para os cabeçalhos da requisição.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        <div className="space-y-4 border-t pt-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Parâmetros da Ferramenta</h3>
                <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', description: '', type: 'string', required: true, default_value: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Parâmetro
                </Button>
            </div>
            {fields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-md relative space-y-4">
                    <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    <FormField
                        control={form.control}
                        name={`parameters.${index}.name`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome do Parâmetro</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={`parameters.${index}.description`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Descrição</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name={`parameters.${index}.type`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="string">Texto</SelectItem>
                                            <SelectItem value="number">Número</SelectItem>
                                            <SelectItem value="boolean">Booleano</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`parameters.${index}.default_value`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Valor Padrão (Opcional)</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name={`parameters.${index}.required`}
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Obrigatório</FormLabel>
                                    <FormDescription>Marque se este parâmetro for obrigatório para a execução da ferramenta.</FormDescription>
                                </div>
                            </FormItem>
                        )}
                    />
                </div>
            ))}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : (initialData ? 'Salvar Alterações' : 'Criar Ferramenta')}
        </Button>
      </form>
    </Form>
  );
};
