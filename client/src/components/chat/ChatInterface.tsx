import React from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import type { ChatMessage } from './types'; // Import ChatMessage type

// import ToolSelector from './ToolSelector'; // ToolSelector will be integrated into ChatInput later

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (messageText: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage }) => {
  // Mock messages are removed, actual messages will be passed as props
  // const mockMessages = [
  //   { id: '1', text: 'Hello there!', sender: 'user' as 'user' | 'agent', timestamp: new Date() },
  //   { id: '2', text: 'Hi! How can I help you today?', sender: 'agent' as 'user' | 'agent', timestamp: new Date() },
  // ];

  return (
    // The component should probably not define its own height to 100vh if it's meant to be part of a larger page layout.
    // Let's make it more flexible by default, e.g. height: '100%' or let the parent control it.
    // For now, keeping style as is from Step 2, but this might need adjustment.
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
      <div style={{ flexGrow: 1, overflowY: 'auto', padding: '16px' }}>
        <MessageList messages={messages} />
      </div>
      <div style={{ borderTop: '1px solid #ccc', padding: '16px' }}>
        <ChatInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
};

export default ChatInterface;
