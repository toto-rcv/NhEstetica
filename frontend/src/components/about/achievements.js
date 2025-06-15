import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClockRotateLeft, faWandMagicSparkles, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import AnimatedNumber from './extensions/AnimatedNumber';

function Achievements() {
  return (
    <Container>
      <Item>
        <Icon><FontAwesomeIcon icon={faClockRotateLeft} /></Icon>
        <Content>
          <BigText>
            <AnimatedNumber from={0} to={11} duration={3} separator="." /> AÑOS
          </BigText>
          <SmallText>De experiencia</SmallText>
        </Content>
      </Item>
      <Item>
        <Icon><FontAwesomeIcon icon={faWandMagicSparkles} /></Icon>
        <Content>
          <BigText>
            <AnimatedNumber from={0} to={20} duration={3} separator="." suffix="+" />
          </BigText>
          <SmallText>tratamientos</SmallText>
        </Content>
      </Item>
      <Item>
        <Icon><FontAwesomeIcon icon={faUserCheck} /></Icon>
        <Content>
          <BigText>
            <AnimatedNumber from={0} to={35000} duration={1} separator="." suffix="+" />
          </BigText>
          <SmallText>clientes satisfechos</SmallText>
        </Content>
      </Item>
    </Container>
  );
}

export default Achievements;

// styled-components CORREGIDOS CON BACKTICKS
const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: linear-gradient(
    90deg,
    rgba(224, 117, 212, 0.3) 0%,
    rgba(255, 121, 177, 0.3) 25%,
    var(--secondary-color) 75%,
    rgba(224, 117, 212, 0.3) 100%
  );
  padding: 3rem 8rem;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 2rem 3rem;
    gap: 0;
  }
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 1rem 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);

    &:last-child {
      border-bottom: none;
    }
  }
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

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
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
