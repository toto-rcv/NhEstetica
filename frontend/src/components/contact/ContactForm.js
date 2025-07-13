import React, { useState } from 'react';
import styled from 'styled-components';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    mensaje: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/consulta/crear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Consulta enviada correctamente');
        setMessageType('success');
        // Limpiar formulario
        setFormData({
          nombre: '',
          apellido: '',
          email: '',
          mensaje: ''
        });
      } else {
        setMessage(data.message || 'Error al enviar la consulta');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error al enviar consulta:', error);
      setMessage('Error de conexión. Por favor intenta nuevamente.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <TopLeftImage src="/contacto/FlowerContact.png" alt="Decoración izquierda" />
      <BottomRightImage src="/contacto/WomanContact.png" alt="Decoración derecha" />

      <Section>
        <Subtitle>Envíanos un mensaje</Subtitle>
        <Title>HACÉ TU CONSULTA</Title>
        
        {message && (
          <MessageContainer type={messageType}>
            {message}
          </MessageContainer>
        )}

        <FormContainer onSubmit={handleSubmit}>
          <Input 
            type="text" 
            name="nombre" 
            placeholder="Nombre" 
            value={formData.nombre}
            onChange={handleChange} 
            required 
            disabled={loading}
          />
          <Input 
            type="text" 
            name="apellido" 
            placeholder="Apellido" 
            value={formData.apellido}
            onChange={handleChange} 
            required 
            disabled={loading}
          />
          <Input 
            type="email" 
            name="email" 
            placeholder="Correo Electrónico" 
            value={formData.email}
            onChange={handleChange} 
            required 
            disabled={loading}
          />
          <Textarea 
            name="mensaje" 
            placeholder="Mensaje" 
            rows="4" 
            value={formData.mensaje}
            onChange={handleChange} 
            required 
            disabled={loading}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'ENVIANDO...' : 'ENVIAR'}
          </Button>
        </FormContainer>
      </Section>
    </Wrapper>
  );
};

export default ContactForm;

// Styled Components

const Section = styled.section`
  background: var(--background-color);
  text-align: center;
  padding: 6rem 2rem;

  @media (max-width: 768px) {
    padding: 3rem 2rem;
  }
`;

const Subtitle = styled.p`
  color: var(--terciary-color);
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Title = styled.h2`
  font-size: 1.9rem;
  font-family: var(--heading-font);
  font-weight: 400;
  color: var(--text-color);
  margin-bottom: 2rem;
  margin-top: 0;
`;

const MessageContainer = styled.div`
  padding: 1rem;
  margin: 1rem auto;
  max-width: 600px;
  border-radius: 6px;
  font-weight: 500;
  background-color: ${props => props.type === 'success' ? '#d4edda' : '#f8d7da'};
  color: ${props => props.type === 'success' ? '#155724' : '#721c24'};
  border: 1px solid ${props => props.type === 'success' ? '#c3e6cb' : '#f5c6cb'};
`;

const FormContainer = styled.form`
    border: 2px solid var(--primary-color);
    border-radius: 10px;
    max-width: 600px;
    margin: 0 auto;
    padding: 4rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
`;

const Input = styled.input`
  padding: 0.8rem 1rem;
  border: 1px solid #eee;
  border-radius: 6px;
  font-family: var(--text-font);
  font-size: 1rem;
  
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const Textarea = styled.textarea`
  padding: 0.8rem 1rem;
  border: 1px solid #eee;
  font-family: var(--text-font);
  border-radius: 6px;
  font-size: 1rem;
  resize: vertical;
  
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const Button = styled.button`
  background: var(--primary-color);
  border: 1px solid #ad5c84;
  padding: 0.9rem;
  font-weight: normal;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: var(--heading-font);
  text-transform: uppercase;
  font-size: 1.05rem;

  &:hover:not(:disabled) {
    background: var(--terciary-color);
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const Wrapper = styled.div`
  position: relative;
  overflow: visible;
`;

const TopLeftImage = styled.img`
  position: absolute;
  top: -68px;
  left: 30px;
  max-width: 200px;
  height: auto;
  z-index: 1;
  pointer-events: none;
  filter: drop-shadow(0px 4px 4px rgba(224, 117, 212, 0.5)); 

  
  @media (max-width: 768px) {
    width: 70px;
    top: -50px;
  }

  @media (min-width: 768px) and (max-width: 1200px) {
    max-width: 120px;
    bottom: -30px;
}
`;

const BottomRightImage = styled.img`
  position: absolute;
  bottom: 30px;
  right: 30px;
  max-width: 200px;
  height: auto;
  z-index: 1;
  pointer-events: none;
  filter: drop-shadow(0px 4px 4px rgba(224, 117, 212, 0.5));

  @media (max-width: 768px) {
    display: none;
  }

  @media (min-width: 768px) and (max-width: 1200px) {
    max-width: 80px;
    bottom: -30px;
}
`;
