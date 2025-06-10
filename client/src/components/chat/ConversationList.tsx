// client/src/components/chat/ConversationList.tsx
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils'; // Import cn for conditional classes
import { useChatStore } from '@/store/chatStore'; // Import useChatStore
import { Avatar, AvatarFallback } from '@/components/ui/avatar'; // Import Avatar components

const ConversationList: React.FC = () => {
  const { conversations, selectedConversationId, setSelectedConversationId } = useChatStore();

  return (
    <div className="flex h-full flex-col border-r border-border bg-card">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Conversas</h2>
      </div>
      <ScrollArea className="flex-1 p-1">
        {conversations.map((convo) => (
          <div
            key={convo.id}
            className={cn(
              'flex items-center space-x-3 mb-[2px] cursor-pointer rounded-md px-2 py-1.5 hover:bg-muted/50',
              { 'bg-accent': convo.id === selectedConversationId } // Updated to bg-accent
            )}
            onClick={() => setSelectedConversationId(convo.id)} // Use setSelectedConversationId from store
          >
            <Avatar className="h-10 w-10">
              <AvatarFallback>{convo.agentName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium text-foreground text-sm truncate">{convo.agentName}</p>
              <p className="text-xs text-muted-foreground truncate">{convo.lastMessage || 'Nenhuma mensagem'}</p>
            </div>
          </div>
        ))}
        {conversations.length === 0 && (
          <p className="p-3 text-sm text-muted-foreground">Nenhuma conversa ativa.</p>
        )}
      </ScrollArea>
    </div>
  );
};

export { ConversationList };
