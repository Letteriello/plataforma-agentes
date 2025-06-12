import React, { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { getToolById, createTool, updateTool, Tool, ToolCreateSchema, ToolUpdateSchema } from '@/services/toolService';
import { LoadingSpinner } from '@/components/ui';
import { Trash2 } from 'lucide-react';

const parameterSchema = z.object({
  name: z.string().min(1, 'O nome do parâmetro é obrigatório.'),
  description: z.string().min(1, 'A descrição é obrigatória.'),
  type: z.enum(['string', 'number', 'boolean'], { required_error: 'O tipo é obrigatório' }),
  required: z.boolean(),
  default_value: z.any().optional(),
});

const formSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres.'),
  // Hardcoding to custom_api as it's the only user-creatable type for now
  type: z.literal('custom_api'), 
  api_endpoint: z.string().url('Por favor, insira uma URL válida.'),
  api_method: z.enum(['GET', 'POST', 'PUT', 'DELETE']), 
  parameters: z.array(parameterSchema).optional(),
});

type ToolFormValues = z.infer<typeof formSchema>;

const ToolEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = Boolean(id);

  const form = useForm<ToolFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      type: 'custom_api',
      api_endpoint: '',
      api_method: 'GET',
      parameters: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'parameters',
  });

  const fetchTool = useCallback(async (toolId: string) => {
    try {
      const tool = await getToolById(toolId);
      // Map Tool to ToolFormValues
      form.reset({
        name: tool.name,
        description: tool.description,
        type: 'custom_api', // Assuming we only edit custom_api tools
        api_endpoint: tool.api_endpoint || '',
        api_method: tool.api_method || 'GET',
        parameters: tool.parameters.map(p => ({ ...p, default_value: p.default_value ?? '' })),
      });
    } catch (error) {
      toast({ title: 'Erro ao buscar ferramenta', description: 'Não foi possível carregar os dados da ferramenta.', variant: 'destructive' });
      navigate('/tools');
    }
  }, [form, navigate, toast]);

  useEffect(() => {
    if (isEditMode && id) {
      fetchTool(id);
    }
  }, [isEditMode, id, fetchTool]);

  const onSubmit = async (data: ToolFormValues) => {
    try {
      const payload: ToolCreateSchema | ToolUpdateSchema = {
        ...data,
        // Ensure parameters are correctly formatted (e.g., remove empty default_values)
        parameters: data.parameters?.map(p => {
            const { ...param } = p;
            if (param.default_value === '' || param.default_value === null) {
                delete param.default_value;
            }
            return param;
        }) || []
      };

      let response: Tool;
      if (isEditMode && id) {
        response = await updateTool(id, payload as ToolUpdateSchema);
        toast({ title: 'Sucesso!', description: `Ferramenta "${response.name}" atualizada.` });
      } else {
        response = await createTool(payload as ToolCreateSchema);
        toast({ title: 'Sucesso!', description: `Ferramenta "${response.name}" criada.` });
      }
      navigate('/tools');
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || 'Ocorreu um erro inesperado.';
      toast({ title: 'Falha na operação', description: errorMsg, variant: 'destructive' });
    }
  };

  if (isEditMode && form.formState.isLoading) {
    return <LoadingSpinner />; 
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Editar Ferramenta' : 'Criar Nova Ferramenta'}</CardTitle>
          <CardDescription>
            {isEditMode ? 'Atualize os detalhes da sua ferramenta customizada.' : 'Defina uma nova ferramenta para ser usada por seus agentes.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Ferramenta</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Ferramenta de Cotação de Ações" {...field} />
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
                      <Textarea placeholder="Descreva o que esta ferramenta faz..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="api_endpoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endpoint da API</FormLabel>
                    <FormControl>
                      <Input placeholder="https://sua-api.com/endpoint" {...field} />
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
                          <SelectValue placeholder="Selecione o método" />
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

              <div>
                <h3 className="text-lg font-medium mb-4">Parâmetros</h3>
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 border p-4 rounded-md mb-4 relative">
                     <FormField
                        control={form.control}
                        name={`parameters.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="col-span-1">
                            <FormLabel>Nome</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                     <FormField
                        control={form.control}
                        name={`parameters.${index}.description`}
                        render={({ field }) => (
                          <FormItem className="col-span-1">
                            <FormLabel>Descrição</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    <FormField
                      control={form.control}
                      name={`parameters.${index}.type`}
                      render={({ field }) => (
                        <FormItem className="col-span-1">
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
                    <div className="col-span-1 flex items-end space-x-2">
                       <FormField
                          control={form.control}
                          name={`parameters.${index}.required`}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm h-10">
                               <FormLabel>Obrigatório?</FormLabel>
                               <FormControl><Controller name={`parameters.${index}.required`} control={form.control} render={({field: props}) => <input type="checkbox" className="form-checkbox h-5 w-5" checked={props.value} onChange={(e) => props.onChange(e.target.checked)} />} /></FormControl>
                            </FormItem>
                          )}
                        />
                      <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({ name: '', description: '', type: 'string', required: true, default_value: '' })}
                >
                  Adicionar Parâmetro
                </Button>
              </div>

              <div className="flex justify-end space-x-2">
                 <Button type="button" variant="ghost" onClick={() => navigate('/tools')}>Cancelar</Button>
                 <Button type="submit" disabled={form.formState.isSubmitting}>
                   {form.formState.isSubmitting ? <LoadingSpinner /> : (isEditMode ? 'Salvar Alterações' : 'Criar Ferramenta')}
                 </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ToolEditorPage;
