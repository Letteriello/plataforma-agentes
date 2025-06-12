import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FormDialog } from '@/components/ui/FormDialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash2 } from 'lucide-react';
import { ToolDTO, CreateToolDTO, UpdateToolDTO, ToolType } from '@/api/toolService';

const parameterSchema = z.object({
  name: z.string().min(1, 'O nome do parâmetro é obrigatório.'),
  type: z.string().min(1, 'O tipo do parâmetro é obrigatório.'),
  description: z.string().optional(),
  is_required: z.boolean().default(false),
});

const toolSchema = z.object({
  name: z.string().min(3, 'O nome da ferramenta deve ter pelo menos 3 caracteres.'),
  description: z.string().optional(),
  tool_type: z.enum(['TOOL_CODE', 'API'], { required_error: 'O tipo da ferramenta é obrigatório.' }),
  api_endpoint: z.string().url('Deve ser uma URL válida.').optional().or(z.literal('')),
  parameters: z.array(parameterSchema).optional(),
  return_type_schema: z.string().optional().refine(val => {
    if (!val) return true;
    try {
      JSON.parse(val);
      return true;
    } catch (e) {
      return false;
    }
  }, { message: 'O schema de retorno deve ser um JSON válido.' }),
}).refine(data => {
  if (data.tool_type === 'API') {
    return !!data.api_endpoint;
  }
  return true;
}, {
  message: 'O endpoint da API é obrigatório para ferramentas do tipo API.',
  path: ['api_endpoint'],
});

type ToolFormData = z.infer<typeof toolSchema>;

interface CreateOrEditToolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateToolDTO | UpdateToolDTO) => void;
  isSubmitting: boolean;
  editingTool: ToolDTO | null;
}

export function CreateOrEditToolDialog({ open, onOpenChange, onSubmit, isSubmitting, editingTool }: CreateOrEditToolDialogProps) {
  const form = useForm<ToolFormData>({
    resolver: zodResolver(toolSchema),
    defaultValues: {
      name: '',
      description: '',
      tool_type: 'TOOL_CODE',
      api_endpoint: '',
      parameters: [],
      return_type_schema: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'parameters',
  });

  const watchedToolType = form.watch('tool_type');

  useEffect(() => {
    const defaultValues = {
      name: '',
      description: '',
      tool_type: 'TOOL_CODE' as ToolType,
      api_endpoint: '',
      parameters: [],
      return_type_schema: '',
    };

    if (editingTool) {
      form.reset({
        name: editingTool.name,
        description: editingTool.description || '',
        tool_type: editingTool.tool_type,
        api_endpoint: editingTool.api_endpoint || '',
        parameters: editingTool.parameters.map(p => ({ ...p, is_required: p.is_required ?? false })) || [],
        return_type_schema: editingTool.return_type_schema ? JSON.stringify(editingTool.return_type_schema, null, 2) : '',
      });
    } else {
      form.reset(defaultValues);
    }
  }, [editingTool, form]);

  const handleFormSubmit = (data: ToolFormData) => {
    const submissionData = {
      ...data,
      return_type_schema: data.return_type_schema ? JSON.parse(data.return_type_schema) : undefined,
      api_endpoint: data.tool_type === 'API' ? data.api_endpoint : undefined,
    };
    onSubmit(submissionData as CreateToolDTO | UpdateToolDTO);
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={editingTool ? 'Editar Ferramenta' : 'Criar Nova Ferramenta'}
      description={editingTool ? 'Atualize os detalhes da sua ferramenta.' : 'Preencha os detalhes da nova ferramenta.'}
      onSubmit={form.handleSubmit(handleFormSubmit)}
      isSubmitting={isSubmitting}
    >
      <Form {...form}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Ferramenta</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: get_weather" {...field} />
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
            name="tool_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Ferramenta</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo da ferramenta" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="TOOL_CODE">Código</SelectItem>
                    <SelectItem value="API">API</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {watchedToolType === 'API' && (
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
          )}

          <div>
            <h3 className="text-lg font-medium mb-2">Parâmetros</h3>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-2 p-4 border rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                    <FormField
                      control={form.control}
                      name={`parameters.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl><Input placeholder="cidade" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`parameters.${index}.type`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo</FormLabel>
                          <FormControl><Input placeholder="string" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`parameters.${index}.description`}
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Descrição do Parâmetro</FormLabel>
                          <FormControl><Input placeholder="A cidade para buscar o clima" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`parameters.${index}.is_required`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 col-span-2">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Obrigatório</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', type: 'string', description: '', is_required: false })}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Parâmetro
            </Button>
          </div>

          <FormField
            control={form.control}
            name="return_type_schema"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Schema de Retorno (JSON)</FormLabel>
                <FormControl>
                  <Textarea placeholder='{
  "type": "object",
  "properties": {
    "temperatura": {
      "type": "number"
    }
  }
}' {...field} rows={6} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>
    </FormDialog>
  );
}
