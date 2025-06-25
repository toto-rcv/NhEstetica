import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TablasRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/admin/inicio');
  }, [navigate]);

  return null;
};

export default TablasRedirect; 