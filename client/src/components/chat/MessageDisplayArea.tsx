// client/src/components/chat/MessageDisplayArea.tsx
import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/components/chat'; // Import ChatMessage

interface MessageDisplayAreaProps {
  messages: ChatMessage[];
  // TODO: Adicionar prop para o título da conversa ativa no futuro
}

const MessageDisplayArea: React.FC<MessageDisplayAreaProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="p-4 border-b border-border">
        {/* Poderia ser o nome da conversa/agente ativo */}
        <h2 className="text-lg font-semibold text-foreground">Chat com Agente Alpha</h2> 
      </div>
      <ScrollArea className="flex-1 p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-muted-foreground">Nenhuma mensagem ainda.</p>
            <p className="text-xs text-muted-foreground">Envie uma mensagem para iniciar a conversa.</p>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'flex items-end gap-2',
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {msg.sender !== 'user' && (
              <Avatar className="h-8 w-8 shrink-0">
                <img 
                  src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${msg.avatarSeed || msg.senderName || 'bot'}`} 
                  alt={msg.senderName || msg.sender} 
                />
              </Avatar>
            )}
            <div
              className={cn(
                'max-w-[70%] rounded-lg p-3 text-sm',
                msg.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground',
                msg.sender === 'system' && 'w-full text-center bg-transparent text-xs text-muted-foreground italic'
              )}
            >
              {msg.sender === 'agent' && msg.senderName && (
                <p className="text-xs font-semibold mb-0.5">{msg.senderName}</p>
              )}
              <p className="whitespace-pre-wrap">{msg.text}</p>
              <p className={cn(
                "text-xs mt-1",
                msg.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground/70',
                msg.sender === 'system' && 'hidden' // System messages don't need timestamp here
              )}>
                {msg.timestamp}
              </p>
            </div>
             {msg.sender === 'user' && (
              <Avatar className="h-8 w-8 shrink-0">
                 <img 
                  src={`https://api.dicebear.com/7.x/personas/svg?seed=${msg.avatarSeed || 'User'}`} 
                  alt={msg.senderName || 'User'}
                />
              </Avatar>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </ScrollArea>
    </div>
  );
};

export default MessageDisplayArea;