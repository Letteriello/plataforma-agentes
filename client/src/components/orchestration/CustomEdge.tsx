/**
 * @file Componente de aresta (edge) customizada com um botão de exclusão.
 */

import React from 'react';
import {
  EdgeProps,
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
  useReactFlow,
} from 'reactflow';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const CustomEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) => {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <Button
            variant="destructive"
            size="icon"
            className="h-6 w-6 rounded-full"
            onClick={onEdgeClick}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;
