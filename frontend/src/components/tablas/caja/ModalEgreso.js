import React, { useState } from 'react';
import styled from 'styled-components';

const ModalEgreso = ({ isOpen, onClose, onGuardar, fecha }) => {
  const [detalle, setDetalle] = useState('');
  const [formaPago, setFormaPago] = useState('');
  const [importe, setImporte] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!detalle || !formaPago || !importe) {
      alert('Completa todos los campos');
      return;
    }
    onGuardar({
      detalle,
      forma_pago: formaPago,
      importe: parseFloat(importe),
      fecha: fecha,  // Uso la fecha que viene del padre
    });
    setDetalle('');
    setFormaPago('');
    setImporte('');
  };

  const handleClose = () => {
    setDetalle('');
    setFormaPago('');
    setImporte('');
    onClose();
  };

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={handleClose} title="Cerrar">&times;</CloseButton>
        <ModalTitle>Agregar Egreso</ModalTitle>
        <FormContainer>
          <form onSubmit={handleSubmit} autoComplete="off">
            <Field>
              <Label>Detalle*</Label>
              <Input
                value={detalle}
                onChange={e => setDetalle(e.target.value)}
                placeholder="Detalle del egreso"
              />
            </Field>

            <Field>
              <Label>Forma de Pago*</Label>
              <Select
                value={formaPago}
                onChange={e => setFormaPago(e.target.value)}
              >
                <option value="">Selecciona una opción</option>
                <option value="Débito">Débito</option>
                <option value="Mercado Pago">Mercado Pago</option>
                <option value="Crédito">Crédito</option>
                <option value="Efectivo">Efectivo</option>
              </Select>
            </Field>

            <Field>
              <Label>Importe*</Label>
              <Input
                type="number"
                step="0.01"
                value={importe}
                onChange={e => setImporte(e.target.value)}
                placeholder="0.00"
              />
            </Field>

            <ButtonGroup>
              <AddButton type="submit">Guardar</AddButton>
              <CancelButton type="button" onClick={handleClose}>Cancelar</CancelButton>
            </ButtonGroup>
          </form>
        </FormContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ModalEgreso;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.4s ease-out;
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #e0f7fa 100%);
  padding: 40px 40px 30px 40px;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1);
  text-align: center;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideIn 0.5s cubic-bezier(0.34,1.56,0.64,1);
  border: 1px solid rgba(255,255,255,0.2);

  @keyframes slideIn {
    0% { transform: scale(0.8) translateY(-20px); opacity: 0; }
    100% { transform: scale(1) translateY(0); opacity: 1; }
  }

  @media (max-width: 768px) {
    padding: 30px 25px 25px 25px;
    max-width: 95%;
    border-radius: 15px;
  }

  @media (max-width: 480px) {
    padding: 25px 20px 20px 20px;
    max-width: 98%;
    border-radius: 12px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 20px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 18px;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(255,107,107,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(255,107,107,0.4);
  }

  @media (max-width: 600px) {
    top: 10px;
    right: 15px;
    width: 28px;
    height: 28px;
    font-size: 16px;
  }
`;

const ModalTitle = styled.h2`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 800;
  text-align: center;
  letter-spacing: 0.5px;
  font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
  }

  @media (max-width: 600px) {
    font-size: 24px;
    margin-bottom: 25px;
  }
  @media (max-width: 400px) {
    font-size: 20px;
    margin-bottom: 20px;
  }
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  text-align: left;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const Field = styled.div`
  margin-bottom: 20px;
  width: 100%;

  @media (max-width: 768px) {
    margin-bottom: 18px;
  }

  @media (max-width: 480px) {
    margin-bottom: 16px;
  }
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #2d3748;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  @media (max-width: 600px) {
    font-size: 13px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  background: #ffffff;
  transition: all 0.3s ease;
  font-family: inherit;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  box-sizing: border-box;

  &:focus {
    border: 2px solid #667eea;
    outline: none;
    box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
    transform: translateY(-1px);
  }

  &::placeholder {
    color: #a0aec0;
  }

  @media (max-width: 768px) {
    font-size: 15px;
    padding: 12px 16px;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 10px 14px;
    border-radius: 8px;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  background: #ffffff;
  transition: all 0.3s ease;
  font-family: inherit;
  box-sizing: border-box;

  &:focus {
    border: 2px solid #667eea;
    outline: none;
    box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
    transform: translateY(-1px);
  }

  &::placeholder {
    color: #a0aec0;
  }

  @media (max-width: 768px) {
    font-size: 15px;
    padding: 12px 16px;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 10px 14px;
    border-radius: 8px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 30px;
  width: 100%;

  @media (max-width: 768px) {
    gap: 12px;
    margin-top: 25px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;

    button {
      width: 100%;
      justify-content: center;
    }
  }
`;

const AddButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(102,126,234,0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 140px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(102,126,234,0.4);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    font-size: 15px;
    padding: 14px 28px;
    min-width: 100px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 12px 24px;
    min-width: 100%;
  }
`;

const CancelButton = styled.button`
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  color: #4a5568;
  border: 2px solid #e2e8f0;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 140px;

  &:hover {
    background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
    color: #c53030;
    border-color: #feb2b2;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(254,178,178,0.3);
  }

  @media (max-width: 768px) {
    font-size: 15px;
    padding: 14px 28px;
    min-width: 120px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 12px 24px;
    min-width: 100%;
  }
`;
