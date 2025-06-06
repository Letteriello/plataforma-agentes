// client/src/components/chat/ConversationList.tsx
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils'; // Import cn for conditional classes
import { getConversationList } from './mockData';

interface ConversationListProps {
  activeConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({ activeConversationId, onSelectConversation }) => {
  // Obter a lista de conversas do mockData
  const conversations = getConversationList();

  return (
    <div className="flex h-full flex-col border-r border-border bg-card">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Conversas</h2>
      </div>
      <ScrollArea className="flex-1 p-2">
        {conversations.map((convo) => (
          <div
            key={convo.id}
            className={cn(
              'mb-1 cursor-pointer rounded-md p-3 hover:bg-muted/50',
              { 'bg-muted': convo.id === activeConversationId }
            )}
            onClick={() => onSelectConversation(convo.id)}
          >
            <p className="font-medium text-foreground text-sm truncate">{convo.name}</p>
            <p className="text-xs text-muted-foreground truncate">{convo.lastMessagePreview || 'Nenhuma mensagem'}</p>
          </div>
        ))}
        {conversations.length === 0 && (
          <p className="p-3 text-sm text-muted-foreground">Nenhuma conversa ativa.</p>
        )}
      </ScrollArea>
    </div>
  );
};

export default ConversationList;