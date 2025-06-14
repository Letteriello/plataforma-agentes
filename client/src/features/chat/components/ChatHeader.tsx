import { MoreVertical } from 'lucide-react' // Or another icon for the trigger
import React from 'react'

import { AgentSelector } from '@/features/debug/components/AgentSelector' // Corrected path
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Define types for agent and props for AgentSelector
interface AgentInfo {
  id: string
  title: string
}

interface ChatHeaderProps {
  agentName: string
  agentStatus: string
  agentAvatarFallback: string
  agents: AgentInfo[] // For AgentSelector
  selectedAgentId: string | null
  onSelectAgent: (agentId: string | null) => void
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  agentName,
  agentStatus,
  agentAvatarFallback,
  agents,
  selectedAgentId,
  onSelectAgent,
}) => {
  return (
    <header className="flex items-center justify-between gap-4 border-b px-3 py-2">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback>{agentAvatarFallback}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-lg font-semibold">{agentName}</p>
          {agentName !== 'Nenhum Agente' && ( // Only show status if a real agent is selected
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-green-500 text-green-500 text-xs font-medium"
              >
                {agentStatus}
              </Badge>
            </div>
          )}
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[280px]">
          <DropdownMenuGroup>
            {/* It might be better to pass AgentSelector directly if it fits Dropdown styling,
                or wrap its functionality if more control over items is needed.
                For simplicity, direct usage is shown here. Consider if it needs a DropdownMenuItem wrapper. */}
            <AgentSelector
              agents={agents}
              selectedAgentId={selectedAgentId}
              onSelectAgent={onSelectAgent}
              className="w-full p-2" // Adjust styling as needed for dropdown context
            />
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
