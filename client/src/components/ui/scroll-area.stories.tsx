import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { ScrollArea, ScrollBar } from './scroll-area';
import { Separator } from './separator';

/**
 * Augments native scroll functionality for custom, cross-browser styling.
 * Built on Radix UI's Scroll Area primitive, it provides a styled scrollbar
 * for content that overflows its container.
 * By default, it handles vertical scrolling. For horizontal scrolling, the `ScrollBar`
 * component must be explicitly added.
 */
const meta: Meta<typeof ScrollArea> = {
  title: 'UI/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  subcomponents: { ScrollBar },
};

export default meta;
type Story = StoryObj<typeof ScrollArea>;

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`,
);

/**
 * The default vertical scroll area. It's ideal for long lists or content sections.
 * The vertical scrollbar appears automatically when content overflows.
 */
export const Default: Story = {
  render: () => (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {tags.map((tag) => (
          <React.Fragment key={tag}>
            <div className="text-sm">{tag}</div>
            <Separator className="my-2" />
          </React.Fragment>
        ))}
      </div>
    </ScrollArea>
  ),
};

const works = [
  {
    artist: 'Ornella Binni',
    art: 'https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?w=300&dpr=2&q=80',
  },
  {
    artist: 'Tom Byrom',
    art: 'https://images.unsplash.com/photo-1548516173-3cabfa4607e9?w=300&dpr=2&q=80',
  },
  {
    artist: 'Vladimir Malyavko',
    art: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=300&dpr=2&q=80',
  },
];

/**
 * To enable horizontal scrolling, you must explicitly add the `ScrollBar` component
 * with `orientation="horizontal"`. The content container should use flexbox (`flex`)
 * and prevent wrapping (`whitespace-nowrap`) to lay out items in a single row.
 */
export const HorizontalScrolling: Story = {
  render: () => (
    <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
      <div className="flex w-max space-x-4 p-4">
        {works.map((artwork) => (
          <figure key={artwork.artist} className="shrink-0">
            <div className="overflow-hidden rounded-md">
              <img
                src={artwork.art}
                alt={`Photo by ${artwork.artist}`}
                className="aspect-[3/4] h-fit w-fit object-cover"
                width={300}
                height={400}
              />
            </div>
            <figcaption className="pt-2 text-xs text-muted-foreground">
              Photo by{' '}
              <span className="font-semibold text-foreground">
                {artwork.artist}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
};
