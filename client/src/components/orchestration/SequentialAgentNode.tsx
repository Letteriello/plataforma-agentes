/**
 * @file Nó visual para um Agente Sequencial no canvas de orquestração.
 */

import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { GitBranch, ChevronsRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const SequentialAgentNode: React.FC<NodeProps> = ({ data, isConnectable }) => {
  return (
    <Card className="w-64 border-blue-500 border-2 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-blue-500 text-white p-3 rounded-t-lg">
        <CardTitle className="text-sm font-medium">Agente Sequencial</CardTitle>
        <GitBranch className="h-5 w-5" />
      </CardHeader>
      <CardContent className="p-3" style={{ minHeight: 120 }}>
        <div className="text-center text-lg font-bold flex items-center justify-center">
          <ChevronsRight className="h-6 w-6 mr-2 text-blue-500" />
          <span>{data.label || 'Sequência'}</span>
        </div>
      </CardContent>
      <Handle
        type="target"
        position={Position.Top}
        id="a"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500"
      />
    </Card>
  );
};

export default SequentialAgentNode;
