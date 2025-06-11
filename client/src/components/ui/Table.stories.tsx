import type { Meta, StoryObj } from '@storybook/react'
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from './table' // Import all necessary Table components

const meta = {
  title: 'UI/Table',
  component: Table, // Main Table component
  parameters: {
    layout: 'padded', // Allow table to take space
  },

} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

const invoices = [
  {
    invoice: 'INV001',
    paymentStatus: 'Paid',
    totalAmount: '$250.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV002',
    paymentStatus: 'Pending',
    totalAmount: '$150.00',
    paymentMethod: 'PayPal',
  },
  {
    invoice: 'INV003',
    paymentStatus: 'Unpaid',
    totalAmount: '$350.00',
    paymentMethod: 'Bank Transfer',
  },
  {
    invoice: 'INV004',
    paymentStatus: 'Paid',
    totalAmount: '$450.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV005',
    paymentStatus: 'Paid',
    totalAmount: '$550.00',
    paymentMethod: 'PayPal',
  },
  {
    invoice: 'INV006',
    paymentStatus: 'Pending',
    totalAmount: '$200.00',
    paymentMethod: 'Bank Transfer',
  },
  {
    invoice: 'INV007',
    paymentStatus: 'Unpaid',
    totalAmount: '$300.00',
    paymentMethod: 'Credit Card',
  },
]

export const Default: Story = {
  render: (args) => (
    <Table {...args}>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
  args: {},
}

export const Striped: Story = {
  render: (args) => (
    <Table {...args}>
      <TableCaption>User Data (Striped)</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="text-right">Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[
          {
            id: 'USR001',
            name: 'Alice Wonderland',
            email: 'alice@example.com',
            role: 'Admin',
          },
          {
            id: 'USR002',
            name: 'Bob The Builder',
            email: 'bob@example.com',
            role: 'Editor',
          },
          {
            id: 'USR003',
            name: 'Charlie Brown',
            email: 'charlie@example.com',
            role: 'Viewer',
          },
          {
            id: 'USR004',
            name: 'Diana Prince',
            email: 'diana@example.com',
            role: 'Editor',
          },
        ].map((user, index) => (
          <TableRow
            key={user.id}
            className={index % 2 === 0 ? '' : 'bg-muted/25'}
          >
            {' '}
            {/* Example striping */}
            <TableCell className="font-medium">{user.id}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell className="text-right">{user.role}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
  args: {},
}

export const NoFooterOrCaption: Story = {
  render: (args) => (
    <Table {...args}>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead className="text-right">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[
          { product: 'Laptop Pro', sku: 'LP-001', price: '$1200.00' },
          { product: 'Mouse Pad XL', sku: 'MP-XL-003', price: '$25.00' },
          { product: 'Keyboard K380', sku: 'KB-K380-007', price: '$75.00' },
        ].map((item) => (
          <TableRow key={item.sku}>
            <TableCell className="font-medium">{item.product}</TableCell>
            <TableCell>{item.sku}</TableCell>
            <TableCell className="text-right">{item.price}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
  args: {},
}

export const EmptyTable: Story = {
  render: (args) => (
    <Table {...args}>
      <TableCaption>No data available.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Column A</TableHead>
          <TableHead>Column B</TableHead>
          <TableHead className="text-right">Column C</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell
            colSpan={3}
            className="text-center text-muted-foreground h-24"
          >
            No results found.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
  args: {},
}
