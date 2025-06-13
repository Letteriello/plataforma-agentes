import { ChatInterface } from '@/components/chat/ChatInterface';
import SessionsList from '@/components/sessions/SessionsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PlaygroundPage = () => {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 h-full">
      <Tabs defaultValue="chat" className="w-full h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="sessoes">Sessões Anteriores</TabsTrigger>
        </TabsList>
        <TabsContent value="chat" className="flex-grow">
          <ChatInterface />
        </TabsContent>
        <TabsContent value="sessoes" className="flex-grow">
          <SessionsList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlaygroundPage;
