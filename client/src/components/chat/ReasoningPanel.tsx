import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ScrollArea } from '@/components/ui/scroll-area'

interface LogEntry {
  id: string
  title: string
  content: string
}

interface ReasoningPanelProps {
  logEntries?: LogEntry[]
}

// Sample logs for development
const sampleLogs: LogEntry[] = [
  {
    id: 'log-1',
    title: 'Pensamento Inicial',
    content:
      'O agente está começando a processar o pedido.\nInput: Qual é a capital da França?',
  },
  {
    id: 'log-2',
    title: 'Uso de Ferramenta: Busca na Web',
    content: JSON.stringify(
      {
        tool: 'web_search',
        parameters: { query: 'capital of France' },
        reason:
          'Preciso encontrar a capital da França para responder ao usuário.',
      },
      null,
      2,
    ),
  },
  {
    id: 'log-3',
    title: 'Observação da Ferramenta',
    content: 'Resultado da busca:\nParis é a capital da França.',
  },
  {
    id: 'log-4',
    title: 'Pensamento Final',
    content: 'A capital da França é Paris. Vou fornecer esta resposta.',
  },
]

export default function ReasoningPanel({
  logEntries = sampleLogs,
}: ReasoningPanelProps) {
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
              <AccordionContent>
                <pre className="whitespace-pre-wrap text-sm font-mono bg-muted/50 p-2 rounded-sm">
                  <code>{log.content}</code>
                </pre>
              </AccordionContent>
            </AccordionItem>
          ))}
          {logEntries.length === 0 && (
            <p className="text-sm text-muted-foreground p-4">
              Nenhum log de racioc\u00ednio dispon\u00edvel.
            </p>
          )}
        </Accordion>
      </ScrollArea>
    </div>
  )
}
