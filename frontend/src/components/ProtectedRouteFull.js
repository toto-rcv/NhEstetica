import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { checkUserPermissions } from '../utils/checkPermissions';

const ProtectedRouteFull = ({ children }) => {
  const { isLoggedIn, user, loading, hasFullPermission } = useAuth();

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

  // Debug: mostrar información del usuario
  console.log('Usuario:', user);
  console.log('Permisos:', user.permisos);
  console.log('hasFullPermission:', hasFullPermission());
  
  // Verificar permisos del usuario actual
  checkUserPermissions();

  // Si es admin pero no tiene permisos completos, mostrar mensaje de error
  if (user.type === 'admin' && !hasFullPermission()) {
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
          Acceso Restringido
        </h2>
        <p style={{ color: '#666', fontSize: '16px', marginBottom: '20px' }}>
          Esta sección requiere permisos de administrador principal (permisos nivel 1).
        </p>
        <p style={{ color: '#999', fontSize: '14px' }}>
          Solo los usuarios con permisos nivel 1 pueden acceder a esta sección.
        </p>
      </div>
    );
  }

  return children;
};

export default ProtectedRouteFull; 