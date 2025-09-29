import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    // Mostrar loading mientras se verifica la autenticación
    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Verificando autenticación...</p>
                </div>
            </div>
        );
    }

    // Si no está autenticado, redirigir al login con la ubicación actual
    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // Si está autenticado, mostrar el componente protegido
    return children;
};

export default ProtectedRoute;