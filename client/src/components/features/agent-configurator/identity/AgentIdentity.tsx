/**
 * @file AgentIdentity.tsx
 * @description Componente para configurar a identidade básica de um agente (nome, descrição, modelo).
 */
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EditDescriptionDialog } from './EditDescriptionDialog';
import { LlmAgentConfig } from '@/types/agent';

interface AgentIdentityProps {
  config: LlmAgentConfig;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: keyof LlmAgentConfig, value: string) => void;
  onDescriptionSave: (newDescription: string) => void;
}

export const AgentIdentity: React.FC<AgentIdentityProps> = ({
  config,
  onInputChange,
  onSelectChange,
  onDescriptionSave,
}) => {
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Identidade do Agente</CardTitle>
          <CardDescription>Informações básicas para identificar e descrever seu agente.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Agente (Obrigatório)</Label>
            <Input
              id="name"
              name="name"
              value={config.name}
              onChange={onInputChange}
              placeholder="Ex: meu_agente_financeiro"
            />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <Label htmlFor="descriptionDisplay">Descrição do Agente</Label>
              <Button variant="outline" size="sm" onClick={() => setIsDescriptionDialogOpen(true)}>
                Editar Descrição
              </Button>
            </div>
            <Textarea
              id="descriptionDisplay"
              value={config.description}
              readOnly
              placeholder="Ex: Um agente para ajudar com cotações de ações."
              rows={3}
              className="mt-1 resize-none bg-muted cursor-pointer"
              onClick={() => setIsDescriptionDialogOpen(true)}
            />
          </div>
          <div>
            <Label htmlFor="model">Modelo LLM (Obrigatório)</Label>
            <Select
              name="model"
              value={config.model}
              onValueChange={(value) => onSelectChange('model', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um modelo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                <SelectItem value="gemini-1.0-pro">Gemini 1.0 Pro</SelectItem>
                <SelectItem value="gemini-1.5-pro-latest">Gemini 1.5 Pro (Latest)</SelectItem>
                <SelectItem value="gemini-1.5-flash-latest">Gemini 1.5 Flash (Latest)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <EditDescriptionDialog
        isOpen={isDescriptionDialogOpen}
        onOpenChange={setIsDescriptionDialogOpen}
        initialDescription={config.description || ''}
        onSave={onDescriptionSave}
      />
    </>
  );
};
