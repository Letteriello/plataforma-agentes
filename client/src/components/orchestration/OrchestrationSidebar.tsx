/**
 * @file Sidebar com ferramentas para construir o workflow de orquestração.
 */

import React from 'react';
import { Bot, GitBranch, GitMerge, Repeat } from 'lucide-react';

const agentTypes = [
  {
    type: 'llmAgent',
    label: 'Agente LLM',
    icon: <Bot className="mr-2 h-5 w-5 text-green-500" />,
    description: 'Executa tarefas com base em um LLM.',
  },
  {
    type: 'sequentialAgent',
    label: 'Agente Sequencial',
    icon: <GitBranch className="mr-2 h-5 w-5 text-blue-500" />,
    description: 'Executa agentes em uma ordem definida.',
  },
  {
    type: 'parallelAgent',
    label: 'Agente Paralelo',
    icon: <GitMerge className="mr-2 h-5 w-5 text-orange-500" />,
    description: 'Executa agentes simultaneamente.',
  },
  {
    type: 'loopAgent',
    label: 'Agente de Loop',
    icon: <Repeat className="mr-2 h-5 w-5 text-purple-500" />,
    description: 'Executa um agente ou grupo repetidamente.',
  },
];

const OrchestrationSidebar: React.FC = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="p-4 border-r h-full bg-background w-80">
      <h3 className="text-xl font-semibold mb-4">Tipos de Agente</h3>
      <div className="space-y-3">
        {agentTypes.map((agent) => (
          <div
            key={agent.type}
            className="p-3 border rounded-lg cursor-grab flex flex-col hover:bg-accent hover:shadow-md transition-shadow duration-200"
            onDragStart={(event) => onDragStart(event, agent.type)}
            draggable
          >
            <div className="flex items-center font-semibold">
              {agent.icon}
              <span>{agent.label}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 ml-7">
              {agent.description}
            </p>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default OrchestrationSidebar;
