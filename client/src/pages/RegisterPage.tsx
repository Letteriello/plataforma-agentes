import { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';

import { registerUser } from '@/api/authService'; // Importa a função real

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      await registerUser({ email, password });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Falha no registro. Tente novamente.');
    }
  };

  if (success) {
    return (
      <div style={{ maxWidth: '400px', margin: 'auto', paddingTop: '50px', textAlign: 'center' }}>
        <h2>Registro bem-sucedido!</h2>
        <p>Um link de confirmação foi enviado para o seu e-mail.</p>
        <p>Por favor, verifique sua caixa de entrada para ativar sua conta.</p>
        <Link to="/login">Voltar para o Login</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', paddingTop: '50px' }}>
      <h2>Registro</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Registrar</button>
      </form>
      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Já tem uma conta? <Link to="/login">Faça login</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
