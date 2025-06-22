import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  text-align: center;
  max-width: 400px;
  width: 90%;
`;

const ModalTitle = styled.h2`
  color: #333;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: 600;
`;

const ModalMessage = styled.p`
  color: #666;
  margin-bottom: 25px;
  font-size: 16px;
  line-height: 1.5;
`;

const UserInfo = styled.div`
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 25px;
  border-left: 4px solid #28a745;
`;

const Username = styled.span`
  font-weight: 600;
  color: #28a745;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const LogoutButton = styled(Button)`
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  
  &:hover {
    box-shadow: 0 5px 15px rgba(220, 53, 69, 0.4);
  }
`;

const CloseButton = styled(Button)`
  background: #6c757d;
  color: white;
  
  &:hover {
    background: #5a6268;
    box-shadow: 0 5px 15px rgba(108, 117, 125, 0.4);
  }
`;

const LoginModal = ({ isOpen, onClose, onLogout, username }) => {
  if (!isOpen) return null;

  const handleLogout = () => {
    onLogout();
    onClose();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalTitle>¡Bienvenido!</ModalTitle>
        
        <ModalMessage>
          Has iniciado sesión correctamente en el sistema.
        </ModalMessage>
        
        <UserInfo>
          <p>
            Usuario: <Username>{username}</Username>
          </p>
        </UserInfo>
        
        <ButtonGroup>
          <LogoutButton onClick={handleLogout}>
            Desloguearse
          </LogoutButton>
          <CloseButton onClick={onClose}>
            Cerrar
          </CloseButton>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

export default LoginModal; 