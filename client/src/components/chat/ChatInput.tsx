import React, { useState, useRef, KeyboardEvent } from 'react';
import { Textarea } from '@/components/ui/textarea'; // Changed from Input to Textarea
import { Button } from '@/components/ui/button';
import ToolSelector from './ToolSelector';

interface ChatInputProps {
  onSendMessage: (messageText: string) => void;
  // isLoading?: boolean; // Will be added later
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage) {
      onSendMessage(trimmedMessage);
      setMessage('');
      textareaRef.current?.focus(); // Re-focus the textarea
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent default Enter behavior (new line)
      handleSendMessage();
    }
    // If Shift + Enter is pressed, default behavior (new line) is allowed
  };

  return (
    <div className="flex items-center gap-2 p-2 border-t"> {/* Adjusted styling for the container */}
      <Textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown} // Changed from onKeyPress
        placeholder="Digite sua mensagem aqui..." // Updated placeholder
        className="flex-1 resize-none border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-2.5 min-h-[40px]" // Styling from example
        // disabled={isLoading} // Will be re-enabled when isLoading is implemented
      />
      <ToolSelector />
      <Button onClick={handleSendMessage} disabled={!message.trim()}> {/* Updated disabled logic */}
        Send
      </Button>
    </div>
  );
};

export default ChatInput;