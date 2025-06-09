import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { KnowledgeBaseType } from '@/types/memory';

interface CreateKnowledgeBaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { 
    name: string; 
    description: string; 
    type: KnowledgeBaseType;
    baseModel?: string;
  }) => void;
}

export function CreateKnowledgeBaseDialog({ 
  open, 
  onOpenChange, 
  onSubmit 
}: CreateKnowledgeBaseDialogProps) {
  // Estado do formulário
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<KnowledgeBaseType>(KnowledgeBaseType.RAG);
  const [baseModel, setBaseModel] = useState('Gemini Pro');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Opções de modelos para fine-tuning
  const modelOptions = [
    'Gemini Pro',
    'Claude 3 Haiku',
    'Claude 3 Sonnet',
    'GPT-3.5 Turbo',
    'GPT-4o',
    'Llama 3'
  ];

  // Resetar o formulário quando o diálogo é fechado
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setName('');
      setDescription('');
      setType(KnowledgeBaseType.RAG);
      setBaseModel('Gemini Pro');
      setIsSubmitting(false);
    }
    onOpenChange(open);
  };

  // Enviar o formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    onSubmit({
      name,
      description,
      type,
      baseModel: type === KnowledgeBaseType.FINE_TUNING ? baseModel : undefined
    });
    
    // Nota: O diálogo será fechado pelo componente pai após a conclusão da operação
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Criar Base de Conhecimento</DialogTitle>
            <DialogDescription>
              Crie uma nova base de conhecimento para armazenar e processar documentos.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descrição
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Tipo
              </Label>
              <Select
                value={type}
                onValueChange={(value) => setType(value as KnowledgeBaseType)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={KnowledgeBaseType.RAG}>RAG (Retrieval Augmented Generation)</SelectItem>
                  <SelectItem value={KnowledgeBaseType.FINE_TUNING}>Fine-Tuning</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {type === KnowledgeBaseType.FINE_TUNING && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="baseModel" className="text-right">
                  Modelo Base
                </Label>
                <Select
                  value={baseModel}
                  onValueChange={setBaseModel}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione o modelo base" />
                  </SelectTrigger>
                  <SelectContent>
                    {modelOptions.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || !name}>
              {isSubmitting ? 'Criando...' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}