import React from 'react';
import styled from 'styled-components';

const ModalCerrarCaja = ({ isOpen, onClose, onConfirmar, montoCierre }) => {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Header>
          <h2>Cerrar Caja</h2>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </Header>
        
        <Content>
          <Icon>⚠️</Icon>
          <Message>
            ¿Estás seguro/a que querés cerrar la caja?
          </Message>
          <Details>
            <strong>Monto de cierre: ${montoCierre}</strong>
          </Details>
          <Warning>
            Esta acción no se puede deshacer.
          </Warning>
        </Content>

        <Footer>
          <CancelButton onClick={onClose}>Cancelar</CancelButton>
          <ConfirmButton onClick={onConfirmar}>Sí, cerrar caja</ConfirmButton>
        </Footer>
      </ModalContainer>
    </Overlay>
  );
};

export default ModalCerrarCaja;

// Styled Components
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 0;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #eee;

  h2 {
    margin: 0;
    color: #333;
    font-size: 1.5rem;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  
  &:hover {
    color: #333;
  }
`;

const Content = styled.div`
  padding: 24px;
  text-align: center;
`;

const Icon = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;
`;

const Message = styled.p`
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 16px;
  line-height: 1.5;
`;

const Details = styled.div`
  background: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 1.1rem;
  color: #2c5aa0;
`;

const Warning = styled.p`
  color: #e74c3c;
  font-size: 0.9rem;
  margin: 0;
  font-style: italic;
`;

const Footer = styled.div`
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #eee;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
`;

const CancelButton = styled(Button)`
  background: #6c757d;
  color: white;

  &:hover {
    background: #5a6268;
    transform: translateY(-1px);
  }
`;

const ConfirmButton = styled(Button)`
  background: #e74c3c;
  color: white;

  &:hover {
    background: #c0392b;
    transform: translateY(-1px);
  }
`; 