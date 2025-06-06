import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/MainLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        lazy: () => import('@/pages/Dashboard'),
      },
      {
        path: 'agentes',
        lazy: () => import('@/pages/Agentes'),
      },
      {
        path: 'ferramentas',
        lazy: () => import('@/pages/Ferramentas'),
      },
      {
        path: 'deploy',
        lazy: () => import('@/pages/Deploy'),
      },
      {
        path: 'configuracoes',
        lazy: () => import('@/pages/Configuracoes'),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
