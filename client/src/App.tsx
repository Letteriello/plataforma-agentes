import { Route,Routes } from 'react-router-dom';

import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import AppLayout from "@/layouts/AppLayout";
import AgentsIndexPage from "@/features/agents/routes/AgentsIndexPage";
import AgentsNewPage from "@/features/agents/routes/AgentsNewPage";
import AgentsEditEntryPage from "@/features/agents/routes/edit/AgentsEditEntryPage";
import ToolEditorPage from "@/features/tools/routes/ToolEditorPage";
import ToolsPage from "@/features/tools/routes/ToolsPage";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage";
import RegisterPage from "@/pages/RegisterPage";

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
          <Route path="/tools/new" element={<ToolEditorPage />} />
          <Route path="/tools/:id/edit" element={<ToolEditorPage />} />
          {/* Agentes */}
          <Route path="/agents" element={<AgentsIndexPage />} />
          <Route path="/agents/new" element={<AgentsNewPage />} />
          <Route path="/agents/:id/edit" element={<AgentsEditEntryPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
