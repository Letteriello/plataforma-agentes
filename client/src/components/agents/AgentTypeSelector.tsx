import { AgentType } from '@/types/agents';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useAgentForm } from './AgentForm';

const agentTypes = [
  {
    id: AgentType.LLM,
    name: 'LLM Agent',
    description: 'A single LLM agent that can be configured with instructions and tools',
    icon: '🤖',
    badge: 'Most Common',
    badgeVariant: 'default' as const,
  },
  {
    id: AgentType.Sequential,
    name: 'Sequential Workflow',
    description: 'Chain multiple agents together in sequence to create complex workflows',
    icon: '⏩',
    comingSoon: true,
  },
  {
    id: AgentType.Parallel,
    name: 'Parallel Workflow',
    description: 'Run multiple agents in parallel and combine their outputs',
    icon: '🔀',
    comingSoon: true,
  },
  {
    id: AgentType.A2A,
    name: 'A2A (Agent-to-Agent)',
    description: 'Connect to external services and APIs with a dedicated agent',
    icon: '🔌',
    comingSoon: true,
  },
];

interface AgentTypeSelectorProps {
  value?: AgentType;
  onChange?: (type: AgentType) => void;
  className?: string;
  disabled?: boolean;
}

export function AgentTypeSelector({
  value,
  onChange,
  className,
  disabled = false,
}: AgentTypeSelectorProps) {
  const form = useAgentForm?.();
  
  // Use form context if available, otherwise use props
  const selectedType = value || form?.values.type;
  const handleChange = (type: AgentType) => {
    if (disabled) return;
    
    if (form) {
      form.handleTypeChange(type);
    } else if (onChange) {
      onChange(type);
    }
  };

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
      {agentTypes.map((type) => (
        <Card
          key={type.id}
          className={cn(
            'cursor-pointer transition-all border-2',
            selectedType === type.id
              ? 'border-primary ring-2 ring-primary/20'
              : 'hover:border-muted-foreground/30',
            disabled && 'opacity-50 cursor-not-allowed',
            type.comingSoon && 'opacity-60 cursor-not-allowed'
          )}
          onClick={() => !type.comingSoon && !disabled && handleChange(type.id)}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="text-4xl mb-4">{type.icon}</div>
              {type.badge && (
                <span
                  className={cn(
                    'text-xs px-2 py-1 rounded-full',
                    type.badgeVariant === 'default' && 'bg-primary/10 text-primary',
                    type.badgeVariant === 'secondary' && 'bg-secondary text-secondary-foreground',
                    type.badgeVariant === 'outline' && 'border border-border',
                  )}
                >
                  {type.badge}
                </span>
              )}
              {type.comingSoon && (
                <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                  Coming Soon
                </span>
              )}
            </div>
            <h3 className="font-medium mb-1">{type.name}</h3>
            <p className="text-sm text-muted-foreground">{type.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
