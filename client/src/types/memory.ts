/**
 * Defines the type of a knowledge base.
 */
export enum KnowledgeBaseType {
  RAG = 'RAG',
  FINE_TUNING = 'Fine-Tuning',
}

/**
 * DTO para transferência de dados da base de conhecimento entre backend e frontend.
 * Use este tipo para contratos de API e serviços.
 */
export interface KnowledgeBaseDTO {
  id: string;
  name: string;
  description: string;
  type: KnowledgeBaseType;
  createdAt: string;
  updatedAt: string;
  status?: 'active' | 'processing' | 'error';
}

/**
 * Represents a knowledge base.
 */
export interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  type: KnowledgeBaseType;
  createdAt: string;
  updatedAt: string;
  documents?: number;
  baseModel?: string;
  status?: 'active' | 'processing' | 'error';
}

/**
 * Defines the status of a document during processing.
 */
export enum DocumentStatus {
  PROCESSING = 'Processando',
  PROCESSED = 'Processado',
  ERROR = 'Erro',
}

/**
 * Represents a document within a knowledge base.
 */
export interface Document {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
  status: DocumentStatus;
  knowledgeBaseId: string;
  contentType?: string;
  vectorCount?: number;
  errorMessage?: string;
}

/**
 * Defines the parameters for a RAG configuration.
 */
export interface RAGParams {
  chunkSize: number;
  chunkOverlap: number;
  embeddingModel: string;
}

/**
 * Defines the parameters for a Fine-Tuning configuration.
 */
export interface FineTuningParams {
  baseModel: string;
  epochs: number;
  batchSize: number;
  learningRate: number;
}

/**
 * Represents the configuration of a knowledge base.
 */
export interface KnowledgeBaseConfig {
  id: string;
  type: KnowledgeBaseType;
  ragParams?: RAGParams;
  fineTuningParams?: FineTuningParams;
}

/**
 * Represents a search result from a knowledge base.
 */
export interface SearchResult {
  id: string;
  documentId: string;
  knowledgeBaseId: string;
  content: string;
  score: number;
  metadata?: Record<string, unknown>;
}
