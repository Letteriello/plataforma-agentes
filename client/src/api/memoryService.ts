import { KnowledgeBase, Document, KnowledgeBaseType, KnowledgeBaseConfig } from '@/types/memory';

// Mock data para desenvolvimento inicial
const mockKnowledgeBases: KnowledgeBase[] = [
  {
    id: 'kb-1',
    name: 'Documentação do Produto',
    description: 'Base de conhecimento contendo manuais e documentação técnica do produto',
    type: KnowledgeBaseType.RAG,
    createdAt: '2025-05-20T10:30:00Z',
    updatedAt: '2025-05-28T15:45:00Z',
    documents: 24,
  },
  {
    id: 'kb-2',
    name: 'FAQ Suporte',
    description: 'Perguntas frequentes e respostas para o suporte ao cliente',
    type: KnowledgeBaseType.RAG,
    createdAt: '2025-05-15T08:20:00Z',
    updatedAt: '2025-06-01T14:30:00Z',
    documents: 56,
  },
  {
    id: 'kb-3',
    name: 'Modelo Especializado - Finanças',
    description: 'Modelo fine-tuned para análise financeira e relatórios',
    type: KnowledgeBaseType.FINE_TUNING,
    createdAt: '2025-04-10T09:15:00Z',
    updatedAt: '2025-05-15T11:20:00Z',
    baseModel: 'Gemini Pro',
  },
];

const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    name: 'Manual do Usuário.pdf',
    size: '2.4 MB',
    uploadDate: '2025-05-20T14:30:00Z',
    status: 'Processado' as any,
    knowledgeBaseId: 'kb-1',
    contentType: 'application/pdf',
  },
  {
    id: 'doc-2',
    name: 'Especificações Técnicas.docx',
    size: '1.8 MB',
    uploadDate: '2025-05-22T10:15:00Z',
    status: 'Processado' as any,
    knowledgeBaseId: 'kb-1',
    contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  },
  {
    id: 'doc-3',
    name: 'Guia de Instalação.pdf',
    size: '3.2 MB',
    uploadDate: '2025-05-25T16:45:00Z',
    status: 'Processando' as any,
    knowledgeBaseId: 'kb-1',
    contentType: 'application/pdf',
  },
];

/**
 * Serviço para gerenciar operações relacionadas ao módulo de Memória
 */
export const memoryService = {
  /**
   * Obtém todas as bases de conhecimento
   */
  getKnowledgeBases: async (): Promise<KnowledgeBase[]> => {
    // Simula uma chamada de API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockKnowledgeBases);
      }, 500);
    });
  },

  /**
   * Obtém uma base de conhecimento específica pelo ID
   */
  getKnowledgeBaseById: async (id: string): Promise<KnowledgeBase | null> => {
    // Simula uma chamada de API
    return new Promise((resolve) => {
      setTimeout(() => {
        const knowledgeBase = mockKnowledgeBases.find(kb => kb.id === id) || null;
        resolve(knowledgeBase);
      }, 300);
    });
  },

  /**
   * Cria uma nova base de conhecimento
   */
  createKnowledgeBase: async (knowledgeBase: Omit<KnowledgeBase, 'id' | 'createdAt' | 'updatedAt'>): Promise<KnowledgeBase> => {
    // Simula uma chamada de API
    return new Promise((resolve) => {
      setTimeout(() => {
        const newKnowledgeBase: KnowledgeBase = {
          ...knowledgeBase,
          id: `kb-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockKnowledgeBases.push(newKnowledgeBase);
        resolve(newKnowledgeBase);
      }, 700);
    });
  },

  /**
   * Atualiza uma base de conhecimento existente
   */
  updateKnowledgeBase: async (id: string, updates: Partial<KnowledgeBase>): Promise<KnowledgeBase | null> => {
    // Simula uma chamada de API
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockKnowledgeBases.findIndex(kb => kb.id === id);
        if (index === -1) {
          resolve(null);
          return;
        }
        
        const updatedKnowledgeBase: KnowledgeBase = {
          ...mockKnowledgeBases[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        
        mockKnowledgeBases[index] = updatedKnowledgeBase;
        resolve(updatedKnowledgeBase);
      }, 500);
    });
  },

  /**
   * Exclui uma base de conhecimento
   */
  deleteKnowledgeBase: async (id: string): Promise<boolean> => {
    // Simula uma chamada de API
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockKnowledgeBases.findIndex(kb => kb.id === id);
        if (index === -1) {
          resolve(false);
          return;
        }
        
        mockKnowledgeBases.splice(index, 1);
        resolve(true);
      }, 600);
    });
  },

  /**
   * Obtém todos os documentos de uma base de conhecimento
   */
  getDocumentsByKnowledgeBaseId: async (knowledgeBaseId: string): Promise<Document[]> => {
    // Simula uma chamada de API
    return new Promise((resolve) => {
      setTimeout(() => {
        const documents = mockDocuments.filter(doc => doc.knowledgeBaseId === knowledgeBaseId);
        resolve(documents);
      }, 400);
    });
  },

  /**
   * Faz upload de um documento para uma base de conhecimento
   * Nota: Em uma implementação real, isso envolveria um FormData e upload de arquivo
   */
  uploadDocument: async (knowledgeBaseId: string, file: File): Promise<Document> => {
    // Simula uma chamada de API
    return new Promise((resolve) => {
      setTimeout(() => {
        const newDocument: Document = {
          id: `doc-${Date.now()}`,
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          uploadDate: new Date().toISOString(),
          status: 'Processando' as any,
          knowledgeBaseId,
          contentType: file.type,
        };
        
        mockDocuments.push(newDocument);
        resolve(newDocument);
        
        // Simula o processamento do documento após alguns segundos
        setTimeout(() => {
          const index = mockDocuments.findIndex(doc => doc.id === newDocument.id);
          if (index !== -1) {
            mockDocuments[index].status = 'Processado' as any;
          }
        }, 5000);
      }, 1000);
    });
  },

  /**
   * Exclui um documento
   */
  deleteDocument: async (documentId: string): Promise<boolean> => {
    // Simula uma chamada de API
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockDocuments.findIndex(doc => doc.id === documentId);
        if (index === -1) {
          resolve(false);
          return;
        }
        
        mockDocuments.splice(index, 1);
        resolve(true);
      }, 500);
    });
  },

  /**
   * Obtém a configuração de uma base de conhecimento
   */
  getKnowledgeBaseConfig: async (knowledgeBaseId: string): Promise<KnowledgeBaseConfig | null> => {
    // Simula uma chamada de API
    return new Promise((resolve) => {
      setTimeout(() => {
        const knowledgeBase = mockKnowledgeBases.find(kb => kb.id === knowledgeBaseId);
        if (!knowledgeBase) {
          resolve(null);
          return;
        }
        
        if (knowledgeBase.type === KnowledgeBaseType.RAG) {
          resolve({
            id: knowledgeBaseId,
            type: KnowledgeBaseType.RAG,
            ragParams: {
              chunkSize: 1000,
              chunkOverlap: 200,
              embeddingModel: 'text-embedding-3-small',
            },
          });
        } else {
          resolve({
            id: knowledgeBaseId,
            type: KnowledgeBaseType.FINE_TUNING,
            fineTuningParams: {
              baseModel: knowledgeBase.baseModel || 'Gemini Pro',
              epochs: 3,
              batchSize: 4,
              learningRate: 0.0001,
            },
          });
        }
      }, 400);
    });
  },

  /**
   * Atualiza a configuração de uma base de conhecimento
   */
  updateKnowledgeBaseConfig: async (config: KnowledgeBaseConfig): Promise<KnowledgeBaseConfig> => {
    // Simula uma chamada de API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(config);
      }, 600);
    });
  },
};