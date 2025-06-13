import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Users, Wrench } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Bem-vindo à Plataforma ai.da</h1>
        <p className="text-lg text-muted-foreground mt-2">Sua central de controle para criar, gerenciar e implantar agentes de IA.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Link to="/agents">
          <Card className="hover:shadow-lg hover:border-primary transition-all duration-200 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold">Gerenciar Agentes</CardTitle>
              <Users className="h-8 w-8 text-primary" />
            </CardHeader>
            <CardContent>
              <CardDescription>Crie, configure e monitore seus agentes de inteligência artificial. Defina seus papéis, capacidades e ferramentas.</CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link to="/tools">
          <Card className="hover:shadow-lg hover:border-primary transition-all duration-200 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold">Gerenciar Ferramentas</CardTitle>
              <Wrench className="h-8 w-8 text-primary" />
            </CardHeader>
            <CardContent>
              <CardDescription>Adicione e configure as ferramentas que seus agentes podem utilizar para interagir com APIs e executar tarefas.</CardDescription>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
