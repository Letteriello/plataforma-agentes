import React from 'react'
import { Meta, StoryObj } from '@storybook/react'

const spacingTokens = [
  { name: '0', value: '0px' },
  { name: 'px', value: '1px' },
  { name: '0.5', value: '0.125rem' }, // 2px
  { name: '1', value: '0.25rem' }, // 4px
  { name: '1.5', value: '0.375rem' }, // 6px
  { name: '2', value: '0.5rem' }, // 8px
  { name: '2.5', value: '0.625rem' }, // 10px
  { name: '3', value: '0.75rem' }, // 12px
  { name: '3.5', value: '0.875rem' }, // 14px
  { name: '4', value: '1rem' }, // 16px
  { name: '5', value: '1.25rem' }, // 20px
  { name: '6', value: '1.5rem' }, // 24px
  { name: '7', value: '1.75rem' }, // 28px
  { name: '8', value: '2rem' }, // 32px
  { name: '9', value: '2.25rem' }, // 36px
  { name: '10', value: '2.5rem' }, // 40px
  { name: '11', value: '2.75rem' }, // 44px
  { name: '12', value: '3rem' }, // 48px
  { name: '14', value: '3.5rem' }, // 56px
  { name: '16', value: '4rem' }, // 64px
  { name: '18', value: '4.5rem' }, // Custom
  { name: '20', value: '5rem' }, // 80px
  { name: '22', value: '5.5rem' }, // Custom
  { name: '24', value: '6rem' }, // 96px
  { name: '26', value: '6.5rem' }, // Custom
  { name: '28', value: '7rem' }, // 112px
  { name: '30', value: '7.5rem' }, // Custom
  { name: '32', value: '8rem' }, // 128px
  { name: '36', value: '9rem' }, // 144px
  { name: '40', value: '10rem' }, // 160px
  { name: '44', value: '11rem' }, // 176px
  { name: '48', value: '12rem' }, // 192px
  { name: '52', value: '13rem' }, // 208px
  { name: '56', value: '14rem' }, // 224px
  { name: '60', value: '15rem' }, // 240px
  { name: '64', value: '16rem' }, // 256px
  { name: '72', value: '18rem' }, // 288px
  { name: '80', value: '20rem' }, // 320px
  { name: '96', value: '24rem' }, // 384px
]

const SpacingBlock = ({ name, value }: { name: string; value: string }) => (
  <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
    <div style={{ width: '120px', color: '#555' }}>
      <span style={{ fontWeight: 'bold' }}>{name}</span> ({value})
    </div>
    <div
      style={{
        width: value,
        height: '20px',
        backgroundColor: 'hsl(var(--primary))',
        opacity: 0.7,
      }}
    />
  </div>
)

const SpacingVisualizer = () => (
  <div>
    <h1>Spacing Units</h1>
    <p>
      This visualizes Tailwind CSS spacing tokens, including defaults and custom
      extensions from <code>tailwind.config.js</code>.
    </p>
    <p>
      The value in parenthesis is the actual size (e.g. 1rem = 16px if base font
      size is 16px).
    </p>
    <br />
    {spacingTokens.map((token) => (
      <SpacingBlock key={token.name} name={token.name} value={token.value} />
    ))}
  </div>
)

const meta: Meta<typeof SpacingVisualizer> = {
  title: 'Tokens/Spacing',
  component: SpacingVisualizer,
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
