import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import FeedbackMessage from '../../components/FeedbackMessage';

const Dashboard = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    // Verificar autenticación
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    // Si no está autenticado, no mostrar nada
    if (!isAuthenticated || !user) {
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="dashboard">
            <Navigation />

            <div className="dashboard-container">
                <header className="dashboard-header">
                    <h1>¡Bienvenido a TribeHub!</h1>
                    <p>Has iniciado sesión exitosamente</p>
                </header>

                <main className="dashboard-content">
                    <div className="welcome-card">
                        <h2>Información de tu cuenta</h2>
                        <div className="user-info">
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Usuario:</strong> {user.username || user.email?.split('@')[0]}</p>
                            <p><strong>Estado:</strong> <span className="status-active">Activo</span></p>
                        </div>
                    </div>

                    <div className="dashboard-actions">
                        <div className="action-card">
                            <h3>🌟 Características Próximamente</h3>
                            <p>Estamos trabajando en nuevas funcionalidades para mejorar tu experiencia:</p>
                            <ul>
                                <li>Publicaciones y compartir contenido</li>
                                <li>Conectar con otros usuarios</li>
                                <li>Grupos y comunidades</li>
                                <li>Mensajería instantánea</li>
                                <li>Personalización del perfil</li>
                            </ul>
                        </div>

                        <div className="action-card">
                            <h3>🚀 Estado del Proyecto</h3>
                            <p>La autenticación está funcionando correctamente con el backend NestJS + Supabase.</p>
                            <div className="project-status">
                                <div className="status-item">
                                    <span className="status-icon">✅</span>
                                    <span>Autenticación implementada</span>
                                </div>
                                <div className="status-item">
                                    <span className="status-icon">🔄</span>
                                    <span>Funcionalidades sociales (próximamente)</span>
                                </div>
                                <div className="status-item">
                                    <span className="status-icon">🔄</span>
                                    <span>Despliegue en servidor (próximamente)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="dashboard-footer">
                    <button
                        className="btn-logout"
                        onClick={handleLogout}
                    >
                        Cerrar sesión
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default Dashboard;