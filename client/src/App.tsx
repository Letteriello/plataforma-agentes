import { Route,Routes } from 'react-router-dom';

import ProtectedRoute from './features/auth/components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import AgentsPage from './pages/AgentsPage';
import CreateOrEditAgentPage from './pages/CreateOrEditAgentPage';
import CreateOrEditToolPage from './pages/CreateOrEditToolPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import RegisterPage from './pages/RegisterPage';
import ToolsPage from './pages/ToolsPage';

function App() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rotas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          {/* Ferramentas */}
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/tools/new" element={<CreateOrEditToolPage />} />
          <Route path="/tools/:id/edit" element={<CreateOrEditToolPage />} />
          {/* Agentes */}
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/agents/new" element={<CreateOrEditAgentPage />} />
          <Route path="/agents/:id/edit" element={<CreateOrEditAgentPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
