import React, { useEffect, useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import mockToolsData from '../../../data/mock-tools.json'; // Ajuste o caminho se necessário

// Importe aqui os componentes do shadcn/ui que serão usados no futuro
// Ex: import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// Ex: import { Button } from "@/components/ui/button";

interface Tool {
  id: string;
  name: string;
  description: string;
}

interface ToolSelectorProps {
  selectedTools: string[]; // IDs das ferramentas já selecionadas
  onSelectionChange: (selectedIds: string[]) => void; // Função para atualizar as ferramentas selecionadas
  // open: boolean; // Controlará a visibilidade do Dialog
  // onOpenChange: (open: boolean) => void; // Para fechar o Dialog
}

const ToolSelector: React.FC<ToolSelectorProps> = ({
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
    </div>
  );
};

export default ToolSelector;
