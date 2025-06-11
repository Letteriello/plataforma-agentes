import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';

// Mock data for credentials
const mockCredentials = [
  {
    id: 'cred-1',
    name: 'OpenAI API Key',
    type: 'API Key',
    createdAt: '2023-10-26',
    lastUsed: '2023-11-15',
  },
  {
    id: 'cred-2',
    name: 'Google Maps API Key',
    type: 'API Key',
    createdAt: '2023-09-10',
    lastUsed: '2023-11-20',
  },
];

export function CofrePage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="container mx-auto p-6">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cofre de Credenciais</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie suas chaves de API e outras credenciais de forma segura.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Credencial
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Credencial</DialogTitle>
              <DialogDescription>
                As credenciais salvas aqui podem ser usadas pelos seus agentes.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="name"
                  placeholder="Ex: Minha Chave OpenAI"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="value" className="text-right">
                  Valor
                </Label>
                <Input
                  id="value"
                  type="password"
                  placeholder="Cole sua chave aqui"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={() => setOpen(false)}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Credenciais Salvas</CardTitle>
          <CardDescription>
            Estas são as credenciais atualmente armazenadas no cofre.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Criada em</TableHead>
                <TableHead>Último Uso</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCredentials.map((credential) => (
                <TableRow key={credential.id}>
                  <TableCell className="font-medium">{credential.name}</TableCell>
                  <TableCell>{credential.type}</TableCell>
                  <TableCell>{credential.createdAt}</TableCell>
                  <TableCell>{credential.lastUsed}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Editar</Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">Excluir</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
