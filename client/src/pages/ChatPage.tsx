// client/src/pages/ChatPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { ConversationList, ChatInterface } from '@/components/chat';
import type { ChatMessage } from '@/components/chat';
import { chatService } from '@/api/chatService';

console.log('ChatPage module loaded');

const ChatPage: React.FC = () => {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false); // For loading messages list or sending
  const [isStreaming, setIsStreaming] = useState<boolean>(false); // Specifically for streaming response
  const [error, setError] = useState<string | null>(null);

  // Fetch messages when activeConversationId changes
  useEffect(() => {
    if (activeConversationId) {
      setError(null);
      setIsLoading(true);
      setMessages([]); // Clear previous messages
      chatService.fetchSessionMessages(activeConversationId)
        .then(fetchedMessages => {
          setMessages(fetchedMessages);
        })
        .catch(err => {
          console.error(`Error fetching messages for session ${activeConversationId}:`, err);
          setError(`Failed to fetch messages. ${err.message || ''}`);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setMessages([]);
    }
  }, [activeConversationId]);

  const handleSendMessage = async (messageText: string) => {
    if (!activeConversationId) {
      setError('Cannot send message: no active conversation selected.');
      return;
    }

    setError(null);
    const tempUserMessage: ChatMessage = {
      id: `temp-user-${crypto.randomUUID()}`,
      text: messageText,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    setMessages(prevMessages => [...prevMessages, tempUserMessage]);

    const messagePayload = {
      text: messageText,
      sender: 'user' as 'user',
      timestamp: tempUserMessage.timestamp,
    };

    setIsStreaming(true); // Indicate that a stream is about to start

    try {
      // onChunkReceived callback
      const onChunkReceived = (chunk: string, isLastChunk: boolean, streamId: string) => {
        setMessages(prevMessages => {
          const existingAgentMessageIndex = prevMessages.findIndex(
            msg => msg.streamId === streamId && msg.sender === 'agent'
          );

          if (existingAgentMessageIndex !== -1) {
            // Found existing agent message, append chunk
            const updatedMessages = [...prevMessages];
            const currentText = updatedMessages[existingAgentMessageIndex].text;
            updatedMessages[existingAgentMessageIndex] = {
              ...updatedMessages[existingAgentMessageIndex],
              text: currentText + chunk,
              isStreaming: !isLastChunk,
            };
            return updatedMessages;
          } else if (chunk) { // First chunk for this agent message and chunk is not empty
            const newAgentMessage: ChatMessage = {
              id: streamId, // Use streamId as React key and temp ID
              streamId: streamId,
              text: chunk,
              sender: 'agent',
              timestamp: new Date().toISOString(),
              isStreaming: !isLastChunk,
              senderName: 'Agent', // Placeholder
              avatarSeed: `agent-${streamId}`, // Placeholder
            };
            return [...prevMessages, newAgentMessage];
          }
          return prevMessages; // No change if empty initial chunk or other edge cases
        });

        if (isLastChunk) {
          setIsStreaming(false);
          // Optionally, if the backend could send a final ID for the message:
          // setMessages(prev => prev.map(m => m.streamId === streamId ? {...m, id: finalIdFromBackend} : m));
        }
      };

      await chatService.sendMessage(activeConversationId, messagePayload, onChunkReceived);
      // The sendMessage promise now resolves when the stream has been fully processed by onChunkReceived
      // or rejects on error. isStreaming state is managed inside onChunkReceived.

    } catch (err) {
      console.error('Error sending message or processing stream:', err);
      setError(`Failed to send message. ${err.message || ''}`);
      setIsStreaming(false); // Ensure streaming stops on error
      // Optionally remove the optimistic user message or mark it as failed
      // setMessages(prevMessages => prevMessages.filter(m => m.id !== tempUserMessage.id));
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
    // The useEffect hook will now handle fetching messages for the new activeConversationId
  };

  // TODO: Need a way to get userId for chatService.fetchSessions or startNewSession
  // For now, ConversationList might handle fetching its own sessions or receive them via props.
  // If ChatPage needs to initiate session fetching (e.g. if no conversations exist),
  // that logic would go here, perhaps in another useEffect.

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full max-h-[calc(100vh-4rem-2rem)] w-full rounded-lg border border-border bg-background text-foreground"
    >
      <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
        <ConversationList
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          // sessions={sessions} // If sessions are fetched here or in a parent component
          // userId={userId} // If userId is available
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={75}>
        {/* Pass isLoading and error to ChatInterface if it's designed to display them */}
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading} // Pass loading state
          error={error} // Pass error state
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default ChatPage;
