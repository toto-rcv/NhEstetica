// components/tablas/ModalCaja.js
import React from 'react';
import styled from 'styled-components';

const ModalCaja = ({ isOpen, onClose, onGuardar }) => {
  const [montoInicial, setMontoInicial] = React.useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const valor = parseFloat(montoInicial);
    if (isNaN(valor) || valor < 0) {
      alert('El monto debe ser un número válido mayor o igual a 0');
      return;
    }
    onGuardar(valor);
    setMontoInicial('');
    onClose();
  };

  return (
    <Overlay>
      <ModalContainer>
        <h3>Agregar Importe Inicial de Caja</h3>
        <form onSubmit={handleSubmit}>
          <Input
            type="number"
            step="0.01"
            value={montoInicial}
            onChange={(e) => setMontoInicial(e.target.value)}
            required
          />
          <Button type="submit">Guardar</Button>
          <Button type="button" onClick={onClose} danger>
            Cancelar
          </Button>
        </form>
      </ModalContainer>
    </Overlay>
  );
};

export default ModalCaja;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContainer = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #e0f7fa 100%);
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
`;

const Input = styled.input`
  width: 90%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  border-radius: 10px;
  border: 2px solid #e2e8f0;
`;

const Button = styled.button`
  background-color: ${(props) => (props.danger ? '#e74c3c' : '#3498db')};
  color: white;
  border: none;
  padding: 10px 16px;
  margin-right: 0.5rem;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;
