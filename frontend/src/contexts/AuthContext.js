import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
//
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Función para cargar el estado de autenticación desde localStorage
  const loadAuthState = () => {
    try {
      const token = localStorage.getItem('token');
      const userType = localStorage.getItem('userType');
      const isLoggedInStorage = localStorage.getItem('isLoggedIn');

      if (token && userType && isLoggedInStorage === 'true') {
        const userData = {
          type: userType,
          token
        };

        if (userType === 'admin') {
          userData.username = localStorage.getItem('username');
          const permisos = localStorage.getItem('permisos');
          userData.permisos = permisos;
          
          // Verificar permisos de administrador
          userData.hasAdminPermission = permisos === '1' || permisos === 1 || permisos === '2' || permisos === 2;
          userData.hasFullPermission = permisos === '1' || permisos === 1;
          
          if (!userData.hasAdminPermission) {
            console.warn('Usuario admin sin permisos suficientes');
          }
        } else if (userType === 'cliente') {
          userData.nombre = localStorage.getItem('clienteNombre');
          userData.apellido = localStorage.getItem('clienteApellido');
          userData.email = localStorage.getItem('clienteEmail');
          userData.imagen = localStorage.getItem('clienteImagen');
          userData.fullName = `${userData.nombre} ${userData.apellido}`;
        }

        setUser(userData);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  // Cargar estado inicial
  useEffect(() => {
    loadAuthState();
  }, []);

  // Función para hacer login
  const login = (userData, token) => {
    try {
      // Guardar en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userType', userData.type);
      localStorage.setItem('isLoggedIn', 'true');

      if (userData.type === 'admin') {
        localStorage.setItem('username', userData.username);
        if (userData.permisos) {
          localStorage.setItem('permisos', userData.permisos);
        }
        
        // Verificar permisos de administrador
        userData.hasAdminPermission = userData.permisos === '1' || userData.permisos === 1 || userData.permisos === '2' || userData.permisos === 2;
        userData.hasFullPermission = userData.permisos === '1' || userData.permisos === 1;
        
        if (!userData.hasAdminPermission) {
          console.warn('Login de admin sin permisos suficientes');
        }
      } else if (userData.type === 'cliente') {
        localStorage.setItem('clienteNombre', userData.nombre);
        localStorage.setItem('clienteApellido', userData.apellido);
        localStorage.setItem('clienteEmail', userData.email);
        if (userData.imagen) {
          localStorage.setItem('clienteImagen', userData.imagen);
        }
        userData.fullName = `${userData.nombre} ${userData.apellido}`;
      }

      // Actualizar estado
      setUser({ ...userData, token });
      setIsLoggedIn(true);

      return userData;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  // Función para hacer logout
  const logout = () => {
    try {
      // Limpiar localStorage
      const keysToRemove = [
        'token',
        'userType',
        'isLoggedIn',
        'username',
        'permisos',
        'clienteNombre',
        'clienteApellido',
        'clienteEmail',
        'clienteImagen'
      ];

      keysToRemove.forEach(key => localStorage.removeItem(key));

      // Limpiar estado
      setUser(null);
      setIsLoggedIn(false);

      // Redirigir al inicio
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Función para ir al admin (solo si tiene permisos)
  const goToAdmin = () => {
    if (user?.type === 'admin' && user?.hasAdminPermission) {
      navigate('/admin/estadisticas');
    } else {
      console.error('Sin permisos para acceder al admin');
      // Opcional: mostrar mensaje de error al usuario
    }
  };

  // Función para verificar permisos específicos
  const hasPermission = (permission) => {
    if (!user || user.type !== 'admin') return false;
    return user.hasAdminPermission && (user.permisos === '1' || user.permisos === 1 || user.permisos === '2' || user.permisos === 2);
  };

  // Función para verificar permisos completos (solo permisos 1)
  const hasFullPermission = () => {
    if (!user || user.type !== 'admin') return false;
    // Solo permisos 1 tienen acceso completo
    return user.permisos === '1' || user.permisos === 1;
  };

  const value = {
    isLoggedIn,
    user,
    loading,
    login,
    logout,
    goToAdmin,
    hasPermission,
    hasFullPermission,
    loadAuthState
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 