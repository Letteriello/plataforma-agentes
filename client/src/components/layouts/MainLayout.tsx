import { useState } from 'react';
import { Outlet, useMatches } from 'react-router-dom';

import { Sidebar } from '@/components/navigation/Sidebar';
import { Topbar } from '@/components/navigation/Topbar';
import { cn } from '@/lib/utils';

interface RouteHandle {
  title?: string;
}

const isRouteHandle = (handle: unknown): handle is RouteHandle => {
  return typeof handle === 'object' && handle !== null && 'title' in handle;
};

const MainLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const matches = useMatches();

  const routeWithTitle = [...matches]
    .reverse()
    .find(
      (match) =>
        isRouteHandle(match.handle) && typeof match.handle.title === 'string',
    );

  const dynamicTitle =
    routeWithTitle && isRouteHandle(routeWithTitle.handle)
      ? routeWithTitle.handle.title
      : undefined;

  return (
    <div className="flex h-screen bg-muted/40">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onMouseEnter={() => setIsSidebarCollapsed(false)}
        onMouseLeave={() => setIsSidebarCollapsed(true)}
      />
      <div
        className={cn(
          'flex flex-1 flex-col transition-all duration-300 ease-in-out h-full overflow-hidden',
          isSidebarCollapsed ? 'pl-20' : 'pl-64',
        )}
      >
        <Topbar pageTitle={dynamicTitle} />
        {/* Outlet Panel - Now occupies all space below the Topbar */}
        <div className="flex-1 h-full overflow-y-auto bg-muted/20 dark:bg-muted/10">
          <main className="p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default MainLayout
