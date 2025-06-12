import React, { useEffect } from 'react';
import { useForm, useFieldArray, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Checkbox } from '../../ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { PlusCircle, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import type { UiSchemaDefinition, UiToolDefinition } from '../../../types/agents';

// Internal form structure for a single parameter
interface ParameterData {
  id: string; // For useFieldArray key
  paramName: string;
  paramDescription: string;
  paramType: UiSchemaDefinition['type'];
  paramRequired: boolean;
  paramDefaultValue: string; // Stored as string in form for simplicity
  paramEnum: string[]; // Stored as string array in form
}

// Main form data structure
interface ToolDefinitionFormData {
  name: string;
  description: string;
  parameters: ParameterData[];
}

// Zod schema for validation
const parameterSchema = z.object({
  id: z.string(),
  paramName: z.string().min(1, 'Nome do parâmetro é obrigatório.'),
  paramDescription: z.string().optional().default(''),
  paramType: z.enum(['STRING', 'NUMBER', 'BOOLEAN', 'OBJECT', 'ARRAY']),
  paramRequired: z.boolean().optional().default(false),
  paramDefaultValue: z.string().optional().default(''),
  paramEnum: z.array(z.string()).optional().default([]),
});

const toolDefinitionFormSchema = z.object({
  name: z.string().min(1, 'Nome da ferramenta é obrigatório.'),
  description: z.string().optional().default(''),
  parameters: z.array(parameterSchema).optional().default([]),
});

export interface ToolDefinitionFormProps {
  initialData?: Partial<UiToolDefinition>;
  onSave: (data: UiToolDefinition) => void;
  onClose: () => void;
}

export const ToolDefinitionForm: React.FC<ToolDefinitionFormProps> = ({ initialData, onSave, onClose }) => {
  const methods = useForm<ToolDefinitionFormData>({
    resolver: zodResolver(toolDefinitionFormSchema),
    defaultValues: {
      name: '',
      description: '',
      parameters: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'parameters',
  });

  useEffect(() => {
    if (initialData) {
      const transformedParams: ParameterData[] = [];
      if (initialData.parameters) {
        for (const paramNameKey in initialData.parameters) {
          const adkParam = initialData.parameters[paramNameKey];
          if (adkParam) {
            let defaultValueStr = '';
            if (adkParam.default !== undefined && adkParam.default !== null) {
              if (typeof adkParam.default === 'object') {
                defaultValueStr = JSON.stringify(adkParam.default);
              } else {
                defaultValueStr = String(adkParam.default);
              }
            }

            let enumValuesStr: string[] = [];
            if (Array.isArray(adkParam.enum)) {
              enumValuesStr = adkParam.enum.map(val => {
                if (typeof val === 'object') return JSON.stringify(val);
                return String(val);
              });
            }

            transformedParams.push({
              id: uuidv4(),
              paramName: paramNameKey,
              paramDescription: adkParam.description || '',
              paramType: adkParam.type || 'STRING',
              paramRequired: initialData.required?.includes(paramNameKey) || false,
              paramDefaultValue: defaultValueStr,
              paramEnum: enumValuesStr,
            });
          }
        }
      }
      methods.reset({
        name: initialData.name || '',
        description: initialData.description || '',
        parameters: transformedParams,
      });
    } else {
      methods.reset({
        name: '',
        description: '',
        parameters: [],
      });
    }
  }, [initialData, methods]);

  const onSubmit: SubmitHandler<ToolDefinitionFormData> = (formData) => {
    const adkParameters: { [key: string]: AdkSchemaDefinition } = {};
    const requiredParams: string[] = [];

    formData.parameters?.forEach(param => {
      if (param.paramName) {
        let adkDefaultValue: any = param.paramDefaultValue;
        if (param.paramDefaultValue) {
          if (param.paramType === 'NUMBER') adkDefaultValue = parseFloat(param.paramDefaultValue);
          else if (param.paramType === 'BOOLEAN') adkDefaultValue = param.paramDefaultValue.toLowerCase() === 'true';
          else if (param.paramType === 'OBJECT' || param.paramType === 'ARRAY') {
            try { adkDefaultValue = JSON.parse(param.paramDefaultValue); } catch (e) { /* keep as string if parse fails */ }
          }
        }

        let adkEnumValues: any[] | undefined = undefined;
        if (param.paramEnum && param.paramEnum.length > 0) {
          adkEnumValues = param.paramEnum.map(enumStr => {
            if (param.paramType === 'NUMBER') return parseFloat(enumStr);
            if (param.paramType === 'BOOLEAN') return enumStr.toLowerCase() === 'true';
            if (param.paramType === 'OBJECT' || param.paramType === 'ARRAY') {
              try { return JSON.parse(enumStr); } catch (e) { return enumStr; }
            }
            return enumStr;
          });
        }

        adkParameters[param.paramName] = {
          type: param.paramType,
          description: param.paramDescription || undefined,
          ...(param.paramDefaultValue && { default: adkDefaultValue }),
          ...(adkEnumValues && { enum: adkEnumValues }),
        };
        if (param.paramRequired) {
          requiredParams.push(param.paramName);
        }
      }
    });

    const result: AdkToolDefinition = {
      name: formData.name,
      description: formData.description || undefined,
      parameters: Object.keys(adkParameters).length > 0 ? adkParameters : undefined,
      required: requiredParams.length > 0 ? requiredParams : undefined,
    };

    onSave(result);
  };

  return (
    <Card className="mt-6 mb-6 border-primary shadow-lg">
      <CardHeader>
        <CardTitle>Configurar Ferramenta: {methods.watch('name') || initialData?.name || 'Nova Ferramenta'}</CardTitle>
        <CardDescription>
          Defina nome, descrição e parâmetros para esta ferramenta, seguindo as especificações do Google ADK.
          A função 'execute' será definida no backend.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={methods.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Ferramenta</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: get_weather_forecast" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição da Ferramenta</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descreva o que esta ferramenta faz..." {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <h3 className="text-lg font-medium mb-3">Parâmetros da Ferramenta</h3>
              {fields.map((item, index) => (
                <div key={item.id} className="p-4 border rounded-md mb-4 space-y-3 bg-slate-50">
                  <div className="flex justify-between items-center">
                    <h4 className="text-md font-semibold">Parâmetro #{index + 1}</h4>
                    <Button variant="ghost" size="sm" onClick={() => remove(index)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="h-4 w-4 mr-1" /> Remover
                    </Button>
                  </div>
                  <FormField
                    control={methods.control}
                    name={`parameters.${index}.paramName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Parâmetro</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={methods.control}
                    name={`parameters.${index}.paramDescription`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição do Parâmetro</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: A cidade e estado" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={methods.control}
                    name={`parameters.${index}.paramType`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo do Parâmetro</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="STRING">String</SelectItem>
                            <SelectItem value="NUMBER">Number</SelectItem>
                            <SelectItem value="BOOLEAN">Boolean</SelectItem>
                            <SelectItem value="OBJECT">Object (JSON)</SelectItem>
                            <SelectItem value="ARRAY">Array (JSON)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={methods.control}
                    name={`parameters.${index}.paramDefaultValue`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor Padrão (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: San Francisco, CA" {...field} />
                        </FormControl>
                        <FormDescription>
                          Se o tipo for Object ou Array, insira uma string JSON válida.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={methods.control}
                    name={`parameters.${index}.paramEnum`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valores Permitidos (Enum - opcional, separados por vírgula)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: valor1,valor2,valor3"
                            value={Array.isArray(field.value) ? field.value.join(',') : ''}
                            onChange={(e) => field.onChange(e.target.value ? e.target.value.split(',').map(s => s.trim()) : [])}
                          />
                        </FormControl>
                        <FormDescription>
                          Se o tipo for Object ou Array, cada valor deve ser uma string JSON válida.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={methods.control}
                    name={`parameters.${index}.paramRequired`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 shadow-sm bg-white">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Obrigatório?</FormLabel>
                          <FormDescription>
                            Este parâmetro deve ser fornecido?
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => append({ id: uuidv4(), paramName: '', paramDescription: '', paramType: 'STRING', paramRequired: false, paramDefaultValue: '', paramEnum: [] })} className="mt-2">
                <PlusCircle className="h-4 w-4 mr-2" /> Adicionar Parâmetro
              </Button>
              {fields.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum parâmetro definido. Clique em "Adicionar Parâmetro" para começar.
                </p>
              )}
            </div>

            {/* Placeholder for output schema UI */}
            <div className="my-6 p-4 border-dashed border-2 border-gray-300 rounded-md">
              <p className="text-sm text-muted-foreground text-center">
                Em breve: Configuração detalhada do Esquema de Saída (Output Schema).
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                Salvar Definição da Ferramenta
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
