import React from 'react';
import Message from './Message';
import { ChatMessage as MessageType } from './types'; // Using ChatMessage as MessageType

interface MessageListProps {
  messages: MessageType[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {messages.map((msg) => (
        // Ensure the Message component expects a prop named "message" of type MessageType
        <Message key={msg.id} message={msg} />
      ))}
    </div>
  );
};

export default MessageList;