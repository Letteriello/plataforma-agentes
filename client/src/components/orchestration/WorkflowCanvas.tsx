/**
 * @file Componente do Canvas principal para a visualização e edição de workflows.
 */

import React, { useMemo, useCallback, useRef } from 'react';
import ReactFlow, {
  Controls,
  Background,
  Node,
  Edge,
  Connection,
  EdgeChange,
  NodeChange,
  useReactFlow,
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import LlmAgentNode from './LlmAgentNode';
import SequentialAgentNode from './SequentialAgentNode';
import ParallelAgentNode from './ParallelAgentNode';
import LoopAgentNode from './LoopAgentNode';
import CustomEdge from './CustomEdge';

interface WorkflowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  onNodeDragStop: (event: React.MouseEvent, node: Node) => void;
}

const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  setNodes,
  onNodeDragStop,
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { project } = useReactFlow();
  const nodeTypes = useMemo(
    () => ({
      llmAgent: LlmAgentNode,
      sequentialAgent: SequentialAgentNode,
      parallelAgent: ParallelAgentNode,
      loopAgent: LoopAgentNode,
    }),
    []
  );
  const edgeTypes = useMemo(() => ({ custom: CustomEdge }), []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type || !reactFlowBounds) {
        return;
      }

      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      
      const newNode: Node = {
        id: uuidv4(),
        type,
        position,
        data: { label: `Novo Agente` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [project, setNodes]
  );

  return (
    <div ref={reactFlowWrapper} style={{ height: '100%', width: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        deleteKeyCode={['Backspace', 'Delete']}
        onNodeDragStop={onNodeDragStop}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default WorkflowCanvas;
