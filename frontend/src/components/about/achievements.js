import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClockRotateLeft, faWandMagicSparkles, faUserCheck } from '@fortawesome/free-solid-svg-icons';

function Achievements() {
  return (
    <Container>
      <Item>
        <Icon><FontAwesomeIcon icon={faClockRotateLeft} /></Icon>
        <Content>
          <BigText>11 AÑOS</BigText>
          <SmallText>De experiencia</SmallText>
        </Content>
      </Item>
      <Divider />
      <Item>
        <Icon><FontAwesomeIcon icon={faWandMagicSparkles} /></Icon>
        <Content>
          <BigText>20+</BigText>
          <SmallText>tratamientos</SmallText>
        </Content>
      </Item>
      <Divider />
      <Item>
        <Icon><FontAwesomeIcon icon={faUserCheck} /></Icon>
        <Content>
          <BigText>35000+</BigText>
          <SmallText>clientes satisfechos</SmallText>
        </Content>
      </Item>
    </Container>
  );
}

export default Achievements;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(
    90deg,
    rgba(224, 117, 212, 0.3) 0%,
    rgba(255, 121,177, 0.3) 25%,
    var(--secondary-color) 75%,
    rgba(224, 117, 212, 0.3) 100%
  );
  padding: 3rem 8rem;
  gap: 2rem;
  flex-wrap: wrap;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 200px;
  justify-content: center;
`;

const Icon = styled.div`
  color: var(--terciary-color);
  font-size: 3rem;

  svg {
    font-size: 2.7rem;
  }
`;

const Content = styled.div`
  text-align: center;
  line-height: 1.3;
`;

const BigText = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--background-dark);
  font-family: "Saira", sans-serif;
`;

const SmallText = styled.div`
  font-size: 1rem;
  color: #555;
`;

const Divider = styled.div`
  width: 2px;
  height: 6vh;
  background-color: var(--background-dark);
  filter: opacity(0.3);

  @media (max-width: 768px) {
    display: none;
  }
`;
