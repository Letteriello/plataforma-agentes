// client/src/components/chat/ChatInterface.tsx
import type { ComponentType } from 'react'
import React, { useEffect,useState } from 'react' // Added useEffect

import chatService from '@/api/chatService';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast'; // Import useToast
import { useChatStore } from '@/store/chatStore'
import { type ChatMessage as ApiChatMessage,ChatMessageSenderType, type ChatSession as ApiChatSession } from '@/types/chatTypes';

import { AgentWorkspace } from './AgentWorkspace'
import { ChatHeader } from './ChatHeader'
import { ChatInput } from './ChatInput'
import { MessageList } from './MessageList'
import { ChatMessage } from './types'

interface ChatInterfaceProps {
  LeftPanelComponent?: ComponentType
  RightPanelComponent?: ComponentType
}

export const ChatInterface = ({
  LeftPanelComponent,
  RightPanelComponent = AgentWorkspace,
}: ChatInterfaceProps) => {
  const {
    messages,
    addMessage,
    selectedConversationId,
    conversations,
    loadConversations,
    loadMessages,
  } = useChatStore();
  const { toast } = useToast();

  // Fetch initial conversations (sessions)
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const sessions: ApiChatSession[] = await chatService.getSessions();
        const storeConversations = sessions.map(s => ({
          id: s.id, // Session ID
          agentId: s.agent_id, // Agent ID
          agentName: s.session_title || `Agent ${s.agent_id.substring(0, 6)}`, // Use session_title or a placeholder
          lastMessage: '', // Placeholder for last message; ideally, API provides this or it's derived
        }));
        loadConversations(storeConversations);
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
        // TODO: Show error toast to user
      }
    };
    fetchSessions();
  }, [loadConversations]);

  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (selectedConversationId) {
      const fetchMessages = async () => {
        try {
          const sessionDetail = await chatService.getSessionDetail(selectedConversationId);
          const formattedMessages = sessionDetail.messages.map((m: ApiChatMessage) => ({
            id: m.id,
            text: m.content,
            sender: m.sender_type.toLowerCase() as 'user' | 'agent' | 'system',
            timestamp: new Date(m.created_at).toLocaleTimeString(),
            avatarSeed: m.sender_type === ChatMessageSenderType.USER ? 'user-seed' : sessionDetail.agent_id, // Use agent_id from sessionDetail
            senderName: m.sender_type === ChatMessageSenderType.AGENT ? sessionDetail.session_title || 'Agent' : undefined,
            // content_metadata could be mapped to artifact if structure aligns
            // artifact: m.content_metadata ? mapMetadataToArtifact(m.content_metadata) : undefined,
          }));
          loadMessages(formattedMessages);
        } catch (error) {
          console.error('Failed to fetch messages for session:', selectedConversationId, error);
          // TODO: Show error toast to user
          loadMessages([]); // Clear messages on error
        }
      };
      fetchMessages();
    } else {
      loadMessages([]); // Clear messages if no conversation is selected
    }
  }, [selectedConversationId, loadMessages]);

  // Original state and handlers from here, will modify handleSendMessage next

  const [isAgentReplying, setIsAgentReplying] = useState(false)
  // TODO: This should be derived from the selected conversation or global state
  const [
    currentSelectedAgentIdForSelector,
    setCurrentSelectedAgentIdForSelector,
  ] = useState<string | null>(null)

  const handleSendMessage = async (text: string) => {
    if (!selectedConversationId) {
      toast({
        title: 'Nenhuma conversa selecionada',
        description: 'Selecione ou inicie uma nova conversa para enviar mensagens.',
        variant: 'destructive',
      });
      return;
    }

    const currentConversation = conversations.find(c => c.id === selectedConversationId);
    if (!currentConversation || !currentConversation.agentId) {
      console.error('Selected conversation not found in store or agentId is missing.');
      // TODO: Implement UI feedback
      return;
    }
    const agentId = currentConversation.agentId;
    const agentName = currentConversation.agentName || 'Agent';

    const userMessagePayload: ChatMessageCreatePayload = {
      content: text,
      sender_type: ChatMessageSenderType.USER,
    };

    // Optimistically add user message to UI
    const optimisticUserMessage: ChatMessage = { // Using local ChatMessage type
      id: `optimistic-user-${Date.now()}`,
      text: text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
      avatarSeed: 'user-seed-optimistic', // Placeholder seed
    };
    addMessage(optimisticUserMessage);
    setIsAgentReplying(true);

    try {
      const agentReplyFromApi = await chatService.postMessageToAgent(agentId, userMessagePayload);
      
      const formattedAgentReply: ChatMessage = {
        id: agentReplyFromApi.id,
        text: agentReplyFromApi.content,
        sender: agentReplyFromApi.sender_type.toLowerCase() as 'user' | 'agent' | 'system',
        timestamp: new Date(agentReplyFromApi.created_at).toLocaleTimeString(),
        avatarSeed: agentId, // Use agentId for consistent agent avatar
        senderName: agentName,
        // artifact: agentReplyFromApi.content_metadata ? mapMetadataToArtifact(agentReplyFromApi.content_metadata) : undefined,
      };
      addMessage(formattedAgentReply);
    } catch (error) {
      console.error('Falha ao enviar mensagem ou obter resposta do agente:', error);
      const errorReply: ChatMessage = {
        id: `error-${Date.now()}`,
        text: 'Erro: Não foi possível obter uma resposta do agente.',
        sender: 'error',
        timestamp: new Date().toLocaleTimeString(),
        avatarSeed: 'system-error-seed',
      };
      addMessage(errorReply);
      toast({
        title: 'Erro ao comunicar com o agente',
        description: 'Não foi possível obter uma resposta do agente. Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setIsAgentReplying(false);
    }
  };

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

  // TODO: Fetch agents from an API (e.g., agentService) or a dedicated agent store for the selector
  // For now, ChatHeader's agent selector might not be fully functional for starting NEW chats
  // until agent listing is integrated here.
  const agentsForSelector: { id: string; title: string }[] = conversations.map(c => ({ id: c.agentId, title: c.agentName }));
  // This populates the selector with agents from existing conversations, not all available agents.

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
          {/* ChatHeader agora não exibe mais o AgentSelector. O agente ativo é sempre o da conversa selecionada. */}
          <ChatHeader
            agentName={agentDisplayName}
            agentStatus={agentStatus}
            agentAvatarFallback={agentAvatar}
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
