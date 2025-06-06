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
  // Encontra a última rota na hierarquia que tem um 'handle' com 'title'
  // Isso garante que o título da rota mais específica seja usado
  const routeWithTitle = [...matches].reverse().find(match => typeof (match.handle as any)?.title === 'string');
  const dynamicTitle = routeWithTitle ? (routeWithTitle.handle as any).title : undefined;

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950"
    >
      {/* Sidebar Panel */}
      <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
        <div className="h-full overflow-y-auto border-r border-slate-200 dark:border-slate-800">
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
            className="flex-1" // flex-1 to take remaining space in the flex-col parent
          >
            {/* Context Panel */}
            <ResizablePanel defaultSize={30} minSize={20}>
              <div className="flex h-full items-center justify-center p-6 border-r border-slate-200 dark:border-slate-800">
                <span className="font-semibold">Context Panel</span>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            {/* Outlet Panel */}
            <ResizablePanel defaultSize={70}>
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
