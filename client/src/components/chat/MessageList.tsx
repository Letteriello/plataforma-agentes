import React from 'react';
import Message from './Message';
import { ChatMessage as MessageType } from './types'; // Using ChatMessage as MessageType

interface MessageListProps {
  messages: MessageType[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="flex flex-col gap-3 p-4"> {/* Updated styling for the list container */}
      {messages
        .filter(msg => msg.sender === 'user' || msg.sender === 'agent') // Filter for user or agent messages
        .map((msg) => (
          <Message
            key={msg.id}
            author={msg.sender as 'user' | 'agent'} // Assert type after filtering
            content={msg.text}
            agentName={msg.senderName} // Pass senderName as agentName
          />
        ))}
    </div>
  );
};

export { MessageList };