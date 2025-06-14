import { Meta, StoryObj } from '@storybook/react'
import React from 'react'

const TypographyShowcase = () => (
  <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none">
    <h1>Typography</h1>

    <section>
      <h2>Font Families</h2>
      <p>
        These are defined in <code>client/src/theme/index.ts</code> and utilized
        by Tailwind.
      </p>
      <p style={{ fontFamily: 'Inter, sans-serif' }}>
        <strong>Sans Serif (Inter):</strong> The quick brown fox jumps over the
        lazy dog.
      </p>
      <p style={{ fontFamily: 'JetBrains Mono, monospace' }}>
        <strong>Monospace (JetBrains Mono):</strong> The quick brown fox jumps
        over the lazy dog. 0123456789
      </p>
    </section>

    <section>
      <h2>
        Heading Levels (via <code>@tailwindcss/typography</code> plugin)
      </h2>
      <h1>Heading 1</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </p>
      <h2>Heading 2</h2>
      <p>
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
        ut aliquip ex ea commodo consequat.
      </p>
      <h3>Heading 3</h3>
      <p>
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur.
      </p>
      <h4>Heading 4</h4>
      <p>
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
        officia deserunt mollit anim id est laborum.
      </p>
      <h5>Heading 5</h5>
      <p>
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem
        accusantium doloremque laudantium.
      </p>
      <h6>Heading 6</h6>
      <p>
        Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
        fugit.
      </p>
    </section>

    <section>
      <h2>Font Sizes (Tailwind Classes)</h2>
      <p className="text-xs">text-xs: The quick brown fox...</p>
      <p className="text-sm">text-sm: The quick brown fox...</p>
      <p className="text-base">text-base: The quick brown fox...</p>
      <p className="text-lg">text-lg: The quick brown fox...</p>
      <p className="text-xl">text-xl: The quick brown fox...</p>
      <p className="text-2xl">text-2xl: The quick brown fox...</p>
      <p className="text-3xl">text-3xl: The quick brown fox...</p>
      <p className="text-4xl">text-4xl: The quick brown fox...</p>
      <p className="text-5xl">text-5xl: The quick brown fox...</p>
      <p className="text-6xl">text-6xl: The quick brown fox...</p>
    </section>

    <section>
      <h2>Font Weights (Tailwind Classes)</h2>
      <p className="font-thin">font-thin: The quick brown fox...</p>
      <p className="font-extralight">font-extralight: The quick brown fox...</p>
      <p className="font-light">font-light: The quick brown fox...</p>
      <p className="font-normal">font-normal: The quick brown fox...</p>
      <p className="font-medium">font-medium: The quick brown fox...</p>
      <p className="font-semibold">font-semibold: The quick brown fox...</p>
      <p className="font-bold">font-bold: The quick brown fox...</p>
      <p className="font-extrabold">font-extrabold: The quick brown fox...</p>
      <p className="font-black">font-black: The quick brown fox...</p>
    </section>

    <section>
      <h2>
        Other Typographic Elements (via <code>@tailwindcss/typography</code>{' '}
        plugin)
      </h2>
      <p>
        This is a paragraph with a <a href="https://example.com">link</a>. And some{' '}
        <strong>bold text</strong> and <em>italic text</em>.
      </p>
      <blockquote>
        This is a blockquote. It&apos;s typically used for highlighting a section of
        text from another source.
      </blockquote>
      <ul>
        <li>Unordered list item 1</li>
        <li>
          Unordered list item 2
          <ul>
            <li>Nested item 2.1</li>
            <li>Nested item 2.2</li>
          </ul>
        </li>
      </ul>
      <ol>
        <li>Ordered list item 1</li>
        <li>
          Ordered list item 2
          <ol>
            <li>Nested item 2.1</li>
            <li>Nested item 2.2</li>
          </ol>
        </li>
      </ol>
      <code>This is an inline code snippet.</code>
      <pre>
        {`// This is a preformatted code block.
function greet(name) {
  return \`Hello, \${name}!\`;
}`}
      </pre>
    </section>
  </div>
)

const meta: Meta<typeof TypographyShowcase> = {
  title: 'Tokens/Typography',
  component: TypographyShowcase,
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
