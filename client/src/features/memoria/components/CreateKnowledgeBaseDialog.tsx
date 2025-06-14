import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { KnowledgeBaseType } from '@/features/memoria/services/memoryService'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { FormDialog } from '@/components/ui/FormDialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

// Zod schema for validation
const formSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.').max(50, 'O nome não pode exceder 50 caracteres.'),
  description: z.string().max(250, 'A descrição não pode exceder 250 caracteres.').optional(),
  type: z.nativeEnum(KnowledgeBaseType),
  baseModel: z.string().optional(),
}).refine(data => {
  if (data.type === KnowledgeBaseType.FINE_TUNING) {
    return !!data.baseModel;
  }
  return true;
}, {
  message: 'O modelo base é obrigatório para o tipo Fine-Tuning.',
  path: ['baseModel'],
});

type FormData = z.infer<typeof formSchema>;

interface CreateKnowledgeBaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormData) => void;
  isSubmitting: boolean;
}

const modelOptions = [
  'Gemini Pro',
  'Claude 3 Haiku',
  'Claude 3 Sonnet',
  'GPT-3.5 Turbo',
  'GPT-4o',
  'Llama 3',
];

export function CreateKnowledgeBaseDialog({ open, onOpenChange, onSubmit, isSubmitting }: CreateKnowledgeBaseDialogProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      type: KnowledgeBaseType.RAG,
      baseModel: 'Gemini Pro',
    },
  });

  const watchedType = form.watch('type');

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  return (
    <FormDialog
      isOpen={open}
      onOpenChange={onOpenChange}
      title="Criar Base de Conhecimento"
      description="Crie uma nova base de conhecimento para armazenar e processar documentos."
      isSubmitting={isSubmitting}
      submitButtonText="Criar"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Form {...form}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Documentação de Vendas" {...field} />
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
                  <Textarea placeholder="Descreva o propósito desta base de conhecimento." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={KnowledgeBaseType.RAG}>RAG (Retrieval Augmented Generation)</SelectItem>
                    <SelectItem value={KnowledgeBaseType.FINE_TUNING}>Fine-Tuning</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {watchedType === KnowledgeBaseType.FINE_TUNING && (
            <FormField
              control={form.control}
              name="baseModel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo Base</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o modelo base" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {modelOptions.map((model) => (
                        <SelectItem key={model} value={model}>{model}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      </Form>
    </FormDialog>
  );
}
