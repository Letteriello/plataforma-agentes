import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Bot, Zap, Wrench, Check } from 'lucide-react';

// Corresponds to ChatMessage.sender but narrowed for this component's direct use
type MessageAuthor = 'user' | 'agent';

interface MessageProps {
  author: MessageAuthor;
  content: string;
  agentName?: string; // Optional, but should be provided if author is 'agent'
  messageType?: string;
}

const Message: React.FC<MessageProps> = ({ author, content, agentName, messageType }) => {
  const isUser = author === 'user';

  // Determine avatar initials
  const avatarInitial = agentName ? agentName.charAt(0).toUpperCase() : 'A';

  if (messageType === 'agent_thought') {
    return (
      <div className="my-2">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-sm font-medium text-muted-foreground hover:no-underline">
              <Bot className="mr-2 h-4 w-4" />
              O agente está raciocinando...
            </AccordionTrigger>
            <AccordionContent className="p-4 space-y-2 border-t bg-muted/50 rounded-b-md">
              <p className="text-xs flex items-center">
                <Zap className="mr-2 h-3 w-3 text-yellow-500" />Iniciando a tarefa: Análise de Mercado
              </p>
              <p className="text-xs flex items-center">
                <Wrench className="mr-2 h-3 w-3 text-blue-500" />Usando ferramenta: 'Web Search'
              </p>
              <p className="text-xs flex items-center">
                <Check className="mr-2 h-3 w-3 text-green-500" />Ferramenta executada com sucesso.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }

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
