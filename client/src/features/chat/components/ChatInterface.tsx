import type { ComponentType } from 'react'
import { useCallback, useEffect, useState } from 'react'
import type { ChatMessage, ChatMessageSenderType } from '@/types/chatTypes';
import type { ChatHeaderProps } from './ChatHeader';

import chatService from '@/features/chat/services/chatService';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast'; // Import useToast
import { useChatStore } from '@/features/chat/store/chatStore'

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
    const handleFetchSessions = useCallback(async () => {
      try {
        const sessions = await chatService.getSessions();
        const storeConversations = sessions.map((session) => ({
          id: session.id,
          title: session.title || `Conversa ${new Date(session.created_at).toLocaleDateString()}`,
          agentId: session.agent_id,
          agentName: session.agent_name || 'Agente',
          createdAt: session.created_at,
          updatedAt: session.updated_at,
        }));
        loadConversations(storeConversations);
      } catch {
        toast({
          title: 'Erro ao carregar conversas',
          description: 'Não foi possível carregar as conversas. Tente novamente mais tarde.',
          variant: 'destructive',
        });
      }
    }, [loadConversations]);
    handleFetchSessions();
  }, [loadConversations]);

  // Fetch messages when a conversation is selected
  useEffect(() => {
    const handleFetchMessages = useCallback(async (conversationId: string) => {
      try {
        const messages = await chatService.getMessages(conversationId);
        const formattedMessages = messages.map((msg) => ({
          id: msg.id,
          text: msg.content,
          sender: msg.sender_type.toLowerCase() as 'user' | 'agent' | 'system',
          timestamp: new Date(msg.created_at).toLocaleTimeString(),
        }));
        loadMessages(formattedMessages);
      } catch {
        toast({
          title: 'Erro ao carregar mensagens',
          description: 'Não foi possível carregar as mensagens desta conversa.',
          variant: 'destructive',
        });
        loadMessages([]); // Clear messages on error
      }
    }, [loadMessages, toast]);

    if (selectedConversationId) {
      handleFetchMessages(selectedConversationId);
    } else {
      loadMessages([]); // Clear messages if no conversation is selected
    }
  }, [selectedConversationId, loadMessages, toast]);

  const [isAgentReplying, setIsAgentReplying] = useState(false);

  // Using imported ChatMessageSenderType from chatTypes

  const handleSendMessage = async (text: string) => {
    if (!selectedConversationId) {
      toast({
        title: 'Nenhuma conversa selecionada',
        description: 'Selecione ou inicie uma nova conversa para enviar mensagens.',
        variant: 'destructive',
      });
      return;
    }

    const currentConversation = conversations.find((c: { id: string }) => c.id === selectedConversationId);
    if (!currentConversation?.agentId) {
      toast({
        title: 'Erro na conversa',
        description: 'Não foi possível identificar o agente para esta conversa.',
        variant: 'destructive',
      });
      return;
    }
    const agentId = currentConversation.agentId;
    const agentName = currentConversation.agentName ?? 'Agente';

    const userMessagePayload = {
      content: text,
      sender_type: ChatMessageSenderType.USER as const,
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
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      const errorReply: ChatMessage = {
        id: `error-${Date.now()}`,
        text: `Erro: ${errorMessage}`,
        sender: 'system',
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

  const currentConversation = conversations.find(
    (c: { id: string }) => c.id === selectedConversationId,
  );
  const agentDisplayName = currentConversation?.agentName || 'Selecione uma conversa';
  const agentAvatar = agentDisplayName.charAt(0).toUpperCase();
  const agentStatus = selectedConversationId ? 'Online' : 'Offline';
  
  // Chat header props
  const chatHeaderProps: ChatHeaderProps = {
    agentName: agentDisplayName,
    agentStatus: agentStatus,
    agentAvatarFallback: agentAvatar,
    agents: [],
    selectedAgentId: selectedConversationId || '',
    onSelectAgent: () => {
      // Will be implemented when agent switching is supported
    },
  };

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
          <ChatHeader {...chatHeaderProps} />

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
