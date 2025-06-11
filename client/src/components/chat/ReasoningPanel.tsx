import { ScrollArea } from '@/components/ui/scroll-area';

export default function ReasoningPanel() {
  const logs = [
    'Pensando...',
    'Chamando ferramenta de busca...',
    'Processando resultado...',
  ];
  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b">
        <h2 className="text-lg font-semibold">Racioc\u00ednio</h2>
      </div>
      <ScrollArea className="flex-1 p-3 space-y-2 text-sm">
        {logs.map((log, idx) => (
          <p key={idx}>{log}</p>
        ))}
      </ScrollArea>
    </div>
  );
}
