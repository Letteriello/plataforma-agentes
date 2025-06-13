/**
 * @file Nó customizado para representar um LlmAgent no canvas do React Flow.
 */

import { Bot } from 'lucide-react';
import React, { memo } from 'react';
import { Handle, NodeProps,Position } from 'reactflow';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';

// Usamos memo para otimizar a performance, evitando re-renderizações desnecessárias.
const LlmAgentNode: React.FC<NodeProps> = memo(({ data, selected }) => {
  return (
    <Card className={`w-64 border-2 ${selected ? 'border-primary' : 'border-border'}`}>
      <CardHeader>
        <CardTitle className="flex items-center text-base">
          <Bot className="mr-2 h-5 w-5" />
          <span>{data.label || 'LlmAgent'}</span>
        </CardTitle>
      </CardHeader>

      {/* Handles são os pontos de conexão para as arestas (edges) */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-primary"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-primary"
      />
    </Card>
  );
});

LlmAgentNode.displayName = 'LlmAgentNode';

export default LlmAgentNode;
