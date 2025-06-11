import type { Meta, StoryObj } from '@storybook/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const meta: Meta<typeof Tabs> = {
  title: 'Components/UI/Tabs',
  component: Tabs,

  decorators: [
    (Story) => (
      <div className="w-[500px]">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Tabs>

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Conta</TabsTrigger>
        <TabsTrigger value="password">Senha</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Conta</CardTitle>
            <CardDescription>
              Altere as configurações da sua conta aqui. Clique em salvar quando
              terminar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="name">
                Nome
              </label>
              <input
                id="name"
                defaultValue="João Silva"
                className="w-full rounded-md border p-2 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="username">
                Nome de usuário
              </label>
              <input
                id="username"
                defaultValue="@joaosilva"
                className="w-full rounded-md border p-2 text-sm"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Salvar alterações</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="password" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Senha</CardTitle>
            <CardDescription>
              Altere sua senha aqui. Depois de salvar, você será desconectado.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="current">
                Senha atual
              </label>
              <input
                id="current"
                type="password"
                className="w-full rounded-md border p-2 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="new">
                Nova senha
              </label>
              <input
                id="new"
                type="password"
                className="w-full rounded-md border p-2 text-sm"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Alterar senha</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  ),
}

export const MultipleTabs: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Visão Geral</TabsTrigger>
        <TabsTrigger value="analytics">Análises</TabsTrigger>
        <TabsTrigger value="reports">Relatórios</TabsTrigger>
        <TabsTrigger value="notifications">Notificações</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="rounded-md border p-4">
        <h3 className="text-lg font-medium">Visão Geral</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Aqui está um resumo das suas atividades recentes.
        </p>
      </TabsContent>
      <TabsContent value="analytics" className="rounded-md border p-4">
        <h3 className="text-lg font-medium">Análises</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Visualize suas métricas e desempenho.
        </p>
      </TabsContent>
      <TabsContent value="reports" className="rounded-md border p-4">
        <h3 className="text-lg font-medium">Relatórios</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Gerencie e visualize relatórios detalhados.
        </p>
      </TabsContent>
      <TabsContent value="notifications" className="rounded-md border p-4">
        <h3 className="text-lg font-medium">Notificações</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Configure suas preferências de notificação.
        </p>
      </TabsContent>
    </Tabs>
  ),
}
