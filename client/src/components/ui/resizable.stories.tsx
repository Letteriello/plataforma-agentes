import type { Meta, StoryObj } from '@storybook/react';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from './resizable';

/**
 * A component that allows you to create resizable layouts.
 * It's built on top of the `react-resizable-panels` library and is composed of three main parts:
 * - `ResizablePanelGroup`: The main container that holds the panels.
 * - `ResizablePanel`: A single panel within the group.
 * - `ResizableHandle`: The handle used to resize the panels.
 */
const meta: Meta<typeof ResizablePanelGroup> = {
  title: 'UI/Resizable',
  component: ResizablePanelGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  subcomponents: { ResizablePanel, ResizableHandle },
  argTypes: {
    direction: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'The direction of the panel group.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ResizablePanelGroup>;

/**
 * A basic horizontal layout with two panels.
 */
export const Horizontal: Story = {
  render: (args) => (
    <ResizablePanelGroup
      {...args}
      direction="horizontal"
      className="h-screen max-w-full rounded-lg border"
    >
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Panel One</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Panel Two</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

/**
 * A basic vertical layout with two panels.
 */
export const Vertical: Story = {
  render: (args) => (
    <ResizablePanelGroup
      {...args}
      direction="vertical"
      className="h-screen max-w-md rounded-lg border"
    >
      <ResizablePanel defaultSize={25}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Panel One</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={75}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Panel Two</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

/**
 * A more complex example showing a nested layout.
 * The `withHandle` prop on `ResizableHandle` adds a visible grabber icon.
 */
export const NestedLayoutWithHandles: Story = {
  render: (args) => (
    <ResizablePanelGroup
      {...args}
      direction="horizontal"
      className="h-screen max-w-full rounded-lg border"
    >
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Left Panel</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={25}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Top Panel</span>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={75}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Bottom Panel</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};
