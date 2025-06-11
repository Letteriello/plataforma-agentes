// client/src/components/chat/ConversationList.tsx
import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useChatStore } from '@/store/chatStore'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical, Plus } from 'lucide-react'

const ConversationList: React.FC = () => {
  const {
    conversations,
    selectedConversationId,
    setSelectedConversationId,
    addConversation,
    renameConversation,
    deleteConversation,
  } = useChatStore()

  // handleNewConversation is now in SessionPanel.tsx
  // This function is kept if the "Nova Conversa" button in the empty state is to remain functional here.
  const handleNewConversationForEmptyState = () => {
    const id = Date.now().toString()
    addConversation({ id, agentName: 'Nova Conversa', lastMessage: '' })
    setSelectedConversationId(id)
  }

  const handleRename = (id: string) => {
    const newName = prompt('Novo nome da conversa')
    if (newName) renameConversation(id, newName)
  }

  const handleDelete = (id: string) => {
    if (confirm('Excluir esta conversa?')) deleteConversation(id)
  }

  return (
    // The outer div and header are removed, SessionPanel will provide them.
    // The ScrollArea now directly returns, assuming SessionPanel handles padding if needed for the list itself.
    <ScrollArea className="flex-1 p-1">
      {conversations.map((convo) => (
        <div
          key={convo.id}
          className={cn(
            'flex items-center space-x-3 mb-[2px] cursor-pointer rounded-md px-2 py-1.5 hover:bg-muted/50',
            { 'bg-accent': convo.id === selectedConversationId }, // Updated to bg-accent
          )}
          onClick={() => setSelectedConversationId(convo.id)} // Use setSelectedConversationId from store
        >
          <Avatar className="h-10 w-10">
            <AvatarFallback>
              {convo.agentName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium text-foreground text-sm truncate">
              {convo.agentName}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {convo.lastMessage || 'Nenhuma mensagem'}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Ações"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right">
              <DropdownMenuItem onSelect={() => handleRename(convo.id)}>
                Renomear
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleDelete(convo.id)}>
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
      {conversations.length === 0 && (
        <div className="flex flex-col items-center gap-2 p-3 text-sm text-muted-foreground">
          <p>Inicie uma nova conversa para testar seu agente</p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNewConversationForEmptyState}
          >
            <Plus className="mr-2 h-4 w-4" /> Nova Conversa
          </Button>
        </div>
      )}
    </ScrollArea>
  )
}

export { ConversationList }
