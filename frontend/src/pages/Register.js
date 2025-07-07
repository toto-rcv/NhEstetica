import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RegisterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--background-color) 0%, rgba(224, 117, 162, 0.1) 50%, rgba(224, 117, 212, 0.1) 100%);
  padding: 20px;
  margin-top: 60px;
`;

const RegisterCard = styled.div`
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
  
  &.error {
    border-color: #dc3545;
  }
`;

const RegisterButton = styled.button`
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

const LoginLink = styled.div`
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

const PasswordStrength = styled.div`
  margin-top: 8px;
  font-size: 12px;
  
  .strength-bar {
    height: 4px;
    border-radius: 2px;
    margin-top: 4px;
    transition: all 0.3s ease;
  }
  
  .weak {
    background: #dc3545;
    width: 33%;
  }
  
  .medium {
    background: #fd7e14;
    width: 66%;
  }
  
  .strong {
    background: #28a745;
    width: 100%;
  }
`;

function Register() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    direccion: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();

  // Redirigir si ya está logueado
  useEffect(() => {
    if (isLoggedIn && user) {
      if (user.type === 'admin') {
        navigate('/admin/inicio');
      } else {
        navigate('/');
      }
    }
  }, [isLoggedIn, user, navigate]);

  const getPasswordStrength = (password) => {
    if (password.length < 6) return '';
    if (password.length < 8) return 'weak';
    if (password.length < 12 && /[A-Z]/.test(password) && /[0-9]/.test(password)) return 'medium';
    if (password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password)) return 'strong';
    return 'medium';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'password') {
      setPasswordStrength(getPasswordStrength(value));
    }
    
    // Limpiar mensajes de error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.nombre || !formData.apellido || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Por favor completa todos los campos obligatorios');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor ingresa un email válido');
      return false;
    }
    
    if (formData.nombre.length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return false;
    }
    
    if (formData.apellido.length < 2) {
      setError('El apellido debe tener al menos 2 caracteres');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          direccion: formData.direccion,
          telefono: formData.telefono,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('¡Registro exitoso! Redirigiendo al login...');
        setFormData({
          nombre: '',
          apellido: '',
          email: '',
          direccion: '',
          telefono: '',
          password: '',
          confirmPassword: ''
        });
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message || 'Error al registrar usuario');
      }
    } catch (err) {
      setError('Error de conexión. Verifica que el servidor esté ejecutándose.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <Title>Crear Cuenta de Cliente</Title>
        <Subtitle>Únete a nuestra comunidad de belleza y bienestar para acceder a descuentos y promociones exclusivas</Subtitle>
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="nombre">Nombre *</Label>
            <Input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Tu nombre"
              disabled={isLoading}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="apellido">Apellido *</Label>
            <Input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              placeholder="Tu apellido"
              disabled={isLoading}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Tu número de teléfono"
              disabled={isLoading}
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              type="text"
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              placeholder="Tu dirección"
              disabled={isLoading}
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="email">Email *</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              disabled={isLoading}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">Contraseña *</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Crea una contraseña segura"
              disabled={isLoading}
              required
            />
            {passwordStrength && (
              <PasswordStrength>
                <div className={`strength-bar ${passwordStrength}`}></div>
                <span style={{ color: passwordStrength === 'weak' ? '#dc3545' : passwordStrength === 'medium' ? '#fd7e14' : '#28a745' }}>
                  {passwordStrength === 'weak' && 'Débil'}
                  {passwordStrength === 'medium' && 'Media'}
                  {passwordStrength === 'strong' && 'Fuerte'}
                </span>
              </PasswordStrength>
            )}
          </InputGroup>

          <InputGroup>
            <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirma tu contraseña"
              disabled={isLoading}
              required
              className={formData.confirmPassword && formData.password !== formData.confirmPassword ? 'error' : ''}
            />
          </InputGroup>

          <RegisterButton type="submit" disabled={isLoading}>
            {isLoading ? 'Registrando...' : 'Crear Cuenta'}
          </RegisterButton>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
        </Form>

        <LoginLink>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </LoginLink>
      </RegisterCard>
    </RegisterContainer>
  );
}

export default Register; 