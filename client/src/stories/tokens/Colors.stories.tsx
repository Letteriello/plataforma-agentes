import React from 'react';
import { Meta, StoryObj } from '@storybook/react';

const tailwindColors = {
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  primary: 'hsl(var(--primary))',
  'primary-foreground': 'hsl(var(--primary-foreground))',
  secondary: 'hsl(var(--secondary))',
  'secondary-foreground': 'hsl(var(--secondary-foreground))',
  destructive: 'hsl(var(--destructive))',
  'destructive-foreground': 'hsl(var(--destructive-foreground))',
  muted: 'hsl(var(--muted))',
  'muted-foreground': 'hsl(var(--muted-foreground))',
  accent: 'hsl(var(--accent))',
  'accent-foreground': 'hsl(var(--accent-foreground))',
  popover: 'hsl(var(--popover))',
  'popover-foreground': 'hsl(var(--popover-foreground))',
  card: 'hsl(var(--card))',
  'card-foreground': 'hsl(var(--card-foreground))',
  border: 'hsl(var(--border))',
  input: 'hsl(var(--input))',
  ring: 'hsl(var(--ring))',
  success: 'hsl(var(--success))',
  'success-foreground': 'hsl(var(--success-foreground))',
  warning: 'hsl(var(--warning))',
  'warning-foreground': 'hsl(var(--warning-foreground))',
  info: 'hsl(var(--info))',
  'info-foreground': 'hsl(var(--info-foreground))',
};

const ColorSwatch = ({ name, color }: { name: string; color: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
    <div
      style={{
        width: '50px',
        height: '50px',
        backgroundColor: color,
        border: '1px solid #ccc',
        marginRight: '1rem',
      }}
    />
    <div>
      <div style={{ fontWeight: 'bold' }}>{name}</div>
      <div>{color}</div>
    </div>
  </div>
);

const ColorPalette = () => (
  <div>
    <h1>Tailwind CSS Colors</h1>
    <p>These colors are defined in <code>tailwind.config.js</code> using CSS variables.</p>
    {Object.entries(tailwindColors).map(([name, color]) => (
      <ColorSwatch key={name} name={name} color={color} />
    ))}
  </div>
);

const meta: Meta<typeof ColorPalette> = {
  title: 'Tokens/Colors',
  component: ColorPalette,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
