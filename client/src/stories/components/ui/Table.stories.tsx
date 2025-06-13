import type { Meta, StoryObj } from '@storybook/react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const meta: Meta<typeof Table> = {
  title: 'Components/UI/Table',
  component: Table,

  decorators: [
    (Story) => (
      <div className="w-full max-w-4xl">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Table>

const invoices = [
  {
    invoice: 'INV001',
    paymentStatus: 'Pago',
    totalAmount: 'R$ 2.500,00',
    paymentMethod: 'Cartão de Crédito',
    status: 'success',
  },
  {
    invoice: 'INV002',
    paymentStatus: 'Pendente',
    totalAmount: 'R$ 1.200,00',
    paymentMethod: 'Boleto',
    status: 'pending',
  },
  {
    invoice: 'INV003',
    paymentStatus: 'Não Pago',
    totalAmount: 'R$ 3.200,00',
    paymentMethod: 'Transferência',
    status: 'error',
  },
  {
    invoice: 'INV004',
    paymentStatus: 'Pago',
    totalAmount: 'R$ 4.600,00',
    paymentMethod: 'PIX',
    status: 'success',
  },
  {
    invoice: 'INV005',
    paymentStatus: 'Reembolsado',
    totalAmount: 'R$ 1.800,00',
    paymentMethod: 'Cartão de Crédito',
    status: 'warning',
  },
]

const statusVariantMap = {
  success: 'success',
  pending: 'warning',
  error: 'destructive',
  warning: 'outline',
}

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>Lista de faturas recentes</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Fatura</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Método</TableHead>
          <TableHead className="text-right">Valor</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>
              <Badge
                variant={
                  statusVariantMap[
                    invoice.status as keyof typeof statusVariantMap
                  ]
                }
              >
                {invoice.paymentStatus}
              </Badge>
            </TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm">
                Ver detalhes
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}

export const WithHeader: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Faturas</h2>
        <Button>Adicionar Fatura</Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fatura</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Método</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.slice(0, 3).map((invoice) => (
              <TableRow key={invoice.invoice}>
                <TableCell className="font-medium">{invoice.invoice}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      statusVariantMap[
                        invoice.status as keyof typeof statusVariantMap
                      ]
                    }
                  >
                    {invoice.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell>{invoice.paymentMethod}</TableCell>
                <TableCell className="text-right">
                  {invoice.totalAmount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  ),
}
