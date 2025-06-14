import { useState } from 'react';
import { Outlet, useMatches } from 'react-router-dom';

import { Sidebar } from '@/features/navigation/components/Sidebar';
import { Topbar } from '@/features/navigation/components/Topbar';
import { cn } from '@/lib/utils';

interface RouteHandle {
  title?: string;
}

const isRouteHandle = (handle: unknown): handle is RouteHandle => {
  return typeof handle === 'object' && handle !== null && 'title' in handle;
};

const MainLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    <div className="flex h-screen bg-muted/40 md:static">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        onMouseEnter={() => !isMobileMenuOpen && setIsSidebarCollapsed(false)}
        onMouseLeave={() => !isMobileMenuOpen && setIsSidebarCollapsed(true)}
      />
      <div
        className={cn(
          'flex flex-1 flex-col transition-all duration-300 ease-in-out h-full overflow-hidden',
          isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64',
        )}
      >
        <Topbar
          pageTitle={dynamicTitle}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
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
