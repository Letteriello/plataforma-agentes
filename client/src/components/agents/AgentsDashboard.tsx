import React, { useState, useEffect, useCallback, useRef } from 'react'; // Added React and useRef
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
import { AgentListItem } from './AgentListItem'; // Adjusted path if necessary
import { useVirtualizer } from '@tanstack/react-virtual';

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

// Labels for dashboard filter buttons - AgentListItem has its own encapsulated version
const dashboardAgentTypeLabels: Record<AgentType, string> = {
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

  const parentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: filteredAgents.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // Estimated height of an AgentListItem
    overscan: 5,
  });

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

  const navigateToEdit = useCallback((id: string) => {
    navigate(`/agents/edit/${id}`);
  }, [navigate]);

  const navigateToRun = useCallback((id: string) => {
    navigate(`/agents/run/${id}`);
  }, [navigate]);

  const memoizedHandleDeleteAgent = useCallback(async (agentId: string) => {
    if (!window.confirm('Are you sure you want to delete this agent? This action cannot be undone.')) {
      return;
    }
    try {
      setIsDeleting(prev => ({ ...prev, [agentId]: true }));
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
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
  }, [toast]); // setAgents and setIsDeleting are stable from useState

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (agent.description && agent.description.toLowerCase().includes(searchQuery.toLowerCase())); // Made description check safer
    const matchesFilter = filter === 'all' || agent.type === filter;
    return matchesSearch && matchesFilter;
  });

  // getAgentTypeColor is removed, as it's encapsulated in AgentListItem

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
              {Object.entries(dashboardAgentTypeLabels).map(([type, label]) => (
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
            <div
              ref={parentRef}
              className="space-y-2 overflow-y-auto"
              style={{ maxHeight: '600px' /* Adjust height as needed */ }}
            >
              <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
                {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                  const agent = filteredAgents[virtualItem.index];
                  if (!agent) return null; // Should not happen if count is correct
                  return (
                    <div
                      key={agent.id} // Using agent.id as key
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                    >
                      <AgentListItem
                        agent={agent}
                        onEdit={navigateToEdit}
                        onRun={navigateToRun}
                        onDelete={memoizedHandleDeleteAgent}
                        isDeleting={isDeleting[agent.id] || false}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
