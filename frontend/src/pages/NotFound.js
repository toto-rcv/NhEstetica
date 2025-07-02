import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--background-color) 0%, rgba(224, 117, 162, 0.1) 50%, rgba(224, 117, 212, 0.1) 100%);
  padding: 20px;
  text-align: center;
`;

const NotFoundCard = styled.div`
  background: white;
  padding: 60px 40px;
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(224, 117, 162, 0.2);
  max-width: 600px;
  border: 1px solid rgba(224, 117, 162, 0.1);
`;

const ErrorCode = styled.h1`
  font-size: 120px;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, var(--primary-color-dark) 0%, var(--terciary-color) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: var(--heading-font);
  line-height: 1;
`;

const Title = styled.h2`
  color: var(--primary-color-dark);
  margin: 20px 0;
  font-size: 32px;
  font-weight: 600;
  font-family: var(--heading-font);
`;

const Message = styled.p`
  color: #666;
  font-size: 18px;
  margin-bottom: 40px;
  line-height: 1.6;
  font-family: var(--text-font);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
`;

const HomeButton = styled(Link)`
  background: linear-gradient(135deg, var(--primary-color-dark) 0%, var(--terciary-color) 100%);
  color: white;
  padding: 14px 28px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  font-family: var(--text-font);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-block;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(224, 117, 162, 0.4);
  }
`;

const BackButton = styled.button`
  background: transparent;
  color: var(--primary-color-dark);
  padding: 14px 28px;
  border: 2px solid var(--primary-color-dark);
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  font-family: var(--text-font);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--primary-color-dark);
    color: white;
    transform: translateY(-2px);
  }
`;

const IconContainer = styled.div`
  font-size: 60px;
  margin-bottom: 20px;
  opacity: 0.7;
`;

function NotFound() {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <NotFoundContainer>
      <NotFoundCard>
        <IconContainer>🌸</IconContainer>
        <ErrorCode>404</ErrorCode>
        <Title>Página no encontrada</Title>
        <Message>
          Lo sentimos, la página que estás buscando no existe o no tienes permisos para acceder a ella.
          <br />
          ¿Te gustaría volver al inicio o regresar a la página anterior?
        </Message>
        <ButtonGroup>
          <HomeButton to="/">
            🏠 Ir al Inicio
          </HomeButton>
          <BackButton onClick={handleGoBack}>
            ⬅️ Página Anterior
          </BackButton>
        </ButtonGroup>
      </NotFoundCard>
    </NotFoundContainer>
  );
}

export default NotFound; 