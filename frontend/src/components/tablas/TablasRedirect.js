import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TablasRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/tablas/inicio', { replace: true });
  }, [navigate]);

  return null;
};

export default TablasRedirect; 