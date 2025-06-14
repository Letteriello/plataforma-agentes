/**
 * @file Página para criar e visualizar workflows de orquestração de agentes.
 */

/**
 * @file Página para criar e visualizar workflows de orquestração de agentes.
 */

import 'reactflow/dist/style.css';

import React, { useCallback,useState } from 'react';
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  ReactFlowProvider,
} from 'reactflow';

import NodeConfigSidebar from '@/components/orchestration/NodeConfigSidebar';
import OrchestrationSidebar from '@/components/orchestration/OrchestrationSidebar';
import WorkflowCanvas from '@/components/orchestration/WorkflowCanvas';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { executeWorkflow,saveWorkflow } from '@/services/workflowService';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'llmAgent',
    position: { x: 250, y: 5 },
    data: { label: 'Agente de Vendas', model: 'gemini-pro', instruction: 'Seja um vendedor amigável.' },
  },
];

const initialEdges: Edge[] = [];

const OrchestrationPage: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const { toast } = useToast();
  const [savedWorkflow, setSavedWorkflow] = useState<any | null>(null);
  const [executionResult, setExecutionResult] = useState<any | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [execLoading, setExecLoading] = useState(false);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const selectionChange = changes.find((change) => change.type === 'select');
      if (selectionChange && selectionChange.type === 'select') {
        if (selectionChange.selected) {
          const node = nodes.find((n) => n.id === selectionChange.id);
          setSelectedNode(node || null);
        } else {
          if (selectedNode && selectedNode.id === selectionChange.id) {
            setSelectedNode(null);
          }
        }
      }

      const removeChange = changes.find((change) => change.type === 'remove');
      if (removeChange && removeChange.type === 'remove') {
        if (selectedNode && selectedNode.id === removeChange.id) {
          setSelectedNode(null);
        }
      }

      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [nodes, selectedNode]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) => addEdge({ ...connection, type: 'custom', animated: true }, eds)),
    [setEdges]
  );

  const handleNodeDataChange = useCallback(
    (nodeId: string, newData: any) => {
      setNodes((nds) =>
        nds.map((node) => (node.id === nodeId ? { ...node, data: newData } : node))
      );
      if (selectedNode && selectedNode.id === nodeId) {
        setSelectedNode((prev) => (prev ? { ...prev, data: newData } : null));
      }
    },
    [selectedNode]
  );

  const onNodeDragStop = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (!node.positionAbsolute) return;

      // Encontra o nó pai potencial (deve ser um container e não o próprio nó)
      const parentNode = nodes.find(
        (n) =>
          (n.type === 'sequentialAgent' || n.type === 'parallelAgent' || n.type === 'loopAgent') &&
          node.positionAbsolute &&
          n.positionAbsolute &&
          node.positionAbsolute.x > n.positionAbsolute.x &&
          node.positionAbsolute.y > n.positionAbsolute.y &&
          node.positionAbsolute.x + (node.width || 0) <
            n.positionAbsolute.x + (n.width || 0) &&
          node.positionAbsolute.y + (node.height || 0) <
            n.positionAbsolute.y + (n.height || 0) &&
          n.id !== node.id
      );

      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === node.id) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { parentNode: oldParent, expandParent, extent, ...rest } = n;

            if (parentNode) {
              // Nó foi arrastado para dentro de um pai
              return {
                ...rest,
                parentNode: parentNode.id,
                expandParent: true, // Faz o pai se expandir
                extent: 'parent', // Restringe o movimento ao pai
              };
            }
            // Nó foi arrastado para fora de qualquer pai, remove as propriedades
            return rest;
          }
          return n;
        })
      );
    },
    [nodes]
  );

  const handleSaveWorkflow = async () => {
    const buildWorkflowTree = (parentId: string | undefined = undefined) => {
      const childrenOfParent = nodes.filter((n) => n.parentNode === parentId);
      const parentNode = parentId ? nodes.find((n) => n.id === parentId) : null;

      if (parentNode && parentNode.type === 'sequentialAgent') {
        const edgesInParent = edges.filter(
          (e) =>
            childrenOfParent.some((n) => n.id === e.source) &&
            childrenOfParent.some((n) => n.id === e.target)
        );
        const nodeMap = new Map(childrenOfParent.map((n) => [n.id, n]));
        const sortedChildren = [];

        let currentNode = childrenOfParent.find(
          (n) => !edgesInParent.some((e) => e.target === n.id)
        );

        while (currentNode) {
          sortedChildren.push(currentNode);
          const nextEdge = edgesInParent.find((e) => e.source === currentNode?.id);
          currentNode = nextEdge ? nodeMap.get(nextEdge.target) : undefined;
        }

        childrenOfParent.forEach((node) => {
          if (!sortedChildren.find((n) => n.id === node.id)) {
            sortedChildren.push(node);
          }
        });

        return sortedChildren.map((node) => ({
          id: node.id,
          type: node.type,
          data: node.data,
          children: buildWorkflowTree(node.id),
        }));
      }

      return childrenOfParent.map((node) => ({
        id: node.id,
        type: node.type,
        data: node.data,
        children: buildWorkflowTree(node.id),
      }));
    };

    const workflowTree = buildWorkflowTree();

    try {
      const response = await saveWorkflow(workflowTree);
      setSavedWorkflow(response);
      toast({
        title: 'Sucesso!',
        description: 'Seu workflow foi salvo com sucesso.',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Erro ao Salvar',
        description: 'Não foi possível salvar o workflow. Verifique o console para mais detalhes.',
        variant: 'destructive',
      });
    }
  };

  const handleExecuteWorkflow = async () => {
    if (!savedWorkflow) return;
    setExecLoading(true);
    try {
      const result = await executeWorkflow(savedWorkflow.id, {});
      setExecutionResult(result);
      setShowResult(true);
    } catch (error) {
      toast({
        title: 'Erro na Execução',
        description: 'Não foi possível executar o workflow. Veja o console.',
        variant: 'destructive',
      });
    } finally {
      setExecLoading(false);
    }
  };

  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-screen w-full">
        <header className="flex items-center justify-between p-3 border-b bg-background flex-shrink-0">
          <h2 className="text-xl font-semibold">Editor de Orquestração</h2>
          <div className="space-x-2">
            <Button onClick={handleSaveWorkflow}>Salvar Workflow</Button>
            <Button
              variant="secondary"
              onClick={handleExecuteWorkflow}
              disabled={!savedWorkflow || execLoading}
            >
              {execLoading ? 'Executando...' : 'Executar Workflow'}
            </Button>
          </div>
        </header>
        <div className="flex flex-grow overflow-hidden">
          <div className="w-64 flex-shrink-0">
            <OrchestrationSidebar />
          </div>
          <main className="flex-grow h-full">
            <WorkflowCanvas
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              setNodes={setNodes}
              onNodeDragStop={onNodeDragStop}
            />
          </main>
          {selectedNode && (
            <div className="w-96 flex-shrink-0">
              <NodeConfigSidebar
                key={selectedNode.id}
                node={selectedNode}
                onNodeDataChange={handleNodeDataChange}
              />
            </div>
          )}
        </div>
      </div>
      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Resultado da Execução</DialogTitle>
            <DialogDescription>
              Saída final do workflow executado.
            </DialogDescription>
          </DialogHeader>
          <pre className="bg-muted p-4 rounded-md overflow-auto text-xs max-h-[60vh]">
            {JSON.stringify(executionResult, null, 2)}
          </pre>
        </DialogContent>
      </Dialog>
    </ReactFlowProvider>
  );
};

export default OrchestrationPage;
