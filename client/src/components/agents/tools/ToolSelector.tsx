import React, { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import mockToolsData from '../../../data/mock-tools.json';
import { Tool } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ToolSelectorProps {
  availableTools: Tool[]; // Ferramentas que podem ser selecionadas
  selectedTools: string[]; // IDs das ferramentas já selecionadas
  onSelectionChange: (selectedIds: string[]) => void; // Função para atualizar as ferramentas selecionadas
  // open: boolean; // Controlará a visibilidade do Dialog
  // onOpenChange: (open: boolean) => void; // Para fechar o Dialog
}

export const ToolSelector: React.FC<ToolSelectorProps> = ({
  availableTools,
  selectedTools,
  onSelectionChange,
  // open,
  // onOpenChange
}) => {
  const [loadedTools, setLoadedTools] = useState<Tool[]>([]);

  useEffect(() => {
    // Simula o carregamento, em um cenário real seria uma chamada API
    setLoadedTools(mockToolsData);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ferramentas Disponíveis</CardTitle>
        <CardDescription>Selecione as ferramentas que este agente pode utilizar</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 py-2">
          {loadedTools.map((tool) => (
            <div key={tool.id} className="flex items-center space-x-3 p-2 hover:bg-accent/50 rounded-md">
              <Checkbox
                id={tool.id}
                checked={selectedTools.includes(tool.id)}
                onChange={e => {
                  const checked = e.target.checked;
                  const newSelectedIds = checked
                    ? [...selectedTools, tool.id]
                    : selectedTools.filter((id) => id !== tool.id);
                  onSelectionChange(newSelectedIds);
                }}
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor={tool.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {tool.name}
                </Label>
                {tool.description && (
                  <p className="text-xs text-muted-foreground">
                    {tool.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};


