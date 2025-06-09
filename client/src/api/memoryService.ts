import apiClient from '../apiClient';
import { KnowledgeBase, Document, KnowledgeBaseType, KnowledgeBaseConfig } from '@/types/memory';

// Interface for search results, assuming it might be used by a search function
export interface SearchResult {
  id: string; // ID of the search result item, could be a chunk ID
  documentId: string; // ID of the source document
  knowledgeBaseId: string; // ID of the knowledge base
  content: string; // The actual text content of the search result
  score: number; // Relevance score
  metadata?: Record<string, any>; // Optional metadata
}

/**
 * Serviço para gerenciar operações relacionadas ao módulo de Memória
 */
export const memoryService = {
  /**
   * Obtém todas as bases de conhecimento
   */
  async getKnowledgeBases(): Promise<KnowledgeBase[]> {
    const response = await apiClient.get<KnowledgeBase[]>('/knowledge-bases');
    return response.data;
  },

  /**
   * Obtém uma base de conhecimento específica pelo ID
   */
  async getKnowledgeBaseById(id: string): Promise<KnowledgeBase | null> {
    try {
      const response = await apiClient.get<KnowledgeBase>(`/knowledge-bases/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Cria uma nova base de conhecimento
   */
  async createKnowledgeBase(knowledgeBaseData: Omit<KnowledgeBase, 'id' | 'createdAt' | 'updatedAt' | 'documents'>): Promise<KnowledgeBase> {
    // 'documents' count is usually managed by backend based on actual documents
    const response = await apiClient.post<KnowledgeBase>('/knowledge-bases', knowledgeBaseData);
    return response.data;
  },

  /**
   * Atualiza uma base de conhecimento existente
   */
  async updateKnowledgeBase(id: string, updates: Partial<Omit<KnowledgeBase, 'id' | 'createdAt' | 'updatedAt' | 'documents' >>): Promise<KnowledgeBase | null> {
     // 'documents' count should not be directly updatable by client in this way
    try {
      const response = await apiClient.put<KnowledgeBase>(`/knowledge-bases/${id}`, updates);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Exclui uma base de conhecimento
   */
  async deleteKnowledgeBase(id: string): Promise<void> {
    await apiClient.delete(`/knowledge-bases/${id}`);
  },

  /**
   * Obtém todos os documentos de uma base de conhecimento
   */
  async fetchDocuments(knowledgeBaseId: string): Promise<Document[]> {
    const response = await apiClient.get<Document[]>(`/knowledge-bases/${knowledgeBaseId}/documents`);
    return response.data;
  },

  /**
   * Faz upload de um documento para uma base de conhecimento
   */
  async uploadDocument(knowledgeBaseId: string, file: File, metadata?: Record<string, any>): Promise<Document> {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }

    const response = await apiClient.post<Document>(
      `/knowledge-bases/${knowledgeBaseId}/documents`,
      formData,
      {
        headers: {
          // 'Content-Type': 'multipart/form-data' is usually set automatically by browsers/axios with FormData
        },
      }
    );
    return response.data;
  },

  /**
   * Exclui um documento
   */
  async deleteDocument(knowledgeBaseId: string, documentId: string): Promise<void> {
    await apiClient.delete(`/knowledge-bases/${knowledgeBaseId}/documents/${documentId}`);
  },

  /**
   * Busca em uma base de conhecimento específica
   */
  async searchKnowledgeBase(knowledgeBaseId: string, query: string, topK?: number): Promise<SearchResult[]> {
    const response = await apiClient.get<SearchResult[]>(`/knowledge-bases/${knowledgeBaseId}/search`, {
      params: { query, topK },
    });
    return response.data;
  },

  /**
   * Obtém a configuração de uma base de conhecimento
   */
  async getKnowledgeBaseConfig(knowledgeBaseId: string): Promise<KnowledgeBaseConfig | null> {
     try {
      const response = await apiClient.get<KnowledgeBaseConfig>(`/knowledge-bases/${knowledgeBaseId}/config`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Atualiza a configuração de uma base de conhecimento
   */
  async updateKnowledgeBaseConfig(knowledgeBaseId: string, config: Partial<KnowledgeBaseConfig>): Promise<KnowledgeBaseConfig> {
    // Config ID is usually the same as KB ID or managed by backend.
    // Here, assuming config update is by KB ID and the payload is partial config.
    const response = await apiClient.put<KnowledgeBaseConfig>(`/knowledge-bases/${knowledgeBaseId}/config`, config);
    return response.data;
  },
};