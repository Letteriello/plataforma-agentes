import React from 'react';
import DOMPurify from 'dompurify'; // Import DOMPurify
import { ChatMessage as MessageType } from './types'; // Using ChatMessage as MessageType

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const messageStyle: React.CSSProperties = {
    padding: '10px 15px',
    borderRadius: '20px',
    maxWidth: '70%',
    wordWrap: 'break-word',
    alignSelf: isUser ? 'flex-end' : 'flex-start',
    backgroundColor: isUser ? '#007bff' : '#e9ecef',
    color: isUser ? 'white' : 'black',
    // Basic styling for message bubbles
  };

  // Sanitize the message text before rendering
  const sanitizedHtml = DOMPurify.sanitize(message.text);

  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: '8px' }}>
      <div style={messageStyle}>
        {/* Use dangerouslySetInnerHTML to render the sanitized HTML */}
        <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
        {/* Optional: Display timestamp */}
        {/* <span style={{ fontSize: '0.75em', color: isUser ? '#f0f0f0' : '#555' }}>{new Date(message.timestamp).toLocaleTimeString()}</span> */}
      </div>
    </div>
  );
};

export default Message;
