import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSessionStore } from "@/store/sessionStore";
import { LucideUsers, LucideCpu, LucideZap, LucidePlus, LucideActivity, Search } from "lucide-react";
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
    { evento: "User Input: \"What's the weather like today?\"", hora: "10:00 AM" },
    { evento: "Agent Reply: \"The weather is sunny with a high of 75 degrees.\"", hora: "10:01 AM" },
    { evento: "Tool Call: Weather API", hora: "10:02 AM" },
  ];

  return (
    <div className="flex flex-col p-8 bg-white dark:bg-slate-950 min-h-screen">
      {/* Header com search */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <div className="relative w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full pl-10 pr-4 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
          />
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium text-slate-700 dark:text-slate-300">Active Agents</h3>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
              <LucideUsers className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-slate-900 dark:text-white">{overview.agentesAtivos}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">From {agentes.length} total agents</p>
        </Card>
        
        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium text-slate-700 dark:text-slate-300">Active Sessions</h3>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-full">
              <LucideCpu className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-slate-900 dark:text-white">{overview.sessoes}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Last 24 hours</p>
        </Card>
        
        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium text-slate-700 dark:text-slate-300">Available Tools</h3>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-full">
              <LucideZap className="h-5 w-5 text-purple-500 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-slate-900 dark:text-white">{overview.ferramentas}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Ready to use</p>
        </Card>
      </div>

      {/* Seção de Agentes e Atividades */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-lg overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">My Agents</h3>
            <Button variant="default" size="sm" className="bg-blue-500 hover:bg-blue-600 text-white gap-1">
              <LucidePlus size={16} /> New Agent
            </Button>
          </div>
          <div className="p-6">
            {agentes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-500 dark:text-slate-400 text-sm">No agents available</p>
                <Button variant="outline" size="sm" className="mt-4">
                  <LucidePlus size={16} className="mr-2" /> Create your first agent
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {[
                  { id: "1", name: "Agent Alpha", status: "online" },
                  { id: "2", name: "Agent Beta", status: "deployed" },
                  { id: "3", name: "Agent Gamma", status: "pending" }
                ].map((agente) => (
                  <div key={agente.id} className="flex items-center p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <Avatar className="h-10 w-10 mr-3">
                      <img src={`https://api.dicebear.com/7.x/personas/svg?seed=${agente.name}`} alt={agente.name} />
                    </Avatar>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{agente.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Last active: Today</p>
                    </div>
                    <Badge 
                      variant={agente.status === "online" ? "success" : agente.status === "deployed" ? "default" : "secondary"} 
                      className="ml-auto"
                    >
                      {agente.status === "online" ? "Online" : agente.status === "deployed" ? "Deployed" : "Pending"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-lg overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {atividades.map((atv, idx) => (
                <div key={idx} className="flex items-start gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <div className={`p-2 rounded-full ${
                    idx === 0 ? "bg-blue-50 dark:bg-blue-900/20" : 
                    idx === 1 ? "bg-green-50 dark:bg-green-900/20" : 
                    "bg-purple-50 dark:bg-purple-900/20"
                  }`}>
                    <LucideActivity className={`h-4 w-4 ${
                      idx === 0 ? "text-blue-500 dark:text-blue-400" : 
                      idx === 1 ? "text-green-500 dark:text-green-400" : 
                      "text-purple-500 dark:text-purple-400"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-700 dark:text-slate-300">{atv.evento}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{atv.hora}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
