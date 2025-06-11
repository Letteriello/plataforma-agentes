// Em client/src/components/chat/ChatInterface.tsx
import React, { useEffect } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ConversationList } from './ConversationList';
import { AgentWorkspace } from './AgentWorkspace';
import type { ComponentType } from 'react';
import { useChatStore } from '@/store/chatStore';
import { getConversationList, initialActiveConversationId } from './mockData'; // Import initialActiveConversationId
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './types'; // Import ChatMessage for constructing new messages

interface ChatInterfaceProps {
  RightPanelComponent?: ComponentType;
}

export const ChatInterface = ({ RightPanelComponent = AgentWorkspace }: ChatInterfaceProps) => {
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

  const handleSendMessage = (text: string) => {
    if (!selectedConversationId) return; // Should not happen if a conversation is always selected

    const newMessage: ChatMessage = {
      id: Date.now().toString(), // Simple ID generation
      text,
      sender: 'user',
      timestamp: new Date().toISOString(),
      // senderName is not needed for user messages
    };
    addMessage(newMessage);

    // TODO: In a real app, you would also send this message to the backend
    // and potentially update the conversation's lastMessage.
  };

  // Find the selected conversation to display agent name in header
  const selectedConversation = conversations.find(c => c.id === selectedConversationId);
  const selectedAgent = selectedConversation
    ? { name: selectedConversation.agentName, status: 'Online' } // Assuming agent is always Online for now
    : { name: 'Nenhum Agente', status: 'Offline' };


  return (
    <ResizablePanelGroup direction="horizontal" className="flex-1 rounded-lg border">
      <ResizablePanel defaultSize={25} minSize={15}>
        <ConversationList />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50} minSize={30}>
        <div className="flex h-full flex-col">
          <header className="flex items-center gap-4 border-b px-3 py-2">
            <Avatar>
              {/* Ensure selectedAgent.name is not undefined before charAt */}
              <AvatarFallback>{selectedAgent.name ? selectedAgent.name.charAt(0).toUpperCase() : '?'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{selectedAgent.name}</p>
              {selectedConversationId && ( // Only show status if a conversation is selected
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-green-500 text-green-500">
                    {selectedAgent.status}
                  </Badge>
                </div>
              )}
            </div>
          </header>

          <ScrollArea className="flex-1">
            <MessageList messages={messages} />
          </ScrollArea>

          <div className="border-t"> {/* Removed p-4, ChatInput now has it */}
            <ChatInput onSendMessage={handleSendMessage} /> {/* Pass handler to ChatInput */}
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={25} minSize={25}>
        <RightPanelComponent />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default ChatInterface;
