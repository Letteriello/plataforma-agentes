import type { Meta, StoryObj } from "@storybook/react"
import { Separator } from "@/components/ui/separator"

const meta: Meta<typeof Separator> = {
  title: "Components/UI/Separator",
  component: Separator,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl p-4">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Separator>

export const Default: Story = {
  render: () => (
    <div>
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Nexus Design System</h4>
        <p className="text-sm text-muted-foreground">
          Componentes acessíveis e personalizáveis para construir interfaces ricas.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Documentação</div>
        <Separator orientation="vertical" />
        <div>Componentes</div>
        <Separator orientation="vertical" />
        <div>Exemplos</div>
      </div>
    </div>
  ),
}

export const WithText: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Título da Seção</h2>
        <p className="text-sm text-muted-foreground">
          Descrição da seção com algumas informações adicionais.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex items-center">
        <span className="whitespace-nowrap text-sm text-muted-foreground">
          Continuar lendo
        </span>
        <Separator className="mx-4" />
      </div>
    </div>
  ),
}

export const InCard: Story = {
  render: () => (
    <div className="rounded-lg border p-6 shadow-sm">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Detalhes do Pedido</h3>
        <p className="text-sm text-muted-foreground">
          Confira os itens do seu pedido
        </p>
      </div>
      <Separator className="my-4" />
      <div className="grid gap-4">
        {["Produto 1", "Produto 2", "Produto 3"].map((product, i) => (
          <div key={i} className="flex items-center justify-between">
            <span>{product}</span>
            <span className="font-medium">R$ 99,90</span>
          </div>
        ))}
      </div>
      <Separator className="my-4" />
      <div className="flex justify-between font-medium">
        <span>Total</span>
        <span>R$ 299,70</span>
      </div>
    </div>
  ),
}
