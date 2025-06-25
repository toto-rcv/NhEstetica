import React from 'react';
import styled from 'styled-components';
import TablasLayout from '../../components/tablas/TablasLayout';

const Inicio = () => {
  return (
    <TablasLayout title="Panel de Administración">
      <WelcomeContainer>
        <WelcomeTitle>Bienvenido al Panel de Administración</WelcomeTitle>
        <WelcomeText>
          Selecciona una opción del menú superior para gestionar los diferentes aspectos del sistema.
        </WelcomeText>
      </WelcomeContainer>
    </TablasLayout>
  );
};

export default Inicio; 

const WelcomeContainer = styled.div`
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const WelcomeTitle = styled.h2`
  color: #333;
  margin-bottom: 1rem;
  font-size: 2rem;
`;

const WelcomeText = styled.p`
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
`;