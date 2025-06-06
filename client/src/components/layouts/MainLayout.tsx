import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Topbar } from '@/components/navigation/Topbar';

export function MainLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <div className="w-[240px] border-r border-slate-200 dark:border-slate-800">
        <Sidebar />
      </div>

      {/* Main Content with Topbar */}
      <div className="flex flex-col flex-1">
        <Topbar />
        
        <div className="flex-1 overflow-auto">
          <main className="h-full">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
