// client/src/components/chat/ChatInterface.tsx
import React, { useState } from 'react'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { AgentWorkspace } from './AgentWorkspace'
import type { ComponentType } from 'react'
import { useChatStore } from '@/store/chatStore'
import { MessageList } from './MessageList'
import { ChatInput } from './ChatInput'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatMessage } from './types'
import { ChatHeader } from './ChatHeader'
import { Skeleton } from '@/components/ui/skeleton'

interface ChatInterfaceProps {
  LeftPanelComponent?: ComponentType
  RightPanelComponent?: ComponentType
}

export const ChatInterface = ({
  LeftPanelComponent,
  RightPanelComponent = AgentWorkspace,
}: ChatInterfaceProps) => {
  const { messages, addMessage, selectedConversationId, conversations } =
    useChatStore()

  const [isAgentReplying, setIsAgentReplying] = useState(false)
  // TODO: This should be derived from the selected conversation or global state
  const [
    currentSelectedAgentIdForSelector,
    setCurrentSelectedAgentIdForSelector,
  ] = useState<string | null>(null)

  const handleSendMessage = (text: string) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
      avatarSeed: 'user-seed-456',
    }
    addMessage(newMessage)

    // TODO: Replace with actual API call to the agent
    setIsAgentReplying(true)
    setTimeout(() => {
      const agentReply: ChatMessage = {
        id: `msg-agent-${Date.now()}`,
        text: 'Esta é uma resposta simulada do agente.',
        sender: 'agent',
        timestamp: new Date().toLocaleTimeString(),
        senderName: 'Agente Simulado',
        avatarSeed: 'agent-sim-seed',
      }
      addMessage(agentReply)
      setIsAgentReplying(false)
    }, 1500)
  }

  const handleAgentChangeInSelector = (agentId: string) => {
    setCurrentSelectedAgentIdForSelector(agentId)
    console.log(`Agent selected in header: ${agentId}`)
    // TODO: Implement logic to switch agent context or conversation
  }

  const currentConversation = conversations.find(
    (c) => c.id === selectedConversationId,
  )
  const agentDisplayName =
    currentConversation?.agentName || 'Selecione uma conversa'
  const agentAvatar = agentDisplayName.charAt(0).toUpperCase()
  const agentStatus = selectedConversationId ? 'Online' : 'Offline'

  // TODO: Fetch agents from an API or a dedicated agent store
  const agentsForSelector: { id: string; title: string }[] = []

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="flex-1 rounded-lg border"
    >
      {LeftPanelComponent && (
        <ResizablePanel defaultSize={20} minSize={15}>
          <LeftPanelComponent />
        </ResizablePanel>
      )}
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={55} minSize={30}>
        <div className="flex h-full flex-col">
          <ChatHeader
            agentName={agentDisplayName}
            agentStatus={agentStatus}
            agentAvatarFallback={agentAvatar}
            agents={agentsForSelector}
            selectedAgentId={currentSelectedAgentIdForSelector}
            onSelectAgent={handleAgentChangeInSelector}
          />

          <ScrollArea className="flex-1">
            <MessageList messages={messages} />
            {isAgentReplying && (
              <div className="flex items-end space-x-2 p-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex flex-col space-y-1.5">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[120px]" />
                </div>
              </div>
            )}
          </ScrollArea>

          <div className="border-t">
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isAgentReplying}
            />
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={25} minSize={20}>
        <RightPanelComponent />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default ChatInterface
