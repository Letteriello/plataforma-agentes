import React, { useEffect, useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import mockToolsData from '../../../data/mock-tools.json'; // Ajuste o caminho se necessário

// Importe aqui os componentes do shadcn/ui que serão usados no futuro
// Ex: import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// Ex: import { Button } from "@/components/ui/button";
import React from 'react';
// Importe aqui os componentes do shadcn/ui que serão usados no futuro
// Ex: import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// Ex: import { Button } from "@/components/ui/button";
// Ex: import { Checkbox } from "@/components/ui/checkbox";
// Ex: import { Label } from "@/components/ui/label";

interface Tool {
  id: string;
  name: string;
  description: string;
}

interface ToolSelectorProps {
  availableTools: Tool[]; // Ferramentas que podem ser selecionadas
  selectedTools: string[]; // IDs das ferramentas já selecionadas
  onSelectionChange: (selectedIds: string[]) => void; // Função para atualizar as ferramentas selecionadas
  // open: boolean; // Controlará a visibilidade do Dialog
  // onOpenChange: (open: boolean) => void; // Para fechar o Dialog
}

const ToolSelector: React.FC<ToolSelectorProps> = ({
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
    <div className="grid gap-4 py-4">
      {loadedTools.map((tool) => (
        <div key={tool.id} className="flex items-center space-x-3">
          <Checkbox
            id={tool.id}
            checked={selectedTools.includes(tool.id)}
            onCheckedChange={(checked) => {
              const newSelectedIds = typeof checked === 'boolean' && checked
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
  // Por enquanto, um placeholder simples. O conteúdo do Dialog será implementado nas próximas tarefas.
  return (
    <div>
      <h4>Tool Selector Placeholder</h4>
      <p>Lista de ferramentas e checkboxes aparecerão aqui.</p>
      {/*
        Futuramente, este será o conteúdo de um <DialogContent>
        <DialogHeader>
          <DialogTitle>Selecionar Ferramentas</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {availableTools.map((tool) => (
            <div key={tool.id} className="flex items-center space-x-2">
              <Checkbox
                id={tool.id}
                checked={selectedTools.includes(tool.id)}
                onCheckedChange={(checked) => {
                  const newSelected = checked
                    ? [...selectedTools, tool.id]
                    : selectedTools.filter((id) => id !== tool.id);
                  onSelectionChange(newSelected);
                }}
              />
              <Label htmlFor={tool.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {tool.name}
              </Label>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Confirmar</Button>
        </DialogFooter>
      */}
    </div>
  );
};

export default ToolSelector;
