// Em client/src/components/chat/ChatInterface.tsx
import React, { useEffect } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { AgentWorkspace } from './AgentWorkspace';
import type { ComponentType } from 'react';
import { useChatStore } from '@/store/chatStore';
import { getConversationList, initialActiveConversationId } from './mockData'; // Import initialActiveConversationId
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
// Removed Avatar, AvatarFallback, Badge imports as they are now in ChatHeader
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './types'; // Import ChatMessage for constructing new messages
import { ChatHeader } from './ChatHeader'; // New import
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

// Mock agents data for AgentSelector - this would typically come from a store or API
const mockAgentsForSelector = [
  { id: 'agent1', title: 'Agente de Suporte N1' },
  { id: 'agent2', title: 'Agente Financeiro' },
  { id: 'agent3', title: 'Agente de Vendas Proativo' },
];

interface ChatInterfaceProps {
  LeftPanelComponent?: ComponentType; // Added
  RightPanelComponent?: ComponentType;
}

export const ChatInterface = ({ LeftPanelComponent, RightPanelComponent = AgentWorkspace }: ChatInterfaceProps) => {
  const {
    loadConversations,
    setSelectedConversationId,
    messages,
    addMessage,
    selectedConversationId,
    conversations,
  } = useChatStore();

  useEffect(() => {
    const mockConversations = getConversationList().map((convo) => ({
      id: convo.id,
      agentName: convo.name,
      lastMessage: convo.lastMessagePreview || 'Nenhuma mensagem',
    }));
    loadConversations(mockConversations);

    // Set initial selected conversation
    if (mockConversations.length > 0) {
      // Use initialActiveConversationId from mockData or fallback to the first conversation's ID
      const initialIdToSelect = initialActiveConversationId || mockConversations[0].id;
      setSelectedConversationId(initialIdToSelect);
    }
  }, [loadConversations, setSelectedConversationId]);

  const [isAgentReplying, setIsAgentReplying] = React.useState(false);

  const handleSendMessage = (text: string) => {
    if (!selectedConversationId) return;
    setIsAgentReplying(true); // Start loading

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    addMessage(newMessage);

    // Simulate agent response
    // Se a mensagem do usuário contiver "error", simule uma resposta de erro
    const simulateError = text.toLowerCase().includes('error');

    setTimeout(() => {
      let agentResponse: ChatMessage;
      if (simulateError) {
        agentResponse = {
          id: Date.now().toString(),
          text: "Ocorreu um erro simulado ao processar sua mensagem.",
          sender: 'agent',
          senderName: conversations.find(c => c.id === selectedConversationId)?.agentName || "Agente",
          timestamp: new Date().toISOString(),
          type: 'error', // Definir o tipo como erro
        };
      } else {
        agentResponse = {
          id: Date.now().toString(),
          text: "Esta é uma resposta simulada do agente.",
          sender: 'agent',
          senderName: conversations.find(c => c.id === selectedConversationId)?.agentName || "Agente",
          timestamp: new Date().toISOString(),
        };
      }
      addMessage(agentResponse);
      setIsAgentReplying(false); // Stop loading
    }, 2000);
  };

  // For now, manage selected agent for selector locally or assume store provides it.
  const [currentSelectedAgentIdForSelector, setCurrentSelectedAgentIdForSelector] = React.useState<string | null>(mockAgentsForSelector[0]?.id || null);

  const handleAgentChangeInSelector = (agentId: string | null) => {
    setCurrentSelectedAgentIdForSelector(agentId);
    // Here you would typically also update the agent context for the chat,
    // possibly triggering a new conversation or clearing existing messages.
    // For this task, just updating the selector's state is sufficient.
    console.log("Agent selected via header:", agentId);
  };

  // This part that determines agentName, status, etc., might need to be adjusted
  // if the agent selected by AgentSelector should override the conversation's agent.
  // For now, let's assume the header displays the conversation's agent,
  // and AgentSelector is a separate concern for *changing* the agent context.
  const selectedConversation = conversations.find(c => c.id === selectedConversationId);
  const agentDisplayName = selectedConversation ? selectedConversation.agentName : 'Nenhum Agente';
  const agentAvatar = agentDisplayName ? agentDisplayName.charAt(0).toUpperCase() : '?';
  const agentStatus = selectedConversationId ? 'Online' : 'Offline'; // Simplified

  return (
    <ResizablePanelGroup direction="horizontal" className="flex-1 rounded-lg border">
      {LeftPanelComponent && (
        <ResizablePanel defaultSize={20} minSize={15}>
          <LeftPanelComponent />
        </ResizablePanel>
      )}
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={55} minSize={30}> {/* Adjusted defaultSize */}
        <div className="flex h-full flex-col">
          <ChatHeader
            agentName={agentDisplayName}
            agentStatus={agentStatus}
            agentAvatarFallback={agentAvatar}
            agents={mockAgentsForSelector} // Pass the list of agents
            selectedAgentId={currentSelectedAgentIdForSelector} // Pass the currently selected agent ID for the selector
            onSelectAgent={handleAgentChangeInSelector} // Pass the handler
          />

          <ScrollArea className="flex-1">
            <MessageList messages={messages} />
            {isAgentReplying && (
              <div className="flex items-end space-x-2 p-4"> {/* Mimic Message component structure */}
                <Skeleton className="h-8 w-8 rounded-full" /> {/* Avatar skeleton */}
                <div className="flex flex-col space-y-1.5"> {/* Adjusted spacing for visual similarity */}
                  <Skeleton className="h-4 w-[150px]" /> {/* Message bubble line 1 */}
                  <Skeleton className="h-4 w-[120px]" /> {/* Message bubble line 2 */}
                </div>
              </div>
            )}
          </ScrollArea>

          <div className="border-t"> {/* Removed p-4, ChatInput now has it */}
            <ChatInput onSendMessage={handleSendMessage} isLoading={isAgentReplying} /> {/* Pass isLoading */}
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={25} minSize={20}> {/* Adjusted minSize */}
        <RightPanelComponent />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default ChatInterface;
