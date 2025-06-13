/**
 * @file Nó visual para um Agente de Loop no canvas de orquestração.
 */

import { Repeat, RotateCw } from 'lucide-react';
import React from 'react';
import { Handle, NodeProps,Position } from 'reactflow';

import { Card, CardContent,CardHeader, CardTitle } from '@/components/ui/card';

const LoopAgentNode: React.FC<NodeProps> = ({ data, isConnectable }) => {
  return (
    <Card className="w-64 border-purple-500 border-2 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-purple-500 text-white p-3 rounded-t-lg">
        <CardTitle className="text-sm font-medium">Agente de Loop</CardTitle>
        <Repeat className="h-5 w-5" />
      </CardHeader>
      <CardContent className="p-3" style={{ minHeight: 120 }}>
        <div className="text-center">
          <div className="text-lg font-bold flex items-center justify-center">
            <RotateCw className="h-6 w-6 mr-2 text-purple-500" />
            <span>{data.label || 'Loop'}</span>
          </div>
          {data.iterations && (
            <p className="text-xs text-muted-foreground mt-1">
              ({data.iterations} iterações)
            </p>
          )}
        </div>
      </CardContent>
      <Handle
        type="target"
        position={Position.Top}
        id="a"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-purple-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-purple-500"
      />
    </Card>
  );
};

export default LoopAgentNode;
