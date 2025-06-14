/**
 * @file Nó visual para um Agente Paralelo no canvas de orquestração.
 */

import { GitMerge, Share2 } from 'lucide-react';
import React from 'react';
import { Handle, NodeProps,Position } from 'reactflow';

import { Card, CardContent,CardHeader, CardTitle } from '@/components/ui/card';

const ParallelAgentNode: React.FC<NodeProps> = ({ data, isConnectable }) => {
  return (
    <Card className="w-64 border-orange-500 border-2 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-orange-500 text-white p-3 rounded-t-lg">
        <CardTitle className="text-sm font-medium">Agente Paralelo</CardTitle>
        <GitMerge className="h-5 w-5" />
      </CardHeader>
      <CardContent className="p-3" style={{ minHeight: 120 }}>
        <div className="text-center text-lg font-bold flex items-center justify-center">
          <Share2 className="h-6 w-6 mr-2 text-orange-500" />
          <span>{data.label || 'Paralelo'}</span>
        </div>
      </CardContent>
      <Handle
        type="target"
        position={Position.Top}
        id="a"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-orange-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-orange-500"
      />
    </Card>
  );
};

export default ParallelAgentNode;
