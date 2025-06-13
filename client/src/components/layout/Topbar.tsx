import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { logoutUser } from '@/api/authService';

const Topbar = () => {
  const { token } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-6">
        <Link to="/" className="text-xl font-bold">ai.da Platform</Link>
        {token && (
          <div className="flex items-center space-x-4">
            <Link to="/agents" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Agentes</Link>
            <Link to="/tools" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Ferramentas</Link>
          </div>
        )}
      </div>
      <nav>
        {token ? (
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors">
            Logout
          </button>
        ) : (
          <div>
            <Link to="/login" className="text-sm font-medium hover:text-gray-300 transition-colors">Login</Link>
            <Link to="/register" className="ml-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors">Register</Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Topbar;
