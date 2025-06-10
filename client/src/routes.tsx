import { createBrowserRouter, Navigate, RouteObject as DefaultRouteObject } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { lazy, Suspense } from 'react';

// Define custom handle and AppRouteObject types
interface CustomRouteHandle {
  title: string;
  // Add other potential properties if observed or anticipated
}

interface AppRouteObject extends Omit<DefaultRouteObject, 'handle' | 'children'> {
  handle?: CustomRouteHandle;
  children?: AppRouteObject[];
  lazy?: () => Promise<{ Component: React.ComponentType }>; // Ensure lazy is correctly typed
}

// Lazy load components with proper error boundaries
const withSuspense = (Component: React.ComponentType) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component />
    </Suspense>
  );
};

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
import AgentsPage from '@/pages/agents'; // Corrigido: aponta para o componente React default de agents
const ToolsPage = lazy(() => import('./pages/Tools')); // Renamed from Ferramentas.tsx
const MemoryPage = lazy(() => import('./pages/Memory')); // Renamed from Memoria.tsx
const Deploy = lazy(() => import('./pages/Deploy'));
const SettingsPage = lazy(() => import('./pages/Settings')); // Renamed from Configuracoes.tsx
const ChatPage = lazy(() => import('./pages/ChatPage'));

// Error boundary component
// Ensure ErrorBoundary is defined before its usage or imported if defined elsewhere.
// For now, assuming it's correctly defined here or imported.
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error('Error in route component:', error);
    return <div>Ocorreu um erro ao carregar esta página. Por favor, tente novamente.</div>;
  }
};

const routes: AppRouteObject[] = [
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <MainLayout />
      </ErrorBoundary>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: withSuspense(Dashboard),
        handle: { title: 'Dashboard' },
      },
      {
        path: 'chat',
        element: withSuspense(ChatPage),
        handle: { title: 'Chat' },
      },
      {
        path: 'agents', // path changed from 'agentes'
        element: <AgentsPage />,
        handle: { title: 'Agents' }, // title changed
      },
      {
        path: 'tools', // path changed from 'ferramentas'
        element: withSuspense(ToolsPage),
        handle: { title: 'Tools' }, // title changed
      },
      {
        path: 'memory', // path changed from 'memoria'
        element: withSuspense(MemoryPage),
        handle: { title: 'Memory' }, // title changed
      },
      {
        path: 'deploy',
        element: withSuspense(Deploy),
        handle: { title: 'Deploy' },
      },
      {
        path: 'settings', // path changed from 'configuracoes'
        element: withSuspense(SettingsPage),
        handle: { title: 'Settings' }, // title changed
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];

export const router = createBrowserRouter(routes);
