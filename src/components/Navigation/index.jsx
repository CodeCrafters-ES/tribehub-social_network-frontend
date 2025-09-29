import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // No mostrar navegación si no está autenticado
  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="user-navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <h3>TribeHub</h3>
        </div>

        <div className="nav-menu">
          <button
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            onClick={() => navigate('/dashboard')}
          >
            🏠 Dashboard
          </button>

          <button
            className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
            onClick={() => navigate('/profile')}
          >
            👤 Perfil
          </button>

          <button
            className={`nav-link ${isActive('/settings') ? 'active' : ''}`}
            onClick={() => navigate('/settings')}
          >
            ⚙️ Configuración
          </button>
        </div>

        <div className="nav-user">
          <div className="user-info">
            <span className="user-email">{user.email}</span>
            <span className="user-status">● Conectado</span>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
            title="Cerrar sesión"
          >
            🚪 Salir
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;