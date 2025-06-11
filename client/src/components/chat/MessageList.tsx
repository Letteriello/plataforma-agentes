import React from 'react'
import Message from './Message'
import { ChatMessage as MessageType } from './types'

interface MessageListProps {
  messages: MessageType[]
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="flex flex-col gap-3 p-4">
      {messages.map((msg) => (
        <Message
          key={msg.id}
          author={
            (msg.sender === 'user' ? 'user' : 'agent') as 'user' | 'agent'
          }
          content={msg.text}
          agentName={msg.senderName}
          messageType={msg.type}
        />
      ))}
    </div>
  )
}

export { MessageList }
