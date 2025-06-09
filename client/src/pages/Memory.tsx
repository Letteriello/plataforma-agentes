import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, FileText, Database, Upload, Settings, Trash2 } from 'lucide-react';

// Mock data para bases de conhecimento
const mockKnowledgeBases = [
  {
    id: 'kb-1',
    name: 'Documentação do Produto',
    description: 'Base de conhecimento contendo manuais e documentação técnica do produto',
    type: 'RAG',
    documents: 24,
    lastUpdated: '2025-05-28',
  },
  {
    id: 'kb-2',
    name: 'FAQ Suporte',
    description: 'Perguntas frequentes e respostas para o suporte ao cliente',
    type: 'RAG',
    documents: 56,
    lastUpdated: '2025-06-01',
  },
  {
    id: 'kb-3',
    name: 'Modelo Especializado - Finanças',
    description: 'Modelo fine-tuned para análise financeira e relatórios',
    type: 'Fine-Tuning',
    baseModel: 'Gemini Pro',
    lastUpdated: '2025-05-15',
  },
];

// Mock data para documentos
const mockDocuments = [
  {
    id: 'doc-1',
    name: 'Manual do Usuário.pdf',
    size: '2.4 MB',
    uploadDate: '2025-05-20',
    status: 'Processado',
  },
  {
    id: 'doc-2',
    name: 'Especificações Técnicas.docx',
    size: '1.8 MB',
    uploadDate: '2025-05-22',
    status: 'Processado',
  },
  {
    id: 'doc-3',
    name: 'Guia de Instalação.pdf',
    size: '3.2 MB',
    uploadDate: '2025-05-25',
    status: 'Processando',
  },
];

export default function MemoriaPage() {
  const [activeTab, setActiveTab] = useState('knowledge-bases');
  const [searchQuery, setSearchQuery] = useState('');
  const [newKbDialogOpen, setNewKbDialogOpen] = useState(false);
  const [newDocDialogOpen, setNewDocDialogOpen] = useState(false);
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState<string | null>(null);

  // Filtrar bases de conhecimento com base na pesquisa
  const filteredKnowledgeBases = mockKnowledgeBases.filter(kb =>
    kb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    kb.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtrar documentos com base na pesquisa
  const filteredDocuments = mockDocuments.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Estado para nova base de conhecimento
  const [newKnowledgeBase, setNewKnowledgeBase] = useState({
    name: '',
    description: '',
    type: 'RAG',
  });

  // Função para criar nova base de conhecimento
  const handleCreateKnowledgeBase = () => {
    // Aqui seria implementada a lógica para criar uma nova base de conhecimento
    console.log('Criando nova base de conhecimento:', newKnowledgeBase);
    setNewKbDialogOpen(false);
    setNewKnowledgeBase({ name: '', description: '', type: 'RAG' });
  };

  // Função para fazer upload de documento
  const handleUploadDocument = () => {
    // Aqui seria implementada a lógica para fazer upload de um documento
    console.log('Fazendo upload de documento para a base:', selectedKnowledgeBase);
    setNewDocDialogOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Memória</h1>
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={newKbDialogOpen} onOpenChange={setNewKbDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Base de Conhecimento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Base de Conhecimento</DialogTitle>
                <DialogDescription>
                  Crie uma nova base de conhecimento para armazenar e organizar informações que seus agentes poderão acessar.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="kb-name">Nome</Label>
                  <Input
                    id="kb-name"
                    value={newKnowledgeBase.name}
                    onChange={(e) => setNewKnowledgeBase({ ...newKnowledgeBase, name: e.target.value })}
                    placeholder="Ex: Documentação do Produto"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kb-description">Descrição</Label>
                  <Textarea
                    id="kb-description"
                    value={newKnowledgeBase.description}
                    onChange={(e) => setNewKnowledgeBase({ ...newKnowledgeBase, description: e.target.value })}
                    placeholder="Descreva o propósito desta base de conhecimento"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kb-type">Tipo</Label>
                  <Select
                    value={newKnowledgeBase.type}
                    onValueChange={(value) => setNewKnowledgeBase({ ...newKnowledgeBase, type: value })}
                  >
                    <SelectTrigger id="kb-type">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RAG">RAG (Retrieval-Augmented Generation)</SelectItem>
                      <SelectItem value="Fine-Tuning">Fine-Tuning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewKbDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleCreateKnowledgeBase} disabled={!newKnowledgeBase.name.trim()}>Criar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="knowledge-bases">Bases de Conhecimento</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="knowledge-bases" className="space-y-4">
          {filteredKnowledgeBases.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredKnowledgeBases.map((kb) => (
                <Card key={kb.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{kb.name}</CardTitle>
                        <CardDescription className="mt-1 line-clamp-2">{kb.description}</CardDescription>
                      </div>
                      <Badge variant={kb.type === 'RAG' ? 'default' : 'secondary'}>
                        {kb.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="text-sm text-muted-foreground">
                      {kb.type === 'RAG' ? (
                        <div className="flex items-center">
                          <FileText className="mr-2 h-4 w-4" />
                          <span>{kb.documents} documentos</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Database className="mr-2 h-4 w-4" />
                          <span>Base: {kb.baseModel}</span>
                        </div>
                      )}
                      <div className="mt-1">Última atualização: {kb.lastUpdated}</div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <div className="flex justify-between w-full">
                      {kb.type === 'RAG' && (
                        <Dialog open={newDocDialogOpen} onOpenChange={setNewDocDialogOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedKnowledgeBase(kb.id)}
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Adicionar Documento
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Adicionar Documento</DialogTitle>
                              <DialogDescription>
                                Faça upload de um documento para a base de conhecimento "{kb.name}".
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="file-upload">Arquivo</Label>
                                <Input id="file-upload" type="file" />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setNewDocDialogOpen(false)}>Cancelar</Button>
                              <Button onClick={handleUploadDocument}>Fazer Upload</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                      <Button variant="ghost" size="sm">
                        <Settings className="mr-2 h-4 w-4" />
                        Configurar
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Database className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Nenhuma base de conhecimento encontrada</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchQuery ? 'Tente ajustar sua pesquisa' : 'Crie uma nova base de conhecimento para começar'}
              </p>
              <Button className="mt-4" onClick={() => setNewKbDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Base de Conhecimento
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documentos</CardTitle>
              <CardDescription>
                Documentos carregados em suas bases de conhecimento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tamanho</TableHead>
                    <TableHead>Data de Upload</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.name}</TableCell>
                      <TableCell>{doc.size}</TableCell>
                      <TableCell>{doc.uploadDate}</TableCell>
                      <TableCell>
                        <Badge variant={doc.status === 'Processado' ? 'default' : 'secondary'}>
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredDocuments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        Nenhum documento encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}