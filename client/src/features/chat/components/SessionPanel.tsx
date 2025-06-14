import { Plus } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui/button'
import { useChatStore } from '@/store/chatStore'

import { ConversationList } from './ConversationList'

export const SessionPanel: React.FC = () => {
  const { addConversation, setSelectedConversationId } = useChatStore()

  const handleNewSession = () => {
    const id = Date.now().toString()
    // Ensure the agentName matches the expectation or adjust as needed.
    // The issue description for ConversationList implies "Nova Conversa" is acceptable.
    addConversation({ id, agentName: 'Nova Sessão', lastMessage: '' })
    setSelectedConversationId(id)
  }

  return (
    <div className="flex h-full flex-col border-r border-border bg-card">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Sessões</h2>
        <Button variant="outline" size="default" onClick={handleNewSession}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Sessão
        </Button>
      </div>
      <ConversationList />
    </div>
  )
}
