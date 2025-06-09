import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>403 - Acesso Negado</h1>
      <p>Você não tem permissão para acessar esta página.</p>
      <p>
        <Link to={from}>Voltar para a página anterior</Link> ou <Link to="/dashboard">ir para o Dashboard</Link>.
      </p>
    </div>
  );
};

export default UnauthorizedPage;
