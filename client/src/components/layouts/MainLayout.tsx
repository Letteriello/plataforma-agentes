import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Topbar } from '@/components/navigation/Topbar';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';

export function MainLayout() {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950"
    >
      {/* Sidebar Panel */}
      <ResizablePanel defaultSize={15} minSize={10}>
        <div className="h-full border-r border-slate-200 dark:border-slate-800">
          <Sidebar />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />

      {/* Context Panel */}
      <ResizablePanel defaultSize={25} minSize={15}>
        <div className="flex h-full items-center justify-center p-6 border-r border-slate-200 dark:border-slate-800">
          <span className="font-semibold">Context Panel</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />

      {/* Main Content Panel */}
      <ResizablePanel defaultSize={60}>
        <div className="flex flex-col h-full">
          <Topbar />
          <div className="flex-1 overflow-auto">
            <main className="h-full">
              <Outlet />
            </main>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
