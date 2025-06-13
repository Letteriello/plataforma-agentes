import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import AppLayout from './layouts/AppLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ToolsPage from './pages/ToolsPage';
import CreateOrEditToolPage from './pages/CreateOrEditToolPage';
import AgentsPage from './pages/AgentsPage';
import CreateOrEditAgentPage from './pages/CreateOrEditAgentPage';

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
