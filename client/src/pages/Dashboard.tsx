import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import { useSessionStore } from "@/store/sessionStore";
import { LucideUsers, LucideCpu, LucideZap, LucidePlus, LucideActivity } from "lucide-react";
import { useMemo } from "react";

export default function Dashboard() {
  const { sessions, activeSessionId } = useSessionStore();
  // Seleciona a sessão ativa ou a primeira
  const session = useMemo(() => {
    if (!sessions.length) return null;
    return sessions.find(s => s.id === activeSessionId) || sessions[0];
  }, [sessions, activeSessionId]);

  // Deriva dados para os cards
  const overview = useMemo(() => {
    if (!session) return { agentesAtivos: 0, sessoes: sessions.length, ferramentas: 0 };
    const agentesAtivos = session.agents.filter(a => a.status === "online").length;
    const ferramentas = 5; // TODO: Integrar com store de ferramentas futuramente
    return { agentesAtivos, sessoes: sessions.length, ferramentas };
  }, [session, sessions]);

  const agentes = session ? session.agents : [];
  const atividades = [
    { evento: "Feed de eventos será implementado", hora: "--:--" },
  ];

  return (
    <div className="flex flex-col gap-8 p-8 bg-background min-h-screen">
      <h1 className="text-3xl font-bold text-foreground mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Visão Geral */}
        <Card className="col-span-1 md:col-span-1 flex flex-col gap-4 p-6">
          <h3 className="text-lg font-semibold mb-2">Visão Geral</h3>
          <div className="flex flex-row justify-between items-center gap-4">
            <div className="flex flex-col items-center">
              <LucideUsers className="text-primary" />
              <span className="font-bold text-xl">{overview.agentesAtivos}</span>
              <span className="text-sm text-muted-foreground">Agentes Ativos</span>
            </div>
            <div className="flex flex-col items-center">
              <LucideCpu className="text-primary" />
              <span className="font-bold text-xl">{overview.sessoes}</span>
              <span className="text-sm text-muted-foreground">Sessões</span>
            </div>
            <div className="flex flex-col items-center">
              <LucideZap className="text-primary" />
              <span className="font-bold text-xl">{overview.ferramentas}</span>
              <span className="text-sm text-muted-foreground">Ferramentas</span>
            </div>
          </div>
        </Card>
        {/* Card Meus Agentes */}
        <Card className="col-span-1 md:col-span-1 flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Meus Agentes</h3>
            <Button variant="default" size="sm" className="gap-2">
              <LucidePlus size={16} /> + Criar Agente
            </Button>
          </div>
          <div className="flex flex-col gap-3">
            {agentes.length === 0 ? (
              <span className="text-muted-foreground text-sm">Nenhum agente cadastrado.</span>
            ) : (
              agentes.map((agente, idx) => (
                <div key={agente.id || idx} className="flex items-center gap-3">
                  <Avatar className="bg-accent text-foreground font-bold w-8 h-8">
                    {agente.name?.charAt(0) || "A"}
                  </Avatar>
                  <span className="font-medium">{agente.name}</span>
                  <Badge variant={agente.status === "online" ? "success" : "secondary"} className="ml-auto">
                    {agente.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </Card>
        {/* Card Atividade Recente */}
        <Card className="col-span-1 md:col-span-1 flex flex-col gap-4 p-6">
          <h3 className="text-lg font-semibold mb-2">Atividade Recente</h3>
          <ul className="flex flex-col gap-2">
            {atividades.map((atv, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <LucideActivity className="text-accent" size={18} />
                <span className="text-base">{atv.evento}</span>
                <span className="ml-auto text-xs text-muted-foreground">{atv.hora}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
