import { Outlet, useMatches } from 'react-router-dom';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Topbar } from '@/components/navigation/Topbar';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';

export function MainLayout() {
  const matches = useMatches();
  const routeWithTitle = [...matches].reverse().find(match => typeof (match.handle as any)?.title === 'string');
  const dynamicTitle = routeWithTitle ? (routeWithTitle.handle as any).title : undefined;

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-screen w-full overflow-hidden bg-background" // Changed to bg-background
    >
      {/* Sidebar Panel */}
      <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
        {/* The Sidebar component itself now has border-r, so removing from this div if it was redundant */}
        <div className="h-full overflow-y-auto"> 
          <Sidebar />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />

      {/* Main Area Panel (contains Topbar, Context Panel, and Outlet) */}
      <ResizablePanel defaultSize={80}>
        <div className="flex flex-col h-full">
          <Topbar pageTitle={dynamicTitle} />
          <ResizablePanelGroup
            direction="horizontal"
            className="flex-1" 
          >
            {/* Context Panel */}
            <ResizablePanel defaultSize={30} minSize={20}>
              {/* Added bg-card, changed border color, ensured text-muted-foreground for placeholder */}
              <div className="flex h-full items-center justify-center p-6 bg-card border-r border-border">
                <span className="font-semibold text-muted-foreground">Context Panel</span>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            {/* Outlet Panel */}
            <ResizablePanel defaultSize={70}>
              {/* The Outlet panel itself should not have bg-card, content inside might.
                  The main content area background will be bg-background from the root ResizablePanelGroup.
                  Padding p-6 is good for the main content area.
              */}
              <div className="h-full overflow-y-auto">
                <main className="p-6">
                  <Outlet />
                </main>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
