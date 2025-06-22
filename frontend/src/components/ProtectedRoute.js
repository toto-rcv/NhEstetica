import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
  const token = localStorage.getItem('token');

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute; 