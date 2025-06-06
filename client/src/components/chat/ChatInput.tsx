import React, { useState } from 'react';
import { Input } from '@/components/ui/input'; // Assuming shadcn path
import { Button } from '@/components/ui/button'; // Assuming shadcn path
import ToolSelector from './ToolSelector';
// Removed Paperclip and SendHorizonal as they are not in the new design
// import type { ChatMessage } from '@/components/chat'; // No longer creating full ChatMessage here

interface ChatInputProps {
  onSendMessage: (messageText: string) => void;
  // isLoading?: boolean; // Will be added later
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {/* The attachment button is removed as per the new example structure */}
      {/* <Button variant="ghost" size="icon" className="mr-2 text-muted-foreground hover:text-foreground">
        <Paperclip className="h-5 w-5" />
        <span className="sr-only">Anexar arquivo</span>
      </Button> */}
      <Input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
        style={{ flexGrow: 1 }}
        // disabled={isLoading}
        // className="flex-1 resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none p-2.5 min-h-[40px]" // From old Textarea
      />
      <ToolSelector />
      <Button onClick={handleSend} /*disabled={isLoading || !inputText.trim()}*/>
        {/* Using text "Send" instead of an icon as per example */}
        Send
        {/* <SendHorizonal className="h-5 w-5" />
        <span className="sr-only">Enviar mensagem</span> */}
      </Button>
    </div>
  );
};

export default ChatInput;