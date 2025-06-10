import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Bell, PlusCircle } from 'lucide-react'; // Added PlusCircle
import type { ContextPanelData } from '@/components/context/types';
import { CreateAgentDialog } from '@/components/agents/CreateAgentDialog'; // Added CreateAgentDialog

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
        <h2 className="text-lg font-medium text-foreground">{pageTitle || 'Painel'}</h2>
        <Badge variant="info" size="sm" className="ml-3">
          Beta
        </Badge>
      </div>

      {/* Right section - User Actions */}
      <div className="flex items-center gap-x-2 sm:gap-x-4">
        {/* NEW "Criar Agente" Button */}
        <CreateAgentDialog>
          <Button size="sm" className="gap-1">
            <PlusCircle className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Criar Agente
            </span>
          </Button>
        </CreateAgentDialog>

        {/* Existing ThemeToggle and Bell Button */}
        <ThemeToggle />
        <Button variant="outline" size="icon" className="rounded-full shrink-0">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Notificações</span>
        </Button>
      </div>
    </header>
  );
}
