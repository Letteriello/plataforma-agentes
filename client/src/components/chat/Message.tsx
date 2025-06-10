import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Corresponds to ChatMessage.sender but narrowed for this component's direct use
type MessageAuthor = 'user' | 'agent';

interface MessageProps {
  author: MessageAuthor;
  content: string;
  agentName?: string; // Optional, but should be provided if author is 'agent'
}

const Message: React.FC<MessageProps> = ({ author, content, agentName }) => {
  const isUser = author === 'user';

  // Determine avatar initials
  const avatarInitial = agentName ? agentName.charAt(0).toUpperCase() : 'A';

  return (
    <div
      className={cn(
        'mb-3 flex items-end gap-2',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback>{avatarInitial}</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-xs rounded-lg px-3 py-2 md:max-w-md', // Common styling
          isUser
            ? 'bg-primary text-primary-foreground' // User message specific styling
            : 'bg-muted' // Agent message specific styling
        )}
      >
        <p className="text-sm">{content}</p>
      </div>
    </div>
  );
};

export default Message;
