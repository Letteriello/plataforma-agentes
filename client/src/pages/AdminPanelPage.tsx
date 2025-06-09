import React from 'react';

const AdminPanelPage: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Painel de Administração</h1>
      <p>Bem-vindo ao Painel de Administração!</p>
      <p>Este conteúdo é visível apenas para usuários com o papel de 'admin'.</p>
    </div>
  );
};

export default AdminPanelPage;
