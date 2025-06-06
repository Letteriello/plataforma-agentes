import { Button } from '@/components/ui/button';
// Avatar and useAuthStore are no longer needed here as user info is moved to Sidebar
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Bell } from 'lucide-react';
import { AgentSelector } from '@/components/debug/AgentSelector';
import type { ContextPanelData } from '@/components/context/types';

interface TopbarProps {
  pageTitle?: string;
  agentsForSelector?: Pick<ContextPanelData, 'id' | 'title'>[];
  selectedAgentIdForSelector?: string | null;
  onSelectAgentForSelector?: (agentId: string | null) => void;
}

export function Topbar({ 
  pageTitle, 
  agentsForSelector, 
  selectedAgentIdForSelector, 
  onSelectAgentForSelector 
}: TopbarProps) {
  // const { user } = useAuthStore(); // No longer needed in Topbar

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6">
      {/* Left section - Title */}
      <div className="flex items-center">
        <h2 className="text-lg font-medium text-foreground">{pageTitle || 'Painel'}</h2> {/* Translated default title */}
        <Badge variant="info" size="sm" className="ml-3">
          Beta
        </Badge>
      </div>

      {/* Central section - Agent Selector (if props are provided) */}
      {agentsForSelector && selectedAgentIdForSelector !== undefined && onSelectAgentForSelector && (
        <div className="flex-1 flex justify-center px-4">
          <AgentSelector
            agents={agentsForSelector}
            selectedAgentId={selectedAgentIdForSelector}
            onSelectAgent={onSelectAgentForSelector}
            className="w-auto md:w-[320px] lg:w-[400px]"
          />
        </div>
      )}

      {/* Right section - User Actions */}
      <div className="flex items-center gap-x-2 sm:gap-x-4">
        <ThemeToggle />
        <Button variant="outline" size="icon" className="rounded-full shrink-0">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Notificações</span> {/* Translated sr-only text */}
        </Button>
        {/* User component removed from here */}
      </div>
    </header>
  );
}
