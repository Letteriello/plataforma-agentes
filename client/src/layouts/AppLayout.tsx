import { Outlet } from 'react-router-dom';

import { Topbar } from '@/features/navigation/components/Topbar';

const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Topbar onMenuClick={() => {}} />

      {/* Conteúdo principal da página */}
      <main className="flex-grow p-4">
        <Outlet /> {/* Onde as rotas filhas serão renderizadas */}
      </main>

      {/* Exemplo de Footer */}
      <footer className="bg-gray-200 p-4 text-center text-sm">
        © 2025 ai.da Platform
      </footer>
    </div>
  );
};

export default AppLayout;
