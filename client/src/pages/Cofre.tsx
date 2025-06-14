import { PlusCircle, Trash2 } from 'lucide-react';
import { FormEvent,useEffect, useState } from 'react';

import { createSecret, deleteSecret, listSecrets } from '@/features/secrets-vault/services/secretService';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import type { Secret, SecretCreate } from '@/types/common';

export function CofrePage() {
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSecret, setNewSecret] = useState<SecretCreate>({ name: '', value: '' });
  const { toast } = useToast();

  const fetchSecrets = async () => {
    try {
      setIsLoading(true);
      const data = await listSecrets();
      setSecrets(data);
      setError(null);
    } catch {
      const errorMessage = 'Falha ao carregar as credenciais.';
      setError(errorMessage);
      toast({ variant: 'destructive', title: 'Erro', description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSecrets();
  }, []);

  const handleCreateSecret = async (e: FormEvent) => {
    e.preventDefault();
    if (!newSecret.name || !newSecret.value) {
        toast({ variant: 'destructive', title: 'Erro', description: 'Nome e valor não podem ser vazios.' });
        return;
    }
    try {
      await createSecret(newSecret);
      toast({ title: 'Sucesso', description: 'Credencial salva com segurança.' });
      setNewSecret({ name: '', value: '' });
      setIsDialogOpen(false);
      fetchSecrets(); // Refresh list
    } catch {
      toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível salvar a credencial.' });
    }
  };

  const handleDeleteSecret = async (secretName: string) => {
    if (!confirm(`Tem certeza que deseja excluir a credencial "${secretName}"?`)) return;

    try {
      await deleteSecret(secretName);
      toast({ title: 'Sucesso', description: `Credencial "${secretName}" excluída.` });
      fetchSecrets(); // Refresh list
    } catch {
      toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível excluir a credencial.' });
    }
  };

  const renderTableContent = () => {
    if (isLoading) {
      return Array.from({ length: 3 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-6 w-full" /></TableCell>
          <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
        </TableRow>
      ));
    }

    if (error) {
      return <TableRow><TableCell colSpan={2} className="text-center text-red-500">{error}</TableCell></TableRow>;
    }

    if (secrets.length === 0) {
        return <TableRow><TableCell colSpan={2} className="text-center">Nenhuma credencial encontrada.</TableCell></TableRow>;
    }

    return secrets.map((secret) => (
      <TableRow key={secret.name}>
        <TableCell className="font-medium">{secret.name}</TableCell>
        <TableCell className="text-right">
          <Button variant="ghost" size="icon" onClick={() => handleDeleteSecret(secret.name)}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="container mx-auto p-6">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cofre de Credenciais</h1>
          <p className="text-muted-foreground mt-2">Gerencie suas chaves de API e outras credenciais de forma segura.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><PlusCircle className="mr-2 h-4 w-4" />Adicionar Credencial</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleCreateSecret}>
              <DialogHeader>
                <DialogTitle>Adicionar Nova Credencial</DialogTitle>
                <DialogDescription>As credenciais salvas aqui podem ser usadas pelos seus agentes.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Nome</Label>
                  <Input id="name" value={newSecret.name} onChange={(e) => setNewSecret({ ...newSecret, name: e.target.value })} placeholder="Ex: OPENAI_API_KEY" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="value" className="text-right">Valor</Label>
                  <Input id="value" type="password" value={newSecret.value} onChange={(e) => setNewSecret({ ...newSecret, value: e.target.value })} placeholder="Cole sua chave aqui" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Credenciais Salvas</CardTitle>
          <CardDescription>Estas são as credenciais atualmente armazenadas no cofre.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderTableContent()}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
