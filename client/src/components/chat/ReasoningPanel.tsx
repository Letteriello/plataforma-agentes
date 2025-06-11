import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from '@/components/ui/scroll-area';

interface LogEntry {
  id: string;
  title: string;
  content: string;
}

interface ReasoningPanelProps {
  logEntries?: LogEntry[];
}

// Sample logs for development
const sampleLogs: LogEntry[] = [
  { id: "log-1", title: "Pensamento Inicial", content: "O agente est\u00e1 come\u00e7ando a processar o pedido." },
  { id: "log-2", title: "Uso de Ferramenta: Busca na Web", content: "A ferramenta 'web_search' foi chamada com os par\u00e2metros X, Y, Z." },
  { id: "log-3", title: "Observa\u00e7\u00e3o da Ferramenta", content: "Resultado da busca: P\u00e1gina A cont\u00e9m informa\u00e7\u00f5es relevantes." },
  { id: "log-4", title: "Pensamento Final", content: "O agente est\u00e1 compilando a resposta final." },
];

export default function ReasoningPanel({ logEntries = sampleLogs }: ReasoningPanelProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b">
        <h2 className="text-lg font-semibold">Racioc\u00ednio</h2>
      </div>
      <ScrollArea className="flex-1">
        <Accordion type="single" collapsible className="w-full p-3">
          {logEntries.map((log) => (
            <AccordionItem value={log.id} key={log.id}>
              <AccordionTrigger>{log.title}</AccordionTrigger>
              <AccordionContent>{log.content}</AccordionContent>
            </AccordionItem>
          ))}
          {logEntries.length === 0 && <p className="text-sm text-muted-foreground p-4">Nenhum log de racioc\u00ednio dispon\u00edvel.</p>}
        </Accordion>
      </ScrollArea>
    </div>
  );
}
