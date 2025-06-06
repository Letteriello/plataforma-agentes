// client/src/components/chat/MessageInput.tsx
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Paperclip, SendHorizonal } from 'lucide-react';
import type { ChatMessage } from '@/components/chat'; // Import ChatMessage type

interface MessageInputProps {
  onSendMessage: (messageData: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      const messageData: Omit<ChatMessage, 'id' | 'timestamp'> = {
        text: message.trim(),
        sender: 'user',
        senderName: 'Usuário', // Placeholder - será dinâmico com autenticação
        avatarSeed: 'User' // Placeholder - pode ser dinâmico ou baseado no senderName
      };
      onSendMessage(messageData);
      setMessage('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex items-center p-4 border-t border-border bg-card">
      <Button variant="ghost" size="icon" className="mr-2 text-muted-foreground hover:text-foreground">
        <Paperclip className="h-5 w-5" />
        <span className="sr-only">Anexar arquivo</span>
      </Button>
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Digite sua mensagem aqui..."
        className="flex-1 resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none p-2.5 min-h-[40px]"
        rows={1} // Começa com 1 linha, pode expandir
      />
      <Button onClick={handleSendMessage} size="icon" className="ml-2 bg-primary hover:bg-primary/90 text-primary-foreground">
        <SendHorizonal className="h-5 w-5" />
        <span className="sr-only">Enviar mensagem</span>
      </Button>
    </div>
  );
};

export default MessageInput;