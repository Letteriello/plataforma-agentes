import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge'; 
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Bell } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { AgentSelector } from '@/components/debug/AgentSelector'; // Nova importação
import { ContextPanelData } from '@/components/context/types'; // Para o tipo Pick

interface TopbarProps {
  pageTitle?: string;
  agentsForSelector?: Pick<ContextPanelData, 'id' | 'title'>[]; // Nova prop
  selectedAgentIdForSelector?: string | null; // Nova prop
  onSelectAgentForSelector?: (agentId: string | null) => void; // Nova prop
}

export function Topbar({ 
  pageTitle, 
  agentsForSelector, 
  selectedAgentIdForSelector, 
  onSelectAgentForSelector 
}: TopbarProps) {
  const { user } = useAuthStore();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6">
      {/* Left section - Title */}
      <div className="flex items-center">
        <h2 className="text-lg font-medium text-foreground">{pageTitle || 'Dashboard'}</h2>
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
            className="w-auto md:w-[320px] lg:w-[400px]" // Ajustar largura conforme necessário
          />
        </div>
      )}

      {/* Right section - User Actions */}
      <div className="flex items-center gap-x-2 sm:gap-x-4">
        <ThemeToggle />
        <Button variant="outline" size="icon" className="rounded-full shrink-0">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Notifications</span>
        </Button>
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <Avatar className="h-8 w-8 shrink-0">
            <img 
              src={`https://api.dicebear.com/7.x/personas/svg?seed=${user?.name || 'user'}`} 
              alt={user?.name || 'User'} 
            />
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-foreground truncate max-w-[150px]">{user?.name || 'Admin User'}</p>
            <p className="text-xs text-muted-foreground truncate max-w-[150px]">{user?.email || 'admin@example.com'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
