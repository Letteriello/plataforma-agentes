import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusIcon, SearchIcon, Loader2, Trash2, Pencil, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Agent, AgentType } from '@/types/agents';
import { useToast } from '@/components/ui/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Mock data - replace with actual API calls
const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'Customer Support Bot',
    description: 'Handles customer inquiries and support tickets',
    type: 'llm',
    model: 'gemini-1.5-pro',
    temperature: 0.7,
    maxTokens: 1024,
    topP: 1,
    topK: 40,
    stopSequences: [],
    frequencyPenalty: 0,
    presencePenalty: 0,
    instruction: 'You are a helpful customer support assistant. Be polite and professional.',
    systemPrompt: '## Guidelines\n- Always verify customer information\n- Escalate complex issues to a human agent\n- Provide clear next steps',
    version: '1.0.0',
    isPublic: false,
    tags: ['support', 'customer-service'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Document Analysis Workflow',
    description: 'Processes and analyzes documents in a sequential workflow',
    type: 'sequential',
    agents: ['1', '3'],
    maxSteps: 5,
    stopOnError: true,
    version: '1.0.0',
    isPublic: true,
    tags: ['document', 'workflow', 'automation'],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '3',
    name: 'Data Processing Pipeline',
    description: 'Processes data in parallel for better performance',
    type: 'parallel',
    agents: ['1', '4'],
    maxConcurrent: 3,
    timeoutMs: 30000,
    version: '1.0.0',
    isPublic: true,
    tags: ['data', 'pipeline', 'performance'],
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
];

const agentTypeLabels: Record<AgentType, string> = {
  llm: 'LLM',
  sequential: 'Sequential',
  parallel: 'Parallel',
  a2a: 'A2A',
};

type AgentFilter = 'all' | AgentType;

export function AgentsDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<AgentFilter>('all');
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});

  // Load agents on component mount
  useEffect(() => {
    const loadAgents = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setAgents(mockAgents);
      } catch (error) {
        console.error('Failed to load agents:', error);
        toast({
          title: 'Error',
          description: 'Failed to load agents. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAgents();
  }, [toast]);

  const handleDeleteAgent = async (agentId: string) => {
    if (!window.confirm('Are you sure you want to delete this agent? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(prev => ({ ...prev, [agentId]: true }));
      
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAgents(prev => prev.filter(agent => agent.id !== agentId));
      
      toast({
        title: 'Success',
        description: 'Agent deleted successfully',
      });
    } catch (error) {
      console.error('Failed to delete agent:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete agent. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(prev => ({ ...prev, [agentId]: false }));
    }
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || agent.type === filter;
    return matchesSearch && matchesFilter;
  });

  const getAgentTypeColor = (type: AgentType) => {
    const colors = {
      llm: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
      sequential: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
      parallel: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      a2a: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
    };
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agents</h1>
          <p className="text-muted-foreground">
            Manage your AI agents and workflows
          </p>
        </div>
        <Button onClick={() => navigate('/agents/new')}>
          <PlusIcon className="mr-2 h-4 w-4" />
          New Agent
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative w-full md:w-96">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search agents..."
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-1">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              {Object.entries(agentTypeLabels).map(([type, label]) => (
                <Button
                  key={type}
                  variant={filter === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(type as AgentType)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAgents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery 
                  ? 'No agents match your search.'
                  : 'No agents found. Create your first agent to get started.'}
              </p>
              {!searchQuery && (
                <Button 
                  className="mt-4" 
                  onClick={() => navigate('/agents/new')}
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Create Agent
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredAgents.map((agent) => (
                <div 
                  key={agent.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getAgentTypeColor(agent.type)}`}>
                        {agent.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-medium truncate">
                          {agent.name}
                        </h3>
                        <Badge variant="outline" className={getAgentTypeColor(agent.type)}>
                          {agentTypeLabels[agent.type]}
                        </Badge>
                        {!agent.isPublic && (
                          <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                            Private
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {agent.description || 'No description provided'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => navigate(`/agents/run/${agent.id}`)}
                          >
                            <Play className="h-4 w-4" />
                            <span className="sr-only">Run</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Run agent</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => navigate(`/agents/edit/${agent.id}`)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit agent</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:text-destructive/90"
                            onClick={() => handleDeleteAgent(agent.id)}
                            disabled={isDeleting[agent.id]}
                          >
                            {isDeleting[agent.id] ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete agent</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
