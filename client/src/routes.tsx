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
        lazy: async () => { const { default: Component } = await import('@/pages/Dashboard'); return { Component }; },
        handle: { title: 'Dashboard' },
      },
      {
        path: 'agentes',
        lazy: async () => { const { default: Component } = await import('@/pages/Agentes'); return { Component }; },
        handle: { title: 'Agentes' },
      },
      {
        path: 'ferramentas',
        lazy: async () => { const { default: Component } = await import('@/pages/Ferramentas'); return { Component }; },
        handle: { title: 'Ferramentas' },
      },
      {
        path: 'deploy',
        lazy: async () => { const { default: Component } = await import('@/pages/Deploy'); return { Component }; },
        handle: { title: 'Deploy' },
      },
      {
        path: 'configuracoes',
        lazy: async () => { const { default: Component } = await import('@/pages/Configuracoes'); return { Component }; },
        handle: { title: 'Configurações' },
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
