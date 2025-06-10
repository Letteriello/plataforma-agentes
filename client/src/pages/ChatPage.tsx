import React from 'react';

/**
 * ChatPage
 * Página de chat principal da plataforma de agentes IA.
 * Estrutura inicial seguindo o protocolo local (localrules.md).
 * Pronta para expansão com funcionalidades reais de chat, integração com backend, Zustand, etc.
 *
 * Acessibilidade e internacionalização devem ser consideradas nas próximas etapas.
 */
const ChatPage: React.FC = () => {
  // Estado local e hooks de integração futura podem ser adicionados aqui

  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Chat do Agente IA</h1>
      {/* Área do chat - substitua por componente real no futuro */}
      <section
        className="w-full max-w-xl bg-muted rounded-lg shadow p-6 flex flex-col gap-4"
        aria-label="Área do Chat"
      >
        <div className="text-muted-foreground text-center">
          Em breve: interface de chat interativa para agentes IA.
        </div>
      </section>
    </main>
  );
};

export default ChatPage;
