import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from '../components/LoginModal';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--background-color) 0%, rgba(224, 117, 162, 0.1) 50%, rgba(224, 117, 212, 0.1) 100%);
  padding: 20px;
  margin-top: 60px;
`;

const LoginCard = styled.div`
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(224, 117, 162, 0.2);
  width: 100%;
  max-width: 450px;
  text-align: center;
  border: 1px solid rgba(224, 117, 162, 0.1);
`;

const Title = styled.h2`
  color: var(--primary-color-dark);
  margin-bottom: 30px;
  font-size: 32px;
  font-weight: 600;
  font-family: var(--heading-font);
  background: linear-gradient(135deg, var(--primary-color-dark) 0%, var(--terciary-color) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 30px;
  font-size: 16px;
  font-family: var(--text-font);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
`;

const Label = styled.label`
  font-weight: 500;
  color: #555;
  font-size: 14px;
  font-family: var(--text-font);
`;

const Input = styled.input`
  padding: 14px 16px;
  border: 2px solid rgba(224, 117, 162, 0.2);
  border-radius: 12px;
  font-size: 16px;
  font-family: var(--text-font);
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color-dark);
    box-shadow: 0 0 0 3px rgba(224, 117, 162, 0.1);
    background: white;
  }
`;

const LoginButton = styled.button`
  background: linear-gradient(135deg, var(--primary-color-dark) 0%, var(--terciary-color) 100%);
  color: white;
  padding: 16px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  font-family: var(--text-font);
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(224, 117, 162, 0.4);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    
    &:hover::before {
      left: -100%;
    }
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
  padding: 8px;
  background: rgba(220, 53, 69, 0.1);
  border-radius: 8px;
  border-left: 4px solid #dc3545;
`;

const SuccessMessage = styled.div`
  color: #28a745;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
  padding: 8px;
  background: rgba(40, 167, 69, 0.1);
  border-radius: 8px;
  border-left: 4px solid #28a745;
`;

const RegisterLink = styled.div`
  margin-top: 20px;
  text-align: center;
  color: #666;
  font-size: 14px;
  
  a {
    color: var(--primary-color-dark);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
    
    &:hover {
      color: var(--terciary-color);
    }
  }
`;

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();
  const { isLoggedIn, user, login: authLogin, logout } = useAuth();

  // Verificar si ya está autenticado al cargar el componente
  useEffect(() => {
    if (isLoggedIn && user) {
      if (user.type === 'admin') {
        setLoggedInUser(user.username);
      } else {
        setLoggedInUser(user.fullName);
      }
      setShowModal(true);
    }
  }, [isLoggedIn, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar mensajes de error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validación simple
    if (!formData.email || !formData.password) {
      setError('Por favor completa todos los campos');
      setIsLoading(false);
      return;
    }

    // Conectar con el backend
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('¡Login exitoso!');
        
        // Usar el contexto para manejar el login
        const userData = authLogin(data.user, data.token);
        
        setLoggedInUser(userData.type === 'admin' ? userData.username : userData.fullName);
        
        // Redirigir según el tipo de usuario
        if (userData.type === 'admin') {
          navigate('/admin/estadisticas');
        } else {
          navigate('/');
        }
      } else {
        setError(data.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error de conexión. Verifica que el servidor esté ejecutándose.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // Usar el contexto para hacer logout
    logout();
    
    // Limpiar estado local
    setLoggedInUser(null);
    setShowModal(false);
    setFormData({ email: '', password: '' });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/');
  };

  return (
    <>
      <LoginContainer>
        <LoginCard>
          <Title>Iniciar Sesión</Title>
          <Subtitle>Accede como cliente o administrador</Subtitle>
          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ingresa tu email"
                disabled={isLoading}
              />
            </InputGroup>
            
            <InputGroup>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Ingresa tu contraseña"
                disabled={isLoading}
              />
            </InputGroup>
            
            <LoginButton type="submit" disabled={isLoading}>
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </LoginButton>
          </Form>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
          
          <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
            <p><strong>Credenciales de administrador:</strong></p>
            <p>Email: <strong>admin@nhestetica.com</strong> | Contraseña: <strong>123</strong></p>
            <p style={{ fontSize: '12px', marginTop: '8px', color: '#888' }}>
              Los clientes usan su email registrado
            </p>
          </div>
          
          <RegisterLink>
            ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
          </RegisterLink>
        </LoginCard>
      </LoginContainer>
      
      <LoginModal 
        isOpen={showModal}
        onClose={handleCloseModal}
        onLogout={handleLogout}
        username={loggedInUser}
      />
    </>
  );
}

export default Login;
