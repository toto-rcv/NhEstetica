import React from 'react';
import styled from 'styled-components';
import TablasLayout from '../../components/tablas/TablasLayout';

const Container = styled.div`
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 1rem;
  font-size: 2rem;
`;

const Text = styled.p`
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const Caja = () => {
  return (
    <TablasLayout title="Gestión de Caja">
      <Container>
        <Title>Gestión de Caja</Title>
        <Text>
          Aquí podrás gestionar las operaciones de caja del establecimiento.
        </Text>
      </Container>
    </TablasLayout>
  );
};

export default Caja; 