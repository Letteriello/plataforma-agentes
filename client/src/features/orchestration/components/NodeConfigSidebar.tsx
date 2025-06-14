/**
 * @file Barra lateral para configurar as propriedades de um nó selecionado.
 */

import React from 'react';
import { Node } from 'reactflow';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

interface NodeConfigSidebarProps {
  node: Node;
  onNodeDataChange: (nodeId: string, newData: Record<string, unknown>) => void;
}

const NodeConfigSidebar: React.FC<NodeConfigSidebarProps> = ({ node, onNodeDataChange }) => {
  const handleDataChange = (field: string, value: string) => {
    onNodeDataChange(node.id, { ...node.data, [field]: value });
  };

  return (
    <div className="p-4 h-full bg-background border-l overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">Configurar Nó</h3>
      <Separator className="mb-4" />
      <div className="space-y-4">
        <div>
          <Label htmlFor="node-label">Nome (Label)</Label>
          <Input
            id="node-label"
            value={node.data.label || ''}
            onChange={(e) => handleDataChange('label', e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Campos específicos para LLM Agent */}
        {node.type === 'llmAgent' && (
          <>
            <div>
              <Label htmlFor="node-model">Modelo</Label>
              <Input
                id="node-model"
                placeholder="ex: gemini-pro"
                value={node.data.model || ''}
                onChange={(e) => handleDataChange('model', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="node-instruction">Instruções</Label>
              <Textarea
                id="node-instruction"
                placeholder="Você é um assistente prestativo..."
                value={node.data.instruction || ''}
                onChange={(e) => handleDataChange('instruction', e.target.value)}
                className="mt-1 min-h-[150px]"
              />
            </div>
          </>
        )}

        {/* Campos específicos para Loop Agent */}
        {node.type === 'loopAgent' && (
          <>
            <div>
              <Label htmlFor="node-iterations">Iterações</Label>
              <Input
                id="node-iterations"
                type="number"
                placeholder="ex: 5"
                value={node.data.iterations || ''}
                onChange={(e) => handleDataChange('iterations', e.target.value)}
                className="mt-1"
              />
            </div>
          </>
        )}
        <Separator />
        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>ID do Nó:</strong> {node.id}</p>
          <p><strong>Tipo:</strong> {node.type}</p>
        </div>
      </div>
    </div>
  );
};

export default NodeConfigSidebar;
