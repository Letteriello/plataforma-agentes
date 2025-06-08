import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { lazy, Suspense } from 'react';

// Lazy load components with proper error boundaries
const withSuspense = (Component: React.ComponentType) => {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <Component />
    </Suspense>
  );
};

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
import AgentesMinimoContent from '@/pages/Agentes'; // Importação direta
// const Agentes = lazy(() => import('@/pages/Agentes')); // Comentado
const Ferramentas = lazy(() => import('./pages/Ferramentas'));
const Deploy = lazy(() => import('./pages/Deploy'));
const Configuracoes = lazy(() => import('./pages/Configuracoes'));
const ChatPage = lazy(() => import('./pages/ChatPage'));

// Error boundary component
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error('Error in route component:', error);
    return <div>Ocorreu um erro ao carregar esta página. Por favor, tente novamente.</div>;
  }
};

export const router = createBrowserRouter([
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
        path: 'agentes',
        element: <AgentesMinimoContent />,
        handle: { title: 'Agentes' },
      },
      {
        path: 'ferramentas',
        element: withSuspense(Ferramentas),
        handle: { title: 'Ferramentas' },
      },
      {
        path: 'deploy',
        element: withSuspense(Deploy),
        handle: { title: 'Deploy' },
      },
      {
        path: 'configuracoes',
        element: withSuspense(Configuracoes),
        handle: { title: 'Configurações' },
      },
      {
        path: 'chat',
        element: withSuspense(ChatPage),
        handle: { title: 'Chat' },
      },
      {
        path: 'agent/:id',
        lazy: () => import('@/pages/AgentWorkspace').then(module => ({
          Component: () => withSuspense(module.default)
        })),
        handle: { title: 'Workspace do Agente' },
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
