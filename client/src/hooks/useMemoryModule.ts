import { useState, useEffect, useCallback } from 'react';
import { KnowledgeBase, Document, KnowledgeBaseType } from '@/types/memory';
import { memoryService } from '@/api/memoryService';
import { useToast } from '@/components/ui/use-toast';

export function useMemoryModule() {
  // Estado para bases de conhecimento
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [filteredKnowledgeBases, setFilteredKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<KnowledgeBaseType | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado para documentos
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState<KnowledgeBase | null>(null);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  
  // Estado para diálogos
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  
  const { toast } = useToast();

  // Carregar bases de conhecimento
  const loadKnowledgeBases = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await memoryService.getKnowledgeBases();
      setKnowledgeBases(data);
      applyFilters(data, searchTerm, selectedType);
    } catch (error) {
      console.error('Erro ao carregar bases de conhecimento:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as bases de conhecimento.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedType, toast]);

  // Aplicar filtros às bases de conhecimento
  const applyFilters = useCallback((data: KnowledgeBase[], search: string, type: KnowledgeBaseType | 'all') => {
    let filtered = [...data];
    
    // Filtrar por termo de pesquisa
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(kb => 
        kb.name.toLowerCase().includes(searchLower) || 
        kb.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Filtrar por tipo
    if (type !== 'all') {
      filtered = filtered.filter(kb => kb.type === type);
    }
    
    setFilteredKnowledgeBases(filtered);
  }, []);

  // Atualizar filtros quando os critérios mudarem
  useEffect(() => {
    applyFilters(knowledgeBases, searchTerm, selectedType);
  }, [knowledgeBases, searchTerm, selectedType, applyFilters]);

  // Carregar bases de conhecimento na montagem do componente
  useEffect(() => {
    loadKnowledgeBases();
  }, [loadKnowledgeBases]);

  // Carregar documentos de uma base de conhecimento
  const loadDocuments = useCallback(async (knowledgeBaseId: string) => {
    setIsLoadingDocuments(true);
    try {
      const knowledgeBase = knowledgeBases.find(kb => kb.id === knowledgeBaseId) || null;
      setSelectedKnowledgeBase(knowledgeBase);
      
      if (knowledgeBase?.type === KnowledgeBaseType.RAG) {
        const data = await memoryService.getDocumentsByKnowledgeBaseId(knowledgeBaseId);
        setDocuments(data);
      } else {
        setDocuments([]);
      }
    } catch (error) {
      console.error('Erro ao carregar documentos:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os documentos.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingDocuments(false);
    }
  }, [knowledgeBases, toast]);

  // Criar uma nova base de conhecimento
  const createKnowledgeBase = useCallback(async (data: { 
    name: string; 
    description: string; 
    type: KnowledgeBaseType;
    baseModel?: string;
  }) => {
    try {
      const newKnowledgeBase = await memoryService.createKnowledgeBase(data);
      setKnowledgeBases(prev => [...prev, newKnowledgeBase]);
      setCreateDialogOpen(false);
      toast({
        title: 'Sucesso',
        description: 'Base de conhecimento criada com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao criar base de conhecimento:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar a base de conhecimento.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  // Excluir uma base de conhecimento
  const deleteKnowledgeBase = useCallback(async (id: string) => {
    try {
      await memoryService.deleteKnowledgeBase(id);
      setKnowledgeBases(prev => prev.filter(kb => kb.id !== id));
      toast({
        title: 'Sucesso',
        description: 'Base de conhecimento excluída com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao excluir base de conhecimento:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a base de conhecimento.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  // Fazer upload de documentos
  const uploadDocuments = useCallback(async (files: File[]) => {
    if (!selectedKnowledgeBase) return;
    
    try {
      for (const file of files) {
        const newDocument = await memoryService.uploadDocument(selectedKnowledgeBase.id, file);
        setDocuments(prev => [...prev, newDocument]);
      }
      
      setUploadDialogOpen(false);
      toast({
        title: 'Sucesso',
        description: `${files.length} documento(s) enviado(s) com sucesso.`,
      });
      
      // Recarregar a lista de documentos após o upload
      await loadDocuments(selectedKnowledgeBase.id);
    } catch (error) {
      console.error('Erro ao fazer upload de documentos:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível fazer o upload dos documentos.',
        variant: 'destructive',
      });
    }
  }, [selectedKnowledgeBase, toast, loadDocuments]);

  // Excluir um documento
  const deleteDocument = useCallback(async (documentId: string) => {
    try {
      await memoryService.deleteDocument(documentId);
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      toast({
        title: 'Sucesso',
        description: 'Documento excluído com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao excluir documento:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o documento.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  // Manipuladores para diálogos
  const handleAddDocument = useCallback((knowledgeBaseId: string) => {
    const knowledgeBase = knowledgeBases.find(kb => kb.id === knowledgeBaseId);
    setSelectedKnowledgeBase(knowledgeBase || null);
    setUploadDialogOpen(true);
  }, [knowledgeBases]);

  return {
    // Estados
    knowledgeBases: filteredKnowledgeBases,
    documents,
    selectedKnowledgeBase,
    isLoading,
    isLoadingDocuments,
    searchTerm,
    selectedType,
    createDialogOpen,
    uploadDialogOpen,
    
    // Setters
    setSearchTerm,
    setSelectedType,
    setCreateDialogOpen,
    setUploadDialogOpen,
    
    // Ações
    loadKnowledgeBases,
    loadDocuments,
    createKnowledgeBase,
    deleteKnowledgeBase,
    uploadDocuments,
    deleteDocument,
    handleAddDocument,
  };
}