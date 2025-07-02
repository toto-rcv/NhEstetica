import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, user, loading } = useAuth();

  // Mostrar loading mientras se carga el estado de autenticación
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Verificando permisos...
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isLoggedIn || !user) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado pero no es admin, redirigir a 404
  if (user.type !== 'admin') {
    return <Navigate to="/404" replace />;
  }

  // Si es admin pero no tiene permiso(1), mostrar mensaje de error
  if (user.type === 'admin' && !user.hasAdminPermission) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        textAlign: 'center',
        padding: '20px'
      }}>
        <h2 style={{ color: '#e74c3c', marginBottom: '20px' }}>
          Acceso Denegado
        </h2>
        <p style={{ color: '#666', fontSize: '16px', marginBottom: '20px' }}>
          Tu cuenta de administrador no tiene los permisos necesarios para acceder a esta sección.
        </p>
        <p style={{ color: '#999', fontSize: '14px' }}>
          Contacta al administrador principal para obtener los permisos requeridos.
        </p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute; 