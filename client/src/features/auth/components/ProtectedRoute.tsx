import { Navigate, Outlet } from 'react-router-dom';

import { useAuthStore } from '@/stores/authStore';

const ProtectedRoute = () => {
  const { token } = useAuthStore();

  // Se não houver token, redireciona para a página de login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Se houver token, renderiza o conteúdo da rota filha
  return <Outlet />;
};

export default ProtectedRoute;
