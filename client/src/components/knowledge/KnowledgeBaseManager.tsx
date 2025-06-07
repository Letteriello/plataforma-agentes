import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Adicionado CardDescription

const KnowledgeBaseManager: React.FC = () => {
  return (
    <Card className="h-full"> {/* Adicionado h-full para ocupar altura da aba */}
      <CardHeader>
        <CardTitle>Gerenciador de Base de Conhecimento (RAG)</CardTitle>
        <CardDescription>
          Gerencie suas fontes de conhecimento para habilitar a funcionalidade de RAG (Retrieval Augmented Generation) em seus agentes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Placeholder para Upload de Arquivos - Tarefa 2 */}
        <div className="mb-6 py-4 border-y">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Fazer Upload de Novos Arquivos</h3>
          <div className="p-6 border-2 border-dashed border-gray-300 rounded-md text-center">
            <p className="text-sm text-muted-foreground">
              (Componente de upload de arquivos aparecerá aqui - Tarefa 5.2)
            </p>
          </div>
        </div>

        {/* Placeholder para Lista de Arquivos da Base de Conhecimento - Tarefa 3 */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Fontes de Conhecimento Indexadas</h3>
          <div className="p-6 border-2 border-dashed border-gray-300 rounded-md text-center">
            <p className="text-sm text-muted-foreground">
              (Lista de arquivos/fontes indexadas aparecerá aqui - Tarefa 5.3)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KnowledgeBaseManager;
