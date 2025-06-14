import 'reactflow/dist/style.css'

import React, { useCallback } from 'react'
import ReactFlow, {
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  Node,
  useEdgesState,
  useNodesState,
} from 'reactflow'

interface OrchestrationCanvasProps {
  initialNodes: Node[]
  initialEdges: Edge[]
}

let id = 0
const getId = () => `dndnode_${id++}`

export const OrchestrationCanvas: React.FC<OrchestrationCanvasProps> = ({
  initialNodes,
  initialEdges,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params: Edge | Connection) =>
      setEdges((eds: Edge[]) => addEdge(params, eds)),
    [setEdges],
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const type = event.dataTransfer.getData('application/reactflow')
      const agentId = event.dataTransfer.getData('agentId')

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return
      }

      const position = {
        x: event.clientX - 250, // a bit of an offset
        y: event.clientY - 50,
      }
      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: { label: `Agent ${agentId}` },
      }

      setNodes((nds: Node[]) => nds.concat(newNode))
    },
    [setNodes],
  )

  return (
    <div className="h-full w-full border rounded-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  )
}
