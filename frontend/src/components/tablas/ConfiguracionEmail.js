import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ConfiguracionEmail = () => {
  const [configuracion, setConfiguracion] = useState({
    email_destino: '',
    nombre_destinatario: '',
    activo: true
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  const cargarConfiguracion = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/email/configuracion', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setConfiguracion(data);
      } else if (response.status === 404) {
        // No hay configuración, usar valores por defecto
        setConfiguracion({
          email_destino: 'admin@nhestetica.com',
          nombre_destinatario: 'Administrador NH Estética',
          activo: true
        });
      }
    } catch (error) {
      console.error('Error al cargar configuración:', error);
      setMessage('Error al cargar la configuración');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const guardarConfiguracion = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage('');

      const response = await fetch('/api/email/configuracion', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(configuracion)
      });

      if (response.ok) {
        setMessage('Configuración guardada correctamente');
        setMessageType('success');
      } else {
        const error = await response.json();
        setMessage(error.message || 'Error al guardar la configuración');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      setMessage('Error de conexión');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const enviarEmailPrueba = async () => {
    try {
      setLoading(true);
      setMessage('');

      const response = await fetch('/api/email/prueba', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setMessage('Email de prueba enviado correctamente');
        setMessageType('success');
      } else {
        const error = await response.json();
        setMessage(error.message || 'Error al enviar email de prueba');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error al enviar email de prueba:', error);
      setMessage('Error de conexión');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfiguracion(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading && !configuracion.email_destino) {
    return <LoadingMessage>Cargando configuración...</LoadingMessage>;
  }

  return (
    <Container>
      <Title>Configuración de Email</Title>
      <Description>
        Configura el email donde se enviarán los reportes de cierre de caja.
        Los reportes incluyen todas las tablas de caja y los cambios realizados por usuarios.
      </Description>

      <Form onSubmit={guardarConfiguracion}>
        <FormGroup>
          <Label htmlFor="email_destino">Email Destino *</Label>
          <Input
            type="email"
            id="email_destino"
            name="email_destino"
            value={configuracion.email_destino}
            onChange={handleChange}
            required
            placeholder="admin@nhestetica.com"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="nombre_destinatario">Nombre del Destinatario *</Label>
          <Input
            type="text"
            id="nombre_destinatario"
            name="nombre_destinatario"
            value={configuracion.nombre_destinatario}
            onChange={handleChange}
            required
            placeholder="Administrador NH Estética"
          />
        </FormGroup>

        <FormGroup>
          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              id="activo"
              name="activo"
              checked={configuracion.activo}
              onChange={handleChange}
            />
            <CheckboxLabel htmlFor="activo">
              Activar envío automático de emails
            </CheckboxLabel>
          </CheckboxContainer>
        </FormGroup>

        <ButtonGroup>
          <SaveButton type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Configuración'}
          </SaveButton>
          
          <TestButton type="button" onClick={enviarEmailPrueba} disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Email de Prueba'}
          </TestButton>
        </ButtonGroup>
      </Form>

      {message && (
        <Message type={messageType}>
          {message}
        </Message>
      )}

      <InfoSection>
        <InfoTitle>📧 Información sobre el Sistema de Email</InfoTitle>
        <InfoList>
          <InfoItem>
            <strong>Reportes Automáticos:</strong> Al cerrar la caja del día, se envía automáticamente un email con todas las tablas de caja.
          </InfoItem>
          <InfoItem>
            <strong>Auditoría de Cambios:</strong> El email incluye un registro de todos los cambios realizados por usuarios en las tablas de caja.
          </InfoItem>
          <InfoItem>
            <strong>Configuración Gmail:</strong> Para usar Gmail, necesitas activar la verificación en 2 pasos y generar una contraseña de aplicación.
          </InfoItem>
          <InfoItem>
            <strong>Prueba:</strong> Usa el botón "Enviar Email de Prueba" para verificar que la configuración funciona correctamente.
          </InfoItem>
        </InfoList>
      </InfoSection>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h2`
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 2rem;
`;

const Description = styled.p`
  color: #7f8c8d;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const Form = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #667eea;
`;

const CheckboxLabel = styled.label`
  font-weight: 500;
  color: #2c3e50;
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const SaveButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TestButton = styled.button`
  background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(39, 174, 96, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-weight: 500;
  
  ${props => props.type === 'success' && `
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  `}
  
  ${props => props.type === 'error' && `
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  `}
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
  font-size: 1.1rem;
`;

const InfoSection = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid #667eea;
`;

const InfoTitle = styled.h3`
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.3rem;
`;

const InfoList = styled.ul`
  list-style: none;
  padding: 0;
`;

const InfoItem = styled.li`
  margin-bottom: 0.8rem;
  padding-left: 1rem;
  position: relative;
  line-height: 1.6;
  color: #555;

  &:before {
    content: "•";
    color: #667eea;
    font-weight: bold;
    position: absolute;
    left: 0;
  }
`;

export default ConfiguracionEmail; 