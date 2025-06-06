import { Outlet } from 'react-router-dom';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Topbar } from '@/components/navigation/Topbar';

export function MainLayout() {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      {/* Topbar */}
      <header className="h-16 border-b border-border">
        <Topbar />
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Sidebar */}
          <ResizablePanel defaultSize={16} minSize={16} maxSize={20} className="min-w-[200px] max-w-[300px]">
            <Sidebar />
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-border/50 w-[1px]" />

          {/* Main Content */}
          <ResizablePanel defaultSize={60} minSize={40} className="flex flex-col">
            <main className="flex-1 overflow-auto p-6">
              <Outlet />
            </main>
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-border/50 w-[1px]" />

          {/* Sidebar Direita */}
          <ResizablePanel defaultSize={24} minSize={20} maxSize={30} className="min-w-[250px] max-w-[400px]">
            <div className="h-full overflow-auto border-l border-border p-4">
              {/* Conteúdo da barra lateral direita */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Detalhes</h2>
                <div className="rounded-lg border border-border p-4">
                  <p className="text-sm text-muted-foreground">
                    Selecione um item para ver os detalhes
                  </p>
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
